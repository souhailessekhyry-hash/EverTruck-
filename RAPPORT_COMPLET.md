# 🚚 RAPPORT COMPLET D'AUDIT ET D'ARCHITECTURE : EVERTRUCK LOGISTIQUE SARL 🇲🇦

> **Date de l'audit :** 10 Juillet 2026 (`10/07/2026`)  
> **Auteur :** Antigravity AI — DeepMind Agentic Coding  
> **Statut :** Production-Ready / Monorepo Dockerisé  
> **Entreprise :** **EverTruck Logistique SARL** (Société Marocaine de Transport B2B & Logistique Corporate)  
> **Siège Social & Plateforme Centrale :** Casablanca Technopark, Route de Nouaceur, Casablanca, Maroc (`Africa/Casablanca`)  
> **Identifiants Légaux Marocains :** ICE: `002984729000045` | RC: `482910` (Casablanca) | IF: `5289104` | CNSS: `2910482`  
> **Normes Commerciales & Fiscales :** Code de Commerce Marocain, TVA sur transport de marchandises à `20%`, Lettres de Voiture CTM/LVM conformes au Ministère du Transport et de la Logistique, facturation en **Dirhams Marocains (`MAD / DH`)**.

---

## 1. 🌟 RÉSUMÉ EXÉCUTIF ET VUE D'ENSEMBLE (CONTEXTE MAROCAIN)

**EverTruck Logistique SARL** est une plateforme web marocaine hautement sophistiquée et spécialisée dans le **transport professionnel d'équipements corporatifs, le transfert d'actifs d'entreprise et la logistique B2B sensible**.

Contrairement aux transporteurs généralistes, EverTruck se concentre exclusivement sur les besoins critiques des entreprises marocaines (banques, administrations publiques, multinationales, centres d'appels, cabinets d'avocats) à travers **8 piliers de services spécialisés** :
1. **Transport de Mobilier de Bureau (Office Furniture Transportation)** : Acheminement, montage et démontage de postes de travail, cloisons modulaires, tables de directoire et armoires sur les axes stratégiques du Royaume (`Casablanca`, `Rabat`, `Tanger`).
2. **Transport de Matériel Informatique (IT Equipment Transportation)** : Déplacement hautement sécurisé d'armoires serveurs, baies de brassage, stations de travail informatiques et parcs d'ordinateurs via des fourgons capitonnés avec suspension pneumatique.
3. **Déménagement d'Entreprise & Relocalisation (Business Relocation)** : Pilotage clé en main du transfert d'agences et de sièges sociaux avec étiquetage matriciel et interruption minimale d'activité.
4. **Transport d'Archives & Documents Légaux (Archive and Document Transportation)** : Collecte, transport scellé par caisses inviolables et livraison de fonds d'archives sensibles et dossiers bancaires/comptables.
5. **Logistique Corporate Intégrée (Corporate Logistics)** : Gestion externalisée des flux de matériel inter-sites et de l'approvisionnement des succursales nationales.
6. **Entreposage & Stockage Sécurisé (Warehousing)** : Plateformes logistiques sous surveillance 24/7 (caméras thermiques, contrôle hygrométrique) à **Casablanca (Sidi Maârouf)**, **Tanger Med Logistics Hub**, et **Marrakech (Sidi Ghanem)**.
7. **Distribution & Messagerie B2B (Distribution)** : Tournées programmées ou urgentes pour les réseaux de distribution d'équipements de bureau.
8. **Livraison Sécurisée avec Assurance Ad-Valorem (Secure Delivery of Professional Equipment)** : Garantie de couverture totale jusqu'à `5 000 000 MAD` avec escorte de sécurité et suivi GPS en direct.

### Lignes de Transport & Réseau Routier Marocain / International :
- **Lignes Nationales Principales (Autoroutes & Voies Express du Maroc) :**
  - *Axe Atlantique Nord-Sud :* **Tanger Med** ⇄ **Kenitra** ⇄ **Rabat** ⇄ **Casablanca** ⇄ **Agadir**.
  - *Axe Central & Impérial :* **Casablanca** ⇄ **Marrakech** et **Rabat** ⇄ **Fès** ⇄ **Oujda**.
- **Lignes Internationales depuis le Maroc :**
  - *Europe :* Exportations de fret spécialisé via **Tanger Med / Port d'Algeciras** vers l'Espagne, la France et le Benelux (sous carnet TIR et déclaration en douane marocaine DUM).
  - *Afrique de l'Ouest :* Transit routier inter-États au départ de Casablanca via Dakhla et le poste frontière de **Guerguerat** vers la Mauritanie et le Sénégal.

Conçue sous la forme d'un **Monorepo propre et scalable**, la plateforme s'appuie sur :
- Une **architecture conteneurisée via Docker Compose** garantissant l'isolation des responsabilités.
- Une **communication typée** (`TypeScript + tRPC 11`), gérant nativement les dates marocaines (`DD/MM/YYYY`) et les montants en `MAD`.
- Des **interfaces utilisateur "Premium"** (`React 19`, `Tailwind CSS`, `Three.js`).
- Une **sécurité Nginx Alpine** avec en-têtes strictes et routage isolé.

