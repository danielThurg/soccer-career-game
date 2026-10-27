# Soccer Career Game

Jeu de gestion de soccer en 7 contre 7. Des joueurs fictifs avec des talents spéciaux.
Tu gères seulement : tactique, composition, entraînement, discussions. Les joueurs jouent seuls.

## Principes
- Format 7v7 : 1 gardien, 3 défenseurs, 2 milieux, 1 attaquant par défaut. Formations : 1-3-2-1, 1-2-3-1, 1-3-1-2, 1-2-2-2.
- Moral (court terme) et motivation (long terme, objectif personnel de chaque joueur).
- Talents liés au moral et à la fatigue. Chaque talent brille dans un rôle précis.
- Match simulé par zones (à construire).
- Orientation horizontale. Style chibi, avec quatre corpulences : Mince, Athlétique, Trapu, Costaud.

## Écrans (dossier `design/`)
Accueil au centre, quatre écrans autour. Palette reprise d'Everlivra.

| Écran | Fichier | Couleur |
|---|---|---|
| Accueil | HomeH.dc.html | crème #FFF0CD + brun #4B3527 |
| Effectif | EffectifH.dc.html | sauge #86AD78 |
| Tactique | TactiqueH.dc.html | or #F0C253 |
| Calendrier | CalendrierH.dc.html | bleu #438BC0 |
| Club | ClubH.dc.html | rose #DF9287 |
| Fiche joueur | CardH.dc.html | brun |
| Joueur chibi (composant) | Chibi.dc.html | n/a |

Encre #2B1D14, papier #FFFDF8, fond #FFF7EC, terrain #7FA077.

Les fichiers `.dc.html` s'ouvrent dans l'artifact Design de Claude (ils ont besoin de son moteur de rendu).

## Prochaines étapes
1. Simulation de match par zones.
2. Conversations pour gérer le moral.
3. Vrai code du jeu (hors maquettes).

## Jouer
Ouvre `index.html` dans un navigateur, de préférence sur téléphone en mode horizontal.
Le jeu fonctionne tout seul, sans serveur. La sauvegarde est dans le navigateur.

Ce qui est jouable : 5 écrans, 12 matchs par saison, match simulé par zones avec mi-temps tactique,
moral, fatigue, blessures, discussions avec les joueurs, entraînement, finances et installations.


## V3 — Simulation jour par jour (index.html)

- La partie avance **jour par jour** (bouton Continuer, vitesses ×1 ×2 ×4). Elle ne s'arrête que si un joueur ou ton staff t'écrit, pour une conférence de presse, un jour de match ou la fin de saison.
- **4 divisions de 10 équipes**, 18 matchs par saison (aller-retour). Les 2 premiers montent, les 2 derniers descendent. Tu commences en Division 4.
- **Coupe du Roi** : les 40 clubs, élimination directe (tour préliminaire, 32es, 16es, quarts), demi-finales aller-retour au cumul, finale. Tirs au but si égalité.
- **Notes dynamiques** : forme, moral, fatigue et temps de jeu font monter ou descendre la note. Un jeune qui joue progresse. Un buteur muet perd son moral.
- **Messages** : un joueur veut débuter, tirer les penaltys, a la rage d'être sorti, veut partir. Promesses à tenir.
- **Conférences de presse** : questions sur un joueur, l'objectif, l'adversaire.
- **Club** : équipement (couleurs, motif), staff (adjoint, physio, recruteur), transferts, stade personnalisable (pelouse, sièges, tribunes, loges VIP, éclairage, centre médical, boutique), finances.
- Les matchs à domicile se jouent dans **ton stade** avec tes couleurs.
- Sauvegarde automatique (localStorage, clé scg-save-v3). Le code source est dans `src/`, `python3 build.py` assemble `index.html`.
- `animations.html` : démo des scènes cinématiques (penalty, coup franc, carton rouge, trophée, blessure grave), pas encore branchées au jeu.

## Accès et publication

Le jeu dispose d'un menu principal et d'une installation sur l'écran d'accueil. La clé de sauvegarde de la V3 est `scg-save-v3` (l'ancienne V2 reste dans le navigateur, inchangée). Les sauvegardes restent propres au navigateur et à l'origine du lien.

`worker.mjs` sert la version autonome sur Cloudflare Workers, avec les icônes, le manifeste et le cache hors ligne. Pour publier une modification : `python3 build.py` (assemble `index.html` depuis `src/`), puis `node scripts/build-worker.mjs` et `npx wrangler deploy`.
