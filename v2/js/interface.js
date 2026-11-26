(function () {
  'use strict';
  var $ = function(q){return document.querySelector(q);};
  var lang = function(){return window.LV_LANG || 'ru';};
  var t = function(k){return window.LV_COPY[lang()][k] || k;};
  var logo = '<div class="logo logo--lg"><img src="assets/img/leaf.png" alt="" class="logo__leaf" width="239" height="299"><span class="logo__txt"><b>LAKE VILLAGE</b><small>BELARUS</small></span></div>';
  var coming = document.createElement('div');
  coming.className = 'modal coming-modal'; coming.id='comingModal'; coming.hidden=true;
  coming.setAttribute('role','dialog'); coming.setAttribute('aria-modal','true'); coming.setAttribute('aria-labelledby','comingTitle');
  coming.innerHTML='<div class="coming-card"><button class="modal__x" data-close data-i18n-aria="close">×</button>'+logo+'<h2 id="comingTitle" data-i18n="coming_title"></h2><p data-i18n="coming_text"></p><a class="coming-follow" href="https://www.instagram.com/lakevillageblr/" target="_blank" rel="noopener"><span class="instagram-icon" aria-hidden="true">◎</span><span data-i18n="coming_follow"></span></a><a class="btn btn--gold" href="https://www.instagram.com/lakevillageblr/" target="_blank" rel="noopener" data-i18n="coming_cta"></a></div>';
  document.body.appendChild(coming);
  var active=null,previousFocus=null,oldOverflow='',background=[];
  function translate(){
    coming.querySelectorAll('[data-i18n]').forEach(function(el){el.textContent=t(el.dataset.i18n);});
    document.querySelectorAll('[data-close]').forEach(function(el){el.setAttribute('aria-label',t('close'));});
    $('#burger').setAttribute('aria-label',t('menu'));
    var film=$('#filmModal');if(film)film.setAttribute('aria-label',t('film_label'));
  }
  function focusables(){return active ? Array.from(active.querySelectorAll('button,a[href],input,textarea,select,[tabindex]:not([tabindex="-1"])')).filter(function(el){return !el.disabled&&!el.hidden&&el.getClientRects().length;}) : [];}
  function close(){
    if(!active)return;
    active.hidden=true;active.classList.remove('is-open');
    var video=active.querySelector('video');if(video)video.pause();
    background.forEach(function(entry){entry.el.inert=entry.inert;});
    background=[];active=null;document.body.style.overflow=oldOverflow;
    document.dispatchEvent(new Event('lv:modalclosed'));
    if(previousFocus&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});
  }
  function open(modal,trigger){
    if(active===modal)return;
    if(active)close();
    previousFocus=trigger||document.activeElement;oldOverflow=document.body.style.overflow;
    modal.hidden=false;modal.classList.add('is-open');active=modal;
    background=Array.from(document.body.children).filter(function(el){return el!==modal&&!['SCRIPT','STYLE'].includes(el.tagName);}).map(function(el){var entry={el:el,inert:el.inert};el.inert=true;return entry;});
    document.body.style.overflow='hidden';
    var items=focusables(); if(items.length)items[0].focus({preventScroll:true});else{modal.tabIndex=-1;modal.focus();}
    document.dispatchEvent(new Event('lv:modalopened'));
  }
  window.LV_UI={open:open,close:close,isOpen:function(){return !!active;}};
  document.addEventListener('click',function(e){
    var trigger=e.target.closest('[data-coming]');
    if(trigger){open(coming,trigger);try{sessionStorage.setItem('lv_coming_seen','1');}catch(err){}return;}
    if(e.target.closest('[data-close]'))close();
    if(active&&e.target===active)close();
    trigger=e.target.closest('[data-film]');
    if(trigger){var film=$('#filmModal'),video=$('#filmVideo');if(!video.src)video.src='assets/video/film.mp4';open(film,trigger);video.currentTime=0;video.play().catch(function(){});}
  });
  document.addEventListener('keydown',function(e){
    if(!active)return;
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();return;}
    if(e.key!=='Tab')return;
    var items=focusables();if(!items.length){e.preventDefault();return;}
    var first=items[0],last=items[items.length-1];
    if(e.shiftKey&&(document.activeElement===first||!active.contains(document.activeElement))){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&(document.activeElement===last||!active.contains(document.activeElement))){e.preventDefault();first.focus();}
  });
  var seen=false;try{seen=sessionStorage.getItem('lv_coming_seen')==='1';}catch(err){}
  if(!seen){
    var show=function(){if(active||$('#nav').classList.contains('open')){setTimeout(show,1500);return;}open(coming);try{sessionStorage.setItem('lv_coming_seen','1');}catch(err){}};
    setTimeout(show,1800);
  }
  var form=$('#invForm'),draft='';
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var fields=form.elements, name=fields.namedItem('name'),contact=fields.namedItem('contact');
      [name,contact].forEach(function(el){el.setCustomValidity(el.value.trim()?'':(lang()==='ru'?'Заполните поле':'Please fill in this field'));});
      if(!form.reportValidity())return;
      var en=lang()==='en';
      draft=(en?'Lake Village — website enquiry\nName: ':'Lake Village — заявка с сайта\nИмя: ')+name.value.trim()+(en?'\nContact: ':'\nКонтакт: ')+contact.value.trim()+(fields.namedItem('msg').value.trim()?(en?'\nMessage: ':'\nСообщение: ')+fields.namedItem('msg').value.trim():'');
      var url='https://t.me/+375295773223?text='+encodeURIComponent(draft);
      $('#telegramDraft').href=url;$('#formFallback').hidden=false;$('#formOk').textContent=t('f_ok');$('#formOk').hidden=false;
      window.open(url,'_blank','noopener,noreferrer');
    });
    form.addEventListener('input',function(e){if(e.target.setCustomValidity)e.target.setCustomValidity('');$('#formOk').hidden=true;$('#formFallback').hidden=true;});
    $('#copyRequest').addEventListener('click',function(){navigator.clipboard.writeText(draft).then(function(){$('#formOk').textContent=t('f_copied');}).catch(function(){$('#formOk').textContent=t('f_copy_error');});});
  }
  var nav=$('#nav'),burger=$('#burger'),mobile=window.matchMedia('(max-width:1020px)');
  function syncMenu(){nav.inert=mobile.matches&&!nav.classList.contains('open');if(!mobile.matches){nav.classList.remove('open');burger.classList.remove('on');burger.setAttribute('aria-expanded','false');}}
  burger.addEventListener('click',syncMenu);nav.addEventListener('click',syncMenu);mobile.addEventListener('change',syncMenu);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');burger.classList.remove('on');burger.setAttribute('aria-expanded','false');syncMenu();burger.focus();}});
  document.addEventListener('lv:language',translate);translate();syncMenu();
})();
