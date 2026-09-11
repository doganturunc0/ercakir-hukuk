/* Social links are added as a lightweight presentation enhancement. */
(() => {
  const instagramUrl = 'https://www.instagram.com/ercakirhukuk/';
  const facebookUrl = 'https://www.facebook.com/share/1ZRAvLbAjY/?mibextid=wwXIfr';

  const instagramIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle class="fill-dot" cx="17.4" cy="6.7" r="1.1"></circle></svg>';
  const facebookIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="fb-fill" d="M13.7 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5H17V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.5V13h2.8v8h3.4Z"></path></svg>';

  const socialMarkup = `
    <span>SOSYAL MEDYA</span>
    <div>
      <a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" aria-label="Erçakır Hukuk Bürosu Instagram hesabı">
        ${instagramIcon}<span>Instagram</span><b>@ercakirhukuk</b>
      </a>
      <a href="${facebookUrl}" target="_blank" rel="noopener noreferrer" aria-label="Erçakır Hukuk Bürosu Facebook hesabı">
        ${facebookIcon}<span>Facebook</span><b>Erçakır Hukuk Bürosu</b>
      </a>
    </div>`;

  const contactCopy = document.querySelector('.contact-copy');
  if (contactCopy) {
    let social = contactCopy.querySelector('.social-links');
    if (!social) {
      social = document.createElement('div');
      social.className = 'social-links';
      social.setAttribute('aria-label', 'Sosyal medya hesapları');
      contactCopy.appendChild(social);
    }
    social.innerHTML = socialMarkup;
  }

  const footer = document.querySelector('footer');
  if (footer) {
    let footerSocial = footer.querySelector('.footer-social');
    if (!footerSocial) {
      footerSocial = document.createElement('div');
      footerSocial.className = 'footer-social';
      footerSocial.setAttribute('aria-label', 'Sosyal medya');
      footer.appendChild(footerSocial);
    }
    footerSocial.innerHTML = `
      <a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" aria-label="Erçakır Hukuk Bürosu Instagram hesabı" title="Instagram">${instagramIcon}</a>
      <a href="${facebookUrl}" target="_blank" rel="noopener noreferrer" aria-label="Erçakır Hukuk Bürosu Facebook hesabı" title="Facebook">${facebookIcon}</a>`;
  }
})();