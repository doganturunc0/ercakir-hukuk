(function () {
  'use strict';
  var box = document.getElementById('icerik-arama');
  if (!box || !window.fetch) return;
  var input = document.getElementById('contentSearchInput');
  var status = document.getElementById('contentSearchStatus');
  var results = document.getElementById('contentSearchResults');
  var index = null;
  var loading = null;
  var timer = null;
  var MAX = 24;

  var MAP = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'i̇': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'â': 'a', 'î': 'i', 'û': 'u' };
  function norm(s) {
    return (s || '').toLocaleLowerCase('tr-TR')
      .replace(/i̇|[çğıöşüâîû]/g, function (c) { return MAP[c] || c; })
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function load() {
    if (index) return Promise.resolve(index);
    if (!loading) {
      loading = fetch('search-index.json?v=20261108-1', { credentials: 'same-origin' })
        .then(function (r) { if (!r.ok) throw new Error('index'); return r.json(); })
        .then(function (data) {
          index = data.map(function (x) {
            return { x: x, t: ' ' + norm(x.t) + ' ', c: ' ' + norm(x.c) + ' ', d: ' ' + norm(x.d) + ' ', h: ' ' + norm(x.h) + ' ' };
          });
          return index;
        });
    }
    return loading;
  }

  function score(e, words) {
    var total = 0;
    for (var i = 0; i < words.length; i++) {
      var w = words[i], start = ' ' + w, s = 0, mid = w.length >= 5;
      if (e.t.indexOf(start) > -1) s += 6; else if (mid && e.t.indexOf(w) > -1) s += 3;
      if (e.h.indexOf(start) > -1) s += 3; else if (mid && e.h.indexOf(w) > -1) s += 1;
      if (e.d.indexOf(start) > -1) s += 2; else if (mid && e.d.indexOf(w) > -1) s += 1;
      if (e.c.indexOf(start) > -1) s += 2;
      if (!s) return 0;
      total += s;
    }
    return total;
  }

  function card(x) {
    var a = document.createElement('a');
    a.className = 'content-card';
    a.href = x.u;
    if (x.c) {
      var tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = x.c;
      a.appendChild(tag);
    }
    var h = document.createElement('h3');
    h.textContent = x.t;
    a.appendChild(h);
    if (x.d) {
      var p = document.createElement('p');
      p.textContent = x.d;
      a.appendChild(p);
    }
    var b = document.createElement('b');
    b.textContent = 'İçeriği oku →';
    a.appendChild(b);
    return a;
  }

  function run() {
    var q = input.value;
    var words = norm(q).split(' ').filter(function (w) { return w.length > 1; });
    results.textContent = '';
    if (!words.length) {
      status.textContent = '';
      results.hidden = true;
      return;
    }
    load().then(function (idx) {
      var hits = [];
      for (var i = 0; i < idx.length; i++) {
        var s = score(idx[i], words);
        if (s) hits.push({ s: s, x: idx[i].x });
      }
      hits.sort(function (a, b) { return b.s - a.s || a.x.t.localeCompare(b.x.t, 'tr'); });
      results.textContent = '';
      if (!hits.length) {
        status.textContent = '“' + q.trim() + '” için sonuç bulunamadı. Farklı bir kelime deneyebilir veya aşağıdaki konulara göz atabilirsiniz.';
        results.hidden = true;
        return;
      }
      var shown = hits.slice(0, MAX);
      status.textContent = hits.length + ' içerik bulundu' + (hits.length > MAX ? ', en ilgili ' + MAX + ' tanesi gösteriliyor.' : '.');
      shown.forEach(function (h) { results.appendChild(card(h.x)); });
      results.hidden = false;
    }).catch(function () {
      status.textContent = 'Arama şu anda kullanılamıyor. İçeriklere aşağıdaki konu başlıklarından ulaşabilirsiniz.';
    });
  }

  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(run, 180);
  });
  input.addEventListener('focus', load, { once: true });
  box.addEventListener('submit', function (e) { e.preventDefault(); run(); });

  box.hidden = false;
  var q0 = new URLSearchParams(window.location.search).get('q');
  if (q0) {
    input.value = q0.slice(0, 80);
    run();
    box.scrollIntoView({ block: 'start' });
  }
})();
