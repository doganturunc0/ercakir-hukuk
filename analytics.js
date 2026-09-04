/* Privacy-first analytics gate.
 * Analytics remains disabled unless a future explicit opt-in mechanism
 * deliberately enables it. No Google Analytics configuration is executed
 * by default, so visiting the site does not start analytics tracking here.
 */
window.dataLayer = window.dataLayer || [];
window.ercakirAnalyticsEnabled = false;

/* Shared SEO/GEO entity supplement.
 * Keeps content pages tied to the same canonical person, office and website
 * entities without changing page copy or starting analytics tracking.
 */
(function () {
  var head = document.head;
  if (!head) return;

  if (!head.querySelector('meta[name="author"]')) {
    var author = document.createElement('meta');
    author.name = 'author';
    author.content = 'Av. Büşra Turunç';
    head.appendChild(author);
  }

  if (!head.querySelector('meta[property="og:image"]')) {
    var image = document.createElement('meta');
    image.setAttribute('property', 'og:image');
    image.content = 'https://avbusraturunc.com/assets/hero-main.webp';
    head.appendChild(image);
  }

  if (!head.querySelector('meta[property="og:image:alt"]')) {
    var imageAlt = document.createElement('meta');
    imageAlt.setAttribute('property', 'og:image:alt');
    imageAlt.content = 'Erçakır Hukuk Bürosu - Salihli, Manisa';
    head.appendChild(imageAlt);
  }

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

  /* Keep footer legal/navigation links consistent without altering page copy.
   * Existing links are preserved; only missing links are appended.
   */
  function ensureFooterLinks() {
    var footer = document.querySelector('footer');
    if (!footer) return;

    var links = [
      { href: 'kvkk-aydinlatma-metni.html', label: 'KVKK Aydınlatma Metni' },
      { href: 'gizlilik-cerez-politikasi.html', label: 'Gizlilik ve Çerez Politikası' },
      { href: 'iletisim.html', label: 'İletişim' }
    ];

    links.forEach(function (item) {
      var exists = Array.prototype.some.call(
        footer.querySelectorAll('a[href]'),
        function (anchor) {
          var href = anchor.getAttribute('href') || '';
          return href === item.href || href.endsWith('/' + item.href);
        }
      );

      if (!exists) {
        footer.appendChild(document.createTextNode(' · '));
        var anchor = document.createElement('a');
        anchor.href = item.href;
        anchor.textContent = item.label;
        footer.appendChild(anchor);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureFooterLinks, { once: true });
  } else {
    ensureFooterLinks();
  }
})();
