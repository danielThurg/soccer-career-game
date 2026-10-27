/* ===== UI helpers & screens ===== */
const UI = { screen: 'home', sel: 'rafa', flt: 'Tous', tsel: null, ctab: 'cal1', cdiv: 3, club: 'kit', mk: 'mkt', ov: null, msgSel: null, run: false, speed: 1, toast: '', talk: null, talkMsg: '', ms: null, mt: null, ht: false };
const THEME = { home: ['#FFF0CD', '#2B1D14', 'Accueil'], eff: ['#86AD78', '#263E23', 'Effectif'], tac: ['#F0C253', '#493118', 'Tactique'], cal: ['#438BC0', '#FFFAF0', 'Calendrier'], club: ['#DF9287', '#462B25', 'Club'] };
const ICON = {
  home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>',
  eff: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9" r="2.6"/><path d="M3 20c0-3.6 2.7-6 6-6s6 2.4 6 6"/><path d="M15 14.4c.7-.3 1.3-.4 2-.4 2.4 0 4 1.7 4 4.6"/></svg>',
  tac: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/><circle cx="12" cy="12" r="2.6"/></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  club: '<svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>'
};
const NAVO = ['cal', 'eff', 'home', 'tac', 'club'];
const pv = (p) => Object.assign({}, p, { kit: p.pos === 'GB' ? (p.kit || ['#5E7A5A', '#2F4A2E']) : G.kit.c, kitStyle: p.pos === 'GB' ? 'plain' : G.kit.s, captain: p.id === G.captain, inj: p.inj });
const headH = (p, s, mood) => '<div class="hd" style="width:' + s + 'px;height:' + s + 'px">' + chibi(pv(p), 'head', mood || moodOf(p).mood) + '</div>';
const bust = (p, mood) => chibi(pv(p), 'bust', mood || moodOf(p).mood);
function badge(id, s) {
  const c = teamCol(id), t = T(id); s = s || 34;
  return '<span class="bdg" style="width:' + s + 'px;height:' + s + 'px;background:linear-gradient(135deg,' + c[0] + ' 0 55%,' + c[1] + ' 55%);font-size:' + Math.round(s * 0.3) + 'px"><b>' + t.short + '</b></span>';
}
const col = (v) => v >= 70 ? '#4E8A48' : v >= 55 ? '#B8872E' : '#7A5A3A';
const trend = (p) => { const d = rate(p) - (p.rPrev || rate(p)); return d >= 2 ? '<span style="color:#4E8A48">▲</span>' : d <= -2 ? '<span style="color:#C46A55">▼</span>' : '<span class="muted">–</span>'; };
function meter(l, v, c) { return '<div class="ml"><span>' + l + '</span><span class="muted">' + Math.round(v) + '</span></div><div class="meter"><i style="width:' + clamp(v, 0, 100) + '%;background:' + c + '"></i></div>'; }
const moralCol = (v) => v > 60 ? '#86AD78' : v > 40 ? '#F0C253' : '#DF9287';
const fatCol = (v) => v > 70 ? '#DF9287' : v > 45 ? '#F0C253' : '#86AD78';
const ordn = (n) => n + (n === 1 ? 'er' : 'e');
const pips = (n, m) => '<span class="pips">' + Array.from({ length: m || 5 }, (_, i) => '<i class="' + (i < n ? 'on' : '') + '"></i>').join('') + '</span>';
const dateStr = () => 'Semaine ' + weekOf(G.day) + ' · ' + dayName(G.day);

