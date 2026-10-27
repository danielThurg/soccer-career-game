/* ===== ENGINE ===== */
let G = null, M = null;
const SAVE = 'scg-save-v3', ME = 30;
const P = (id) => G.players.find((p) => p.id === id);
const T = (id) => G.teams[id];
const lineOf = (pos) => pos === 'GB' ? 'gk' : pos === 'DEF' ? 'def' : pos === 'MIL' ? 'mid' : 'att';
const staff = (id) => G.staff.find((s) => s.id === id);
const teamCol = (id) => id === ME ? G.kit.c : T(id).col;
const teamStyle = (id) => id === ME ? G.kit.s : 'stripes';
const myDiv = () => T(ME).div;

function score(p, line) {
  const s = p.st;
  return line === 'gk' ? (s.gk || 30) : line === 'def' ? 0.55 * s.def + 0.25 * s.phy + 0.2 * s.spd : line === 'mid' ? 0.45 * s.tec + 0.2 * s.phy + 0.2 * s.spd + 0.15 * (s.def + s.att) / 2 : 0.5 * s.att + 0.3 * s.tec + 0.2 * s.spd;
}
const ovr = (p) => Math.round(score(p, lineOf(p.pos)));
const rate = (p) => Math.round(clamp(score(p, lineOf(p.pos)) + (p.form - 50) / 6 + (p.moral - 50) / 14, 1, 99));
const perf = (p) => (0.7 + 0.3 * p.moral / 100) * (1 - p.fat / 260) * (0.92 + 0.16 * p.form / 100);
const wageOf = (p) => Math.max(30, Math.round((ovr(p) - 32) * 2.6));
const valueOf = (p) => Math.round(((Math.max(ovr(p), 36) - 30) ** 2 * 5 * (p.age <= 21 ? 1.5 : p.age <= 25 ? 1.2 : p.age <= 29 ? 1 : p.age <= 32 ? 0.6 : 0.3) + Math.max(0, p.pot - ovr(p)) * 90) / 10) * 10;
function moodOf(p) {
  if (p.inj > 0) return { mood: 'hurt', label: 'Blessé', col: '#DF9287', bg: '#F2D6D3', fg: '#6B2A22' };
  if (p.susp > 0) return { mood: 'angry', label: 'Suspendu', col: '#DF9287', bg: '#F2D6D3', fg: '#6B2A22' };
  if (p.moral < 40) return { mood: 'hurt', label: 'Frustré', col: '#DF9287', bg: '#F2D6D3', fg: '#6B2A22' };
  if (p.fat > 72) return { mood: 'tired', label: 'Épuisé', col: '#F0C253', bg: '#F3E0B0', fg: '#6B4A12' };
  if (p.moral >= 80) return { mood: 'laugh', label: 'Inspiré', col: '#86AD78', bg: '#D7E2CF', fg: '#263E23' };
  if (p.moral >= 66) return { mood: 'happy', label: 'Content', col: '#86AD78', bg: '#D7E2CF', fg: '#263E23' };
  return { mood: p.pos === 'ATT' || p.id === G.captain ? 'focus' : 'neutral', label: 'Stable', col: '#438BC0', bg: '#CFE3E8', fg: '#1F4A5A' };
}

/* ---------- Creation ---------- */
function finishPlayer(p) {
  const m = BM[bLabel(p.build)];
  p.st.spd += m.spd; p.st.tec += m.tec; p.st.phy += m.phy;
  Object.assign(p, { inj: 0, susp: 0, bench: 0, goals: 0, apps: 0, drought: 0, xp: 0, form: 50, recent: [], msgCd: 0, promise: null, talked: 0, kitStyle: 'stripes' }, p.kitStyle ? { kitStyle: p.kitStyle } : {});
  if (p.pos === 'GB' && !p.st.gk) p.st.gk = 45;
  p.kitStyle = p.kitStyle || 'stripes';
  p.rPrev = rate(p);
  return p;
}
function genPlayer(target, pos, age) {
  const t = target, st = pos === 'GB' ? { spd: t - 12, tec: t - 14, phy: t - 2, def: t - 14, att: 20, gk: t } : pos === 'DEF' ? { spd: t - 3, tec: t - 8, phy: t, def: t + 3, att: t - 16 } : pos === 'MIL' ? { spd: t - 1, tec: t + 3, phy: t - 2, def: t - 6, att: t - 3 } : { spd: t + 1, tec: t - 2, phy: t - 6, def: t - 22, att: t + 2 };
  Object.keys(st).forEach((k) => { st[k] = clamp(Math.round(st[k] + rnd(-3, 3)), 18, 95); });
  const bs = pick([0.78, 0.85, 0.95, 1.0, 1.12, 1.2, 1.3, 1.4]);
  const used = G.players.map((x) => x.num).concat((G.market || []).map((x) => x.num));
  let num = ri(2, 30); while (used.indexOf(num) >= 0) num = ri(2, 40);
  const p = { id: 'g' + (G.pid = (G.pid || 0) + 1), name: pick(FIRST), pos, age, num: pos === 'GB' ? 1 + (used.indexOf(1) >= 0 ? 20 : 0) : num, build: bs, look: randLook(), st, pot: 0, tal: Math.random() < 0.3 ? pick(Object.keys(TAL).filter((k) => TAL[k].line === lineOf(pos))) : null, trait: pick(Object.keys(TRAITS)), moral: ri(60, 78), fat: ri(5, 30), want: pick(['Jouer chaque semaine.', 'Gagner un trophée.', 'Progresser vite.', 'Monter de division.']), eye: pick([0.9, 1, 1.1, 1.2]) };
  finishPlayer(p);
  p.pot = clamp(ovr(p) + (age <= 20 ? ri(8, 22) : age <= 23 ? ri(3, 12) : ri(0, 4)), ovr(p), 96);
  p.from = pick(Object.keys(G.teams).length ? G.teams.map((t) => t.name) : ['?']);
  return p;
}
function newGame() {
  const teams = [];
  TNAMES.forEach((arr, d) => arr.forEach((n, i) => {
    const id = d * 10 + i, c1 = pick(KCOL); let c2 = pick(KCOL); while (c2 === c1) c2 = pick(KCOL);
    teams.push({ id, name: n, short: n.replace(/[^A-Za-zÀ-ÿ ]/g, '').split(' ').map((w) => w[0]).join('').slice(0, 3).toUpperCase(), div: d, s: id === ME ? DBASE[3] : DBASE[d] + rnd(-5, 5), tilt: { a: ri(-4, 4), d: ri(-4, 4), m: ri(-3, 3) }, col: [c1, c2], names: Array.from({ length: 7 }, () => pick(SURN)) });
  }));
  const players = P0.map((o) => { const p = JSON.parse(JSON.stringify(o)); Object.keys(p.st).forEach((k) => { p.st[k] = Math.max(18, p.st[k] - 7); }); return finishPlayer(p); });
  G = { v: 3, season: 1, day: 1, teams, players, formation: '1-3-2-1', lineup: [], ment: 'eq', captain: 'rafa', penTaker: 'samir', train: 'physique', coh: 55, budget: 15000, supp: 320, board: 60, kit: { c: ['#C46A55', '#FFF0CD'], s: 'stripes' }, staff: JSON.parse(JSON.stringify(STAFF0)), fac: { pitch: 1, cap: 1, vip: 0, lights: 0, train: 1, med: 1, shop: 0 }, stad: { pitch: '#7FA077', ps: 'stripes', seat: '#C46A55', seat2: '#FFF0CD' }, inbox: [], news: [], mid: 0, mlog: [], hist: [], pid: 0, market: [], lastXI: [], tips: {}, msgCd: 0, oppBoost: 0, form5: [], offers: 0, pressDone: 0, recDay: 0 };
  T(ME).s = DBASE[3] + 1;
  buildSeason(true);
  fitLineup();
  genMarket();
  news('Nouveau club, nouvelle histoire. Objectif : remonter les divisions.');
  save();
}
function save() { try { localStorage.setItem(SAVE, JSON.stringify(G)); } catch (e) { /* ignore */ } }
function load() { try { const s = localStorage.getItem(SAVE); if (s) { const g = JSON.parse(s); if (g && g.v === 3) { G = g; return true; } } } catch (e) { /* ignore */ } return false; }
function news(t) { G.news.unshift({ d: G.day, s: G.season, t }); if (G.news.length > 30) G.news.pop(); }

