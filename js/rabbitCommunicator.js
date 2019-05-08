/*
 * RabbitCommunicator module: service che si occupa dell'interazione 
 * con il broker, esponendo funzioni utili
 */

angular.module('codyColor').factory("rabbit",function(gameData) {

    let rabbit = {};

    // credenziali di comunicazione con il server
    const rabbitUsername = "guest";
    const rabbitPassword = "guest";
    //const serverUrl = "ws://127.0.0.1:15674/ws";   /* LOCALE */
    const serverUrl = "wss://botify.it/codycolor/ws"; /* SERVER */
    const rabbitVHost = "/";
    const serverControlQueue = "/queue/serverControl";
    const clientControlTopic = "/topic/clientsControl";
    const generalTopic       = "/topic/general";
    const randGameRoomsTopic = "/topic/gameRooms";
    const custGameRoomsTopic = "/topic/custGameRooms";
    const random = 'random';
    const custom = 'custom';

    // crea il messaggio da utilizzare come richiesta di connessione
    const uniqueClientId = (Math.floor(Math.random() * 100000)).toString();

    // riconosce se il client è connesso a rabbit al momento, oppure no
    let connected;
    let client;

    // callback passati dai vari controller, utilizzati per eseguire del codice all'arrivo di nuovi messaggi
    let callbacks = {};

    // timer di heartbeat
    let heartbeatTimer;

    // riferimenti alle subscription
    let serverDirectSubscription;
    let generalSubscription;
    let gameRoomSubscription;

    // ottiene lo stato attuale della connessione al broker
    rabbit.getConnectionState = function() {
        if(connected === undefined)
            connected = false;
        return connected;
    };


    // callback dalla schermata home
    rabbit.setHomeCallbacks = function(onGeneralInfoMessage) {
        callbacks = {};
        callbacks.onGeneralInfoMessage = onGeneralInfoMessage;
    };

    // callback della splash
    rabbit.setBaseCallbacks = function(onGeneralInfoMessage) {
        callbacks = {};
        callbacks.onGeneralInfoMessage = onGeneralInfoMessage;
    };


    rabbit.cleanCallbacks = function() {
        callbacks = {};
    };

    // callback necessari per il matchmaking
    rabbit.setRMMakingCallbacks = function(onGeneralInfoMessage, onGameRequestResponse, onHereMessage, onReadyMessage, onTilesMessage,
                                           onQuitGameMessage, onConnectionLost) {
        callbacks = {};
        callbacks.onGeneralInfoMessage  = onGeneralInfoMessage;
        callbacks.onGameRequestResponse = onGameRequestResponse;
        callbacks.onHereMessage         = onHereMessage;
        callbacks.onReadyMessage        = onReadyMessage;
        callbacks.onTilesMessage        = onTilesMessage;
        callbacks.onQuitGameMessage     = onQuitGameMessage;
        callbacks.onConnectionLost      = onConnectionLost;
    };

    // callback necessari per il matchmaking
    rabbit.setCMMakingCallbacks = function(connectedCallback, onGameRequestResponse, onHereMessage, onReadyMessage, onTilesMessage,
                                           onQuitGameMessage, onConnectionLost, onGeneralInfoMessage) {
        callbacks = {};
        callbacks.onConnected           = connectedCallback;
        callbacks.onGameRequestResponse = onGameRequestResponse;
        callbacks.onHereMessage         = onHereMessage;
        callbacks.onReadyMessage        = onReadyMessage;
        callbacks.onTilesMessage        = onTilesMessage;
        callbacks.onQuitGameMessage     = onQuitGameMessage;
        callbacks.onConnectionLost      = onConnectionLost;
        callbacks.onGeneralInfoMessage  = onGeneralInfoMessage;
    };

    // callback necessari per il matchmaking
    rabbit.setNewCMatchCallbacks = function(onGameRequestResponse, onHereMessage, onReadyMessage, onTilesMessage,
                                           onQuitGameMessage, onConnectionLost, onGeneralInfoMessage) {
        callbacks = {};
        callbacks.onGameRequestResponse = onGameRequestResponse;
        callbacks.onHereMessage         = onHereMessage;
        callbacks.onReadyMessage        = onReadyMessage;
        callbacks.onTilesMessage        = onTilesMessage;
        callbacks.onQuitGameMessage     = onQuitGameMessage;
        callbacks.onConnectionLost      = onConnectionLost;
        callbacks.onGeneralInfoMessage  = onGeneralInfoMessage;
    };

    // callback necessari per la schermata di aftermatch
    rabbit.setAftermatchCallbacks = function(onReadyMessage, onTilesMessage, onQuitGameMessage, onConnectionLost, onGeneralInfoMessage) {
        callbacks = {};
        callbacks.onReadyMessage    = onReadyMessage;
        callbacks.onTilesMessage    = onTilesMessage;
        callbacks.onQuitGameMessage = onQuitGameMessage;
        callbacks.onConnectionLost  = onConnectionLost;
        callbacks.onGeneralInfoMessage  = onGeneralInfoMessage;
    };


    // callback necessari per la schermata match
    rabbit.setMatchCallbacks = function(onEnemyPositionedMessage, onQuitGameMessage, onConnectionLost, onSkipMessage, onGeneralInfoMessage) {
        callbacks = {};
        callbacks.onEnemyPositionedMessage = onEnemyPositionedMessage;
        callbacks.onQuitGameMessage        = onQuitGameMessage;
        callbacks.onConnectionLost         = onConnectionLost;
        callbacks.onSkipMessage            = onSkipMessage;
        callbacks.onGeneralInfoMessage  = onGeneralInfoMessage;
    };


    // effettua la richiesta di connessione al broker. In caso di connessione
    // completata, sottoscrive il topic di controllo utilizzato per le risposte dal server
    rabbit.connect = function(onConnected, onError) {
        callbacks.onConnected      = onConnected;
        callbacks.onConnectionLost = onError;

        // /* SIMULAZIONI IN LOCALE */ client = Stomp.client('ws://127.0.0.1:15674/ws');
        // /* SENZA HTTPS */           client = Stomp.client('ws://botify.it/codycolor/ws');
        client = Stomp.client(serverUrl);
        client.connect(rabbitUsername, rabbitPassword, // credenziali
                       connectedCallback,              // onConnect
                       errorCallback,                  // onError
                       rabbitVHost);                   // vHost
    };


    // una volta avvenuta la connessione con il broker, va sottoscritta la queue temporanea
    // utilizzata per intercettare la risposta del server, quando ancora non si è stati
    // identificati da esso
    let connectedCallback = function() {
        console.log("Connessione a RabbitMQ completata.");
        connected = true;

        // sottoscrivi la queue per la conunicazione con il server
        serverDirectSubscription = client.subscribe(clientControlTopic + '.' + uniqueClientId, handleDirectMessages);
        generalSubscription = client.subscribe(generalTopic, handleGeneralMessages);

        sendConnectedSignal();

        // eventuali azioni addizionali da compiere a connessione completata
        if (callbacks.onConnected !== undefined)
            callbacks.onConnected();
    };


    // callback utilizzato in caso di errore di connessione
    let errorCallback = function() {
        console.log("Connessione a RabbitMQ non riuscita.");
        connected = false;

        // ritenta connessione dopo 10 secondi
        setTimeout(function () {
            rabbit.connect();
        }, 10000);

        // eventuali azioni addizionali
        if (callbacks.onConnectionLost !== undefined)
            callbacks.onConnectionLost();
    };


    // invia al server una richiesta per iniziare una nuova partita
    rabbit.sendGameRequest = function(newCustomRequest, invitationCode) {
        let message;
        if (newCustomRequest !== undefined && newCustomRequest === true && invitationCode === undefined) {
            // richiesta di nuovo custom match
            message = { msgType:      'gameRequest',
                        correlationId: uniqueClientId,
                        gameOptions:   { timerSetting: gameData.getTimerSetting() },
                        gameType:      custom,
                        code:         '0000'};

        } else if (newCustomRequest !== undefined && newCustomRequest === false && invitationCode !== undefined) {
            // richiesta di partecipazione a custom match da invito
            message = { msgType:      'gameRequest',
                        correlationId: uniqueClientId,
                        gameType:      custom,
                        code:          invitationCode.toString() };

        } else {
            // richiesta match casuale
            message = { msgType:      'gameRequest',
                        correlationId: uniqueClientId,
                        gameType:      random };
        }


        // permette di creare una queue con nominativo univoco nel broker,
        // composto dal nome passato più una variabile di sessione.
        client.send(serverControlQueue,                   // destination
                    { durable: false, exclusive: false }, // headers
                    JSON.stringify(message));             // message
    };


    // pone il client in ascolto di messaggi sulla game room
    rabbit.subscribeGameRoom = function() {
        let gameRoomsTopic = (gameData.getGameType() === undefined || gameData.getGameType() === random ?
                              randGameRoomsTopic : custGameRoomsTopic);
        gameRoomSubscription = client.subscribe(gameRoomsTopic + '.' + gameData.getGameRoomId(),
                                                handleDirectMessages);

        heartbeatTimer = setInterval(function() {
            let message = { msgType:     'heartbeat',
                gameRoomId:   gameData.getGameRoomId(),
                playerId:     gameData.getPlayerId(),
                gameType:     gameData.getGameType() };

            client.send(serverControlQueue,                   // destination
                { durable: false, exclusive: false }, // headers
                JSON.stringify(message));             // message
        }, 5000);
    };


    // invia un messaggio nella game room, utilizzato per notificare all'avversario,
    // se presente, la propria presenza
    rabbit.sendHereMessage = function(needResponseValue) {
        let gameRoomsTopic = (gameData.getGameType() === undefined || gameData.getGameType() === random ?
                              randGameRoomsTopic : custGameRoomsTopic);

        let message = { msgType:     'here',
                        gameRoomId:   gameData.getGameRoomId(),
                        playerId:     gameData.getPlayerId(),
                        nickname:     gameData.getPlayerNickname(),
                        needResponse: needResponseValue,
                        timerSetting: gameData.getTimerSetting(),
                        gameType:     gameData.getGameType(),
                        readyState:   gameData.isPlayerReady() };

        // permette di creare una queue con nominativo univoco nel broker,
        // composto dal nome passato più una variabile di sessione.
        client.send(gameRoomsTopic + '.' + gameData.getGameRoomId(), // destination
                    { durable: false, exclusive: false },            // headers
                    JSON.stringify(message));                        // message
    };


    // invia messaggio alla game room, utilizzato per notificare all'avversario che si
    // è pronti a giocare
    rabbit.sendReadyMessage = function() {
        let gameRoomsTopic = (gameData.getGameType() === undefined || gameData.getGameType() === random ?
                              randGameRoomsTopic : custGameRoomsTopic);
        let message = { msgType:     'ready',
                        gameRoomId:   gameData.getGameRoomId(),
                        playerId:     gameData.getPlayerId(),
                        nickname:     gameData.getPlayerNickname(),
                        gameType:     gameData.getGameType(),
                        readyState:   true };

        // permette di creare una queue con nominativo univoco nel broker,
        // composto dal nome passato più una variabile di sessione.
        client.send(gameRoomsTopic + '.' + gameData.getGameRoomId(), // destination
                    { durable: false, exclusive: false },            // headers
                    JSON.stringify(message));                        // message
    };


    // notifica all'avversario l'avvenuto posizionamento di roby
    rabbit.sendPlayerPositionedMessage = function() {
        let gameRoomsTopic = (gameData.getGameType() === undefined || gameData.getGameType() === random ?
                              randGameRoomsTopic : custGameRoomsTopic);
        let message = { msgType:   'playerPositioned',
                        gameRoomId: gameData.getGameRoomId(),
                        playerId:   gameData.getPlayerId(),
                        gameType:   gameData.getGameType(),
                        matchTime:  gameData.getPlayerMatchTime(),
                        side:       gameData.getPlayerStartPosition().side,
                        distance:   gameData.getPlayerStartPosition().distance };


        client.send(gameRoomsTopic + '.' + gameData.getGameRoomId(), // destination
                    { durable: false, exclusive: false },            // headers
                    JSON.stringify(message));                        // message
    };

    // notifica all'avversario la volontà di skippare l'animazione
    rabbit.sendSkipMessage = function() {
        let gameRoomsTopic = (gameData.getGameType() === undefined || gameData.getGameType() === random ?
            randGameRoomsTopic : custGameRoomsTopic);
        let message = { msgType:   'skip',
                        gameRoomId: gameData.getGameRoomId(),
                        playerId:   gameData.getPlayerId(),
                        gameType:   gameData.getGameType() };

        client.send(gameRoomsTopic + '.' + gameData.getGameRoomId(), // destination
                    { durable: false, exclusive: false },            // headers
                    JSON.stringify(message));                        // message
    };


    // invia messaggio al server, per richiedere una nuova disposizione tiles
    rabbit.sendTilesRequest = function() {
        let message = { msgType:     'tilesRequest',
                        gameRoomId:   gameData.getGameRoomId(),
                        gameType:     gameData.getGameType()};

        // permette di creare una queue con nominativo univoco nel broker,
        // composto dal nome passato più una variabile di sessione.
        client.send(serverControlQueue,                    // destination
                    { durable: false, exclusive: false },  // headers
                    JSON.stringify(message));              // message
    };

    // notifica al server la connessione di un nuovo client al sistema
    let sendConnectedSignal = function() {
        let message = { msgType:      'connectedSignal',
                        correlationId: uniqueClientId };

        // permette di creare una queue con nominativo univoco nel broker,
        // composto dal nome passato più una variabile di sessione.
        client.send(serverControlQueue,            // destination
            { durable: false, exclusive: false },  // headers
            JSON.stringify(message));              // message
    };


    // chiude la connessione alla game room in modo sicuro
    rabbit.quitGame = function() {
        let gameRoomsTopic = (gameData.getGameType() === undefined || gameData.getGameType() === random ?
                              randGameRoomsTopic : custGameRoomsTopic);

        if (gameRoomSubscription !== undefined) {
            gameRoomSubscription.unsubscribe();
            gameRoomSubscription = undefined;
        }

        if (heartbeatTimer !== undefined) {
            clearInterval(heartbeatTimer);
            heartbeatTimer = undefined;
        }

        callbacks = {};

        if (gameData.getGameRoomId() === -1 || gameData.getPlayerId() === -1)
            return;

        let message = { msgType:     'quitGame',
                        gameRoomId:   gameData.getGameRoomId(),
                        playerId:     gameData.getPlayerId(),
                        gameType:     gameData.getGameType() };

        // invia messaggi per notificare l'abbandono della partita,
        // sia al server che agli altri client connessi alla gameRoom
        client.send(serverControlQueue,                   // destination
                    { durable: false, exclusive: false }, // headers
                    JSON.stringify(message));             // message

        client.send(gameRoomsTopic + '.' + gameData.getGameRoomId(), // destination
                    { durable: false, exclusive: false },            // headers
                    JSON.stringify(message));                        // message
    };


    let handleGeneralMessages = function(responseMessage) {
        let responseObject = JSON.parse(responseMessage.body);

        if (responseObject.msgType === 'generalInfo') {
            if (callbacks.onGeneralInfoMessage !== undefined) {
                callbacks.onGeneralInfoMessage(responseObject);
            }
        }
    };


    // gestisce le risposte del broker, provenienti dal server o dalla game room
    let handleDirectMessages = function(responseMessage) {
        let responseObject = JSON.parse(responseMessage.body);

        if (responseObject.msgType === 'gameResponse') {
            if (callbacks.onGameRequestResponse !== undefined) {
                callbacks.onGameRequestResponse(responseObject);

            }

        } else if (responseObject.msgType === 'generalInfo') {
            if (callbacks.onGeneralInfoMessage !== undefined) {
                callbacks.onGeneralInfoMessage(responseObject);
            }

        } else if (responseObject.playerId === gameData.getPlayerId()) {
            // si è intercettato il proprio messaggio: non fare niente

        } else {
            // agisci in maniera diversa a seconda della tipologia di messaggio game room
            switch(responseObject.msgType) {
                case "here":
                    if (callbacks.onHereMessage !== undefined)
                        callbacks.onHereMessage(responseObject);
                    break;

                case "ready":
                    if (callbacks.onReadyMessage !== undefined)
                        callbacks.onReadyMessage(responseObject);
                    break;

                case "tilesResponse":
                    if (callbacks.onTilesMessage !== undefined)
                        callbacks.onTilesMessage(responseObject);
                    break;

                case "playerPositioned":
                    if (callbacks.onEnemyPositionedMessage !== undefined)
                        callbacks.onEnemyPositionedMessage(responseObject);
                    break;

                case "quitGame":
                    if (callbacks.onQuitGameMessage !== undefined)
                        callbacks.onQuitGameMessage();
                    break;

                case "skip":
                    if (callbacks.onSkipMessage !== undefined)
                        callbacks.onSkipMessage();
                    break;
            }
        }
    };

    return rabbit;
});

