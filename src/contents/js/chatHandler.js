/*
 * ChatHandler: factory incaricato di gestire il modulo chat. Memorizza i messaggi di una determinata sezione di gioco,
 * e espone metodi per la sua gestione
 */
angular.module('codyColor').factory("chatHandler", function() {
    let chatHandler = {};

    let chatMessages = [];
    const chatHintsPreMatch = [  "Ciao!", "Tutto bene?", "No", "Sì", "Sei pronto?", "Ci sei?", "Iniziamo!",
        "Sono fortissimo!", "😄", "😂", "😘", "😎", "😭", "😱", "🤬", "🤖"];

    const chatHintsAfterMatch = ["Bella partita!", "Che sfortuna!", "Devo andare", "Giochiamo ancora?", "Ciao!",
        "Sei un grande!", "No", "Sì", "Sei pronto?", "Ci sei?", "Iniziamo!", "😄", "😂", "😘", "😎", "😭", "😱", "🤬", "🤖"];


    chatHandler.getChatMessages = function() {
        return chatMessages;
    };


    chatHandler.getChatHintsPreMatch = function () {
        return chatHintsPreMatch;
    };

    chatHandler.getChatHintsAfterMatch = function () {
        return chatHintsAfterMatch;
    };


    chatHandler.enqueueChatMessage = function (message) {
        chatMessages.push(message);
        chatMessages.sort(function (a, b) {
            if (a.date < b.date)
                return 1;
            else if (a.date > b.date)
                return -1;
            else
                return 0
        });

        // lunghezza massima chat: 10 messaggi
        if (chatMessages.length > 10)
            chatMessages.splice(10, 1);
    };


    chatHandler.clearChat = function () {
        chatMessages = [];
    };

    return chatHandler;
});