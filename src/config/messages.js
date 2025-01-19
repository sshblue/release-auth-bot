export const MESSAGES = {
    // Messages généraux
    WELCOME: '👋 Bienvenue chez D-Club! Commençons ta présentation.',
    ASK_PSEUDO: '💫 Comment veux-tu être appelé ?',
    GREET_USER: (pseudo) => `🤝 Ravi de te rencontrer ${pseudo}!`,
    ASK_PRESENTATION: '📝 Peux-tu te présenter en quelques lignes ?',
    THANKS_PRESENTATION: '✨ Merci pour ta présentation !',
    ASK_COMPETENCE: '🎯 Quelle est ta compétence principale ?',
    ASK_NIVEAU: (competence) => `📊 Quel est ton niveau pour la compétence ${competence} ?`,
    ASK_SOURCE: '🔍 Comment as-tu découvert notre groupe ?',
    ASK_EXPECTATIONS: '🎯 Qu\'attends-tu de notre communauté ?',
    THANKS_INFO: '✨ Merci pour tes informations !',
    REQUEST_SENT: '📝 Ta demande a été transmise aux administrateurs.\n🔔 Tu recevras une réponse très prochainement.',
    
    // Messages d'erreur
    ERROR_GENERAL: '❌ Une erreur est survenue. Merci de réessayer plus tard.',
    ERROR_ADMIN: '❌ Une erreur est survenue lors du traitement de la demande.',
    ERROR_SUBMISSION: '❌ Une erreur est survenue lors de la soumission de ta demande.',
    ERROR_ALREADY_REGISTERED: '❌ Tu es déjà enregistré dans notre système. Si tu as besoin d\'aide, contacte un administrateur.',
    
    // Messages d'administration
    ADMIN_NEW_REQUEST: (pseudo) => `📥 Nouvelle demande de ${pseudo}`,
    ADMIN_REQUEST_DETAILS: (user) => 
        `👤 Pseudo: ${user.pseudo}\n` +
        `📝 Présentation: ${user.presentation}\n` +
        `🎯 Compétence: ${user.competence_principale}\n` +
        `📊 Niveau: ${user.niveau_competence}\n` +
        `🔍 Source: ${user.source_decouverte}\n` +
        `🎯 Attentes: ${user.attentes}`,

    // Messages d'approbation/rejet
    APPROVAL_MESSAGE: (inviteLink) => 
        '✨ Félicitations! Ta candidature a été acceptée!\n\n' + 
        '⚠️ Attention, ce lien d\'invitation est unique et expirera dans 24 heures.\n\n' + 
        '🔗 Voici ton lien d\'invitation pour rejoindre le canal :\n' +
        `${inviteLink}\n\n` +
        '⚠️ Clique sur le lien pour rejoindre le canal !',

    REJECTION_MESSAGE: 
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
        'Merci de ta compréhension et de ton intérêt pour notre communauté.'
};
