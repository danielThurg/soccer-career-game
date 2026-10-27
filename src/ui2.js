/* ===== UI overlays, actions, runner ===== */
const app = document.getElementById('app'), ovl = document.getElementById('ovl');
let TO = null, LT = null;
function toast(t) { UI.toast = t; const old = document.querySelector('.toast'); if (old) old.remove(); const e = document.createElement('div'); e.className = 'toast'; e.textContent = t; document.body.appendChild(e); clearTimeout(TO); TO = setTimeout(() => e.remove(), 2200); }

function topBar() {
  const th = THEME[UI.screen], d = myDiv(), rk = myRank();
  return '<div class="top">' + badge(ME, 32) + '<div><h1>' + T(ME).name + '</h1><small>' + DIVS[d].n + ' · ' + ordn(rk) + ' · ' + th[2] + '</small></div><div class="chips"><div class="chip"><b>' + dateStr() + '</b><span>Saison ' + G.season + '</span></div><div class="chip"><b>' + fmt(G.budget) + '</b><span>Budget</span></div><div class="chip"><b>' + Math.round(G.board) + ' %</b><span>Conseil</span></div></div><button class="menu-button" data-a="menu" aria-label="Menu principal">☰</button><button class="bell" data-a="openmsg">✉' + (unread() ? '<i>' + unread() + '</i>' : '') + '</button></div>';
}
function navBar() { return '<div class="nav">' + NAVO.map((k) => '<button class="' + (UI.screen === k ? 'on' : '') + '" data-a="nav" data-i="' + k + '">' + ICON[k] + THEME[k][2] + '</button>').join('') + '</div>'; }
function render() {
  const th = THEME[UI.screen]; app.style.setProperty('--acc', th[0]); app.style.setProperty('--accfg', th[1]);
  const old = app.querySelector('.scr'), st = old ? old.scrollTop : 0;
  const body = { home: sHome, eff: sEff, tac: sTac, cal: sCal, club: sClub }[UI.screen]();
  app.innerHTML = topBar() + '<div class="scr">' + body + '</div>' + navBar();
  const n = app.querySelector('.scr'); if (n) n.scrollTop = st;
  renderOv();
}
function renderLite() { if (UI.screen === 'home') render(); else { const t = app.querySelector('.top'); if (t) t.outerHTML = topBar(); } if (UI.ov) renderOv(); }