/* ---------- Stadium SVG ---------- */
function hsh(i) { let x = (i * 374761393 + 668265263) | 0; x = (x ^ (x >>> 13)) * 1274126177 | 0; return ((x ^ (x >>> 16)) >>> 0) / 4294967295; }
function stadiumSvg(o) {
  const night = !!o.night, cap = o.cap, rows = 3 + cap, sh = 22 + cap * 11, top = 118 - sh, W = 400;
  const sc = o.seat, sc2 = o.seat2, SPEC = ['#4B3527', '#F0C253', '#438BC0', '#DF9287', '#FFF0CD', '#2B1D14', '#86AD78'];
  let s = '<svg viewBox="0 0 400 230" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="display:block;width:100%;height:100%">';
  s += '<defs><linearGradient id="sk' + o.id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + (night ? '#141C2B' : '#9FD3E8') + '"/><stop offset="1" stop-color="' + (night ? '#34455C' : '#F6EBCB') + '"/></linearGradient></defs>';
  s += '<rect width="400" height="230" fill="url(#sk' + o.id + ')"/>';
  if (!night) s += '<circle cx="330" cy="26" r="14" fill="#FFE49A"/><ellipse cx="80" cy="32" rx="30" ry="8" fill="#fff" opacity=".8"/><ellipse cx="110" cy="38" rx="22" ry="6" fill="#fff" opacity=".8"/>';
  // side stands
  if (cap >= 2) { s += '<polygon points="0,' + (top + 18) + ' 34,' + (top + 6) + ' 34,120 0,128" fill="' + sc + '" stroke="#2B1D14" stroke-width="2" opacity=".85"/><polygon points="400,' + (top + 18) + ' 366,' + (top + 6) + ' 366,120 400,128" fill="' + sc + '" stroke="#2B1D14" stroke-width="2" opacity=".85"/>'; }
  // main stand
  s += '<rect x="34" y="' + top + '" width="332" height="' + sh + '" fill="' + sc + '" stroke="#2B1D14" stroke-width="2.5"/>';
  const rh = sh / rows; let ii = 0;
  for (let r = 0; r < rows; r++) {
    const y = top + r * rh; s += '<line x1="34" y1="' + (y + rh) + '" x2="366" y2="' + (y + rh) + '" stroke="#2B1D14" stroke-opacity=".28" stroke-width="1.2"/>';
    for (let x = 40; x < 362; x += 8) { ii++; if (hsh(ii + 7) < o.fill) s += '<circle cx="' + (x + 2) + '" cy="' + (y + rh * 0.55) + '" r="' + Math.min(3.2, rh * 0.32) + '" fill="' + SPEC[Math.floor(hsh(ii) * SPEC.length)] + '"/>'; }
  }
  if (o.name) s += '<text x="200" y="' + (top + sh * 0.62) + '" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="' + Math.min(22, 9 + cap * 3) + '" fill="' + sc2 + '" stroke="#2B1D14" stroke-width="2.4" paint-order="stroke" letter-spacing="2">' + o.name + '</text>';
  if (cap >= 3) s += '<polygon points="26,' + (top - 2) + ' 374,' + (top - 2) + ' 366,' + (top - 11) + ' 34,' + (top - 11) + '" fill="#4B3527" stroke="#2B1D14" stroke-width="2"/>';
  if (o.vip > 0) { const w = 40 + o.vip * 20; s += '<g><rect x="' + (200 - w / 2) + '" y="' + (top - 17 + (cap >= 3 ? 0 : 6)) + '" width="' + w + '" height="14" rx="2" fill="#CFE3E8" stroke="#B8872E" stroke-width="2.4"/><path d="M' + (200 - w / 2 + 4) + ' ' + (top - 10 + (cap >= 3 ? 0 : 6)) + ' h' + (w - 8) + '" stroke="#F0C253" stroke-width="1.4"/>' + [0, 1, 2, 3, 4].slice(0, 2 + o.vip).map((k) => '<circle cx="' + (200 - w / 2 + 9 + k * 11) + '" cy="' + (top - 8 + (cap >= 3 ? 0 : 6)) + '" r="2.6" fill="#F0C253" stroke="#2B1D14" stroke-width=".8"/>').join('') + '</g>'; }
  if (cap >= 4 || o.lights >= 3) s += '<g><rect x="330" y="' + (top - 22) + '" width="34" height="12" rx="2" fill="#2B1D14"/><text x="347" y="' + (top - 13) + '" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="8" fill="#F0C253">' + (o.score || '0-0') + '</text></g>';
  // ad boards
  const ad = o.ad || [sc2, sc, sc2, sc]; for (let i = 0; i < 8; i++) s += '<rect x="' + (34 + i * 41.5) + '" y="' + (top + sh) + '" width="41.5" height="9" fill="' + ad[i % 4] + '" stroke="#2B1D14" stroke-width="1.2"/>';
  // lights
  const nl = o.lights === 0 ? 0 : o.lights <= 2 ? 2 : 4;
  const tw = [[14, 0], [386, 0], [48, 1], [352, 1]].slice(0, nl);
  tw.forEach((t) => { const x = t[0], y0 = t[1] ? 84 : 128; s += '<rect x="' + (x - 2) + '" y="' + (y0 - 58) + '" width="4" height="' + 58 + '" fill="#8A8F98" stroke="#2B1D14" stroke-width="1"/><rect x="' + (x - 11) + '" y="' + (y0 - 68) + '" width="22" height="12" rx="2" fill="' + (night || o.on ? '#FFF6D8' : '#C9CFD6') + '" stroke="#2B1D14" stroke-width="1.6"/>' + (night || o.on ? '<circle cx="' + x + '" cy="' + (y0 - 62) + '" r="26" fill="#FFF6D8" opacity=".25"/>' : ''); });
  // pitch
  const tl = 82, tr = 318, bl = 8, br = 392, ty = 140, by = 226, N = 10;
  const px = (i, y) => { const t = (y - ty) / (by - ty), l = tl + (bl - tl) * t, r = tr + (br - tr) * t; return l + (r - l) * i / N; };
  const c1 = o.pitch, c2 = shade(o.pitch, -14);
  s += '<polygon points="' + tl + ',' + ty + ' ' + tr + ',' + ty + ' ' + br + ',' + by + ' ' + bl + ',' + by + '" fill="' + c1 + '" stroke="#FFFDF8" stroke-width="2.5"/>';
  const rowsY = [140, 150, 162, 176, 192, 210, 226];
  if (o.ps === 'stripes') for (let i = 0; i < N; i += 2) s += '<polygon points="' + px(i, ty) + ',' + ty + ' ' + px(i + 1, ty) + ',' + ty + ' ' + px(i + 1, by) + ',' + by + ' ' + px(i, by) + ',' + by + '" fill="' + c2 + '"/>';
  else if (o.ps === 'checks') for (let j = 0; j < rowsY.length - 1; j++) for (let i = 0; i < N; i++) if ((i + j) % 2) s += '<polygon points="' + px(i, rowsY[j]) + ',' + rowsY[j] + ' ' + px(i + 1, rowsY[j]) + ',' + rowsY[j] + ' ' + px(i + 1, rowsY[j + 1]) + ',' + rowsY[j + 1] + ' ' + px(i, rowsY[j + 1]) + ',' + rowsY[j + 1] + '" fill="' + c2 + '"/>';
  else if (o.ps === 'diag') for (let j = 0; j < rowsY.length - 1; j++) for (let i = 0; i < N; i++) if ((i + j) % 4 < 2) s += '<polygon points="' + px(i, rowsY[j]) + ',' + rowsY[j] + ' ' + px(i + 1, rowsY[j]) + ',' + rowsY[j] + ' ' + px(i + 1, rowsY[j + 1]) + ',' + rowsY[j + 1] + ' ' + px(i, rowsY[j + 1]) + ',' + rowsY[j + 1] + '" fill="' + c2 + '"/>';
  if (o.pq <= 2) [[120, 205, 18, 5], [250, 178, 14, 4], [190, 214, 22, 5], [300, 208, 16, 4]].slice(0, 3 - o.pq + 1).forEach((e) => { s += '<ellipse cx="' + e[0] + '" cy="' + e[1] + '" rx="' + e[2] + '" ry="' + e[3] + '" fill="#9A8456" opacity=".5"/>'; });
  s += '<g stroke="#FFFDF8" stroke-width="2" fill="none" opacity=".85"><line x1="' + px(5, 168) + '" y1="168" x2="' + px(5, 226) + '" y2="226"/><ellipse cx="200" cy="200" rx="36" ry="9"/><polygon points="' + px(3, ty) + ',' + ty + ' ' + px(7, ty) + ',' + ty + ' ' + px(7, 150) + ',150 ' + px(3, 150) + ',150"/></g>';
  s += '<g stroke="#FFFDF8" stroke-width="2.2" fill="rgba(255,255,255,.18)"><rect x="' + (px(4, ty)) + '" y="130" width="' + (px(6, ty) - px(4, ty)) + '" height="12"/></g>';
  if (o.pq >= 4) s += '<ellipse cx="200" cy="186" rx="120" ry="14" fill="#fff" opacity=".07"/>';
  if (o.tok) o.tok.forEach((t) => { const k = t.s; s += '<ellipse cx="' + t.x + '" cy="' + (t.y + 1) + '" rx="' + (6 * k) + '" ry="' + (2 * k) + '" fill="#000" opacity=".25"/><rect x="' + (t.x - 5 * k) + '" y="' + (t.y - 11 * k) + '" width="' + (10 * k) + '" height="' + (10 * k) + '" rx="' + (3 * k) + '" fill="' + t.c[0] + '" stroke="#2B1D14" stroke-width="' + (1.2 * k) + '"/><rect x="' + (t.x - 5 * k) + '" y="' + (t.y - 5 * k) + '" width="' + (10 * k) + '" height="' + (2.4 * k) + '" fill="' + t.c[1] + '"/><circle cx="' + t.x + '" cy="' + (t.y - 14 * k) + '" r="' + (5 * k) + '" fill="' + (t.sk || '#E3BC98') + '" stroke="#2B1D14" stroke-width="' + (1.2 * k) + '"/>'; });
  if (o.ball) s += '<ellipse cx="' + o.ball.x + '" cy="' + (o.ball.y + 1) + '" rx="4" ry="1.4" fill="#000" opacity=".3"/><circle cx="' + o.ball.x + '" cy="' + (o.ball.y - 3) + '" r="3.6" fill="#fff" stroke="#2B1D14" stroke-width="1.2"/>';
  if (night) s += '<rect width="400" height="230" fill="#0A1020" opacity=".12"/>';
  return s + '</svg>';
}
function pitchPt(px, py) { const y = 150 + py / 100 * 72, t = (y - 140) / 86, l = 82 + (8 - 82) * t, r = 318 + (392 - 318) * t; return { x: l + (r - l) * (px / 100), y, s: 0.62 + 0.55 * t }; }
function shade(h, d) { const n = parseInt(h.slice(1), 16); const f = (v) => clamp(v + d, 0, 255); return '#' + ((1 << 24) + (f(n >> 16) << 16) + (f((n >> 8) & 255) << 8) + f(n & 255)).toString(16).slice(1); }
const myStadium = (extra) => Object.assign({ id: 'm', pitch: G.stad.pitch, ps: G.stad.ps, seat: G.stad.seat, seat2: G.stad.seat2, cap: G.fac.cap, vip: G.fac.vip, lights: G.fac.lights, pq: G.fac.pitch, fill: clamp(G.supp / Math.max(1, CAPS[G.fac.cap]), 0.15, 1), name: T(ME).name.split(' ').slice(-1)[0].toUpperCase(), night: G.fac.lights > 0 && Math.random() < 0 }, extra || {});

