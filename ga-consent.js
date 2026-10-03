(() => {
  const MEASUREMENT_ID = 'G-1EGW0PG281';
  const STORAGE_KEY = 'ercakirAnalyticsConsent';
  const SCRIPT_ID = 'ga4-script';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };

  // Consent Mode v2 defaults: nothing is granted until the visitor chooses "İzin Ver".
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });
  window.gtag('js', new Date());

  const readChoice = () => {
    try { return localStorage.getItem(STORAGE_KEY); }
    catch (_) { return null; }
  };
  const storeChoice = (value) => {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (_) {}
  };
  const saved = readChoice();

  let configured = false;
  let loading = false;

  // gtag.js is only requested after consent; before that no Google request is made at all.
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

  // Removes Google Analytics cookies (_ga, _ga_<id>) for this host and its parent domain.
  const deleteAnalyticsCookies = () => {
    const host = location.hostname;
    const domains = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => /^_ga(_|$)/.test(n)).forEach((name) => {
      domains.forEach((d) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? '; domain=' + d : ''}`;
      });
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

  // "Çerez Tercihleri" control: in the existing footer when there is one, otherwise a small line at the end of the page.
  const addPreferencesControl = (openBanner) => {
    if (document.querySelector('[data-consent-preferences]')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'consent-preferences-button';
    button.setAttribute('data-consent-preferences', '');
    button.setAttribute('aria-controls', 'analyticsConsent');
    button.textContent = 'Çerez Tercihleri';
    button.addEventListener('click', openBanner);
    const footer = document.querySelector('footer');
    if (footer) {
      const social = footer.querySelector('.footer-social');
      const wrap = document.createElement('span');
      wrap.className = 'consent-preferences-inline';
      wrap.append(' · ', button);
      if (social) footer.insertBefore(wrap, social); else footer.appendChild(wrap);
    } else {
      const bar = document.createElement('div');
      bar.className = 'consent-preferences-bar';
      bar.appendChild(button);
      document.body.appendChild(bar);
    }
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
    if (!document.body) return;

    // index.html ships the banner as static markup; every other page gets the same banner built here.
    if (!document.getElementById('analyticsConsent')) {
      const built = buildBanner();
      built.hidden = saved === 'granted' || saved === 'denied';
      document.body.appendChild(built);
    }

    const banner = document.getElementById('analyticsConsent');
    const accept = document.getElementById('analyticsAccept');
    const reject = document.getElementById('analyticsReject');
    if (!banner || !accept || !reject) return;

    if (saved === 'granted' || saved === 'denied') banner.hidden = true;

    const openBanner = () => {
      banner.hidden = false;
      (readChoice() === 'granted' ? reject : accept).focus();
    };
    addPreferencesControl(openBanner);

    accept.addEventListener('click', () => {
      storeChoice('granted');
      enableAnalytics();
      banner.hidden = true;
    });

    reject.addEventListener('click', () => {
      const wasActive = configured || !!document.getElementById(SCRIPT_ID);
      storeChoice('denied');
      disableAnalytics();
      deleteAnalyticsCookies();
      banner.hidden = true;
      // If GA4 was already running on this page, reload so no Google tag stays loaded after withdrawal.
      if (wasActive) location.reload();
    });
  }, { once: true });
})();
