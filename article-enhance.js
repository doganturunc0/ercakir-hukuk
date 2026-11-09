(function () {
  'use strict';
  var main = document.querySelector('main.article-page');
  if (!main) return;

  /* 1. Okuma ilerleme çubuğu */
  var bar = document.createElement('div');
  bar.className = 'read-progress';
  bar.setAttribute('aria-hidden', 'true');
  var fill = document.createElement('span');
  bar.appendChild(fill);
  document.body.appendChild(bar);
  var ticking = false;
  function update() {
    ticking = false;
    var rect = main.getBoundingClientRect();
    var total = main.offsetHeight - window.innerHeight;
    var done = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 1;
    fill.style.transform = 'scaleX(' + done.toFixed(4) + ')';
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  /* 2. Paylaş / bağlantıyı kopyala / yazdır */
  var canonical = document.querySelector('link[rel="canonical"]');
  var url = canonical ? canonical.href : window.location.href.split('#')[0];
  var h1 = main.querySelector('h1');
  var title = h1 ? h1.textContent.trim() : document.title;

  var share = document.createElement('div');
  share.className = 'share-bar';
  share.setAttribute('role', 'group');
  share.setAttribute('aria-label', 'Bu yazıyı paylaşın veya yazdırın');
  var label = document.createElement('span');
  label.className = 'share-label';
  label.textContent = 'Bu yazıyı paylaşın:';
  share.appendChild(label);

  function button(text, handler) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = text;
    b.addEventListener('click', handler);
    share.appendChild(b);
    return b;
  }

  if (navigator.share) {
    button('Paylaş', function () {
      navigator.share({ title: title, url: url }).catch(function () {});
    });
  } else {
    var wa = document.createElement('a');
    wa.href = 'https://wa.me/?text=' + encodeURIComponent(title + ' ' + url);
    wa.target = '_blank';
    wa.rel = 'noopener noreferrer';
    wa.textContent = "WhatsApp'ta paylaş";
    share.appendChild(wa);
  }

  var copyBtn = button('Bağlantıyı kopyala', function () {
    function ok() {
      copyBtn.textContent = 'Kopyalandı ✓';
      setTimeout(function () { copyBtn.textContent = 'Bağlantıyı kopyala'; }, 2200);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(ok, function () { window.prompt('Bağlantıyı kopyalayın:', url); });
    } else {
      window.prompt('Bağlantıyı kopyalayın:', url);
    }
  });

  button('Yazdır', function () { window.print(); });

  var anchor = null;
  var heads = main.querySelectorAll('h2');
  for (var i = 0; i < heads.length; i++) {
    if (heads[i].textContent.trim() === 'İlgili içerikler') { anchor = heads[i]; break; }
  }
  if (!anchor) anchor = main.querySelector('.legal-note');
  if (anchor) main.insertBefore(share, anchor); else main.appendChild(share);

  /* 3. Adli tatil uyarısı (10 Temmuz–31 Ağustos arasında gösterilir) */
  (function () {
    var now = new Date(), m = now.getMonth(), d = now.getDate();
    var during = (m === 6 && d >= 20) || m === 7;
    var soon = m === 6 && d >= 10 && d < 20;
    if (!during && !soon) return;
    var key = 'adli-tatil-uyari-' + now.getFullYear() + (during ? '-tatil' : '-once');
    try { if (window.sessionStorage.getItem(key)) return; } catch (e) {}
    var box = document.createElement('aside');
    box.className = 'adli-tatil-notice';
    box.setAttribute('aria-label', 'Adli tatil uyarısı');
    var title = document.createElement('p');
    title.className = 'adli-tatil-title';
    title.textContent = during ? 'Adli tatil devam ediyor (20 Temmuz – 31 Ağustos)' : 'Adli tatil 20 Temmuz\'da başlıyor';
    var body = document.createElement('p');
    body.textContent = 'Hukuk mahkemelerinde adli tatile tabi işlerde, HMK\'da öngörülen bir sürenin son günü tatile denk gelirse süre tatilin bittiği günden itibaren bir hafta uzatılmış sayılır (HMK m.104). Nafaka, soybağı, velayet, işçilerin açtığı davalar ve ihtiyati tedbir gibi işler tatilde de görülür (HMK m.103). Ceza işlerinde adli tatile rastlayan süreler, tatilin bittiği günden itibaren üç gün uzatılmış sayılır (CMK m.331). Yeni adli yıl 1 Eylül\'de başlar.';
    var more = document.createElement('p');
    more.className = 'adli-tatil-more';
    var a = document.createElement('a');
    a.href = 'sure-hesaplama.html';
    a.textContent = 'Sürenizi hukuki süre hesaplama aracıyla kontrol edin →';
    more.appendChild(a);
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'adli-tatil-close';
    close.setAttribute('aria-label', 'Uyarıyı kapat');
    close.textContent = '×';
    close.addEventListener('click', function () {
      box.parentNode.removeChild(box);
      try { window.sessionStorage.setItem(key, '1'); } catch (e) {}
    });
    box.appendChild(close);
    box.appendChild(title);
    box.appendChild(body);
    box.appendChild(more);
    var after = main.querySelector('.quick-answer') || main.querySelector('.article-meta');
    if (after && after.parentNode === main) main.insertBefore(box, after.nextSibling);
    else if (h1) main.insertBefore(box, h1.nextSibling);
  })();

  /* 4. Belge ve delil listelerini işaretlenebilir kontrol listesine çevir */
  var LIST_HEAD = /belge|delil|hazırlanması gerekenler/i;
  var NOT_LIST = /veremediği|kullanılabilir mi|değerlendirme ölçütleri|^Ecrimisil davasında ispat/i;
  function store(key, value) {
    try {
      if (value === undefined) {
        var v = JSON.parse(window.localStorage.getItem(key) || '[]');
        return Array.isArray(v) ? v : [];
      }
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { return []; }
    return value;
  }
  function printOnly(nodes) {
    var marked = [h1].concat(nodes).filter(Boolean);
    marked.forEach(function (n) { n.classList.add('print-target'); });
    document.body.classList.add('print-checklist');
    function done() {
      document.body.classList.remove('print-checklist');
      marked.forEach(function (n) { n.classList.remove('print-target'); });
      window.removeEventListener('afterprint', done);
    }
    window.addEventListener('afterprint', done);
    window.print();
    setTimeout(done, 1000);
  }
  var listNo = 0;
  for (var c = 0; c < heads.length; c++) {
    var head = heads[c], text = head.textContent.trim();
    if (!LIST_HEAD.test(text) || NOT_LIST.test(text) || /^Kaynak/i.test(text)) continue;
    var ul = null;
    for (var el = head.nextElementSibling; el && el.tagName !== 'H2'; el = el.nextElementSibling) {
      if (el.tagName === 'UL') { ul = el; break; }
    }
    if (!ul || ul.classList.contains('doc-checklist')) continue;
    (function (head, ul, n) {
      var key = 'belge-listesi:' + window.location.pathname + ':' + n;
      var saved = store(key);
      var lis = ul.querySelectorAll(':scope > li');
      var boxes = [];
      ul.classList.add('doc-checklist');
      var bar = document.createElement('div');
      bar.className = 'checklist-bar';
      var count = document.createElement('span');
      count.className = 'checklist-count';
      count.setAttribute('aria-live', 'polite');
      var hint = document.createElement('span');
      hint.className = 'checklist-hint';
      hint.textContent = 'Hazırladıklarınızı işaretleyin; işaretler yalnızca bu cihazda saklanır.';
      function update(save) {
        var on = [];
        boxes.forEach(function (b, i) { if (b.checked) on.push(i); b.parentNode.parentNode.classList.toggle('is-done', b.checked); });
        count.textContent = on.length + ' / ' + boxes.length + ' hazır';
        if (save !== false) store(key, on);
      }
      for (var i = 0; i < lis.length; i++) {
        var label = document.createElement('label');
        var box = document.createElement('input');
        box.type = 'checkbox';
        box.checked = saved.indexOf(i) > -1;
        box.addEventListener('change', function () { update(); });
        label.appendChild(box);
        var txt = document.createElement('span');
        while (lis[i].firstChild) txt.appendChild(lis[i].firstChild);
        label.appendChild(txt);
        lis[i].appendChild(label);
        boxes.push(box);
      }
      bar.appendChild(count);
      bar.appendChild(hint);
      var pb = document.createElement('button');
      pb.type = 'button';
      pb.textContent = 'Listeyi yazdır';
      pb.addEventListener('click', function () { printOnly([head, ul]); });
      bar.appendChild(pb);
      var rb = document.createElement('button');
      rb.type = 'button';
      rb.textContent = 'İşaretleri temizle';
      rb.addEventListener('click', function () { boxes.forEach(function (b) { b.checked = false; }); update(); });
      bar.appendChild(rb);
      ul.parentNode.insertBefore(bar, ul);
      update(false);
    })(head, ul, listNo++);
  }

  /* Yazdırırken kapalı soru-cevapları aç */
  var opened = [];
  window.addEventListener('beforeprint', function () {
    opened = [];
    var ds = main.querySelectorAll('.faq-block details');
    for (var j = 0; j < ds.length; j++) {
      if (!ds[j].open) { ds[j].open = true; opened.push(ds[j]); }
    }
  });
  window.addEventListener('afterprint', function () {
    for (var k = 0; k < opened.length; k++) opened[k].open = false;
    opened = [];
  });
})();
