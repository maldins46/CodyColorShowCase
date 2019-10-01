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
    chatHintsPreMatch.push("HI");
    chatHintsPreMatch.push("WELCOME");
    chatHintsPreMatch.push("I_FEEL_STRONG_TODAY");
    chatHintsPreMatch.push("I_M_READY");
    chatHintsPreMatch.push("HAPPY_TO_PLAY_WITH_YOU");
    chatHintsPreMatch.push("ARE_YOU_READY");
    chatHintsPreMatch.push("PLAYING_WITH_FRIENDS");
    chatHintsPreMatch.push("FROM_NORTH");
    chatHintsPreMatch.push("FROM_SOUTH");
    chatHintsPreMatch.push("FROM_WEST");
    chatHintsPreMatch.push("FROM_EAST");
    chatHintsPreMatch.push("WELLDONE");
    chatHintsPreMatch.push("YOU_MADE_A_GREAT_SCORE");
    chatHintsPreMatch.push("IT_WAS_FUN");
    chatHintsPreMatch.push("DO_BETTER_NEXT_TIME");
    chatHintsPreMatch.push("THANKS");
    chatHintsPreMatch.push("LET_S_PLAY_AGAIN");
    chatHintsPreMatch.push("BYE");
    chatHintsPreMatch.push("SEE_YOU_NEXT_TIME");
    chatHintsPreMatch.push("EMOJI_1");
    chatHintsPreMatch.push("EMOJI_2");
    chatHintsPreMatch.push("EMOJI_3");
    chatHintsPreMatch.push("EMOJI_4");
    chatHintsPreMatch.push("EMOJI_5");
    chatHintsPreMatch.push("EMOJI_6");
    chatHintsPreMatch.push("EMOJI_7");
    chatHintsPreMatch.push("EMOJI_8");

    chatHintsAfterMatch.push("HI");
    chatHintsAfterMatch.push("WELCOME");
    chatHintsAfterMatch.push("I_FEEL_STRONG_TODAY");
    chatHintsAfterMatch.push("I_M_READY");
    chatHintsAfterMatch.push("HAPPY_TO_PLAY_WITH_YOU");
    chatHintsAfterMatch.push("ARE_YOU_READY");
    chatHintsAfterMatch.push("PLAYING_WITH_FRIENDS");
    chatHintsAfterMatch.push("FROM_NORTH");
    chatHintsAfterMatch.push("FROM_SOUTH");
    chatHintsAfterMatch.push("FROM_WEST");
    chatHintsAfterMatch.push("FROM_EAST");
    chatHintsAfterMatch.push("WELLDONE");
    chatHintsAfterMatch.push("YOU_MADE_A_GREAT_SCORE");
    chatHintsAfterMatch.push("IT_WAS_FUN");
    chatHintsAfterMatch.push("DO_BETTER_NEXT_TIME");
    chatHintsAfterMatch.push("THANKS");
    chatHintsAfterMatch.push("LET_S_PLAY_AGAIN");
    chatHintsAfterMatch.push("BYE");
    chatHintsAfterMatch.push("SEE_YOU_NEXT_TIME");
    chatHintsAfterMatch.push("EMOJI_1");
    chatHintsAfterMatch.push("EMOJI_2");
    chatHintsAfterMatch.push("EMOJI_3");
    chatHintsAfterMatch.push("EMOJI_4");
    chatHintsAfterMatch.push("EMOJI_5");
    chatHintsAfterMatch.push("EMOJI_6");
    chatHintsAfterMatch.push("EMOJI_7");
    chatHintsAfterMatch.push("EMOJI_8");


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