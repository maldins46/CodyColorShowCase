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
    let connectedToServer;
    let client;
    let pageCallbacks = {};
    let heartbeatTimer;
    let subscriptions = {};


    rabbit.getBrokerConnectionState = function () {
        if (connectedToBroker === undefined)
            connectedToBroker = false;
        return connectedToBroker;
    };

    rabbit.getServerConnectionState = function () {
        if (connectedToServer === undefined)
            connectedToServer = false;
        return connectedToServer;
    };


    rabbit.setPageCallbacks = function (callbacks) {
        pageCallbacks = callbacks;
    };


    rabbit.connect = function () {
        // todo switch to release prima della pubblicazione
        client = Stomp.client(credentials.releaseUrl);
        client.connect(
            credentials.username,
            credentials.password,
            onConnected,
            onConnectionLost,
            credentials.vHost
        );
    };


    rabbit.subscribeGameRoom = function () {
        subscriptions.gameRoom = client.subscribe(
            getGameRoomEndpoint(),
            handleIncomingMessage
        );

        // invia un heartbeat al server ogni 5 secondi
        heartbeatTimer = setInterval(function () {
            sendInServerControlQueue({
                msgType:    messageTypes.heartbeat,
                gameRoomId: gameData.getGeneral().gameRoomId,
                playerId:   gameData.getUserPlayer().playerId,
                gameType:   gameData.getGeneral().gameType
            });
        }, 5000);
    };


    // richiesta per iniziare una nuova partita
    rabbit.sendGameRequest = function () {
       sendInServerControlQueue({
           msgType:       messageTypes.gameRequest,
           correlationId: sessionHandler.getSessionId(),
           gameType:      gameData.getGeneral().gameType,
           gameName:      gameData.getGeneral().gameName,
           timerSetting:  gameData.getGeneral().timerSetting,
           code:          gameData.getGeneral().code,
           date:          gameData.getGeneral().startDate
       });
    };


    // notifica all'avversario la propria presenza
    rabbit.sendHereMessage = function (needResponseValue) {
        sendInGameRoomTopic({
            msgType:      messageTypes.here,
            gameRoomId:   gameData.getGeneral().gameRoomId,
            playerId:     gameData.getUserPlayer().playerId,
            nickname:     gameData.getUserPlayer().nickname,
            needResponse: needResponseValue,
            organizer:    gameData.getUserPlayer().organizer,
            timerSetting: gameData.getGeneral().timerSetting,
            gameType:     gameData.getGeneral().gameType,
            readyState:   gameData.getUserPlayer().ready
        });
    };


    // notifica all'avversario che si è pronti a iniziare la partita
    rabbit.sendReadyMessage = function () {
        sendInGameRoomTopic({
            msgType:    messageTypes.ready,
            gameRoomId: gameData.getGeneral().gameRoomId,
            playerId:   gameData.getUserPlayer().playerId,
            nickname:   gameData.getUserPlayer().nickname,
            gameType:   gameData.getGeneral().gameType,
            readyState: true
        });
    };


    // notifica all'avversario l'avvenuto posizionamento di roby
    rabbit.sendPlayerPositionedMessage = function () {
        sendInGameRoomTopic({
            msgType:    messageTypes.playerPositioned,
            gameRoomId: gameData.getGeneral().gameRoomId,
            playerId:   gameData.getUserPlayer().playerId,
            gameType:   gameData.getGeneral().gameType,
            matchTime:  gameData.getUserPlayer().match.time,
            side:       gameData.getUserPlayer().match.startPosition.side,
            distance:   gameData.getUserPlayer().match.startPosition.distance
        });
    };


    // notifica all'avversario la volontà di skippare l'animazione
    rabbit.sendSkipMessage = function () {
        sendInGameRoomTopic({
            msgType:    messageTypes.skip,
            gameRoomId: gameData.getGeneral().gameRoomId,
            playerId:   gameData.getUserPlayer().playerId,
            gameType:   gameData.getGeneral().gameType
        });
    };


    // formatta, invia e restituisci messaggio di chat
    rabbit.sendChatMessage = function (messageBody) {
        let message = {
            msgType:    messageTypes.chat,
            gameRoomId: gameData.getGeneral().gameRoomId,
            playerId:   gameData.getUserPlayer().playerId,
            sender:     gameData.getUserPlayer().nickname,
            body:       messageBody,
            date:       (new Date()).getTime(),
            gameType:   gameData.getGeneral().gameType
        };
        sendInGameRoomTopic(message);
        return message;
    };


    // richiede al server una nuova disposizione tiles
    rabbit.sendTilesRequest = function () {
        sendInServerControlQueue({
            msgType:    messageTypes.tilesRequest,
            gameRoomId: gameData.getGeneral().gameRoomId,
            gameType:   gameData.getGeneral().gameType
        });
    };


    // chiude la connessione alla game room in modo sicuro
    rabbit.quitGame = function () {
        if (subscriptions.gameRoom !== undefined)
            subscriptions.gameRoom.unsubscribe();

        subscriptions.gameRoom = undefined;

        if (heartbeatTimer !== undefined)
            clearInterval(heartbeatTimer);

        pageCallbacks = {};

        if (gameData.getGeneral().gameRoomId === -1 || gameData.getUserPlayer().playerId === -1)
            return;

        let quitNotification = {
            msgType:    messageTypes.quitGame,
            gameRoomId: gameData.getGeneral().gameRoomId,
            playerId:   gameData.getUserPlayer().playerId,
            gameType:   gameData.getGeneral().gameType
        };

        sendInServerControlQueue(quitNotification);
        sendInGameRoomTopic(quitNotification);
    };


    // invocato non appena connesso al broker
    let onConnected = function () {
        connectedToBroker = true;

        let serverDirectEndpoint   = endpoints.clientControlTopic + '.' + sessionHandler.getSessionId();
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
        connectedToServer = false;

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
        switch (gameData.getGeneral().gameType) {
            case gameData.getGameTypes().random: {
                return endpoints.randomGameRoomsTopic + '.' + gameData.getGeneral().gameRoomId;
            }
            case gameData.getGameTypes().custom: {
                return endpoints.customGameRoomsTopic + '.' + gameData.getGeneral().gameRoomId;
            }
            case gameData.getGameTypes().royale: {
                return endpoints.agaGameRoomsTopics + '.' + gameData.getGeneral().gameRoomId;
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
                connectedToServer = true;
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
        if (message.playerId === gameData.getUserPlayer().playerId) {
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

