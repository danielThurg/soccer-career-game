/* ===== Terrain vertical + animation de match ===== */
const PitchV = (() => {
  const FW = 68, FH = 105; let uid = 0;
  const SPEC = ['#4B3527', '#F0C253', '#438BC0', '#DF9287', '#FFF0CD', '#2B1D14', '#86AD78'];
  const hh = (i) => { let x = (i * 374761393 + 668265263) | 0; x = (x ^ (x >>> 13)) * 1274126177 | 0; return ((x ^ (x >>> 16)) >>> 0) / 4294967295; };
  const ringOf = (cap) => 2.4 + cap * 1.7;
  function kitBg(c, s) {
    if (s === 'stripes') return 'repeating-linear-gradient(90deg,' + c[0] + ' 0 5px,' + c[1] + ' 5px 8px)';
    if (s === 'hoops') return 'repeating-linear-gradient(0deg,' + c[0] + ' 0 5px,' + c[1] + ' 5px 8px)';
    if (s === 'half') return 'linear-gradient(90deg,' + c[0] + ' 50%,' + c[1] + ' 50%)';
    if (s === 'sash') return 'linear-gradient(135deg,' + c[0] + ' 0 38%,' + c[1] + ' 38% 62%,' + c[0] + ' 62%)';
    return c[0];
  }
  /* st : { pitch, ps, seat, seat2, cap, vip, lights, pq, fill, night } ; inner : html des jetons */
  function field(st, inner, o) {
    o = o || {}; const id = 'pv' + (++uid), r = ringOf(st.cap || 1), W = FW + 2 * r, H = FH + 2 * r;
    const c1 = st.pitch, c2 = shade(st.pitch, -16), seat = st.seat, dark = shade(seat, -50);
    let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;width:100%;height:100%;display:block" preserveAspectRatio="none">';
    s += '<defs><pattern id="' + id + 'd" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="12" fill="' + c2 + '"/></pattern></defs>';
    s += '<rect width="' + W + '" height="' + H + '" fill="' + seat + '" rx="3"/><rect x="' + (r * 0.55) + '" y="' + (r * 0.55) + '" width="' + (W - r * 1.1) + '" height="' + (H - r * 1.1) + '" fill="' + dark + '" opacity=".55" rx="2"/>';
    // spectateurs
    const fill = st.fill == null ? 0.7 : st.fill; let k = 0;
    const dot = (x, y) => { k++; if (hh(k + 7) < fill) s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + Math.min(1, r * 0.11).toFixed(2) + '" fill="' + SPEC[Math.floor(hh(k) * SPEC.length)] + '"/>'; };
    const rows = Math.max(1, Math.round(r / 3.4));
    for (let q = 0; q < rows; q++) { const d = r * (0.18 + 0.62 * (q + 0.5) / rows); for (let x = d; x < W - d; x += 2.6) { dot(x, d); dot(x + 1.3, H - d); } for (let y = d + 2.6; y < H - d - 2; y += 2.6) { dot(d, y); dot(W - d, y + 1.3); } }
    // VIP
    if (st.vip > 0) s += '<rect x="' + (r * 0.12) + '" y="' + (H * 0.38) + '" width="' + (r * 0.76) + '" height="' + (H * 0.24) + '" rx="1" fill="#CFE3E8" stroke="#F0C253" stroke-width=".7"/>' + [0, 1, 2].slice(0, 1 + st.vip).map((j) => '<rect x="' + (r * 0.2) + '" y="' + (H * 0.42 + j * H * 0.06) + '" width="' + (r * 0.6) + '" height="' + (H * 0.035) + '" fill="#F0C253" opacity=".8"/>').join('');
    // pelouse
    s += '<g transform="translate(' + r + ',' + r + ')"><rect width="' + FW + '" height="' + FH + '" fill="' + c1 + '"/>';
    if (st.ps === 'stripes') for (let i = 0; i < 14; i += 2) s += '<rect y="' + (i * FH / 14) + '" width="' + FW + '" height="' + (FH / 14) + '" fill="' + c2 + '"/>';
    else if (st.ps === 'checks') for (let i = 0; i < 14; i++) for (let j = 0; j < 6; j++) if ((i + j) % 2) s += '<rect x="' + (j * FW / 6) + '" y="' + (i * FH / 14) + '" width="' + (FW / 6) + '" height="' + (FH / 14) + '" fill="' + c2 + '"/>';
    else if (st.ps === 'diag') s += '<rect width="' + FW + '" height="' + FH + '" fill="url(#' + id + 'd)"/>';
    if ((st.pq || 3) <= 2) [[12, 92, 5, 2.4], [52, 14, 4, 2], [34, 56, 6, 2.5], [56, 86, 4, 2]].slice(0, 4 - (st.pq || 3) + 1).forEach((e) => { s += '<ellipse cx="' + e[0] + '" cy="' + e[1] + '" rx="' + e[2] + '" ry="' + e[3] + '" fill="#9A8456" opacity=".55"/>'; });
    s += '<g stroke="#FFFDF8" stroke-width=".55" fill="none" opacity=".9"><rect width="' + FW + '" height="' + FH + '"/><line x1="0" y1="52.5" x2="' + FW + '" y2="52.5"/><circle cx="34" cy="52.5" r="9.15"/><rect x="13.85" y="0" width="40.3" height="16.5"/><rect x="13.85" y="88.5" width="40.3" height="16.5"/><rect x="24.85" y="0" width="18.3" height="5.5"/><rect x="24.85" y="99.5" width="18.3" height="5.5"/><path d="M26.7 16.5 A9.15 9.15 0 0 0 41.3 16.5"/><path d="M26.7 88.5 A9.15 9.15 0 0 1 41.3 88.5"/><rect x="30.5" y="-2" width="7" height="2" stroke-width=".7"/><rect x="30.5" y="105" width="7" height="2" stroke-width=".7"/></g><circle cx="34" cy="52.5" r=".7" fill="#FFFDF8"/><circle cx="34" cy="11" r=".6" fill="#FFFDF8"/><circle cx="34" cy="94" r=".6" fill="#FFFDF8"/></g>';
    // projecteurs
    const nl = !st.lights ? 0 : st.lights <= 2 ? 2 : 4, lit = o.night || st.night || st.on;
    [[1.4, 1.4], [W - 1.4, H - 1.4], [W - 1.4, 1.4], [1.4, H - 1.4]].slice(0, nl).forEach((p) => { s += (lit ? '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="#FFF6D8" opacity=".35"/>' : '') + '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.3" fill="' + (lit ? '#FFF6D8' : '#C9CFD6') + '" stroke="#2B1D14" stroke-width=".4"/>'; });
    if (st.night || o.night) s += '<rect width="' + W + '" height="' + H + '" fill="#0A1020" opacity=".18"/>';
    s += '</svg>';
    return '<div class="pv' + (o.cls ? ' ' + o.cls : '') + '" style="aspect-ratio:' + W.toFixed(2) + '/' + H.toFixed(2) + (o.style ? ';' + o.style : '') + '">' + s + '<div class="pf" style="left:' + (r / W * 100).toFixed(3) + '%;top:' + (r / H * 100).toFixed(3) + '%;right:' + (r / W * 100).toFixed(3) + '%;bottom:' + (r / H * 100).toFixed(3) + '%">' + inner + '</div></div>';
  }
  function tok(o) {
    const c = o.col, bg = kitBg(c, o.ks || 'plain');
    return '<div class="tk2' + (o.cls ? ' ' + o.cls : '') + '" ' + (o.id != null ? 'data-id="' + o.id + '" ' : '') + (o.a ? 'data-a="' + o.a + '" data-i="' + o.i + '" ' : '') + 'style="left:' + o.x.toFixed(1) + '%;top:' + o.y.toFixed(1) + '%"><span class="b" style="background:' + bg + ';color:' + (o.ks === 'plain' || !o.ks ? c[1] : '#FFF') + '">' + (o.num != null ? o.num : '') + '</span><span class="nm">' + o.name + '</span>' + (o.sub ? '<span class="rl">' + o.sub + '</span>' : '') + '</div>';
  }
  return { field, tok, kitBg, FW, FH };
})();

