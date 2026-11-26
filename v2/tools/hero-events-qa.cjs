const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium,webkit}=require(process.env.LV_PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..'),results=[],errors=[];
const output=process.env.LV_QA_OUTPUT||path.resolve(root,'docs','review-latest');
fs.mkdirSync(output,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mp4':'video/mp4','.webm':'video/webm','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/v2\//,'');if(!name)name='index.html';
 const file=path.resolve(root,name);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 let stat;try{stat=fs.statSync(file);}catch{res.writeHead(404);return res.end();}
 if(!stat.isFile()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.setHeader('Accept-Ranges','bytes');
 let start=0,end=stat.size-1;
 if(req.headers.range){const match=/bytes=(\d+)-(\d*)/.exec(req.headers.range);if(match){start=Number(match[1]);end=match[2]?Math.min(end,Number(match[2])):end;if(start>end){res.writeHead(416);return res.end();}res.statusCode=206;res.setHeader('Content-Range','bytes '+start+'-'+end+'/'+stat.size);}}
 res.setHeader('Content-Length',end-start+1);fs.createReadStream(file,{start,end}).pipe(res);
});
let base;
async function playing(page){await page.waitForFunction(()=>{const v=document.getElementById('heroVideo');return v&&!v.paused&&v.currentTime>.1;},{},{timeout:15000});}
async function run(name,type,launchOptions){
 const browser=await type.launch({headless:true,...launchOptions});
 async function context(options={},skipModal=true){
  const c=await browser.newContext({viewport:{width:1440,height:1000},...options});
  if(skipModal)await c.addInitScript(()=>sessionStorage.setItem('lv_coming_seen','1'));
  const p=await c.newPage();p.on('pageerror',e=>errors.push(name+': '+e.message));return{c,p};
 }
 try{
  // Actual media decoder and actual automatic dialog, not a mocked video element.
  let {c,p}=await context({},false);await p.goto(base);await playing(p);
  await p.locator('#comingModal').waitFor({state:'visible'});assert(await p.locator('#heroVideo').evaluate(v=>v.paused));
  await p.locator('#comingModal [data-close]').click();await playing(p);results.push(name+': autoplay resumes after automatic dialog');
  await p.locator('#heroVideoToggle').click();assert(await p.locator('#heroVideo').evaluate(v=>v.paused));
  await p.evaluate(()=>{LV_UI.open(document.querySelector('#comingModal'));LV_UI.close();});await p.waitForTimeout(200);
  assert(await p.locator('#heroVideo').evaluate(v=>v.paused));await p.locator('#heroVideoToggle').click();await playing(p);results.push(name+': explicit pause survives dialog close');
  await p.locator('[data-lang=en]').click();assert.equal(await p.locator('#heroVideoToggle').innerText(),'Pause video');
  await p.evaluate(()=>document.querySelector('#events').scrollIntoView({behavior:'instant'}));await p.waitForTimeout(150);assert(await p.locator('#heroVideo').evaluate(v=>v.paused));
  const cards=await p.locator('.ev').evaluateAll(cards=>cards.map(c=>({title:c.querySelector('h4').textContent,file:c.querySelector('img').getAttribute('src')})));
  for(const [index,file] of [[1,'corporate'],[3,'conference'],[4,'presentation'],[5,'forum'],[7,'graduation'],[8,'cultural']])assert.equal(cards[index].file,'assets/img/events/'+file+'.webp');
  await p.addStyleTag({content:'*{transition-duration:0s!important;animation-duration:0s!important;scroll-behavior:auto!important}'});
  for(const card of await p.locator('.ev').all())await card.scrollIntoViewIfNeeded();
  await p.waitForFunction(()=>Array.from(document.querySelectorAll('.ev-image')).every(i=>i.complete&&i.naturalWidth>0));
  await p.locator('.ev-image').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
  await p.waitForFunction(()=>Array.from(document.querySelectorAll('.ev')).every(e=>e.classList.contains('is-in')));
  await p.locator('#egrid').screenshot({path:path.join(output,name+'-events-1440.png'),style:'.hdr{visibility:hidden}'});
  await p.setViewportSize({width:390,height:844});await p.locator('[data-lang=ru]').click();
  for(const card of await p.locator('.ev').all())await card.scrollIntoViewIfNeeded();
  await p.locator('.ev-image').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
  await p.waitForFunction(()=>Array.from(document.querySelectorAll('.ev')).every(e=>e.classList.contains('is-in')));
  await p.locator('#egrid').screenshot({path:path.join(output,name+'-events-390.png'),style:'.hdr{visibility:hidden}'});
  const overflow=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,elements:Array.from(document.querySelectorAll('body *')).map(el=>({name:el.tagName+'.'+el.className,left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right})).filter(r=>r.right>innerWidth+1||r.left<-1).slice(0,20)}));
  assert(overflow.scroll<=overflow.width,JSON.stringify(overflow));
  await p.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await playing(p);results.push(name+': scrolling back resumes; six event mappings; desktop/mobile layout');
  await c.close();
  ({c,p}=await context({viewport:{width:390,height:844},isMobile:true,hasTouch:true}));
  await p.goto(base);await playing(p);await p.locator('#heroVideoToggle').tap();assert(await p.locator('#heroVideo').evaluate(v=>v.paused));
  await p.locator('#heroVideoToggle').tap();await playing(p);
  await p.waitForFunction(()=>Array.from(document.querySelectorAll('.line>span')).every(el=>new DOMMatrix(getComputedStyle(el).transform).f===0));
  await p.screenshot({path:path.join(output,name+'-hero-mobile.png')});results.push(name+': mobile touch pause and resume with actual H.264 video');await c.close();
  // Reduced-motion and data-saver preferences must be respected until an explicit click.
  for(const pref of ['motion','data']){
   ({c,p}=await context(pref==='motion'?{reducedMotion:'reduce'}:{}));
   if(pref==='data')await c.addInitScript(()=>Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:true}}));
   await p.goto(base);await p.waitForTimeout(200);assert(await p.locator('#heroVideo').evaluate(v=>v.paused&&!v.getAttribute('src')));
   assert(await p.locator('.hero-video-fallback').isVisible());await p.locator('#heroVideoToggle').click();await playing(p);results.push(name+': '+pref+' preference has working manual playback');await c.close();
  }
  // Simulate only a browser-policy rejection; successful playback uses the real decoder.
  ({c,p}=await context());await c.addInitScript(()=>{
   const nativePlay=HTMLMediaElement.prototype.play;
   HTMLMediaElement.prototype.play=function(){if(this.id==='heroVideo'&&!window.allowHero)return Promise.reject(new DOMException('Autoplay denied','NotAllowedError'));return nativePlay.call(this);};
   document.addEventListener('click',e=>{if(e.target.closest('#heroVideoToggle'))window.allowHero=true;},true);
  });
  await p.goto(base);await p.waitForFunction(()=>document.querySelector('.vwrap').dataset.videoState==='blocked');
  await p.locator('#heroVideoToggle').click();await playing(p);results.push(name+': policy-blocked autoplay recovers on a real click');await c.close();
  // Fail the compatible MP4, then both MP4s, to exercise original MP4 and WebM fallback.
  for(const failedCount of [1,2,3]){
   ({c,p}=await context());let requests=0;
   await c.route('**/assets/video/hero*',async route=>{
    const u=route.request().url();let shouldFail=u.endsWith('hero-compatible.mp4')||(failedCount>=2&&u.endsWith('hero.mp4'))||(failedCount>=3&&u.endsWith('hero.webm'));
    if(shouldFail){requests++;await route.fulfill({status:404,body:'Unavailable'});}else await route.continue();
   });
   await p.goto(base);
   if(failedCount<3){await playing(p);const src=await p.locator('#heroVideo').evaluate(v=>v.currentSrc);assert(src.endsWith(failedCount===1?'hero.mp4':'hero.webm'));results.push(name+': real '+(failedCount===1?'MP4':'WebM')+' source fallback');}
   else{await p.waitForFunction(()=>document.querySelector('.vwrap').dataset.videoState==='error');assert(await p.locator('.hero-video-fallback').isVisible());assert(await p.locator('#heroVideoToggle').isVisible());const before=requests;await p.waitForTimeout(500);assert.equal(requests,before);assert(requests>=3&&requests<=6);results.push(name+': all-source failure shows poster and bounded retry');}
   await c.close();
  }
 }finally{await browser.close();}
}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port+'/v2/';
 try{
  await run('chromium',chromium,{executablePath:process.env.LV_CHROMIUM_PATH||'/usr/bin/chromium',args:JSON.parse(process.env.LV_CHROMIUM_ARGS||'["--no-sandbox"]')});
  if(process.env.LV_QA_WEBKIT==='1')await run('webkit',webkit,{});
  assert.equal(errors.length,0,errors.join('\n'));console.log(JSON.stringify({passed:results.length,results,errors},null,2));
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({passed:results.length,results,errors},null,2));
 }finally{server.close();}
})().catch(e=>{console.error(e.stack);process.exit(1);});
