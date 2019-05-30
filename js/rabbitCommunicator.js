/*
 * RabbitCommunicator module: service che si occupa dell'interazione 
 * con il broker (RabbitMQ, per l'appunto), esponendo funzioni per la connessione
 * e l'invio di messaggi al broker
 */

angular.module('codyColor').factory("rabbit", function (gameData, sessionHandler) {
    let rabbit = {};

    const credentials = {
        username:   "guest",
        password:   "guest",
        vHost:      "/",
        releaseUrl: "wss://botify.it/codycolor/ws",
        debugUrl:   "ws://127.0.0.1:15674/ws"
    };

    const endpoints = {
        serverControlQueue:   "/queue/serverControl",
        clientControlTopic:   "/topic/clientsControl",
        generalTopic:         "/topic/general",
        randomGameRoomsTopic: "/topic/gameRooms",
        customGameRoomsTopic: "/topic/custGameRooms",
        agaGameRoomsTopics:   "/topic/agaGameRooms"
    };

    const messageTypes = {
        gameRequest:      "gameRequest",
        gameResponse:     "gameResponse",
        heartbeat:        "heartbeat",
        tilesRequest:     "tilesRequest",
        tilesResponse:    "tilesResponse",
        connectedSignal:  "connectedSignal",
        generalInfo:      "generalInfo",
        here:             "here",
        ready:            "ready",
        playerPositioned: "playerPositioned",
        skip:             "skip",
        chat:             "chat",
        quitGame:         "quitGame"
    };

    let connectedToBroker;
    let client;
    let pageCallbacks = {};
    let heartbeatTimer;
    let subscriptions = {};


    rabbit.getConnectionState = function () {
        if (connectedToBroker === undefined)
            connectedToBroker = false;
        return connectedToBroker;
    };


    rabbit.setPageCallbacks = function (callbacks) {
        pageCallbacks = callbacks;
    };


    rabbit.connect = function () {
        // todo switch to release prima della pubblicazione
        client = Stomp.client(credentials.releaseUrl);
        client.connect(credentials.username,
                       credentials.password,
                       onConnected,
                       onConnectionLost,
                       credentials.vHost);
    };


    rabbit.subscribeGameRoom = function () {
        subscriptions.gameRoom = client.subscribe(getGameRoomEndpoint(), handleIncomingMessage);

        // invia un heartbeat al server ogni 5 secondi
        heartbeatTimer = setInterval(function () {
            sendInServerControlQueue({
                msgType: messageTypes.heartbeat,
                gameRoomId: gameData.getGameRoomId(),
                playerId: gameData.getPlayerId(),
                gameType: gameData.getGameType()
            });
        }, 5000);
    };


    // richiesta per iniziare una nuova partita
    rabbit.sendGameRequest = function () {
       sendInServerControlQueue({
           msgType: messageTypes.gameRequest,
           correlationId: sessionHandler.getSessionId(),
           gameType: gameData.getGameType(),
           code: gameData.getGameCode()
       });
    };


    // notifica all'avversario la propria presenza
    rabbit.sendHereMessage = function (needResponseValue) {
        sendInGameRoomTopic({
            msgType: messageTypes.here,
            gameRoomId: gameData.getGameRoomId(),
            playerId: gameData.getPlayerId(),
            nickname: gameData.getPlayerNickname(),
            needResponse: needResponseValue,
            timerSetting: gameData.getTimerSetting(),
            gameType: gameData.getGameType(),
            readyState: gameData.isPlayerReady()
        });
    };


    // notifica all'avversario che si è pronti a iniziare la partita
    rabbit.sendReadyMessage = function () {
        sendInGameRoomTopic({
            msgType: messageTypes.ready,
            gameRoomId: gameData.getGameRoomId(),
            playerId: gameData.getPlayerId(),
            nickname: gameData.getPlayerNickname(),
            gameType: gameData.getGameType(),
            readyState: true
        });
    };


    // notifica all'avversario l'avvenuto posizionamento di roby
    rabbit.sendPlayerPositionedMessage = function () {
        sendInGameRoomTopic({
            msgType: messageTypes.playerPositioned,
            gameRoomId: gameData.getGameRoomId(),
            playerId: gameData.getPlayerId(),
            gameType: gameData.getGameType(),
            matchTime: gameData.getPlayerMatchTime(),
            side: gameData.getPlayerStartPosition().side,
            distance: gameData.getPlayerStartPosition().distance
        });
    };


    // notifica all'avversario la volontà di skippare l'animazione
    rabbit.sendSkipMessage = function () {
        sendInGameRoomTopic({
            msgType: messageTypes.skip,
            gameRoomId: gameData.getGameRoomId(),
            playerId: gameData.getPlayerId(),
            gameType: gameData.getGameType()
        });
    };


    // formatta, invia e restituisci messaggio di chat
    rabbit.sendChatMessage = function (messageBody) {
        let message = {
            msgType: messageTypes.chat,
            gameRoomId: gameData.getGameRoomId(),
            playerId: gameData.getPlayerId(),
            body: messageBody,
            date: (new Date()).getTime(),
            gameType: gameData.getGameType()
        };
        sendInGameRoomTopic(message);
        return message;
    };


    // richiede al server una nuova disposizione tiles
    rabbit.sendTilesRequest = function () {
        sendInServerControlQueue({
            msgType: messageTypes.tilesRequest,
            gameRoomId: gameData.getGameRoomId(),
            gameType: gameData.getGameType()
        });
    };


    // chiude la connessione alla game room in modo sicuro
    rabbit.quitGame = function () {
        if (subscriptions.gameRoom !== undefined) {
            subscriptions.gameRoom.unsubscribe();
            subscriptions.gameRoom = undefined;
        }

        if (heartbeatTimer !== undefined) {
            clearInterval(heartbeatTimer);
        }

        pageCallbacks = {};

        if (gameData.getGameRoomId() === -1 || gameData.getPlayerId() === -1)
            return;

        let quitNotification = {
            msgType: messageTypes.quitGame,
            gameRoomId: gameData.getGameRoomId(),
            playerId: gameData.getPlayerId(),
            gameType: gameData.getGameType()
        };

        sendInServerControlQueue(quitNotification);
        sendInGameRoomTopic(quitNotification);
    };


    // invocato non appena connesso al broker
    let onConnected = function () {
        connectedToBroker = true;

        let serverDirectEndpoint = endpoints.clientControlTopic + '.' + sessionHandler.getSessionId();
        subscriptions.serverDirect = client.subscribe(serverDirectEndpoint,   handleIncomingMessage);
        subscriptions.general      = client.subscribe(endpoints.generalTopic, handleIncomingMessage);

        sendInServerControlQueue({
            msgType: messageTypes.connectedSignal,
            correlationId: sessionHandler.getSessionId()
        });

        // eventuali azioni addizionali da compiere a connessione completata
        if (pageCallbacks.onConnected !== undefined)
            pageCallbacks.onConnected();
    };


    // invocato in caso di errore di connessione con il broker
    let onConnectionLost = function () {
        connectedToBroker = false;

        // ritenta connessione dopo 10 secondi
        setTimeout(function () {
            rabbit.connect();
        }, 10000);

        // eventuali azioni addizionali
        if (pageCallbacks.onConnectionLost !== undefined)
            pageCallbacks.onConnectionLost();
    };


    let sendInServerControlQueue = function(message) {
        // invia un messaggio nella queue riservata al server
        client.send(endpoints.serverControlQueue, // destination
            { durable: false, exclusive: false }, // headers
            JSON.stringify(message));             // message
    };


    let sendInGameRoomTopic = function(message) {
        // invia un messaggio alla game room sottoscritta dal giocatore
        client.send(getGameRoomEndpoint(),        // destination
            { durable: false, exclusive: false }, // headers
            JSON.stringify(message));             // message
    };


    let getGameRoomEndpoint = function() {
        switch (gameData.getGameType()) {
            case gameData.getGameTypes().random: {
                return endpoints.randomGameRoomsTopic + '.' + gameData.getGameRoomId();
            }
            case gameData.getGameTypes().custom: {
                return endpoints.customGameRoomsTopic + '.' + gameData.getGameRoomId();
            }
            case gameData.getGameTypes().aga: {
                return endpoints.agaGameRoomsTopics + '.' + gameData.getGameRoomId();
            }
        }
    };


    let handleIncomingMessage = function (rawMessage) {
        let message = JSON.parse(rawMessage.body);

        // 1. messaggi provenienti dal server
        switch(message.msgType) {
            case messageTypes.gameResponse:
                if (pageCallbacks.onGameRequestResponse !== undefined) {
                    pageCallbacks.onGameRequestResponse(message);
                }
                return;

            case messageTypes.generalInfo:
                sessionHandler.setGeneralInfo( {
                    totalMatches: message.totalMatches,
                    connectedPlayers: message.connectedPlayers,
                    randomWaitingPlayers: message.randomWaitingPlayers,
                    requiredClientVersion: message.requiredClientVersion
                });

                if (pageCallbacks.onGeneralInfoMessage !== undefined) {
                    pageCallbacks.onGeneralInfoMessage(message);
                }
                return;
        }

        // 2. messaggi provenienti dalla gameRoom
        if (message.playerId === gameData.getPlayerId()) {
            // si è intercettato il proprio messaggio: ignoralo
            return;
        }

        switch (message.msgType) {
            case messageTypes.here:
                if (pageCallbacks.onHereMessage !== undefined)
                    pageCallbacks.onHereMessage(message);
                break;

            case messageTypes.ready:
                if (pageCallbacks.onReadyMessage !== undefined)
                    pageCallbacks.onReadyMessage(message);
                break;

            case messageTypes.tilesResponse:
                if (pageCallbacks.onTilesMessage !== undefined)
                    pageCallbacks.onTilesMessage(message);
                break;

            case messageTypes.playerPositioned:
                if (pageCallbacks.onEnemyPositionedMessage !== undefined)
                    pageCallbacks.onEnemyPositionedMessage(message);
                break;

            case messageTypes.chat:
                if (pageCallbacks.onChatMessage !== undefined)
                    pageCallbacks.onChatMessage(message);
                break;

            case messageTypes.quitGame:
                if (pageCallbacks.onQuitGameMessage !== undefined)
                    pageCallbacks.onQuitGameMessage(message);
                break;

            case messageTypes.skip:
                if (pageCallbacks.onSkipMessage !== undefined)
                    pageCallbacks.onSkipMessage(message);
                break;
        }
    };

    return rabbit;
});

