import { getUserState, updateUserState } from '../utils/userState.js';
import { MESSAGES } from '../config/messages.js';
import { BUTTONS } from '../config/buttons.js';

export const handleUserResponse = async (bot, msg, supabase) => {
    const chatId = msg.chat.id;
    const response = msg.text;
    const userState = await getUserState(chatId);

    switch (userState.currentQuestion) {
        case 'pseudo':
            await handlePseudoResponse(bot, chatId, response);
            break;
        case 'presentation':
            await handlePresentationResponse(bot, chatId, response);
            break;
        case 'competence':
            await handleCompetenceResponse(bot, chatId, response);
            break;
        case 'niveau':
            await handleNiveauResponse(bot, chatId, response);
            break;
        case 'source':
            await handleSourceResponse(bot, chatId, response);
            break;
        case 'attentes':
            await handleAttentesResponse(bot, chatId, response, supabase);
            break;
        default:
            console.log('État inconnu:', userState.currentQuestion);
            break;
    }
};

const handlePseudoResponse = async (bot, chatId, pseudo) => {
    await updateUserState(chatId, { 
        pseudo, 
        currentQuestion: 'presentation',
        user_id: chatId.toString()
    });
    
    // Combiner les messages
    await bot.sendMessage(
        chatId,
        `${MESSAGES.GREET_USER(pseudo)}\n\n${MESSAGES.ASK_PRESENTATION}`
    );
};

const handlePresentationResponse = async (bot, chatId, presentation) => {
    await updateUserState(chatId, { presentation, currentQuestion: 'competence' });
    
    // Combiner les messages
    await bot.sendMessage(
        chatId,
        `${MESSAGES.THANKS_PRESENTATION}\n\n${MESSAGES.ASK_COMPETENCE}`,
        {
            reply_markup: {
                keyboard: BUTTONS.COMPETENCES,
                resize_keyboard: true,
                one_time_keyboard: true
            }
        }
    );
};

const handleCompetenceResponse = async (bot, chatId, competence) => {
    await updateUserState(chatId, { competence_principale: competence, currentQuestion: 'niveau' });
    await bot.sendMessage(
        chatId,
        MESSAGES.ASK_NIVEAU(competence),
        {
            reply_markup: {
                keyboard: BUTTONS.NIVEAUX,
                resize_keyboard: true,
                one_time_keyboard: true
            }
        }
    );
};

const handleNiveauResponse = async (bot, chatId, niveau) => {
    await updateUserState(chatId, { niveau_competence: niveau, currentQuestion: 'source' });
    await bot.sendMessage(
        chatId,
        MESSAGES.ASK_SOURCE,
        {
            reply_markup: {
                remove_keyboard: true
            }
        }
    );
};

const handleSourceResponse = async (bot, chatId, source) => {
    await updateUserState(chatId, { source_decouverte: source, currentQuestion: 'attentes' });
    await bot.sendMessage(chatId, MESSAGES.ASK_EXPECTATIONS);
};

const handleAttentesResponse = async (bot, chatId, attentes, supabase) => {
    try {
        // Vérifier si l'utilisateur existe déjà
        const { data: existingUser } = await supabase
            .from('demandes_acces')
            .select('user_id')
            .eq('user_id', chatId.toString())
            .single();

        if (existingUser) {
            await bot.sendMessage(chatId, MESSAGES.ERROR_ALREADY_REGISTERED);
            return;
        }

        // Mettre à jour l'état de l'utilisateur
        await updateUserState(chatId, { 
            attentes: attentes, 
            currentQuestion: 'complete'
        });

        // Récupérer l'état complet de l'utilisateur
        const userState = await getUserState(chatId);

        // Insérer la demande dans Supabase
        const { data, error } = await supabase
            .from('demandes_acces')
            .insert([{
                user_id: chatId.toString(),
                pseudo: userState.pseudo,
                presentation: userState.presentation,
                competence_principale: userState.competence_principale,
                niveau_competence: userState.niveau_competence,
                source_decouverte: userState.source_decouverte,
                attentes: attentes
            }]);

        if (error) throw error;

        // Envoyer un seul message de confirmation
        await bot.sendMessage(
            chatId,
            `${MESSAGES.THANKS_INFO}\n\n${MESSAGES.REQUEST_SENT}`
        );

        // Notifier les administrateurs
        await notifyAdmins(bot, { ...userState, attentes });

    } catch (error) {
        console.error('Erreur lors de la soumission:', error);
        await bot.sendMessage(chatId, MESSAGES.ERROR_SUBMISSION);
    }
};

const notifyAdmins = async (bot, userState) => {
    try {
        const adminMessage = MESSAGES.ADMIN_REQUEST_DETAILS(userState);
        
        await bot.sendMessage(
            process.env.ADMIN_CHANNEL_ID, 
            MESSAGES.ADMIN_NEW_REQUEST(userState.pseudo) + '\n\n' + adminMessage,
            {
                reply_markup: {
                    inline_keyboard: BUTTONS.ADMIN_ACTIONS.map(row => 
                        row.map(button => ({
                            text: button.text,
                            callback_data: JSON.stringify({
                                action: button.text.includes('Approuver') ? 'approve' : 'reject',
                                userId: userState.user_id
                            })
                        }))
                    )
                }
            }
        );
    } catch (error) {
        console.error('Erreur lors de la notification des admins:', error);
    }
};
