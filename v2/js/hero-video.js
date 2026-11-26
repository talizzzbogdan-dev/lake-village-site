/* A single owner for autoplay, dialogs, visibility and explicit user choice. */
(function () {
  'use strict';
  var video=document.getElementById('heroVideo'),hero=document.getElementById('hero');
  var toggle=document.getElementById('heroVideoToggle'),status=document.getElementById('heroVideoStatus');
  if(!video||!hero||!toggle)return;
  var wrapper=video.parentElement,motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  var connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  var userEnabled=false,userPaused=false,blocked=false,failed=false,pending=false;
  var current=0,assigned=false,ticket=0,failedSource='',hasFrame=false;
  var sources=Array.prototype.map.call(video.querySelectorAll('source'),function(source){
    return {src:source.getAttribute('src'),type:source.getAttribute('type')||''};
  }).filter(function(source){return source.src&&(!source.type||video.canPlayType(source.type)!=='');});
  var copy={
    ru:{play:'Включить фоновое видео',pause:'Остановить видео',retry:'Повторить запуск видео',loading:'Видео загружается.',blocked:'Нажмите «Включить фоновое видео», чтобы запустить его.',error:'Видео не загрузилось. Можно повторить запуск.',still:'Показана обложка. Видео можно включить вручную.'},
    en:{play:'Play background video',pause:'Pause video',retry:'Retry video',loading:'Video is loading.',blocked:'Press Play background video to start it.',error:'Video could not load. You can try again.',still:'Showing the cover image. You can play the video manually.'}
  };
  function text(){return copy[document.documentElement.lang==='en'?'en':'ru'];}
  function autoAllowed(){return !motion.matches&&!(connection&&connection.saveData);}
  function onScreen(){var r=hero.getBoundingClientRect();return r.bottom>0&&r.top<window.innerHeight;}
  function modalOpen(){return !!(window.LV_UI&&window.LV_UI.isOpen());}
  function wanted(){return !userPaused&&(userEnabled||autoAllowed())&&!document.hidden&&onScreen()&&!modalOpen();}
  function state(value,message){
    wrapper.dataset.videoState=value;wrapper.dataset.videoReady=hasFrame?'true':'false';
    toggle.hidden=false;toggle.textContent=!video.paused?text().pause:failed?text().retry:text().play;
    toggle.setAttribute('aria-label',toggle.textContent);toggle.setAttribute('aria-pressed',video.paused?'false':'true');
    if(status)status.textContent=message||'';
  }
  function quiet(){video.muted=true;video.defaultMuted=true;video.playsInline=true;video.setAttribute('muted','');video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');}
  function pause(){ticket++;pending=false;video.pause();state('paused');}
  function assign(){
    if(assigned)return true;
    if(!sources.length){failed=true;state('error',text().error);return false;}
    assigned=true;failedSource='';video.preload='auto';video.src=sources[current].src;video.load();return true;
  }
  function failSource(){
    if(!assigned||failedSource===sources[current].src)return;
    failedSource=sources[current].src;ticket++;pending=false;
    if(current+1<sources.length){
      current++;assigned=false;hasFrame=false;
      if(wanted())play(false);else state('paused');
    }else{failed=true;hasFrame=false;state('error',text().error);}
  }
  function rejected(error,id){
    if(id!==ticket)return;
    pending=false;
    if(error&&error.name==='NotAllowedError'){blocked=true;state('blocked',text().blocked);}
    else if(error&&error.name==='AbortError'){state('paused');}
    else{failSource();}
  }
  function play(manual){
    if(!wanted()||(!manual&&(blocked||failed||pending)))return;
    if(!video.paused){state('playing');return;}
    quiet();if(!assign())return;
    pending=true;var id=++ticket;state('loading',text().loading);
    // The manual play call stays inside the click handler for mobile Safari.
    try{
      var result=video.play();
      if(result&&typeof result.then==='function'){
        result.then(function(){
          if(id!==ticket)return;
          pending=false;if(!wanted()){pause();return;}
          blocked=false;failed=false;state(video.paused?'paused':'playing');
        }).catch(function(error){rejected(error,id);});
      }else{pending=false;}
    }catch(error){rejected(error,id);}
  }
  function sync(){
    if(!wanted()){if(!video.paused||pending)pause();return;}
    play(false);
  }
  toggle.addEventListener('click',function(){
    if(!video.paused&&!pending){userPaused=true;pause();return;}
    userEnabled=true;userPaused=false;blocked=false;
    if(failed){current=0;assigned=false;failed=false;hasFrame=false;}
    play(true);
  });
  video.addEventListener('playing',function(){
    if(!wanted()){pause();return;}
    pending=false;blocked=false;failed=false;hasFrame=true;state('playing');
  });
  video.addEventListener('pause',function(){if(!pending)state(blocked?'blocked':failed?'error':'paused');});
  video.addEventListener('error',failSource);
  video.addEventListener('canplay',function(){if(!pending)sync();});
  document.addEventListener('visibilitychange',sync);
  document.addEventListener('lv:modalopened',pause);
  document.addEventListener('lv:modalclosed',sync);
  document.addEventListener('lv:language',function(){state(wrapper.dataset.videoState||'idle',blocked?text().blocked:failed?text().error:'');});
  window.addEventListener('pageshow',sync);
  window.addEventListener('pagehide',pause);
  window.addEventListener('online',function(){if(failed){failed=false;current=0;assigned=false;sync();}});
  if(motion.addEventListener)motion.addEventListener('change',sync);else if(motion.addListener)motion.addListener(sync);
  if(connection&&connection.addEventListener)connection.addEventListener('change',sync);
  if('IntersectionObserver' in window)new IntersectionObserver(sync,{threshold:0}).observe(hero);
  else{window.addEventListener('scroll',sync,{passive:true});window.addEventListener('resize',sync);}
  video.autoplay=false;quiet();state('idle',autoAllowed()?'':text().still);sync();
})();
