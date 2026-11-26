/* Lake Village Belarus — site script */
(function () {
  'use strict';

  /* ---------- настройки ---------- */
  var COPYRIGHT_YEAR = 2026;          // в 2027 году заменить на 2027

  /* ---------- переводы ---------- */
  var T = {
    ru: {
      nav_about:'О комплексе', nav_infra:'Инфраструктура', nav_plan:'Генплан', nav_events:'События', nav_inv:'Инвесторам',
      h_eyebrow:'Lake Village · Belarus', h_t1:'Загородный комплекс,', h_t2:'создающийся сейчас',
      h_lead:'Озеро, лес и дома с купелями. Место, куда приезжают отдыхать и проводить самые важные события жизни.',
      h_film:'Смотреть фильм', h_scroll:'листайте',
      p1_t:'Главная идея', p1_p:'Создать место, куда люди приезжают не только отдыхать, но и проводить самые важные события в своей жизни.',
      p2_t:'Формат', p2_p:'Всесезонный комплекс для событийного, корпоративного, свадебного и гастрономического туризма.',
      p3_t:'Миссия', p3_p:'Создать идеальное пространство для отдыха и праздников с круглогодичным комфортом и сильным гастрономическим акцентом.',
      slogan:'Природа. Люди. События.',
      n1:'гектаров территории у озера', n2:'домов A-Frame и Barnhouse', n3:'гостей в банкетном холле', n4:'гостей в стеклянной оранжерее',
      a_eyebrow:'О комплексе',
      a_p:'Современный загородный комплекс на участке от 5 гектаров в экологически чистом районе Беларуси: собственное озеро, премиальные домики и крупнейшая в регионе стеклянная оранжерея для банкетов и мероприятий. Инфраструктура для комфорта — без ощущения бетонного города.',
      i_title:'Инфраструктура', i_sub:'Всё, что нужно для отдыха и праздника — рядом с водой и лесом.',
      r1_tag:'Ресторан', r1_t:'Ресторанно-банкетный холл', r1_p:'Большой банкетный комплекс на 350 гостей с панорамным остеклением, авторской кухней и летней террасой над водой.',
      r1_c1:'до 350 гостей', r1_c2:'авторская кухня', r1_c3:'летняя терраса',
      r2_tag:'Банкеты', r2_t:'Стеклянная оранжерея', r2_p:'Светлое пространство под стеклянной крышей для свадеб и камерных банкетов на 100 гостей. Вечером оранжерея превращается в сияющий фонарь на берегу.',
      r2_c1:'до 100 гостей', r2_c2:'свадьбы и банкеты',
      r3_tag:'Проживание', r3_t:'Дома A-Frame', r3_p:'Дома-треугольники с панорамным остеклением, террасой и купелью на дровах, с видом на озеро.',
      r3_c1:'панорамные окна', r3_c2:'купель на дровах', r3_c3:'терраса',
      r4_tag:'Проживание', r4_t:'Дома Barnhouse', r4_p:'Тёмный металл, тёплое дерево и стеклянный фасад. В каждом доме есть спальня, гостиная, кухня, терраса, сауна, купель на дровах и зона BBQ.',
      r4_c1:'спальня и гостиная', r4_c2:'кухня', r4_c3:'сауна и купель', r4_c4:'зона BBQ',
      m_title:'И ещё на территории',
      m1:'Пирс и пляж', m1s:'прогулочная набережная', m2:'Детская площадка', m2s:'для всей семьи',
      m3:'Костровая зона и салюты', m3s:'вертолётная площадка*', m4:'Въездная группа и ресепшен', m4s:'охраняемая территория',
      m_note:'* При условии подходящего участка и согласованности с государственными органами.',
      now_t1:'Комплекс', now_t2:'создаётся сейчас',
      now_p:'Работа над территорией уже идёт. Проект реализуется поэтапно: от главных зон для событий к проживанию и сервисам.',
      s1:'Банкетный холл, оранжерея, благоустройство озера', s2:'Коттеджи, глэмпинг, MICE-инфраструктура', s3:'Сервисы и форматы отдыха для круглогодичной загрузки',
      pl_title:'Генеральный план', pl_sub:'Закрытая охраняемая территория. Нажмите на карту, чтобы рассмотреть её подробнее.', pl_open:'Увеличить',
      pl_hint:'колесо мыши или щипок — масштаб, перетаскивание — перемещение',
      rt_title:'Логистика и маршруты',
      rt_note:'Раздельные гостевые, сервисные и пешие потоки. Кольцевое движение и организованная парковка. Все зоны доступны: дома, пирс, пляж, оранжерея и ресторан.',
      e_title:'События круглый год', e_sub:'Девять форматов, для которых создано это место.',
      t_eyebrow:'О нас', t_title:'Команда, которая умеет делать праздники',
      t_p:'Более 20 лет опыта в организации крупнейших концертов и телепроектов: КВН, Comedy Club, «Большая Разница», гастроли звёзд федерального уровня. Сегодня мы переносим эту экспертизу в загородный формат.',
      t_v:'Мы строим место, куда хочется возвращаться: для свадеб, фестивалей, корпоративов и ярких выходных.',
      tour_s:'скоро', tour_t:'3D-тур по комплексу', tour_p:'Готовим детальный и по-настоящему качественный 3D-тур. Мы покажем его, когда он будет готов.',
      iv_title:'Инвесторам', iv_sub:'Расскажем о проекте лично: условия, этапы и модель работы обсуждаем на встрече. Позвоните или оставьте контакт, и мы свяжемся.',
      pr_a:'Автор и руководитель проекта', pr_s:'Сергей', pr_c:'Контакты проекта', pr_d:'Дмитрий', pr_c2:'Контакты проекта',
      f_title:'Оставьте контакт', f_name:'Имя', f_contact:'Телефон или Telegram', f_msg:'Сообщение (необязательно)', f_send:'Отправить', f_ok:'Спасибо! Мы свяжемся с вами.',
      rights:'Все права защищены', mq:'Проект в стадии разработки',
      objs:['Въездная группа','Парковка','Административный корпус / техзона','Вертолётная площадка','Детская площадка','Дома A-Frame','Дома Barnhouse','Пирс','Банкетная оранжерея','Ресторанно-банкетный холл'],
      routes:['Автомобильный маршрут','Пешеходный маршрут','Сервисный проезд','Гостевой доступ','Маршрут к пирсу','Маршрут к пляжу','Маршрут к оранжерее','Маршрут к ресторану','Маршрут к вертолётной площадке'],
      events:[['Свадьбы','Церемонии у воды и банкеты в стеклянной оранжерее.'],['Корпоративы','Банкеты, тимбилдинги, новогодние вечера, презентации компаний.'],['Государственные мероприятия','Официальные приёмы, форумы и церемонии любого масштаба.'],['Деловые конференции','Встречи, семинары и круглые столы на природе.'],['Презентации','Запуски продуктов, пресс-конференции, презентации брендов.'],['Форумы','Крупные форумы и съезды с большим числом гостей.'],['Частные события','Дни рождения, юбилеи, семейные торжества.'],['Выпускные вечера','Школьные и университетские выпускные, балы, церемонии.'],['Культурные события','Концерты, выставки, спектакли и фестивали.']],
      title:'Lake Village Belarus — загородный комплекс у озера', err:'Заполните имя и контакт'
    },
    en: {
      nav_about:'About', nav_infra:'Infrastructure', nav_plan:'Master plan', nav_events:'Events', nav_inv:'For investors',
      h_eyebrow:'Lake Village · Belarus', h_t1:'A country resort,', h_t2:'being created right now',
      h_lead:'A lake, a forest and houses with hot tubs. A place to relax and to celebrate the most important moments of life.',
      h_film:'Watch the film', h_scroll:'scroll',
      p1_t:'The idea', p1_p:'To create a place where people come not only to rest, but to hold the most important events of their lives.',
      p2_t:'Format', p2_p:'A year-round resort for event, corporate, wedding and gastronomic tourism.',
      p3_t:'Mission', p3_p:'To create the perfect space for rest and celebration, with year-round comfort and a strong gastronomic focus.',
      slogan:'Nature. People. Events.',
      n1:'hectares by the lake', n2:'A-Frame and Barnhouse houses', n3:'guests in the banquet hall', n4:'guests in the glass orangery',
      a_eyebrow:'About the resort',
      a_p:'A modern country resort on a site of 5+ hectares in an ecologically clean area of Belarus: a private lake, premium houses and the region’s largest glass orangery for banquets and events. Infrastructure for comfort, without the feeling of a concrete city.',
      i_title:'Infrastructure', i_sub:'Everything for rest and celebration, right by the water and the forest.',
      r1_tag:'Restaurant', r1_t:'Restaurant & banquet hall', r1_p:'A large banquet complex for 350 guests with panoramic glazing, signature cuisine and a summer terrace above the water.',
      r1_c1:'up to 350 guests', r1_c2:'signature cuisine', r1_c3:'summer terrace',
      r2_tag:'Banquets', r2_t:'Glass orangery', r2_p:'A bright space under a glass roof for weddings and intimate banquets for 100 guests. In the evening the orangery glows like a lantern on the shore.',
      r2_c1:'up to 100 guests', r2_c2:'weddings & banquets',
      r3_tag:'Stay', r3_t:'A-Frame houses', r3_p:'Triangular houses with panoramic glazing, a terrace and a wood-fired hot tub, overlooking the lake.',
      r3_c1:'panoramic windows', r3_c2:'wood-fired hot tub', r3_c3:'terrace',
      r4_tag:'Stay', r4_t:'Barnhouse houses', r4_p:'Dark metal, warm wood and a glass façade. Each house has a bedroom, living room, kitchen, terrace, sauna, wood-fired hot tub and BBQ area.',
      r4_c1:'bedroom & living room', r4_c2:'kitchen', r4_c3:'sauna & hot tub', r4_c4:'BBQ area',
      m_title:'And more on site',
      m1:'Pier & beach', m1s:'lakeside promenade', m2:'Children’s playground', m2s:'for the whole family',
      m3:'Fire pit & fireworks', m3s:'helipad*', m4:'Entrance & reception', m4s:'secured territory',
      m_note:'* Subject to a suitable site and approval by the relevant authorities.',
      now_t1:'The resort is', now_t2:'being created now',
      now_p:'Work on the site is under way. The project is delivered in stages: from the main event venues to accommodation and services.',
      s1:'Banquet hall, orangery, lake landscaping', s2:'Cottages, glamping, MICE infrastructure', s3:'Services and leisure formats for year-round occupancy',
      pl_title:'Master plan', pl_sub:'A secured, private territory. Tap the map to explore it in detail.', pl_open:'Enlarge',
      pl_hint:'mouse wheel or pinch to zoom, drag to move',
      rt_title:'Logistics & routes',
      rt_note:'Separate guest, service and pedestrian flows. Ring road and organised parking. Every zone is reachable: houses, pier, beach, orangery and restaurant.',
      e_title:'Events all year round', e_sub:'Nine formats this place was created for.',
      t_eyebrow:'About us', t_title:'A team that knows how to make celebrations',
      t_p:'Over 20 years of experience organising major concerts and TV projects: KVN, Comedy Club, “Bolshaya Raznitsa”, tours of federal-level stars. Today we bring that expertise to the countryside.',
      t_v:'We are building a place you want to come back to: for weddings, festivals, corporate events and bright weekends.',
      tour_s:'coming soon', tour_t:'3D tour of the resort', tour_p:'We are preparing a detailed, truly high-quality 3D tour. We will show it when it is ready.',
      iv_title:'For investors', iv_sub:'We will present the project in person: terms, stages and the operating model are discussed at a meeting. Call us or leave your contact and we will get back to you.',
      pr_a:'Project author and lead', pr_s:'Sergey', pr_c:'Project contact', pr_d:'Dmitry', pr_c2:'Project contact',
      f_title:'Leave your contact', f_name:'Name', f_contact:'Phone or Telegram', f_msg:'Message (optional)', f_send:'Send', f_ok:'Thank you! We will get in touch.',
      rights:'All rights reserved', mq:'Project in development',
      objs:['Entrance gate','Parking','Administration building / service area','Helipad','Children’s playground','A-Frame houses','Barnhouse houses','Pier','Banquet orangery','Restaurant & banquet hall'],
      routes:['Car route','Pedestrian route','Service road','Guest access','Route to the pier','Route to the beach','Route to the orangery','Route to the restaurant','Route to the helipad'],
      events:[['Weddings','Ceremonies by the water and banquets in the glass orangery.'],['Corporate events','Banquets, team building, New Year parties, company presentations.'],['Official events','Receptions, forums and ceremonies of any scale.'],['Business conferences','Meetings, seminars and round tables in nature.'],['Presentations','Product launches, press conferences, brand presentations.'],['Forums','Large forums and congresses with many guests.'],['Private events','Birthdays, anniversaries, family celebrations.'],['Graduations','School and university graduations, balls, ceremonies.'],['Cultural events','Concerts, exhibitions, performances and festivals.']],
      title:'Lake Village Belarus — a country resort by the lake', err:'Please fill in your name and contact'
    }
  };
  Object.keys(T).forEach(function(l) { Object.assign(T[l], (window.LV_COPY || {})[l] || {}); });
  var ROUTE_COLORS = ['#f2f2f2','#f0d84a','#ee5a4a','#5fd36a','#4cc9e8','#f0d84a','#e9a3e8','#b66ae6','#d58af0'];
  var ROUTE_DASH = ['solid','dotted','dashed','dotted','dotted','dotted','dotted','dotted','dotted'];
  var GAL = ['pier-sunset','v-pier-dinner','v-barn-aerial','v-aerial-heli','fisher-dock','v-reception','v-interior','orangery','v-aframe-sunset','v-barn-tub2'];

  var lang = 'ru';
  try { var s = localStorage.getItem('lv_lang'); if (s === 'en' || s === 'ru') lang = s; } catch (e) {}

  var $ = function (q, c) { return (c || document).querySelector(q); };
  var $$ = function (q, c) { return Array.prototype.slice.call((c || document).querySelectorAll(q)); };

  /* ---------- построение динамических блоков ---------- */
  function buildLists() {
    var objs = $('#objs'), routes = $('#routes'), eg = $('#egrid');
    if (!eg) return;
    if (objs) objs.innerHTML = ''; if (routes) routes.innerHTML = ''; eg.innerHTML = '';
    T[lang].objs.forEach(function (n, i) {
      var li = document.createElement('li');
      li.className = 'obj reveal is-in';
      li.innerHTML = '<img src="assets/thumbs/' + (i + 1) + '.webp" alt="" loading="lazy"><b>' + (i + 1) + '</b><span>' + n + '</span>';
      if (objs) objs.appendChild(li);
    });
    T[lang].routes.forEach(function (n, i) {
      var li = document.createElement('li');
      li.innerHTML = '<i style="border-top-style:' + ROUTE_DASH[i] + ';border-color:' + ROUTE_COLORS[i] + '"></i><span>' + n + '</span>';
      if (routes) routes.appendChild(li);
    });
    T[lang].events.forEach(function (e, i) {
      var d = document.createElement('div');
      d.className = 'ev reveal'; d.style.setProperty('--d', (i % 3) * 0.08 + 's');
      d.innerHTML = '<img class="ev-image" src="assets/img/' + ['orangery','events/corporate','v-restaurant','events/conference','events/presentation','events/forum','pier-evening','events/graduation','events/cultural'][i] + '.webp" alt="" loading="lazy" decoding="async"><h4>' + e[0] + '</h4><p>' + e[1] + '</p>';
      eg.appendChild(d);
      io.observe(d);
      d.addEventListener('pointermove', function (ev) {
        var r = d.getBoundingClientRect();
        d.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
        d.style.setProperty('--my', (ev.clientY - r.top) + 'px');
      });
    });
  }

  function buildMarquee() {
    var tr = $('#mqTrack'); if (!tr) return;
    var item = '<span class="mq__item"><span>' + T[lang].mq + '</span><img src="assets/img/leaf.png" alt=""></span>';
    var one = ''; for (var i = 0; i < 6; i++) one += item;
    tr.innerHTML = one + one;
    $('.mq').setAttribute('aria-label', T[lang].mq);
  }

  function applyLang(l) {
    lang = l;
    document.documentElement.lang = l;
    $$('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (T[l][k] != null) el.textContent = T[l][k];
    });
    document.title = document.body.classList.contains('about-page') ? (l === 'ru' ? 'О нас — Lake Village Belarus' : 'Our team — Lake Village Belarus') : T[l].title;
    $$('.lang button').forEach(function (b) { b.classList.toggle('on', b.dataset.lang === l); });
    var src = 'assets/img/map-' + l + '.webp';
    window.LV_LANG = l;
    document.querySelectorAll('[data-i18n-aria]').forEach(function(el){el.setAttribute('aria-label', T[l][el.dataset.i18nAria] || el.dataset.i18nAria);});
    document.querySelectorAll('[data-i18n-alt]').forEach(function(el){el.alt=T[l][el.dataset.i18nAlt] || '';});
    document.dispatchEvent(new CustomEvent('lv:language', {detail:l}));
    buildLists(); buildMarquee();
    try { localStorage.setItem('lv_lang', l); } catch (e) {}
  }

  /* ---------- reveal ---------- */
  if (!('IntersectionObserver' in window)) { document.documentElement.classList.add('fallback'); window.IntersectionObserver = function () { this.observe = this.unobserve = this.disconnect = function () {}; }; }
  window.addEventListener('error', function () { document.documentElement.classList.add('fallback'); });
  setTimeout(function () { if (!document.body.classList.contains('loaded')) document.documentElement.classList.add('fallback'); }, 3500);
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: .14, rootMargin: '0px 0px -6% 0px' });

  /* ---------- панели hero ---------- */
  var panelIO = new IntersectionObserver(function (en) {
    en.forEach(function (e) { e.target.classList.toggle('on', e.isIntersecting); });
  }, { threshold: .5 });

  /* ---------- counters ---------- */
  var cio = new IntersectionObserver(function (en) {
    en.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, to = +el.dataset.count, t0 = performance.now(), dur = 1800;
      (function tick(t) {
        var p = Math.min(1, (t - t0) / dur), v = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(to * v);
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
      cio.unobserve(el);
    });
  }, { threshold: .6 });

  /* ---------- parallax + прогресс + шапка ---------- */
  var pars = [], ticking = false;
  function collectPar() { pars = $$('[data-parallax]'); }
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      $('.progress i').style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
      $('#hdr').classList.toggle('scrolled', y > 40);
      var vh = window.innerHeight;
      pars.forEach(function (img) {
        var box = img.parentElement.getBoundingClientRect();
        if (box.bottom < -100 || box.top > vh + 100) return;
        var p = (box.top + box.height / 2 - vh / 2) / vh;      // -1..1
        var max = img.offsetHeight - box.height;
        p = Math.max(-1, Math.min(1, p));
        img.style.transform = 'translate3d(0,' + (-max / 2 - p * max / 2).toFixed(1) + 'px,0)';
      });
      ticking = false;
    });
  }

  /* ---------- светлячки ---------- */
  function fireflies() {
    var host = $('.split__text'); if (!host) return;
    if (window.matchMedia('(max-width:860px)').matches || window.matchMedia('(prefers-reduced-motion:reduce)').matches || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.connection && navigator.connection.saveData)) return;
    for (var i = 0; i < 18; i++) {
      var f = document.createElement('i'); f.className = 'ff';
      f.style.left = (Math.random() * 90 + 3) + '%';
      f.style.top = (Math.random() * 90 + 5) + '%';
      f.style.setProperty('--t', (10 + Math.random() * 10) + 's');
      f.style.setProperty('--w', (-Math.random() * 12) + 's');
      f.style.setProperty('--x', (Math.random() * 120 - 40) + 'px');
      host.appendChild(f);
    }
  }

  /* ---------- меню ---------- */
  var burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', function () { burger.classList.toggle('on'); nav.classList.toggle('open'); burger.setAttribute('aria-expanded',nav.classList.contains('open')); });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { burger.classList.remove('on'); nav.classList.remove('open'); burger.setAttribute('aria-expanded','false'); }); });
  $$('.lang button').forEach(function (b) { b.addEventListener('click', function () { applyLang(b.dataset.lang); }); });

  /* ---------- init ---------- */
  var track = $('#galTrack');
  if (track) GAL.concat(GAL).forEach(function (n) {
    var im = document.createElement('img'); im.src = 'assets/img/' + n + '.webp'; im.alt = ''; im.loading = 'lazy'; im.decoding = 'async'; track.appendChild(im);
  });
  $('#year').textContent = COPYRIGHT_YEAR;
  applyLang(lang);
  $$('.reveal').forEach(function (el) { if (!el.classList.contains('is-in')) io.observe(el); });
  $$('.panel').forEach(function (p) { panelIO.observe(p); });
  $$('[data-count]').forEach(function (c) { cio.observe(c); });
  collectPar(); fireflies();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', function () { collectPar(); onScroll(); });
  requestAnimationFrame(function () { document.body.classList.add('loaded'); if ($('#heroScript')) $('#heroScript').classList.add('is-in'); onScroll(); });
})();