/* ---------- Season / calendar ---------- */
function rr(ids) {
  const n = ids.length, a = ids.slice(), rounds = [];
  for (let r = 0; r < n - 1; r++) {
    const m = [];
    for (let i = 0; i < n / 2; i++) { let h = a[i], aw = a[n - 1 - i]; if ((r + i) % 2 === 1) { const x = h; h = aw; aw = x; } m.push([h, aw]); }
    rounds.push(m); a.splice(1, 0, a.pop());
  }
  return rounds.concat(rounds.map((m) => m.map((x) => [x[1], x[0]])));
}
const pairUp = (ids) => { const t = []; for (let i = 0; i < ids.length; i += 2) t.push({ a: ids[i], b: ids[i + 1], l1: null, l2: null, pen: null, w: null }); return t; };
function objFor(d) { return d === 3 ? { r: 2, t: 'Finir dans les 2 premiers (montée)' } : d === 2 ? { r: 4, t: 'Finir dans les 4 premiers' } : d === 1 ? { r: 5, t: 'Finir dans les 5 premiers' } : { r: 8, t: 'Se maintenir en Élite (top 8)' }; }
function buildSeason() {
  G.tab = {}; G.teams.forEach((t) => { G.tab[t.id] = { pts: 0, pl: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 }; });
  G.fix = [0, 1, 2, 3].map((d) => rr(shuffle(G.teams.filter((t) => t.div === d).map((t) => t.id))));
  G.res = [0, 1, 2, 3].map(() => []);
  G.cal = [];
  for (let w = 1; w <= 18; w++) G.cal.push({ day: 7 * w - 1, t: 'L', r: w - 1 });
  Object.keys(CUPW).forEach((r) => G.cal.push({ day: 7 * CUPW[r] - 4, t: 'C', r: +r }));
  G.cal.sort((a, b) => a.day - b.day);
  const low = G.teams.slice().sort((a, b) => (b.div - a.div) || (a.s - b.s)).slice(0, 16).map((t) => t.id);
  G.cup = { r: 0, cur: pairUp(shuffle(low)), byes: G.teams.filter((t) => low.indexOf(t.id) < 0).map((t) => t.id), champ: null, hist: [] };
  G.match = null; G.presser = null; G.pressDone = 0; G.obj = objFor(myDiv());
  G.day = 1; G.mlog = []; G.form5 = [];
}
function record(d, w, i, h, a, gh, ga) {
  (G.res[d][w] = G.res[d][w] || [])[i] = [gh, ga];
  const H = G.tab[h], A = G.tab[a];
  H.pl++; A.pl++; H.gf += gh; H.ga += ga; A.gf += ga; A.ga += gh;
  if (gh > ga) { H.w++; H.pts += 3; A.l++; } else if (gh < ga) { A.w++; A.pts += 3; H.l++; } else { H.d++; A.d++; H.pts++; A.pts++; }
}
function divTable(d) {
  return G.teams.filter((t) => t.div === d).map((t) => Object.assign({ id: t.id, n: t.name }, G.tab[t.id])).sort((a, b) => (b.pts - a.pts) || ((b.gf - b.ga) - (a.gf - a.ga)) || (b.gf - a.gf));
}
const myRank = () => divTable(myDiv()).findIndex((t) => t.id === ME) + 1;
function pois(l) { const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= Math.random(); } while (p > L); return k - 1; }
function genScore(a, b, neutral) { const d = (T(a).s - T(b).s + (neutral ? 0 : 3)) / 16; return [pois(1.3 * Math.exp(0.55 * d)), pois(1.15 * Math.exp(-0.55 * d))]; }
function aiShoot(a, b) { return Math.random() < 0.5 + (T(a).s - T(b).s) / 200; }
function shootout(pa, pb) {
  let x = 0, y = 0, g = 0;
  for (let i = 0; i < 5; i++) { if (Math.random() < pa) x++; if (Math.random() < pb) y++; }
  while (x === y && g < 20) { if (Math.random() < pa) x++; if (Math.random() < pb) y++; g++; }
  if (x === y) x++;
  return [x, y];
}
function nextMy() {
  for (const ev of G.cal) {
    if (ev.day < G.day) continue;
    if (ev.t === 'L') { const f = G.fix[myDiv()][ev.r]; const i = f.findIndex((x) => x[0] === ME || x[1] === ME); const h = f[i][0] === ME; return { ev, kind: 'L', opp: h ? f[i][1] : f[i][0], home: h, i, day: ev.day }; }
    if (ev.t === 'C' && G.cup.champ === null) {
      const t = G.cup.cur.find((x) => x.a === ME || x.b === ME);
      if (t && G.cup.r === ev.r) { const leg2 = ev.r === 5; const home = ev.r === 6 ? false : leg2 ? t.b === ME : t.a === ME; return { ev, kind: 'C', tie: t, opp: t.a === ME ? t.b : t.a, home, neutral: ev.r === 6, day: ev.day, leg: leg2 ? 2 : 1 }; }
    }
  }
  return null;
}

/* ---------- Lineup ---------- */
const slots = () => { const f = FM[G.formation]; return ['GB'].concat(Array(f[0]).fill('DEF'), Array(f[1]).fill('MIL'), Array(f[2]).fill('ATT')); };
const avail = (p) => !p.inj && !p.susp;
function fitLineup() {
  const sl = slots(), old = {}, res = [];
  (G.lineup || []).forEach((id) => { const p = P(id); if (p && avail(p)) (old[p.pos] = old[p.pos] || []).push(id); });
  sl.forEach((pos) => {
    let id = old[pos] && old[pos].shift();
    if (!id) { const c = G.players.filter((p) => avail(p) && p.pos === pos && res.indexOf(p.id) < 0).sort((a, b) => rate(b) - rate(a)); id = c[0] && c[0].id; }
    if (!id) { const c = G.players.filter((p) => avail(p) && res.indexOf(p.id) < 0).sort((a, b) => rate(b) - rate(a)); id = c[0] && c[0].id; }
    res.push(id);
  });
  G.lineup = res;
  if (!P(G.captain)) G.captain = G.players.slice().sort((a, b) => b.age - a.age)[0].id;
  if (!P(G.penTaker)) G.penTaker = (G.lineup.map(P).filter((p) => p && p.pos !== 'GB').sort((a, b) => b.st.tec - a.st.tec)[0] || G.players[0]).id;
}
const benchList = () => G.players.filter((p) => G.lineup.indexOf(p.id) < 0);
function teamStr(fz, hf) {
  const sl = slots(), out = { gk: 0, def: 0, mid: 0, att: 0 }, cnt = { gk: 0, def: 0, mid: 0, att: 0 }, bon = { gk: 0, def: 0, mid: 0, att: 0 };
  G.lineup.forEach((id, i) => {
    const p = P(id); if (!p) return; const line = lineOf(sl[i]);
    let v = score(p, line); if (p.pos !== sl[i]) v *= 0.85;
    v *= perf(p) * (fz || 1); out[line] += v; cnt[line]++;
    const t = p.tal && TAL[p.tal];
    if (t && t.ok(p)) bon[t.line] += t.b; else if (p.tal === 'contre' && p.moral < 40) bon.att -= 6;
  });
  ['gk', 'def', 'mid', 'att'].forEach((l) => { const n = cnt[l] || 1; out[l] = l === 'gk' ? out[l] + bon[l] : out[l] / n * (0.82 + 0.09 * n) + bon[l] * (fz || 1); });
  const cf = 0.97 + 0.06 * G.coh / 100, mt = MENT[G.ment], ad = 1 + 0.03 * (staff('adj').lvl - 1);
  out.att = (out.att + mt.a) * cf * ad * (hf || 1); out.def = (out.def + mt.d) * cf * ad * (hf || 1); out.mid = (out.mid + mt.m) * cf * ad * (hf || 1);
  return out;
}

