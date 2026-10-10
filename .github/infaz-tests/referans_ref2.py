import math, json, datetime as dt
S=dt.date(2025,1,15)
def add(d): return (S+dt.timedelta(days=d)).strftime('%d.%m.%Y')
def ceil(x): return math.floor(x+1e-9)  # lehe (TCK 61/6)
def legacy(total,r,openrule,pre2020=False,t6=False,g10x=False,noopen=False,life_years=None,ex5=False):
    if life_years: ks=life_years*365
    else: ks=ceil(total*r)
    if noopen: return dict(ks=add(ks))
    if life_years:
        y,s={'g7':(5,False),'f5':(5,True),'t3':(3,True)}[openrule]; cm=0
    else:
        cm=ceil(total/10) if total>=3650 else 30
        y,s={'g7':(7,False),'f5':(5,True),'t3':(3,True)}[openrule]
    raw=ks-y*365; b=0 if raw<0 else (raw+1 if s else raw)
    direct=(not life_years) and (not ex5) and total<=1095
    op=0 if direct else max(cm,b)
    win=1095 if (pre2020 and not t6) else 365
    ds=max(ks-win,0) if (pre2020 and not t6) else max(ks-win,op)  # Geçici 6/3: kapalıdan da DS
    if not g10x:
        c=90 if (life_years or total>=3650) else 30
        gop=0 if direct else min(op,max(c,op-1095))
        ds=min(ds,max(ds-1095,gop+90)); op=gop
    op=min(op,ds)
    r=dict(open=add(op) if op else None,ds=add(ds),ks=add(ks))
    if not op and not direct: r.pop('open'); r['g63']='Geçici 6/3'
    return r
D=lambda y=0,m=0,d=0:y*365+m*30+d
C={
 'L_genel_4y_2022':dict(i=dict(c='general',y=4,cd='2022-05-10'),e=legacy(D(4),1/2,'g7')),
 'L_genel_10y_2019':dict(i=dict(c='general',y=10,cd='2019-05-10'),e=legacy(D(10),1/2,'g7',pre2020=True)),
 'L_188_12y_2021':dict(i=dict(c='drug188',y=12,cd='2021-06-01'),e=legacy(D(12),3/4,'f5',t6=True)),
 'L_killSpouse_18y_2022':dict(i=dict(c='killSpouse',y=18,cd='2022-05-10'),e=legacy(D(18),2/3,'t3',t6=True,g10x=True)),
 'L_kill_18y_2022':dict(i=dict(c='kill',y=18,cd='2022-05-10'),e=legacy(D(18),2/3,'g7',t6=True)),
 'L_terror_8y_2022':dict(i=dict(c='terror',y=8,cd='2022-05-10'),e=legacy(D(8),3/4,None,noopen=True)),
 'L_muebbet_2022':dict(i=dict(c='general',st='muebbet',cd='2022-05-10'),e=legacy(0,0,'g7',life_years=24)),
 'L_theft142_6y_2018':dict(i=dict(c='theft142',y=6,cd='2018-05-10'),e=legacy(D(6),1/2,'f5',pre2020=True)),
 'L_sex105_4y_2021':dict(i=dict(c='sex105',y=4,cd='2021-05-10'),e=legacy(D(4),2/3,'g7',t6=True,ex5=True)),
}
print(json.dumps(C,ensure_ascii=False))
