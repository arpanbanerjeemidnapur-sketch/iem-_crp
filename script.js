const LOGO='images/iem-logo.png';
const CATS={tech:'Tech & Hackathons',work:'Workshops',cult:'Cultural',sport:'Sports',sem:'Seminars'};
const CLASS={tech:'t-tech',work:'t-work',cult:'t-cult',sport:'t-sport',sem:'t-sem'};
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

let events=[
 {id:1,title:'IEM HackSprint 24',cat:'tech',club:'IEEE Student Branch',date:'2026-11-28T09:00',venue:'Management House Auditorium',seats:180,desc:'24 hours to build an AI, web or fintech prototype in a team of up to four.'},
 {id:2,title:'Web Dev Bootcamp',cat:'work',club:'GDG on Campus',date:'2026-11-21T14:00',venue:'Gurukul Lab 3',seats:60,desc:'Hands-on HTML, CSS and JavaScript. Bring a laptop and leave with a deployed page.'},
 {id:3,title:'Robo Race Arena',cat:'tech',club:'IEM Robotics Club',date:'2026-12-03T10:30',venue:'Gurukul Workshop Hall',seats:40,desc:'Line followers and sumo bots compete for the Robo Race trophy.'},
 {id:4,title:'Ecstasia Cultural Night',cat:'cult',club:'Ecstasia Cultural Society',date:'2026-12-12T17:00',venue:'Open Grounds, Salt Lake',seats:500,desc:'Music, dance and drama performances by students across all departments.'},
 {id:5,title:'Inter-Department Cricket Cup',cat:'sport',club:'Sports Council',date:'2026-11-25T08:00',venue:'Campus Ground',seats:150,desc:'Knockout T10 matches between departments. Teams of eleven.'},
 {id:6,title:'Careers in Cloud: Industry Talk',cat:'sem',club:'Training & Placement Cell',date:'2026-11-30T11:00',venue:'Management House Seminar Hall',seats:220,desc:'Engineers from Kolkata tech firms on cloud roles, skills and interviews.'},
 {id:7,title:'Startup Pitch Day',cat:'sem',club:'E-Cell IEM',date:'2026-12-06T13:00',venue:'Management House Auditorium',seats:120,desc:'Five student teams pitch to a panel of founders and investors.'},
 {id:8,title:'Poster & Photo Workshop',cat:'work',club:'Ecstasia Cultural Society',date:'2026-11-19T15:00',venue:'Gurukul Room 204',seats:35,desc:'Learn layout, colour and photo editing for your fest posters.'}
];
const CLUBS=[
 {n:'IEEE Student Branch',s:'Tech & research',i:'IE',c:'#2b3a9e'},
 {n:'GDG on Campus',s:'Developers',i:'G',c:'#12a39a'},
 {n:'IEM Robotics Club',s:'Robots & IoT',i:'R',c:'#7a4dff'},
 {n:'Ecstasia Cultural',s:'Music, dance, art',i:'Ec',c:'#d9327a'},
 {n:'E-Cell IEM',s:'Startups',i:'E',c:'#e8683c'},
 {n:'Sports Council',s:'Games & fitness',i:'S',c:'#121a44'}
];
let passes=[],filter='all',query='';
try{passes=JSON.parse(localStorage.getItem('iemPasses')||'[]')}catch(e){}
const $=s=>document.querySelector(s);
const save=()=>{try{localStorage.setItem('iemPasses',JSON.stringify(passes))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const fmtTime=d=>d.toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'});
const fmtFull=d=>`${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${fmtTime(d)}`;

function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2600)}

/* chips */
function renderChips(){
  const all=[['all','All events'],...Object.entries(CATS)];
  $('#chips').innerHTML=all.map(([k,v])=>`<button class="chip" data-k="${k}" aria-pressed="${filter===k}">${v}</button>`).join('');
}
$('#chips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;filter=b.dataset.k;renderChips();renderEvents()});
$('#q').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();renderEvents()});

