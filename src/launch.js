/* ===== Launcher (menu principal) ===== */
let installPrompt = null;
const launcher = document.getElementById('launcher');
function showLauncher() {
  document.getElementById('launch-label').textContent = hadSavedCareer || G.season > 1 || G.day > 1 ? 'Reprendre ma carrière' : 'Entrer dans le club';
  document.getElementById('launch-save').textContent = 'Saison ' + G.season + ' · ' + DIVS[myDiv()].n + ' · ' + dateStr() + ' · Sauvegarde sur cet appareil';
  document.getElementById('launch-players').innerHTML = ['rafa','leo','yanis'].map(id => (P(id) ? '<div class="launch-player">' + chibi(pv(P(id)), 'full', 'happy') + '</div>' : '')).join('');
  launcher.hidden = false; app.hidden = true; ovl.hidden = true;
}
document.getElementById('launch-play').addEventListener('click', () => { launcher.hidden = true; app.hidden = false; ovl.hidden = false; render(); });
function launchHelp(kind) {
  const box = document.getElementById('launch-help');
  const same = box.dataset.kind === kind && !box.hidden;
  box.hidden = same; box.dataset.kind = kind;
  document.getElementById('launch-how').setAttribute('aria-expanded',String(!same && kind === 'how'));
  document.getElementById('launch-install').setAttribute('aria-expanded',String(!same && kind === 'install'));
  box.innerHTML = kind === 'how' ? '<p><strong>1. Fais avancer le temps</strong><br>Appuie sur Continuer. Les jours passent tout seuls.</p><p><strong>2. Réponds quand on t’écrit</strong><br>Un joueur ou ton staff peut t’écrire. La simulation s’arrête et tu choisis.</p><p><strong>3. Joue les matchs</strong><br>Prépare ta compo, puis les joueurs jouent seuls. Monte les 4 divisions et gagne la Coupe du Roi.</p' : '<p><strong>iPhone / iPad</strong><br>Ouvre ce lien dans Safari → Partager → Sur l’écran d’accueil.</p><p><strong>Android</strong><br>Dans Chrome, ouvre le menu ⋮ → Installer l’application ou Ajouter à l’écran d’accueil.</p><p>Ta carrière reste enregistrée dans ce navigateur. Utilise le même lien pour la retrouver.</p>';
}
document.getElementById('launch-how').addEventListener('click',()=>launchHelp('how'));
window.addEventListener('beforeinstallprompt', e=>{e.preventDefault();installPrompt=e;});
document.getElementById('launch-install').addEventListener('click',async()=>{if(installPrompt){await installPrompt.prompt();installPrompt=null;}else launchHelp('install');});
document.getElementById('launch-fullscreen').addEventListener('click',async()=>{try{if(!document.fullscreenElement&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else if(document.fullscreenElement)await document.exitFullscreen();else{launchHelp('install');}}catch{launchHelp('install');}});
if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(()=>{});
showLauncher();