/* ---------- Daily ---------- */
function dailyTick() {
  const med = G.fac.med, ph = staff('phy').lvl;
  const rec = 3 + med * 0.8 + ph * 0.6;
  G.players.forEach((p) => {
    if (p.inj > 0) { p.inj = Math.max(0, p.inj - (Math.random() < 0.05 * med + 0.05 * ph ? 2 : 1)); if (p.inj === 0) { news(p.name + ' est rétabli.'); p.fat = Math.max(p.fat, 20); } }
    p.fat = Math.max(0, p.fat - (G.train === 'repos' ? rec + 5 : rec - 1.5) - (p.inj > 0 ? 2 : 0));
    p.form += (50 - p.form) * 0.035;
    if (p.moral > 78) p.moral -= 0.4; else if (p.moral < 52 && p.bench < 3 && !(p.inj > 0)) p.moral += 0.25;
    if (G.train === 'repos' && p.moral < 80) p.moral += 0.3;
    if (p.msgCd > 0) p.msgCd--;
  });
  if (G.day % 7 === 1) weeklyDev();
  if (G.day % 7 === 0) weeklyMoney();
  G.coh = clamp(G.coh + (G.train === 'tactique' ? 0.3 : 0.05), 20, 95);
}
function weeklyDev() {
  const tr = G.fac.train, ad = staff('adj').lvl, focus = { physique: ['phy', 'spd'], technique: ['tec', 'att'], defense: ['def'], repos: [] }[G.train] || [];
  G.players.forEach((p) => {
    const young = p.age <= 21 ? 1.3 : p.age <= 24 ? 0.8 : p.age <= 28 ? 0.25 : p.age <= 31 ? -0.15 : -0.5;
    const share = p.recent.length ? p.recent.reduce((a, b) => a + b, 0) / p.recent.length : 0.5;
    const sc = young * 0.7 + (share - 0.5) * 0.9 + (p.moral - 50) / 110 + (p.form - 50) / 160 + tr * 0.06 + ad * 0.04 - 0.35 + (focus.length ? 0.08 : 0);
    p.xp += sc;
    const keys = p.pos === 'GB' ? ['gk'] : p.pos === 'DEF' ? ['def', 'phy', 'spd'] : p.pos === 'MIL' ? ['tec', 'phy', 'spd', 'def', 'att'] : ['att', 'tec', 'spd'];
    const before = ovr(p);
    if (p.xp >= 1.5) { p.xp -= 1.5; if (before < p.pot) { shuffle(keys.concat(focus.filter((k) => keys.indexOf(k) >= 0))).slice(0, 2).forEach((k) => { p.st[k] = Math.min(97, p.st[k] + 1); }); } }
    else if (p.xp <= -1.5) { p.xp += 1.5; shuffle(keys).slice(0, 2).forEach((k) => { p.st[k] = Math.max(18, p.st[k] - 1); }); }
    const after = ovr(p);
    if (after > before && after - (p.ovrNews || before) >= 2) { news(p.name + ' progresse : ' + after + ' de base.'); p.ovrNews = after; }
    if (after < before && (p.ovrNews || before) - after >= 2) { news(p.name + ' régresse : ' + after + ' de base.'); p.ovrNews = after; }
    p.rPrev = rate(p);
  });
}
function weeklyMoney() {
  const d = myDiv(), wages = G.players.reduce((a, p) => a + wageOf(p), 0) + G.staff.reduce((a, s) => a + 50 + s.lvl * 35, 0);
  const inc = [2600, 1700, 1100, 700][d] + G.fac.shop * 380;
  G.budget += inc - wages; G.wk = { inc, wages };
  if (G.budget < 0) { G.board = clamp(G.board - 2, 0, 100); }
}

