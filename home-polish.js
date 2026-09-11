/* Social links are added as a lightweight presentation enhancement.
   The canonical Instagram URL remains present in the page's structured data. */
(() => {
  const instagramUrl = 'https://www.instagram.com/ercakirhukuk/';
  const instagramIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle class="fill-dot" cx="17.4" cy="6.7" r="1.1"></circle></svg>';

  const contactCopy = document.querySelector('.contact-copy');
  if (contactCopy && !contactCopy.querySelector('.social-links')) {
    const social = document.createElement('div');
    social.className = 'social-links';
    social.setAttribute('aria-label', 'Sosyal medya hesapları');
    social.innerHTML = `<span>SOSYAL MEDYA</span><div><a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" aria-label="Erçakır Hukuk Bürosu Instagram hesabı">${instagramIcon}<span>Instagram</span><b>@ercakirhukuk</b></a></div>`;
    contactCopy.appendChild(social);
  }

  const footer = document.querySelector('footer');
  if (footer && !footer.querySelector('.footer-social')) {
    const footerSocial = document.createElement('div');
    footerSocial.className = 'footer-social';
    footerSocial.setAttribute('aria-label', 'Sosyal medya');
    footerSocial.innerHTML = `<a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" aria-label="Erçakır Hukuk Bürosu Instagram hesabı" title="Instagram">${instagramIcon}</a>`;
    footer.appendChild(footerSocial);
  }
})();