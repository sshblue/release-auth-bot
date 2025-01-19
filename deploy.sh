#!/bin/bash

# Installation des dépendances
npm install -g pm2
pnpm install

# Démarrage de l'application avec PM2
pm2 start ecosystem.config.js

# Sauvegarde de la configuration PM2
pm2 save

# Configuration du démarrage automatique
pm2 startup

# Afficher les logs
pm2 logs
