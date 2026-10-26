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

## Accès et publication

Le jeu dispose maintenant d’un menu principal, d’une interface mobile en portrait et en paysage, et d’une installation sur l’écran d’accueil. La clé de sauvegarde `scg-save-v2` est conservée. Les sauvegardes restent propres au navigateur et à l’origine du lien.

`worker.mjs` sert la version autonome sur Cloudflare Workers, avec les icônes, le manifeste et le cache hors ligne. Pour publier une modification : `node scripts/build-worker.mjs` puis `npx wrangler deploy`. Le déploiement exécute aussi automatiquement la génération.
