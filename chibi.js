/* Chibi renderer. Modes: full | head | bust | rig.
   p: {num,build,look{skin,hair,hc,beard,bc,gray,band,scar,freck},kit[2],kitStyle,eye,ear,pos,captain,inj}
   rig mode returns an SVG with groups .legL .legR .armL .armR .torso .head that can be rotated.
   Left parts rotate positive to swing outward, right parts negative. */
const INK = '#2B1D14';
function chibi(p, mode, mood) {
  mode = mode || 'full'; mood = mood || 'neutral';
  const b = p.build || 1, L = p.look, kit = p.kit || ['#C46A55', '#FFF0CD'];
  const hr = 20 + (b - 0.75) * 9, hy = 44, cx = 50, ry = 25;
  const tw = 15 + (b - 0.75) * 17, legW = 10 + (b - 0.75) * 4, armW = 9 + (b - 0.75) * 4;
  const hc = L.hc, sk = L.skin;
  const st = 'stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"';
  const st18 = st.replace('2.4', '1.8');
  let back = '', legL = '', legR = '', armL = '', armR = '', torso = '', head = '';
  if (L.hair === 'afro') back += '<circle cx="50" cy="' + (hy - 6) + '" r="' + (hr + 9) + '" fill="' + hc + '" ' + st + '/>';
  if (L.hair === 'long') back += '<path d="M' + (cx - hr - 3) + ' ' + (hy - 8) + ' Q' + (cx - hr - 7) + ' ' + (hy + 30) + ' ' + (cx - hr + 4) + ' ' + (hy + 36) + ' L' + (cx + hr - 4) + ' ' + (hy + 36) + ' Q' + (cx + hr + 7) + ' ' + (hy + 30) + ' ' + (cx + hr + 3) + ' ' + (hy - 8) + 'Z" fill="' + hc + '" ' + st + '/>';
  const lx = cx - legW - 3, rx = cx + 3;
  const leg = (x) => '<rect x="' + x + '" y="124" width="' + legW + '" height="26" rx="4" fill="' + sk + '" ' + st + '/><rect x="' + x + '" y="136" width="' + legW + '" height="14" rx="3" fill="' + kit[0] + '" ' + st + '/><ellipse cx="' + (x + legW / 2) + '" cy="152" rx="9" ry="4" fill="' + INK + '"/>';
  legL = leg(lx); legR = leg(rx);
  const alx = cx - tw - armW + 2, arx = cx + tw - 2;
  const arm = (x, band, glove) => '<rect x="' + x + '" y="88" width="' + armW + '" height="28" rx="5" fill="' + sk + '" ' + st + '/><rect x="' + x + '" y="86" width="' + armW + '" height="11" rx="4" fill="' + kit[0] + '" ' + st + '/>' + (band ? '<rect x="' + x + '" y="100" width="' + armW + '" height="5" fill="#F0C253" ' + st + '/>' : '') + (glove ? '<circle cx="' + (x + armW / 2) + '" cy="118" r="6.5" fill="#F0C253" ' + st + '/>' : '');
  armL = arm(alx, p.captain, p.pos === 'GB'); armR = arm(arx, false, p.pos === 'GB');
  torso += '<rect x="' + (cx - tw) + '" y="80" width="' + (tw * 2) + '" height="48" rx="12" fill="' + kit[0] + '" ' + st + '/>';
  if (p.kitStyle !== 'plain') for (let i = -1; i <= 1; i += 2) torso += '<line x1="' + (cx + i * tw * 0.35) + '" y1="86" x2="' + (cx + i * tw * 0.35) + '" y2="124" stroke="' + kit[1] + '" stroke-width="4" opacity=".9"/>';
  torso += '<rect x="' + (cx - tw + 1) + '" y="118" width="' + (tw * 2 - 2) + '" height="14" rx="5" fill="' + kit[1] + '" ' + st + '/>';
  torso += '<text x="50" y="108" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="' + (b > 1.2 ? 15 : 13) + '" fill="' + kit[1] + '">' + (p.num || '') + '</text>';
  // head
  if (b > 1.2) head += '<ellipse cx="' + cx + '" cy="' + (hy + 7) + '" rx="' + (hr + 2) + '" ry="' + (ry - 3) + '" fill="' + sk + '" ' + st + '/>';
  head += '<circle cx="' + (cx - hr - 1) + '" cy="' + (hy + 3) + '" r="' + (4.5 * (p.ear || 1)) + '" fill="' + sk + '" ' + st + '/><circle cx="' + (cx + hr + 1) + '" cy="' + (hy + 3) + '" r="' + (4.5 * (p.ear || 1)) + '" fill="' + sk + '" ' + st + '/>';
  head += '<ellipse cx="' + cx + '" cy="' + hy + '" rx="' + hr + '" ry="' + ry + '" fill="' + sk + '" ' + st + '/>';
  if (L.beard === 'full') head += '<path d="M' + (cx - hr + 1) + ' ' + (hy + 4) + ' Q' + (cx - hr - 1) + ' ' + (hy + ry + 5) + ' ' + cx + ' ' + (hy + ry + 5) + ' Q' + (cx + hr + 1) + ' ' + (hy + ry + 5) + ' ' + (cx + hr - 1) + ' ' + (hy + 4) + ' Q' + cx + ' ' + (hy + 14) + ' ' + (cx - hr + 1) + ' ' + (hy + 4) + 'Z" fill="' + L.bc + '" ' + st + '/>';
  if (L.beard === 'goatee') head += '<ellipse cx="' + cx + '" cy="' + (hy + 20) + '" rx="8" ry="6" fill="' + L.bc + '"/>';
  if (L.beard === 'stubble') head += '<path d="M' + (cx - hr + 3) + ' ' + (hy + 8) + ' Q' + cx + ' ' + (hy + ry + 4) + ' ' + (cx + hr - 3) + ' ' + (hy + 8) + ' Q' + cx + ' ' + (hy + 14) + ' ' + (cx - hr + 3) + ' ' + (hy + 8) + 'Z" fill="' + INK + '" opacity=".22"/>';
  const top = (low, extra) => '<path d="M' + (cx - hr - 1) + ' ' + (hy - 3) + ' A' + (hr + 1) + ' ' + (ry + 3) + ' 0 0 1 ' + (cx + hr + 1) + ' ' + (hy - 3) + ' Q' + cx + ' ' + (hy - low) + ' ' + (cx - hr - 1) + ' ' + (hy - 3) + 'Z" fill="' + (L.gray ? '#BDB6AE' : hc) + '" ' + st + '/>' + (extra || '');
  if (L.hair === 'buzz') head += '<path d="M' + (cx - hr + 1) + ' ' + (hy - 6) + ' A' + hr + ' ' + (ry + 1) + ' 0 0 1 ' + (cx + hr - 1) + ' ' + (hy - 6) + ' Q' + cx + ' ' + (hy - 15) + ' ' + (cx - hr + 1) + ' ' + (hy - 6) + 'Z" fill="' + hc + '" opacity=".85"/>';
  else if (L.hair === 'slick') head += top(17, '<path d="M' + (cx - hr + 4) + ' ' + (hy - 18) + ' Q' + cx + ' ' + (hy - 24) + ' ' + (cx + hr - 3) + ' ' + (hy - 14) + '" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>');
  else if (L.hair === 'fringe') head += top(8, '');
  else if (L.hair === 'long') head += top(12, '');
  else if (L.hair === 'curly') { head += top(14, ''); for (let i = -2; i <= 2; i++) head += '<circle cx="' + (cx + i * (hr / 2.4)) + '" cy="' + (hy - ry + (Math.abs(i) > 1 ? 6 : 0)) + '" r="7" fill="' + hc + '" ' + st + '/>'; }
  else if (L.hair === 'mohawk') head += '<path d="M' + (cx - 6) + ' ' + (hy - 6) + ' L' + (cx - 5) + ' ' + (hy - ry - 11) + ' L' + (cx + 5) + ' ' + (hy - ry - 11) + ' L' + (cx + 6) + ' ' + (hy - 6) + 'Z" fill="' + hc + '" ' + st + '/>';
  else if (L.hair === 'afro') head += '<path d="M' + (cx - hr + 2) + ' ' + (hy - 6) + ' Q' + cx + ' ' + (hy - 20) + ' ' + (cx + hr - 2) + ' ' + (hy - 6) + ' Q' + cx + ' ' + (hy - 12) + ' ' + (cx - hr + 2) + ' ' + (hy - 6) + 'Z" fill="' + hc + '"/>';
  else if (L.hair === 'bald') head += '<path d="M' + (cx - 9) + ' ' + (hy - 19) + ' Q' + cx + ' ' + (hy - 23) + ' ' + (cx + 5) + ' ' + (hy - 20) + '" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>';
  if (L.band) head += '<rect x="' + (cx - hr) + '" y="' + (hy - 15) + '" width="' + (hr * 2) + '" height="7" fill="#DF9287" ' + st + '/>';
  // face
  const ex = hr * 0.42, ey = hy + 3;
  const open = mood === 'laugh' ? 0.85 : mood === 'happy' ? 0.95 : mood === 'shock' ? 1.2 : 1;
  const tired = mood === 'tired', hurt = mood === 'hurt' || mood === 'pain', angry = mood === 'angry';
  for (let i = -1; i <= 1; i += 2) {
    const x = cx + i * ex;
    head += '<ellipse cx="' + x + '" cy="' + ey + '" rx="' + (5.2 * (p.eye || 1)) + '" ry="' + (5.8 * (p.eye || 1) * open) + '" fill="#fff" ' + st18 + '/>';
    if (mood === 'pain') head += '<path d="M' + (x - 5) + ' ' + (ey - 2) + ' L' + (x + 5) + ' ' + (ey + 2) + 'M' + (x - 5) + ' ' + (ey + 2) + ' L' + (x + 5) + ' ' + (ey - 2) + '" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>';
    else head += '<circle cx="' + (x + (mood === 'focus' ? i * -0.6 : 0)) + '" cy="' + (ey + (tired ? 1.5 : 0.4)) + '" r="' + (mood === 'shock' ? 2.2 : 2.9) + '" fill="' + (L.eye || INK) + '"/><circle cx="' + (x - 1) + '" cy="' + (ey - 1) + '" r="1" fill="#fff"/>';
    if (tired) head += '<path d="M' + (x - 6) + ' ' + (ey - 1) + ' L' + (x + 6) + ' ' + (ey - 1) + ' L' + (x + 6) + ' ' + (ey - 7) + ' L' + (x - 6) + ' ' + (ey - 7) + 'Z" fill="' + sk + '"/><path d="M' + (x - 6) + ' ' + (ey - 1) + ' L' + (x + 6) + ' ' + (ey - 1) + '" stroke="' + INK + '" stroke-width="1.8"/>';
    const by = ey - 9;
    let bd;
    if (mood === 'focus' || angry) bd = 'M' + (x - 6) + ' ' + (by + (i < 0 ? -1 : 2.5)) + ' L' + (x + 6) + ' ' + (by + (i < 0 ? 2.5 : -1));
    else if (hurt) bd = 'M' + (x - 6) + ' ' + (by + (i < 0 ? 2 : -2)) + ' L' + (x + 6) + ' ' + (by + (i < 0 ? -2 : 2));
    else if (mood === 'shock') bd = 'M' + (x - 6) + ' ' + (by - 3) + ' Q' + x + ' ' + (by - 7) + ' ' + (x + 6) + ' ' + (by - 3);
    else if (mood === 'laugh' || mood === 'happy') bd = 'M' + (x - 6) + ' ' + (by + 1) + ' Q' + x + ' ' + (by - 4) + ' ' + (x + 6) + ' ' + (by + 1);
    else bd = 'M' + (x - 6) + ' ' + by + ' L' + (x + 6) + ' ' + by;
    head += '<path d="' + bd + '" fill="none" stroke="' + (L.gray ? '#6A625A' : (hc === '#0F0A08' ? INK : hc)) + '" stroke-width="2.8" stroke-linecap="round"/>';
  }
  const my = hy + 16, mc = L.beard === 'full' ? '#FFF0CD' : INK;
  if (mood === 'laugh') head += '<path d="M' + (cx - 8) + ' ' + (my - 2) + ' Q' + cx + ' ' + (my + 12) + ' ' + (cx + 8) + ' ' + (my - 2) + 'Z" fill="#7A2E2E" stroke="' + mc + '" stroke-width="2" stroke-linejoin="round"/>';
  else if (mood === 'shock') head += '<ellipse cx="' + cx + '" cy="' + (my + 2) + '" rx="4" ry="5.5" fill="#7A2E2E" stroke="' + mc + '" stroke-width="2"/>';
  else if (mood === 'angry' || mood === 'pain') head += '<path d="M' + (cx - 7) + ' ' + (my + 3) + ' Q' + cx + ' ' + (my - 4) + ' ' + (cx + 7) + ' ' + (my + 3) + 'Z" fill="#7A2E2E" stroke="' + mc + '" stroke-width="2" stroke-linejoin="round"/>';
  else if (mood === 'happy') head += '<path d="M' + (cx - 7) + ' ' + my + ' Q' + cx + ' ' + (my + 8) + ' ' + (cx + 7) + ' ' + my + '" fill="none" stroke="' + mc + '" stroke-width="2.4" stroke-linecap="round"/>';
  else if (hurt) head += '<path d="M' + (cx - 6) + ' ' + (my + 3) + ' Q' + cx + ' ' + (my - 3) + ' ' + (cx + 6) + ' ' + (my + 3) + '" fill="none" stroke="' + mc + '" stroke-width="2.4" stroke-linecap="round"/>';
  else head += '<path d="M' + (cx - 5) + ' ' + (my + 1) + ' L' + (cx + 5) + ' ' + (my + 1) + '" stroke="' + mc + '" stroke-width="2.4" stroke-linecap="round"/>';
  if (L.beard === 'stache') head += '<path d="M' + (cx - 10) + ' ' + (hy + 12) + ' Q' + (cx - 5) + ' ' + (hy + 8) + ' ' + cx + ' ' + (hy + 12) + ' Q' + (cx + 5) + ' ' + (hy + 8) + ' ' + (cx + 10) + ' ' + (hy + 12) + ' Q' + cx + ' ' + (hy + 17) + ' ' + (cx - 10) + ' ' + (hy + 12) + 'Z" fill="' + L.bc + '" ' + st.replace('2.4', '1.2') + '/>';
  if (L.freck) for (let i = -1; i <= 1; i += 2) head += '<circle cx="' + (cx + i * 12) + '" cy="' + (hy + 9) + '" r="1.1" fill="#B5502A"/><circle cx="' + (cx + i * 8) + '" cy="' + (hy + 11) + '" r="1.1" fill="#B5502A"/><circle cx="' + (cx + i * 15) + '" cy="' + (hy + 11) + '" r="1.1" fill="#B5502A"/>';
  if (L.scar) head += '<path d="M' + (cx + 8) + ' ' + (hy - 13) + ' L' + (cx + 13) + ' ' + (hy - 5) + '" stroke="#B23A3A" stroke-width="2" stroke-linecap="round"/>';
  if (p.inj > 0) head += '<rect x="' + (cx - 10) + '" y="' + (hy - 16) + '" width="20" height="8" rx="2" transform="rotate(-8 ' + cx + ' ' + (hy - 12) + ')" fill="#F4DCC8" ' + st18 + '/>';
  if (mood === 'pain') head += '<path d="M' + (cx + hr - 2) + ' ' + (hy - 4) + ' q3 5 0 9 q-3 -4 0 -9z" fill="#CFE3E8" stroke="' + INK + '" stroke-width="1.2"/>';
  const wrapHead = '<g class="head" style="transform-origin:50px 80px">' + back + head + '</g>';
  const X = 'xmlns="http://www.w3.org/2000/svg" aria-hidden="true"';
  if (mode === 'rig') {
    return '<svg viewBox="0 0 100 158" ' + X + ' style="overflow:visible"><g class="legL" style="transform-origin:' + (lx + legW / 2) + 'px 126px">' + legL + '</g><g class="legR" style="transform-origin:' + (rx + legW / 2) + 'px 126px">' + legR + '</g><g class="armL" style="transform-origin:' + (alx + armW / 2) + 'px 91px">' + armL + '</g><g class="armR" style="transform-origin:' + (arx + armW / 2) + 'px 91px">' + armR + '</g><g class="torso" style="transform-origin:50px 124px">' + torso + '</g>' + wrapHead + '</svg>';
  }
  if (mode === 'full') return '<svg viewBox="0 0 100 158" preserveAspectRatio="xMidYMax meet" ' + X + '>' + back + legL + legR + armL + armR + torso + head + '</svg>';
  if (mode === 'bust') return '<svg viewBox="8 14 84 98" preserveAspectRatio="xMidYMax meet" ' + X + '><g>' + armL + armR + torso + '</g>' + back + head + '</svg>';
  return '<svg viewBox="6 ' + (hy - ry - 12) + ' 88 ' + (ry * 2 + 28) + '" preserveAspectRatio="xMidYMax meet" ' + X + '>' + back + head + '</svg>';
}
