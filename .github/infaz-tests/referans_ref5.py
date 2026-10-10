# Bağımsız referans (denetim bulguları, 10.10.2026): kanun maddelerinden elle kurulan hesaplar.
# Gün yöntemi: yıl 365, ay 30 gün; küsurat atılır (TCK 61/6); tarih = başlangıç + gün.
import json, datetime as D
d=lambda s:D.date.fromisoformat(s); f=lambda x:x.strftime('%d.%m.%Y')
def plus(s,n): return d(s)+D.timedelta(days=n)
def age(b,x):
    b=d(b); return x.year-b.year-((x.month,x.day)<(b.month,b.day))
C={}
# 1) 2024 suçu, çocuk (15 yaş altı), kasten öldürme 6 yıl: 7593 istisnası 18.8.2026 öncesi suça uygulanmaz -> 107/5 (15 yaşa kadar 1 gün=2)
ks=6*365*2//3; cnt=0; n=0; x=d('2024-09-01')
while cnt<ks:
    cnt+=2 if age('2010-06-01',x)<15 else 1; n+=1; x+=D.timedelta(days=1)
C['K_1075_kill_2024_istisna_yok']={'i':{'c':'kill','y':6,'cd':'2024-03-10','bd':'2010-06-01','sd':'2024-09-01','child':1},'e':{'ks':f(plus('2024-09-01',n)),'ds':f(plus('2024-09-01',n-365))}}
# 2) 18.8.2026 sonrası suç: istisna uygulanır -> sayım 1:1; 1/10 kuralı (KS'ye kadar 1460 günün 1/10'u=146) DS'yi etkilemez
C['K_1075_kill_2026_istisna']={'i':{'c':'kill','y':6,'cd':'2026-08-20','bd':'2012-06-01','sd':'2026-09-01','child':1},'e':{'ks':f(plus('2026-09-01',1460)),'ds':f(plus('2026-09-01',1460-365))}}
# C: cocuk.json'a eklendi (K_1075_istisna_kill6y yerine)
G={}
# 3) Örgüt (TCK 220) 10 yıl, suç 2019: Geçici 6/1 istisnası değil -> 6/3 ile kapalıdan DS 3 yıl
ks=3650*2//3
G['O_orgut_2019_g63']={'i':{'c':'organization','y':10,'cd':'2019-01-01','sd':'2019-06-01'},'e':{'ks':f(plus('2019-06-01',ks)),'ds':f(plus('2019-06-01',ks-1095)),'n':'kapalı cezaevinden de uygulanabilir'}}
# 4) 188 müebbet (33 yıl) + 1 yıl hırsızlık: içtima 30 yıl sınırı 33 yılın altına indiremez
G['O_188_muebbet_ictima']={'i':{'c':'drug188','st':'muebbet','cd':'2020-05-01','sd':'2021-01-01','x':[{'c':'theft141','cd':'2020-05-01','y':1}]},'e':{'ks':f(plus('2021-01-01',33*365))}}
# 5) İkinci defa tekerrür 30+30 yıl: 108/3 -> 108/1-c üst sınır 32 yıl
G['O_ikinci_tekerrur_32']={'i':{'c':'general','y':30,'rec2':1,'cd':'2024-03-10','sd':'2025-01-15','x':[{'c':'general','cd':'2023-01-01','y':30}]},'e':{'ks':f(plus('2025-01-15',32*365))}}
# 6) 103 20y + 103 20y (2021): 108/9 -> üst sınır 28 değil 108/1-c 32 yıl; 3/4 + 3/4 = 30 yıl (28'e indirilmez)
G['O_103_ictima_32']={'i':{'c':'sex103','y':20,'cd':'2021-01-01','sd':'2022-01-01','x':[{'c':'sex103','cd':'2021-01-01','y':20}]},'e':{'ks':f(plus('2022-01-01',min(2*(20*365*3//4),32*365)))}}
# 7) DS tarihi KS'yi geçemez (1/10 kuralı + mahsup): genel 1 yıl, KS=182-180=2 gün
G['O_ds_ks_sonrasi_olamaz']={'i':{'c':'general','y':1,'cd':'2025-07-01','sd':'2026-03-01','cdd':180},'e':{'ks':f(plus('2026-03-01',2)),'ds':f(plus('2026-03-01',2))}}
# 8) 188 müebbet, suç 2013: 6545 öncesi -> 24 yıl
G['O_188_muebbet_2013']={'i':{'c':'drug188','st':'muebbet','cd':'2013-05-01','sd':'2014-01-01'},'e':{'ks':f(plus('2014-01-01',24*365))}}
# 9) Anne/babaya karşı öldürme teşebbüsü 15 yıl, suç 2023: Geçici 10/6 istisnası (82/1-d) -> 3 yıl erken yok
ks=15*365*2//3
G['O_killFamily_2023_g10yok']={'i':{'c':'killFamily','y':15,'cd':'2023-01-01','sd':'2023-06-01'},'e':{'ks':f(plus('2023-06-01',ks)),'ds':f(plus('2023-06-01',ks-365)),'open':f(plus('2023-06-01',max(15*365//10,ks-7*365)))}}
# 10) Babaya karşı yaralama 3y6a, suç 2019: Geçici 6/1 istisnası -> DS 1 yıl; Geçici 10/6 uygulanır (istisna değil)
t=3*365+180; ks=t//2; op=max(30,ks-7*365); gop=min(op,max(30,op-1095)); gds=min(ks-365,max(ks-365-1095,gop+90))
G['O_injuryFamily_2019']={'i':{'c':'injuryFamily','y':3,'m':6,'cd':'2019-06-01','sd':'2020-01-01'},'e':{'ks':f(plus('2020-01-01',ks)),'ds':f(plus('2020-01-01',gds))}}

def g10(nOpen,nDs,cmin):
    gop=min(nOpen,max(cmin,nOpen-1095)); return gop,min(nDs,max(nDs-1095,gop+90))
ks=33*365; op,ds=g10(ks-5*365+1,ks-365,90)
G['O_188_muebbet_ictima']['e'].update(open=f(plus('2021-01-01',op)),ds=f(plus('2021-01-01',ds)))
ks=32*365; G['O_ikinci_tekerrur_32']['e'].update(open=f(plus('2025-01-15',max(60*365//10,ks-7*365))),ds=f(plus('2025-01-15',ks-365)))
ks=2*(20*365*3//4); G['O_103_ictima_32']['e'].update(open=f(plus('2022-01-01',max(40*365//10,ks-3*365+1))),ds=f(plus('2022-01-01',ks-365)))
ks=24*365; op,ds=g10(ks-5*365+1,ks-365,90)
G['O_188_muebbet_2013']['e'].update(open=f(plus('2014-01-01',op)),ds=f(plus('2014-01-01',ds)))
json.dump(G,open('denetim.json','w'),ensure_ascii=False)
print(json.dumps(C,ensure_ascii=False));print(json.dumps(G,ensure_ascii=False))
