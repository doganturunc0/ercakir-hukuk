(function () {
  'use strict';
  var finder = document.getElementById('mahkeme-bul');
  if (!finder) return;
  var konu = document.getElementById('mbKonu');
  var ilce = document.getElementById('mbIlce');
  var out = document.getElementById('mbSonuc');
  var ADRES = {
    Demirci: 'Demirci Adliyesi: Hacıhasan Mahallesi Hükümet Konağı No:1',
    Kula: 'Kula Adliyesi: 4 Eylül Mahallesi Yabaayak Caddesi No:1',
    Selendi: 'Selendi Adliyesi: Kurtuluş Mahallesi Garaj Caddesi'
  };
  var DE = { Demirci: "Demirci'de", Kula: "Kula'da", Selendi: "Selendi'de" };

  function localize(text, place) {
    return text
      .replace(/Demirci, Kula veya Selendi/g, place)
      .replace(/Demirci, Kula ve Selendi adliyelerinde/g, place + ' Adliyesi\'nde')
      .replace(/Bu ilçelerde/g, DE[place])
      .replace(/Bu adliyelerde/g, place + ' Adliyesi\'nde');
  }

  function render() {
    var id = konu.value;
    var place = ilce.value;
    out.textContent = '';
    if (!id) {
      out.textContent = 'Konu seçtiğinizde sonuç burada gösterilecektir.';
      return;
    }
    var src = document.getElementById(id);
    if (!src) return;
    var h = document.createElement('h3');
    h.textContent = src.querySelector('h2').textContent + ' · ' + place;
    out.appendChild(h);
    var dl = document.createElement('dl');
    dl.className = 'court-facts';
    var rows = src.querySelectorAll('.court-row');
    for (var i = 0; i < rows.length; i++) {
      var yer = rows[i].getAttribute('data-yer');
      if (yer === 'salihli' && place !== 'Salihli') continue;
      if (yer === 'ilce' && place === 'Salihli') continue;
      var row = rows[i].cloneNode(true);
      if (yer === 'ilce') {
        row.querySelector('dt').textContent = place;
        var dd = row.querySelector('dd');
        dd.textContent = localize(dd.textContent, place);
        if (id !== 'idari') {
          var adr = document.createElement('span');
          adr.className = 'court-address';
          adr.textContent = ADRES[place];
          dd.appendChild(adr);
        }
      }
      dl.appendChild(row);
    }
    out.appendChild(dl);
    var links = src.querySelector('.court-links');
    if (links) out.appendChild(links.cloneNode(true));
    var more = document.createElement('a');
    more.className = 'court-more';
    more.href = '#' + id;
    more.textContent = 'Bu konunun ayrıntısı aşağıda →';
    out.appendChild(more);
    if (window.history && history.replaceState) {
      history.replaceState(null, '', '?konu=' + encodeURIComponent(id) + '&ilce=' + encodeURIComponent(place));
    }
  }

  konu.addEventListener('change', render);
  ilce.addEventListener('change', render);
  var params = new URLSearchParams(window.location.search);
  var k0 = params.get('konu'), i0 = params.get('ilce');
  if (i0 && ADRES[i0]) ilce.value = i0;
  if (k0 && document.getElementById(k0) && konu.querySelector('option[value="' + k0.replace(/[^a-z]/g, '') + '"]')) {
    konu.value = k0;
  }
  finder.hidden = false;
  render();
})();