/* ---------- Messages ---------- */
let MID = 0;
function pushMsg(m) { m.id = ++MID + '_' + G.day; m.day = G.day; m.st = 'new'; m.exp = G.day + (m.info ? 99 : 4); G.inbox.unshift(m); if (G.inbox.length > 40) G.inbox.pop(); return m; }
const nextDays = () => { const n = nextMy(); return n ? n.day - G.day : 99; };
function genMessages() {
  if (G.msgCd > 0) { G.msgCd--; return null; }
  const day = G.day, lu = G.lineup.map(P).filter(Boolean), res = [];
  const open = G.inbox.filter((m) => m.st === 'new' && !m.info).length;
  if (open >= 2) return null;
  const free = (p) => p.msgCd <= 0 && !G.inbox.some((m) => m.st === 'new' && m.pid === p.id);
  const cands = [];
  G.players.forEach((p) => {
    if (!free(p) || p.inj > 0) return;
    const inLu = G.lineup.indexOf(p.id) >= 0;
    if (p.dropped && !inLu) cands.push({ w: 9, k: 'angry', p });
    if (!inLu && p.bench >= 2 && !p.promise && rate(p) >= 45) cands.push({ w: 6 + p.bench, k: 'start', p });
    if (p.pos === 'ATT' && p.drought >= 3 && inLu) cands.push({ w: 8, k: 'drought', p });
    if (inLu && p.fat >= 74) cands.push({ w: 6, k: 'tired', p });
    if (p.moral < 35 && p.bench >= 2 && !p.listed) cands.push({ w: 7, k: 'leave', p });
    if ((p.pos === 'ATT' || p.pos === 'MIL') && p.goals >= 2 && G.penTaker !== p.id && p.moral >= 55 && Math.random() < 0.4) cands.push({ w: 4, k: 'pen', p });
    if ((p.trait === 'fier' || p.trait === 'ambitieux') && p.id !== G.captain && p.moral >= 60 && rate(p) >= 55 && p.apps >= 4) cands.push({ w: 2, k: 'cap', p });
    if (p.age <= 21 && p.form >= 68 && inLu && p.apps >= 3 && !p.thanked) cands.push({ w: 3, k: 'thanks', p });
  });
  const ps = cands.length && Math.random() < 0.27 ? (() => { const tot = cands.reduce((a, c) => a + c.w, 0); let r = Math.random() * tot; for (const c of cands) { r -= c.w; if (r <= 0) return c; } return cands[0]; })() : null;
  if (ps) {
    const p = ps.p; p.msgCd = 8; const id = p.id;
    const M0 = (text, choices, extra) => pushMsg(Object.assign({ from: { t: 'p', id }, pid: id, kind: ps.k, text, choices }, extra || {}));
    if (ps.k === 'angry') { p.dropped = 0; return M0('Coach, pourquoi tu m’as sorti du onze ? J’ai l’impression de ne plus compter.', [{ t: 'Choix tactique, ta place reste ouverte.', tone: 'enc' }, { t: 'Ton niveau n’était pas suffisant.', tone: 'fer' }, { t: 'Tu seras titulaire au prochain match.', tone: 'pro', fx: [['promise', id]] }]); }
    if (ps.k === 'start') return M0('Ça fait ' + p.bench + ' matchs que je regarde du banc. Je veux débuter le prochain match, coach.', [{ t: 'Tu débuteras. Parole de coach.', tone: 'pro', fx: [['promise', id]] }, { t: 'Gagne ta place à l’entraînement.', tone: 'fer' }, { t: 'Patience, ton tour viendra.', tone: 'enc' }]);
    if (ps.k === 'drought') return M0('Ça fait ' + p.drought + ' matchs que je ne marque plus. Ça me ronge, je n’arrive plus à y penser.', [{ t: 'Je crois en toi. Continue.', tone: 'enc', fx: [['form', id, 5]] }, { t: 'Travaille davantage devant le but.', tone: 'fer' }, { t: 'Prends une séance de récupération.', tone: 'pro', fx: [['rest', id]] }]);
    if (ps.k === 'tired') return M0('J’ai les jambes lourdes, coach. Je ne suis plus frais du tout.', [{ t: 'Repose-toi, on te ménage.', tone: 'enc', fx: [['rest', id]] }, { t: 'Serre les dents, on a besoin de toi.', tone: 'fer' }, { t: 'Séance de récup, puis on voit.', tone: 'pro', fx: [['rest', id]] }]);
    if (ps.k === 'leave') return M0('Je ne joue pas et je perds mon temps ici. Je veux partir.', [{ t: 'D’accord, je te mets sur la liste.', tone: 'fer', fx: [['list', id]] }, { t: 'Reste. Tu débuteras bientôt.', tone: 'pro', fx: [['promise', id]] }, { t: 'Tu restes, point final.', tone: 'fer', m: -6 }]);
    if (ps.k === 'pen') return M0('Coach, je veux tirer les penaltys. Je me sens prêt à prendre cette responsabilité.', [{ t: 'D’accord, c’est toi le tireur.', tone: 'pro', fx: [['pen', id]] }, { t: 'Non, on garde notre tireur.', tone: 'fer' }, { t: 'Montre-moi ça à l’entraînement.', tone: 'enc' }]);
    if (ps.k === 'cap') return M0('Je pense mériter le brassard de capitaine. Je suis prêt à guider le groupe.', [{ t: 'Il est à toi.', tone: 'pro', fx: [['captain', id]] }, { t: 'Pas pour l’instant.', tone: 'fer' }, { t: 'Plus tard, peut-être.', tone: 'enc' }]);
    if (ps.k === 'thanks') { p.thanked = 1; return M0('Merci pour la confiance, coach. Je ne vais pas te décevoir.', null, { info: true, fx: [['moral', id, 4]] }); }
  }
  // staff
  const nm = nextMy();
  if (nm && nm.day - day <= 4 && nm.day - day >= 1 && !G.tips[nm.day] && Math.random() < 0.4 && !G.inbox.some((m) => m.st === 'new' && m.kind === 'tip')) {
    G.tips[nm.day] = 1; const ot = T(nm.opp), a = staff('adj'), best = ot.tilt.a - ot.tilt.d >= 0 ? '1-3-1-2' : '1-2-3-1', w = ot.tilt.a >= ot.tilt.d ? 'attaque' : 'défense';
    return pushMsg({ from: { t: 's', id: 'adj' }, kind: 'tip', text: ot.name + ' est surtout forte en ' + w + '. Je te conseille le ' + best + ' pour ce match.', choices: [{ t: 'Bonne idée, on l’applique.', fx: [['formation', best]], rep: 'Parfait. On le travaille cette semaine.' }, { t: 'On garde notre plan.', rep: 'Compris, coach.' }] });
  }
  const tired = G.players.filter((p) => p.fat >= 70 && p.inj === 0);
  if (tired.length >= 2 && nm && nm.day - day <= 3 && nm.day - day >= 1 && !G.tips['p' + nm.day] && Math.random() < 0.5) {
    G.tips['p' + nm.day] = 1; const ids = tired.slice(0, 3).map((p) => p.id);
    return pushMsg({ from: { t: 's', id: 'phy' }, kind: 'phy', text: tired.slice(0, 3).map((p) => p.name).join(', ') + ' sont à bout. Je recommande une séance de récupération.', choices: [{ t: 'Fais-leur une séance de récup.', fx: ids.map((i) => ['rest', i]), rep: 'C’est noté. Ils seront plus frais.' }, { t: 'On a besoin d’eux, tant pis.', rep: 'À tes risques, coach.' }] });
  }
  if (day - G.recDay >= 14 && Math.random() < 0.22) {
    G.recDay = day; const c = genRecruit(); G.market.unshift(c); if (G.market.length > 14) G.market.pop();
    return pushMsg({ from: { t: 's', id: 'rec' }, kind: 'rec', text: 'J’ai repéré ' + c.name + ', ' + c.pos + ' de ' + c.age + ' ans, note ' + rate(c) + ' et un potentiel de ' + c.pot + '. Il est à ' + fmt(valueOf(c)) + '.', choices: [{ t: 'Voir le dossier.', fx: [['nav', 'club', 'transfers']], rep: 'Je te prépare le dossier.' }, { t: 'Pas maintenant.', rep: 'D’accord, il reste en veille.' }] });
  }
  // offers for listed
  const lst = G.players.filter((p) => p.listed);
  if (lst.length && day % 7 === 3 && Math.random() < 0.5 && G.players.length > 10) {
    const p = pick(lst), price = Math.round(valueOf(p) * rnd(0.8, 1.15) / 10) * 10, club = pick(G.teams.filter((t) => t.id !== ME)).name;
    return pushMsg({ from: { t: 's', id: 'rec' }, kind: 'offer', pid: p.id, text: club + ' offre ' + fmt(price) + ' pour ' + p.name + '. Tu acceptes ?', choices: [{ t: 'Accepter l’offre.', fx: [['sell', p.id, price]], rep: 'Transfert conclu.' }, { t: 'Refuser.', rep: 'Je leur réponds non.' }] });
  }
  return null;
}
function applyFx(list, tag) {
  const out = [];
  (list || []).forEach((f) => {
    const k = f[0];
    if (k === 'moral') { const ids = f[1] === 'all' ? G.players.map((p) => p.id) : [f[1]]; ids.forEach((i) => { const p = P(i); if (p) p.moral = clamp(p.moral + f[2], 0, 100); }); if (f[1] !== 'all' && P(f[1]) && Math.abs(f[2]) >= 3) out.push(P(f[1]).name + ' ' + (f[2] > 0 ? '+' : '') + f[2] + ' moral'); else if (f[1] === 'all') out.push('Groupe ' + (f[2] > 0 ? '+' : '') + f[2] + ' moral'); }
    else if (k === 'promise') { const p = P(f[1]); if (p) { p.promise = { t: 'start', until: G.day + 9 }; out.push(p.name + ' débutera le prochain match'); } }
    else if (k === 'pen') { const old = P(G.penTaker); G.penTaker = f[1]; if (old && old.id !== f[1]) old.moral = clamp(old.moral - 4, 0, 100); out.push(P(f[1]).name + ' tire les penaltys'); }
    else if (k === 'captain') { const old = P(G.captain); G.captain = f[1]; if (old && old.id !== f[1]) old.moral = clamp(old.moral - 5, 0, 100); out.push(P(f[1]).name + ' est capitaine'); }
    else if (k === 'rest') { const p = P(f[1]); if (p) { p.fat = Math.max(0, p.fat - 18); p.moral = clamp(p.moral + 2, 0, 100); out.push(p.name + ' récupère'); } }
    else if (k === 'form') { const p = P(f[1]); if (p) { p.form = clamp(p.form + f[2], 0, 100); out.push(p.name + ' forme +' + f[2]); } }
    else if (k === 'list') { const p = P(f[1]); if (p) { p.listed = true; p.moral = clamp(p.moral + 4, 0, 100); out.push(p.name + ' est sur la liste'); } }
    else if (k === 'sell') { const p = P(f[1]); if (p && G.players.length > 9) { G.budget += f[2]; G.players = G.players.filter((x) => x.id !== p.id); fitLineup(); out.push(p.name + ' vendu ' + fmt(f[2])); news(p.name + ' quitte le club pour ' + fmt(f[2]) + '.'); } }
    else if (k === 'formation') { G.formation = f[1]; fitLineup(); out.push('Formation ' + f[1]); }
    else if (k === 'board') { G.board = clamp(G.board + f[1], 0, 100); out.push('Conseil ' + (f[1] > 0 ? '+' : '') + f[1]); }
    else if (k === 'coh') { G.coh = clamp(G.coh + f[1], 0, 100); out.push('Cohésion ' + (f[1] > 0 ? '+' : '') + f[1]); }
    else if (k === 'fans') { G.supp = Math.max(50, G.supp + f[1]); out.push('Supporters ' + (f[1] > 0 ? '+' : '') + f[1]); }
    else if (k === 'opp') { G.oppBoost = (G.oppBoost || 0) + f[1]; out.push('L’adversaire est ' + (f[1] > 0 ? 'piqué au vif' : 'sous-estimé')); }
    else if (k === 'amb') { G.players.forEach((p) => { if (p.trait === 'ambitieux') p.moral = clamp(p.moral + f[1], 0, 100); }); out.push('Les ambitieux ' + (f[1] > 0 ? '+' : '') + f[1] + ' moral'); }
    else if (k === 'nav') { UI.screen = f[1]; UI.club = f[2]; }
  });
  return out;
}
function answerMsg(mid, ci) {
  const m = G.inbox.find((x) => x.id === mid); if (!m || m.st === 'done') return;
  const c = m.choices[ci], p = m.pid && P(m.pid); let rep = c.rep || '', fx = (c.fx || []).slice();
  if (c.tone && p) { const tt = TALK[p.trait][c.tone]; const d = c.m !== undefined ? c.m : tt[0]; fx.unshift(['moral', p.id, d]); rep = rep || tt[1]; }
  m.sum = applyFx(fx); m.sel = ci; m.reply = rep; m.st = 'done';
  }

