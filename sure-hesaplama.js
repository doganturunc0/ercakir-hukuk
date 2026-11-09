(function () {
  'use strict';
  var OPS = [{"id": "cevap", "g": "Hukuk davaları (HMK)", "t": "Cevap dilekçesi", "n": 2, "u": "hafta", "r": "HMK", "bas": "Dava dilekçesinin tebliğ tarihi", "d": "HMK m.127"}, {"id": "hmk_istinaf", "g": "Hukuk davaları (HMK)", "t": "Hukuk mahkemesi kararına istinaf", "n": 2, "u": "hafta", "r": "HMK", "bas": "Gerekçeli kararın tebliğ tarihi", "d": "HMK m.345"}, {"id": "hmk_temyiz", "g": "Hukuk davaları (HMK)", "t": "Bölge adliye mahkemesi kararına temyiz", "n": 2, "u": "hafta", "r": "HMK", "bas": "Kararın tebliğ tarihi", "d": "HMK m.361"}, {"id": "cmk_istinaf", "g": "Ceza davaları (CMK)", "t": "Ceza mahkemesi hükmüne istinaf", "n": 2, "u": "hafta", "r": "CMK", "bas": "Gerekçeli hükmün tebliğ tarihi", "d": "CMK m.273"}, {"id": "cmk_temyiz", "g": "Ceza davaları (CMK)", "t": "Ceza hükmüne temyiz", "n": 2, "u": "hafta", "r": "CMK", "bas": "Gerekçeli hükmün tebliğ tarihi", "d": "CMK m.291"}, {"id": "cmk_itiraz", "g": "Ceza davaları (CMK)", "t": "Hâkim veya mahkeme kararına itiraz (tutuklama, adli kontrol vb.)", "n": 2, "u": "hafta", "r": "CMK", "bas": "Kararın öğrenildiği tarih", "d": "CMK m.268"}, {"id": "kyok", "g": "Ceza davaları (CMK)", "t": "Kovuşturmaya yer olmadığı kararına itiraz", "n": 2, "u": "hafta", "r": "CMK", "bas": "Kararın tebliğ tarihi", "d": "CMK m.173"}, {"id": "odeme_emri", "g": "İcra takipleri (İİK)", "t": "Ödeme emrine itiraz (genel haciz yolu)", "n": 7, "u": "gun", "r": "IIK", "bas": "Ödeme emrinin tebliğ tarihi", "d": "İİK m.62"}, {"id": "kambiyo", "g": "İcra takipleri (İİK)", "t": "Kambiyo senedine (çek, bono) dayalı takipte itiraz", "n": 5, "u": "gun", "r": "IIK", "bas": "Ödeme emrinin tebliğ tarihi", "d": "İİK m.168"}, {"id": "sikayet", "g": "İcra takipleri (İİK)", "t": "İcra dairesinin işlemine şikâyet", "n": 7, "u": "gun", "r": "IIK", "bas": "İşlemin öğrenildiği tarih", "d": "İİK m.16"}, {"id": "itirazin_iptali", "g": "İcra takipleri (İİK)", "t": "İtirazın iptali davası", "n": 1, "u": "yil", "r": "IIK", "bas": "Borçlunun itirazının alacaklıya tebliğ tarihi", "d": "İİK m.67"}, {"id": "iptal_davasi", "g": "İdari davalar (İYUK)", "t": "İdari işleme karşı iptal davası", "n": 60, "u": "gun", "r": "IYUK", "bas": "İşlemin yazılı bildirim tarihi", "d": "İYUK m.7"}];
  var HOL = {"fixed": {"01-01": "Yılbaşı", "04-23": "Ulusal Egemenlik ve Çocuk Bayramı", "05-01": "Emek ve Dayanışma Günü", "05-19": "Atatürk'ü Anma, Gençlik ve Spor Bayramı", "07-15": "Demokrasi ve Milli Birlik Günü", "08-30": "Zafer Bayramı", "10-29": "Cumhuriyet Bayramı"}, "fixedHalf": {"10-28": "Cumhuriyet Bayramı arifesi (13.00'ten itibaren tatil)"}, "years": {"2026": {"full": {"2026-03-20": "Ramazan Bayramı 1. gün", "2026-03-21": "Ramazan Bayramı 2. gün", "2026-03-22": "Ramazan Bayramı 3. gün", "2026-05-27": "Kurban Bayramı 1. gün", "2026-05-28": "Kurban Bayramı 2. gün", "2026-05-29": "Kurban Bayramı 3. gün", "2026-05-30": "Kurban Bayramı 4. gün"}, "half": {"2026-03-19": "Ramazan Bayramı arifesi (13.00'ten itibaren tatil)", "2026-05-26": "Kurban Bayramı arifesi (13.00'ten itibaren tatil)"}}, "2027": {"full": {"2027-03-09": "Ramazan Bayramı 1. gün", "2027-03-10": "Ramazan Bayramı 2. gün", "2027-03-11": "Ramazan Bayramı 3. gün", "2027-05-16": "Kurban Bayramı 1. gün", "2027-05-17": "Kurban Bayramı 2. gün", "2027-05-18": "Kurban Bayramı 3. gün", "2027-05-19": "Kurban Bayramı 4. gün"}, "half": {"2027-03-08": "Ramazan Bayramı arifesi (13.00'ten itibaren tatil)", "2027-05-15": "Kurban Bayramı arifesi (13.00'ten itibaren tatil)"}}}};
  var box = document.getElementById('sure-hesapla');
  if (!box) return;
  var sel = document.getElementById('shIslem');
  var inp = document.getElementById('shTarih');
  var wrap = document.getElementById('shTatilWrap');
  var chk = document.getElementById('shTatilDisi');
  var btn = document.getElementById('shBtn');
  var out = document.getElementById('shSonuc');
  var COVERED_UNTIL = '2027-12-31';
  var GUN = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  var AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  var UNIT = { gun: 'gün', hafta: 'hafta', ay: 'ay', yil: 'yıl' };

  function parse(s) { var p = s.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function iso(d) { return d.toISOString().slice(0, 10); }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setUTCDate(x.getUTCDate() + n); return x; }
  function addMonths(d, n) {
    var y = d.getUTCFullYear(), m = d.getUTCMonth() + n, day = d.getUTCDate();
    y += Math.floor(m / 12); m = ((m % 12) + 12) % 12;
    var last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    return new Date(Date.UTC(y, m, Math.min(day, last)));
  }
  function fmt(d) { return d.getUTCDate() + ' ' + AY[d.getUTCMonth()] + ' ' + d.getUTCFullYear() + ' ' + GUN[d.getUTCDay()]; }
  function holiday(d) {
    var s = iso(d), md = s.slice(5), yr = HOL.years[s.slice(0, 4)];
    if (HOL.fixed[md]) return { full: true, name: HOL.fixed[md] };
    if (yr && yr.full[s]) return { full: true, name: yr.full[s] };
    var w = d.getUTCDay();
    if (w === 0 || w === 6) return { full: true, name: w === 6 ? 'Cumartesi' : 'Pazar' };
    if (HOL.fixedHalf[md]) return { full: false, name: HOL.fixedHalf[md] };
    if (yr && yr.half[s]) return { full: false, name: yr.half[s] };
    return null;
  }
  function inAdliTatil(d) {
    var y = d.getUTCFullYear(), t = d.getTime();
    return t >= Date.UTC(y, 6, 20) && t <= Date.UTC(y, 7, 31);
  }
  function li(text) { var e = document.createElement('li'); e.textContent = text; return e; }

  function calc() {
    out.textContent = '';
    var op = null;
    for (var i = 0; i < OPS.length; i++) if (OPS[i].id === sel.value) op = OPS[i];
    if (!op || !inp.value) { out.textContent = 'Lütfen işlemi ve tarihi seçin.'; return; }
    var start = parse(inp.value);
    var steps = [];
    var end;
    if (op.u === 'gun') end = addDays(start, op.n);
    else if (op.u === 'hafta') end = addDays(start, 7 * op.n);
    else if (op.u === 'ay') end = addMonths(start, op.n);
    else end = addMonths(start, 12 * op.n);
    steps.push(op.t + ' için süre ' + op.n + ' ' + UNIT[op.u] + ' (' + op.d + '). Tebliğ/öğrenme günü hesaba katılmadığında süre ' + fmt(end) + ' günü dolar.');

    var y = end.getUTCFullYear();
    if (inAdliTatil(end)) {
      if (op.r === 'HMK' && !chk.checked) {
        end = new Date(Date.UTC(y, 8, 7));
        steps.push('Bu tarih adli tatile (20 Temmuz–31 Ağustos) denk geldiği için süre, adli tatilin bittiği günden itibaren bir hafta uzar (HMK m.104): ' + fmt(end) + '.');
      } else if (op.r === 'HMK') {
        steps.push('Dosya adli tatilde de görülen işlerden olduğu için adli tatil uzatması uygulanmadı (HMK m.103).');
      } else if (op.r === 'CMK') {
        end = new Date(Date.UTC(y, 8, 3));
        steps.push('Bu tarih adli tatile denk geldiği için süre, tatilin bittiği günden itibaren üç gün uzar (CMK m.331): ' + fmt(end) + '. Tutuklu işlerde ve tatilde yürütülen işlerde farklılık olabilir.');
      } else if (op.r === 'IYUK') {
        end = new Date(Date.UTC(y, 8, 7));
        steps.push('Bu tarih idari yargıdaki ara verme dönemine denk geldiği için süre yedi gün uzar (İYUK m.8): ' + fmt(end) + '.');
      } else {
        steps.push('Son gün adli tatil dönemine denk geliyor; HMK m.104\'teki uzatma HMK süreleri için olduğundan araç İİK süresinde uzatma uygulamadı.');
      }
    }
    var moved = false, guard = 0, h;
    while ((h = holiday(end)) && h.full && guard++ < 20) {
      steps.push(fmt(end) + ' tatil (' + h.name + '); süre ilk iş gününe kayar.');
      end = addDays(end, 1); moved = true;
    }
    var half = holiday(end);
    var warn = [];
    if (half && !half.full) warn.push('Son gün ' + half.name + '. Bu gün saat 13.00\'ten itibaren tatil olduğundan araç süreyi uzatmadı; başvurunuzu öğleden önce yapmanız güvenli olur.');
    if (iso(end) > COVERED_UNTIL) warn.push('Son gün 2028 yılına denk geliyor. Araçta 2028 dini bayram tarihleri henüz yer almadığından sonucu resmî tatil takvimiyle ayrıca kontrol edin.');
    if (inp.value < '2026-01-01') warn.push('Başlangıç tarihi 2025 yılında; 2025 tatillerinin süreye etkisi ayrıca kontrol edilmelidir.');

    var h3 = document.createElement('p');
    h3.className = 'sure-son';
    h3.textContent = 'Son gün: ' + fmt(end);
    out.appendChild(h3);
    var ul = document.createElement('ul');
    ul.className = 'sure-steps';
    steps.forEach(function (s) { ul.appendChild(li(s)); });
    if (!moved && steps.length === 1) ul.appendChild(li('Son gün iş gününe denk geldiği için ayrıca uzama olmadı.'));
    out.appendChild(ul);
    warn.forEach(function (w) { var p = document.createElement('p'); p.className = 'sure-warn'; p.textContent = w; out.appendChild(p); });
  }

  function syncWrap() {
    var op = null;
    for (var i = 0; i < OPS.length; i++) if (OPS[i].id === sel.value) op = OPS[i];
    wrap.hidden = !(op && op.r === 'HMK');
    if (wrap.hidden) chk.checked = false;
  }
  sel.addEventListener('change', function () { syncWrap(); if (inp.value) calc(); });
  inp.addEventListener('change', function () { if (sel.value) calc(); });
  chk.addEventListener('change', function () { if (sel.value && inp.value) calc(); });
  btn.addEventListener('click', calc);
  box.hidden = false;

})();
