/*
 * RabbitCommunicator module: service che si occupa dell'interazione 
 * con il broker, esponendo funzioni utili
 */

angular.module('codyColor').factory("rabbit",function(gameData) {

    let rabbit = {};

    // queue-baseTopic utilizzati per comunicare con il server
    let serverControlQueue = "/queue/serverControl";
    let clientControlTopic = "/topic/clientsControl";
    let gameRoomsTopic     = "/topic/gameRooms";

    // crea il messaggio da utilizzare come richiesta di connessione
    let uniqueClientId;

    // riconosce se il client è connesso a rabbit al momento, oppure no
    let connected;
    let client;

    // callback passati dal controller, utilizzati per eseguire del
    // codice all'arrivo di nuovi messaggi
    let onGameRequestResponse;
    let onHereMessage;
    let onReadyMessage;
    let onTilesMessage;

    // callback match
    let onEnemyPositionedMessage;

    // timer di heartbeat
    let heartbeatTimer;

    // riferimenti alle subscription
    let serverInitialSubscription;
    let gameRoomSubscription;


    // crea, solo se ancora non inizializzato, l'identificatore univoco del client utilizzato
    // nella prima connessione al server
    let getUniqueClientId = function() {
        if (uniqueClientId === undefined)
            uniqueClientId = (Math.floor(Math.random() * 100000)).toString();
        return uniqueClientId;
    };


    // ottiene lo stato attuale della connessione al broker
    rabbit.getConnectionState = function() {
        if(connected === undefined)
            connected = false;
        return connected;
    };


    // passa i callback necessari per il matchmaking
    rabbit.setMMakingCallbacks = function(onGameRequestResponseMM, onHereMessageMM, onReadyMessageMM, onTilesMessageMM) {
        onGameRequestResponse = onGameRequestResponseMM;
        onHereMessage         = onHereMessageMM;
        onReadyMessage        = onReadyMessageMM;
        onTilesMessage        = onTilesMessageMM;
    };


    rabbit.setMatchCallbacks = function(onEnemyPositionedMessageM) {
        onEnemyPositionedMessage = onEnemyPositionedMessageM;
    };


    // effettua la richiesta di connessione al broker. In caso di connessione
    // completata, sottoscrive il topic di controllo utilizzato per le risposte dal server
    rabbit.connect = function(extConnectedCallback, extErrorCallback) {
        //client = Stomp.client('ws://127.0.0.1:15674/ws');
        client = Stomp.client('wss://botify.it:80/codycolor/ws');
        client.connect('guest', 'guest',                                       // credenziali 
                       function() { connectedCallback(extConnectedCallback) }, // onConnect
                       function() { errorCallback(extErrorCallback) },         // onError
                       '/');                                                   // vHost
    };


    // una volta avvenuta la connessione con il broker, va sottoscritta la queue temporanea
    // utilizzata per intercettare la risposta del server, quando ancora non si è stati
    // identificati da esso
    let connectedCallback = function(extConnectedCallback) {
        console.log("Connessione a RabbitMQ completata.");
        connected = true;

        serverInitialSubscription = client.subscribe(clientControlTopic + '.' + getUniqueClientId(), // topic
                                                     handleIncomingMessages);                        // callback

        // eventuali azioni addizionali da compiere a connessione completata
        if(extConnectedCallback !== undefined)
            extConnectedCallback();
    };


    // callback utilizzato in caso di errore di connessione. todo tentativo riconnessione?
    let errorCallback = function(extErrorCallback) {
        console.log("Connessione a RabbitMQ non riuscita.");
        connected = false;

        // eventuali azioni addizionali da compiere a connessione completata
        if (extErrorCallback !== undefined)
            extErrorCallback();
    };


    // invia al server una richiesta per iniziare una nuova partita
    rabbit.sendGameRequest = function() {
        let message = { msgType:      'gameRequest',
                        correlationId: getUniqueClientId() };

        // permette di creare una queue con nominativo univoco nel broker,
        // composto dal nome passato più una variabile di sessione.
        client.send(serverControlQueue,                   // destination
                    { durable: false, exclusive: false }, // headers
                    JSON.stringify(message));             // message
    };


    // avvia un interval che invia ogni 5 secondi un segnale di heartbeat al server
    let startHeartbeat = function() {
        heartbeatTimer = setInterval(function() {
            let message = { msgType:     'heartbeat',
                            gameRoomId:   gameData.getGameRoomId(),
                            playerId:     gameData.getPlayerId()   };

            client.send(serverControlQueue,                   // destination
                        { durable: false, exclusive: false }, // headers
                        JSON.stringify(message));             // message
        }, 5000);
    };


    // pone il client in ascolto di messaggi sulla game room
    rabbit.subscribeGameRoom = function() {
        gameRoomSubscription = client.subscribe(gameRoomsTopic + '.' + gameData.getGameRoomId(),
                                                handleIncomingMessages);
    };


    // invia un messaggio nella game room, utilizzato per notificare all'avversario,
    // se presente, la propria presenza
    rabbit.sendHereMessage = function(needResponseValue) {
        let message = { msgType:     'here',
                        gameRoomId:   gameData.getGameRoomId(),
                        playerId:     gameData.getPlayerId(),
                        nickname:     gameData.getPlayerNickname(),
                        needResponse: needResponseValue,
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
        let message = { msgType:     'ready',
                        gameRoomId:   gameData.getGameRoomId(),
                        playerId:     gameData.getPlayerId(),
                        readyState:   true };

        // permette di creare una queue con nominativo univoco nel broker,
        // composto dal nome passato più una variabile di sessione.
        client.send(gameRoomsTopic + '.' + gameData.getGameRoomId(), // destination
                    { durable: false, exclusive: false },            // headers
                    JSON.stringify(message));                        // message
    };


    // notifica all'avversario l'avvenuto posizionamento di roby
    rabbit.sendPlayerPositionedMessage = function() {
        let message = { msgType:  'playerPositioned',
            gameRoomId: gameData.getGameRoomId(),
            playerId:   gameData.getPlayerId(),
            matchTime:  gameData.getPlayerMatchTime(),
            side:       gameData.getPlayerStartPosition().side,
            distance:   gameData.getPlayerStartPosition().distance };

        if (client !== undefined)
        client.send(gameRoomsTopic + '.' + gameData.getGameRoomId(), // destination
            { durable: false, exclusive: false },                    // headers
            JSON.stringify(message));                                // message
    };


    // invia messaggio al server, per richiedere una nuova disposizione tiles
    rabbit.sendTilesRequest = function() {
        let message = { msgType:     'tilesRequest',
                        gameRoomId:   gameData.getGameRoomId() };

        // permette di creare una queue con nominativo univoco nel broker,
        // composto dal nome passato più una variabile di sessione.
        client.send(serverControlQueue,                    // destination
                    { durable: false, exclusive: false },  // headers
                    JSON.stringify(message));              // message
    };


    // utilizzato nel momento in cui il game tra i due giocatori termina
    let unsubscribeGameRoom = function() {
        gameRoomSubscription.unsubscribe();
    };


    // gestisce le risposte del broker, provenienti dal server o dalla game room
    let handleIncomingMessages = function(responseMessage) {
        let responseObject = JSON.parse(responseMessage.body);

        if (responseObject.msgType === 'gameResponse') {
            serverInitialSubscription.unsubscribe();
            onGameRequestResponse(responseObject);
            startHeartbeat();

        } else if (responseObject.playerId === gameData.getPlayerId()) {
            // si è intercettato il proprio messaggio: non fare niente

        } else {

            // agisci in maniera diversa a seconda della tipologia di messaggio
            switch(responseObject.msgType) {

                case "here":
                    onHereMessage(responseObject);
                    break;

                case "ready":
                    onReadyMessage(responseObject);
                    break;

                case "tilesResponse":
                    onTilesMessage(responseObject);
                    break;

                case "playerPositioned":
                    onEnemyPositionedMessage(responseObject);
                    break;

                case "disconnect":
                    // todo in caso di disconnessione dell'avversario, esci dalla partita
                    unsubscribeGameRoom();
                    clearInterval(heartbeatTimer);
                    break;
            }
        }
    };

    return rabbit;
});

