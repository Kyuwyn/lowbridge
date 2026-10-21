from pathlib import Path
from dataclasses import dataclass, replace
from math import isclose
import json
@dataclass
class Task:
    key:str
    h:float
    stage:int
    checkpoint:bool=False

def task(key,h,stage,checkpoint=False): return Task(key,h,stage,checkpoint)
opening=[task('fragment_qi',.05,1),task('perception',.5,1),task('earn_opening_gear',.25,1),task('channel_observation',.1,1),task('channel_arrangement_learning',1,1),task('initial_method_practice',2,1),task('followup_observation',.1,1),task('reconstructed_method',3.75,1),task('foundation',.25,1,True)]
second=[task('body_teaching',8,2),task('marker_and_load_finding',.1,2),task('body_practice',12,2),task('body_breakthrough',.25,2,True)]
third=[task('crossing_and_service_access',.1,3),task('iron_teaching',.25,3),task('earn_missing_third_gear',2,3),task('training_setup',.03,3),task('iron_practice',10,3),task('chime',.03,3),task('survey_spur',.08,3),task('local_travel',.02,3),task('iron_breakthrough',.04,3,True)]
fourth=[task('first_basin_journey',.25,4),task('outer_observation',.25,4),task('report_and_control_lesson',.25,4),task('gentle_control',6,4),task('deeper_site_and_shelter',.25,4),task('jade_teaching',6,4),task('reinforced_adaptation',4,4),task('jade_practice',10,4),task('trial_setup',.1,4),task('intake',.1,4),task('slow_settling',8,4,True)]
focused=opening+second+third+fourth
hollow=[task('missing_hollow_perception',2,2),task('hollow_observation',.1,2),task('attention_exercise',1,2)]
sword=[task('earn_intro_blade',.25,2),task('sword_intro_only',.5,2)]
home=[task('earn_study_space',2,3),task('adapt_study_space',.1,3)]
early=[replace(t,stage=3) for t in fourth[:4]]+[task('return_from_early_visit',.1,3)]
curious_third=third[:2]+home+[replace(t,h=8) if t.key=='iron_practice' else t for t in third[2:-1]]+early+[third[-1]]
curious_fourth=[task('return_to_basin',.1,4)]+fourth[4:10]+[task('controlled_withdrawal',.1,4),task('retry_intake',.1,4),fourth[-1]]
curious=opening+hollow+sword+second+curious_third+curious_fourth

def simulate(tasks,interval,cap=72,session=10/60):
    now=bank=used=lost=0.0
    nxt=0; active=None; rem=0.0; checkpoints={}; choices=0; visits=0; max_choices=0
    def advance(dt):
        nonlocal now,bank,used,lost,active,rem
        if active is not None:
            work=min(dt,rem); rem-=work; used+=work; now+=work; dt-=work
            if rem<1e-9:
                if active.checkpoint: checkpoints[active.stage]=now
                active=None
                if nxt==len(tasks): return
        if dt>0:
            keep=min(dt,cap-bank); bank+=keep; lost+=dt-keep; now+=dt
    for visit in range(100):
        visit_time=visit*interval
        advance(max(0,visit_time-now))
        if nxt==len(tasks) and active is None: break
        visits+=1; end=now+(.5 if visit==0 else session); visit_choices=0
        while now<end-1e-9:
            if active is None:
                if nxt==len(tasks): break
                if now+1/60>end+1e-9: advance(end-now); break
                advance(1/60); active=tasks[nxt]; nxt+=1; rem=active.h
                choices+=1; visit_choices+=1
            elif bank>1e-9:
                if now+1/60>end+1e-9: advance(end-now); break
                selected=active
                advance(1/60)
                choices+=1; visit_choices+=1
                if active is selected:
                    spend=min(bank,rem); bank-=spend; rem-=spend; used+=spend
                    if rem<1e-9:
                        if active.checkpoint: checkpoints[active.stage]=now
                        active=None
            elif rem<=end-now:
                advance(rem)
            else:
                advance(end-now)
        max_choices=max(max_choices,visit_choices)
        if nxt==len(tasks) and active is None: break
    assert nxt==len(tasks) and active is None
    total=sum(t.h for t in tasks)
    assert isclose(used,total,abs_tol=1e-7)
    assert isclose(now,used+bank+lost,abs_tol=1e-7),(now,used,bank,lost)
    return {'interval_hours':interval,'cap_hours':cap,'checkpoint_hours':{k:round(v,3) for k,v in checkpoints.items()},'completion_days':round(now/24,3),'visits':visits,'decisions':choices,'max_decisions_in_visit':max_choices,'bank_at_finish':round(bank,3),'cap_loss':round(lost,3)}
output={}
for name,tasks in [('focused',focused),('curious',curious)]:
    amounts=[sum(t.h for t in tasks if t.stage==stage) for stage in range(1,5)]
    cumul=0; stages=[]
    for stage,h in enumerate(amounts,1):
        cumul+=h; stages.append({'stage':stage,'hours':round(h,3),'cumulative':round(cumul,3),'age_at_one_hour_per_sixth_year':round(18+cumul/6,3)})
    output[name]={'stages':stages,'hours':round(sum(amounts),3),'runs':[simulate(tasks,i,cap=cap) for i in [12,8] for cap in [48,72]],'tasks':[vars(t) for t in tasks]}
reserves=[1.1,.5,.35,.25]
cur=output['curious']['stages']; r=0
output['reserve_checks']=[]
for stage,reserve in zip(cur,reserves):
    r+=reserve; age=18+(stage['cumulative']+r)/6
    output['reserve_checks'].append({'stage':stage['stage'],'cumulative_reserve_hours':r,'age':round(age,3),'unextended_margin':round(80-age,3)})
with open(str(Path(__file__).with_name('results-regenerated.json')),'w') as f: json.dump(output,f,indent=2)
for name in ['focused','curious']:
    x=output[name]; print(name, json.dumps({k:v for k,v in x.items() if k!='tasks'},indent=2))
print('reserve_checks',json.dumps(output['reserve_checks'],indent=2))