/* ---------- Press ---------- */
function makePresser(nm) {
  const qs = [], opp = T(nm.opp), lu = G.lineup.map(P).filter(Boolean);
  const drought = lu.filter((p) => p.pos === 'ATT' && p.drought >= 3).sort((a, b) => b.drought - a.drought)[0];
  const scorer = G.players.slice().sort((a, b) => b.goals - a.goals)[0];
  const young = lu.filter((p) => p.age <= 21).sort((a, b) => rate(b) - rate(a))[0];
  const bench = benchList().filter((p) => p.bench >= 2 && rate(p) >= 50)[0];
  let f;
  if (drought) f = { q: drought.name + ' n’a pas marqué depuis ' + drought.drought + ' matchs. Vous vous inquiétez ?', pid: drought.id, a: [{ t: 'Il va marquer, j’ai confiance.', tone: 'enc', fx: [['form', drought.id, 4]] }, { t: 'Il doit se réveiller.', tone: 'fer' }, { t: 'Je ne commente pas les joueurs.', fx: [['coh', 1]] }] };
  else if (bench) f = { q: bench.name + ' est souvent sur le banc. C’est un problème pour vous ?', pid: bench.id, a: [{ t: 'Il compte beaucoup pour nous.', tone: 'enc' }, { t: 'Il doit gagner sa place.', tone: 'fer' }, { t: 'Le groupe passe avant tout.', fx: [['coh', 2]] }] };
  else if (young && Math.random() < 0.6) f = { q: young.name + ', ' + young.age + ' ans, impressionne. Est-il prêt pour le haut niveau ?', pid: young.id, a: [{ t: 'Absolument. Il a un talent rare.', tone: 'enc', fx: [['form', young.id, 3]] }, { t: 'Il apprend vite. Patience.', tone: 'pro' }, { t: 'Il doit encore faire ses preuves.', tone: 'fer' }] };
  else if (scorer.goals >= 1) f = { q: scorer.name + ' a ' + scorer.goals + ' buts cette saison. Est-ce votre meilleur joueur ?', pid: scorer.id, a: [{ t: 'Oui, il est exceptionnel.', tone: 'enc', fx: [['coh', -1]] }, { t: 'Notre force, c’est le collectif.', fx: [['coh', 2]] }, { t: 'Il peut encore progresser.', tone: 'fer' }] };
  else f = { q: 'Comment se passe l’ambiance dans le vestiaire en ce moment ?', a: [{ t: 'Excellente. Le groupe est soudé.', fx: [['coh', 2], ['moral', 'all', 1]] }, { t: 'Il y a de la concurrence, et c’est sain.', fx: [['coh', 1]] }, { t: 'On travaille, c’est tout.', fx: [['board', 1]] }] };
  qs.push(f);
  const d = myDiv(), rk = myRank();
  qs.push({ q: 'Vous êtes ' + rk + (rk === 1 ? 'er' : 'e') + ' en ' + DIVS[d].n + '. Quel est votre objectif cette saison ?', a: [{ t: d > 0 ? 'Monter. Sans hésiter.' : 'Le titre, rien d’autre.', fx: [['board', 3], ['fans', 20], ['amb', 3]] }, { t: 'Un match à la fois.', fx: [['coh', 2], ['board', 1]] }, { t: 'La Coupe du Roi, c’est un rêve.', fx: [['fans', 25], ['amb', 2], ['board', -1]] }] });
  const orank = divTable(opp.div).findIndex((t) => t.id === opp.id) + 1;
  qs.push({ q: opp.name + ' est ' + orank + (orank === 1 ? 'er' : 'e') + ' en ' + DIVS[opp.div].n + '. Un adversaire à craindre ?', a: [{ t: 'Beaucoup de respect pour eux.', fx: [['moral', 'all', 1], ['coh', 1]] }, { t: 'Nous sommes meilleurs.', fx: [['moral', 'all', 3], ['opp', 2]] }, { t: 'On verra sur le terrain.', fx: [['board', 1]] }] });
  return qs;
}
function answerPress(i, ci) {
  const q = G.presser.qs[i], c = q.a[ci], p = q.pid && P(q.pid); let fx = (c.fx || []).slice();
  if (c.tone && p) fx.unshift(['moral', p.id, TALK[p.trait][c.tone][0]]);
  G.presser.res[i] = { ci, sum: applyFx(fx), rep: p && c.tone ? TALK[p.trait][c.tone][1].replace(/^Il/, p.name) : '' };
}

/* ---------- Cup ---------- */
function tieAgg(t) { const l2 = t.l2 || [0, 0]; return [(t.l1 ? t.l1[0] : 0) + l2[1], (t.l1 ? t.l1[1] : 0) + l2[0]]; }
function settleTie(t, r, fast) {
  if (r === 4) return;
  const two = r === 5, g = two ? tieAgg(t) : t.l1;
  if (g[0] !== g[1]) { t.w = g[0] > g[1] ? t.a : t.b; return; }
  t.pen = shootout(0.5 + (T(t.a).s - T(t.b).s) / 220, 0.5 - (T(t.a).s - T(t.b).s) / 220);
  t.w = t.pen[0] > t.pen[1] ? t.a : t.b;
}
function playTie(t, r) {
  if (r === 5) t.l2 = genScore(t.b, t.a, false); else t.l1 = genScore(t.a, t.b, r === 6);
  settleTie(t, r);
}
function finishCupRound(r) {
  const C = G.cup; C.hist.push({ r, ties: C.cur.map((t) => Object.assign({}, t)) });
  if (r === 4) { C.r = 5; return; }
  if (r === 6) { C.champ = C.cur[0].w; C.r = 7; if (C.champ === ME) { G.supp += 120; G.budget += 4000; news('Victoire en Coupe du Roi ! Le club entre dans l’histoire.'); } else news(T(C.champ).name + ' remporte la Coupe du Roi.'); return; }
  let alive = C.cur.map((t) => t.w); if (r === 0) alive = alive.concat(C.byes);
  C.r = r + 1; C.cur = pairUp(shuffle(alive));
}
const meInCup = () => G.cup.champ === null && G.cup.cur.some((t) => t.a === ME || t.b === ME);

