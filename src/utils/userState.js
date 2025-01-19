// Stockage temporaire des états utilisateur en mémoire
const userStates = new Map();

export const getUserState = async (chatId) => {
    if (!userStates.has(chatId)) {
        userStates.set(chatId, {
            currentQuestion: 'pseudo',
            pseudo: null,
            presentation: null,
            competence_principale: null,
            niveau_competence: null,
            source_decouverte: null,
            attentes: null
        });
    }
    return userStates.get(chatId);
};

export const updateUserState = async (chatId, updates) => {
    const currentState = await getUserState(chatId);
    userStates.set(chatId, { ...currentState, ...updates });
    return userStates.get(chatId);
};

export const clearUserState = async (chatId) => {
    userStates.delete(chatId);
};