/* ---------- Overlays ---------- */
function renderOv() {
  if (!UI.ov) { ovl.innerHTML = ''; return; }
  const f = { msg: ovMsg, press: ovPress, pre: ovPre, match: ovMatch, season: ovSeason, talk: ovTalk }[UI.ov];
  ovl.innerHTML = '<div class="ov">' + f() + '</div>';
  const fd = ovl.querySelector('.feed'); if (fd) fd.parentElement.scrollTop = fd.parentElement.scrollHeight;
  const ch = ovl.querySelector('.chat'); if (ch) ch.scrollTop = ch.scrollHeight;
}
function portrait(m) { return m.from.t === 'p' && P(m.from.id) ? '<div class="hd" style="width:36px;height:36px">' + chibi(pv(P(m.from.id)), 'head', moodOf(P(m.from.id)).mood) + '</div>' : '<div class="hd" style="width:36px;height:36px">' + chibi(staffView(m.from.id), 'head', 'happy') + '</div>'; }
function ovMsg() {
  const list = G.inbox.filter((m) => !m.info);
  if (!UI.msgSel || !G.inbox.find((m) => m.id === UI.msgSel)) UI.msgSel = list[0] && list[0].id;
  const sel = G.inbox.find((m) => m.id === UI.msgSel);
  const rows = list.map((m) => '<div class="mrow' + (m.st === 'new' ? ' new' : '') + '" style="' + (m.id === UI.msgSel ? 'box-shadow:0 2px 0 var(--ink);border-color:var(--ink)' : '') + '" data-a="msgsel" data-i="' + m.id + '">' + portrait(m) + '<div class="grow"><b>' + sender(m).name + '</b><div class="trunc">' + (m.st === 'done' ? (m.expired ? 'Sans réponse' : 'Répondu') : m.text) + '</div></div></div>').join('') || '<div class="muted" style="padding:10px;font-weight:700">Aucun message pour l’instant. La simulation s’arrête quand un joueur ou ton staff t’écrit.</div>';
  let conv = '<div class="muted" style="padding:20px;text-align:center;font-weight:800">Choisis un message.</div>';
  if (sel) {
    const s = sender(sel); let ch = '';
    ch += '<div class="row" style="align-items:flex-end;gap:7px"><div class="hd" style="width:34px;height:34px">' + (sel.from.t === 'p' ? chibi(pv(P(sel.from.id) || G.players[0]), 'head', moodOf(P(sel.from.id) || G.players[0]).mood) : chibi(staffView(sel.from.id), 'head', 'happy')) + '</div><div class="bub">' + sel.text + '</div></div>';
    if (sel.st === 'done' && sel.sel !== undefined && sel.choices) { ch += '<div class="bub me">' + sel.choices[sel.sel].t + '</div>'; if (sel.reply) ch += '<div class="row" style="align-items:flex-end;gap:7px"><div class="hd" style="width:34px;height:34px;opacity:.0"></div><div class="bub">' + sel.reply + '</div></div>'; if (sel.sum && sel.sum.length) ch += '<div class="bub sum">' + sel.sum.join(' · ') + '</div>'; }
    else if (sel.expired) ch += '<div class="bub sum">Tu n’as pas répondu à temps. Il est déçu.</div>';
    const choices = sel.st === 'new' && sel.choices ? '<div class="col" style="gap:5px;margin-top:6px">' + sel.choices.map((c, i) => '<button class="chbtn" data-a="choose" data-i="' + sel.id + '" data-c="' + i + '">' + c.t + '</button>').join('') + '</div>' : '';
    conv = '<div class="col" style="height:100%"><div class="muted" style="font-weight:800;font-size:11px">' + s.name + ' · ' + (sel.day ? 'Jour ' + sel.day : '') + '</div><div class="chat col" style="gap:7px;flex:1;overflow:auto;min-height:0;padding:4px 0">' + ch + '</div>' + choices + '</div>';
  }
  return '<div class="md" style="height:min(340px,100%);display:flex;flex-direction:column"><div class="row" style="justify-content:space-between;margin-bottom:6px"><h3 style="margin:0;font-size:16px">✉ Messages</h3><div class="row"><button class="btn sm pri" data-a="resume">Continuer la simulation ▶</button><button class="btn sm" data-a="closeov">Fermer</button></div></div><div class="row" style="align-items:stretch;gap:8px;flex:1;min-height:0"><div class="col" style="flex:0 0 38%;overflow:auto;gap:4px">' + rows + '</div><div class="card grow" style="min-height:0;overflow:hidden">' + conv + '</div></div></div>';
}
const JOURN = { num: '', build: 1.0, look: { skin: '#E3BC98', hair: 'slick', hc: '#B5502A', beard: undefined }, kit: ['#438BC0', '#FFFAF0'], kitStyle: 'plain', pos: 'MIL' };
function ovPress() {
  const pr = G.presser, cur = UI.pq || 0, q = pr.qs[cur], done = pr.res[cur];
  const bubble = '<div class="row" style="align-items:flex-end;gap:8px"><div style="width:70px;height:78px;background:#CFE3E8;border-radius:12px;overflow:hidden;flex:none">' + chibi(JOURN, 'bust', 'focus') + '</div><div class="bub" style="font-size:14px">🎤 ' + q.q + '</div></div>';
  let ans;
  if (!done) ans = '<div class="col" style="gap:5px;margin-top:8px">' + q.a.map((a, k) => '<button class="chbtn" data-a="panswer" data-c="' + k + '">' + a.t + '</button>').join('') + '</div>';
  else ans = '<div class="col" style="gap:6px;margin-top:8px"><div class="bub me">' + q.a[done.ci].t + '</div>' + (done.rep ? '<div class="muted" style="font-weight:800;font-size:12px">' + done.rep + '</div>' : '') + (done.sum.length ? '<div class="bub sum">' + done.sum.join(' · ') + '</div>' : '') + '<button class="btn pri" data-a="' + (cur < pr.qs.length - 1 ? 'pnext' : 'pend') + '">' + (cur < pr.qs.length - 1 ? 'Question suivante ▶' : 'Terminer la conférence ▶') + '</button></div>';
  return '<div class="md" style="max-width:640px"><div class="row" style="justify-content:space-between;margin-bottom:6px"><h3 style="margin:0;font-size:16px">🎙 Conférence de presse · ' + (cur + 1) + '/' + pr.qs.length + '</h3><span class="tag" style="background:#EAD3B0">Avant ' + T(pr.opp).name + '</span></div>' + bubble + ans + '</div>';
}
function ovPre() {
  const m = G.match, ot = T(m.opp), lu = G.lineup.map(P).filter(Boolean);
  const nm = nextMy(), left = (nm ? nm.day : G.day) - G.day, u = teamStr(1, 1), warn = [];
  lu.filter((p) => p.fat > 70).forEach((p) => warn.push(p.name + ' est fatigué'));
  lu.filter((p) => p.moral < 40).forEach((p) => warn.push(p.name + ' est frustré'));
  G.players.filter((p) => p.promise && G.lineup.indexOf(p.id) < 0 && avail(p)).forEach((p) => warn.push('Tu as promis la titularisation à ' + p.name));
  void left; void u;
  const chips = lu.map((p) => '<div class="row" style="gap:5px;background:var(--paper);border:1.5px solid var(--line2);border-radius:10px;padding:2px 6px">' + headH(p, 24) + '<b style="font-size:11.5px">' + p.name + '</b><b style="margin-left:auto;color:' + col(rate(p)) + '">' + rate(p) + '</b></div>').join('');
  return '<div class="md" style="max-width:680px"><div class="row" style="justify-content:center;gap:16px;margin:2px 0 4px">' + badge(ME, 50) + '<div style="text-align:center"><div class="tag" style="background:' + (m.kind === 'L' ? DIVS[myDiv()].col : '#F0C253') + '">' + (m.kind === 'L' ? DIVS[myDiv()].n + ' · J' + (m.r + 1) : 'Coupe du Roi · ' + CUPR[m.r]) + '</div><div style="font-size:24px;font-weight:800">JOUR DE MATCH</div><div class="muted" style="font-weight:800;font-size:12px">' + (m.home ? 'À domicile' : m.neutral ? 'Terrain neutre' : 'À l’extérieur') + ' · ' + T(ME).name + ' vs ' + ot.name + '</div></div>' + badge(m.opp, 50) + '</div>' +
    '<div class="row" style="gap:5px;flex-wrap:wrap;margin:6px 0">' + [G.formation.slice(2), MENT[G.ment].n, 'Penaltys : ' + (P(G.penTaker) ? P(G.penTaker).name : '—'), 'Capitaine : ' + (P(G.captain) ? P(G.captain).name : '—')].map((t) => '<span class="tag" style="background:#EAD3B0">' + t + '</span>').join('') + '</div>' +
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px">' + chips + '</div>' +
    (warn.length ? '<div style="margin-top:6px;background:#F3E0B0;border-radius:10px;padding:5px 9px;font-weight:800;font-size:12px">⚠ ' + warn.join(' · ') + '</div>' : '') +
    '<div class="row" style="gap:8px;margin-top:8px"><button class="btn grow" data-a="edit">Modifier la compo</button><button class="btn pri grow" data-a="kick" style="font-size:15px">⚽ Lancer le match</button></div></div>';
}
function ovMatch() {
  const ot = T(M.opp), mine = M.home;
  const bx = M.ball === 'U' ? 14 : M.ball === 'O' ? -14 : 0, by = 12 + (M.b * 37 % 76);
  const tk = [];
  tokenPos().forEach((q, i) => { const p = P(M.mine[i]); const a = pitchPt(clamp(q[0] * 0.5 + bx * 0.35, 3, 97), q[1]); tk.push({ x: a.x, y: a.y, s: a.s, c: i === 0 ? ['#5E7A5A', '#2F4A2E'] : teamCol(ME), sk: p ? p.look.skin : null }); const b = pitchPt(clamp(100 - q[0] * 0.5 + bx * 0.35, 3, 97), 100 - q[1]); tk.push({ x: b.x, y: b.y, s: b.s, c: i === 0 ? ['#8A8F98', '#4B4F57'] : teamCol(M.opp), sk: null }); });
  tk.sort((a, b2) => a.y - b2.y);
  const bp = pitchPt(clamp(50 + bx * 2.2, 8, 92), by), ballO = { x: bp.x, y: bp.y };
  const bg = mine ? stadiumSvg(myStadium({ id: 'mt', fill: clamp(M.att / CAPS[G.fac.cap], 0.15, 1), night: G.fac.lights > 0 && M.b > 10, on: G.fac.lights > 0, score: M.sc[0] + '-' + M.sc[1], tok: tk, ball: ballO })) : stadiumSvg({ id: 'aw', pitch: '#7FA077', ps: 'stripes', seat: teamCol(M.opp)[0], seat2: teamCol(M.opp)[1], cap: M.neutral ? 5 : clamp(5 - ot.div, 2, 4), vip: M.neutral ? 2 : 0, lights: ot.div < 2 || M.neutral ? 2 : 0, pq: 3, fill: M.neutral ? 0.95 : 0.7, name: M.neutral ? 'FINALE' : ot.short + ' ' + 'ARENA'.slice(0, 0), night: M.neutral, on: M.neutral, score: M.sc[0] + '-' + M.sc[1], tok: tk, ball: ballO });
  const hs = M.home ? [ME, M.opp] : [M.opp, ME], sc = M.home ? M.sc : [M.sc[1], M.sc[0]];
  const sb = '<div class="sbx">' + badge(hs[0], 26) + '<span class="s">' + sc[0] + '</span><span style="font-weight:800;font-size:12px;min-width:34px;text-align:center">' + (M.over ? 'FIN' : M.min + '\'') + '</span><span class="s">' + sc[1] + '</span>' + badge(hs[1], 26) + '</div>';
  const feed = '<div class="feed">' + M.feed.map((f) => '<div class="' + f.c + '">' + f.t + '</div>').join('') + '</div>';
  let ctrl;
  if (M.over) {
    const sc2 = {}; M.scorers.forEach((id) => { sc2[id] = (sc2[id] || 0) + 1; });
    const win = M.sc[0] > M.sc[1], draw = M.sc[0] === M.sc[1];
    const pen = M.pen ? ' · tirs au but ' + M.pen[0] + '-' + M.pen[1] : '';
    const lines = Object.keys(sc2).map((id) => P(id).name + (sc2[id] > 1 ? ' ×' + sc2[id] : '')).join(', ');
    ctrl = '<div class="card" style="background:' + (win || (draw && M.pen && M.pen[0] > M.pen[1]) ? '#D7E2CF' : draw ? '#F3E0B0' : '#F2D6D3') + '"><div style="font-size:18px;font-weight:800">' + (win ? 'Victoire' : draw ? (M.pen ? (M.pen[0] > M.pen[1] ? 'Qualifiés aux tirs au but' : 'Éliminés aux tirs au but') : 'Match nul') : 'Défaite') + ' ' + M.sc[0] + '-' + M.sc[1] + pen + '</div><div style="font-size:12px;font-weight:700">' + (lines ? 'Buteurs : ' + lines + '. ' : '') + (M.gate ? 'Recette : ' + fmt(M.gate) + '. ' : '') + '</div>' + (M.serious ? '<div style="margin-top:3px;font-weight:800;color:#C46A55">Blessure grave : ' + P(M.serious).name + ' est out ' + P(M.serious).inj + ' jours.</div>' : M.injured ? '<div style="margin-top:3px;font-weight:800;color:#C46A55">' + P(M.injured).name + ' est blessé.</div>' : '') + (M.kind === 'C' && M.winner !== null && M.r !== 4 ? '<div style="font-weight:800;margin-top:3px">' + (M.winner === ME ? 'On passe au tour suivant.' : 'Éliminés de la Coupe du Roi.') + '</div>' : '') + '<button class="btn pri" style="width:100%;margin-top:6px" data-a="after">Continuer ▶</button></div>';
  } else if (UI.ht) {
    ctrl = '<div class="card"><b>Mi-temps ' + M.sc[0] + '-' + M.sc[1] + '</b> · Causerie<div class="col" style="gap:4px;margin-top:5px"><button class="chbtn" data-a="ht" data-i="enc">Encourager : le milieu monte d’un cran</button><button class="chbtn" data-a="ht" data-i="push">Exiger plus : attaque +4, défense −2</button><button class="chbtn" data-a="ht" data-i="safe">Se resserrer : défense +4, attaque −3</button></div></div>';
  } else {
    ctrl = '<div class="row" style="gap:6px"><span class="muted" style="font-weight:800;font-size:11px">Vitesse</span><div class="seg" style="width:140px">' + [1, 2, 4].map((v) => '<button class="' + (UI.mspeed === v ? 'on' : '') + '" data-a="mspeed" data-i="' + v + '">×' + v + '</button>').join('') + '</div><button class="btn sm" data-a="skip" style="margin-left:auto">Passer ⏭</button></div>';
  }
  return '<div class="md" style="width:min(820px,100%);height:min(350px,100%);display:flex;gap:8px;padding:8px;overflow:hidden"><div style="flex:0 0 52%;position:relative;border:2px solid var(--ink);border-radius:12px;overflow:hidden;background:#000">' + bg + sb + '</div><div class="col" style="flex:1;min-width:0"><div class="card" style="flex:1;min-height:0;overflow:auto;padding:6px">' + feed + '</div>' + ctrl + '</div></div>';
}
function ovSeason() {
  const h = G.lastRec, d = myDiv();
  return '<div class="md" style="max-width:520px;text-align:center"><div style="font-size:12px;font-weight:800" class="muted">FIN DE SAISON ' + h.season + '</div><div style="font-size:28px;font-weight:800;margin:2px 0">' + h.res + (h.res === 'Promu' ? ' !' : '') + '</div><div style="font-weight:800">' + DIVS[h.div].n + ' · ' + ordn(h.rank) + ' avec ' + h.pts + ' pts</div><div class="muted" style="font-weight:700;margin:4px 0">Coupe du Roi : ' + h.cup + ' · Prime : ' + fmt(h.prize) + '</div><div class="card" style="margin:6px 0;background:' + (h.obj ? '#D7E2CF' : '#F2D6D3') + ';font-weight:800">Objectif ' + (h.obj ? 'atteint' : 'manqué') + ' · Conseil ' + Math.round(G.board) + ' %</div><div style="font-weight:800;margin-bottom:6px">Saison ' + G.season + ' : ' + DIVS[d].n + '</div><button class="btn pri big" data-a="newseason">Lancer la saison ' + G.season + ' ▶</button></div>';
}
function ovTalk() {
  const p = P(UI.talk); if (!p) return '';
  const msg = UI.talkMsg;
  return '<div class="md" style="max-width:460px"><div class="row" style="gap:10px;align-items:flex-start"><div style="width:90px;height:100px;background:#F3E0B0;border-radius:12px;overflow:hidden;flex:none">' + bust(p) + '</div><div class="grow"><b style="font-size:16px">' + p.name + '</b><div class="muted" style="font-weight:800;font-size:11px">' + TRAITS[p.trait] + ' · ' + moodOf(p).label + ' · moral ' + Math.round(p.moral) + '</div><div style="font-weight:700;margin:5px 0;min-height:34px">' + (msg || 'Il t’écoute. Comment lui parler ?') + '</div></div></div>' + (p.talked === G.day || (p.talkDay && G.day - p.talkDay < 3) ? '<div class="muted" style="font-weight:800;margin:6px 0">Vous avez déjà parlé récemment.</div>' : '<div class="col" style="gap:5px;margin-top:6px"><button class="chbtn" data-a="tone" data-i="enc">Encourager : « Je crois en toi. »</button><button class="chbtn" data-a="tone" data-i="fer">Être franc : « Il faut en faire plus. »</button><button class="chbtn" data-a="tone" data-i="pro">Promettre : « Tu débuteras le prochain match. »</button></div>') + '<button class="btn" style="width:100%;margin-top:8px" data-a="closeov">Fermer</button></div>';
}

