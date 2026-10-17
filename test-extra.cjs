const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/dante/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {pathToFileURL}=require('node:url');
const report={started:new Date().toISOString(),checks:[]};
const out=path.join(__dirname,'test-results');
(async()=>{let context;try{
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'driving-japanese-qa-'));
 report.temporaryProfile=profile;
 const url=pathToFileURL(path.join(__dirname,'index.html')).href;
 context=await chromium.launchPersistentContext(profile,{channel:'msedge',headless:true});let page=await context.newPage();await page.goto(url);
 await page.keyboard.press('2');await page.keyboard.press('Space');await page.keyboard.press('f');await context.close();
 context=await chromium.launchPersistentContext(profile,{channel:'msedge',headless:true});page=await context.newPage();await page.goto(url);
 assert.match(await page.locator('#feedback').textContent(),/错题本/);assert.equal(await page.locator('rt').first().isVisible(),true);report.checks.push('PASS: Closing and relaunching Edge restores file-URL progress and kana');
 await page.evaluate(()=>{window.confirm=()=>false});await page.locator('#reset').click();assert.match(await page.locator('#feedback').textContent(),/错题本/);report.checks.push('PASS: Cancelling reset preserves records');
 const before=await page.evaluate(()=>localStorage.getItem('michishirube.v1'));const invalid=JSON.parse(before);invalid.sessions.all.q01.picks=['malformed'];await page.locator('#import').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(invalid))});await page.waitForFunction(()=>document.querySelector('#storageStatus').textContent.includes('导入失败'));assert.equal(await page.evaluate(()=>localStorage.getItem('michishirube.v1')),before);report.checks.push('PASS: Malformed answer import rejected atomically');
 await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('QuotaExceededError')}});await page.locator('#kana').click();assert.match(await page.locator('#storageStatus').textContent(),/无法保存/);report.checks.push('PASS: Storage failure is visible and does not crash practice');
 await page.close();await context.close();context=null;
 // Screenshots of a clean first-use profile, without seeded user history.
 const browser=await chromium.launch({channel:'msedge',headless:true});context=await browser.newContext({viewport:{width:1365,height:1000}});page=await context.newPage();await page.goto(url);
 await page.screenshot({path:path.join(out,'first-use-desktop.png'),fullPage:true});await page.keyboard.press('f');await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,'first-use-mobile-kana.png'),fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));report.checks.push('PASS: First-use mobile furigana layout has no horizontal overflow');
 await page.setViewportSize({width:1365,height:1000});for(let i=27;i<30;i++){await page.locator(`[data-jump="${i}"]`).click();await page.screenshot({path:path.join(out,`scene-${i+1}.png`),fullPage:true});}
 await browser.close();context=null;
 report.passed=report.checks.length;report.failed=0;
 }catch(e){report.failed=1;report.failure=e.stack;process.exitCode=1;}finally{if(context)await context.close();report.finished=new Date().toISOString();fs.writeFileSync(path.join(out,'extra-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));}})();
