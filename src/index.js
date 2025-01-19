import TelegramBot from 'node-telegram-bot-api';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { handleStart } from './handlers/startHandler.js';
import { handleUserResponse } from './handlers/responseHandler.js';
import { handleAdminActions } from './handlers/adminHandler.js';
import { MESSAGES } from './config/messages.js';

// Charger les variables d'environnement
dotenv.config();

// Initialiser le client Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Initialiser le bot Telegram avec les options de base
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Stocker la méthode originale
const originalSendMessage = bot.sendMessage;

// Remplacer sendMessage par une version sécurisée
bot.sendMessage = async function(chatId, text, options = {}) {
    if (chatId.toString() === process.env.MAIN_CHANNEL_ID) {
        console.log('Tentative bloquée d\'envoi de message dans le canal principal');
        return;
    }
    return originalSendMessage.call(this, chatId, text, options);
};

// Map pour suivre les commandes en cours de traitement
const processingCommands = new Map();

// Gérer la commande /start
bot.onText(/\/start/, async (msg) => {
    const commandId = `${msg.chat.id}_${msg.message_id}`;
    
    // Vérifier si la commande est déjà en cours de traitement
    if (processingCommands.has(commandId)) {
        return;
    }
    
    try {
        processingCommands.set(commandId, true);
        await handleStart(bot, msg);
    } catch (error) {
        console.error('Erreur lors du démarrage:', error);
        await bot.sendMessage(msg.chat.id, MESSAGES.ERROR_GENERAL);
    } finally {
        processingCommands.delete(commandId);
    }
});

// Gérer les réponses des utilisateurs
bot.on('message', async (msg) => {
    const messageId = `${msg.chat.id}_${msg.message_id}`;
    
    // Vérifier si le message est déjà en cours de traitement
    if (processingCommands.has(messageId) || !msg.text || msg.text.startsWith('/')) {
        return;
    }
    
    try {
        processingCommands.set(messageId, true);
        await handleUserResponse(bot, msg, supabase);
    } catch (error) {
        console.error('Erreur lors du traitement du message:', error);
        await bot.sendMessage(msg.chat.id, MESSAGES.ERROR_GENERAL);
    } finally {
        processingCommands.delete(messageId);
    }
});

// Gérer les actions des administrateurs
bot.on('callback_query', async (query) => {
    const queryId = `${query.message.chat.id}_${query.message.message_id}_${query.data}`;
    
    // Vérifier si l'action est déjà en cours de traitement
    if (processingCommands.has(queryId)) {
        return;
    }
    
    try {
        processingCommands.set(queryId, true);
        await handleAdminActions(bot, query, supabase);
    } catch (error) {
        console.error('Erreur lors du traitement de l\'action admin:', error);
        await bot.answerCallbackQuery(query.id, {
            text: MESSAGES.ERROR_ADMIN,
            show_alert: true
        });
    } finally {
        processingCommands.delete(queryId);
    }
});

// Gérer les erreurs non capturées
bot.on('polling_error', (error) => {
    console.error('Erreur de polling:', error);
});

console.log('Bot D-Club Portal est démarré! 🚀');
