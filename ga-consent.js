(() => {
  const MEASUREMENT_ID = 'G-1E6W6P6281';
  const STORAGE_KEY = 'ercakirAnalyticsConsent';

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
  };

  const disableAnalytics = () => {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
  };

  if (saved === 'granted') enableAnalytics();
  else disableAnalytics();

  document.addEventListener('DOMContentLoaded', () => {
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