/* ---------- Day advance ---------- */
function nextDay() {
  G.day++;
  if (G.day >= SEND) { endSeason(); return { stop: 'season' }; }
  dailyTick();
  G.inbox.forEach((m) => { if (m.st === 'new' && !m.info && m.day + 4 <= G.day) { m.st = 'done'; m.expired = true; const p = m.pid && P(m.pid); if (p) { p.moral = clamp(p.moral - 4, 0, 100); } } });
  const ev = G.cal.find((e) => e.day === G.day);
  let stop = null;
  if (ev) {
    if (ev.t === 'L') {
      G.fix.forEach((rounds, d) => rounds[ev.r].forEach((fx, i) => { if (fx[0] === ME || fx[1] === ME) { G.mi = { d, w: ev.r, i }; } else { const s = genScore(fx[0], fx[1]); record(d, ev.r, i, fx[0], fx[1], s[0], s[1]); } }));
      const nm = nextMy(); G.match = { kind: 'L', opp: nm.opp, home: nm.home, day: G.day, r: ev.r };
      stop = 'match';
    } else {
      const C = G.cup, myT = C.cur.find((t) => t.a === ME || t.b === ME);
      C.cur.forEach((t) => { if (t !== myT) playTie(t, ev.r); });
      if (!myT) { finishCupRound(ev.r); news(CUPR[ev.r] + ' de la Coupe du Roi jouée.'); } else { const nm = nextMy(); G.match = { kind: 'C', opp: nm.opp, home: nm.home, neutral: nm.neutral, day: G.day, r: ev.r, leg: nm.leg }; stop = 'match'; }
    }
  }
  if (stop) { G.tips = {}; save(); return { stop }; }
  const nm = nextMy();
  if (nm && nm.day - G.day === 1 && G.pressDone !== nm.day) { G.pressDone = nm.day; G.presser = { qs: makePresser(nm), res: [], opp: nm.opp, day: nm.day }; save(); return { stop: 'presser' }; }
  const m = genMessages();
  if (m && !m.info) { G.msgCd = 1; save(); return { stop: 'msg', m }; }
  if (m && m.info) { applyFx(m.fx); m.st = 'done'; }
  if (G.day % 3 === 0) save();
  return { stop: null };
}

