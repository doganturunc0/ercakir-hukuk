import math, json, datetime as dt
S=dt.date(2025,1,15)
def add(d): return (S+dt.timedelta(days=d)).strftime('%d.%m.%Y')
def ceil(x): return math.floor(x+1e-9)  # lehe (TCK 61/6)
D=lambda y=0,m=0,d=0:y*365+m*30+d
R={'general':.5,'theft141':.5,'theft142':.5,'drug188':.75,'organization':2/3}
O={'general':'g7','theft141':'g7','theft142':'f5','drug188':'f5','organization':'none'}
def ict(items,cap,life=None,legacy=False):
    ks=sum(ceil(t*R[c]) for c,t in items)+(life*365 if life else 0)
    ks=min(ks,cap*365); total=sum(t for c,t in items)
    opens=[O[c] for c,t in items]+(['g7'] if life else [])
    if 'none' in opens: return dict(ks=add(ks))
    lim=(3,True) if 't3' in opens else (5,True) if 'f5' in opens else ((5,False) if life else (7,False))
    cm=0 if life else (ceil(total/10) if total>=3650 else 30)
    raw=ks-lim[0]*365; b=0 if raw<0 else (raw+1 if lim[1] else raw)
    op=max(cm,b); ds=max(ks-365,op)
    if legacy:
        c=90 if total>=3650 else 30; gop=min(op,max(c,op-1095)); ds=min(ds,max(ds-1095,gop+90)); op=gop
    r=dict(open=add(op),ds=add(ds),ks=add(ks))
    if not life: r['full']=add(total)
    return r
C={
 'I_genel4_hirs142_2':dict(i=dict(c='general',y=4,x=[dict(c='theft142',cd='2024-02-01',y=2)]),e=ict([('general',D(4)),('theft142',D(2))],28)),
 'I_188_10_genel5':dict(i=dict(c='drug188',y=10,x=[dict(c='general',cd='2024-02-01',y=5)]),e=ict([('drug188',D(10)),('general',D(5))],28)),
 'I_3x20_ust_sinir28':dict(i=dict(c='general',y=20,x=[dict(c='general',cd='2024-02-01',y=20),dict(c='general',cd='2024-02-02',y=20)]),e=ict([('general',D(20))]*3,28)),
 'I_orgut_ust_sinir32':dict(i=dict(c='organization',y=20,x=[dict(c='general',cd='2024-02-01',y=20),dict(c='general',cd='2024-02-02',y=20)]),e=ict([('organization',D(20)),('general',D(20)),('general',D(20))],32)),
 'I_muebbet_genel10':dict(i=dict(c='general',st='muebbet',x=[dict(c='general',cd='2024-02-01',y=10)]),e=ict([('general',D(10))],30,life=24)),
 'I_muebbet_genel20_sinir30':dict(i=dict(c='general',st='muebbet',x=[dict(c='general',cd='2024-02-01',y=20)]),e=ict([('general',D(20))],30,life=24)),
 'I_karisik_donem':dict(i=dict(c='general',y=4,cd='2022-05-10',x=[dict(c='general',cd='2024-02-01',y=2)]),e=ict([('general',D(4)),('general',D(2))],28)),
 'I_hepsi_2023_oncesi':dict(i=dict(c='general',y=4,cd='2022-05-10',x=[dict(c='theft141',cd='2021-02-01',y=2)]),e=ict([('general',D(4)),('theft141',D(2))],28,legacy=True)),
}
print(json.dumps(C,ensure_ascii=False))
