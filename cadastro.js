import {loadAll, saveAll, uid} from './storage.js';

const form = document.getElementById('formMed');
const horariosWrap = document.getElementById('horariosWrap');
const addHorario = document.getElementById('addHorario');

const nome = document.getElementById('nome');
const dose = document.getElementById('dose');
const cor = document.getElementById('cor');
const icone = document.getElementById('icone');
const foto = document.getElementById('foto');
const audioFile = document.getElementById('audioFile');

let gravarBtn = document.getElementById('gravarBtn');
let pararBtn = document.getElementById('pararBtn');
let previewAudio = document.getElementById('previewAudio');

let chunks = [];
let mediaRecorder = null;
let editingId = new URLSearchParams(location.search).get('id');
let items = loadAll();
let editing = editingId ? items.find(x=>x.id===editingId) : null;

function addHorarioInput(value='08:00'){
  const div = document.createElement('div');
  div.className='horario-line';
  div.innerHTML = `<input type="time" value="${value}" required />
                   <button type="button" class="btn danger remove">x</button>`;
  div.querySelector('.remove').onclick = ()=> div.remove();
  horariosWrap.appendChild(div);
}
addHorario.onclick = ()=> addHorarioInput();

if(!editing){ addHorarioInput('08:00'); addHorarioInput('20:00'); }
else{
  nome.value = editing.nome||''; dose.value = editing.dose||''; cor.value = editing.cor||'#1E88E5';
  icone.value = editing.icone||'pill';
  (editing.horarios||['08:00']).forEach(h=>addHorarioInput(h));
  if(editing.audioUrl){ previewAudio.src = editing.audioUrl; }
}

gravarBtn.onclick = async ()=>{
  if(!navigator.mediaDevices?.getUserMedia){ alert('Gravação não suportada'); return; }
  const stream = await navigator.mediaDevices.getUserMedia({audio:true});
  mediaRecorder = new MediaRecorder(stream);
  chunks = [];
  mediaRecorder.ondataavailable = e => chunks.push(e.data);
  mediaRecorder.onstop = ()=>{
    const blob = new Blob(chunks, {type:'audio/webm'});
    previewAudio.src = URL.createObjectURL(blob);
    previewAudio.dataset.blob = previewAudio.src;
  };
  mediaRecorder.start();
  gravarBtn.disabled = true; pararBtn.disabled = false;
};
pararBtn.onclick = ()=>{
  if(mediaRecorder && mediaRecorder.state!=='inactive'){ mediaRecorder.stop(); }
  gravarBtn.disabled = false; pararBtn.disabled = true;
};

form.onsubmit = async (e)=>{
  e.preventDefault();
  const horarios = Array.from(horariosWrap.querySelectorAll('input[type="time"]')).map(i=>i.value).filter(Boolean);

  let fotoUrl = null;
  if(foto.files[0]){
    fotoUrl = URL.createObjectURL(foto.files[0]);
  }

  let audioUrl = previewAudio.dataset.blob || null;
  if(audioFile.files[0]){
    audioUrl = URL.createObjectURL(audioFile.files[0]);
  }

  const data = {
    id: editing?.id || uid(),
    nome: nome.value.trim(),
    dose: dose.value.trim(),
    cor: cor.value,
    icone: icone.value,
    foto: fotoUrl,
    horarios,
    audioUrl,
    historicoTomadas: editing?.historicoTomadas || []
  };

  if(editing){
    const idx = items.findIndex(x=>x.id===editing.id);
    items[idx] = data;
  }else{
    items.push(data);
  }
  saveAll(items);
  location.href = 'index.html';
};