/* ---------- Alerts ---------- */
function alertsList() {
  const a = [];
  G.players.filter((p) => p.inj > 0).forEach((p) => a.push({ c: '#F2D6D3', t: p.name + ' blessé · ' + p.inj + ' j' }));
  G.players.filter((p) => p.susp > 0).forEach((p) => a.push({ c: '#F2D6D3', t: p.name + ' suspendu' }));
  G.players.filter((p) => p.fat > 72 && !p.inj).forEach((p) => a.push({ c: '#F3E0B0', t: p.name + ' épuisé (' + Math.round(p.fat) + ')' }));
  G.players.filter((p) => p.moral < 40 && !p.inj).forEach((p) => a.push({ c: '#F2D6D3', t: p.name + ' frustré (' + Math.round(p.moral) + ')' }));
  G.players.filter((p) => p.promise).forEach((p) => a.push({ c: '#D7E2CF', t: 'Promesse à ' + p.name }));
  return a;
}
const unread = () => G.inbox.filter((m) => m.st === 'new' && !m.info).length;

/* ---------- Home ---------- */
function sHome() {
  const nm = nextMy(), d = myDiv(), rk = myRank();
  let nextC = '<div class="muted">Fin de saison.</div>';
  if (nm) {
    const ot = T(nm.opp), left = nm.day - G.day, lu = teamStr(1, 1), oppS = ot.s;
    const mine = Math.round((lu.def + lu.mid + lu.att) / 3);
    nextC = '<div class="row" style="justify-content:space-between"><span class="tag" style="background:' + (nm.kind === 'L' ? DIVS[d].col : '#F0C253') + ';color:' + (nm.kind === 'L' ? DIVS[d].fg : '#493118') + '">' + (nm.kind === 'L' ? DIVS[d].n + ' · J' + (nm.ev.r + 1) : 'Coupe du Roi') + '</span><span class="tag" style="background:#EAD3B0">' + (nm.home ? 'Domicile' : nm.neutral ? 'Terrain neutre' : 'Extérieur') + '</span></div>' +
      '<div class="row" style="justify-content:center;gap:12px;margin:6px 0">' + badge(ME, 42) + '<b style="font-size:18px">VS</b>' + badge(nm.opp, 42) + '</div>' +
      '<div style="text-align:center;font-weight:800;font-size:14px">' + ot.name + '</div><div class="muted" style="text-align:center;font-size:11px;font-weight:700">' + (nm.kind === 'C' ? CUPR[nm.ev.r] : DIVS[ot.div].n + ' · ' + ordn(divTable(ot.div).findIndex((t) => t.id === ot.id) + 1)) + ' · ' + dayName(nm.day) + ' · ' + (left === 0 ? 'aujourd’hui' : left === 1 ? 'demain' : 'dans ' + left + ' jours') + '</div>' +
      '<div style="margin-top:6px">' + meter('Notre niveau', mine, '#86AD78') + meter('Eux', oppS, '#DF9287') + '</div>';
  }
  const fm = G.form5.map((r) => '<span class="fm ' + r + '">' + r + '</span>').join('') || '<span class="muted" style="font-size:11px">Aucun match joué</span>';
  const ms = G.inbox.filter((m) => !m.info).slice(0, 3).map((m) => '<div class="mrow' + (m.st === 'new' ? ' new' : '') + '" data-a="openmsg" data-i="' + m.id + '">' + (m.from.t === 'p' && P(m.from.id) ? headH(P(m.from.id), 26) : '<div class="hd" style="width:26px;height:26px">' + chibi(staffView(m.from.id), 'head', 'happy') + '</div>') + '<div class="grow"><b>' + sender(m).name + '</b><div class="trunc">' + m.text + '</div></div></div>').join('') || '<div class="muted" style="font-size:12px">Aucun message.</div>';
  const al = alertsList().slice(0, 5).map((a) => '<div style="background:' + a.c + ';border-radius:8px;padding:2px 7px;font-size:11px;font-weight:800">' + a.t + '</div>').join('') || '<div class="muted" style="font-size:12px">Tout va bien.</div>';
  const week = [0, 1, 2, 3, 4, 5, 6].map((i) => { const wd = (weekOf(G.day) - 1) * 7 + 1 + i, ev = G.cal.find((e) => e.day === wd), mine = ev && (ev.t === 'L' || (G.cup.champ === null && G.cup.cur.some((t) => t.a === ME || t.b === ME) && G.cup.r === ev.r)); return '<div class="wd' + (wd === G.day ? ' cur' : '') + (wd < G.day ? ' past' : '') + '"><span>' + DAYN[i] + '</span><b>' + (mine ? (ev.t === 'L' ? '⚽' : '🏆') : wd < G.day ? '·' : '🏃') + '</b></div>'; }).join('');
  const tr = [['physique', 'Physique'], ['technique', 'Technique'], ['defense', 'Défense'], ['repos', 'Repos']].map((t) => '<button class="' + (G.train === t[0] ? 'on' : '') + '" data-a="train" data-i="' + t[0] + '">' + t[1] + '</button>').join('');
  const blocked = !!G.match, running = UI.run;
  const lastN = G.news[0];
  return '<div class="g3"><div class="col"><div class="card" style="flex:1"><h3>Prochain match</h3>' + nextC + '</div><div class="card"><h3 style="margin:0 0 4px">Forme</h3><div class="row" style="gap:4px">' + fm + '</div></div></div>' +
    '<div class="col"><div class="card" style="text-align:center;padding:6px 8px"><div class="muted" style="font-weight:800;font-size:11px">' + DIVS[d].n + ' · Saison ' + G.season + '</div><div style="font-size:20px;font-weight:800;line-height:1.1">' + dateStr() + '</div><div class="wk7">' + week + '</div>' +
    '<button class="btn pri big" style="min-height:40px;margin-top:4px" data-a="' + (blocked ? 'prematch' : running ? 'pause' : 'go') + '">' + (blocked ? '⚽ Jour de match' : running ? '⏸ Pause' : '▶ Continuer') + '</button>' +
    '<div class="row" style="justify-content:center;gap:5px;margin-top:6px"><span class="muted" style="font-size:11px;font-weight:800">Vitesse</span><div class="seg" style="width:130px">' + [1, 2, 4].map((v) => '<button class="' + (UI.speed === v ? 'on' : '') + '" data-a="speed" data-i="' + v + '">×' + v + '</button>').join('') + '</div></div></div>' +
    '<div class="card" style="padding:6px 8px"><div class="muted" style="font-size:10px;font-weight:800;margin-bottom:3px">ENTRAÎNEMENT</div><div class="seg">' + tr + '</div></div></div>' +
    '<div class="col"><div class="card" style="flex:1;min-height:0;overflow:auto"><div class="row" style="justify-content:space-between"><h3 style="margin:0">Messages</h3>' + (unread() ? '<span class="tag" style="background:#E34B3F;color:#fff">' + unread() + '</span>' : '') + '</div><div class="col" style="gap:4px;margin-top:5px">' + ms + '</div><button class="btn sm" style="margin-top:5px;width:100%" data-a="openmsg">Tous les messages</button></div>' +
    '<div class="card" style="flex:none"><h3 style="margin:0 0 4px">Alertes</h3><div class="col" style="gap:3px;max-height:96px;overflow:auto">' + al + '</div></div></div></div>';
}
function sender(m) { if (m.from.t === 'p') { const p = P(m.from.id); return { name: p ? p.name : 'Joueur' }; } const s = staff(m.from.id); return { name: s.name.split(' ')[0] + ' · ' + s.role }; }
const staffView = (id) => { const s = staff(id); return { num: '', build: s.build, look: s.look, kit: ['#4B3527', '#F0C253'], kitStyle: 'plain', pos: 'MIL' }; };

