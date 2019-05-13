/*
 * ChatHandler: factory incaricato di gestire il modulo chat. Memorizza i messaggi di una determinata sezione di gioco,
 * e espone metodi per la sua gestione
 */
angular.module('codyColor').factory("chatHandler", function(rabbit, gameData) {
    let chatHandler = {};

    let chatMessages = [];
    const chatHints = [ "Bella partita!", "Che sfortuna!", "Devo andare", "Ciao!", "Giochiamo ancora?",
                        "Sei un grande!", "No", "Sì", "😄", "😂", "😘", "😎", "😭", "😱", "🤬", "🤖"];


    chatHandler.getChatMessages = function() {
        return chatMessages;
    };


    chatHandler.getChatHints = function () {
        return chatHints;
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