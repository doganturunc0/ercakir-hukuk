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

  var pageTitle = document.title || 'Erçakır Hukuk Bürosu';
  var descriptionNode = head.querySelector('meta[name="description"]');
  var pageDescription = descriptionNode ? descriptionNode.getAttribute('content') : '';
  var canonicalNode = head.querySelector('link[rel="canonical"]');
  var pageUrl = canonicalNode ? canonicalNode.href : window.location.href.split('#')[0];

  addMeta('meta[name="author"]', {name: 'author', content: 'Av. Büşra Turunç'});
  addMeta('meta[property="og:type"]', {property: 'og:type', content: 'website'});
  addMeta('meta[property="og:locale"]', {property: 'og:locale', content: 'tr_TR'});
  addMeta('meta[property="og:site_name"]', {property: 'og:site_name', content: 'Erçakır Hukuk Bürosu'});
  addMeta('meta[property="og:title"]', {property: 'og:title', content: pageTitle});
  if (pageDescription) addMeta('meta[property="og:description"]', {property: 'og:description', content: pageDescription});
  addMeta('meta[property="og:url"]', {property: 'og:url', content: pageUrl});
  addMeta('meta[property="og:image"]', {property: 'og:image', content: 'https://avbusraturunc.com/assets/hero-main.webp'});
  addMeta('meta[property="og:image:alt"]', {property: 'og:image:alt', content: 'Erçakır Hukuk Bürosu - Salihli, Manisa'});
  addMeta('meta[name="twitter:card"]', {name: 'twitter:card', content: 'summary_large_image'});
  addMeta('meta[name="twitter:title"]', {name: 'twitter:title', content: pageTitle});
  if (pageDescription) addMeta('meta[name="twitter:description"]', {name: 'twitter:description', content: pageDescription});
  addMeta('meta[name="twitter:image"]', {name: 'twitter:image', content: 'https://avbusraturunc.com/assets/hero-main.webp'});

  var hasCanonicalEntities = Array.prototype.some.call(
    head.querySelectorAll('script[type="application/ld+json"]'),
    function (node) { return node.textContent.indexOf('https://avbusraturunc.com/#office') !== -1; }
  );

  if (!hasCanonicalEntities) {
    var graph = {
      '@context': 'https://schema.org',
      '@graph': [
        {'@type': ['Organization', 'LegalService'], '@id': 'https://avbusraturunc.com/#office', 'name': 'Erçakır Hukuk Bürosu', 'url': 'https://avbusraturunc.com/', 'areaServed': [{'@type': 'City', 'name': 'Salihli'}, {'@type': 'AdministrativeArea', 'name': 'Manisa'}]},
        {'@type': 'Person', '@id': 'https://avbusraturunc.com/#busra', 'name': 'Büşra Turunç', 'honorificPrefix': 'Av.', 'jobTitle': 'Avukat', 'url': 'https://avbusraturunc.com/', 'worksFor': {'@id': 'https://avbusraturunc.com/#office'}},
        {'@type': 'WebSite', '@id': 'https://avbusraturunc.com/#website', 'url': 'https://avbusraturunc.com/', 'name': 'Erçakır Hukuk Bürosu', 'inLanguage': 'tr-TR', 'publisher': {'@id': 'https://avbusraturunc.com/#office'}}
      ]
    };
    var schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify(graph);
    head.appendChild(schema);
  }

  function formatArticleDate(value) {
    if (!value) return '';
    var parts = String(value).slice(0, 10).split('-');
    if (parts.length !== 3) return '';
    var months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
    var monthIndex = Number(parts[1]) - 1;
    if (monthIndex < 0 || monthIndex > 11) return '';
    return Number(parts[2]) + ' ' + months[monthIndex] + ' ' + parts[0];
  }

  function getArticleModifiedDate() {
    var scripts = head.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < scripts.length; i++) {
      try {
        var data = JSON.parse(scripts[i].textContent || '{}');
        var nodes = [];
        if (data['@graph'] && Array.isArray(data['@graph'])) nodes = data['@graph'];
        else nodes = [data];
        for (var j = 0; j < nodes.length; j++) {
          var type = nodes[j] && nodes[j]['@type'];
          var isArticle = type === 'Article' || (Array.isArray(type) && type.indexOf('Article') !== -1);
          if (isArticle && nodes[j].dateModified) return formatArticleDate(nodes[j].dateModified);
        }
      } catch (e) {}
    }
    return '';
  }

  function standardizeLegalArticles() {
    var splitHero = document.querySelector('body.article-page .article-hero');
    var splitBody = document.querySelector('body.article-page .article-body');
    var linearArticle = document.querySelector('main.article-page');
    if (!splitHero && !linearArticle) return;

    if (!head.querySelector('link[data-legal-article-standard]')) {
      var standardCss = document.createElement('link');
      standardCss.rel = 'stylesheet';
      standardCss.href = 'legal-article-standard.css?v=20260906-1';
      standardCss.setAttribute('data-legal-article-standard', 'true');
      head.appendChild(standardCss);
    }

    if (splitHero && splitBody) {
      var wrap = splitHero.querySelector('.wrap');
      var oldBack = splitBody.querySelector('.article-back');
      if (wrap && oldBack && !wrap.querySelector('.article-back')) wrap.insertBefore(oldBack, wrap.firstChild);

      if (wrap && !wrap.querySelector('.article-meta')) {
        var h1 = wrap.querySelector('h1');
        if (h1) {
          var metaBox = document.createElement('div');
          metaBox.className = 'article-meta';
          var modified = getArticleModifiedDate();
          metaBox.innerHTML = '<strong>İçerik sorumlusu:</strong> Av. Büşra Turunç · Erçakır Hukuk Bürosu' + (modified ? '<br><small>Son güncelleme: ' + modified + '</small>' : '');
          h1.insertAdjacentElement('afterend', metaBox);
        }
      }
    }
  }

  function finalizeSharedPageQuality() {
    standardizeLegalArticles();

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

    Array.prototype.forEach.call(document.querySelectorAll('[title]'), function (node) {
      var value = (node.getAttribute('title') || '').trim();
      if (value.length > 180) node.removeAttribute('title');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', finalizeSharedPageQuality, { once: true });
  else finalizeSharedPageQuality();
})();