/* ---------- Effectif ---------- */
function sEff() {
  const flt = UI.flt, list = G.players.filter((p) => flt === 'Tous' || p.pos === flt).sort((a, b) => ['GB', 'DEF', 'MIL', 'ATT'].indexOf(a.pos) - ['GB', 'DEF', 'MIL', 'ATT'].indexOf(b.pos) || rate(b) - rate(a));
  if (!P(UI.sel)) UI.sel = G.players[0].id;
  const p = P(UI.sel), mo = moodOf(p), t = p.tal && TAL[p.tal];
  const rows = list.map((q) => { const m = moodOf(q); return '<div class="prow' + (q.id === UI.sel ? ' sel' : '') + '" data-a="sel" data-i="' + q.id + '">' + headH(q, 34) + '<div class="grow"><b>' + q.name + (q.id === G.captain ? ' ©' : '') + '</b><div class="muted" style="font-size:10.5px;font-weight:800">' + q.pos + ' · ' + q.age + ' ans' + (G.lineup.indexOf(q.id) >= 0 ? ' · titulaire' : '') + (q.listed ? ' · en vente' : '') + '</div></div><div style="text-align:right;min-width:44px"><div style="font-size:17px;font-weight:800;color:' + col(rate(q)) + '">' + rate(q) + ' ' + trend(q) + '</div><span class="tag" style="background:' + m.bg + ';color:' + m.fg + ';font-size:9px">' + m.label + '</span></div></div>'; }).join('');
  const flts = ['Tous', 'GB', 'DEF', 'MIL', 'ATT'].map((f) => '<button class="' + (flt === f ? 'on' : '') + '" data-a="flt" data-i="' + f + '">' + f + '</button>').join('');
  const stats = p.pos === 'GB' ? [['Gardien', p.st.gk], ['Physique', p.st.phy], ['Vitesse', p.st.spd]] : [['Vitesse', p.st.spd], ['Technique', p.st.tec], ['Physique', p.st.phy], ['Défense', p.st.def], ['Attaque', p.st.att]];
  const det = '<div class="row" style="align-items:flex-start;gap:10px"><div class="fig">' + chibi(pv(p), 'full', mo.mood) + '</div><div class="grow"><div class="row" style="justify-content:space-between"><div><div style="font-size:18px;font-weight:800;line-height:1">' + p.name + '</div><div class="muted" style="font-weight:800;font-size:11px">' + p.pos + ' · ' + p.age + ' ans · n°' + p.num + '</div></div><div style="text-align:right"><div style="font-size:26px;font-weight:800;line-height:1;color:' + col(rate(p)) + '">' + rate(p) + ' ' + trend(p) + '</div><div class="muted" style="font-size:10px;font-weight:800">Base ' + ovr(p) + ' · Pot ' + p.pot + '</div></div></div>' +
    '<div class="row" style="gap:5px;margin:4px 0;flex-wrap:wrap"><span class="tag" style="' + bTone(p.build) + '">' + bLabel(p.build) + '</span><span class="tag" style="background:#EAD3B0">' + TRAITS[p.trait] + '</span><span class="tag" style="background:' + mo.bg + ';color:' + mo.fg + '">' + mo.label + '</span>' + (p.inj ? '<span class="tag" style="background:#F2D6D3">Blessé ' + p.inj + ' j</span>' : '') + '</div>' +
    meter('Moral', p.moral, moralCol(p.moral)) + meter('Forme', p.form, '#438BC0') + meter('Fatigue', p.fat, fatCol(p.fat)) + '</div></div>' +
    '<div class="row" style="gap:10px;margin-top:6px;align-items:flex-start"><div class="grow">' + stats.map((s) => '<div class="srow"><span>' + s[0] + '</span><div class="meter"><i style="width:' + clamp(s[1], 0, 100) + '%;background:#86AD78"></i></div><b>' + s[1] + '</b></div>').join('') + '</div><div class="grow"><div style="font-size:11.5px;font-weight:700">' + (t ? '<b>' + t.n + '</b> · ' + t.t + (t.ok(p) ? ' <span style="color:#4E8A48">Actif</span>' : ' <span style="color:#C46A55">Inactif</span>') : '<span class="muted">Aucun talent spécial.</span>') + '</div><div class="muted" style="font-size:11px;font-weight:700;margin-top:3px">Veut : ' + p.want + '</div><div class="muted" style="font-size:11px;font-weight:700">Buts ' + p.goals + ' · Matchs ' + p.apps + (p.drought >= 2 ? ' · ' + p.drought + ' sans but' : '') + '</div></div></div>' +
    '<div class="row" style="gap:6px;margin-top:7px"><button class="btn sm pri" data-a="talk" data-i="' + p.id + '">Parler</button><button class="btn sm" data-a="capt" data-i="' + p.id + '">' + (G.captain === p.id ? '© Capitaine' : 'Capitaine') + '</button><button class="btn sm" data-a="listp" data-i="' + p.id + '">' + (p.listed ? 'Retirer de la vente' : 'Mettre en vente') + '</button></div>';
  return '<div class="g2"><div class="col"><div class="fl">' + flts + '</div><div class="col grow" style="overflow:auto;gap:5px">' + rows + '</div></div><div class="card" style="overflow:auto">' + det + '</div></div>';
}

