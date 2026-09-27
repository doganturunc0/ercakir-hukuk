(() => {
  const selector = 'a[href="#iletisim"]';
  const scrollToContact = () => {
    const target = document.getElementById('iletisim');
    if (!target) return;
    const header = document.getElementById('siteHeader');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const top = window.scrollY + target.getBoundingClientRect().top - headerHeight - 12;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };

  document.addEventListener('click', event => {
    const link = event.target.closest(selector);
    if (!link) return;
    event.preventDefault();
    history.replaceState(null, '', '#iletisim');
    scrollToContact();
    [250, 700, 1400].forEach(delay => window.setTimeout(scrollToContact, delay));
  });

  if (location.hash === '#iletisim') {
    window.addEventListener('load', () => {
      scrollToContact();
      [300, 900, 1600].forEach(delay => window.setTimeout(scrollToContact, delay));
    }, { once: true });
  }
})();