/* events */
function renderEvents(){
  const list=events.filter(e=>(filter==='all'||e.cat===filter)&&(!query||[e.title,e.club,e.venue,CATS[e.cat]].join(' ').toLowerCase().includes(query)))
    .sort((a,b)=>new Date(a.date)-new Date(b.date));
  $('#evCount').textContent=events.length;
  $('#status').textContent=list.length?`Showing ${list.length} of ${events.length} events`:'';
  if(!list.length){
    $('#grid').innerHTML=`<div class="empty"><h3>No events match that</h3><p>Try a different word, or switch back to all events.</p><button class="btn btn-dark" id="resetF">Show all events</button></div>`;
    $('#resetF').onclick=()=>{filter='all';query='';$('#q').value='';renderChips();renderEvents()};
    return;
  }
  $('#grid').innerHTML=list.map(e=>{
    const d=new Date(e.date),left=e.seats,full=left<=0;
    const mine=passes.some(p=>p.eventId===e.id);
    return `<div class="ticket-wrap"><article class="ticket ${CLASS[e.cat]}">
      <div class="stub"><b>${d.getDate()}</b><span>${MONTHS[d.getMonth()]}</span><small>${fmtTime(d)}</small></div>
      <div class="tbody">
        <span class="cat">${CATS[e.cat]}</span>
        <h3>${esc(e.title)}</h3>
        <div class="meta"><span>${esc(e.club)}</span><span>${esc(e.venue)}</span></div>
        <div class="tfoot">
          <span class="seats ${left<20?'low':''}">${full?'Sold out':left+' seats left'}</span>
          <button class="reg" data-id="${e.id}" ${full||mine?'disabled':''}>${mine?'Pass collected':full?'Full':'Register'}</button>
        </div>
      </div></article></div>`}).join('');
}
$('#grid').addEventListener('click',e=>{const b=e.target.closest('.reg');if(b&&!b.disabled)openReg(+b.dataset.id)});

/* clubs */
$('#clubGrid').innerHTML=CLUBS.map(c=>`<div class="club" style="--c:${c.c}"><div class="ic">${c.i}</div><b>${c.n}</b><small>${c.s}</small></div>`).join('');

/* dialogs */
document.addEventListener('click',e=>{if(e.target.closest('[data-close]'))e.target.closest('dialog').close()});
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));

let current=null;
function openReg(id){
  current=events.find(e=>e.id===id);
  $('#regTitle').textContent=current.title;
  $('#regSub').textContent=current.club;
  $('#regSum').innerHTML=`<b>${fmtFull(new Date(current.date))}</b><br>${esc(current.venue)}<br>${esc(current.desc)}`;
  $('#regForm').reset();
  ['eName','eRoll','eMail'].forEach(i=>$('#'+i).textContent='');
  $('#regDlg').showModal();
}
$('#regForm').addEventListener('submit',e=>{
  e.preventDefault();
  const name=$('#rName').value.trim(),roll=$('#rRoll').value.trim(),mail=$('#rMail').value.trim();
  $('#eName').textContent=name?'':'Enter your full name.';
  $('#eRoll').textContent=roll?'':'Enter your roll or enrollment number.';
  $('#eMail').textContent=/^\S+@\S+\.\S+$/.test(mail)?'':'Enter a valid email address.';
  if(!name||!roll||!/^\S+@\S+\.\S+$/.test(mail))return;
  const pass={pid:'IEM-'+Math.floor(1000+Math.random()*9000),eventId:current.id,title:current.title,date:current.date,venue:current.venue,name,roll,dept:$('#rDept').value,mail};
  passes.push(pass);current.seats--;save();
  $('#regDlg').close();updateCount();renderEvents();showPass(pass);
  toast('Seat confirmed. Pass '+pass.pid+' is ready.');
});

