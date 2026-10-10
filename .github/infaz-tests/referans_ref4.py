import math, json, datetime as dt
def age(b,d): return d.year-b.year-((d.month,d.day)<(b.month,b.day))
def sim(start,birth,need,rule):
    c=0;d=0;day=start
    while c<need:
        a=age(birth,day); c+= (3 if a<15 else 2 if a<18 else 1) if rule=='g64' else (2 if a<15 else 1); d+=1; day+=dt.timedelta(1)
    return d
f=lambda s:s.strftime('%d.%m.%Y')
out={}
# G64: genel 6y, suç 2019-06-01, doğum 2005-01-01, giriş 2019-12-01
st=dt.date(2019,12,1);b=dt.date(2005,1,1);ks=math.floor(6*365*0.5);d=sim(st,b,ks,'g64')
out['K_g64_genel6y']=dict(i=dict(c='general',y=6,cd='2019-06-01',bd='2005-01-01',sd='2019-12-01',child=1),e=dict(ks=f(st+dt.timedelta(d)),ds=f(st+dt.timedelta(d-365))))
# 107/5: genel 4y, suç 2024-03-10, doğum 2010-06-01, giriş 2024-09-01
st=dt.date(2024,9,1);b=dt.date(2010,6,1);ks=math.floor(4*365*0.5);d=sim(st,b,ks,'p')
out['K_1075_genel4y']=dict(i=dict(c='general',y=4,cd='2024-03-10',bd='2010-06-01',sd='2024-09-01',child=1),e=dict(ks=f(st+dt.timedelta(d)),ds=f(st+dt.timedelta(d-365))))
# 107/5 istisna: kasten öldürme 6y çocuk 2/3, hızlanma yok
st=dt.date(2024,9,1);ks=math.floor(6*365*2/3)
out['K_1075_istisna_kill6y']=dict(i=dict(c='kill',y=6,cd='2024-03-10',bd='2010-06-01',sd='2024-09-01',child=1),e=dict(ks=f(st+dt.timedelta(ks)),ds=f(st+dt.timedelta(ks-365))))
print(json.dumps(out,ensure_ascii=False))
