"""Hukuki süre aracı için beklenen son günleri, araçtan bağımsız olarak hesaplar.
Kurallar: gün ve hafta süreleri tebliğ gününden sonraki günden işler (HMK m.92); son gün tatile rastlarsa
ilk iş gününe kayar (HMK m.93); adli tatile (20 Temmuz–31 Ağustos) rastlayan son gün HMK'da 7 gün (m.104),
CMK'da 3 gün (m.331), İYUK'ta 7 gün (m.8) uzar. Kullanım: python3 sure-cases.py > sure-cases.json"""
import json, datetime as dt
D = dt.date
HOL = {'01-01', '04-23', '05-01', '05-19', '07-15', '08-30', '10-29'}
DINI = {D(2026,3,20), D(2026,3,21), D(2026,3,22), D(2026,5,27), D(2026,5,28), D(2026,5,29), D(2026,5,30),
        D(2027,3,9), D(2027,3,10), D(2027,3,11), D(2027,5,16), D(2027,5,17), D(2027,5,18), D(2027,5,19)}
def tatil(d): return d.weekday() >= 5 or d.strftime('%m-%d') in HOL or d in DINI
OPS = {'cevap': (14, 'HMK'), 'hmk_istinaf': (14, 'HMK'), 'cmk_istinaf': (14, 'CMK'), 'cmk_itiraz': (14, 'CMK'), 'odeme_emri': (7, 'IIK'),
       'kambiyo': (5, 'IIK'), 'sikayet': (7, 'IIK'), 'iptal_davasi': (60, 'IYUK'), 'itirazin_iptali': ('1y', 'IIK')}
def son(op, t, tatilde=False):
    n, r = OPS[op]; s = D.fromisoformat(t)
    if n == '1y':
        try: e = s.replace(year=s.year + 1)
        except ValueError: e = D(s.year + 1, 2, 28)
    else: e = s + dt.timedelta(days=n)
    if D(e.year, 7, 20) <= e <= D(e.year, 8, 31):
        if r == 'HMK' and not tatilde: e = D(e.year, 9, 7)
        elif r == 'CMK': e = D(e.year, 9, 3)
        elif r == 'IYUK': e = D(e.year, 9, 7)
    while tatil(e): e += dt.timedelta(days=1)
    return e.isoformat()
C = [('cevap','2026-11-05'),('odeme_emri','2026-11-06'),('kambiyo','2026-11-05'),('odeme_emri','2026-11-07'),('sikayet','2026-10-22'),
     ('kambiyo','2026-05-21'),('odeme_emri','2026-05-20'),('hmk_istinaf','2026-07-10'),('cevap','2026-07-10',True),('cmk_istinaf','2026-07-10'),
     ('iptal_davasi','2026-06-01'),('odeme_emri','2026-07-21'),('cevap','2026-07-03'),('cevap','2026-08-17'),('cevap','2026-08-18'),
     ('itirazin_iptali','2026-02-28'),('kambiyo','2027-03-04'),('hmk_istinaf','2027-08-01'),('odeme_emri','2026-12-25'),('cmk_itiraz','2026-08-16'),
     ('sikayet','2026-07-08'),('kambiyo','2026-04-18')]
print(json.dumps([dict(op=c[0], t=c[1], tatilde=(len(c) > 2), exp=son(*c)) for c in C], ensure_ascii=False))
