# Rapport de Projet : Application de Ticketing

**Version**: 1.0
**Date**: 2024-07-26

---

## Table des Matières

1.  [Introduction](#1-introduction)
    1.1. [Contexte et Objectifs](#11-contexte-et-objectifs)
    1.2. [Périmètre de l'Application](#12-périmètre-de-lapplication)
2.  [Exigences Fonctionnelles](#2-exigences-fonctionnelles)
    2.1. [Gestion des Utilisateurs et Authentification](#21-gestion-des-utilisateurs-et-authentification)
    2.2. [Cycle de Vie d'un Ticket](#22-cycle-de-vie-dun-ticket)
    2.3. [Tableaux de Bord et Statistiques](#23-tableaux-de-bord-et-statistiques)
    2.4. [Chatbot d'Assistance](#24-chatbot-dassistance)
3.  [Architecture Technique](#3-architecture-technique)
    3.1. [Vue d'Ensemble](#31-vue-densemble)
    3.2. [Architecture Backend (Laravel)](#32-architecture-backend-laravel)
    3.3. [Architecture Frontend (React)](#33-architecture-frontend-react)
4.  [Schéma de la Base de Données](#4-schéma-de-la-base-de-données)
    4.1. [Diagramme Entité-Relation (ERD)](#41-diagramme-entité-relation-erd)
    4.2. [Description des Tables Détaillées](#42-description-des-tables-détaillées)
5.  [Documentation de l'API](#5-documentation-de-lapi)
    5.1. [Authentification](#51-authentification)
    5.2. [Gestion des Tickets](#52-gestion-des-tickets)
    5.3. [Statistiques et Dashboards](#53-statistiques-et-dashboards)
6.  [Logique du Frontend](#6-logique-du-frontend)
    6.1. [Structure des Composants](#61-structure-des-composants)
    6.2. [Routage et Protection des Routes](#62-routage-et-protection-des-routes)
    6.3. [Gestion de l'État](#63-gestion-de-létat)
7.  [Sécurité](#7-sécurité)
8.  [Déploiement](#8-déploiement)

---

## 1. Introduction

### 1.1. Contexte et Objectifs

L'application de ticketing est une solution web complète conçue pour centraliser et optimiser la gestion des demandes de support technique et fonctionnel au sein d'une organisation. L'objectif principal est de remplacer les systèmes de suivi manuels (comme les emails ou les feuilles de calcul) par une plateforme structurée qui améliore l'efficacité, la transparence et la qualité du service de support.

Les objectifs clés sont :

- **Centralisation** : Offrir un point d'entrée unique pour toutes les demandes de support.
- **Efficacité** : Réduire les temps de réponse et de résolution grâce à des workflows clairs et à l'assignation intelligente des tickets.
- **Transparence** : Permettre aux utilisateurs finaux de suivre l'état de leurs demandes en temps réel.
- **Analyse Stratégique** : Fournir des données et des rapports pour identifier les problèmes récurrents, évaluer la performance des équipes et prendre des décisions éclairées.
- **Satisfaction Utilisateur** : Améliorer l'expérience globale des employés en garantissant une prise en charge rapide et efficace de leurs problèmes.

### 1.2. Périmètre de l'Application

L'application couvre l'ensemble du cycle de vie d'un ticket, de sa création à sa résolution et sa clôture. Elle inclut la gestion des utilisateurs, des rôles, des statistiques de performance et une assistance par chatbot.

## 2. Exigences Fonctionnelles

### 2.1. Gestion des Utilisateurs et Authentification

- **Rôles** : L'application définit trois rôles principaux :
  - **Utilisateur (Employé)** : Peut créer et suivre ses propres tickets.
  - **Support IT (Agent)** : Gère les tickets qui lui sont assignés. Peut réserver, résoudre et communiquer sur les tickets.
  - **Administrateur** : Accès complet. Gère les utilisateurs, les configurations (départements, problèmes), et a une visibilité sur tous les tickets et statistiques.
- **Authentification** : Connexion sécurisée par email et mot de passe. Le système utilise Laravel Sanctum pour l'authentification SPA.

### 2.2. Cycle de Vie d'un Ticket

1.  **Création** : Un utilisateur authentifié crée un ticket en spécifiant un titre, une description, un type de problème et peut joindre une pièce jointe.
2.  **Assignation** :
    - Un administrateur peut assigner un ticket "ouvert" à un agent de support spécifique.
    - Un agent de support peut "réserver" un ticket non assigné, se l'attribuant ainsi à lui-même.
3.  **Résolution** : L'agent en charge du ticket le passe au statut "résolu" une fois le problème traité.
4.  **Clôture** : Le ticket est passé au statut "clos" par l'utilisateur initial ou un administrateur.
5.  **Évaluation** : L'utilisateur peut noter sa satisfaction concernant la résolution du ticket.

### 2.3. Tableaux de Bord et Statistiques

- Le tableau de bord principal (visible par les administrateurs) affiche :
  - Des indicateurs de performance clés (KPIs) : nombre total de tickets, tickets ouverts, temps de résolution moyen.
  - Des graphiques sur la répartition des tickets par statut, par priorité, et par département.
  - Une tendance du volume de tickets sur une période donnée.
  - Un classement des agents les plus performants.

### 2.4. Chatbot d'Assistance

Un widget de chat est disponible sur l'application, permettant aux utilisateurs d'interagir avec un chatbot basé sur une IA (Google AI Studio) pour obtenir des réponses rapides aux questions fréquentes ou une aide à la création de tickets.

## 3. Architecture Technique

### 3.1. Vue d'Ensemble

Le projet est une application web moderne avec un backend et un frontend découplés.

- **Backend**: API RESTful développée avec Laravel (PHP).
- **Frontend**: Single Page Application (SPA) développée avec React (JavaScript).
- **Base de données**: Base de données relationnelle (ex: MySQL).
- **Communication**: La communication entre le frontend et le backend se fait via des requêtes HTTP (API REST).

### 3.2. Architecture Backend (Laravel)

Le backend utilise le framework Laravel et suit le modèle de conception MVC (Modèle-Vue-Contrôleur).

- `app/Http/Controllers` : Les contrôleurs traitent les requêtes entrantes, interagissent avec les modèles et retournent des réponses JSON. Ex: `TicketController`, `AuthController`.
- `app/Models` : Les modèles Eloquent représentent les tables de la base de données et les relations entre elles. Ex: `Ticket`, `User`.
- `routes/api.php` : Ce fichier définit tous les endpoints de l'API, en les liant aux méthodes des contrôleurs.
- `database/migrations` : Les migrations gèrent le versioning du schéma de la base de données de manière programmable.

### 3.3. Architecture Frontend (React)

Le frontend est construit avec la bibliothèque React et un ensemble d'outils modernes pour le développement d'interfaces utilisateur.

- **Build Tool**: Vite.js est utilisé pour un développement et un build rapides.
- **UI Framework**: Chakra UI et shadcn/ui sont utilisés pour la bibliothèque de composants, offrant des éléments d'interface utilisateur stylés et accessibles.
- **Routage**: `react-router-dom` gère la navigation côté client.
- **Appels API**: `axios` est utilisé pour effectuer des requêtes HTTP vers l'API Laravel.
- **Structure**:
  - `src/pages`: Chaque fichier correspond à une page de l'application (ex: `Login.jsx`, `TicketList.jsx`).
  - `src/components`: Composants réutilisables (ex: `Sidebar.jsx`, `ui/Button.jsx`).
  - `src/hooks`: Hooks personnalisés pour encapsuler la logique, comme `useHttp.jsx` pour gérer les appels API et leur état (loading, error).

## 4. Schéma de la Base de Données

### 4.1. Diagramme Entité-Relation (ERD)

_Un diagramme ERD a été généré pour illustrer les relations._

### 4.2. Description des Tables Détaillées

#### `users`

Stocke les informations sur tous les utilisateurs de l'application.
| Colonne | Type | Description |
| :--- | :--- | :--- |
| `id` | `bigint`, PK | Identifiant unique |
| `name` | `varchar` | Nom complet de l'utilisateur |
| `email` | `varchar`, unique | Adresse e-mail |
| `password`| `varchar` | Mot de passe hashé |
| `role` | `enum` | ('admin', 'supportIt', 'client') |
| `...` | `...` | Autres clés étrangères (departement_id, etc.) |

#### `tickets`

Représente une demande de support.
| Colonne | Type | Description |
| :--- | :--- | :--- |
| `id` | `bigint`, PK | Identifiant unique |
| `title` | `varchar` | Sujet du ticket |
| `description`| `text` | Description détaillée du problème |
| `status` | `enum` | ('opened', 'reserved', 'resolved', 'closed') |
| `problem_id` | `foreignId` | Lien vers la table `problems` |
| `created_by` | `foreignId` | ID de l'utilisateur qui a créé le ticket |
| `reserved_by`| `foreignId` | ID de l'agent qui a pris en charge le ticket |
| `resolved_by`| `foreignId` | ID de l'agent qui a résolu le ticket |
| `attachement`| `varchar` | Chemin vers la pièce jointe |
| `...` | `...` | Timestamps, etc. |

#### `problems`

Liste des catégories de problèmes prédéfinies.
| Colonne | Type | Description |
| :--- | :--- | :--- |
| `id` | `bigint`, PK | Identifiant unique |
| `name` | `varchar` | Nom du problème (ex: "Problème de connexion") |
| `type` | `varchar` | Type (ex: "Logiciel", "Matériel") |
| `specification` | `varchar` | Spécification additionnelle |

---

## _Cette section peut être complétée avec les détails de toutes les autres tables (`fonctions`, `departements`, etc.)_

## 5. Documentation de l'API

### 5.1. Authentification

- `POST /api/login`

  - **Description**: Authentifie un utilisateur et retourne un token Sanctum.
  - **Corps**: `{ "email": "user@example.com", "password": "password" }`
  - **Réponse (Succès)**: `{ "token": "...", "user": { ... } }`

- `POST /api/register`
  - **Description**: Enregistre un nouvel utilisateur.
  - **Corps**: `{ "name": "...", "email": "...", "password": "..." }`

### 5.2. Gestion des Tickets

- `POST /api/tickets`

  - **Description**: Crée un nouveau ticket. Nécessite une authentification.
  - **Corps**: `{ "title": "...", "description": "...", "problem_id": 1, "attachement": file }`
  - **Réponse (Succès)**: `{ "message": "Ticket créé", "ticket": { ... } }`

- `PUT /api/tickets/{id}/reserve`

  - **Description**: Permet à un agent de réserver un ticket.
  - **Corps**: `{ "reserved_by": userId }`

- `PUT /api/tickets/{id}/resolve`
  - **Description**: Marque un ticket comme résolu.
  - **Corps**: `{ "resolved_by": userId }`

### 5.3. Statistiques et Dashboards

- `GET /api/dashboard/stats`
  - **Description**: Récupère les statistiques agrégées pour le tableau de bord principal.
  - **Réponse**: Un objet JSON contenant plusieurs métriques (ex: `totalTickets`, `ticketsByStatus`, etc.).

## 6. Logique du Frontend

### 6.1. Structure des Composants

- **`HomeDashboard.jsx`**: C'est le composant principal du tableau de bord. Il est responsable de :

  - Récupérer les données statistiques via des appels API au montage (`useEffect`).
  - Gérer l'état local pour les données des graphiques et les KPIs.
  - Utiliser des composants de la bibliothèque `recharts` pour afficher les visualisations de données (LineChart, PieChart, etc.).
  - Offrir des fonctionnalités comme le rafraîchissement des données et le filtrage.

- **`TicketList.jsx`**: Affiche la liste des tickets.
  - Récupère la liste des tickets en fonction du rôle de l'utilisateur.
  - Permet de trier et filtrer les tickets.
  - Fournit des liens vers la vue détaillée de chaque ticket (`TicketView.jsx`).

### 6.2. Routage et Protection des Routes

Le routage est géré dans `App.jsx` avec `react-router-dom`.

- **`ProtectedRoute`**: Un composant wrapper qui vérifie la présence d'un token d'authentification. Si l'utilisateur n'est pas connecté, il est redirigé vers la page `/login`.
- **`RoleProtectedRoute`**: Un wrapper plus spécifique qui vérifie non seulement l'authentification mais aussi le rôle de l'utilisateur, le redirigeant vers `/unauthorized` si les permissions sont insuffisantes.

### 6.3. Gestion de l'État

La gestion de l'état est principalement locale aux composants en utilisant les hooks `useState` et `useEffect`. Pour les opérations asynchrones comme les appels API, un hook personnalisé (`useHttp` ou une logique similaire dans les services) est utilisé pour gérer les états de chargement, de succès et d'erreur, évitant ainsi la duplication de code.

## 7. Sécurité

- **Backend**:
  - **Authentification**: Laravel Sanctum est utilisé pour une authentification SPA robuste et sécurisée.
  - **Autorisation**: Les policies et gates de Laravel (ou des vérifications de rôle dans les contrôleurs) sont utilisés pour s'assurer que les utilisateurs ne peuvent effectuer que les actions autorisées.
  - **Protection**: Protection intégrée contre les attaques CSRF, XSS et l'injection SQL grâce à l'ORM Eloquent.
- **Frontend**:
  - Le stockage du token d'authentification se fait dans un endroit sécurisé (ex: `localStorage` pour la persistance, mais `httpOnly` cookies seraient une alternative plus sécurisée).
  - La protection des routes côté client empêche l'affichage des composants non autorisés, mais la véritable sécurité est appliquée côté serveur.

## 8. Déploiement

1.  **Backend (Laravel)**:
    - Le code est déployé sur un serveur web (ex: Nginx, Apache) avec PHP.
    - Les dépendances sont installées avec `composer install --no-dev`.
    - Le fichier `.env` est configuré pour l'environnement de production (base de données, URL de l'application, etc.).
    - Les migrations sont exécutées avec `php artisan migrate --force`.
2.  **Frontend (React)**:
    - Le projet est buildé avec `npm run build`, générant des fichiers statiques optimisés dans le dossier `dist`.
    - Ces fichiers statiques sont servis par le serveur web.
    - Une configuration de réécriture d'URL (URL rewrite) est nécessaire sur le serveur web pour que toutes les routes de la SPA pointent vers `index.html`, permettant à React Router de gérer la navigation.
