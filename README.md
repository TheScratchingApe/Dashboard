# Dashboard

Fichiers:
DAPPDashboard.js contient toutes les fonctions pour extraire les infos de la BDD et les retraiter au format que l'on souhaite.
Les fonctions renvoient soit une variable type float (nombre normal) soit type dictionary (donc un ensemble de clés et valeurs associées).
Par exemple pour le daily volume c'est dictionary (chaque jour est une clé à laquelle est associée une valeur).
Pour faire un graph on peut utiliser directement les dictionaries donc ça devrait aller relativement vite. 

listeInfos.txt c'est notre nouvelle BDD que je fais avec Python

listeTx.txt c'était mon premier test, c'est à supprimer
