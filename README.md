# 🚀 Job Tracker App - SaaS Job Tracking

[![Frontend CI](https://github.com/diallomld/Job_Tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/diallomld/Job_Tracker/actions/workflows/ci.yml)
[![Security Audit](https://img.shields.io/badge/Security-Audit--High-brightgreen?logo=github-actions)](https://github.com/diallomld/Job_Tracker/actions)
[![Code Quality](https://img.shields.io/badge/Quality-Lint--Strict-blue?logo=eslint)](https://github.com/diallomld/Job_Tracker/actions)

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
    - Intégration **PostHog** pour le suivi du comportement utilisateur et Product Analytics.
    - **Sentry** (Monitoring d'erreurs en temps réel) avec support des Source Maps pour un débogage précis.
    - Session Replays (vidéos de navigation) et Event Tracking.
- **Thème Premium** : Design moderne avec Glassmorphisme et Dark Mode natif.
- **Persistence Cloud** : Synchronisation en temps réel via Supabase PostgreSQL.
- **Architecture Pro** : Reorganisation par domaines (`applications`, `auth`, `todo`, `common`).

## 🚀 Installation Locale

1. Clonez le dépôt.
2. Installez les dépendances : `npm install`.
3. Configurez votre fichier `.env.local` :
   ```env
   VITE_SUPABASE_URL=votre_url_supabase
    VITE_SUPABASE_ANON_KEY=votre_cle_anon
    VITE_PUBLIC_POSTHOG_KEY=votre_cle_posthog
    VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
    VITE_SENTRY_DSN=votre_dsn_sentry
    SENTRY_AUTH_TOKEN=votre_token_sentry (requis seulement pour le build/source maps)
    ```
4. Lancez le serveur : `npm run dev`.

## 🚀 Déploiement sur Vercel

1. **GitHub** : Poussez votre code sur un dépôt GitHub.
2. **Vercel** : Importez le projet depuis le dashboard Vercel.
3. **Variables d'environnement** :
   - Ajoutez `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_PUBLIC_POSTHOG_KEY`, `VITE_PUBLIC_POSTHOG_HOST` et `VITE_SENTRY_DSN`.
   - Ajoutez `SENTRY_AUTH_TOKEN` (secret) pour permettre l'upload des Source Maps lors du build.
4. **Build** : Vercel déploiera l'application automatiquement à chaque push.

## 🧪 Tests

L'application possède une suite de **37 tests automatisés** validés.
Lancez-les avec :
```bash
npm run test
```
