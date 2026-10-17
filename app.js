'use strict';
const KEY='michishirube.v1';
const $=id=>document.getElementById(id);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=s=>s.replace(/\{([^|{}]+)\|([^{}]+)\}/g,'$1');
const reading=s=>s.replace(/\{([^|{}]+)\|([^{}]+)\}/g,'$2');
const ruby=s=>escapeHTML(s).replace(/\{([^|{}]+)\|([^{}]+)\}/g,'<ruby>$1<rt>$2</rt></ruby>');
const initial=()=>({version:1,kana:false,zh:false,category:'all',mode:'all',index:0,stats:{},sessions:{all:{},wrong:{}},reviewIds:[]});
const questionById=new Map(QUESTIONS.map(q=>[q.id,q]));
function validate(value){
 if(!value||value.version!==1||typeof value.kana!=='boolean'||!['all','wrong'].includes(value.mode)||!Number.isInteger(value.index)||value.index<0||value.index>=QUESTIONS.length)throw Error('进度文件格式或版本不正确');
 if(!value.stats||typeof value.stats!=='object'||Array.isArray(value.stats)||!value.sessions||!Array.isArray(value.reviewIds)||value.reviewIds.length>QUESTIONS.length||new Set(value.reviewIds).size!==value.reviewIds.length||value.reviewIds.some(id=>!questionById.has(id)))throw Error('进度结构无效');
 if(value.zh!==undefined&&typeof value.zh!=='boolean')throw Error('中文显示设置无效');
 if(value.category!==undefined&&!Object.hasOwn(CATEGORIES,value.category))throw Error('考点分类无效');
 const clean=initial(); Object.assign(clean,{kana:value.kana,zh:value.zh??false,category:value.category??'all',mode:value.mode,index:value.index,reviewIds:[...value.reviewIds]});
 for(const [id,s] of Object.entries(value.stats)){
  if(!questionById.has(id)||!s||!Number.isSafeInteger(s.attempts)||s.attempts<1||!Number.isSafeInteger(s.errors)||s.errors<0||s.errors>s.attempts||typeof s.lastCorrect!=='boolean'||typeof s.lastTime!=='string'||!Number.isFinite(Date.parse(s.lastTime))||!['','language','rule','condition'].includes(s.reason))throw Error('作答记录无效');
  clean.stats[id]={attempts:s.attempts,errors:s.errors,lastCorrect:s.lastCorrect,lastTime:s.lastTime,reason:s.reason};
 }
 for(const mode of ['all','wrong']){
  if(!value.sessions[mode]||typeof value.sessions[mode]!=='object'||Array.isArray(value.sessions[mode]))throw Error('练习记录无效');
  for(const [id,s] of Object.entries(value.sessions[mode])){
   const q=questionById.get(id);
   if(!q||!s||!Array.isArray(s.picks)||s.picks.length!==q.statements.length||s.picks.some(p=>p!==null&&typeof p!=='boolean')||typeof s.submitted!=='boolean'||(s.submitted&&s.picks.includes(null)))throw Error('答案记录无效');
   if(s.submitted&&!clean.stats[id])throw Error('缺少作答统计');
   clean.sessions[mode][id]={picks:[...s.picks],submitted:s.submitted};
  }
 }
 if(clean.reviewIds.some(id=>!clean.stats[id]?.errors))throw Error('错题记录无效');
 return clean;
}
let state=initial(),storageMessage='';
try{const raw=localStorage.getItem(KEY);if(raw)state=validate(JSON.parse(raw));}catch{storageMessage='保存数据无法读取，已启用临时练习。导出当前进度以备份。';}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{storageMessage='浏览器无法保存进度，请在关闭前导出 JSON 备份。';}$('storageStatus').textContent=storageMessage||'进度只保存在本机浏览器；更换浏览器或移动文件前请导出。';}
let activeStatement=0;
function list(){const items=state.mode==='all'?QUESTIONS:state.reviewIds.map(id=>questionById.get(id));return items.filter(q=>state.category==='all'||q.category===state.category);}
function current(){return list()[state.index];}
function session(q=current()){if(!q)return null;return state.sessions[state.mode][q.id]??=( {picks:q.statements.map(()=>null),submitted:false});}
function isCorrect(q,s){return s.submitted&&q.statements.every((v,i)=>v.answer===s.picks[i]);}
function notice(text){$('notice').textContent=text;}
const lessonAudio=new Audio();
let speechGeneration=0;
function stopSpeech(){speechGeneration++;lessonAudio.pause();lessonAudio.currentTime=0;if('speechSynthesis' in window)speechSynthesis.cancel();voiceStatus();}
function sceneSVG(kind,revealed){
 const expanded=expandedSceneSVG(kind,revealed);if(expanded)return expanded;
 const base='<rect x="190" width="240" height="280" fill="#667c7b"/><path d="M310 0V280" stroke="#f8f0bd" stroke-width="4" stroke-dasharray="18 16"/><path d="M200 0V280M420 0V280" stroke="#fff" stroke-width="3"/>';
 const car=(x,y,color='#337fa0')=>`<g transform="translate(${x},${y})"><rect width="40" height="62" rx="9" fill="${color}" stroke="white" stroke-width="3"/><rect x="5" y="9" width="30" height="15" rx="3" fill="#cbe1e4"/><path d="M15 34l5-7 5 7" fill="none" stroke="white" stroke-width="2"/></g>`;
 let details='',label='',caption='';
 if(kind==='crossing'){
 label='无信号灯的人行横道，左侧行人准备过街，本车位于左侧车道。';
 details='<path d="M216 94v42M242 94v42M268 94v42M294 94v42M320 94v42M346 94v42M372 94v42M398 94v42" stroke="#fff" stroke-width="9"/><path d="M204 160h98" stroke="#fff" stroke-width="5"/><circle cx="163" cy="111" r="9" fill="#b85e39"/><path d="M163 120v23m0-13 16-7m-16 20-10 15m10-15 10 15" stroke="#b85e39" stroke-width="5" fill="none"/>'+car(232,196);
 caption='信号機なし · 歩行者が横断しようとしています';
 if(revealed)details+='<path d="M252 186v-14" stroke="#f8d572" stroke-width="5"/><text x="20" y="52" fill="#225d48" font-size="18">停车，让行人先通过</text>';
 }else if(kind==='rail'){
 label='铁路道口警报已响，栏杆开始下降，本车在道口前。';
 details='<path d="M0 80H620M0 105H620" stroke="#354d47" stroke-width="6"/><path d="M0 92H620" stroke="#526a62" stroke-width="35" stroke-dasharray="7 15"/>'+car(232,197)+'<path d="M200 173h100" stroke="white" stroke-width="4"/><path d="M188 155l106-22" stroke="#efc345" stroke-width="9"/><path d="M188 155l106-22" stroke="#222" stroke-width="9" stroke-dasharray="12 12"/><circle cx="166" cy="144" r="10" fill="#d64537"/><text x="20" y="45" fill="#354d47" font-size="17">警報：鳴っています</text>';
 caption='警報作動中 · 遮断機が降り始めています';
 if(revealed)details+='<text x="20" y="245" fill="#225d48" font-size="18">停止して待つ</text>';
 }else{
 label='雨天湿滑道路，蓝色本车跟随前方车辆，均在左侧车道。';
 details=car(232,48,'#8b9c73')+car(232,194)+'<path d="M40 40l-9 18m60-2-9 18m60-45-9 18m340 0-9 18m45 50-9 18m50-90-9 18m-470 100-9 18m490 30-9 18" stroke="#7ca4b7" stroke-width="3"/><ellipse cx="270" cy="154" rx="23" ry="8" fill="#9bbbc5"/>';
 caption='雨天 · 路面がぬれています';
 if(revealed)details+='<path d="M224 122v57m-7-48 7-9 7 9m-14 39 7 9 7-9" stroke="#f3d26d" stroke-width="3" fill="none"/><text x="20" y="245" fill="#225d48" font-size="18">减速，留足车距</text>';
 }
 return `<figure><svg viewBox="0 0 620 280" role="img" aria-label="${label}"><title>${label}</title>${base}${details}</svg><figcaption>${caption} · 原创示意图，非比例绘制</figcaption></figure>`;
}
function render(){
 const qs=list();state.index=Math.min(state.index,Math.max(0,qs.length-1));const q=current(),s=session(q);
 document.body.classList.toggle('show-kana',state.kana);$('kana').setAttribute('aria-pressed',state.kana);$('kana').innerHTML=`假名：${state.kana?'开':'关'} <kbd>F</kbd>`;
 $('chinese').setAttribute('aria-pressed',state.zh);$('chinese').innerHTML=`中文：${state.zh?'开':'关'} <kbd>T</kbd>`;
 $('allMode').classList.toggle('active',state.mode==='all');$('wrongMode').classList.toggle('active',state.mode==='wrong');
 $('wrongCount').textContent=Object.values(state.stats).filter(v=>v.errors>0).length;
 $('totalCount').textContent=QUESTIONS.length;
 $('categories').innerHTML=Object.entries(CATEGORIES).map(([key,label])=>{const items=QUESTIONS.filter(q=>(key==='all'||q.category===key)&&(state.mode==='all'||state.stats[q.id]?.errors>0));return `<button data-category="${key}" aria-pressed="${state.category===key}" class="${state.category===key?'active':''}">${label} <span>${items.length}</span></button>`;}).join('');
 $('categorySummary').textContent=`${CATEGORIES[state.category]} · ${qs.length}题${state.mode==='wrong'?' · 错题复习':''}。分类之间共享作答记录；危险预测每组3条全部正确才计为答对。`;
 const done=qs.filter(v=>state.sessions[state.mode][v.id]?.submitted),correct=done.filter(v=>isCorrect(v,state.sessions[state.mode][v.id]));
 $('progress').textContent=`${done.length} / ${qs.length}`;$('accuracy').textContent=done.length?`本轮正确率 ${Math.round(correct.length/done.length*100)}%`:'尚未作答';$('bar').style.width=`${qs.length?done.length/qs.length*100:0}%`;
 $('sideTitle').textContent=state.mode==='wrong'?'错题，再理解一次':'保持自己的节奏';
 $('empty').hidden=!!q;$('exercise').hidden=!q;$('newRound').disabled=!q;
 $('questionMap').innerHTML=qs.map((v,i)=>{const t=state.sessions[state.mode][v.id],number=Number(v.id.slice(1));return `<button aria-label="第 ${number} 题" ${i===state.index?'aria-current="true"':''} data-jump="${i}" class="${i===state.index?'current ':''}${t?.submitted?(isCorrect(v,t)?'correct':'incorrect'):''}">${number}</button>`;}).join('');
 $('questionNumber').textContent=q?`QUESTION ${String(state.index+1).padStart(2,'0')} / ${qs.length}`:'错题复习';$('questionType').textContent=q?(q.type==='scene'?'插图 · 三条判断':q.type==='picture'?'标志／标线 · 正误判断':'文字 · 正误判断'):'';
 if(q&&state.category!=='all')$('questionNumber').textContent=`${CATEGORIES[q.category]} ${state.index+1} / ${qs.length} · #${q.id.slice(1)}`;
 if(q)$('questionType').textContent=`${CATEGORIES[q.category]} · ${q.type==='scene'?'三条判断':'正误判断'}`;
 if(!q){$('history').textContent='每次提交的结果都会保存在本机。';return;}
 const h=state.stats[q.id];$('history').textContent=h?`累计作答 ${h.attempts} 次 · 错误 ${h.errors} 次。最近：${new Date(h.lastTime).toLocaleString('zh-CN')}。${h.lastCorrect?'最近一次已答对。':'最近一次待巩固。'}`:'选择后再确认。读懂条件，比快速作答更重要。';
 $('prompt').innerHTML=ruby(q.prompt);$('scene').innerHTML=q.picture?pictureSVG(q):q.scene?sceneSVG(q.scene,s.submitted):'';
 $('translation').hidden=!state.zh;
 $('translation').innerHTML=state.zh?`<strong>题意翻译 · 不含答案</strong><p>${escapeHTML(q.type==='scene'?q.promptZh:q.statements[0].translation)}</p>${q.type==='scene'?q.statements.map((v,i)=>`<p>${i+1}. ${escapeHTML(v.translation)}</p>`).join(''):''}`:'';
 $('hint').textContent=q.type==='scene'?'分别判断三条陈述，全部选择后统一提交。↑ / ↓ 切换当前陈述。':'判断这条日语陈述是否正确。数字键只选择，空格确认。';
 $('answers').innerHTML=q.statements.map((v,i)=>`<div class="${q.type==='scene'?'statement ':''}${i===activeStatement?'current':''}" data-statement="${i}">${q.type==='scene'?`<p lang="ja">${i+1}. ${ruby(v.text)}</p>`:''}<div class="choices" role="group" aria-label="陈述 ${i+1} 的答案">${[true,false].map((p,j)=>`<button class="choice ${s.picks[i]===p?'selected':''}" data-pick="${p}" data-row="${i}" aria-pressed="${s.picks[i]===p}" ${s.submitted?'disabled':''}>${p?'○ 对':'× 错'} <b>${j+1}</b></button>`).join('')}</div></div>`).join('');
 $('feedback').innerHTML=s.submitted?feedback(q,s):'';
 if($('reason'))$('reason').value=state.stats[q.id].reason;
 $('confirm').innerHTML=s.submitted?(state.index===qs.length-1?'查看本轮结果':'继续下一题 <kbd>Space</kbd>'):'确认答案 <kbd>Space</kbd>';
 $('prev').disabled=state.index===0;$('next').disabled=state.index===qs.length-1;notice('');
}
function feedback(q,s){const correct=isCorrect(q,s),h=state.stats[q.id],source=SOURCES[q.sourceKey];return `<div class="feedback-box ${correct?'':'wrong'}"><h3>${correct?'✓ 回答正确':'再看一遍，这题已加入错题本'}</h3>${q.statements.map((v,i)=>`<p><strong>${q.type==='scene'?`陈述 ${i+1} · `:''}正确答案：${v.answer?'○ 对':'× 错'}${s.picks[i]===v.answer?' ✓':' · 本条答错'}</strong></p><p>${escapeHTML(v.translation)}</p><p>${escapeHTML(v.explanation)}</p><p class="muted">日语提示：${escapeHTML(v.language)}</p>`).join('')}<p class="muted">${q.sourceType} · <a href="${source[1]}" target="_blank" rel="noopener noreferrer">${source[0]}</a></p>${!correct?`<label>可选：这次错在哪里？ <select id="reason"><option value="">暂不标记</option><option value="language">日语没读懂</option><option value="rule">规则不熟</option><option value="condition">看漏条件</option></select></label>`:''}</div>`;}
function renderSave(){render();if($('reason'))$('reason').value=state.stats[current().id].reason;save();}
function pick(row,value){const s=session();if(!s||s.submitted)return;document.activeElement?.blur();activeStatement=row;s.picks[row]=value;renderSave();}
function jump(i){const qs=list();if(i<0||i>=qs.length)return;stopSpeech();state.index=i;activeStatement=0;renderSave();}
function submit(){const q=current(),s=session();if(!q)return;if(s.submitted){if(state.index<list().length-1)jump(state.index+1);else{const done=list().filter(v=>state.sessions[state.mode][v.id]?.submitted);notice(`本轮已提交 ${done.length}/${list().length} 题，答对 ${done.filter(v=>isCorrect(v,state.sessions[state.mode][v.id])).length} 题。${done.length<list().length?'还有未作答题，可从题号返回。':'可重新练习或进入错题本。'}`);}return;}if(s.picks.includes(null)){notice(q.type==='scene'?'请先完成三条判断。':'请先选择答案。');return;}s.submitted=true;const correct=isCorrect(q,s),old=state.stats[q.id];state.stats[q.id]={attempts:(old?.attempts||0)+1,errors:(old?.errors||0)+(correct?0:1),lastCorrect:correct,lastTime:new Date().toISOString(),reason:old?.reason||''};renderSave();}
function switchMode(mode){stopSpeech();state.mode=mode;state.index=0;activeStatement=0;if(mode==='wrong'){state.reviewIds=QUESTIONS.filter(q=>state.stats[q.id]?.errors>0).sort((a,b)=>Date.parse(state.stats[a.id].lastTime)-Date.parse(state.stats[b.id].lastTime)).map(q=>q.id);state.sessions.wrong={};}renderSave();}
 $('categories').addEventListener('click',e=>{const button=e.target.closest('[data-category]');if(!button)return;stopSpeech();state.category=button.dataset.category;state.index=0;activeStatement=0;renderSave();});
