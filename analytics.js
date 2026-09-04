/* Privacy-first analytics gate.
 * Analytics remains disabled unless a future explicit opt-in mechanism
 * deliberately enables it. No Google Analytics configuration is executed
 * by default, so visiting the site does not start analytics tracking here.
 */
window.dataLayer = window.dataLayer || [];
window.ercakirAnalyticsEnabled = false;

(function () {
  var head = document.head;
  if (!head) return;

  function addMeta(selector, attrs) {
    if (head.querySelector(selector)) return;
    var meta = document.createElement('meta');
    Object.keys(attrs).forEach(function (key) { meta.setAttribute(key, attrs[key]); });
    head.appendChild(meta);
  }

  addMeta('meta[name="author"]', {name: 'author', content: 'Av. Büşra Turunç'});
  addMeta('meta[property="og:image"]', {property: 'og:image', content: 'https://avbusraturunc.com/assets/hero-main.webp'});
  addMeta('meta[property="og:image:alt"]', {property: 'og:image:alt', content: 'Erçakır Hukuk Bürosu - Salihli, Manisa'});
  addMeta('meta[property="og:site_name"]', {property: 'og:site_name', content: 'Erçakır Hukuk Bürosu'});
  addMeta('meta[property="og:locale"]', {property: 'og:locale', content: 'tr_TR'});

  var hasCanonicalEntities = Array.prototype.some.call(
    head.querySelectorAll('script[type="application/ld+json"]'),
    function (node) {
      return node.textContent.indexOf('https://avbusraturunc.com/#office') !== -1;
    }
  );

  if (!hasCanonicalEntities) {
    var graph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['Organization', 'LegalService'],
          '@id': 'https://avbusraturunc.com/#office',
          'name': 'Erçakır Hukuk Bürosu',
          'url': 'https://avbusraturunc.com/',
          'areaServed': [
            {'@type': 'City', 'name': 'Salihli'},
            {'@type': 'AdministrativeArea', 'name': 'Manisa'}
          ]
        },
        {
          '@type': 'Person',
          '@id': 'https://avbusraturunc.com/#busra',
          'name': 'Büşra Turunç',
          'honorificPrefix': 'Av.',
          'jobTitle': 'Avukat',
          'url': 'https://avbusraturunc.com/',
          'worksFor': {'@id': 'https://avbusraturunc.com/#office'}
        },
        {
          '@type': 'WebSite',
          '@id': 'https://avbusraturunc.com/#website',
          'url': 'https://avbusraturunc.com/',
          'name': 'Erçakır Hukuk Bürosu',
          'inLanguage': 'tr-TR',
          'publisher': {'@id': 'https://avbusraturunc.com/#office'}
        }
      ]
    };
    var schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify(graph);
    head.appendChild(schema);
  }

  function finalizeSharedPageQuality() {
    var footer = document.querySelector('footer');
    if (footer) {
      var links = [
        { href: 'kvkk-aydinlatma-metni.html', label: 'KVKK Aydınlatma Metni' },
        { href: 'gizlilik-cerez-politikasi.html', label: 'Gizlilik ve Çerez Politikası' },
        { href: 'iletisim.html', label: 'İletişim' }
      ];
      links.forEach(function (item) {
        var exists = Array.prototype.some.call(footer.querySelectorAll('a[href]'), function (anchor) {
          var href = anchor.getAttribute('href') || '';
          return href === item.href || href.endsWith('/' + item.href);
        });
        if (!exists) {
          footer.appendChild(document.createTextNode(' · '));
          var anchor = document.createElement('a');
          anchor.href = item.href;
          anchor.textContent = item.label;
          footer.appendChild(anchor);
        }
      });
    }

    /* Remove only paragraph-like tooltip titles. Short, useful link titles stay. */
    Array.prototype.forEach.call(document.querySelectorAll('[title]'), function (node) {
      var value = (node.getAttribute('title') || '').trim();
      if (value.length > 180) node.removeAttribute('title');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', finalizeSharedPageQuality, { once: true });
  } else {
    finalizeSharedPageQuality();
  }
})();
