/* Social links and contact-map presentation enhancements. */
(() => {
  const instagramUrl = 'https://www.instagram.com/ercakirhukuk/';
  const facebookUrl = 'https://www.facebook.com/share/1ZRAvLbAjY/?mibextid=wwXIfr';
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Er%C3%A7ak%C4%B1r+Hukuk+B%C3%BCrosu+Salihli+Manisa';

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

  const contactSection = document.querySelector('.contact-section');
  const contactCopy = document.querySelector('.contact-copy');

  if (contactCopy) {
    const address = contactCopy.querySelector('.contact-address');
    if (address && !address.querySelector('a')) {
      const strong = address.querySelector('strong');
      const addressText = address.textContent.replace(/^Adres:\s*/i, '').trim();
      address.textContent = '';
      if (strong) address.appendChild(strong);
      else {
        const label = document.createElement('strong');
        label.textContent = 'Adres:';
        address.appendChild(label);
      }
      address.appendChild(document.createTextNode(' '));
      const addressLink = document.createElement('a');
      addressLink.href = mapsUrl;
      addressLink.target = '_blank';
      addressLink.rel = 'noopener noreferrer';
      addressLink.className = 'location-link';
      addressLink.textContent = addressText;
      addressLink.setAttribute('aria-label', 'Erçakır Hukuk Bürosu konumunu Google Maps üzerinde aç');
      address.appendChild(addressLink);
    }

    let social = contactCopy.querySelector('.social-links');
    if (!social) {
      social = document.createElement('div');
      social.className = 'social-links';
      social.setAttribute('aria-label', 'Sosyal medya hesapları');
      contactCopy.appendChild(social);
    }
    social.innerHTML = socialMarkup;
  }

  if (contactSection && !contactSection.querySelector('.map-card')) {
    const mapCard = document.createElement('a');
    mapCard.className = 'map-card';
    mapCard.href = mapsUrl;
    mapCard.target = '_blank';
    mapCard.rel = 'noopener noreferrer';
    mapCard.setAttribute('aria-label', 'Erçakır Hukuk Bürosu Salihli konumunu Google Maps üzerinde aç');
    mapCard.innerHTML = `
      <div>
        <span>GOOGLE MAPS</span>
        <h3>Erçakır Hukuk Bürosu</h3>
        <p>Zafer Mahallesi, Belediye Caddesi, Zaroğlu İş Merkezi No: 71/1, Kat: 3, No: 316 · Salihli / Manisa</p>
        <b>Haritada görüntüle →</b>
      </div>
      <svg class="map-card-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"></path><circle cx="12" cy="10" r="2.2"></circle></svg>`;
    contactSection.appendChild(mapCard);
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