/* ---------- Tactique ---------- */
function tokenPos() {
  const f = FM[G.formation], res = [[8, 50]], ys = (n) => Array.from({ length: n }, (_, i) => 50 + (i - (n - 1) / 2) * (n === 3 ? 28 : n === 2 ? 36 : 0));
  [[f[0], 28], [f[1], 52], [f[2], 76]].forEach((r) => ys(r[0]).forEach((y) => res.push([r[1], y])));
  return res;
}
function sTac() {
  const sl = slots(), pos = tokenPos();
  const toks = G.lineup.map((id, i) => { const p = P(id); if (!p) return ''; const m = moodOf(p); return '<button class="tk' + (UI.tsel === id ? ' sel' : '') + '" style="left:' + pos[i][0] + '%;top:' + pos[i][1] + '%" data-a="tsel" data-i="' + id + '"><span class="h" style="border-color:' + m.col + '">' + chibi(pv(p), 'bust', m.mood) + '</span><span class="n">' + p.name + ' ' + rate(p) + '</span></button>'; }).join('');
  const pitch = '<div class="pitch"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><g fill="none" stroke="#FFFDF8" stroke-width=".9" opacity=".8"><rect x="2" y="3" width="96" height="94"/><line x1="50" y1="3" x2="50" y2="97"/><circle cx="50" cy="50" r="10"/><rect x="2" y="30" width="14" height="40"/><rect x="84" y="30" width="14" height="40"/></g></svg>' + toks + '</div>';
  const fm = Object.keys(FM).map((f) => '<button class="' + (G.formation === f ? 'on' : '') + '" data-a="form" data-i="' + f + '">' + f.slice(2) + '</button>').join('');
  const mt = Object.keys(MENT).map((k) => '<button class="' + (G.ment === k ? 'on' : '') + '" data-a="ment" data-i="' + k + '">' + MENT[k].n + '</button>').join('');
  const bn = benchList().sort((a, b) => ['GB', 'DEF', 'MIL', 'ATT'].indexOf(a.pos) - ['GB', 'DEF', 'MIL', 'ATT'].indexOf(b.pos)).map((p) => { const m = moodOf(p), sel = UI.tsel; return '<div class="prow' + (sel ? ' hot' : '') + '" data-a="bench" data-i="' + p.id + '">' + headH(p, 28) + '<div class="grow"><b style="font-size:12px">' + p.name + '</b><div class="muted" style="font-size:10px;font-weight:800">' + p.pos + ' · ' + m.label + '</div></div><b style="color:' + col(rate(p)) + '">' + rate(p) + '</b></div>'; }).join('');
  const lu = G.lineup.map(P).filter(Boolean), opts = (cur) => lu.map((p) => '<option value="' + p.id + '"' + (p.id === cur ? ' selected' : '') + '>' + p.name + '</option>').join('');
  return '<div class="g3t"><div class="col"><div class="card"><h3>Formation</h3><div class="seg">' + fm + '</div><div class="muted" style="font-size:11px;font-weight:700;margin-top:4px">' + FNOTE[G.formation] + '</div></div><div class="card"><h3>Mentalité</h3><div class="seg">' + mt + '</div><div class="muted" style="font-size:11px;font-weight:700;margin-top:4px">' + MENT[G.ment].t + '</div></div>' +
    '<div class="card"><div class="row" style="justify-content:space-between;margin-bottom:3px"><b style="font-size:12px">Penaltys</b><select data-sel="pen">' + opts(G.penTaker) + '</select></div><div class="row" style="justify-content:space-between"><b style="font-size:12px">Capitaine</b><select data-sel="cap">' + opts(G.captain) + '</select></div></div></div>' +
    pitch + '<div class="col"><div class="card" style="flex:1;min-height:0;overflow:auto"><h3 style="margin:0 0 4px">Banc</h3><div class="muted" style="font-size:10.5px;font-weight:700;margin-bottom:4px">' + (UI.tsel ? 'Touche un remplaçant pour l’échanger.' : 'Touche un titulaire, puis un remplaçant.') + '</div><div class="col" style="gap:4px">' + bn + '</div></div></div></div>';
}

