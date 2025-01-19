# 🤖 Telegram Authentication Bot

Un bot Telegram moderne pour gérer les demandes d'accès à votre canal avec un processus d'approbation administrateur.

## ✨ Fonctionnalités

- 📝 Formulaire d'inscription interactif
- 👥 Gestion des demandes d'accès
- 🔐 Processus d'approbation par les administrateurs
- 🔗 Génération de liens d'invitation uniques
- 📊 Intégration avec Supabase pour le stockage des données
- 🔄 Redémarrage automatique avec PM2

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/sshblue/release-auth-bot.git
cd release-auth-bot

# Installer les dépendances
pnpm install
```

## ⚙️ Configuration

1. Créez un fichier `.env` à la racine du projet :

```env
# Bot Telegram
TELEGRAM_BOT_TOKEN=your_bot_token

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Canaux
ADMIN_CHANNEL_ID=your_admin_channel_id
MAIN_CHANNEL_ID=your_main_channel_id
```

2. Configurez la base de données Supabase en exécutant le script SQL fourni dans `sql/init.sql`

## 🛠️ Déploiement

### Développement local

```bash
# Démarrer le bot en mode développement
pnpm dev
```

### Production (avec PM2)

```bash
# Installation de PM2
npm install -g pm2

# Démarrage du bot
pm2 start ecosystem.config.js

# Voir les logs
pm2 logs

# Redémarrer le bot
pm2 restart telegram-bot
```

## 📚 Structure du Projet

```
├── src/
│   ├── config/         # Configuration (messages, boutons)
│   ├── handlers/       # Gestionnaires de commandes
│   └── index.js        # Point d'entrée
├── sql/
│   └── init.sql        # Script d'initialisation de la base de données
├── ecosystem.config.js  # Configuration PM2
└── package.json
```

## 🔒 Sécurité

- Les tokens et clés d'API sont stockés dans le fichier `.env`
- Les liens d'invitation sont uniques pour chaque utilisateur
- Vérification des permissions administrateur

## 📝 Commandes du Bot

- `/start` - Démarrer le processus d'inscription
- `/help` - Afficher l'aide
- Commandes Admin :
  - ✅ Approuver une demande
  - ❌ Rejeter une demande

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

[MIT](LICENSE)

## 🙏 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.
