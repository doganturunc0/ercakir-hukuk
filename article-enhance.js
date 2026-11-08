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
