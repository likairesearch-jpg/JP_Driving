const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/dante/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {QUESTIONS}=require('./questions.js'),expected=require('./expected-answers.cjs');
const report={started:new Date().toISOString(),target:process.env.TEST_URL||'local file',checks:[],errors:[]};
const record=s=>report.checks.push('PASS: '+s);
(async()=>{let browser;try{
 assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,100);assert.equal(expected.length,100);
 browser=await chromium.launch({channel:'msedge',headless:true});report.browser=browser.version();
 const page=await browser.newPage({viewport:{width:1280,height:1000}});page.on('pageerror',e=>report.errors.push(e.message));page.on('dialog',d=>d.accept());
 await page.goto(process.env.TEST_URL||pathToFileURL(path.join(__dirname,'index.html')).href);
 const category=key=>page.locator(`[data-category="${key}"]`).click();
 for(const [key,total] of Object.entries({all:100,rules:67,signs:14,markings:10,hazards:9})){
  await category(key);assert.equal(await page.locator('#questionMap button').count(),total);
  assert.equal(await page.locator('#progress').textContent(),`0 / ${total}`);
 }
 record('All category counts and denominators match the 100-item bank');
 await category('rules');await page.locator('#prompt').click();await page.keyboard.press('2');await page.keyboard.press('Space');
 await category('signs');await page.locator('#prompt').click();await page.keyboard.press('1');await page.keyboard.press('Space');
 await category('rules');assert.match(await page.locator('#feedback').textContent(),/已加入错题本/);
 await category('signs');assert.match(await page.locator('#feedback').textContent(),/回答正确/);
 await page.locator('#newRound').click();assert.equal(await page.locator('#feedback').textContent(),'');
 await category('rules');assert.match(await page.locator('#feedback').textContent(),/已加入错题本/);
 record('Categories share answers; restarting one category preserves answers in another');
 await category('signs');await page.locator('#wrongMode').click();assert.equal(await page.locator('#empty').isVisible(),true);
 await category('rules');assert.equal(await page.locator('#questionMap button').count(),1);assert.equal(await page.locator('#feedback').textContent(),'');
 await page.locator('#prompt').click();await page.keyboard.press('1');await page.keyboard.press('Space');assert.match(await page.locator('#feedback').textContent(),/回答正确/);
 assert.equal(await page.locator('#wrongCount').textContent(),'1');record('Filtered wrong notebook handles empty categories and retains mistake history');
 await page.locator('#allMode').click();await category('hazards');await page.getByRole('button',{name:'第 100 题',exact:true}).click();
 await page.locator('#prompt').click();await page.keyboard.press('t');await page.keyboard.press('f');await page.reload();
 assert.match(await page.locator('#questionNumber').textContent(),/#100/);assert.equal(await page.locator('#translation').isVisible(),true);
 record('Category, last question, Chinese and furigana survive reload');
 await page.evaluate(()=>{const v=JSON.parse(localStorage.getItem('michishirube.v1'));delete v.category;v.index=39;v.mode='all';localStorage.setItem('michishirube.v1',JSON.stringify(v));});await page.reload();
 assert.equal(await page.locator('#questionMap button').count(),100);assert.match(await page.locator('#questionNumber').textContent(),/40/);assert.equal(await page.locator('#wrongCount').textContent(),'1');
 record('Pre-category v1 progress migrates without losing old answers or mistakes');
 const before=await page.evaluate(()=>localStorage.getItem('michishirube.v1'));const invalid=JSON.parse(before);invalid.category='unknown';
 await page.locator('#import').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(invalid))});
 await page.waitForFunction(()=>document.querySelector('#storageStatus').textContent.includes('导入失败'));assert.equal(await page.evaluate(()=>localStorage.getItem('michishirube.v1')),before);record('Invalid category imports rejected without changing saved progress');
 // Check every new item through actual rendering, keyboard grading and WAV playback.
 for(let i=40;i<100;i++){
  await page.locator(`[data-jump="${i}"]`).click();const q=QUESTIONS[i];
  assert.equal(await page.locator('#feedback').textContent(),'');
  assert.ok((await page.locator('#translation').textContent()).includes(q.type==='scene'?q.promptZh:q.statements[0].translation));
  assert.equal(await page.locator('rt').first().isVisible(),true);
  if(q.type!=='text'){assert.equal(await page.locator('#scene svg').count(),1);assert.ok(!(await page.locator('#scene').innerHTML()).includes('undefined'));}
  await page.locator('#prompt').click();await page.keyboard.press('r');await page.waitForFunction(()=>!lessonAudio.paused&&lessonAudio.currentTime>.05);
  const answers=Array.isArray(expected[i])?expected[i]:[expected[i]];
  for(let n=0;n<answers.length;n++){if(n)await page.keyboard.press('ArrowDown');await page.keyboard.press(answers[n]?'1':'2');}
  await page.keyboard.press('Space');assert.match(await page.locator('#feedback').textContent(),/回答正确/,q.id);
 }
 record('All 60 new items render, translate, show kana, play real audio and grade the independent keyboard answer key');
 await category('hazards');await page.locator('#newRound').click();await page.getByRole('button',{name:'第 95 题',exact:true}).click();
 await page.locator('#prompt').click();await page.keyboard.press('1');await page.keyboard.press('Space');assert.match(await page.locator('#notice').textContent(),/三条/);
 await page.keyboard.press('ArrowDown');await page.keyboard.press('1');await page.keyboard.press('ArrowDown');await page.keyboard.press('1');await page.keyboard.press('Space');
 assert.match(await page.locator('#feedback').textContent(),/本条答错/);record('New hazard scenes require all 3 answers and fail the group for one wrong statement');
 await category('signs');await page.getByRole('button',{name:'第 87 题',exact:true}).click();
 await page.screenshot({path:path.join(__dirname,'test-results','categories-desktop.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});await category('markings');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:path.join(__dirname,'test-results','categories-mobile.png'),fullPage:true});record('Category navigation and content fit desktop and 390px mobile');
 await page.setViewportSize({width:1280,height:1000});await category('all');
 // Contact sheet is a test-only artifact; it makes all new diagrams reviewable together.
 const diagrams=[];for(let i=80;i<100;i++){await page.locator(`[data-jump="${i}"]`).click();diagrams.push({id:QUESTIONS[i].id,html:await page.locator('#scene').innerHTML()});}
 await page.setContent('<html><meta charset="utf-8"><style>body{font-family:Arial;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;background:#f4f5ef}section{background:white;padding:8px}svg{width:100%;height:180px}figure{margin:0}figcaption{font-size:11px}h3{margin:0}</style>'+diagrams.map(d=>`<section><h3>${d.id}</h3>${d.html}</section>`).join('')+'</html>');
 await page.screenshot({path:path.join(__dirname,'test-results','new-diagrams.png'),fullPage:true});
 assert.deepEqual(report.errors,[]);record('No browser runtime errors');report.failed=0;
 }catch(e){report.failed=1;report.failure=e.stack;process.exitCode=1;}finally{if(browser)await browser.close();report.finished=new Date().toISOString();report.passed=report.checks.length;fs.writeFileSync(path.join(__dirname,'test-results',process.env.TEST_URL?'categories-live-report.json':'categories-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));}})();
