# Bağımsız referans hesap (JS'den ayrı yazıldı): gün yöntemi + 5275/Yönetmelik kuralları
import math, json, datetime as dt
D=lambda y=0,m=0,d=0: y*365+m*30+d
def add(start,days): return (start+dt.timedelta(days=days)).strftime('%d.%m.%Y')
S=dt.date(2025,1,15)
def ceil(x): return math.floor(x+1e-9)  # lehe (TCK 61/6)
def sureli(total,r,openrule,ex5=False,neg=False,noopen=False,credit=0,dsw=365,rec_prev=None):
    ks=ceil(total*r)
    if rec_prev is not None:
        r2=ceil(total*max(2/3,r)); ks+=min(max(0,r2-ks),rec_prev)
    ksn=max(0,ks-credit); full=max(0,total-credit)
    if noopen: return dict(ks=add(S,ksn),full=add(S,full))
    direct=(not ex5) and (total<=1095 or (neg and total<=1825))
    if direct: op=0
    else:
        cm=ceil(total/10) if total>=3650 else 30
        y,strict={'g7':(7,False),'f5':(5,True),'t3':(3,True)}[openrule]
        raw=ksn-y*365; b=0 if raw<0 else (raw+1 if strict else raw)
        op=max(cm,b)
    ds=max(0,ksn-dsw); ds=max(ds,op)
    return dict(open=None if op==0 else add(S,op),ds=add(S,ds),ks=add(S,ksn),full=add(S,full))
def life(years,openrule,agg=False,noopen=False,dsw=365):
    ks=years*365
    if noopen or agg: return dict(ks=add(S,ks),den=add(S,2*ks))
    y,strict={'g7':(5,False),'f5':(5,True),'t3':(3,True)}[openrule]
    raw=ks-y*365; op=0 if raw<0 else (raw+1 if strict else raw)
    ds=max(ks-dsw,op)
    return dict(open=add(S,op),ds=add(S,ds),ks=add(S,ks),den=add(S,2*ks))
C={
 'theft141_4y':dict(i=dict(c='theft141',y=4),e=sureli(D(4),1/2,'g7')),
 'theft142_12y':dict(i=dict(c='theft142',y=12),e=sureli(D(12),1/2,'f5')),
 'injurySpouse_6y':dict(i=dict(c='injurySpouse',y=6),e=sureli(D(6),1/2,'t3')),
 'negligent_4y6m':dict(i=dict(c='negligent',y=4,m=6),e=sureli(D(4,6),1/2,'g7',neg=True)),
 'kill_18y':dict(i=dict(c='kill',y=18),e=sureli(D(18),2/3,'g7')),
 'killSpouse_18y':dict(i=dict(c='killSpouse',y=18),e=sureli(D(18),2/3,'t3')),
 'sex102_1_6y':dict(i=dict(c='sex102_1',y=6),e=sureli(D(6),2/3,'t3',ex5=True)),
 'sex105_2y':dict(i=dict(c='sex105',y=2),e=sureli(D(2),2/3,'g7',ex5=True)),
 'drug188_10y':dict(i=dict(c='drug188',y=10),e=sureli(D(10),3/4,'f5')),
 'sex103_15y':dict(i=dict(c='sex103',y=15),e=sureli(D(15),3/4,'t3',ex5=True)),
 'sex104_23_9y':dict(i=dict(c='sex104_23',y=9),e=sureli(D(9),3/4,'g7',ex5=True)),
 'drug190_7y':dict(i=dict(c='drug190',y=7),e=sureli(D(7),1/2,'f5')),
 'terror_8y':dict(i=dict(c='terror',y=8),e=sureli(D(8),3/4,None,noopen=True)),
 'organization_6y':dict(i=dict(c='organization',y=6),e=sureli(D(6),2/3,None,noopen=True)),
 'muebbet_genel':dict(i=dict(c='general',st='muebbet'),e=life(24,'g7')),
 'agir_genel':dict(i=dict(c='general',st='agir'),e=life(30,'g7',agg=True)),
 'muebbet_188':dict(i=dict(c='drug188',st='muebbet'),e=life(33,'f5')),
 'muebbet_orgut':dict(i=dict(c='organization',st='muebbet'),e=life(30,None,noopen=True)),
 'mukerrir_6y_prev1y':dict(i=dict(c='general',y=6,rec=1,py=1),e=sureli(D(6),1/2,'g7',rec_prev=D(1))),
 'mukerrir_6y_prev6m':dict(i=dict(c='general',y=6,rec=1,pm=6),e=sureli(D(6),1/2,'g7',rec_prev=D(0,6))),
 'mukerrir_188_6y':dict(i=dict(c='drug188',y=6,rec=1,py=1),e=sureli(D(6),3/4,'f5',rec_prev=D(1))),
 'kadin_06_6y':dict(i=dict(c='general',y=6,wc=1),e=sureli(D(6),1/2,'g7',dsw=730)),
 'hastalik_10y':dict(i=dict(c='general',y=10,ill=1),e=sureli(D(10),1/2,'g7',dsw=1095)),
}
print(json.dumps(C,ensure_ascii=False))