/* ---------- Runner ---------- */
function blockedRun() { return !!G.match; }
function runSim() {
  if (UI.run) return; if (blockedRun()) { UI.ov = 'pre'; renderOv(); return; }
  UI.ov = null; UI.run = true; render(); tick();
}
function tick() {
  if (!UI.run) return;
  const r = nextDay();
  if (r.stop) { UI.run = false; handleStop(r); return; }
  renderLite();
  LT = setTimeout(tick, 520 / UI.speed);
}
function handleStop(r) {
  if (r.stop === 'match') { UI.ov = 'pre'; }
  else if (r.stop === 'presser') { UI.ov = 'press'; UI.pq = 0; }
  else if (r.stop === 'msg') { UI.ov = 'msg'; UI.msgSel = r.m.id; }
  else if (r.stop === 'season') { UI.ov = 'season'; }
  render();
}
function pauseSim() { UI.run = false; clearTimeout(LT); render(); }
function liveTick() {
  if (!UI.live) return;
  if (M.b === 15 && !M.htDone) { M.htDone = true; UI.ht = true; renderOv(); return; }
  stepBlock();
  if (M.done) { applyResult(); UI.live = false; }
  renderOv();
  if (!M.over) LT = setTimeout(liveTick, 430 / UI.mspeed);
}

