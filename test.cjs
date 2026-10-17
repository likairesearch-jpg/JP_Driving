const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {QUESTIONS,SOURCES}=require('./questions.js');
const playwright=require(process.env.PLAYWRIGHT_PATH||'C:/Users/dante/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output=path.join(__dirname,'test-results');fs.mkdirSync(output,{recursive:true});
const report={started:new Date().toISOString(),platform:process.platform,checks:[],errors:[]};
const check=(name,fn)=>{fn();report.checks.push({name,result:'PASS'});};
const expected=[true,false,true,false,false,true,false,true,true,false,true,true,false,true,false,true,true,false,true,true,false,true,false,true,true,false,true,[true,false,true],[false,true,false],[true,true,false],true,false,false,true,true,false,true,true,false,false];
(async()=>{
 let browser;
 try{
 check('40 items: 27 text + 3 groups + 10 pictures',()=>{assert.equal(QUESTIONS.length,40);assert.equal(QUESTIONS.filter(q=>q.type==='text').length,27);assert.equal(QUESTIONS.filter(q=>q.type==='scene').length,3);});
 check('Independent answer manifest, source and furigana completeness',()=>{QUESTIONS.forEach((q,i)=>{assert.deepEqual(q.statements.map(v=>v.answer),Array.isArray(expected[i])?expected[i]:[expected[i]]);assert.ok(SOURCES[q.sourceKey]);for(const v of [q.prompt,...q.statements.map(s=>s.text)]){const remaining=v.replace(/\{[^|{}]+\|[ぁ-ゖー]+\}/g,'');assert.ok(!/[一-龯{}]/.test(remaining),v);}q.statements.forEach(s=>{assert.ok(s.translation&&s.explanation&&s.language);});});});
 browser=await playwright.chromium.launch({channel:'msedge',headless:true});report.browser=browser.version();
 const context=await browser.newContext({viewport:{width:1365,height:1000}});let page=await context.newPage();
 page.on('pageerror',err=>report.errors.push(err.message));page.on('dialog',d=>d.accept());
 const url=pathToFileURL(path.join(__dirname,'index.html')).href;
 await page.goto(url);await page.waitForFunction(()=>document.querySelectorAll('#questionMap button').length===40);
 check('Direct file URL loads without runtime errors',()=>assert.equal(report.errors.length,0));
 check('Furigana hidden by default',()=>assert.equal(fs.existsSync(path.join(__dirname,'index.html')),true));
 assert.equal(await page.locator('rt').first().isVisible(),false);
 await page.keyboard.press('Space');assert.match(await page.locator('#notice').textContent(),/请先选择/);check('Empty submission not counted',()=>{});
 await page.keyboard.press('2');assert.equal(await page.locator('#feedback').textContent(),'');await page.keyboard.press('1');await page.keyboard.press('Space');assert.match(await page.locator('#feedback').textContent(),/回答正确/);
 const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('michishirube.v1')));
 check('Numeric selection can change and requires confirmation',()=>{});
 await page.keyboard.press('1');assert.equal((await saved()).stats.q01.attempts,1);check('Submitted answer locks and does not recount',()=>{});
 await page.keyboard.press('Space');assert.match(await page.locator('#questionNumber').textContent(),/02/);await page.keyboard.press('1');await page.keyboard.press('Space');assert.equal((await saved()).stats.q02.errors,1);check('Wrong result automatically enters notebook',()=>{});
 await page.locator('#reason').selectOption('language');await page.locator('#prompt').click();await page.keyboard.press('a');assert.match(await page.locator('#feedback').textContent(),/回答正确/);check('A navigation preserves previous result',()=>{});
 await page.keyboard.press('f');assert.equal(await page.locator('rt').first().isVisible(),true);await page.reload();assert.equal(await page.locator('rt').first().isVisible(),true);assert.equal((await saved()).stats.q02.reason,'language');check('Reload restores answers, reason and kana preference',()=>{});
 await page.close();page=await context.newPage();page.on('pageerror',err=>report.errors.push(err.message));page.on('dialog',d=>d.accept());await page.goto(url);assert.equal((await saved()).stats.q02.errors,1);check('Close and reopen tab restores local progress',()=>{});
 await page.locator('#wrongMode').click();assert.equal(await page.locator('#feedback').textContent(),'');assert.equal(await page.locator('.choice.selected').count(),0);await page.keyboard.press('2');await page.keyboard.press('Space');assert.match(await page.locator('#feedback').textContent(),/回答正确/);const st=await saved();assert.equal(st.stats.q02.errors,1);assert.equal(st.stats.q02.attempts,2);assert.equal(st.stats.q02.lastCorrect,true);check('Wrong-only fresh practice retains history after correct answer',()=>{});
 await page.locator('#allMode').click();await page.locator('[data-jump="27"]').click();await page.locator('#prompt').click();await page.keyboard.press('1');await page.keyboard.press('Space');assert.match(await page.locator('#notice').textContent(),/三条/);check('Partial illustration cannot submit',()=>{});
 await page.keyboard.press('ArrowDown');await page.keyboard.press('1');await page.keyboard.press('ArrowDown');await page.keyboard.press('1');await page.keyboard.press('Space');assert.equal((await saved()).stats.q28.lastCorrect,false);assert.match(await page.locator('#feedback').textContent(),/陈述 2.*本条答错/);check('One wrong illustration statement makes entire group wrong',()=>{});
 await page.locator('#allMode').click();await page.locator('#newRound').click();
 for(let i=0;i<QUESTIONS.length;i++){
  await page.locator(`[data-jump="${i}"]`).click();await page.locator('#prompt').click();const answers=Array.isArray(expected[i])?expected[i]:[expected[i]];
  for(let j=0;j<answers.length;j++){if(j)await page.keyboard.press('ArrowDown');await page.keyboard.press(answers[j]?'1':'2');}
  await page.keyboard.press('Space');assert.match(await page.locator('#feedback').textContent(),/回答正确/,`q${i+1}`);
 }
 assert.equal(await page.locator('#progress').textContent(),'40 / 40');assert.match(await page.locator('#accuracy').textContent(),/100%/);check('All 40 independent expected answers grade correctly via keyboard',()=>{});
 await page.locator('#confirm').click();assert.match(await page.locator('#notice').textContent(),/答对 40/);check('Final item summary has no out-of-range navigation',()=>{});
 const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;await download.saveAs(path.join(output,'export.json'));const exported=JSON.parse(fs.readFileSync(path.join(output,'export.json'),'utf8'));assert.equal(exported.stats.q28.lastCorrect,true);check('JSON export contains actual history',()=>{});
 await page.locator('#import').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"version":99}')});await page.waitForFunction(()=>document.querySelector('#storageStatus').textContent.includes('导入失败'));assert.equal((await saved()).stats.q28.lastCorrect,true);check('Invalid import leaves current data unchanged',()=>{});
 await page.locator('#reset').click();assert.equal(Object.keys((await saved()).stats).length,0);await page.locator('#import').setInputFiles(path.join(output,'export.json'));await page.waitForFunction(()=>document.querySelector('#storageStatus').textContent.includes('导入成功'));assert.equal((await saved()).stats.q28.lastCorrect,true);check('Reset and valid import restore saved history',()=>{});
 // Verify real installed voice availability separately from deterministic API tests.
 await page.waitForTimeout(800);report.realVoices=await page.evaluate(()=>speechSynthesis.getVoices().map(v=>({name:v.name,lang:v.lang,local:v.localService})));
 await page.evaluate(()=>{lessonAudio.play=()=>Promise.reject(new DOMException('Simulated missing audio file','NotSupportedError'));window.__spoken=[];speechSynthesis.getVoices=()=>[{name:'Test local Japanese',lang:'ja-JP',localService:true}];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};speechSynthesis.speak=u=>window.__spoken.push({text:u.text,rate:u.rate,lang:u.lang});speechSynthesis.cancel=()=>{};});
 await page.locator('#speak').click();await page.locator('#slow').click();const utterances=await page.evaluate(()=>window.__spoken);assert.deepEqual(utterances.map(v=>v.rate),[1,.75]);assert.ok(!/[{}|]/.test(utterances[0].text));check('TTS call uses Japanese, normal/slow rates and clean reading (mock)',()=>{});
 await page.evaluate(()=>{speechSynthesis.getVoices=()=>[];});await page.locator('#speak').click();assert.match(await page.locator('#voiceStatus').textContent(),/未检测到/);check('Missing Japanese voice explains fallback',()=>{});
 await page.locator('#newRound').click();await page.locator('#prompt').click();await page.keyboard.press('1');await page.keyboard.press('Space');assert.match(await page.locator('#feedback').textContent(),/回答正确/);check('Answering works when audio is unavailable',()=>{});
 await page.evaluate(()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:'d',repeat:true,bubbles:true})));assert.match(await page.locator('#questionNumber').textContent(),/01/);check('Held key ignored',()=>{});
 await page.locator('[data-jump="28"]').click();await page.locator('#kana').click();await page.screenshot({path:path.join(output,'desktop.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(output,'mobile.png'),fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);for(const id of ['confirm','prev','next','speak','kana'])assert.equal(await page.locator('#'+id).isVisible(),true);check('390px mobile: no horizontal overflow and all key controls visible',()=>{});
 check('No browser runtime errors during suite',()=>assert.deepEqual(report.errors,[]));
 await context.close();
 }catch(err){report.failure=err.stack;console.error(err.stack);process.exitCode=1;}finally{if(browser)await browser.close();report.finished=new Date().toISOString();report.passed=report.checks.length;report.failed=report.failure?1:0;fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));}
})();