---

## 2. 🏗️ ARCHITECTURE GLOBALE DU SYSTÈME

L'écosystème EverTruck repose sur **5 conteneurs Docker interdépendants et isolés** au sein d'un réseau privé (`evertruck-network`) :

```
evertruck/
├── frontend/               # React 19 + TypeScript + Vite 7 + Tailwind CSS + Three.js + tRPC Client
├── backend/                # Hono + tRPC 11 Server + Drizzle ORM + MySQL & Redis Client + Zod
├── database/               # Scripts d'initialisation MySQL, migrations Drizzle, et backups
├── nginx/                  # Nginx reverse proxy routing, compression, caching & security
├── docker-compose.yml      # Orchestration Docker Compose pour le développement local
├── docker-compose.prod.yml # Orchestration Docker Compose optimisée pour VPS de production
├── .env                    # Variables d'environnement racines (orchestres / bases de données)
└── README.md               # Documentation technique du système
```

### Flux de Communication :
1. **Nginx Reverse Proxy (`evertruck-nginx` - Ports 80 / 443) :**
   - Reçoit l'intégralité du trafic HTTP/HTTPS externe.
   - Routage `/` ➔ redirigé vers le conteneur `frontend` (Port 3000).
   - Routage `/api/*` ➔ redirigé vers le conteneur `backend` (Port 4000).
2. **Frontend (`evertruck-frontend`) :**
   - Aucune connexion directe aux bases de données ou aux caches. Il communique exclusivement avec le Backend via l'endpoint `/api/trpc`.
3. **Backend (`evertruck-backend`) :**
   - Connexion exclusive à **MySQL (`evertruck-mysql` - Port 3306)** pour la persistance relationnelle et à **Redis (`evertruck-redis` - Port 6379)** pour le cache haute vitesse et les sessions.

---

## 3. 🎨 AUDIT DU FRONTEND (UI / UX / COMPOSANTS)

Le frontend (`frontend/src`) est développé avec un niveau de finition et d'ergonomie exceptionnel :

### 💎 Stack Technologique & Design Tokens
- **Framework & Build :** React 19 + Vite 7 + TypeScript 5.9.
- **Système de Couleurs (Palette Curée & Haut de Gamme) :**
  - `navy (#001d3d)` : Bleu marine profond conférant sérieux, confiance et stature institutionnelle.
  - `crimson (#e63946)` : Rouge dynamique pour les appels à l'action (`CTA`), urgences et accents visuels.
  - `teal (#0fa3b1)` : Vert d'eau / cyan technologique pour les statuts de succès, suivi et métriques modernes.
  - `golden (#ff9f1c)` : Orange doré pour les alertes, priorités et notations par étoiles.
- **Micro-Animations & Immersion 3D :**
  - **Three.js & React Three Fiber (`@react-three/fiber`, `@react-three/drei`) :** Rendu et animation de scènes 3D directement intégrés.
  - **Framer Motion & GSAP :** Animations d'apparition douces (`FadeIn`), transitions fluides entre pages et effets au défilement (`Lenis smooth scroll`).

### 📑 Cartographie des Pages Eager & Lazy-Loaded
L'application optimise les performances de chargement en chargeant immédiatement les pages critiques (`Home`, `Login`, `Register`) et en chargeant dynamiquement (`lazy`) les pages secondaires (`App.tsx`) :
1. **Pages Publiques & Vitrine :**
   - **Accueil (`/`)** : Héro sur canvas avec réseau de grilles animées et pulsations, compteurs statistiques (`react-countup`), présentation de la flotte.
   - **Services (`/services`) & Industries (`/industries`)** : Solutions logistiques détaillées (fret frigorifique, transport lourd, livraison du dernier kilomètre).
   - **Flotte (`/fleet`)** : Catalogue interactif des camions, fourgons, grues et remorques avec spécifications techniques.
   - **Demande de Devis (`/quote`)** : Formulaire interactif en plusieurs étapes avec calcul de volume et estimation des coûts.
   - **Blog (`/blog`, `/blog/:slug`)** : CMS d'articles avec recherche, filtrage par catégories et slugs SEO.
   - **FAQ (`/faq`) & Contact (`/contact`)** : Réponses aux questions récurrentes et formulaire de support.
2. **Espace Client (`/dashboard`) :**
   - Tableau de bord client pour le suivi d'expéditions, consultation des factures et centre de notifications.
3. **Espace Administration (`/admin` via `AdminDashboard.tsx`) :**
   - **11 onglets de gestion administrative :** Vue d'ensemble (Statistiques & KPI), Utilisateurs, Véhicules, Expéditions, Factures, Messages de contact, Demandes de devis, Articles de blog, FAQs, Témoignages clients, et Partenaires.

---

## 4. ⚙️ AUDIT DU BACKEND ET DE LA BASE DE DONNÉES

Le backend (`backend/src`) est conçu pour allier légèreté, robustesse et sécurité maximale.