/* ---------- Actions ---------- */
const ACT = {
  rotok() { document.getElementById('rot').classList.remove('show'); },
  menu() { if (!UI.live) { UI.run = false; clearTimeout(LT); showLauncher(); } },
  nav(d) { UI.screen = d.i; render(); },
  sel(d) { UI.sel = d.i; render(); },
  flt(d) { UI.flt = d.i; render(); },
  ctab(d) { UI.ctab = d.i; render(); }, cdiv(d) { UI.cdiv = +d.i; render(); },
  club(d) { UI.club = d.i; render(); }, mk(d) { UI.mk = d.i; render(); },
  train(d) { G.train = d.i; render(); },
  speed(d) { UI.speed = +d.i; render(); },
  go() { runSim(); }, pause() { pauseSim(); },
  prematch() { UI.ov = 'pre'; renderOv(); },
  closeov() { UI.ov = null; render(); },
  resume() { UI.ov = null; runSim(); },
  openmsg(d) { UI.ov = 'msg'; UI.msgSel = d.i || (G.inbox.find((m) => !m.info) || {}).id; const m = G.inbox.find((x) => x.id === UI.msgSel); renderOv(); void m; },
  msgsel(d) { UI.msgSel = d.i; renderOv(); },
  choose(d) { answerMsg(d.i, +d.c); render(); },
  panswer(d) { answerPress(UI.pq || 0, +d.c); renderOv(); },
  pnext() { UI.pq = (UI.pq || 0) + 1; renderOv(); },
  pend() { G.presser = null; UI.ov = null; UI.pq = 0; save(); runSim(); },
  edit() { UI.ov = null; UI.screen = 'tac'; render(); },
  kick() { startMatch(); UI.mspeed = UI.speed > 2 ? 2 : 1; UI.live = true; UI.ht = false; UI.ov = 'match'; renderOv(); LT = setTimeout(liveTick, 600); },
  mspeed(d) { UI.mspeed = +d.i; renderOv(); },
  skip() { clearTimeout(LT); UI.live = false; UI.ht = false; if (!M.htDone) M.htDone = true; if (!M.htm) M.htm = { a: 0, d: 0, m: 0 }; while (!M.done) stepBlock(); applyResult(); renderOv(); },
  ht(d) { M.htm = d.i === 'enc' ? { a: 2, d: 1, m: 4 } : d.i === 'push' ? { a: 4, d: -2, m: 1 } : { a: -3, d: 4, m: 0 }; if (d.i === 'enc') G.lineup.map(P).forEach((p) => { if (p) p.moral = clamp(p.moral + 2, 0, 100); }); UI.ht = false; M.feed.push({ t: 'Reprise de la seconde période.', c: '' }); renderOv(); LT = setTimeout(liveTick, 500); },
  after() { UI.ov = null; UI.live = false; M = null; render(); runSim(); },
  newseason() { UI.ov = null; render(); },
  /* effectif */
  talk(d) { UI.talk = d.i; UI.talkMsg = ''; UI.ov = 'talk'; renderOv(); },
  tone(d) { const p = P(UI.talk), tt = TALK[p.trait][d.i]; p.moral = clamp(p.moral + tt[0], 0, 100); p.talkDay = G.day; UI.talkMsg = tt[1].replace(/^Il /, p.name + ' ') + ' (' + (tt[0] > 0 ? '+' : '') + tt[0] + ' moral)'; if (d.i === 'pro') { p.promise = { t: 'start', until: G.day + 9 }; } renderOv(); render(); },
  capt(d) { applyFx([['captain', d.i]]); toast(P(d.i).name + ' est capitaine'); render(); },
  listp(d) { const p = P(d.i); p.listed = !p.listed; toast(p.listed ? p.name + ' mis en vente' : p.name + ' retiré de la vente'); render(); },
  /* tactique */
  tsel(d) { UI.tsel = UI.tsel === d.i ? null : d.i; if (UI.tsel && d.second) return; render(); },
  bench(d) { if (!UI.tsel) { toast('Touche d’abord un titulaire'); return; } const i = G.lineup.indexOf(UI.tsel); const p = P(d.i); if (!avail(p)) { toast(p.name + ' est indisponible'); return; } G.lineup[i] = d.i; UI.tsel = null; save(); render(); },
  auto() { G.lineup = []; fitLineup(); UI.tsel = null; toast('Meilleur onze placé'); save(); render(); },
  form(d) { G.formation = d.i; fitLineup(); render(); },
  ment(d) { G.ment = d.i; render(); },
  /* club */
  kit(d) { G.kit.c[+d.k] = d.i; render(); },
  kitstyle(d) { G.kit.s = d.i; render(); },
  look(d) { const s = staff(d.i), k = d.k, nx = (arr, v) => arr[(arr.indexOf(v) + 1) % arr.length]; if (k === 'hair') s.look.hair = nx(HAIR, s.look.hair); else if (k === 'hc') s.look.hc = nx(HCOL, s.look.hc); else if (k === 'skin') s.look.skin = nx(SKIN, s.look.skin); else s.look.beard = nx(['stubble', 'goatee', 'full', 'stache', undefined], s.look.beard); if (k === 'hc') s.look.bc = s.look.hc; save(); render(); },
  ustaff(d) { const e = upgradeStaff(d.i); toast(e || 'Staff amélioré'); render(); },
  stad(d) { G.stad[d.k] = d.i; save(); render(); },
  ufac(d) { const e = upgrade(d.i); toast(e || FAC[d.i].n + ' améliorée'); render(); },
  night() { UI.night = !UI.night; render(); },
  buy(d) { const e = buy(d.i); toast(e || 'Joueur signé'); render(); },
  sellnow(d) { const e = sellNow(d.i); toast(e || 'Joueur vendu'); render(); },
  reset() { if (UI.rst) { try { localStorage.removeItem(SAVE); } catch (e) { /* */ } newGame(); UI.rst = false; UI.screen = 'home'; render(); } else { UI.rst = true; toast('Touche encore pour tout effacer'); setTimeout(() => { UI.rst = false; }, 3000); } }
};
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-a]'); if (!el) return;
  const a = el.dataset.a;
  if (a === 'tsel' && UI.tsel && UI.tsel !== el.dataset.i) { const i = G.lineup.indexOf(UI.tsel), j = G.lineup.indexOf(el.dataset.i); if (i >= 0 && j >= 0) { const t = G.lineup[i]; G.lineup[i] = G.lineup[j]; G.lineup[j] = t; UI.tsel = null; render(); return; } }
  if (ACT[a]) ACT[a](el.dataset, el);
});
document.addEventListener('change', (e) => {
  const s = e.target.dataset && e.target.dataset.sel; if (!s) return;
  if (s === 'pen') G.penTaker = e.target.value; else if (s === 'cap') G.captain = e.target.value;
  save(); render();
});

/* ---------- Init ---------- */
const hadSavedCareer = load();
if (!hadSavedCareer) newGame();
if (G.match) { UI.ov = null; }
UI.mspeed = 1;
render();
window.__dbg = { get G() { return G; }, get M() { return M; }, UI, ACT, render, nextDay, newGame };