/* ---------- Calendrier ---------- */
function sCal() {
  const tabs = [['cal1', 'Classement'], ['cal2', 'Matchs'], ['cal3', 'Coupe du Roi']].map((t) => '<button class="' + (UI.ctab === t[0] ? 'on' : '') + '" data-a="ctab" data-i="' + t[0] + '">' + t[1] + '</button>').join('');
  let body = '';
  if (UI.ctab === 'cal1') {
    const dv = [0, 1, 2, 3].map((d) => '<button class="' + (UI.cdiv === d ? 'on' : '') + '" data-a="cdiv" data-i="' + d + '">' + DIVS[d].n.replace('Division ', 'D') + '</button>').join('');
    const tb = divTable(UI.cdiv);
    const rows = tb.map((r, i) => '<tr class="' + (r.id === ME ? 'me' : '') + '"><td style="width:22px;color:' + (i < 2 && UI.cdiv > 0 ? '#4E8A48' : i > 7 && UI.cdiv < 3 ? '#C46A55' : 'inherit') + '">' + (i + 1) + '</td><td><span class="row" style="gap:5px">' + badge(r.id, 18) + r.n + '</span></td><td>' + r.pl + '</td><td>' + r.w + '</td><td>' + r.d + '</td><td>' + r.l + '</td><td>' + (r.gf - r.ga) + '</td><td><b>' + r.pts + '</b></td></tr>').join('');
    body = '<div class="row" style="gap:8px;align-items:flex-start;height:100%"><div class="col" style="width:92px"><div class="seg" style="flex-direction:column;gap:5px">' + dv + '</div><div class="card" style="font-size:10.5px;font-weight:700;padding:6px"><span style="color:#4E8A48">● Montée (2)</span><br><span style="color:#C46A55">● Relégation (2)</span><br>Objectif : ' + G.obj.t + '</div></div><div class="card grow cal1" style="padding:4px 8px;overflow:auto;height:100%"><table><tr class="muted"><th>#</th><th>Club</th><th>J</th><th>V</th><th>N</th><th>D</th><th>+/-</th><th>Pts</th></tr>' + rows + '</table></div></div>';
  } else if (UI.ctab === 'cal2') {
    const evs = G.cal.map((ev) => {
      let opp = null, h = null, sc = null, lab, done = ev.day < G.day || (ev.day === G.day && !G.match);
      if (ev.t === 'L') { const f = G.fix[myDiv()][ev.r], i = f.findIndex((x) => x[0] === ME || x[1] === ME); opp = f[i][0] === ME ? f[i][1] : f[i][0]; h = f[i][0] === ME; const r = G.res[myDiv()][ev.r]; if (r && r[i]) sc = h ? r[i] : [r[i][1], r[i][0]]; lab = 'Ligue · J' + (ev.r + 1); }
      else { const hist = G.cup.hist.find((x) => x.r === ev.r); const t = hist ? hist.ties.find((x) => x.a === ME || x.b === ME) : G.cup.r === ev.r ? G.cup.cur.find((x) => x.a === ME || x.b === ME) : null; lab = CUPR[ev.r]; if (!t) return '<div class="evr"><span class="muted">' + dayName(ev.day) + ' S' + weekOf(ev.day) + '</span><span>' + lab + '</span><span class="muted">—</span><span></span></div>'; opp = t.a === ME ? t.b : t.a; h = t.a === ME; const g = ev.r === 5 ? t.l2 : t.l1; if (g) sc = (ev.r === 5 ? t.b === ME : t.a === ME) ? g : [g[1], g[0]]; }
      const res = sc ? (sc[0] > sc[1] ? 'V' : sc[0] < sc[1] ? 'D' : 'N') : '';
      return '<div class="evr' + (ev.day === G.day ? ' cur' : '') + '"><span class="muted">' + dayName(ev.day) + ' S' + weekOf(ev.day) + '</span><span>' + lab + '</span><span class="row" style="gap:5px">' + badge(opp, 18) + (h ? '' : '@ ') + T(opp).name + '</span><span>' + (sc ? '<span class="fm ' + res + '">' + sc[0] + '-' + sc[1] + '</span>' : done ? '' : '<span class="muted">à venir</span>') + '</span></div>';
    }).join('');
    body = '<div class="card" style="height:100%;overflow:auto;padding:6px 8px"><div class="col" style="gap:3px">' + evs + '</div></div>';
  } else {
    const C = G.cup, cols = [];
    for (let r = 0; r <= 6; r++) {
      const hist = C.hist.find((x) => x.r === r); const ties = hist ? hist.ties : C.r === r ? C.cur : (r === 5 && C.r === 5 ? C.cur : null);
      const th = ties ? ties.map((t) => { const sc = t.l2 ? tieAgg(t) : t.l1; const meT = t.a === ME || t.b === ME; return '<div class="tie' + (meT ? ' me' : '') + '"><div class="' + (t.w === t.a ? 'w' : '') + '">' + T(t.a).name + '<b>' + (sc ? sc[0] : '') + '</b></div><div class="' + (t.w === t.b ? 'w' : '') + '">' + T(t.b).name + '<b>' + (sc ? sc[1] : '') + '</b></div>' + (t.pen ? '<small>tab ' + t.pen[0] + '-' + t.pen[1] + '</small>' : '') + '</div>'; }).join('') : '<div class="muted" style="font-size:11px;font-weight:700">À tirer</div>';
      cols.push('<div class="cc"><div class="ch2">' + CUPR[r] + '<br><span class="muted" style="font-weight:700;font-size:10px">Sem. ' + CUPW[r] + '</span></div>' + th + '</div>');
    }
    body = '<div class="row" style="gap:7px;align-items:flex-start;height:100%;overflow:auto">' + cols.join('') + '</div>';
  }
  return '<div class="fl">' + tabs + '</div><div style="height:calc(100% - 38px)">' + body + '</div>';
}

