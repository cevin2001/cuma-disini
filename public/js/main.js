(function(){
  var root   = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io     = null;

  document.getElementById('yr').textContent = new Date().getFullYear();

  /* --- hero cascade (also draws the hero highlighter) --- */
  requestAnimationFrame(function(){ root.classList.add('ready'); });

  /* --- the one orchestrated moment: the sheet gets highlighted, then stamped --- */
  var sheet = document.getElementById('sheet');
  if (sheet) {
    if (reduce) sheet.classList.add('is-open');
    else setTimeout(function(){ sheet.classList.add('is-open'); }, 1100);
  }

  /* --- count a number up once it is on screen --- */
  function countUp(el){
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;
    var t0 = null, dur = 1200;
    function step(t){
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('id-ID') + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* --- reveal system: .rise, .stagger, .mark and [data-count] --- */
  var targets = document.querySelectorAll('.rise, .stagger, .mark:not(.mark--hero), [data-count]');

  function settle(el){
    /* drop the marker once the entrance is done so :hover transitions stay crisp */
    if (!el.classList.contains('stagger')) return;
    setTimeout(function(){ el.classList.remove('stagger', 'is-in'); }, 1400);
  }

  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function(el){ el.classList.add('is-in'); });
  } else {
    io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        if (e.target.hasAttribute('data-count')) countUp(e.target);
        settle(e.target);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    targets.forEach(function(el){ io.observe(el); });
  }

  /* --- testimonial viewer: click a phone to read it full size --- */
  var viewer = document.getElementById('viewer');
  var shots  = document.querySelectorAll('.phone__open');
  if (viewer && viewer.showModal && shots.length) {
    var vImg = viewer.querySelector('.viewer__img');
    var vN   = viewer.querySelector('.viewer__n');
    var vAlt = viewer.querySelector('.viewer__alt');
    var cur  = 0;

    function show(i){
      cur = (i + shots.length) % shots.length;
      var img = shots[cur].querySelector('img');
      vImg.src = shots[cur].getAttribute('href');
      vImg.alt = img.alt;
      vN.textContent = 'Ulasan ' + (cur + 1) + ' / ' + shots.length;
      vAlt.textContent = img.alt;
      /* replay the entrance on every swap */
      vImg.style.animation = 'none'; void vImg.offsetWidth; vImg.style.animation = '';
    }

    shots.forEach(function(a, i){
      a.addEventListener('click', function(e){
        e.preventDefault();
        show(i);
        viewer.showModal();
      });
    });

    viewer.querySelector('.viewer__close').addEventListener('click', function(){ viewer.close(); });
    viewer.querySelector('.viewer__prev').addEventListener('click', function(){ show(cur - 1); });
    viewer.querySelector('.viewer__next').addEventListener('click', function(){ show(cur + 1); });

    /* click on the dark backdrop (outside the image and buttons) closes */
    viewer.addEventListener('click', function(e){
      if (e.target === viewer || e.target.classList.contains('viewer__fig')) viewer.close();
    });
    viewer.addEventListener('keydown', function(e){
      if (e.key === 'ArrowLeft')  show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
    /* swipe left/right on touch screens */
    var x0 = null;
    viewer.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; }, { passive: true });
    viewer.addEventListener('touchend', function(e){
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(dx < 0 ? cur + 1 : cur - 1);
      x0 = null;
    });
    viewer.addEventListener('close', function(){ shots[cur].focus(); });
  }

  /* --- topbar hairline + mobile dock --- */
  var top   = document.querySelector('.top');
  var dock  = document.getElementById('dock');
  var harga = document.getElementById('harga');
  var hero  = document.getElementById('awal');

  function sync(){
    var y = window.scrollY;
    if (top) top.classList.toggle('is-stuck', y > 8);

    var pastHero = y > (hero ? hero.offsetHeight * 0.7 : 500);
    var atHarga  = false;
    if (harga) {
      var r = harga.getBoundingClientRect();
      atHarga = r.top < window.innerHeight && r.bottom > 0;
    }
    dock.classList.toggle('is-in', pastHero && !atHarga);
  }

  var ticking = false;
  window.addEventListener('scroll', function(){
    if (!ticking) { ticking = true; requestAnimationFrame(function(){ sync(); ticking = false; }); }
  }, { passive: true });
  sync();
})();