### 🚀 Moteur Hono + tRPC 11
- **Hono** (`boot.ts`) : Serveur ultra-rapide gérant une limite de payload généreuse de `50 MB` pour les uploads de documents et photos de fret.
- **Routeur tRPC 11** (`router.ts`) : Propose 15 routeurs typés pour l'intégralité du métier logistique (`auth`, `localAuth`, `user`, `vehicle`, `shipment`, `blog`, `blogCategory`, `faq`, `testimonial`, `contact`, `quote`, `partner`, `notification`, `invoice`, `stats`).

### 🗄️ Modèle de Données Relationnel (Drizzle ORM / MySQL 8)
Le fichier de schéma (`schema.ts`) modélise 14 tables relationnelles avec contraintes et indexations :

| Table MySQL | Rôle Métier | Clés et Spécificités |
| :--- | :--- | :--- |
| `users` | Comptes clients & administrateurs | Identifiants locaux / OAuth (`unionId`), hachage Bcrypt, rôles (`user`, `admin`, `manager`) |
| `vehicles` | Parc automobile / camions | Type (`truck`, `van`, `trailer`, `forklift`, `crane`), immatriculation unique, capacité en tonnes, statut |
| `drivers` | Chauffeurs routiers | Permis CDL, type de permis (`Class A/B`), note moyenne (`rating`), statut (`active`, `off_duty`, `on_leave`) |
| `shipments` | Expéditions de fret | Numéro de suivi unique (`EVT-XXXX`), origine, destination, poids, statut (`pending`, `in_transit`, `delivered`, etc.) |
| `tracking` | Historique de géolocalisation | Lié aux `shipments`, horodatage précis, coordonnées GPS (`latitude`, `longitude`) et description d'étape |
| `invoices` | Facturation & comptabilité | Montant H.T., TVA, Total TTC, statut (`draft`, `sent`, `paid`, `overdue`), date d'échéance |
| `quote_requests`| Prospect & demandes de prix | Type de cargaison, poids, dimensions, statut d'examen (`new`, `quoted`, `accepted`) |
| `contact_messages`| Support client | Demandes entrantes avec suivi d'état (`new`, `read`, `replied`, `archived`) |
| `blog_posts` / `blog_categories` | CMS et communication | Slugs uniques pour le SEO, décompte de vues, brouillon / publié / mis en avant |
| `faqs` / `testimonials` / `partners` / `media_library` / `settings` / `notifications` | Contenu de la vitrine et paramètres système | Gestion de l'affichage en page d'accueil, logotypes partenaires, notifications push in-app |

---

## 5. 🔐 SÉCURITÉ, CONFORMITÉ ET DÉPLOIEMENT (DEVOPS)

### 🛡️ Couche de Sécurité Nginx
Le fichier (`nginx.prod.conf`) applique des règles de production strictes :
- **En-têtes de Sécurité HTTP :** `X-Frame-Options "SAMEORIGIN"`, `X-XSS-Protection "1; mode=block"`, `X-Content-Type-Options "nosniff"`, et `Content-Security-Policy (CSP)`.
- **Optimisation et Caching :** Compression **Gzip (niveau 6)** et mise en cache des assets statiques (`Cache-Control "public, max-age=31536000, immutable"`).

### 🔑 Gestion des Secrets et Identifiants
- Configuration stricte des environnements locaux (`.env`) et de production (`.env.production`), évitant toute fuite de mots de passe de bases de données ou de clés cryptographiques (`APP_SECRET`).

---

## 6. 💡 POINTS FORTS ET RECOMMANDATIONS D'ÉVOLUTION

### ✅ Les Forces du Projet
1. **Zéro Dette Technique de Typage :** Le couplage Drizzle ORM + Zod + tRPC + TypeScript garantit que tout changement en base est automatiquement détecté à la compilation côté React.
2. **Interface d'Administration Exhaustive :** L'interface `AdminDashboard` permet de piloter 100 % du cycle de vie des camions, chauffeurs, factures et articles sans avoir besoin d'écrire du SQL.
3. **Esthétique et Expérience Visuelle Premium :** L'usage conjoint de Three.js (3D), de canevas animés, de compteurs interactifs et d'une palette marine/crimson/teal distingue EverTruck.

### 🔮 Pistes d'Amélioration (Next Steps)
1. **Suivi GPS en Temps Réel par WebSockets :** Exploiter les WebSockets ou Server-Sent Events (SSE) via Hono/tRPC pour animer la position des camions sur une carte interactive en direct sans rechargement.
2. **Génération PDF des Factures :** Intégrer `pdfkit` ou `puppeteer` pour permettre le téléchargement instantané des factures et bons de livraison (`BOL`) au format PDF.
3. **Alertes SMS / Email Automatisées :** Coupler le module `notificationRouter` avec un service de messagerie transactionnelle (SendGrid / Twilio) pour notifier automatiquement les clients des étapes de livraison.

---

## 7. 🎯 CONCLUSION
La plateforme **EverTruck** représente un modèle d'excellence en ingénierie logicielle full-stack. Elle combine la robustesse d'un backend typé et d'une base relationnelle solide avec le raffinement visuel et l'interactivité d'un frontend de nouvelle génération.
