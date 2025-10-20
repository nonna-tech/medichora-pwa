import {loadAll, saveAll} from './storage.js';

const lista = document.getElementById('lista');
const vazio = document.getElementById('vazio');
const cardTemplate = document.getElementById('cardTemplate');
const alarmEl = document.getElementById('alarme');
const alarmTexto = document.getElementById('alarmTexto');
const btnAlarmOuvir = document.getElementById('btnAlarmOuvir');
const btnAlarmTomar = document.getElementById('btnAlarmTomar');
const btnAlarmSnooze = document.getElementById('btnAlarmSnooze');

let items = loadAll();
let currentAlarm = null;
let audioObj = null;

function fmtTime(d){ return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }
function nextOccurrence(hhmm){
  const [h,m] = hhmm.split(':').map(Number);
  const now = new Date();
  const d = new Date();
  d.setHours(h, m, 0, 0);
  if(d < now){ d.setDate(d.getDate()+1); }
  return d;
}
function computeNextDate(item){
  const list = (item.horarios||[]).map(nextOccurrence).sort((a,b)=>a-b);
  return list[0] || null;
}

function render(){
  lista.innerHTML = '';
  if(!items.length){ vazio.style.display='block'; return; }
  vazio.style.display='none';

  items.sort((a,b)=>{
    const na = computeNextDate(a), nb = computeNextDate(b);
    return (na?.getTime()||Infinity) - (nb?.getTime()||Infinity);
  });

  for(const it of items){
    const node = cardTemplate.content.cloneNode(true);
    const art = node.querySelector('.card');
    art.style.borderColor = it.cor || '#cbd5e1';
    art.querySelector('.pill').style.background = it.foto ? `center / cover url(${it.foto})` : 'linear-gradient(135deg,#fff,#ddd)';
    art.querySelector('.card-title').textContent = it.nome || 'Sem nome';
    art.querySelector('.dose').textContent = it.dose || '';
    const nx = computeNextDate(it);
    node.querySelector('.next-time').textContent = nx ? ('Próximo: '+fmtTime(nx)) : 'Sem horário';

    node.querySelector('.btn-ouvir').onclick = ()=>playAudio(it);
    node.querySelector('.btn-tomar').onclick = ()=>registrarTomada(it.id);
    node.querySelector('.btn-excluir').onclick = ()=>excluir(it.id);
    node.querySelector('.btn-editar').onclick = ()=>location.href = 'cadastro.html?id='+encodeURIComponent(it.id);
    lista.appendChild(node);
  }
}

function excluir(id){
  if(!confirm('Excluir este medicamento?')) return;
  items = items.filter(x=>x.id!==id);
  saveAll(items); render();
}

function registrarTomada(id){
  const it = items.find(x=>x.id===id);
  if(!it) return;
  it.historicoTomadas = it.historicoTomadas||[];
  it.historicoTomadas.push(new Date().toISOString());
  saveAll(items);
  stopAlarm();
  render();
}

function showAlarm(it){
  currentAlarm = it;
  alarmTexto.textContent = (it.nome? it.nome+' — ' : '') + (it.dose||'');
  alarmEl.classList.remove('hidden');
  loopSound();
  if(navigator.vibrate){ navigator.vibrate([600,200,600,200,600]); }
}

function stopAlarm(){
  alarmEl.classList.add('hidden');
  if(audioObj){ audioObj.pause(); audioObj.currentTime = 0; audioObj = null; }
  if(navigator.vibrate){ navigator.vibrate(0); }
  currentAlarm = null;
}

function playAudio(it){
  if(audioObj){ audioObj.pause(); }
  if(it.audioUrl){
    audioObj = new Audio(it.audioUrl);
  } else {
    audioObj = new Audio('assets/sounds/som_alerta.wav');
  }
  audioObj.play().catch(()=>{});
}

function loopSound(){
  if(currentAlarm){
    audioObj = new Audio('assets/sounds/som_alerta.wav');
    audioObj.loop = true;
    audioObj.play().catch(()=>{});
  }
}

btnAlarmOuvir?.addEventListener('click', ()=> currentAlarm && playAudio(currentAlarm));
btnAlarmTomar?.addEventListener('click', ()=> currentAlarm && registrarTomada(currentAlarm.id));
btnAlarmSnooze?.addEventListener('click', ()=>{
  if(!currentAlarm) return;
  const it = currentAlarm;
  const snoozeAt = new Date(Date.now()+5*60*1000);
  it._snooze = snoozeAt.toISOString();
  saveAll(items);
  stopAlarm();
});

setInterval(()=>{
  const now = new Date();
  for(const it of items){
    if(it._snooze){
      const s = new Date(it._snooze);
      if(Math.abs(s - now) < 15000){ showAlarm(it); it._snooze = null; saveAll(items); return; }
      continue;
    }
    for(const h of (it.horarios||[])){
      const t = nextOccurrence(h);
      const diff = Math.abs(t - now);
      if(diff < 15000){ showAlarm(it); return; }
    }
  }
}, 30000);

render();
