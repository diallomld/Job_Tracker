---
description: Automatisation Git Add, Commit et Push
---

Ce workflow permet de mettre à jour le dépôt distant en une seule étape.

// turbo-all
1. Ajouter tous les fichiers modifiés
```powershell
git add .
```

2. Effectuer le commit avec un message descriptif généré automatiquement basé sur les changements
```powershell
# L'agent doit générer un message professionnel (ex: "feat: ...", "fix: ...") basé sur le contenu de git diff
git commit -m "votre_message_dynamique_ici"
```

3. Pousser les changements vers origin
```powershell
git push
```