function toggleKana(){state.kana=!state.kana;renderSave();}
function toggleChinese(){state.zh=!state.zh;renderSave();}
function voices(){return 'speechSynthesis' in window?speechSynthesis.getVoices().filter(v=>/^ja(?:-|_|$)/i.test(v.lang)&&v.localService):[];}
function voiceStatus(){if(!lessonAudio.paused)return;$('voiceStatus').textContent='已内置日语音频 · 离线播放 · 无需安装系统语音';}
function fallbackSpeech(rate){const v=voices();if(!v.length){$('voiceStatus').textContent='音频文件无法播放，且未检测到本机日语语音。请保留 audio 文件夹，并检查浏览器音量。';return;}const q=current();const text=reading(q.prompt)+(q.type==='scene'?'。'+q.statements.map((s,i)=>`${i+1}。${reading(s.text)}`).join('。'):'');const utterance=new SpeechSynthesisUtterance(text);utterance.lang='ja-JP';utterance.voice=v[0];utterance.rate=rate;utterance.onerror=e=>{if(!['canceled','interrupted'].includes(e.error))$('voiceStatus').textContent='朗读失败，请检查浏览器音量和音频文件。文字答题不受影响。';};utterance.onend=voiceStatus;speechSynthesis.speak(utterance);$('voiceStatus').textContent='正在使用本机日语语音朗读…';}
async function speak(rate=1){if(!current())return;stopSpeech();const generation=speechGeneration;lessonAudio.src=`audio/${current().id}.wav`;lessonAudio.playbackRate=rate;lessonAudio.preservesPitch=true;lessonAudio.onended=()=>{if(generation===speechGeneration)voiceStatus();};try{await lessonAudio.play();if(generation===speechGeneration)$('voiceStatus').textContent=rate<1?'正在慢速朗读 · 0.75×':'正在朗读日语…';}catch(error){if(generation!==speechGeneration)return;if(error.name==='NotAllowedError'){$('voiceStatus').textContent='浏览器阻止了播放，请点击朗读按钮并检查页面的声音权限。';return;}fallbackSpeech(rate);}}
$('answers').addEventListener('click',e=>{const b=e.target.closest('[data-pick]');if(b)pick(Number(b.dataset.row),b.dataset.pick==='true');else{const box=e.target.closest('[data-statement]');if(box){activeStatement=Number(box.dataset.statement);render();}}});
$('questionMap').addEventListener('click',e=>{const b=e.target.closest('[data-jump]');if(b)jump(Number(b.dataset.jump));});
$('feedback').addEventListener('change',e=>{if(e.target.id==='reason'){state.stats[current().id].reason=e.target.value;save();}});
$('prev').onclick=()=>jump(state.index-1);$('next').onclick=()=>jump(state.index+1);$('confirm').onclick=submit;$('kana').onclick=toggleKana;$('speak').onclick=()=>speak();$('slow').onclick=()=>speak(.75);
 $('chinese').onclick=toggleChinese;$('stopAudio').onclick=stopSpeech;
