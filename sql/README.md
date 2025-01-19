# Scripts SQL pour D-Club Portal Bot

Ce dossier contient les scripts SQL nécessaires pour configurer la base de données Supabase.

## Structure de la Base de Données

### Table `demandes_acces`

Cette table stocke toutes les demandes d'accès au D-Club.

#### Colonnes
- `id` (uuid) : Identifiant unique de la demande
- `user_id` (bigint) : ID Telegram de l'utilisateur
- `pseudo` (text) : Pseudonyme choisi
- `presentation` (text) : Présentation de l'utilisateur
- `competence_principale` (enum) : Compétence principale (RF, Dev, Scama, etc.)
- `niveau_competence` (enum) : Niveau dans la compétence principale
- `niveau_rf` (text) : Niveau spécifique en RF (si applicable)
- `source_decouverte` (text) : Comment l'utilisateur a découvert le groupe
- `attentes` (text) : Attentes vis-à-vis de la communauté
- `etat` (enum) : État de la demande (en_attente, approuvée, rejetée)
- `date_creation` (timestamp) : Date de création de la demande
- `date_decision` (timestamp) : Date de la décision
- `raison_rejet` (text) : Raison du rejet (si applicable)

#### Types Enum
- `competence_type` : RF, Dev, Scama, Réseau, Design, Autre
- `niveau_type` : Débutant, Intermédiaire, Avancé, Expert
- `etat_type` : en_attente, approuvée, rejetée

#### Sécurité
- Row Level Security (RLS) activé
- Politiques d'accès définies pour le rôle de service

## Installation

1. Connectez-vous à votre projet Supabase
2. Allez dans l'éditeur SQL
3. Copiez et exécutez le contenu de `init.sql`

## Maintenance

Pour réinitialiser la base de données :
```sql
DROP TABLE IF EXISTS "public"."demandes_acces" CASCADE;
```

Puis réexécutez le script `init.sql`.
