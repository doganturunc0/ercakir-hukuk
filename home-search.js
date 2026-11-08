(function () {
  'use strict';
  /* Ana sayfadaki arama kutusu için canlı öneri listesi.
     Eşleştirme kuralları content-search.js ile aynıdır. */
  var form = document.querySelector('form.home-search');
  if (!form || !window.fetch) return;
  var input = form.querySelector('input[name="q"]');
  if (!input) return;

  var list = document.createElement('ul');
  list.className = 'home-suggest';
  list.id = 'homeSuggest';
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-label', 'Önerilen içerikler');
  list.hidden = true;
  form.appendChild(list);
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-controls', 'homeSuggest');
  input.setAttribute('aria-expanded', 'false');

  var MAP = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'â': 'a', 'î': 'i', 'û': 'u' };
  function norm(s) {
    return (s || '').toLocaleLowerCase('tr-TR')
      .replace(/i̇/g, 'i')
      .replace(/[çğıöşüâîû]/g, function (c) { return MAP[c] || c; })
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
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

  var index = null, loading = null, timer = null, active = -1, items = [];
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

  function close() {
    list.hidden = true;
    list.textContent = '';
    items = [];
    active = -1;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  function setActive(i) {
    if (!items.length) return;
    if (active > -1) items[active].classList.remove('is-active');
    active = (i + items.length) % items.length;
    items[active].classList.add('is-active');
    input.setAttribute('aria-activedescendant', items[active].id);
  }

  function option(href, title, tag, cls) {
    var li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.id = 'homeSuggest-' + items.length;
    if (cls) li.className = cls;
    var a = document.createElement('a');
    a.href = href;
    a.tabIndex = -1;
    if (tag) {
      var small = document.createElement('small');
      small.textContent = tag;
      a.appendChild(small);
    }
    a.appendChild(document.createTextNode(title));
    li.appendChild(a);
    list.appendChild(li);
    items.push(li);
  }

  function run() {
    var q = input.value.trim();
    var words = norm(q).split(' ').filter(function (w) { return w.length > 1; });
    if (!words.length) { close(); return; }
    load().then(function (idx) {
      if (input.value.trim() !== q) return;
      var hits = [];
      for (var i = 0; i < idx.length; i++) {
        var s = score(idx[i], words);
        if (s) hits.push({ s: s, x: idx[i].x });
      }
      hits.sort(function (a, b) { return b.s - a.s || a.x.t.localeCompare(b.x.t, 'tr'); });
      list.textContent = '';
      items = [];
      active = -1;
      if (!hits.length) {
        option('hukuki-icerikler.html', 'Sonuç bulunamadı — tüm konulara göz atın →', '', 'all');
      } else {
        hits.slice(0, 5).forEach(function (h) { option(h.x.u, h.x.t, h.x.c, ''); });
        option('hukuki-icerikler.html?q=' + encodeURIComponent(q), 'Tüm sonuçları gör (' + hits.length + ') →', '', 'all');
      }
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }).catch(close);
  }

  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(run, 120);
  });
  input.addEventListener('focus', function () { load().catch(function () {}); if (input.value.trim()) run(); });
  input.addEventListener('keydown', function (e) {
    if (list.hidden) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Escape') { close(); }
    else if (e.key === 'Enter' && active > -1) {
      e.preventDefault();
      window.location.href = items[active].querySelector('a').href;
    }
  });
  document.addEventListener('click', function (e) {
    if (!form.contains(e.target)) close();
  });
})();