/* ---------- Match ---------- */
function oppLines(t, home) { const s = t.s + (home ? 2.5 : 0) + (G.oppBoost || 0), j = () => rnd(-3, 3); return { gk: s + 5 + j(), def: s + t.tilt.d + j(), mid: s + t.tilt.m + j(), att: s + t.tilt.a + j() }; }
function lockLineup() {
  G.players.forEach((p) => {
    if (!avail(p) && G.lineup.indexOf(p.id) >= 0) { /* fitLineup replaces */ }
  });
  fitLineup();
  const inLu = (id) => G.lineup.indexOf(id) >= 0;
  G.players.forEach((p) => {
    if (p.promise) {
      if (inLu(p.id)) { p.moral = clamp(p.moral + 6, 0, 100); p.promise = null; }
      else if (p.inj > 0 || p.susp > 0) { p.promise = null; }
      else { p.moral = clamp(p.moral - 12, 0, 100); p.promise = null; news('Promesse non tenue envers ' + p.name + '.'); G.board = clamp(G.board - 1, 0, 100); }
    }
    if (G.lastXI.indexOf(p.id) >= 0 && !inLu(p.id) && p.inj === 0 && p.susp === 0 && rate(p) >= 50) p.dropped = 1;
  });
}
function startMatch() {
  const m = G.match, ot = T(m.opp);
  lockLineup();
  const hf = m.home ? 1 + 0.012 * (1 + G.fac.pitch) + 0.004 * G.fac.lights : m.neutral ? 1 : 0.99;
  M = { kind: m.kind, opp: m.opp, home: m.home, neutral: !!m.neutral, r: m.r, leg: m.leg || 1, b: 0, min: 0, sc: [0, 0], feed: [], scorers: [], O: oppLines(ot, !m.home && !m.neutral), hf, red: [0, 0], redP: [], pens: [], ev: [], htm: null, done: false, ball: 'M', mine: G.lineup.slice() };
  const att = m.home ? Math.min(CAPS[G.fac.cap], Math.round(G.supp * (0.75 + Math.random() * 0.25))) : 0;
  M.att = att;
  M.feed.push({ t: 'Coup d’envoi !', c: '' });
  return M;
}
function names(userSide, line) {
  if (userSide) {
    const sl = slots(); const c = G.lineup.map((id, i) => ({ p: P(id), pos: sl[i] })).filter((x) => x.p && M.redP.indexOf(x.p.id) < 0);
    const w = (x) => line === 'att' ? ({ ATT: 6, MIL: 2.5, DEF: 0.4, GB: 0 }[x.pos]) : line === 'def' ? ({ DEF: 6, MIL: 1.5, ATT: 0.3, GB: 0 }[x.pos]) : line === 'gk' ? (x.pos === 'GB' ? 1 : 0) : ({ MIL: 6, ATT: 2, DEF: 1, GB: 0 }[x.pos]);
    const tot = c.reduce((a, x) => a + w(x), 0); let r = Math.random() * tot;
    for (const x of c) { r -= w(x); if (r <= 0) return x.p; }
    return c[0].p;
  }
  const n = T(M.opp).names; return { name: line === 'gk' ? n[0] : pick(n.slice(1)), id: null };
}
function simBlock() {
  const fz = 1 - 0.12 * (M.b / 30);
  const ru = 1 - 0.07 * M.red[0], ro = 1 - 0.07 * M.red[1];
  const U = teamStr(fz, M.hf), O = M.O;
  if (M.htm) { U.att += M.htm.a; U.def += M.htm.d; U.mid += M.htm.m; }
  ['def', 'mid', 'att'].forEach((l) => { U[l] *= ru; });
  const Oo = { gk: O.gk, def: O.def * ro, mid: O.mid * ro, att: O.att * ro };
  const posU = U.mid / (U.mid + Oo.mid);
  const n = 1 + (Math.random() < 0.14 + 0.1 * G.coh / 100 ? 1 : 0);
  for (let k = 0; k < n; k++) {
    const us = Math.random() < posU, X = us ? U : Oo, Y = us ? Oo : U;
    M.ball = us ? 'U' : 'O';
    if (Math.random() < 0.009) { penaltyEvent(us); continue; }
    if (Math.random() < 0.012) { freekickEvent(us); continue; }
    if (Math.random() < 0.0035) { redEvent(Math.random() < 0.5); }
    const r = X.mid / (X.mid + Y.def * 0.95), reach = 0.2 + 0.55 * r;
    if (Math.random() > reach) { if (Math.random() < 0.4) { const d = names(!us, 'def'); M.feed.push({ t: M.min + "' " + d.name + ' ' + pick(['coupe la passe.', 'intercepte le ballon.', 'repousse l’attaque.']), c: '' }); } continue; }
    const s = X.att / (X.att + Y.def * 0.9);
    if (Math.random() > 0.4 + 0.35 * s) { if (Math.random() < 0.5) { const a = names(us, 'att'); M.feed.push({ t: M.min + "' " + a.name + ' ' + pick(['perd son duel.', 'rate son contrôle.', 'est trop lent.']), c: '' }); } continue; }
    const goalP = 0.12 + 0.28 * X.att / (X.att + Y.gk * 1.1), sh = names(us, 'att'), roll = Math.random();
    if (roll < goalP) { goalFor(us, sh, ''); }
    else if (roll < goalP + (1 - goalP) * 0.55) { const g = names(!us, 'gk'); M.feed.push({ t: M.min + "' " + g.name + ' ' + pick(['détourne le tir', 'réalise l’arrêt', 'sort le grand jeu']) + ' devant ' + sh.name + '.', c: '' }); }
    else M.feed.push({ t: M.min + "' " + sh.name + ' ' + pick(['tire au-dessus.', 'frappe à côté.', 'touche le poteau !']), c: '' });
  }
}
function goalFor(us, sh, tag) {
  M.sc[us ? 0 : 1]++;
  if (us && sh.id) { sh.goals++; sh.drought = 0; sh.gm = (sh.gm || 0) + 1; M.scorers.push(sh.id); }
  M.ev.push({ min: M.min, t: 'goal', us, p: sh.id || sh.name });
  M.feed.push({ t: M.min + "' BUT ! " + sh.name + ' ' + (tag || pick(['conclut une belle action.', 'trompe le gardien.', 'place le ballon dans le coin.', 'ne tremble pas.'])) + ' ' + M.sc[0] + '-' + M.sc[1], c: us ? 'g' : 'o' });
}
function penaltyEvent(us) {
  let tk = null;
  if (us) { tk = P(G.penTaker); if (!tk || G.lineup.indexOf(tk.id) < 0 || M.redP.indexOf(tk.id) >= 0) tk = G.lineup.map(P).filter((p) => p && p.pos !== 'GB').sort((a, b) => b.st.tec - a.st.tec)[0]; } else tk = { name: pick(T(M.opp).names.slice(1)), id: null };
  const prob = us ? clamp(0.7 + (tk.st.tec - 50) / 220 + (tk.form - 50) / 500 + (tk.tal === 'tireur' ? 0.1 : 0) + (tk.moral - 50) / 600, 0.5, 0.92) : 0.74;
  M.feed.push({ t: M.min + "' PENALTY pour " + (us ? 'nous' : T(M.opp).name) + ' ! ' + tk.name + ' s’avance.', c: us ? 'g' : 'o' });
  const ok = Math.random() < prob;
  M.ev.push({ min: M.min, t: 'pen', us, p: tk.id || tk.name, ok });
  if (ok) goalFor(us, tk, 'transforme le penalty.');
  else { M.feed.push({ t: M.min + "' ARRÊTÉ ! " + (us ? 'Le gardien adverse' : names(true, 'gk').name) + ' détourne le penalty de ' + tk.name + '.', c: us ? 'o' : 'g' }); if (us && tk.id) { tk.moral = clamp(tk.moral - 5, 0, 100); tk.pm = 1; } }
}
function freekickEvent(us) {
  let tk;
  if (us) { tk = G.lineup.map(P).filter((p) => p && p.pos !== 'GB' && M.redP.indexOf(p.id) < 0).sort((a, b) => (b.st.tec + (b.tal === 'tireur' ? 12 : 0)) - (a.st.tec + (a.tal === 'tireur' ? 12 : 0)))[0]; if (!tk) return; } else tk = { name: pick(T(M.opp).names.slice(1)), id: null };
  const skill = us ? (tk.st.tec - 50) / 400 + (tk.tal === 'tireur' ? 0.06 : 0) : 0;
  const r = Math.random(), pg = 0.11 + skill, pp = 0.09;
  const out = r < pg ? 'goal' : r < pg + pp ? 'post' : 'miss';
  M.feed.push({ t: M.min + "' COUP FRANC dangereux pour " + (us ? 'nous' : T(M.opp).name) + '. ' + tk.name + ' se place.', c: us ? 'g' : 'o' });
  M.ev.push({ min: M.min, t: 'fk', us, p: tk.id || tk.name, out });
  if (out === 'goal') goalFor(us, tk, 'enroule un coup franc magnifique.');
  else if (out === 'post') M.feed.push({ t: M.min + "' BARRE ! Le coup franc de " + tk.name + ' fait trembler la transversale.', c: us ? 'o' : 'g' });
  else M.feed.push({ t: M.min + "' Le coup franc de " + tk.name + ' est ' + pick(['bien repoussé par le gardien.', 'au-dessus.', 'dans le mur.']), c: '' });
}
function redEvent(us) {
  if (us) {
    const c = G.lineup.map(P).filter((p) => p && p.pos !== 'GB' && M.redP.indexOf(p.id) < 0); if (!c.length || M.red[0] >= 1) return;
    const p = pick(c); M.redP.push(p.id); M.red[0]++; p.susp = 1; p.moral = clamp(p.moral - 6, 0, 100);
    M.feed.push({ t: M.min + "' CARTON ROUGE ! " + p.name + ' est expulsé. On termine à 6.', c: 'o' }); M.ev.push({ min: M.min, t: 'red', us: true, p: p.id });
  } else { if (M.red[1] >= 1) return; M.red[1]++; M.feed.push({ t: M.min + "' CARTON ROUGE pour " + pick(T(M.opp).names.slice(1)) + '. L’adversaire joue à 6.', c: 'g' }); M.ev.push({ min: M.min, t: 'red', us: false }); }
}
function stepBlock() { M.b++; M.min = M.b * 3; simBlock(); if (M.b >= 30) M.done = true; }
function playAll() { while (!M.done) { if (M.b === 15 && !M.htm) M.htm = { a: 0, d: 0, m: 0 }; stepBlock(); } }
function applyResult() {
  const m = G.match, gu = M.sc[0], go = M.sc[1], win = gu > go, draw = gu === go, lose = gu < go;
  const opp = T(M.opp);
  M.pen = null; M.winner = null;
  if (m.kind === 'L') { const f = G.mi; const h = M.home ? ME : M.opp, a = M.home ? M.opp : ME; record(f.d, f.w, f.i, h, a, M.home ? gu : go, M.home ? go : gu); }
  else {
    const t = m.tie || G.cup.cur.find((x) => x.a === ME || x.b === ME), r = m.r;
    const meA = t.a === ME;
    if (r === 5) t.l2 = meA ? [go, gu] : [gu, go]; else t.l1 = meA ? [gu, go] : [go, gu];
    settleTie(t, r);
    if (t.pen) { const mine = meA ? t.pen[0] : t.pen[1], th = meA ? t.pen[1] : t.pen[0]; M.pen = [mine, th]; }
    if (r !== 4) M.winner = t.w;
    finishCupRound(r);
  }
  const lu = M.mine.map(P).filter(Boolean), res = win ? 'V' : draw ? 'N' : 'D';
  const pr = G.players.map((p) => p.id);
  G.players.forEach((p) => {
    const played = M.mine.indexOf(p.id) >= 0;
    p.recent.push(played ? 1 : 0); if (p.recent.length > 5) p.recent.shift();
    if (played) {
      p.apps++; p.bench = 0;
      const gm = p.gm || 0; p.gm = 0;
      let pr0 = 50 + (gu - go) * 5 + gm * 14 + rnd(-10, 10);
      if ((p.pos === 'DEF' || p.pos === 'GB') && go === 0) pr0 += 8;
      if (p.pm) { pr0 -= 8; p.pm = 0; }
      if (p.pos === 'ATT' && !gm) { p.drought++; if (p.drought >= 3) { p.moral = clamp(p.moral - 3, 0, 100); pr0 -= 6; } }
      p.form = clamp(p.form * 0.55 + pr0 * 0.45, 5, 98);
      const fzm = MENT[G.ment].fat; p.fat = clamp(p.fat + (22 + rnd(0, 8)) * fzm * (1 - 0.04 * G.fac.med), 0, 100);
      p.moral = clamp(p.moral + (win ? 4 : draw ? 0.5 : -3) + gm * 3, 0, 100);
      const risk = (0.022 + 0.0007 * Math.max(0, p.fat - 55)) * (1 - 0.05 * staff('phy').lvl - 0.03 * G.fac.pitch) * (G.fac.pitch >= 3 ? 0.9 : 1);
      if (Math.random() < risk) { const serious = Math.random() < 0.1; p.inj = serious ? ri(40, 90) : ri(4, 22); news(p.name + (serious ? ' : blessure grave, absent ' + p.inj + ' jours.' : ' se blesse, absent ' + p.inj + ' jours.')); if (serious) { M.serious = p.id; } else if (!M.injured) M.injured = p.id; }
    } else if (p.inj === 0) {
      p.bench++; p.form = Math.max(38, p.form - 1.2); p.fat = Math.max(0, p.fat - 6);
      if (p.bench >= 3 && p.moral > 40) p.moral = clamp(p.moral - 1.5, 0, 100);
      p.moral = clamp(p.moral + (win ? 1.5 : lose ? -1 : 0), 0, 100);
    }
    if (p.susp > 0 && M.redP.indexOf(p.id) < 0) p.susp--;
  });
  void pr; void lu;
  G.lastXI = M.mine.slice(); G.oppBoost = 0;
  G.coh = clamp(G.coh + (win ? 1.5 : lose ? -1.5 : 0), 20, 95);
  G.board = clamp(G.board + (win ? 1 : lose ? -1.2 : 0), 0, 100);
  G.supp = Math.max(80, Math.round(G.supp * (win ? 1.007 : lose ? 0.996 : 1.001) + (win ? 2 : 0)));
  const att = M.att || Math.round(Math.min(CAPS[G.fac.cap], G.supp * 0.5));
  if (M.home) { const gate = att * DIVS[myDiv()].price * (m.kind === 'C' ? 0.9 : 1) + G.fac.vip * 450 * (1 + (3 - myDiv()) * 0.4); M.gate = Math.round(gate); G.budget += M.gate; }
  G.form5.push(res); if (G.form5.length > 5) G.form5.shift();
  G.mlog.push({ day: G.day, k: m.kind, opp: M.opp, h: M.home, sc: [gu, go], res, pen: M.pen, r: m.r });
  M.done = true; M.over = true;
  const finals = m.kind === 'C' && m.r === 6;
  if (finals && win) news('Nous gagnons la finale ! ' + gu + '-' + go + '.');
  G.match = null; G.presser = null;
  save();
}
function simMatchInstant() { startMatch(); playAll(); applyResult(); }

