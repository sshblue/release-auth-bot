export const handleAdminActions = async (bot, query, supabase) => {
    try {
        const data = JSON.parse(query.data);
        const messageId = query.message.message_id;
        const chatId = query.message.chat.id;

        if (!data.userId) {
            throw new Error('ID utilisateur manquant');
        }

        if (data.action === 'approve' || data.action === 'reject') {
            const userId = data.userId;
            const decision = data.action === 'approve' ? 'approuvée' : 'rejetée';

            // Mettre à jour le statut dans la base de données
            const { error } = await supabase
                .from('demandes_acces')
                .update({ 
                    etat: decision,
                    date_decision: new Date().toISOString()
                })
                .eq('user_id', userId);

            if (error) throw error;

            if (data.action === 'approve') {
                await handleApproval(bot, userId);
            } else {
                await handleRejection(bot, userId);
            }

            // Mettre à jour le message dans le canal admin
            await bot.editMessageText(
                `Demande ${decision} pour l'utilisateur ${userId}`,
                {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: { inline_keyboard: [] } // Supprimer les boutons
                }
            );

            // Confirmer l'action
            await bot.answerCallbackQuery(query.id, {
                text: `Demande ${decision} avec succès!`,
                show_alert: true
            });
        }
    } catch (error) {
        console.error('Erreur lors du traitement de la décision:', error);
        await bot.answerCallbackQuery(query.id, {
            text: '❌ Une erreur est survenue lors du traitement de la décision.',
            show_alert: true
        });
    }
};

const handleApproval = async (bot, userId) => {
    try {
        // Débannir l'utilisateur du canal principal s'il était banni
        try {
            const chatId = parseInt(process.env.MAIN_CHANNEL_ID);
            await bot.unbanChatMember(chatId, userId, {
                only_if_banned: true // Ne génère pas d'erreur si l'utilisateur n'était pas banni
            });
            console.log(`Utilisateur ${userId} débanni du canal ${chatId}`);
        } catch (error) {
            // Ignorer les erreurs de unban car l'utilisateur n'était peut-être pas banni
            console.log('Note: Utilisateur non banni ou erreur de unban:', error.message);
        }

        // Utiliser le lien d'invitation fixe
        const inviteLink = 'https://t.me/+owVdnXHqc5Q2MmNk';

        // Envoyer le message avec le lien d'invitation
        const message = 
            '✨ Félicitations! Ta candidature a été acceptée!\n\n' +
            '🔗 Voici ton lien d\'invitation pour rejoindre le canal :\n' +
            `${inviteLink}\n\n` +
            '⚠️ Clique sur le lien pour rejoindre le canal !';

        await bot.sendMessage(userId, message);

        // Log de confirmation
        console.log(`Lien d'invitation envoyé à l'utilisateur ${userId}`);

    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        throw error;
    }
};

const handleRejection = async (bot, userId) => {
    try {
        const rejectMessage = 
            '❌ **Candidature Refusée**\n\n' +
            'Nous te remercions d\'avoir soumis ta demande pour rejoindre le canal D-Club. ' +
            'Après examen, nous regrettons de t\'informer que ta candidature n\'a pas été retenue cette fois-ci.\n\n' +
            '**Raisons possibles :**\n' +
            '- Profil non conforme aux critères actuels\n' +
            '- Manque d\'informations suffisantes\n' +
            '- Autres raisons spécifiques\n\n' +
            '**Que faire ensuite :**\n' +
            '- Tu peux réessayer de postuler à l\'avenir.\n' +
            '- N\'hésite pas à nous contacter pour plus de détails ou pour toute question.\n\n' +
            'Merci de ta compréhension et de ton intérêt pour notre communauté.';

        await bot.sendMessage(userId, rejectMessage, { parse_mode: 'Markdown' });

    } catch (error) {
        console.error('Erreur lors de l\'envoi du message de rejet:', error);
        throw error;
    }
};
