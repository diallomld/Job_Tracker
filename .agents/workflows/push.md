---
description: Automatisation Git Add, Commit et Push
---

Ce workflow permet de mettre à jour le dépôt distant en une seule étape.

// turbo-all
1. Ajouter tous les fichiers modifiés
```powershell
git add .
```

2. Effectuer le commit avec un message automatique ou personnalisé
```powershell
git commit -m "update: synchronization via antigravity workflow"
```

3. Pousser les changements vers origin
```powershell
git push
```