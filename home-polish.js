/* Social links and contact-map presentation enhancements. */
(() => {
  const instagramUrl = 'https://www.instagram.com/ercakirhukuk/';
  const facebookUrl = 'https://www.facebook.com/share/1ZRAvLbAjY/?mibextid=wwXIfr';
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Er%C3%A7ak%C4%B1r+Hukuk+B%C3%BCrosu+Salihli+Manisa';
  const embedUrl = 'https://www.google.com/maps?q=Er%C3%A7ak%C4%B1r%20Hukuk%20B%C3%BCrosu%20Salihli%20Manisa&output=embed';

  const instagramIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle class="fill-dot" cx="17.4" cy="6.7" r="1.1"></circle></svg>';
  const facebookIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="fb-fill" d="M13.7 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5H17V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.5V13h2.8v8h3.4Z"></path></svg>';
  const socialMarkup = `<span>SOSYAL MEDYA</span><div><a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" aria-label="Erçakır Hukuk Bürosu Instagram hesabı">${instagramIcon}<span>Instagram</span><b>@ercakirhukuk</b></a><a href="${facebookUrl}" target="_blank" rel="noopener noreferrer" aria-label="Erçakır Hukuk Bürosu Facebook hesabı">${facebookIcon}<span>Facebook</span><b>Erçakır Hukuk Bürosu</b></a></div>`;

  const contactSection = document.querySelector('.contact-section');
  const contactCopy = document.querySelector('.contact-copy');
  if (contactCopy) {
    const address = contactCopy.querySelector('.contact-address');
    if (address && !address.querySelector('a')) {
      const addressText = address.textContent.replace(/^Adres:\s*/i, '').trim();
      address.innerHTML = '<strong>Adres:</strong> ';
      const link = document.createElement('a');
      link.href = mapsUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.className = 'location-link'; link.textContent = addressText;
      address.appendChild(link);
    }

    const phoneButton = Array.from(contactCopy.querySelectorAll('a')).find(a => /^tel:/i.test(a.getAttribute('href') || ''));
    if (phoneButton && !contactCopy.querySelector('.directions-button')) {
      const actions = document.createElement('div');
      actions.className = 'contact-actions';
      phoneButton.parentNode.insertBefore(actions, phoneButton);
      actions.appendChild(phoneButton);
      const directions = document.createElement('a');
      directions.href = mapsUrl;
      directions.target = '_blank';
      directions.rel = 'noopener noreferrer';
      directions.className = 'directions-button';
      directions.setAttribute('aria-label', 'Erçakır Hukuk Bürosu konumuna git');
      directions.innerHTML = '<span class="directions-pin" aria-hidden="true">⌖</span><span>Konuma Git</span>';
      actions.appendChild(directions);
    }

    let social = contactCopy.querySelector('.social-links');
    if (!social) { social = document.createElement('div'); social.className = 'social-links'; contactCopy.appendChild(social); }
    social.innerHTML = socialMarkup;
  }

  if (contactSection) {
    contactSection.querySelectorAll('.map-card,.map-preview-compact').forEach(el => el.remove());
    const map = document.createElement('div');
    map.className = 'office-map-compact';
    map.innerHTML = `<iframe class="office-map-frame" title="Erçakır Hukuk Bürosu Google Maps konumu" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${embedUrl}"></iframe><a class="map-overlay-link" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">Google Maps’te Aç ↗</a>`;
    contactSection.appendChild(map);
  }

  const footer = document.querySelector('footer');
  if (footer) {
    let footerSocial = footer.querySelector('.footer-social');
    if (!footerSocial) { footerSocial = document.createElement('div'); footerSocial.className = 'footer-social'; footer.appendChild(footerSocial); }
    footerSocial.innerHTML = `<a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" aria-label="Erçakır Hukuk Bürosu Instagram hesabı" title="Instagram">${instagramIcon}</a><a href="${facebookUrl}" target="_blank" rel="noopener noreferrer" aria-label="Erçakır Hukuk Bürosu Facebook hesabı" title="Facebook">${facebookIcon}</a>`;
  }
})();