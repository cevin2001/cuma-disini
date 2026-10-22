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