/* ---------- Season end ---------- */
function endSeason() {
  const d = myDiv(), tabs = [0, 1, 2, 3].map((x) => divTable(x)), rk = myRank();
  const rec = { season: G.season, div: d, rank: rk, pts: G.tab[ME].pts, cup: G.cup.champ === ME ? 'Vainqueur' : (() => { const cm = G.mlog.filter((x) => x.k === 'C'); return cm.length ? 'Éliminé : ' + CUPR[cm[cm.length - 1].r] : 'Pas de match'; })() };
  const up = [], down = [];
  tabs.forEach((tb, x) => { if (x > 0) tb.slice(0, 2).forEach((r) => up.push(r.id)); if (x < 3) tb.slice(-2).forEach((r) => down.push(r.id)); });
  const prize = DIVS[d].prize * (rk <= 3 ? 1.5 - 0.15 * (rk - 1) : rk <= 6 ? 0.8 : 0.5);
  G.budget += Math.round(prize);
  let promoted = up.indexOf(ME) >= 0, relegated = down.indexOf(ME) >= 0;
  rec.res = promoted ? 'Promu' : relegated ? 'Relégué' : 'Maintien'; rec.prize = Math.round(prize);
  const ok = rk <= G.obj.r; G.board = clamp(G.board + (ok ? 12 : -14), 0, 100); rec.obj = ok;
  G.teams.forEach((t) => { if (up.indexOf(t.id) >= 0) { t.div--; t.s += 1.5; } else if (down.indexOf(t.id) >= 0) { t.div++; t.s -= 1.5; } t.s = clamp(t.s + (DBASE[t.div] - t.s) * 0.2 + rnd(-2, 2), 30, 95); });
  if (promoted) { G.supp = Math.round(G.supp * 1.5); news('Promotion ! Bienvenue en ' + DIVS[myDiv()].n + '.'); } else if (relegated) { G.supp = Math.round(G.supp * 0.75); news('Relégation. Il faut rebondir.'); } else news('Saison terminée : ' + rk + 'e place.');
  G.players.forEach((p) => { p.age++; p.goals = 0; p.apps = 0; p.drought = 0; p.recent = []; if (p.age >= 31) { Object.keys(p.st).forEach((k) => { p.st[k] = Math.max(18, p.st[k] - (p.age >= 34 ? 2 : 1)); }); } p.promise = null; p.susp = 0; p.fat = Math.max(0, p.fat - 40); p.moral = clamp(p.moral + 4, 0, 100); p.thanked = 0; p.ovrNews = 0; });
  G.hist.push(rec); G.season++; G.lastRec = rec; T(ME).name = T(ME).name;
  buildSeason(); fitLineup(); genMarket(); G.inbox = G.inbox.filter((m) => m.st === 'new');
  save();
}

/* ---------- Market ---------- */
function squadAvg() { const l = G.players.map(rate).sort((a, b) => b - a).slice(0, 8); return l.reduce((a, b) => a + b, 0) / l.length; }
function genRecruit() {
  const rl = staff('rec').lvl, av = squadAvg(), pos = pick(['GB', 'DEF', 'DEF', 'MIL', 'MIL', 'ATT', 'ATT']);
  const age = pick([17, 18, 19, 20, 21, 22, 23, 24, 25, 27, 29, 31]);
  const p = genPlayer(Math.round(av + rnd(-8, 4 + rl * 2.5)), pos, age); p.listedBy = 1; p.from = pick(G.teams.filter((t) => t.id !== ME)).name; return p;
}
function genMarket() { G.market = []; const n = 8 + staff('rec').lvl; for (let i = 0; i < n; i++) G.market.push(genRecruit()); }
function buy(id) {
  const i = G.market.findIndex((p) => p.id === id); if (i < 0) return 'Introuvable';
  const p = G.market[i], pr = valueOf(p);
  if (G.budget < pr) return 'Budget insuffisant';
  if (G.players.length >= 18) return 'Effectif complet (18 max)';
  G.budget -= pr; G.market.splice(i, 1); p.moral = 80; p.kitStyle = 'stripes'; G.players.push(p); news(p.name + ' signe pour ' + fmt(pr) + '.'); save(); return null;
}
function sellNow(id) {
  const p = P(id); if (!p) return 'Introuvable'; if (G.players.length <= 9) return 'Il faut au moins 9 joueurs';
  const pr = Math.round(valueOf(p) * 0.75 / 10) * 10; G.budget += pr; G.players = G.players.filter((x) => x.id !== id); fitLineup(); if (G.captain === id) G.captain = G.players.slice().sort((a, b) => b.age - a.age)[0].id; if (G.penTaker === id) G.penTaker = G.lineup[G.lineup.length - 1]; news(p.name + ' vendu pour ' + fmt(pr) + '.'); save(); return null;
}
function upgradeCost(k) { const l = G.fac[k]; return l >= 5 ? null : Math.round(FAC[k].base * Math.pow(l + 1, 1.7) / 100) * 100; }
function upgrade(k) { const c = upgradeCost(k); if (c === null) return 'Niveau max'; if (G.budget < c) return 'Budget insuffisant'; G.budget -= c; G.fac[k]++; news(FAC[k].n + ' niveau ' + G.fac[k] + '.'); save(); return null; }
function staffCost(s) { return s.lvl >= 5 ? null : 2500 * s.lvl; }
function upgradeStaff(id) { const s = staff(id), c = staffCost(s); if (c === null) return 'Niveau max'; if (G.budget < c) return 'Budget insuffisant'; G.budget -= c; s.lvl++; save(); return null; }
