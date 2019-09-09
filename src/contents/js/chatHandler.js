/*
 * ChatHandler: factory incaricato di gestire il modulo chat. Memorizza i messaggi di una determinata sezione di gioco,
 * e espone metodi per la sua gestione
 */
angular.module('codyColor').factory("chatHandler", function() {
    let chatHandler = {};

    let chatMessages = [];
    let chatHintsPreMatch = [];

    let chatHintsAfterMatch = [];


    // inizializza manualmente gli id dei messaggi della chat
    for (let i = 1; i <= 16; i++) {
        chatHintsPreMatch.push("CHAT_PREMATCH."+i);
    }
    for (let i = 1; i <= 20; i++) {
        chatHintsAfterMatch.push("CHAT_POSTMATCH."+i);
    }



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