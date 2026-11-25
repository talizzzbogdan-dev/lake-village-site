/* Percent coordinates on the existing 1440x1092 aerial image.
   Replace image + calibrate coordinates together when the new source is available.
   These are conceptual visitor routes, never engineering access documentation. */
(function(){
  'use strict';
  var host=document.getElementById('masterplan');if(!host)return;
  var names={
    ru:['Въездная группа','Парковка','Административный корпус / техническая зона','Вертолётная площадка','Детская площадка','Дома A-Frame','Дома Barnhouse','Пирс','Банкетная оранжерея','Ресторанно-банкетный холл','Пляжная зона'],
    en:['Entrance gate','Parking','Administration / service area','Helipad','Children’s playground','A-Frame houses','Barnhouse houses','Pier','Banquet orangery','Restaurant & banquet hall','Beach area']
  };
  var descriptions={
    ru:['Главный въезд на территорию комплекса.','Организованная парковка для гостей.','Административная и техническая инфраструктура проекта.','Концептуальная площадка. Реализация зависит от участка и необходимых согласований.','Пространство для семейного отдыха на территории комплекса.','7 домов A-Frame с панорамным остеклением, террасами и купелями на дровах.','7 домов Barnhouse с панорамным остеклением, террасами и купелями на дровах.','Выход к воде и пространство для прогулок и камерных событий.','Стеклянная оранжерея для свадеб и банкетов до 100 гостей.','Ресторанно-банкетный холл до 350 гостей с панорамным остеклением.','Зона отдыха у воды, предусмотренная концепцией комплекса.'],
    en:['The main entrance to the resort grounds.','Organised parking for visitors.','The project’s administration and technical facilities.','A conceptual helipad, subject to site suitability and required approvals.','A space for family leisure within the grounds.','7 A-Frame houses with panoramic glazing, terraces and wood-fired hot tubs.','7 Barnhouse houses with panoramic glazing, terraces and wood-fired hot tubs.','Access to the lake for walks and intimate events.','A glass orangery for weddings and banquets of up to 100 guests.','A restaurant and banquet hall for up to 350 guests with panoramic glazing.','A lakeside leisure area included in the resort concept.']
  };
  var ui={
    ru:{objects:'Объекты комплекса',routes:'Логистика и маршруты',all:'Все маршруты',none:'Скрыть маршруты',zoomIn:'Приблизить',zoomOut:'Отдалить',reset:'Сбросить',full:'Во весь экран',close:'Закрыть',map:'Интерактивный генеральный план',hint:'Масштаб: + / − или щипок. Перемещение: жест или клавиши со стрелками.',note:'Концептуальная схема. Не является утверждённой инженерной документацией.',draft:'Предварительная интерактивная схема на существующей визуализации. Новая основа и привязка маршрутов ожидают проверки.',beach:'П',routeNames:['Автомобильный маршрут','Пешеходный маршрут','Сервисный проезд','Гостевой доступ','К пирсу','К пляжу','К оранжерее','К ресторану','К вертолётной площадке']},
    en:{objects:'Places in the resort',routes:'Logistics & routes',all:'Show all',none:'Hide routes',zoomIn:'Zoom in',zoomOut:'Zoom out',reset:'Reset',full:'Full screen',close:'Close',map:'Interactive master plan',hint:'Zoom: + / − or pinch. Move: drag or use arrow keys.',note:'Conceptual plan. Not approved engineering documentation.',draft:'Preliminary interactive plan using the existing visualisation. The new base image and route alignment await review.',beach:'B',routeNames:['Car route','Pedestrian route','Service road','Guest access','To the pier','To the beach','To the orangery','To the restaurant','To the helipad']}
  };
  var positions=[[73,79],[82,64],[48,70],[11,80],[35,61],[15,40],[88,40],[49,30],[37,16],[66,15],[50,58]];
  var images=['v-arrival','v-parking','v-reception','v-aerial-heli','v-playground','aframe-fisher','v-barn-tub','v-pier-aerial','orangery','v-restaurant','pier-sunset'];
  // Paths follow the visible lower access road and lakeside paths.
  var walk='M 735 810 L 700 720 Q 660 650 590 620 L 520 610 Q 400 620 290 565 L 225 505 Q 165 475 175 425 L 240 265 Q 260 230 285 220 L 460 220 L 490 215 L 520 175 L 540 140';
  var paths=[
    'M 780 1000 L 755 865 L 735 810 L 720 770 L 725 710 L 755 670 L 805 640 L 940 630',
    walk,
    'M 735 810 Q 680 780 610 790 L 220 790 Q 175 785 180 755 L 205 715 L 230 665',
    'M 735 810 L 700 720 Q 660 650 590 620 L 520 610',
    walk+' M 490 215 L 490 300',
    'M 735 810 L 700 720 Q 660 650 590 620 L 520 610 L 500 580',
    walk+' M 370 220 L 370 195',
    walk+' M 540 140 L 550 200 L 650 215',
    'M 735 810 Q 680 780 610 790 L 220 790 L 150 800'
  ];
  var colors=['#f6f0e3','#e8c66b','#ee8170','#8fc78c','#67d4e4','#eab775','#ecb9e4','#b3a4f0','#d9a7ec'];
  var selected=0,visible=new Set([1]),scale=1,offset={x:0,y:0},pointers=new Map(),drag=null,pinch=null,moved=false;
  var shell=document.createElement('div');shell.className='mp-shell';host.appendChild(shell);
  var placeholder=document.createComment('masterplan-home');host.insertBefore(placeholder,shell);
  var fullscreen=document.createElement('div');fullscreen.className='mp-full';fullscreen.hidden=true;fullscreen.setAttribute('role','dialog');fullscreen.setAttribute('aria-modal','true');
  var close=document.createElement('button');close.className='modal__x';close.setAttribute('data-close','');close.textContent='×';fullscreen.appendChild(close);document.body.appendChild(fullscreen);
  var viewport,canvas;
  function lang(){return window.LV_LANG||'ru';}
  function label(){return ui[lang()];}
  function fit(){scale=1;offset={x:0,y:0};apply();}
  function apply(){
    if(!canvas||!viewport)return;
    var w=viewport.clientWidth,h=viewport.clientHeight;
    offset.x=Math.min(0,Math.max(w-w*scale,offset.x));offset.y=Math.min(0,Math.max(h-h*scale,offset.y));
    canvas.style.transform='translate('+offset.x+'px,'+offset.y+'px) scale('+scale+')';
    canvas.querySelectorAll('.mp-marker').forEach(function(marker){marker.style.transform='translate(-50%,-50%) scale('+(1/scale)+')';});
    var out=shell.querySelector('.mp-scale');if(out)out.textContent=Math.round(scale*100)+'%';
  }
  function zoom(f,cx,cy){
    var ns=Math.min(4,Math.max(1,scale*f)),factor=ns/scale;
    offset.x=cx-(cx-offset.x)*factor;offset.y=cy-(cy-offset.y)*factor;scale=ns;apply();
  }
  function card(){
    var area=shell.querySelector('.mp-card');area.innerHTML='';
    var img=document.createElement('img');img.src='assets/img/'+images[selected]+'.webp';img.alt='';img.loading='lazy';
    var div=document.createElement('div'),h=document.createElement('h3'),p=document.createElement('p');
    h.textContent=names[lang()][selected];p.textContent=descriptions[lang()][selected];div.append(h,p);area.append(img,div);
    shell.querySelectorAll('[data-object]').forEach(function(el){el.setAttribute('aria-pressed',Number(el.dataset.object)===selected?'true':'false');});
  }
  function select(i){selected=i;card();}
  function updatePaths(){
    canvas.querySelectorAll('[data-route]').forEach(function(el){el.hidden=!visible.has(Number(el.dataset.route));el.style.display=el.hidden?'none':'';});
    shell.querySelectorAll('input[data-route-choice]').forEach(function(el){el.checked=visible.has(Number(el.dataset.routeChoice));});
  }
  function render(){
    var l=label();shell.innerHTML='';
    var objects=document.createElement('aside');objects.className='mp-object-panel';
    var title=document.createElement('h3');title.className='mp-heading';title.textContent=l.objects;objects.appendChild(title);
    var list=document.createElement('div');list.className='mp-objects';
    names[lang()].forEach(function(name,i){var b=document.createElement('button');b.className='mp-object';b.dataset.object=i;b.innerHTML='<span>'+(i===10?l.beach:i+1)+'</span>';b.appendChild(document.createTextNode(name));b.addEventListener('click',function(){select(i);});list.appendChild(b);});objects.appendChild(list);
    var center=document.createElement('div');center.className='mp-center';
    viewport=document.createElement('div');viewport.className='mp-viewport';viewport.tabIndex=0;viewport.setAttribute('role','region');viewport.setAttribute('aria-label',l.map);viewport.setAttribute('aria-describedby','mpHint');
    canvas=document.createElement('div');canvas.className='mp-canvas';
    var image=document.createElement('img');image.src='assets/img/aerial-logo.webp';image.alt='';image.draggable=false;image.loading='lazy';canvas.appendChild(image);
    var ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 1000 1000');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');
    paths.forEach(function(d,i){var path=document.createElementNS(ns,'path');path.setAttribute('d',d);path.setAttribute('stroke',colors[i]);if(i>0)path.setAttribute('stroke-dasharray',i===2?'10 6':'3 6');path.setAttribute('class','mp-path');path.dataset.route=i;svg.appendChild(path);});canvas.appendChild(svg);
    positions.forEach(function(pos,i){var b=document.createElement('button');b.className='mp-marker';b.style.left=pos[0]+'%';b.style.top=pos[1]+'%';b.dataset.object=i;b.textContent=i===10?l.beach:i+1;b.setAttribute('aria-label',names[lang()][i]);b.addEventListener('click',function(e){e.stopPropagation();if(!moved)select(i);});canvas.appendChild(b);});
    viewport.appendChild(canvas);center.appendChild(viewport);
    var controls=document.createElement('div');controls.className='mp-controls';
    [['+',l.zoomIn,function(){zoom(1.35,viewport.clientWidth/2,viewport.clientHeight/2);}],['−',l.zoomOut,function(){zoom(1/1.35,viewport.clientWidth/2,viewport.clientHeight/2);}],['100%',l.reset,fit],[l.full,l.full,function(){fullscreen.appendChild(shell);window.LV_UI.open(fullscreen,document.activeElement);fit();}]].forEach(function(a,i){var b=document.createElement('button');b.textContent=a[0];b.setAttribute('aria-label',a[1]);if(i===2)b.className='mp-scale';b.addEventListener('click',a[2]);controls.appendChild(b);});center.appendChild(controls);
    var hint=document.createElement('p');hint.id='mpHint';hint.className='mp-note';hint.textContent=l.hint;center.appendChild(hint);
    var detail=document.createElement('article');detail.className='mp-card';detail.setAttribute('aria-live','polite');center.appendChild(detail);
    var routePanel=document.createElement('aside');routePanel.className='mp-route-panel';title=document.createElement('h3');title.className='mp-heading';title.textContent=l.routes;routePanel.appendChild(title);
    var routeList=document.createElement('div');routeList.className='mp-route-list';
    l.routeNames.forEach(function(name,i){var row=document.createElement('label');row.className='mp-route';var input=document.createElement('input');input.type='checkbox';input.dataset.routeChoice=i;input.addEventListener('change',function(){if(input.checked)visible.add(i);else visible.delete(i);updatePaths();});var swatch=document.createElement('i');swatch.style.borderColor=colors[i];row.append(input,swatch,document.createTextNode(name));routeList.appendChild(row);});routePanel.appendChild(routeList);
    var actions=document.createElement('div');actions.className='mp-actions';
    [l.all,l.none].forEach(function(name,i){var b=document.createElement('button');b.textContent=name;b.addEventListener('click',function(){visible=new Set(i===0?paths.map(function(_,j){return j;}):[]);updatePaths();});actions.appendChild(b);});routePanel.appendChild(actions);
    var note=document.createElement('p');note.className='mp-note';note.textContent=l.note;routePanel.appendChild(note);
    shell.append(objects,center,routePanel);
    var draft=host.querySelector('.mp-draft');if(!draft){draft=document.createElement('p');draft.className='mp-note mp-draft';host.appendChild(draft);}draft.textContent=l.draft;
    fullscreen.setAttribute('aria-label',l.map);close.setAttribute('aria-label',l.close);
    card();updatePaths();apply();bindGestures();
  }
  function point(e){var r=viewport.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
  function bindGestures(){
    viewport.addEventListener('wheel',function(e){if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();var p=point(e);zoom(e.deltaY<0?1.12:1/1.12,p.x,p.y);},{passive:false});
    viewport.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'&&e.button!==0)return;pointers.set(e.pointerId,point(e));drag={point:point(e),start:point(e)};pinch=null;moved=false;if(!e.target.closest('button'))viewport.setPointerCapture(e.pointerId);});
    viewport.addEventListener('pointermove',function(e){
      if(!pointers.has(e.pointerId))return;var p=point(e);pointers.set(e.pointerId,p);
      if(pointers.size===2){var a=Array.from(pointers.values()),distance=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(pinch)zoom(distance/pinch,(a[0].x+a[1].x)/2,(a[0].y+a[1].y)/2);pinch=distance;moved=true;}
      else if(drag){if(Math.hypot(p.x-drag.start.x,p.y-drag.start.y)>5)moved=true;offset.x+=p.x-drag.point.x;offset.y+=p.y-drag.point.y;drag.point=p;apply();}
    });
    function up(e){pointers.delete(e.pointerId);pinch=null;var remaining=Array.from(pointers.values())[0];drag=remaining?{point:remaining,start:remaining}:null;}
    viewport.addEventListener('pointerup',up);viewport.addEventListener('pointercancel',up);viewport.addEventListener('lostpointercapture',up);
    viewport.addEventListener('dblclick',function(e){if(e.target.closest('button'))return;var p=point(e);zoom(scale>=4?.25:1.6,p.x,p.y);});
    viewport.addEventListener('keydown',function(e){if(e.target!==viewport)return;var handled=true;switch(e.key){case '+':case '=':zoom(1.2,viewport.clientWidth/2,viewport.clientHeight/2);break;case '-':zoom(1/1.2,viewport.clientWidth/2,viewport.clientHeight/2);break;case '0':fit();break;case 'ArrowLeft':offset.x+=40;apply();break;case 'ArrowRight':offset.x-=40;apply();break;case 'ArrowUp':offset.y+=40;apply();break;case 'ArrowDown':offset.y-=40;apply();break;default:handled=false;}if(handled)e.preventDefault();});
  }
  document.addEventListener('lv:language',function(){pointers.clear();drag=null;pinch=null;render();});
  document.addEventListener('lv:modalclosed',function(){if(fullscreen.hidden&&shell.parentElement===fullscreen){host.insertBefore(shell,placeholder.nextSibling);fit();}});
  window.addEventListener('resize',apply);
  render();
})();