/* ---------- Animation du match : jetons nommés, passes, tirs ---------- */
const MA = (() => {
  let root = null, K = null, id = 0, spd = 1, ball = null;
  const oform = () => Object.keys(FM)[M.opp % 4];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms / spd));
  const ok = () => root && root.isConnected;
  function toks() {
    const mine = G.lineup.map((pid, i) => { const p = P(pid); return p ? { i, id: pid, name: p.name, num: p.num, gk: i === 0 } : null; });
    const mi = M.mine.map((pid, i) => { const p = P(pid); return { i, id: pid, name: p.name, num: p.num, gk: i === 0 }; });
    void mine; return mi;
  }
  function ours() { return M.mine.map((pid, i) => { const p = P(pid); return { side: 'u', i, id: pid, name: p.name, num: p.num, gk: i === 0 }; }); }
  function theirs() { const ot = T(M.opp); return ot.names.map((n, i) => ({ side: 'o', i, id: 'o' + i, name: n, num: i === 0 ? 1 : i + 1, gk: i === 0 })); }
  function base(t) {
    if (t.side === 'u') { const q = slotXY(t.i); return { x: q.x, y: q.y }; }
    const r = rowOf(t.i, oform()); return { x: r.cat === 'GB' ? 50 : clamp(r.x + 11, 10, 90), y: 100 - r.y - (r.cat === 'MIL' ? 7 : 0) + (r.cat === 'GB' ? 2 : 0) };
  }
  function html(st) {
    const ot = T(M.opp), cu = G.kit.c, co = ot.col, parts = [];
    ours().forEach((t) => { const b = base(t); parts.push(PitchV.tok({ id: 'u' + t.i, x: b.x, y: b.y, name: t.name, num: t.num, col: t.gk ? G.kit.g : cu, ks: t.gk ? 'plain' : G.kit.s, cls: 'mine' })); });
    theirs().forEach((t) => { const b = base(t); parts.push(PitchV.tok({ id: 'o' + t.i, x: b.x, y: b.y, name: t.name, num: t.num, col: t.gk ? ['#8A8F98', '#4B4F57'] : co, ks: t.gk ? 'plain' : 'stripes', cls: 'opp' })); });
    parts.push('<div class="bl2" id="mBall" style="left:50%;top:50%"></div>');
    return PitchV.field(st, parts.join(''), { cls: 'mpv', night: st.night });
  }
  function attach(el) {
    root = el; K = { u: [], o: [] };
    ours().forEach((t) => { K.u.push(Object.assign({ el: root.querySelector('[data-id="u' + t.i + '"]') }, t)); });
    theirs().forEach((t) => { K.o.push(Object.assign({ el: root.querySelector('[data-id="o' + t.i + '"]') }, t)); });
    ball = root.querySelector('#mBall'); id++;
    lay('M', 50, 0.4);
  }
  /* mise en place : l'équipe qui a le ballon monte, l'autre recule ; tout suit le ballon sur la largeur */
  function lay(side, bx, jit) {
    if (!ok()) return;
    K.u.forEach((t) => {
      const b = base(t), g = t.gk ? 0.25 : 1;
      const push = side === 'U' ? -7 : side === 'O' ? 4 : 0;
      t.x = clamp(b.x + (bx - 50) * 0.14 + rnd(-1, 1) * (jit == null ? 1.2 : jit * 3), 4, 96); t.y = clamp(b.y + push * g + rnd(-1, 1) * (jit == null ? 1.2 : jit * 3), 3, 98);
      t.el.style.left = t.x + '%'; t.el.style.top = t.y + '%';
    });
    K.o.forEach((t) => {
      const b = base(t), g = t.gk ? 0.25 : 1;
      const push = side === 'O' ? 7 : side === 'U' ? -4 : 0;
      t.x = clamp(b.x + (bx - 50) * 0.14 + rnd(-1, 1) * (jit == null ? 1.2 : jit * 3), 4, 96); t.y = clamp(b.y + push * g + rnd(-1, 1) * (jit == null ? 1.2 : jit * 3), 3, 98);
      t.el.style.left = t.x + '%'; t.el.style.top = t.y + '%';
    });
  }
  const mv = (x, y) => { if (ball) { ball.style.left = x + '%'; ball.style.top = y + '%'; } };
  const hold = (t, on) => { K.u.concat(K.o).forEach((x) => x.el.classList.remove('has')); if (on) t.el.classList.add('has'); };
  function fwd(t, us) { return us ? 100 - t.y : t.y; }
  async function entry(en, my) {
    const us = en.us, A = us ? K.u : K.o, D = us ? K.o : K.u, side = us ? 'U' : 'O';
    const byWho = (arr, w) => arr.find((t) => t.id === w || t.name === w) || null;
    let shooter = byWho(A, en.who);
    if (!shooter) shooter = A.filter((t) => !t.gk).sort((a, b) => fwd(b, us) - fwd(a, us))[0];
    let cur = pickStart(A, us); lay(side, cur.x); hold(cur, true); mv(cur.x, cur.y); await sleep(260); if (my !== id) return;
    const steps = en.res === 'lost' && en.st === 'mid' ? 2 : 3 + (Math.random() < 0.5 ? 1 : 0);
    for (let s = 0; s < steps; s++) {
      let nx;
      if (s === steps - 1 && en.res !== 'lost') nx = shooter;
      else if (s === steps - 1) nx = null;
      else { const c = A.filter((t) => t !== cur && !t.gk && fwd(t, us) > fwd(cur, us) - 3); const pool = c.length ? c : A.filter((t) => t !== cur && !t.gk); nx = pool.length ? pool[Math.floor(Math.random() * pool.length)] : shooter; }
      if (!nx) break; if (nx === cur) nx = A.find((t) => t !== cur && !t.gk);
      lay(side, nx.x); cur = nx; hold(cur, true); mv(cur.x, cur.y); await sleep(300); if (my !== id) return;
    }
    if (en.res === 'lost') {
      const ic = en.st === 'mid' ? (byWho(D, en.who) || D.filter((t) => !t.gk)[0]) : (byWho(D, en.who) && D.filter((t) => !t.gk && fwd(t, !us) > 40)[0]) || D.filter((t) => !t.gk)[0];
      const it = ic || D[1]; lay(us ? 'O' : 'U', it.x); hold(it, true); mv(it.x, it.y); root.classList.add('turn'); await sleep(420); root.classList.remove('turn'); return;
    }
    const gkD = D[0]; const gy = us ? -2.5 : 102.5;
    hold(shooter, false); root.classList.add('shot');
    if (en.res === 'goal') { mv(clamp(shooter.x + rnd(-14, 14), 38, 62), gy); await sleep(300); root.classList.add('goal'); gkD.el.style.left = clamp(gkD.x + rnd(-10, 10), 30, 70) + '%'; await sleep(900); root.classList.remove('goal'); lay('M', 50, 0.4); mv(50, 50); }
    else if (en.res === 'save') { mv(gkD.x + rnd(-3, 3), gkD.y + (us ? 1 : -1)); gkD.el.style.left = clamp(shooter.x, 38, 62) + '%'; await sleep(420); hold(gkD, true); await sleep(250); }
    else { mv(clamp(shooter.x + (shooter.x > 50 ? 16 : -16), 14, 86), us ? -4 : 104); await sleep(380); mv(gkD.x, gkD.y); hold(gkD, true); await sleep(250); }
    root.classList.remove('shot');
    if (ok()) lay(us ? 'O' : 'U', 50);
  }
  function pickStart(A, us) {
    const c = A.filter((t) => !t.gk && fwd(t, us) < 62); const pool = c.length ? c : A;
    if (Math.random() < 0.12) return A[0];
    return pool[Math.floor(Math.random() * pool.length)];
  }
  async function block(seq, speed) {
    spd = speed || 1; const my = ++id; if (!ok()) return;
    const list = (seq || []).filter((e) => e.res !== 'pen' && e.res !== 'fk');
    if (!list.length) { lay(M.ball === 'O' ? 'O' : 'U', 50 + rnd(-20, 20)); await sleep(500); return; }
    for (const e of list.slice(0, 2)) { if (my !== id || !ok()) return; try { await entry(e, my); } catch (x) { /* dom retiré */ } }
  }
  const stop = () => { id++; };
  return { html, attach, block, stop, lay };
})();
