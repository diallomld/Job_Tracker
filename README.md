# 🚀 Job Tracker App - SaaS Job Tracking

[![Frontend CI](https://github.com/diallomld/Job_Tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/diallomld/Job_Tracker/actions/workflows/ci.yml)

Une application moderne et élégante pour gérer vos candidatures et vos tâches, avec un tableau Kanban, des statistiques en temps réel et une synchronisation cloud via Supabase.

## 🛠 Features

- **Auth & Profil** : Inscription et connexion sécurisées avec Supabase Auth. Profil complet avec nom, téléphone et gestion de session.
- **Gestion des Candidatures** :
    - Tableau Kanban avec Drag & Drop.
    - Suivi des statuts (En attente, Entretien, À relancer, Accepté, Refusé).
    - Dashboard analytique avec graphiques de progression.
- **Gestion des Tâches (To-Do List)** :
    - Double vue : Liste et Kanban.
    - Priorités (Basse, Moyenne, Haute), Tags et dates d'échéance.
    - Drag & Drop pour l'avancement des tâches.
- **Analytics & Tracking** :
    - Intégration **PostHog** pour le suivi du comportement utilisateur.
    - Session Replays (vidéos de navigation) et Event Tracking.
- **Thème Premium** : Design moderne avec Glassmorphisme et Dark Mode natif.
- **Persistence Cloud** : Synchronisation en temps réel via Supabase PostgreSQL.

## 🚀 Installation Locale

1. Clonez le dépôt.
2. Installez les dépendances : `npm install`.
3. Configurez votre fichier `.env.local` :
   ```env
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_cle_anon
   VITE_PUBLIC_POSTHOG_KEY=votre_cle_posthog
   VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   ```
4. Lancez le serveur : `npm run dev`.

## 🚀 Déploiement sur Vercel

1. **GitHub** : Poussez votre code sur un dépôt GitHub.
2. **Vercel** : Importez le projet depui le dashboard Vercel.
3. **Variables d'environnement** :
   - Ajoutez `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_PUBLIC_POSTHOG_KEY` et `VITE_PUBLIC_POSTHOG_HOST`.
4. **Build** : Vercel déploiera l'application automatiquement à chaque push.

## 🧪 Tests

L'application possède une suite de **37 tests automatisés** validés.
Lancez-les avec :
```bash
npm run test
```
