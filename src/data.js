/* ===== DATA ===== */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = (a, b) => a + Math.random() * (b - a);
const ri = (a, b) => Math.floor(rnd(a, b + 1));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const $ = (s) => document.querySelector(s);
const fmt = (n) => (n < 0 ? '−' : '') + Math.abs(Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' $';

const BM = { Mince: { spd: 10, tec: 2, phy: -14 }, 'Athlétique': { spd: 0, tec: 0, phy: 0 }, Trapu: { spd: -7, tec: 0, phy: 8 }, Costaud: { spd: -15, tec: -4, phy: 14 } };
const bLabel = (b) => b < 0.9 ? 'Mince' : b < 1.08 ? 'Athlétique' : b < 1.25 ? 'Trapu' : 'Costaud';
const bTone = (b) => b < 0.9 ? 'background:#CFE3E8;color:#1F4A5A' : b < 1.08 ? 'background:#D7E2CF;color:#263E23' : b < 1.25 ? 'background:#F3E0B0;color:#6B4A12' : 'background:#F2D6D3;color:#6B2A22';

const DIVS = [
  { n: 'Division 1', k: 'Élite', col: '#F0C253', fg: '#493118', price: 30, prize: 9000 },
  { n: 'Division 2', k: 'Promotion', col: '#C9CFD6', fg: '#2B3138', price: 20, prize: 5000 },
  { n: 'Division 3', k: 'Régionale', col: '#D9A878', fg: '#4B2A10', price: 12, prize: 3000 },
  { n: 'Division 4', k: 'Amateur', col: '#86AD78', fg: '#263E23', price: 8, prize: 1500 }
];
const TNAMES = [
  ['Real Métropole', 'Atlético Port-Royal', 'FC Lumière', 'Olympique Capitale', 'Sporting Aurore', 'Dynamo Bleu', 'Racing Ardent', 'United Citadelle', 'Stade Royal', 'Inter Fleuve'],
  ['Étoile Dorée', 'AC Montagne', 'Rovers Nord', 'FC Marée', 'Sporting Vallée', 'Union Boréale', 'CS Falaise', 'Athletic Delta', 'Phénix FC', 'Cosmos Est'],
  ['Les Faucons', 'FC Rivière', 'Union Sud', 'Étoile Verte', 'Olympique Est', 'Racing Plaine', 'AS Cèdres', 'FC Brume', 'Sporting Colline', 'Atlas United'],
  ['AS Nordville', 'Les Mouettes', 'FC Prairie', 'Stade Lac', 'US Moulin', 'AS Hameau', 'CS Pinède', 'FC Sablier', 'Olympique Gare', 'Racing Quartier']
];
const DBASE = [77, 67, 58, 49];
const KCOL = ['#C46A55', '#438BC0', '#F0C253', '#86AD78', '#DF9287', '#4B3527', '#2B1D14', '#FFF0CD', '#FFFAF0', '#7A5AA8', '#E08A3C', '#2F8F83', '#B23A3A', '#5E7A5A', '#1F4A7A', '#8A8F98'];
const KSTY = [['stripes', 'Rayures'], ['hoops', 'Cerceaux'], ['half', 'Moitié'], ['sash', 'Écharpe'], ['plain', 'Uni']];
const SURN = ['Moreau', 'Diallo', 'Costa', 'Lemay', 'Okoye', 'Silva', 'Petit', 'Haddad', 'Novak', 'Roy', 'Ferreira', 'Brun', 'Tessier', 'Ndiaye', 'Bélanger', 'Vega', 'Laurent', 'Mbaye', 'Sorel', 'Duval', 'Ortega', 'Kone', 'Fabre', 'Lopez', 'Girard', 'Nkosi', 'Rossi', 'Haas', 'Tanaka', 'Dubois'];
const FIRST = ['Adam', 'Basile', 'Cyril', 'Dario', 'Enzo', 'Félix', 'Gaël', 'Hugo', 'Ismaël', 'Jules', 'Karim', 'Lucas', 'Malo', 'Noah', 'Omar', 'Pablo', 'Quentin', 'Rémi', 'Sacha', 'Théo', 'Ugo', 'Victor', 'Wassim', 'Yann', 'Zack', 'Nico', 'Eliot', 'Amir', 'Louis', 'Matis', 'Ruben', 'Tiago'];
const SKIN = ['#F4DCC8', '#F1D1B8', '#E3BC98', '#D9A878', '#C49A6C', '#B97C52', '#7A4A2D', '#6E4228', '#5A3520'];
const HAIR = ['buzz', 'curly', 'slick', 'fringe', 'long', 'afro', 'mohawk', 'bald'];
const HCOL = ['#0F0A08', '#1C1410', '#3A2414', '#B5502A', '#D9B25A', '#14100E', '#6A625A'];
const BEARD = [undefined, undefined, 'stubble', 'goatee', 'full', 'stache'];
const randLook = () => { const hair = pick(HAIR), hc = pick(HCOL), bd = pick(BEARD); return { skin: pick(SKIN), hair, hc, beard: bd, bc: hc, freck: Math.random() < 0.1, gray: Math.random() < 0.06 }; };

const TAL = {
  chef: { n: 'Chef de défense', line: 'def', b: 6, t: 'Ses défenseurs jouent mieux, tant qu’il a le brassard.', ok: (p) => p.moral >= 45 && G.captain === p.id },
  sprint: { n: 'Sprint de feu', line: 'def', b: 4, t: 'Gagne les courses. Il lui faut de la confiance (moral 60+).', ok: (p) => p.moral >= 60 },
  lecture: { n: 'Lecture du jeu', line: 'def', b: 5, t: 'Anticipe les passes. Perd son don quand il est épuisé.', ok: (p) => p.fat < 60 },
  mur: { n: 'Mur humain', line: 'def', b: 5, t: 'Presque impossible à dribbler.', ok: (p) => p.moral >= 35 },
  moteur: { n: 'Moteur d’équipe', line: 'mid', b: 3, t: 'Inspiré, il fait monter le moral de tout le groupe.', ok: (p) => p.moral >= 55 },
  laser: { n: 'Passe laser', line: 'mid', b: 6, t: 'Trouve l’attaquant seul. Demande un moral de 55 ou plus.', ok: (p) => p.moral >= 55 },
  milieu: { n: 'Mur de milieu', line: 'mid', b: 5, t: 'Récupère presque tous les ballons au centre.', ok: (p) => p.moral >= 35 },
  finisseur: { n: 'Finisseur froid', line: 'att', b: 6, t: 'Marque sous pression. Pas de panique devant le but.', ok: (p) => p.moral >= 50 },
  contre: { n: 'Feu de contre', line: 'att', b: 7, t: 'Mortel en contre-attaque. Se bloque quand il est frustré.', ok: (p) => p.moral >= 40 },
  miracle: { n: 'Arrêt miracle', line: 'gk', b: 7, t: 'Sauve des ballons perdus.', ok: (p) => p.moral >= 45 },
  tireur: { n: 'Spécialiste penalty', line: 'att', b: 2, t: 'Ne tremble jamais depuis le point de penalty.', ok: (p) => p.moral >= 40 },
  vitesse: { n: 'Dribbleur fou', line: 'att', b: 5, t: 'Efface son vis-à-vis. Besoin de confiance.', ok: (p) => p.moral >= 50 }
};
const FM = { '1-3-2-1': [3, 2, 1], '1-2-3-1': [2, 3, 1], '1-3-1-2': [3, 1, 2], '1-2-2-2': [2, 2, 2] };
const FNOTE = { '1-3-2-1': 'Équilibré : solide derrière, une seule pointe.', '1-2-3-1': 'Milieu dense : plus de passes, moins de protection.', '1-3-1-2': 'Défense en béton, deux attaquants en contre.', '1-2-2-2': 'Très offensif : la défense paie le prix.' };
const MENT = {
  def: { n: 'Défensif', t: 'Défense +4, attaque −3.', d: 4, a: -3, m: 0, fat: 1 },
  eq: { n: 'Équilibré', t: 'Aucun bonus, aucune faiblesse.', d: 0, a: 0, m: 0, fat: 1 },
  off: { n: 'Offensif', t: 'Attaque +4, défense −3.', d: -3, a: 4, m: 0, fat: 1.05 },
  press: { n: 'Pressing', t: 'Milieu +4. Les joueurs se fatiguent 35 % plus.', d: 0, a: 0, m: 4, fat: 1.35 }
};
const TRAITS = { sensible: 'Sensible', fier: 'Fier', ambitieux: 'Ambitieux', loyal: 'Loyal' };
const TALK = {
  sensible: { enc: [12, 'Il sourit. Ça lui fait du bien.'], fer: [-8, 'Il baisse les yeux. Mauvaise approche.'], pro: [4, 'Il écoute, sans plus.'] },
  fier: { enc: [3, 'Il hausse les épaules.'], fer: [8, 'Il se redresse. Il respecte la franchise.'], pro: [5, 'Il acquiesce avec fierté.'] },
  ambitieux: { enc: [4, 'Il attend des actes.'], fer: [-4, 'Il serre la mâchoire.'], pro: [12, 'Ses yeux s’allument. Tu dois tenir parole.'] },
  loyal: { enc: [8, 'Il te remercie.'], fer: [5, 'Il accepte, sans rancune.'], pro: [6, 'Il te fait confiance.'] }
};
const MKP = (id, name, pos, age, num, build, look, st, pot, tal, trait, moral, fat, want, ex) => Object.assign({ id, name, pos, age, num, build, look, st, pot, tal, trait, moral, fat, want }, ex || {});
const P0 = [
  MKP('kofi', 'Kofi', 'GB', 29, 1, 1.3, { skin: '#6E4228', hair: 'bald', hc: '#0F0A08', beard: 'full', bc: '#26211D' }, { spd: 45, tec: 50, phy: 70, def: 40, att: 20, gk: 74 }, 77, 'miracle', 'loyal', 74, 15, 'Ne pas encaisser à domicile.', { eye: 1.05, kit: ['#5E7A5A', '#2F4A2E'], kitStyle: 'plain' }),
  MKP('rafa', 'Rafa', 'DEF', 31, 4, 1.12, { skin: '#B97C52', hair: 'slick', hc: '#1A1410', gray: true, beard: 'stubble', bc: '#1A1410' }, { spd: 55, tec: 58, phy: 70, def: 76, att: 40 }, 70, 'chef', 'fier', 70, 30, 'Finir sa carrière avec un titre.', { eye: 0.9 }),
  MKP('jb', 'JB', 'DEF', 22, 5, 0.82, { skin: '#F1D1B8', hair: 'curly', hc: '#B5502A', freck: true }, { spd: 62, tec: 60, phy: 58, def: 68, att: 42 }, 76, 'lecture', 'sensible', 61, 35, 'Jouer tous les matchs.', { eye: 1.1, ear: 1.35 }),
  MKP('mateo', 'Mateo', 'DEF', 19, 3, 0.8, { skin: '#F4DCC8', hair: 'fringe', hc: '#D9B25A', freck: true }, { spd: 72, tec: 55, phy: 58, def: 64, att: 45 }, 86, 'sprint', 'ambitieux', 74, 22, 'Signer son premier contrat pro.', { eye: 1.15 }),
  MKP('ibra', 'Ibra', 'DEF', 33, 2, 1.4, { skin: '#5A3520', hair: 'bald', hc: '#0F0A08', beard: 'goatee', bc: '#0F0A08' }, { spd: 50, tec: 48, phy: 74, def: 72, att: 35 }, 68, 'mur', 'loyal', 66, 50, 'Jouer jusqu’à 36 ans.'),
  MKP('yanis', 'Yanis', 'MIL', 25, 8, 1.18, { skin: '#D9A878', hair: 'curly', hc: '#1C1410', beard: 'stache', bc: '#1C1410' }, { spd: 62, tec: 70, phy: 64, def: 56, att: 62 }, 72, 'moteur', 'loyal', 85, 18, 'Garder le vestiaire uni.', { eye: 1.05 }),
  MKP('samir', 'Samir', 'MIL', 27, 6, 0.92, { skin: '#C49A6C', hair: 'long', hc: '#1C1410', beard: 'goatee', bc: '#1C1410' }, { spd: 64, tec: 78, phy: 55, def: 48, att: 66 }, 76, 'laser', 'sensible', 54, 40, 'Porter le brassard de capitaine.', { eye: 0.9 }),
  MKP('tomas', 'Tomás', 'MIL', 26, 10, 1.28, { skin: '#E3BC98', hair: 'buzz', hc: '#3A2414' }, { spd: 55, tec: 62, phy: 68, def: 68, att: 52 }, 70, 'milieu', 'fier', 62, 44, 'Devenir un leader.'),
  MKP('leo', 'Léo', 'ATT', 21, 9, 1.0, { skin: '#7A4A2D', hair: 'afro', hc: '#0F0A08', band: true, scar: true }, { spd: 70, tec: 68, phy: 60, def: 35, att: 76 }, 84, 'finisseur', 'ambitieux', 72, 28, 'Être meilleur buteur.'),
  MKP('diego', 'Diego', 'ATT', 24, 11, 0.95, { skin: '#D8B08A', hair: 'mohawk', hc: '#14100E', beard: 'stubble', bc: '#14100E' }, { spd: 68, tec: 66, phy: 58, def: 30, att: 72 }, 74, 'contre', 'fier', 38, 40, 'Être titulaire, sinon il part.', { eye: 0.8 }),
  MKP('theo', 'Théo', 'GB', 18, 12, 1.0, { skin: '#E3BC98', hair: 'fringe', hc: '#3A2414' }, { spd: 50, tec: 45, phy: 55, def: 35, att: 15, gk: 58 }, 80, null, 'sensible', 66, 10, 'Devenir titulaire un jour.', { eye: 1.12, kit: ['#5E7A5A', '#2F4A2E'], kitStyle: 'plain' }),
  MKP('nico', 'Nico', 'MIL', 17, 14, 0.78, { skin: '#C49A6C', hair: 'curly', hc: '#1C1410', freck: false }, { spd: 66, tec: 62, phy: 44, def: 42, att: 50 }, 88, 'vitesse', 'ambitieux', 70, 5, 'Prouver qu’il est prêt.', { eye: 1.2 })
];
const STAFF0 = [
  { id: 'adj', role: 'Entraîneur adjoint', name: 'Marco Delmas', look: { skin: '#E3BC98', hair: 'slick', hc: '#6A625A', gray: true, beard: 'stubble', bc: '#6A625A' }, lvl: 1, build: 1.1 },
  { id: 'phy', role: 'Physio', name: 'Amélie Roux', look: { skin: '#C49A6C', hair: 'long', hc: '#1C1410' }, lvl: 1, build: 0.9 },
  { id: 'rec', role: 'Recruteur', name: 'Boubacar Sy', look: { skin: '#6E4228', hair: 'buzz', hc: '#0F0A08', beard: 'goatee', bc: '#0F0A08' }, lvl: 1, build: 1.0 }
];
const STAFF_FX = { adj: 'Conseils tactiques plus fins et progression de l’équipe.', phy: 'Récupération plus rapide et moins de blessures.', rec: 'Meilleurs joueurs sur le marché des transferts.' };
const FAC = {
  pitch: { n: 'Pelouse', ico: '🌱', fx: 'Avantage à domicile, moins de blessures.', base: 2200 },
  cap: { n: 'Tribunes', ico: '🏟', fx: 'Plus de places, plus de recettes.', base: 3000 },
  vip: { n: 'Loges VIP', ico: '🥂', fx: 'Gros revenus à chaque match à domicile.', base: 3500 },
  lights: { n: 'Éclairage', ico: '💡', fx: 'Ambiance de nuit : plus de supporters.', base: 2500 },
  train: { n: 'Centre d’entraînement', ico: '🏋', fx: 'Les joueurs progressent plus vite.', base: 3200 },
  med: { n: 'Centre médical', ico: '✚', fx: 'La fatigue part plus vite, blessures plus courtes.', base: 3000 },
  shop: { n: 'Boutique', ico: '👕', fx: 'Revenus chaque semaine.', base: 2000 }
};
const CAPS = [0, 300, 700, 1500, 3000, 6000];
const PITCHC = ['#7FA077', '#5E9A5A', '#8FB86A', '#6B9A8A', '#A8B86A', '#4E8A52'];
const SEATC = ['#C46A55', '#438BC0', '#F0C253', '#86AD78', '#DF9287', '#4B3527', '#7A5AA8', '#FFF0CD'];
const PITCHS = [['stripes', 'Bandes'], ['checks', 'Damier'], ['diag', 'Diagonales'], ['plain', 'Unie']];
const CUPR = ['Tour préliminaire', '32es de finale', '16es de finale', 'Quarts de finale', 'Demi-finale (aller)', 'Demi-finale (retour)', 'Finale'];
const CUPW = { 0: 2, 1: 4, 2: 6, 3: 9, 4: 11, 5: 13, 6: 19 };
const NWEEKS = 19, SEND = 7 * NWEEKS;
const DAYN = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const dayName = (d) => DAYN[(d - 1) % 7];
const weekOf = (d) => Math.ceil(d / 7);

/* ---------- Rôles & consignes (par poste du onze) ----------
   dy : profondeur (+ = plus haut vers le but adverse), dx : largeur (vers la touche)
   fx : bonus aux lignes d'équipe à pleine adéquation, w : poids des stats pour l'adéquation,
   sh : tendance à tirer, side : réservé aux postes excentrés, tal : talents qui collent au rôle */
const ROLES = {
  GB: [
    { k: 'gk', n: 'Gardien', s: 'GB', d: 'Reste sur sa ligne et protège le but.', dy: 0, dx: 0, fx: {}, w: { gk: 1 }, sh: 0 },
    { k: 'sweep', n: 'Gardien-libéro', s: 'GB', d: 'Sort loin pour relancer et couvrir. Plus de passes, mais risque sur les ballons dans le dos.', dy: 14, dx: 0, fx: { mid: 1.6, def: 0.8 }, w: { gk: 0.6, tec: 0.4 }, sh: 0 }
  ],
  DEF: [
    { k: 'cb', n: 'Défenseur central', s: 'DF', d: 'Tient sa zone, dégage simple.', dy: 0, dx: 0, fx: { def: 1 }, w: { def: 0.6, phy: 0.4 }, sh: 0.3, tal: ['chef', 'mur'] },
    { k: 'stop', n: 'Stoppeur', s: 'STO', d: 'Monte presser le porteur. Gagne des ballons haut, mais laisse du vide derrière.', dy: 9, dx: 0, fx: { def: 1.8, mid: 0.8 }, w: { def: 0.45, phy: 0.35, spd: 0.2 }, sh: 0.3, tal: ['sprint', 'lecture'] },
    { k: 'lib', n: 'Libéro', s: 'LIB', d: 'Reste en couverture, derrière ses partenaires. Très sûr, peu de relances.', dy: -9, dx: 0, fx: { def: 2.4, att: -0.8 }, w: { def: 0.6, tec: 0.4 }, sh: 0.2, tal: ['lecture', 'chef'] },
    { k: 'wb', n: 'Latéral offensif', s: 'LAT↑', d: 'Monte sur toute la ligne de touche et centre. Soutient l’attaque, laisse son côté ouvert.', dy: 22, dx: 12, fx: { att: 1.8, mid: 1.4, def: -2 }, w: { spd: 0.4, tec: 0.35, phy: 0.25 }, sh: 0.7, side: true, tal: ['sprint', 'vitesse'] },
    { k: 'fb', n: 'Latéral prudent', s: 'LAT', d: 'Garde la ligne et ferme son couloir.', dy: 2, dx: 8, fx: { def: 1.4, mid: 0.4 }, w: { def: 0.55, spd: 0.25, phy: 0.2 }, sh: 0.3, side: true, tal: ['mur'] }
  ],
  MIL: [
    { k: 'rec', n: 'Récupérateur', s: 'REC', d: 'Reste devant la défense et coupe les passes. Ne monte presque jamais.', dy: -13, dx: 0, fx: { def: 2.4, mid: 0.6, att: -1.4 }, w: { def: 0.5, phy: 0.35, spd: 0.15 }, sh: 0.3, tal: ['milieu', 'lecture'] },
    { k: 'b2b', n: 'Box-to-box', s: 'B2B', d: 'Va-et-vient permanent. Complet, mais se fatigue plus.', dy: 0, dx: 0, fx: { mid: 1.6, def: 0.6, att: 0.6 }, w: { phy: 0.35, tec: 0.35, spd: 0.3 }, sh: 0.6, tal: ['moteur'], fat: 1.25 },
    { k: 'meneur', n: 'Meneur de jeu', s: 'MJ', d: 'Joue haut, entre les lignes. Crée les occasions, défend peu.', dy: 12, dx: 0, fx: { mid: 2, att: 1.6, def: -1.6 }, w: { tec: 0.6, att: 0.25, spd: 0.15 }, sh: 0.9, tal: ['laser'] },
    { k: 'wing', n: 'Ailier', s: 'AIL', d: 'Colle à la touche, centre et déborde.', dy: 8, dx: 20, fx: { att: 2, mid: 0.5, def: -1 }, w: { spd: 0.45, tec: 0.4, att: 0.15 }, sh: 0.8, side: true, tal: ['vitesse', 'sprint'] }
  ],
  ATT: [
    { k: 'st', n: 'Avant-centre', s: 'AC', d: 'Reste dans la surface, fixe les défenseurs.', dy: 0, dx: 0, fx: { att: 2 }, w: { att: 0.6, phy: 0.25, tec: 0.15 }, sh: 1.35, tal: ['finisseur'] },
    { k: 'n10', n: 'Numéro 10', s: 'N°10', d: 'Décroche pour toucher le ballon et lancer ses partenaires. Moins de tirs, plus de passes.', dy: -15, dx: 0, fx: { mid: 2, att: 0.6 }, w: { tec: 0.6, att: 0.25, spd: 0.15 }, sh: 0.7, tal: ['laser', 'vitesse'] },
    { k: 'fox', n: 'Renard des surfaces', s: 'REN', d: 'Attend le ballon au point de penalty. Presque rien d’autre.', dy: 6, dx: 0, fx: { att: 3, mid: -1 }, w: { att: 0.8, spd: 0.2 }, sh: 1.8, tal: ['finisseur', 'contre'] },
    { k: 'wide', n: 'Attaquant de côté', s: 'ATC', d: 'Joue large, rentre sur son pied fort.', dy: 3, dx: 20, fx: { att: 1.6, mid: 0.6 }, w: { spd: 0.4, tec: 0.35, att: 0.25 }, sh: 1, side: true, tal: ['vitesse', 'contre'] }
  ]
};
const INS_D = ['Retrait', 'Normal', 'Avancé'], INS_W = ['Axe', 'Normal', 'Large'];

const KGK = [['#5E7A5A', '#2F4A2E'], ['#F0C253', '#B8872E'], ['#DF9287', '#B23A3A'], ['#438BC0', '#1F4A7A'], ['#2B1D14', '#4B3527'], ['#7A5AA8', '#4B3478']];
const FACVIS = { pitch: 'Pelouse plus dense, moins de zones abîmées.', cap: 'Tribunes plus hautes, toit, puis tribunes latérales.', vip: 'Loges vitrées au-dessus de la tribune centrale.', lights: 'Pylônes supplémentaires : le stade s’allume.', train: 'Bâtiment plus haut et terrain d’entraînement agrandi.', med: 'Nouvelle aile médicale.', shop: 'Boutique plus grande et plus de drapeaux.' };
