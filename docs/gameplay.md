Je développe un puzzle game appelé "Dot Connect" avec Cocos Creator 3.8
en TypeScript. Je vais te décrire le game design complet, les mécaniques,
et les edge cases à gérer. Génère le code complet structuré.

=== GAME DESIGN ===

CONCEPT:
Une grille NxN contient des nœuds numérotés placés à des positions fixes.
Le joueur trace un chemin continu au drag/swipe qui doit:
1. Partir du nœud numéro 1
2. Passer par chaque nœud numéroté dans l'ordre croissant (1→2→3→...→N)
3. Remplir TOUTES les cellules de la grille sans exception
4. Ne jamais se croiser ou repasser sur une cellule déjà visitée

VICTOIRE: Tous les nœuds touchés dans l'ordre + toutes les cellules remplies.
ECHEC: Pas d'échec forcé — le joueur peut reset ou undo à tout moment.

=== STRUCTURE DE DONNÉES ===

Un niveau est défini en JSON:
{
"id": 1,
"gridSize": 7,
"nodes": [
{"number": 1, "row": 3, "col": 3},
{"number": 2, "row": 1, "col": 1},
{"number": 3, "row": 5, "col": 5},
{"number": 4, "row": 6, "col": 0},
{"number": 5, "row": 6, "col": 6},
{"number": 6, "row": 0, "col": 6},
{"number": 7, "row": 0, "col": 0},
{"number": 8, "row": 4, "col": 4},
{"number": 9, "row": 2, "col": 2}
]
}

=== MÉCANIQUES DÉTAILLÉES ===

INPUT:
- Touch/mouse down sur le nœud 1 → démarre le chemin
- Drag continu → étend le chemin cellule par cellule
- Le chemin se déplace uniquement vers les 4 cellules adjacentes
  (haut, bas, gauche, droite) — pas de diagonale
- Touch/mouse up → arrête le tracé (ne valide pas automatiquement)
- Si le joueur drag en arrière sur la cellule précédente → undo
  de la dernière cellule (retract path)

VALIDATION EN TEMPS RÉEL:
- Si le joueur arrive sur un nœud numéroté:
    - Si c'est le prochain numéro attendu → accepté, nextExpectedNode++
    - Si c'est un numéro incorrect → le chemin s'arrête,
      impossble de continuer dans cette direction
- Le joueur NE PEUT PAS passer sur une cellule déjà visitée
  (sauf retract)

VICTOIRE DÉTECTÉE QUAND:
- nextExpectedNode > totalNodes (tous les nœuds touchés dans l'ordre)
- visitedCells.size === gridSize * gridSize (toutes les cellules couvertes)
- Ces deux conditions doivent être vraies simultanément

=== RENDU VISUEL ===

CELLULES:
- Vide: blanc/gris clair
- Visitée: vert clair avec opacité
- Nœud numéroté: cercle vert foncé avec numéro blanc au centre
- Cellule courante (tête du chemin): légèrement plus lumineuse

CHEMIN:
- Bande verte qui relie les cellules visitées
- Direction-aware:
    - Cellule droite → rectangle horizontal plein
    - Cellule bas → rectangle vertical plein
    - Coin (vient de gauche, va en bas) → sprite coin adapté
- Utilise des sprites directionnels simples
  (pas de rendering custom, juste 4 sprites: horizontal, vertical,
  coin-TL, coin-TR, coin-BL, coin-BR)

=== EDGE CASES À GÉRER ===

1. RETRACT PATH (priorité haute):
   Si le joueur drag vers la cellule N-1 du chemin (cellule précédente),
   supprimer la cellule N du chemin et marquer N comme non-visitée.
   Ne pas considérer ça comme une cellule bloquée.

2. NŒUD BLOQUANT:
   Si le joueur essaie de passer DEVANT un nœud numéroté sans le toucher
   (par exemple aller de cellule A à cellule C en passant par B où B est
   un nœud), le chemin s'arrête — il doit toucher le nœud B d'abord.
   Exception: si B est le prochain nœud attendu, le chemin continue normalement.

3. DEADLOCK NON DÉTECTÉ:
   Le jeu ne détecte PAS automatiquement si le joueur est dans une
   impasse (toutes les cellules adjacentes visitées sans avoir fini).
   Le bouton Reset règle ça — pas besoin d'algo de détection.

4. TOUCH RAPIDE (fast swipe):
   Si le joueur swipe trop vite, le touch peut sauter des cellules.
   Solution: interpoler entre la position précédente et actuelle du touch
   pour vérifier toutes les cellules traversées frame par frame.

5. TOUCH EN DEHORS DE LA GRILLE:
   Ignorer les events touch qui sortent des bounds de la grille.
   Ne pas crasher si touchRow ou touchCol est hors [0, gridSize-1].

6. NŒUD 1 NON TOUCHÉ EN PREMIER:
   Si le joueur commence à drag depuis une cellule qui n'est pas le nœud 1,
   ignorer complètement l'input. Le chemin ne peut démarrer QUE depuis le 1.

7. VICTOIRE PARTIELLE:
   Tous les nœuds touchés dans l'ordre mais toutes les cellules
   non remplies → PAS de victoire. Le joueur doit remplir TOUTE la grille.
   Afficher un indicateur visuel du pourcentage de cellules remplies.

8. MULTI-TOUCH:
   Ignorer tous les touches supplémentaires. Seul le premier touch actif
   contrôle le chemin.

=== ARCHITECTURE DU CODE ===

Génère ces fichiers TypeScript pour Cocos Creator 3.8:

1. LevelData.ts — interface TypeScript pour les données de niveau +
   tableau de 3 niveaux hardcodés (gridSize 5, 6, 7)

2. Cell.ts — composant attaché à chaque cellule node:
    - Propriétés: row, col, isVisited, nodeNumber (-1 si pas un nœud),
      pathDirection (enum: NONE, UP, DOWN, LEFT, RIGHT)
    - Méthodes: setVisited(), setEmpty(), updateVisual()
    - Références aux sprites directionnels via @property

3. GridManager.ts — composant principal:
    - Génère la grille dynamiquement depuis LevelData
    - Gère le touch input (onTouchStart, onTouchMove, onTouchEnd)
    - Maintient: currentPath (Cell[]), visitedSet (Set<string>),
      nextExpectedNode (number)
    - Méthodes: startPath(), extendPath(), retractPath(),
      validateVictory(), resetLevel()
    - Interpolation de position pour fast swipe

4. GameUI.ts — composant UI:
    - Affiche: numéro de niveau, bouton Reset, bouton Undo,
      indicateur de cellules remplies (ex: "35/49")
    - Méthode showVictory() avec animation simple

=== CONTRAINTES TECHNIQUES ===

- Cocos Creator 3.8, TypeScript strict
- Pas de librairies externes
- La grille doit s'adapter à différentes tailles d'écran
  (utiliser ContentSize du Canvas pour calculer la taille des cellules)
- Préfab Cell créé dynamiquement par code, pas via l'éditeur
- Touch events sur le node de la grille, pas sur chaque cellule
  individuellement (plus performant)
- Nœuds instanciés comme enfants du GridManager node

=== CE QUE TU DOIS GÉNÉRER ===

1. Les 4 fichiers TypeScript complets et fonctionnels
2. La structure de scène recommandée (hierarchy des nodes)
3. Les instructions pour créer les sprites directionnels
   (dimensions recommandées, comment les assigner dans l'éditeur)
4. Les 3 niveaux JSON de test avec solutions valides

Commence par LevelData.ts puis GridManager.ts en priorité.