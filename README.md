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
## Screenshots

DEMO LOGN: demo@demo.com/Passer@1
<img width="428" height="257" alt="image" src="https://github.com/user-attachments/assets/01f0deb7-1698-4202-8734-3255356df972" />


<img width="1517" height="868" alt="saas_dashboard" src="https://github.com/user-attachments/assets/767f94bc-0734-4571-b3ed-92998d00c322" />
<img width="1894" height="955" alt="sentry_track_error" src="https://github.com/user-attachments/assets/9f0436a6-76b6-41aa-b665-1d34603cfe80" />
<img width="1912" height="882" alt="sentry1" src="https://github.com/user-attachments/assets/f1d042cd-b9db-4214-887b-4979f0afbeac" />
<img width="1898" height="803" alt="sonarqube" src="https://github.com/user-attachments/assets/991c0fa0-016f-4208-9262-1c86956e1e18" />
<img width="955" height="484" alt="posthog_session_replay" src="https://github.com/user-attachments/assets/77e96a9f-2e82-4ab3-9e24-f6f94bd966ff" />
<img width="1887" height="941" alt="posthog" src="https://github.com/user-attachments/assets/27dec9c2-3307-49a4-97f8-cdee7affd9fa" />
<img width="1908" height="1079" alt="antigravity IDE" src="https://github.com/user-attachments/assets/81ae7659-0494-4da3-90b2-8b47a61313b2" />
<img width="1896" height="818" alt="vercel" src="https://github.com/user-attachments/assets/01495b0c-99fb-4403-b76a-1d8697cd727d" />
<img width="1841" height="913" alt="saas_dashboard_3" src="https://github.com/user-attachments/assets/4455860e-c67f-48b1-ac1f-8df6f53ad904" />
<img width="1463" height="885" alt="saas_2" src="https://github.com/user-attachments/assets/8696b2fb-81dd-4a29-a825-336cc2ef2737" />


