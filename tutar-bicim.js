/* Tutar kutularında yazarken binlik ayıracı (2.223.402,50).
   data-tutar özniteliği taşıyan kutular metin kutusuna çevrilir; kutuda biçimli tutar görünür,
   hesaplama kodu ise .value üzerinden düz sayıyı ("2223402.5") okumaya devam eder. */
(function () {
  'use strict';
  var D = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  if (!D || !D.get || !D.set) return;
  var MAX_INT = 15, MAX_DEC = 2;

  // Parça: {neg, int, sep, dec} → kutuda görünen metin
  function render(p) {
    var i = p.int.replace(/^0+(?=\d)/, '');
    if (i === '' && p.sep) i = '0';
    i = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (p.neg ? '-' : '') + i + (p.sep ? ',' + p.dec : '');
  }
  function part(neg, int, sep, dec) {
    return { neg: neg, int: int.replace(/\D/g, '').slice(0, MAX_INT), sep: sep, dec: dec.replace(/\D/g, '').slice(0, MAX_DEC) };
  }
  // Kutudaki metin: nokta binlik ayıracı, virgül ondalık ayıracıdır.
  function fromDisplay(s) {
    s = String(s).replace(/[^\d.,-]/g, '');
    var neg = s.charAt(0) === '-';
    s = s.replace(/-/g, '');
    var k = s.indexOf(',');
    return k < 0 ? part(neg, s, false, '') : part(neg, s.slice(0, k), true, s.slice(k + 1));
  }
  // Program ile atanan değer: JavaScript sayısı biçimi ("45000.37").
  function fromJs(s) {
    s = String(s == null ? '' : s).trim();
    var neg = s.charAt(0) === '-';
    s = s.replace(/[^\d.]/g, '');
    var k = s.indexOf('.');
    return k < 0 ? part(neg, s, false, '') : part(neg, s.slice(0, k), true, s.slice(k + 1));
  }
  // Yapıştırılan veya topluca girilen metin: hangi ayıracın ondalık olduğu tahmin edilir.
  function smart(s) {
    s = String(s).replace(/[^\d.,-]/g, '');
    var neg = s.charAt(0) === '-';
    s = s.replace(/-/g, '');
    var d = s.lastIndexOf('.'), c = s.lastIndexOf(',');
    var dec = -1;
    if (d >= 0 && c >= 0) dec = Math.max(d, c);
    else if (d >= 0 || c >= 0) {
      var ch = d >= 0 ? '.' : ',', n = s.split(ch).length - 1;
      var grouped = new RegExp('^\\d{1,3}(\\' + ch + '\\d{3})+$').test(s);
      if (n === 1 && !grouped) dec = Math.max(d, c);
    }
    var txt = dec < 0 ? s.replace(/[.,]/g, '') : s.slice(0, dec).replace(/[.,]/g, '') + ',' + s.slice(dec + 1).replace(/[.,]/g, '');
    return (neg ? '-' : '') + txt;
  }
  function toRaw(p) {
    if (p.int === '' && p.dec === '') return p.neg ? '-' : '';
    return (p.neg ? '-' : '') + (p.int === '' ? '0' : p.int.replace(/^0+(?=\d)/, '')) + (p.dec ? '.' + p.dec : '');
  }
  var SIG = /[\d,-]/;
  function sigCount(s, end) { var n = 0; for (var i = 0; i < end; i++) if (SIG.test(s.charAt(i))) n++; return n; }
  function sigPos(s, n) { if (n <= 0) return 0; for (var i = 0; i < s.length; i++) if (SIG.test(s.charAt(i)) && --n === 0) return i + 1; return s.length; }

  function setup(el) {
    el.type = 'text';
    el.setAttribute('inputmode', 'decimal');
    el.setAttribute('autocomplete', 'off');
    el.setAttribute('spellcheck', 'false');
    var st = null;
    Object.defineProperty(el, 'value', {
      configurable: true,
      get: function () { return toRaw(fromDisplay(D.get.call(el))); },
      set: function (v) { D.set.call(el, v === '' || v == null ? '' : render(fromJs(v))); }
    });
    el.addEventListener('beforeinput', function (e) {
      st = { val: D.get.call(el), s: el.selectionStart, e: el.selectionEnd, type: e.inputType || '', data: e.data };
    });
    el.addEventListener('input', function (e) {
      var now = D.get.call(el), cand = now, caret = el.selectionStart == null ? now.length : el.selectionStart;
      if (st && st.s != null) {
        var t = st.type, v = st.val;
        if (/^insert/.test(t)) {
          var ins = st.data != null ? st.data : now.slice(st.s, now.length - (v.length - st.e));
          // Elle yazılan nokta binlik ayıracıdır (gruplama kendiliğinden yapılır); kuruş virgülle girilir.
          ins = ins.length > 1 ? smart(ins) : ins === ',' ? (v.slice(0, st.s).indexOf(',') < 0 && v.slice(st.e).indexOf(',') < 0 ? ',' : '') : ins === '-' ? (st.s === 0 ? '-' : '') : ins.replace(/\D/g, '');
          cand = v.slice(0, st.s) + ins + v.slice(st.e);
          caret = st.s + ins.length;
        } else if (/^delete/.test(t) && st.s === st.e) {
          if (/Backward/.test(t) && v.charAt(st.s - 1) === '.') { cand = v.slice(0, st.s - 2) + v.slice(st.s); caret = Math.max(0, st.s - 2); }
          else if (/Forward/.test(t) && v.charAt(st.s) === '.') { cand = v.slice(0, st.s) + v.slice(st.s + 2); caret = st.s; }
        }
      }
      else if (now && e && e.data && e.data.length > 1 && now === e.data) cand = smart(now);
      st = null;
      var out = render(fromDisplay(cand));
      if (out !== now || cand !== now) {
        var n = sigCount(cand, caret);
        D.set.call(el, out);
        if (document.activeElement === el) { var p = sigPos(out, n); try { el.setSelectionRange(p, p); } catch (x) { } }
      }
    });
    // Yapıştırma: panodaki metnin hangi ayıracı kullandığı tahmin edilerek seçili alanın yerine konur.
    el.addEventListener('paste', function (e) {
      var cd = e.clipboardData || window.clipboardData; if (!cd) return;
      var txt = cd.getData('text'); if (txt == null) return;
      e.preventDefault();
      var v = D.get.call(el), s0 = el.selectionStart == null ? v.length : el.selectionStart, s1 = el.selectionEnd == null ? v.length : el.selectionEnd;
      var ins = smart(txt), cand = v.slice(0, s0) + ins + v.slice(s1), n = sigCount(cand, s0 + ins.length);
      var out = render(fromDisplay(cand)); D.set.call(el, out);
      var q = sigPos(out, n); try { el.setSelectionRange(q, q); } catch (x) { }
      st = null;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    var cur = D.get.call(el);
    if (cur) D.set.call(el, render(fromJs(cur)));
  }
  var els = document.querySelectorAll('input[data-tutar]');
  for (var i = 0; i < els.length; i++) setup(els[i]);
})();
