export const BUTTONS = {
    COMPETENCES: [
        ['RF', 'Dev'],
        ['Scama', 'Réseau'],
        ['Design', 'Autre']
    ],
    
    NIVEAUX: [
        ['Débutant'],
        ['Intermédiaire'],
        ['Avancé'],
        ['Expert']
    ],
    
    ADMIN_ACTIONS: [
        [{
            text: '✅ Approuver',
            callback_data: (userId) => JSON.stringify({ action: 'approve', userId })
        }],
        [{
            text: '❌ Rejeter',
            callback_data: (userId) => JSON.stringify({ action: 'reject', userId })
        }]
    ]
};
