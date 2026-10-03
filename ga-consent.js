(() => {
  const MEASUREMENT_ID = 'G-1EGW0PG281';
  const STORAGE_KEY = 'ercakirAnalyticsConsent';
  const SCRIPT_ID = 'ga4-script';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });
  window.gtag('js', new Date());

  const saved = (() => {
    try { return localStorage.getItem(STORAGE_KEY); }
    catch (_) { return null; }
  })();

  let configured = false;
  let loading = false;

  const loadAnalyticsScript = () => {
    if (document.getElementById(SCRIPT_ID) || loading) return;
    loading = true;
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    script.onload = () => { loading = false; };
    script.onerror = () => { loading = false; };
    document.head.appendChild(script);
  };

  const enableAnalytics = () => {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    if (!configured) {
      window.gtag('config', MEASUREMENT_ID, {
        send_page_view: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });
      configured = true;
    }
    loadAnalyticsScript();
  };

  const disableAnalytics = () => {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
  };

  const buildBanner = () => {
    const el = (tag, props, children) => {
      const node = document.createElement(tag);
      Object.entries(props || {}).forEach(([k, v]) => node.setAttribute(k, v));
      (children || []).forEach((c) => node.append(c));
      return node;
    };
    const policy = el('a', { href: 'gizlilik-cerez-politikasi.html' }, ['Gizlilik ve Çerez Politikası']);
    const text = el('p', {}, ['Site kullanımını anlamak ve iyileştirmek için Google Analytics kullanılabilir. Analiz ölçümü yalnızca izin verirseniz etkinleşir. Ayrıntılar için ', policy, '.']);
    const actions = el('div', { class: 'analytics-consent-actions' }, [
      el('button', { class: 'reject', id: 'analyticsReject', type: 'button' }, ['Reddet']),
      el('button', { class: 'accept', id: 'analyticsAccept', type: 'button' }, ['İzin Ver'])
    ]);
    return el('div', { class: 'analytics-consent', id: 'analyticsConsent', role: 'region', 'aria-label': 'Analiz tercihi' }, [text, actions]);
  };

  if (saved === 'granted') enableAnalytics();
  else disableAnalytics();

  document.addEventListener('DOMContentLoaded', () => {
    // On narrow viewports these sections must participate in normal layout.
    // Deferring them with content-visibility can leave the footer temporarily
    // occupying the same paint area during automated and assistive rendering.
    if (window.matchMedia('(max-width: 900px)').matches) {
      document.querySelectorAll('.legal-content-showcase, .contact-section, footer').forEach((node) => {
        node.style.contentVisibility = 'visible';
        node.style.containIntrinsicSize = 'none';
      });
    }

    // index.html ships the banner as static markup; every other page gets the same banner built here.
    if (!document.getElementById('analyticsConsent') && saved !== 'granted' && saved !== 'denied' && document.body) {
      document.body.appendChild(buildBanner());
    }

    const banner = document.getElementById('analyticsConsent');
    const accept = document.getElementById('analyticsAccept');
    const reject = document.getElementById('analyticsReject');
    if (!banner || !accept || !reject) return;

    if (saved === 'granted' || saved === 'denied') banner.hidden = true;

    accept.addEventListener('click', () => {
      try { localStorage.setItem(STORAGE_KEY, 'granted'); } catch (_) {}
      enableAnalytics();
      banner.hidden = true;
    });

    reject.addEventListener('click', () => {
      try { localStorage.setItem(STORAGE_KEY, 'denied'); } catch (_) {}
      disableAnalytics();
      banner.hidden = true;
    });
  }, { once: true });
})();
