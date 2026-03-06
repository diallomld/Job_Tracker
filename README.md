# 🚀 Job Tracker App - SaaS Job Tracking

![Frontend CI](https://github.com/USER/job-tracker/actions/workflows/ci.yml/badge.svg)

Une application moderne et élégante pour gérer vos candidatures, avec un tableau Kanban, des statistiques en temps réel et une synchronisation cloud via Supabase.

## 🛠 Features

- **Auth & Profil** : Inscription et connexion sécurisées avec Supabase Auth. Profil éditable avec nom et téléphone.
- **Tableau Kanban** : Glissez-déposez vos candidatures pour changer leur statut (En attente, Entretien, À relancer, Accepté, Refusé).
- **Dashboard** : Statistiques visuelles de vos candidatures.
- **Thème Premium** : Mode sombre/clair avec glassmorphisme.
- **Persistence Cloud** : Vos données sont sauvegardées sur Supabase et synchronisées sur tous vos appareils.

## 🚀 Installation Locale

1. Clonez le dépôt.
2. Installez les dépendances : `npm install`.
3. Configurez votre fichier `.env.local` avec vos clés Supabase (voir `.env.local.example`).
4. Lancez le serveur : `npm run dev`.

## 🚀 Déploiement sur Vercel

1. **GitHub** : Poussez votre code sur un dépôt GitHub.
2. **Vercel** : Importez le projet depuis le dashboard Vercel.
3. **Variables d'environnement** :
   - Ajoutez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans les paramètres Vercel.
4. **Build** : Vercel détectera automatiquement le framework (Vite) et déploiera l'application.

## 🧪 Tests

Lancez les 22 tests automatisés avec :
```bash
npm run test
```
