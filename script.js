const cover = document.getElementById('cover');
const pages = document.getElementById('pages');
document.getElementById('openInvite').addEventListener('click', () => {
  cover.classList.add('opening');
  setTimeout(() => {
    cover.style.display = 'none';
    pages.classList.add('visible');
    pages.setAttribute('aria-hidden','false');
    document.querySelector('.hero-page').scrollIntoView({behavior:'smooth'});
    observeSections();
    setupScratch();
  }, 650);
});

function observeSections(){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    });
  }, {threshold:.15});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

const weddingDate = new Date('2026-12-06T14:00:00+05:00');
function updateCountdown(){
  let diff = weddingDate - new Date();
  if(diff < 0) diff = 0;
  const days = Math.floor(diff/86400000);
  const hours = Math.floor(diff%86400000/3600000);
  const minutes = Math.floor(diff%3600000/60000);
  const seconds = Math.floor(diff%60000/1000);
  document.getElementById('days').textContent = String(days).padStart(2,'0');
  document.getElementById('hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2,'0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2,'0');
}
updateCountdown(); setInterval(updateCountdown,1000);

let scratched = false;
function setupScratch(){
  if(scratched) return; scratched = true;
  const canvas = document.getElementById('scratchCanvas');
  const ctx = canvas.getContext('2d');
  const wrap = canvas.parentElement;
  function drawFoil(){
    const r = wrap.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    canvas.width = r.width*dpr; canvas.height = r.height*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const grad = ctx.createLinearGradient(0,0,r.width,r.height);
    grad.addColorStop(0,'#d2bd8d'); grad.addColorStop(.45,'#eadbb7'); grad.addColorStop(1,'#c4aa75');
    ctx.fillStyle=grad; ctx.fillRect(0,0,r.width,r.height);
    for(let y=2;y<r.height;y+=5){ctx.strokeStyle='rgba(116,91,48,.12)';ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(r.width,y);ctx.stroke();}
    ctx.fillStyle='#6e6048';ctx.textAlign='center';
    ctx.font='italic 24px Georgia';ctx.fillText('Something Special Awaits',r.width/2,r.height/2-4);
    ctx.font='8px Arial';ctx.letterSpacing='3px';ctx.fillText('S C R A T C H  T O  R E V E A L',r.width/2,r.height/2+22);
  }
  drawFoil(); window.addEventListener('resize',drawFoil);
  let down=false;
  function point(e){const r=canvas.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
  function scratch(e){if(!down)return;const p=point(e);ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(p.x,p.y,19,0,Math.PI*2);ctx.fill();}
  canvas.addEventListener('pointerdown',e=>{down=true;canvas.setPointerCapture(e.pointerId);scratch(e);});
  canvas.addEventListener('pointermove',scratch);
  canvas.addEventListener('pointerup',()=>{down=false;});
  canvas.addEventListener('pointercancel',()=>{down=false;});
}
document.getElementById('revealBtn').addEventListener('click',()=>{
  const c=document.getElementById('scratchCanvas'),ctx=c.getContext('2d');
  ctx.globalCompositeOperation='destination-out';ctx.fillRect(0,0,c.width,c.height);
});

const eventTitle='Wedding Reception — Abdul Rafey & Fatima Faisal';
const eventDescription='Wedding reception of Abdul Rafey and Fatima Faisal.';
const start='20261206T090000Z', end='20261206T120000Z';
document.getElementById('googleCalendar').addEventListener('click',()=>{
  const url='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(eventTitle)+'&dates='+start+'/'+end+'&details='+encodeURIComponent(eventDescription)+'&location='+encodeURIComponent('La Quinta — Aura Grande Arena, Phase 7, Bahria Town, Rawalpindi, Pakistan');
  window.open(url,'_blank','noopener');
});
document.getElementById('outlookCalendar').addEventListener('click',()=>{
  const url='https://outlook.live.com/calendar/0/deeplink/compose?subject='+encodeURIComponent(eventTitle)+'&startdt=2026-12-06T14:00:00%2B05:00&enddt=2026-12-06T17:00:00%2B05:00&body='+encodeURIComponent(eventDescription)+'&location='+encodeURIComponent('La Quinta — Aura Grande Arena, Rawalpindi');
  window.open(url,'_blank','noopener');
});
document.getElementById('downloadIcs').addEventListener('click',()=>{
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invitation//EN','BEGIN:VEVENT','UID:wedding-rafey-fatima-20261206@example.com','DTSTAMP:20261117T000000Z','DTSTART:20261206T090000Z','DTEND:20261206T120000Z','SUMMARY:'+eventTitle,'DESCRIPTION:'+eventDescription,'LOCATION:La Quinta — Aura Grande Arena, Phase 7, Bahria Town, Rawalpindi, Pakistan','END:VEVENT','END:VCALENDAR'].join('\r\n');
  const blob=new Blob([ics],{type:'text/calendar;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='wedding-invitation.ics';a.click();URL.revokeObjectURL(url);
});
document.getElementById('shareWhatsApp').addEventListener('click',()=>{
  const msg='You are warmly invited to the wedding reception of Abdul Rafey & Fatima Faisal on Sunday, 6 December 2026 at 2:00 PM. Venue: La Quinta — Aura Grande Arena, Rawalpindi.';
  window.open('https://wa.me/?text='+encodeURIComponent(msg+' '+location.href),'_blank','noopener');
});
document.getElementById('copyLink').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(location.href);alert('Invitation link copied!');}
  catch(e){prompt('Copy your invitation link:',location.href);}
});
