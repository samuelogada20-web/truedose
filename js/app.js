const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e};

const side=$('#side'),scrim=$('#scrim'),mbtn=$('#menu');
function setMenu(o){side.classList.toggle('open',o);scrim.classList.toggle('show',o);mbtn.setAttribute('aria-expanded',String(o))}
mbtn.addEventListener('click',()=>setMenu(!side.classList.contains('open')));
scrim.addEventListener('click',()=>setMenu(false));
addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

const PAGES=['home','check','pharmacies','report','learn','about'];
function route(){
  const h=(location.hash||'#home').slice(1),p=PAGES.includes(h)?h:'home';
  $$('.page').forEach(s=>s.hidden=s.id!=='pg-'+p);
  $$('nav a').forEach(a=>{a.getAttribute('href')==='#'+p?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')});
  setMenu(false);window.scrollTo(0,0);
}
addEventListener('hashchange',route);route();

const KEY='truedose-reports';
let reports=[];
try{reports=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){reports=[]}
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(reports))}catch(e){}};
function drawReports(){
  const box=$('#rlist');box.replaceChildren();
  reports.slice().reverse().forEach(r=>{
    const c=el('div','card');
    c.append(el('h3','',r.p+(r.n?' · '+r.n:'')),el('div','meta',r.w+(r.a?' · '+r.a:'')+' · '+r.d));
    if(r.x)c.append(el('p','note',r.x));
    box.append(c);
  });
}
$('#rf').addEventListener('submit',e=>{
  e.preventDefault();
  const p=$('#rp').value.trim(),m=$('#rmsg');m.replaceChildren();
  if(!p){const r=el('div','res bad');r.append(el('strong','','Add the product name'),el('p','','Type the name shown on the pack, then save again.'));m.append(r);$('#rp').focus();return}
  reports.push({p,n:$('#rn').value.trim(),a:$('#ra').value.trim(),w:$('#rw').value,x:$('#rd').value.trim(),d:new Date().toLocaleDateString('en-NG')});
  persist();drawReports();$('#rf').reset();
  const r=el('div','res ok');r.append(el('strong','','Report saved'),el('p','','Now send it to NAFDAC with the button above so it can be investigated.'));m.append(r);
});
drawReports();

$('#go').addEventListener('click',()=>{
  const n=$$('#ck input:checked').length,q=$('#q').value.trim().toLowerCase(),o=$('#out');o.replaceChildren();
  let cls,t,d;
  if(n===6){cls='ok';t='Looks consistent so far';d='Everything you ticked lines up. This is a checklist, not a lab test, so stop and ask a pharmacist if anything still feels off.'}
  else if(n>=4){cls='warn';t='Be careful';d='Some checks are still open. Resolve each unticked item before you use this medicine, or ask a pharmacist to look at the pack.'}
  else{cls='bad';t='Do not use it yet';d='Too many checks are missing or failed. Keep the pack, do not take it, and report it to NAFDAC.'}
  const r=el('div','res '+cls);r.append(el('strong','',t+' ('+n+' of 6 checks)'),el('p','',d));o.append(r);
  if(q){const hits=reports.filter(x=>(x.p+' '+x.n).toLowerCase().includes(q)).length;
    if(hits)o.append(el('p','note','You have '+hits+' saved report'+(hits>1?'s':'')+' on this device that mention “'+$('#q').value.trim()+'”.'))}
  if(cls==='bad'){const a=el('a','btn ghost','Report to NAFDAC');a.href='https://greenbook.nafdac.gov.ng/report/sf';a.target='_blank';a.rel='noopener';const b=el('div','btns');b.append(a);o.append(b)}
});

const P=[
 {n:'Sample Pharmacy 1',a:'Ikeja',h:'8am–10pm',i:{'Paracetamol 500mg (16 tablets)':350,'Amoxicillin 500mg (10 capsules)':1500,'Artemether-lumefantrine (adult pack)':2200,'ORS sachet':250}},
 {n:'Sample Pharmacy 2',a:'Ikeja',h:'Open 24 hours',i:{'Paracetamol 500mg (16 tablets)':400,'Amoxicillin 500mg (10 capsules)':1700,'ORS sachet':300}},
 {n:'Sample Pharmacy 3',a:'Lekki',h:'7am–11pm',i:{'Paracetamol 500mg (16 tablets)':450,'Artemether-lumefantrine (adult pack)':2500,'ORS sachet':350,'Amoxicillin 500mg (10 capsules)':1800}},
 {n:'Sample Pharmacy 4',a:'Yaba',h:'8am–9pm',i:{'Paracetamol 500mg (16 tablets)':300,'Amoxicillin 500mg (10 capsules)':1300,'Artemether-lumefantrine (adult pack)':1900}},
 {n:'Sample Pharmacy 5',a:'Surulere',h:'8am–8pm',i:{'Paracetamol 500mg (16 tablets)':320,'ORS sachet':220,'Amoxicillin 500mg (10 capsules)':1400}},
 {n:'Sample Pharmacy 6',a:'Ikorodu',h:'9am–9pm',i:{'Paracetamol 500mg (16 tablets)':330,'Artemether-lumefantrine (adult pack)':2000,'ORS sachet':230}}
];
const naira=v=>'₦'+v.toLocaleString('en-NG');
function drawP(){
  const area=$('#area').value,m=$('#med').value.trim().toLowerCase(),box=$('#plist');box.replaceChildren();
  const rows=P.filter(p=>!area||p.a===area)
    .map(p=>({p,hits:Object.entries(p.i).filter(([k])=>!m||k.toLowerCase().includes(m))}))
    .filter(r=>r.hits.length)
    .sort((x,y)=>Math.min(...x.hits.map(h=>h[1]))-Math.min(...y.hits.map(h=>h[1])));
  if(!rows.length){const r=el('div','res');r.append(el('strong','','No match yet'),el('p','','Try a different area or a shorter medicine name, such as “amox”.'));box.append(r);return}
  rows.forEach(({p,hits})=>{
    const c=el('div','card'),h=el('h3','',p.n);h.append(el('span','tag','sample'));
    c.append(h,el('div','meta',p.a+' · '+p.h));
    const u=el('ul');hits.forEach(([k,v])=>{const li=el('li');li.append(el('span','',k),el('b','',naira(v)));u.append(li)});
    c.append(u);box.append(c);
  });
}
$('#area').addEventListener('change',drawP);$('#med').addEventListener('input',drawP);drawP();