$('allMode').onclick=()=>switchMode('all');$('wrongMode').onclick=()=>switchMode('wrong');
$('newRound').onclick=()=>{if(!confirm('重新练习当前分类？此分类的本轮选项和反馈会清空，其他分类、累计历史及错题保留。'))return;stopSpeech();for(const q of list())delete state.sessions[state.mode][q.id];state.index=0;activeStatement=0;renderSave();};
document.addEventListener('keydown',e=>{
 if(e.repeat||e.isComposing||e.ctrlKey||e.metaKey||e.altKey||e.target.closest('input,select,textarea,[contenteditable="true"]'))return;
 const k=e.key.toLowerCase();if(!['a','d','r','f','t','1','2','arrowup','arrowdown',' '].includes(k))return;
 // Focused utility buttons keep their normal Space activation; quiz buttons use submit.
 if(k===' '&&e.target.closest('button,a,label')&&!e.target.closest('#answers,#confirm'))return;
 e.preventDefault();if(k==='a')jump(state.index-1);if(k==='d')jump(state.index+1);if(k==='r')speak();if(k==='f')toggleKana();if(k==='1'||k==='2')pick(activeStatement,k==='1');if(k===' ')submit();
 if(k==='t')toggleChinese();
 if((k==='arrowup'||k==='arrowdown')&&current()?.type==='scene'){activeStatement=Math.max(0,Math.min(2,activeStatement+(k==='arrowup'?-1:1)));render();$('answers').children[activeStatement].scrollIntoView({block:'nearest'});}
});
$('export').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='driving-japanese-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('import').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>1000000)throw Error('文件过大');const next=validate(JSON.parse(await file.text()));if(!confirm('用导入文件替换当前进度？建议先导出当前记录。'))return;stopSpeech();state=next;activeStatement=0;storageMessage='';renderSave();$('storageStatus').textContent='进度导入成功。';}catch(err){$('storageStatus').textContent=`导入失败，原有数据未修改：${err.message}`;}finally{e.target.value='';}};
$('reset').onclick=()=>{if(!confirm('清空全部进度、错题和设置？此操作不能撤销，请先导出备份。'))return;stopSpeech();state=initial();activeStatement=0;storageMessage='';renderSave();};
if('speechSynthesis' in window)speechSynthesis.addEventListener('voiceschanged',voiceStatus);
renderSave();voiceStatus();