function bars(id){
  let h=0,out='';
  for(const c of id){h=(h*31+c.charCodeAt(0))>>>0}
  for(let i=0;i<34;i++){h=(h*1103515245+12345)>>>0;out+=`<i style="width:${1+(h>>16)%4}px"></i>`}
  return `<div class="bars" aria-hidden="true">${out}</div>`;
}
function passHTML(p){
  return `<div class="pass">
    <div class="pass-top"><img class="iem-logo logo-pass" src="${LOGO}" alt="IEM logo"><div><b>Institute of Engineering &amp; Management</b><small>Official digital event pass</small></div></div>
    <div class="pass-mid">
      <div class="full"><small>Event</small><b>${esc(p.title)}</b></div>
      <div><small>Attendee</small><b>${esc(p.name)}</b></div>
      <div><small>Roll / ID</small><b>${esc(p.roll)}</b></div>
      <div><small>Department</small><b>${esc(p.dept)}</b></div>
      <div><small>When</small><b>${fmtFull(new Date(p.date))}</b></div>
      <div class="full"><small>Venue</small><b>${esc(p.venue)}</b></div>
    </div>
    <div class="pass-bot"><span class="id">#${p.pid}</span>${bars(p.pid)}</div>
  </div>`;
}
function showPass(p){
  $('#passBody').innerHTML=passHTML(p)+`<div class="actions"><button class="btn btn-ghost" id="copyId">Copy pass ID</button><button class="btn btn-dark" data-close>Done</button></div>`;
  $('#copyId').onclick=()=>{navigator.clipboard?.writeText(p.pid).then(()=>toast('Pass ID copied'),()=>toast('Pass ID: '+p.pid))};
  $('#passDlg').showModal();
}
function updateCount(){$('#passCount').textContent=passes.length}
$('#passesBtn').onclick=()=>{
  $('#myBody').innerHTML=passes.length?passes.map(passHTML).join(''):`<p class="pass-empty">You have no passes yet. Pick an event and tap Register.</p>`;
  $('#myDlg').showModal();
};

/* host */
const openHost=()=>{$('#hostForm').reset();['eHT','eHC','eHD','eHV'].forEach(i=>$('#'+i).textContent='');$('#hostDlg').showModal()};
$('#hostBtn').onclick=openHost;$('#hostBtn2').onclick=openHost;
$('#hostForm').addEventListener('submit',e=>{
  e.preventDefault();
  const t=$('#hTitle').value.trim(),c=$('#hClub').value.trim(),d=$('#hDate').value,v=$('#hVenue').value.trim();
  $('#eHT').textContent=t?'':'Give the event a title.';
  $('#eHC').textContent=c?'':'Tell us which club is hosting.';
  $('#eHD').textContent=d?'':'Pick a date and time.';
  $('#eHV').textContent=v?'':'Add a venue.';
  if(!t||!c||!d||!v)return;
  events.push({id:Date.now(),title:t,cat:$('#hCat').value,club:c,date:d,venue:v,seats:Math.max(1,+$('#hSeats').value||100),desc:$('#hDesc').value.trim()||'Details coming soon.'});
  $('#hostDlg').close();filter='all';query='';$('#q').value='';renderChips();renderEvents();
  toast('Event published');location.hash='#events';
});

/* flagship + countdown */
$('#flagReg').onclick=()=>openReg(1);
const target=new Date('2026-11-28T09:00:00+05:30').getTime();
function tick(){
  let s=Math.max(0,Math.floor((target-Date.now())/1000));
  const d=Math.floor(s/86400);s%=86400;const h=Math.floor(s/3600);s%=3600;const m=Math.floor(s/60);s%=60;
  const p=n=>String(n).padStart(2,'0');
  $('#cd-d').textContent=p(d);$('#cd-h').textContent=p(h);$('#cd-m').textContent=p(m);$('#cd-s').textContent=p(s);
}
tick();setInterval(tick,1000);

document.querySelectorAll('img.iem-logo:not([src])').forEach(i=>i.src=LOGO);
const fav=document.createElement('link');fav.rel='icon';fav.href=LOGO;document.head.appendChild(fav);
renderChips();renderEvents();updateCount();
