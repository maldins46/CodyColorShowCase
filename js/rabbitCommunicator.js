/*
 * RabbitCommunicator module: service che si occupa dell'interazione 
 * con il broker, esponendo funzioni utili
 */

angular.module('codyColor').factory("rabbit",function(gameData) {

    var rabbit = {};

    // queue utilizzate per comunicare con il server
    var serverControlQueue = "/queue/serverControl";
    var clientControlTopic = "/topic/clientsControl";
    var gameRoomsTopic     = "/topic/gameRooms";

    // crea il messaggio da utilizzare come richiesta di connessione
    var uniqueClientId;

    // oggetto utilizzato per mantenere dati relativi alla sessione di gioco, quali
    // la gameRoom corrente e l'id del giocatore all'interno della gameRoom
    var gameSessionData;

    // riconosce se il client è connesso a rabbit al momento, oppure no
    var connected;
    var client;

    // callback passati dal controller, utilizzati per eseguire del
    // codice all'arrivo di nuovi messaggi
    var onGameRequestResponse;
    var onHereMessage;
    var onReadyMessage;
    var onTilesMessage;

    // timer di heartbeat
    var heartbeatTimer;

    // riferimenti alla subscription
    var serverInitialSubscription;
    var gameRoomSubscription;


    function getUniqueClientId() {
        if(uniqueClientId == undefined)
            uniqueClientId = (Math.floor(Math.random() * 100000)).toString();

        return uniqueClientId;
    }



    rabbit.getConnectionState = function() {
        if(connected == undefined)
            connected = false;
        
        return connected;
    }


    // passa i callback necessari per il matchmaking
    rabbit.setMMakingCallbacks = function(onGameRequestResponseMM, onHereMessageMM, onReadyMessageMM, onTilesMessageMM) {
        onGameRequestResponse = onGameRequestResponseMM;
        onHereMessage         = onHereMessageMM;
        onReadyMessage        = onReadyMessageMM;
        onTilesMessage        = onTilesMessageMM;
    }


    // effettua la richiesta di connessione al broker. In caso di connessione
    // completata, sottoscrive il topic di controllo utilizzato per le risposte dal server
    rabbit.connect = function(extConnectedCallback, extErrorCallback) { 
        client = Stomp.client('ws://127.0.0.1:15674/ws');
        client.connect('guest', 'guest',                                       // credenziali 
                       function() { connectedCallback(extConnectedCallback) }, // onConnect  
                       function() { errorCallback(extErrorCallback) },         // onError       
                       '/');                                                   // vHost
    };


    // invia al server una richiesta di nuova partita
    rabbit.sendGameRequest = function() {
        var message = { msgType:      'gameRequest', 
                        correlationId: getUniqueClientId()
                      };

        // permette di creare una queue con nominativo univoco nel broker,
        // composto dal nome passato più una variabile di sessione.
        client.send(serverControlQueue,                   // destination
                    { durable: false, exclusive: false }, // headers
                    JSON.stringify(message));             // message
    }


    function startHeartbeat() {
        heartbeatTimer = setInterval(function() {
            var message = { msgType:     'heartbeat', 
                            gameRoomId:   gameData.getGameRoomId(),
                            playerId:     gameData.getPlayerId()
                          };

            client.send(serverControlQueue,                   // destination
                        { durable: false, exclusive: false }, // headers
                        JSON.stringify(message));             // message
        }, 5000);
    }
    

    // pone il client in ascolto di messaggi sulla game room
    rabbit.subscribeGameRoom = function() {
        gameRoomSubscription = client.subscribe(gameRoomsTopic + '.' + gameData.getGameRoomId(), 
                                                handleIncomingMessages);
    }


    // invia un messaggio nella game room, utilizzato per notificare all'avversario,
    // se presente, la propria presenza
    rabbit.sendHereMessage = function(needResponseValue) {
        var message = { msgType:     'here',
                        gameRoomId:   gameData.getGameRoomId(),
                        playerId:     gameData.getPlayerId(),
                        nickname:     gameData.getPlayerNickname(),
                        needResponse: needResponseValue,
                        readyState:   gameData.isPlayerReady()      
                      };

        // permette di creare una queue con nominativo univoco nel broker,
        // composto dal nome passato più una variabile di sessione.
        client.send(gameRoomsTopic + '.' + gameData.getGameRoomId(), // destination
                    { durable: false, exclusive: false },            // headers
                    JSON.stringify(message));                        // message
    }


    // invia messaggio alla game room, utilizzato per notificare all'avversario che si
    // è pronti a giocare
    rabbit.sendReadyMessage = function() {
        var message = { msgType:     'ready',
                        gameRoomId:   gameData.getGameRoomId(),
                        playerId:     gameData.getPlayerId(),
                        readyState:   true   
                      };

        // permette di creare una queue con nominativo univoco nel broker,
        // composto dal nome passato più una variabile di sessione.
        client.send(gameRoomsTopic + '.' + gameData.getGameRoomId(), // destination
                    { durable: false, exclusive: false },            // headers
                    JSON.stringify(message));                        // message
    }


    // invia messaggio al server, per richiedere una nuova disposizione delle tiles
    rabbit.sendTilesRequest = function() {
        var message = { msgType:     'tilesRequest',
                        gameRoomId:   gameData.getGameRoomId() 
                      };

        // permette di creare una queue con nominativo univoco nel broker,
        // composto dal nome passato più una variabile di sessione.
        client.send(serverControlQueue,                    // destination
                    { durable: false, exclusive: false },  // headers
                    JSON.stringify(message));              // message
    }


    // una volta avvenuta la connessione con il broker, va sottoscritta la queue temporanea
    // utilizzata per intercettare la risposta del server, quando ancora non si è stati
    // identificati da esso
    function connectedCallback(extConnectedCallback) {
        console.log("Connessione a RabbitMQ completata.");
        connected = true;

        serverInitialSubscription = client.subscribe(clientControlTopic + '.' + getUniqueClientId(), 
                                                     handleIncomingMessages);

        // eventuali azioni addizionali da compiere a connessione completata
        if(extConnectedCallback != undefined)
            extConnectedCallback();
    }


    // tentativo di riconnessione?
    function errorCallback(extErrorCallback) {
        console.log("Connessione a RabbitMQ non riuscita.");
        connected = false;

        // eventuali azioni addizionali da compiere a connessione completata
        if(extErrorCallback != undefined)
            extErrorCallback();
    }


    // utilizzato nel momento in cui il game tra i due giocatori termina
    function unsubscribeGameRoom() {
        gameRoomSubscription.unsubscribe();
    }


    // gestisce le risposte del broker, in particolare quelle provenienti dal server
    function handleIncomingMessages(responseMessage) {
        var responseObject = JSON.parse(responseMessage.body);

        if(responseObject.msgType == "gameResponse") {
            serverInitialSubscription.unsubscribe();
            onGameRequestResponse(responseObject);
            startHeartbeat();
        
        } else {
            if (responseObject.playerId == gameData.getPlayerId()) return;

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

                case "disconnect":
                    // da implementare: in caso di disconnessione dell'avversario,
                    // esci dalla partita
                    unsubscribeGameRoom();
                    clearInterval(heartbeatTimer);
                    break;    
            }
        }

        
    }

    return rabbit;
});

