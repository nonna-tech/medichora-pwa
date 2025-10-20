let deferredPrompt;
const installBtn = document.getElementById('installBtn');
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('service-worker.js').catch(()=>{});
}
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault(); deferredPrompt = e;
  if(installBtn){ installBtn.style.display='inline-flex'; }
});
installBtn?.addEventListener('click', async ()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.style.display='none';
});
