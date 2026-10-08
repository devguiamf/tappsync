(function () {
  // Preencha o número com DDI + DDD (ex.: "5516999999999") para ativar o botão de WhatsApp.
  var CONFIG = { whatsapp: "5516993844144" };

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // QR Code ilustrativo
  function qr(el, n, seed) {
    var s = seed * 9301 + 49297;
    function rnd() { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }
    var g = [], x, y;
    for (y = 0; y < n; y++) { g[y] = []; for (x = 0; x < n; x++) g[y][x] = rnd() > 0.5 ? 1 : 0; }
    function finder(ox, oy) {
      for (var j = -1; j <= 7; j++) for (var i = -1; i <= 7; i++) {
        var X = ox + i, Y = oy + j;
        if (X < 0 || Y < 0 || X >= n || Y >= n) continue;
        var inside = i >= 0 && i <= 6 && j >= 0 && j <= 6;
        var edge = i === 0 || i === 6 || j === 0 || j === 6;
        var core = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        g[Y][X] = inside && (edge || core) ? 1 : 0;
      }
    }
    finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
    var d = '';
    for (y = 0; y < n; y++) for (x = 0; x < n; x++) if (g[y][x]) d += 'M' + x + ' ' + y + 'h1v1h-1z';
    el.innerHTML = '<svg viewBox="0 0 ' + n + ' ' + n + '" shape-rendering="crispEdges" aria-hidden="true"><path d="' + d + '" fill="currentColor"/></svg>';
  }
  document.querySelectorAll('[data-qr]').forEach(function (el) { qr(el, 25, +el.getAttribute('data-qr')); });

  // marquee: duplica o conteúdo para o loop ficar contínuo
  var track = document.getElementById('track');
  var base = track.innerHTML;
  track.innerHTML = base + base + base + base;

  // entrada e saída dos componentes
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-a]'));
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (e) { e.classList.add('in'); });
  } else {
    document.documentElement.classList.add('js');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var el = en.target;
        if (en.isIntersecting) { el.classList.add('in'); el.classList.remove('out'); }
        else {
          el.classList.remove('in');
          if (en.boundingClientRect.top < 0) el.classList.add('out'); else el.classList.remove('out');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (e) { io.observe(e); });
  }

  // efeitos ligados ao scroll
  var bar = document.getElementById('bar');
  var nav = document.getElementById('nav');
  var hero = document.getElementById('hero');
  var steps = document.getElementById('steps');
  var links = Array.prototype.slice.call(document.querySelectorAll('.links a'));
  var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var ticking = false;
  function update() {
    ticking = false;
    var y = window.scrollY || 0;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0).toFixed(4) + ')';
    nav.classList.toggle('solid', y > 24);
    if (!reduce) {
      var hp = Math.min(1, Math.max(0, y / (hero.offsetHeight * 0.85)));
      hero.style.setProperty('--hp', hp.toFixed(3));
      var r = steps.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (window.innerHeight * 0.7 - r.top) / r.height));
      steps.style.setProperty('--p', p.toFixed(3));
    } else {
      steps.style.setProperty('--p', 1);
    }
    var cur = -1;
    targets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top < window.innerHeight * 0.4) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  update();

  // brilho que segue o cursor nos cards
  document.querySelectorAll('.card').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var b = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - b.left) + 'px');
      c.style.setProperty('--my', (e.clientY - b.top) + 'px');
    });
  });

  // WhatsApp: FAB + CTAs
  var waMsg = 'Olá! Vi o site da Tapp Sync e quero saber mais.';
  var waUrl = CONFIG.whatsapp
    ? 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(waMsg)
    : '';
  var fab = document.getElementById('wa-fab');
  if (waUrl) {
    fab.hidden = false;
    fab.href = waUrl;
    document.querySelectorAll('.wa-link').forEach(function (a) { a.href = waUrl; });
  } else {
    fab.hidden = true;
    document.querySelectorAll('.wa-link').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); });
    });
  }
})();
