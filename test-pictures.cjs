const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/dante/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {QUESTIONS}=require('./questions.js');
const report={started:new Date().toISOString(),checks:[],errors:[]};
(async()=>{let browser;try{
 browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1280,height:1000}});
 page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(process.env.TEST_URL||pathToFileURL(path.join(__dirname,'index.html')).href);
 for(let i=30;i<40;i++){
  await page.locator(`[data-jump="${i}"]`).click();assert.equal(await page.locator('#scene svg').count(),1);
  assert.equal(await page.locator('#scene svg').getAttribute('aria-label'),QUESTIONS[i].imageDescription);
  await page.locator('#prompt').click();if(i===30){await page.keyboard.press('t');await page.keyboard.press('f');}
  assert.equal(await page.locator('rt').first().isVisible(),true);
  assert.ok((await page.locator('#translation').textContent()).includes(QUESTIONS[i].statements[0].translation));
  assert.equal(await page.locator('#feedback').textContent(),'');
  await page.keyboard.press('r');await page.waitForFunction(()=>!lessonAudio.paused&&lessonAudio.currentTime>.05);
  await page.keyboard.press(QUESTIONS[i].statements[0].answer?'2':'1');await page.keyboard.press('Space');
  assert.match(await page.locator('#feedback').textContent(),/已加入错题本/);
 }
 report.checks.push('PASS: All 10 pictures render, translate, show kana, play audio, and record incorrect keyboard answers');
 await page.reload();assert.match(await page.locator('#questionNumber').textContent(),/40/);assert.equal(await page.locator('#wrongCount').textContent(),'10');
 report.checks.push('PASS: New question index 39 and all 10 mistakes survive reload');
 await page.locator('#wrongMode').click();assert.equal(await page.locator('#questionMap button').count(),10);
 assert.equal(await page.locator('#feedback').textContent(),'');await page.locator('#prompt').click();await page.keyboard.press('1');await page.keyboard.press('Space');
 assert.match(await page.locator('#feedback').textContent(),/回答正确/);assert.equal(await page.locator('#wrongCount').textContent(),'10');
 report.checks.push('PASS: Picture-only wrong review hides old answers and retains history after correction');
 await page.locator('#allMode').click();await page.locator('[data-jump="30"]').click();
 await page.screenshot({path:path.join(__dirname,'test-results','picture-desktop.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.locator('[data-jump="36"]').click();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.screenshot({path:path.join(__dirname,'test-results','picture-mobile.png'),fullPage:true});
 report.checks.push('PASS: Picture and translation fit 390px mobile width');
 assert.deepEqual(report.errors,[]);report.checks.push('PASS: No runtime errors');report.failed=0;
 }catch(e){report.failed=1;report.failure=e.stack;process.exitCode=1;}finally{if(browser)await browser.close();report.finished=new Date().toISOString();report.passed=report.checks.length;fs.writeFileSync(path.join(__dirname,'test-results',process.env.TEST_URL?'live-report.json':'pictures-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));}})();

