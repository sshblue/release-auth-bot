import { MESSAGES } from '../config/messages.js';

export const handleStart = async (bot, msg) => {
    const chatId = msg.chat.id;
    
    // Envoyer un seul message combiné
    await bot.sendMessage(
        chatId, 
        `${MESSAGES.WELCOME}\n\n${MESSAGES.ASK_PSEUDO}`,
        {
            reply_markup: {
                force_reply: true
            }
        }
    );
};
