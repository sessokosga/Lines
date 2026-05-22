Je développe un puzzle game "Lines" sur grille NxN.

=== RÈGLES DU JEU ===
- Le joueur trace un chemin continu au drag/swipe
- Le chemin part obligatoirement du nœud numéro 1
- Il doit toucher chaque nœud numéroté dans l'ordre croissant (1→2→3→...→N)
- Il doit remplir TOUTES les cellules de la grille sans exception
- Le chemin ne peut jamais se croiser ou repasser sur une cellule déjà visitée
- Pas de diagonales — uniquement haut/bas/gauche/droite

=== MA DEMANDE ===
Vérifie et corrige tous les niveaux ci-dessous.
Pour chaque niveau, utilise un algorithme de backtracking pour:
1. Vérifier si le niveau est résolvable (chemin hamiltonien respectant l'ordre des nœuds)
2. Si non résolvable, corriger en déplaçant le minimum de nœuds possible
3. Retourner le niveau corrigé + le chemin solution complet
4. Vérifier qu'aucun deux nœuds du même numéro ne partagent la même cellule

=== CONTRAINTES DE DIFFICULTÉ ===
La difficulté doit être progressive sur les 12 niveaux:
- Niveaux 1-3 (grille 4x4): 3→4→5 nœuds. Niveaux simples, 
  solution relativement intuitive, nœuds souvent sur les bords ou coins
- Niveaux 4-6 (grille 5x5): 6→7→8 nœuds. Difficulté moyenne, 
  quelques nœuds intérieurs qui forcent des détours
- Niveaux 7-9 (grille 6x6): 9→10→11 nœuds. Difficile, 
  nœuds intérieurs nombreux, chemin non intuitif
- Niveaux 10-12 (grille 7x7): 10→11→12 nœuds. Très difficile, 
  nœuds placés pour que le chemin évident soit un piège

=== CONTRAINTES DE VARIÉTÉ ===
Pour chaque groupe de 3 niveaux de même taille:
- Les positions des nœuds doivent être suffisamment différentes entre eux
- Éviter les patterns identiques (ex: toujours les 4 coins + centre)
- Au minimum 3 nœuds doivent avoir des positions différentes entre deux niveaux 
  de même taille
- Varier la position du nœud 1 (pas toujours en haut à gauche)
- Varier la forme générale du chemin solution 
  (spirale, zigzag, S, Z, U, L selon les niveaux)

=== CONTRAINTES DE DIFFICULTÉ PAR NIVEAU ===
Pour rendre un niveau difficile:
- Placer des nœuds à des positions contre-intuitives 
  (pas sur les bords, pas dans les coins)
- Forcer le chemin à "enfermer" des zones qui semblent isolées
- Le nœud suivant doit parfois être dans la direction opposée à ce qu'on attend
- Éviter les solutions en zigzag ligne par ligne 
  (trop mécaniques et faciles à deviner)

=== NIVEAUX À VÉRIFIER ET CORRIGER ===
Les niveaux sont dans le fichier /scripts/LevelData.ts fourni.
Vérifie et corrige tous les niveaux du tableau LEVELS.

=== FORMAT DE RÉPONSE ATTENDU ===
Pour chaque niveau, retourne:
1. Statut: VALIDE ou CORRIGÉ
2. Le JSON corrigé (ou original si valide)
3. Le chemin solution complet sous forme de liste de coordonnées
4. Une note sur la difficulté et pourquoi le niveau est difficile ou facile
