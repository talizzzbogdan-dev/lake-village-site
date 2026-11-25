const fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert');
const {chromium}=require(process.env.LV_PLAYWRIGHT_MODULE || 'playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs','review');fs.mkdirSync(out,{recursive:true});
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.mp4':'video/mp4','.webm':'video/webm'};
const server=http.createServer((req,res)=>{let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/lake-village-site\//,'/');if(name==='/')name='/index.html';const f=path.resolve(root,'.'+name);if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(f,(e,bytes)=>{if(e){res.writeHead(404);return res.end('Missing file');}res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');res.end(bytes);});});
async function run(){
 await new Promise(r=>server.listen(4173,'127.0.0.1',r));const browser=await chromium.launch({headless:true,channel:'chrome'});
 const errors=[],missing=[],results=[];
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 async function serveLocal(route){const u=new URL(route.request().url());let name=decodeURIComponent(u.pathname).replace(/^\/lake-village-site\//,'/');if(name==='/')name='/index.html';const f=path.resolve(root,'.'+name);try{const body=fs.readFileSync(f);await route.fulfill({status:200,contentType:types[path.extname(f)]||'application/octet-stream',body});}catch(e){await route.fulfill({status:404,body:'Missing file'});}}
 await context.route('http://127.0.0.1:4173/**',serveLocal);const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await page.goto('http://127.0.0.1:4173/lake-village-site/');await page.waitForTimeout(2100);
 assert(await page.locator('#comingModal').isVisible(),'Automatic coming-soon modal');
 assert(await page.evaluate(()=>document.body.style.overflow==='hidden'),'Modal locks scrolling');
 await page.keyboard.press('Escape');assert(await page.locator('#comingModal').isHidden(),'Escape closes modal');
 await page.locator('[data-coming]').click();await page.keyboard.press('Shift+Tab');
 assert(await page.evaluate(()=>document.activeElement===document.querySelector('#comingModal .btn')),'Modal traps backward focus');
 await page.keyboard.press('Tab');assert(await page.evaluate(()=>document.activeElement===document.querySelector('#comingModal [data-close]')),'Modal traps forward focus');
 await page.screenshot({path:path.join(out,'coming-ru-1440.png')});await page.locator('#comingModal [data-close]').click();
 await page.reload();await page.waitForTimeout(2000);assert(await page.locator('#comingModal').isHidden(),'Once per session');
 assert(await page.locator('.ev-image').count()===9,'Nine event backgrounds');
 assert(await page.locator('.mp-marker').count()===11,'Ten numbered places plus beach');
 await page.locator('.mp-object').nth(6).click();assert(await page.locator('.mp-card h3').innerText()==='Дома Barnhouse');
 assert(await page.locator('.mp-marker').nth(6).getAttribute('aria-pressed')==='true');
 await page.locator('.mp-actions button').nth(0).click();assert(await page.locator('.mp-route input:checked').count()===9);
 await page.locator('.mp-actions button').nth(1).click();assert(await page.locator('.mp-route input:checked').count()===0);
 await page.locator('.mp-controls button').nth(0).click();assert((await page.locator('.mp-scale').innerText())==='135%');
 const beforePan=await page.locator('.mp-canvas').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).e);await page.locator('.mp-viewport').focus();await page.keyboard.press('ArrowRight');assert(await page.locator('.mp-canvas').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).e)<beforePan,'Keyboard pans the map');
 await page.locator('.mp-controls button').nth(3).click();assert(await page.locator('.mp-full').isVisible());await page.keyboard.press('Escape');assert(await page.locator('#masterplan .mp-shell').count()===1,'Map restored after fullscreen');
 await page.evaluate(()=>document.querySelector('#plan').scrollIntoView());await page.waitForTimeout(150);await page.screenshot({path:path.join(out,'masterplan-ru-1440.png')});
 await page.locator('[data-lang=en]').click();assert(await page.locator('.mp-card h3').innerText()==='Barnhouse houses');assert(await page.locator('[data-i18n=iv_title]').innerText()==='For investors and partners');
 await page.locator('a[data-i18n=nav_team]').click();await page.waitForLoadState('load');assert(await page.locator('html').getAttribute('lang')==='en');assert(await page.locator('h1').innerText()==='A team with a record of results');
 assert((await page.title()).startsWith('Our team'),'About page has its own translated title');
 await page.screenshot({path:path.join(out,'about-en-1440.png')});
 await page.locator('[data-lang=ru]').click();
 await page.goto('http://127.0.0.1:4173/lake-village-site/index.html#investors');
 await page.locator('input[name=name]').fill('Тестовая заявка');await page.locator('input[name=contact]').fill('@test_contact');await page.locator('textarea[name=msg]').fill('Проверка интерфейса без отправки.');
 await page.evaluate(()=>{window.__opened=[];window.open=(...args)=>{window.__opened.push(args);return null;};});
 await page.locator('#invForm button[type=submit]').click();let opened=await page.evaluate(()=>window.__opened);assert(opened[0][0].startsWith('https://t.me/+375295773223?text='));assert(decodeURIComponent(opened[0][0]).includes('Тестовая заявка'));assert((await page.locator('#formOk').innerText()).includes('ещё не отправлена'));assert(await page.locator('input[name=name]').inputValue()==='Тестовая заявка','Form data retained');
 for(const width of [1920,1440,1280,1024,768,390,360]){
  await page.setViewportSize({width,height:width<768?844:1000});
  for(const file of ['index.html','about.html']){
   await page.goto('http://127.0.0.1:4173/lake-village-site/'+file);await page.waitForTimeout(150);
   let overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert(overflow.scroll<=overflow.width,'Horizontal overflow at '+width+' '+file+' '+JSON.stringify(overflow));
   let broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')));assert(broken.length===0,'Broken images '+JSON.stringify(broken));
   if(file==='about.html'&&[1440,390].includes(width))await page.screenshot({path:path.join(out,'about-ru-'+width+'.png'),fullPage:true});
   if(file==='index.html'&&[1440,390].includes(width)){
    for(const id of ['team','events','investors','plan']){await page.evaluate(id=>document.getElementById(id).scrollIntoView(),id);await page.waitForTimeout(100);await page.screenshot({path:path.join(out,id+'-ru-'+width+'.png')});}
   }
   results.push({width,page:file,overflow:false,brokenImages:broken});
  }
 }
 await page.goto('http://127.0.0.1:4173/lake-village-site/');await page.locator('#burger').click();assert(await page.locator('#nav').evaluate(n=>!n.inert));await page.locator('#nav a[href="about.html"]').click();assert(page.url().endsWith('about.html'));
 const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});await touch.route('http://127.0.0.1:4173/**',serveLocal);await touch.addInitScript(()=>sessionStorage.setItem('lv_coming_seen','1'));const tp=await touch.newPage();await tp.goto('http://127.0.0.1:4173/lake-village-site/');await tp.locator('.mp-viewport').scrollIntoViewIfNeeded();await tp.locator('.mp-marker').nth(9).tap();assert(await tp.locator('.mp-card h3').innerText()==='Ресторанно-банкетный холл');
 const box=await tp.locator('.mp-viewport').boundingBox(),cdp=await touch.newCDPSession(tp),cx=box.x+box.width/2,cy=box.y+box.height/2;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx-30,y:cy,id:1},{x:cx+30,y:cy,id:2}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx-32,y:cy,id:1},{x:cx+32,y:cy,id:2}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx-60,y:cy,id:1},{x:cx+60,y:cy,id:2}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert(parseInt(await tp.locator('.mp-scale').innerText())>100,'Two-finger pinch zooms map');
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors,missing:[...new Set(missing)],checked:['coming modal/session/focus','map select/routes/zoom/fullscreen','RU/EN across pages','Telegram draft without sending','mobile menu','touch marker']},null,2));
 assert(errors.length===0,'JS errors: '+errors.join(', '));await browser.close();server.close();console.log(JSON.stringify({passed:results.length,errors,missing:[...new Set(missing)]}));
}
run().catch(e=>{console.error(e.stack);server.close();process.exit(1);});