/* ---------- Club ---------- */
function sClub() {
  const tabs = [['kit', 'Équipement'], ['staff', 'Staff'], ['stad', 'Stade'], ['transfers', 'Transferts'], ['fin', 'Finances']].map((t) => '<button class="' + (UI.club === t[0] ? 'on' : '') + '" data-a="club" data-i="' + t[0] + '">' + t[1] + '</button>').join('');
  let body = '';
  if (UI.club === 'kit') {
    const demo = [P('kofi') || G.players.find((p) => p.pos === 'GB'), P(G.captain), G.players.filter((p) => p.pos === 'ATT')[0], G.players.filter((p) => p.pos === 'MIL')[0]].filter(Boolean);
    const sw = (k, i) => KCOL.map((c) => '<button class="sw' + (G.kit.c[i] === c ? ' on' : '') + '" style="background:' + c + '" data-a="kit" data-k="' + i + '" data-i="' + c + '"></button>').join('');
    body = '<div class="row" style="gap:8px;align-items:stretch;height:100%"><div class="card" style="flex:0 0 54%;display:flex;align-items:flex-end;justify-content:space-around;background:linear-gradient(#FFF0CD,#F3E0B0);padding:8px">' + demo.map((p) => '<div style="width:22%;max-width:90px">' + chibi(pv(p), 'full', 'happy') + '<div style="text-align:center;font-size:10px;font-weight:800">' + p.name + '</div></div>').join('') + '</div><div class="card grow" style="overflow:auto"><h3 style="margin:0 0 3px">Couleur principale</h3><div class="swrap">' + sw('c', 0) + '</div><h3 style="margin:6px 0 3px">Couleur secondaire</h3><div class="swrap">' + sw('c', 1) + '</div><h3 style="margin:6px 0 3px">Motif</h3><div class="seg" style="flex-wrap:wrap">' + KSTY.map((s) => '<button class="' + (G.kit.s === s[0] ? 'on' : '') + '" data-a="kitstyle" data-i="' + s[0] + '">' + s[1] + '</button>').join('') + '</div></div></div>';
  } else if (UI.club === 'staff') {
    body = '<div class="row" style="gap:8px;align-items:stretch;height:100%">' + G.staff.map((s) => { const c = staffCost(s); return '<div class="card grow col" style="align-items:center;text-align:center;gap:3px;min-width:0"><div style="width:96px;height:100px;background:#F3E0B0;border-radius:12px;overflow:hidden">' + chibi(staffView(s.id), 'bust', 'happy') + '</div><div class="muted" style="font-size:10px;font-weight:800">' + s.role.toUpperCase() + '</div><b style="font-size:13px">' + s.name + '</b>' + pips(s.lvl) + '<div style="font-size:10.5px;font-weight:700;min-height:28px">' + STAFF_FX[s.id] + '</div><div class="row" style="gap:3px;flex-wrap:wrap;justify-content:center">' + [['hair', '💇'], ['hc', '🎨'], ['skin', '🧑'], ['beard', '🧔']].map((b) => '<button class="btn sm ico" data-a="look" data-i="' + s.id + '" data-k="' + b[0] + '">' + b[1] + '</button>').join('') + '</div><button class="btn sm pri" data-a="ustaff" data-i="' + s.id + '"' + (c === null ? ' disabled' : '') + '>' + (c === null ? 'Niveau max' : 'Améliorer · ' + fmt(c)) + '</button></div>'; }).join('') + '</div>';
  } else if (UI.club === 'stad') {
    const swc = (arr, key) => arr.map((c) => '<button class="sw' + (G.stad[key] === c ? ' on' : '') + '" style="background:' + c + '" data-a="stad" data-k="' + key + '" data-i="' + c + '"></button>').join('');
    const facs = Object.keys(FAC).map((k) => { const c = upgradeCost(k); return '<div class="frow"><span style="font-size:18px">' + FAC[k].ico + '</span><div class="grow"><b style="font-size:12px">' + FAC[k].n + '</b> ' + pips(G.fac[k]) + '<div class="muted" style="font-size:10px;font-weight:700">' + FAC[k].fx + '</div></div><button class="btn sm pri" data-a="ufac" data-i="' + k + '"' + (c === null ? ' disabled' : '') + '>' + (c === null ? 'Max' : fmt(c)) + '</button></div>'; }).join('');
    body = '<div class="row" style="gap:8px;align-items:stretch;height:100%"><div class="col" style="flex:0 0 50%"><div class="card" style="padding:0;overflow:hidden;flex:1;min-height:0">' + stadiumSvg(myStadium({ id: 'ed', night: UI.night, on: UI.night })) + '</div><div class="row" style="gap:6px"><span class="muted" style="font-size:11px;font-weight:800">Capacité ' + CAPS[G.fac.cap] + ' places · ' + Math.round(clamp(G.supp / CAPS[G.fac.cap], 0, 1) * 100) + ' % remplies</span><button class="btn sm" data-a="night" style="margin-left:auto">' + (UI.night ? '☀ Jour' : '🌙 Nuit') + '</button></div></div><div class="card grow" style="overflow:auto"><h3 style="margin:0 0 3px">Pelouse</h3><div class="swrap">' + swc(PITCHC, 'pitch') + '</div><div class="seg" style="margin-top:4px">' + PITCHS.map((s) => '<button class="' + (G.stad.ps === s[0] ? 'on' : '') + '" data-a="stad" data-k="ps" data-i="' + s[0] + '">' + s[1] + '</button>').join('') + '</div><h3 style="margin:6px 0 3px">Sièges</h3><div class="swrap">' + swc(SEATC, 'seat') + '</div><h3 style="margin:6px 0 3px">Lettres / bandeaux</h3><div class="swrap">' + swc(SEATC, 'seat2') + '</div><h3 style="margin:8px 0 3px">Améliorations</h3>' + facs + '</div></div>';
  } else if (UI.club === 'transfers') {
    const sub = '<div class="seg" style="width:240px"><button class="' + (UI.mk === 'mkt' ? 'on' : '') + '" data-a="mk" data-i="mkt">Marché (' + G.market.length + ')</button><button class="' + (UI.mk === 'mine' ? 'on' : '') + '" data-a="mk" data-i="mine">Mes joueurs</button></div>';
    const rowsM = (UI.mk === 'mkt' ? G.market : G.players).map((p) => { const mine = UI.mk === 'mine', price = mine ? Math.round(valueOf(p) * 0.75 / 10) * 10 : valueOf(p); return '<div class="prow">' + headH(p, 34, 'neutral') + '<div class="grow"><b>' + p.name + '</b><div class="muted" style="font-size:10.5px;font-weight:800">' + p.pos + ' · ' + p.age + ' ans · ' + (mine ? 'Moral ' + Math.round(p.moral) : p.from) + ' · ' + bLabel(p.build) + (p.tal ? ' · ' + TAL[p.tal].n : '') + '</div></div><div style="text-align:center;min-width:56px"><b style="font-size:16px;color:' + col(rate(p)) + '">' + rate(p) + '</b><div class="muted" style="font-size:10px;font-weight:800">pot ' + p.pot + '</div></div><button class="btn sm pri" data-a="' + (mine ? 'sellnow' : 'buy') + '" data-i="' + p.id + '" style="min-width:88px">' + (mine ? 'Vendre ' : 'Acheter ') + fmt(price) + '</button></div>'; }).join('');
    body = '<div class="row" style="gap:8px;margin-bottom:5px;align-items:center">' + sub + '<span class="muted" style="font-size:11px;font-weight:800">Budget ' + fmt(G.budget) + ' · Effectif ' + G.players.length + '/18</span></div><div class="col" style="height:calc(100% - 40px);overflow:auto;gap:5px">' + rowsM + '</div>';
  } else {
    const hist = G.hist.slice().reverse().map((h) => '<tr><td>S' + h.season + '</td><td>' + DIVS[h.div].n + '</td><td>' + ordn(h.rank) + '</td><td>' + h.res + '</td><td>' + h.cup + '</td></tr>').join('') || '<tr><td colspan="5" class="muted" style="text-align:center">Pas encore de saison terminée.</td></tr>';
    const wk = G.wk || { inc: 0, wages: 0 };
    body = '<div class="row" style="gap:8px;align-items:stretch;height:100%"><div class="col" style="flex:0 0 40%"><div class="card"><h3>Budget</h3><div style="font-size:24px;font-weight:800;color:' + (G.budget < 0 ? '#C46A55' : '#4E8A48') + '">' + fmt(G.budget) + '</div><div class="muted" style="font-size:11px;font-weight:700">Semaine : +' + fmt(wk.inc) + ' revenus, −' + fmt(wk.wages) + ' salaires</div></div><div class="card"><h3>Conseil d’administration</h3>' + meter('Confiance', G.board, moralCol(G.board)) + '<div class="muted" style="font-size:11px;font-weight:700;margin-top:3px">Objectif : ' + G.obj.t + '</div></div></div><div class="card grow" style="overflow:auto"><h3>Historique</h3><table><tr class="muted"><th>Saison</th><th>Division</th><th>Rang</th><th>Résultat</th><th>Coupe</th></tr>' + hist + '</table><div class="muted" style="font-size:11px;font-weight:700;margin-top:6px">Supporters : ' + Math.round(G.supp) + ' · Prix du billet : ' + fmt(DIVS[myDiv()].price) + '</div><button class="btn sm" style="margin-top:8px" data-a="reset">' + (UI.rst ? 'Confirmer : tout effacer' : 'Nouvelle partie') + '</button></div></div>';
  }
  return '<div class="fl">' + tabs + '</div><div style="height:calc(100% - 38px)">' + body + '</div>';
}
