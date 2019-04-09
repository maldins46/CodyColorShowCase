/*
 * RabbitCommunicator module: service che si occupa dell'interazione 
 * con il broker, esponendo funzioni utili
 */

function rabbit() {

    var rabbit = {};

    // queue utilizzate per comunicare con il server
    var serverControlQueue = "/queue/serverControl";
    var clientControlTopic = "/topic/clientsControl";
    var gameRoomsTopic     = "/topic/gameRooms";

    // crea il messaggio da utilizzare come richiesta di connessione
    var uniqueClientId = (Math.floor(Math.random() * 100000)).toString();

    // oggetto utilizzato per mantenere dati relativi alla sessione di gioco, quali
    // la gameRoom corrente e l'id del giocatore all'interno della gameRoom
    var gameSessionData;

    // riconosce se il client è connesso a rabbit al momento, oppure no
    var connected;
    var client;

    rabbit.getConnectionState = function() {
        if(connected == undefined)
            connected = false;
        
        return connected;
    }


    // effettua la richiesta di connessione al broker. In caso di connessione
    // completata, sottoscrive il topic di controllo utilizzato per le risposte dal server
    rabbit.connect = function(extConnectedCallback, extErrorCallback) { 
        
        //var ws = new WebSocket('ws://127.0.0.1:15674/ws');
        client = Stomp.client('ws://127.0.0.1:15674/ws');
        client.connect('guest', 'guest',                                       // credenziali 
                       function() { connectedCallback(extConnectedCallback) }, // onConnect  
                       function() { errorCallback(extErrorCallback) },         // onError       
                       '/');                                                   // vHost
    };


    // invia al server una richiesta di nuova partita
    rabbit.sendMatchRequest = function(doOnResponse) {
        console.log("Connessione a RabbitMQ completata.");
        var message = { msgType: "matchRequest", 'correlationId':  this.uniqueClientId };

        // permette di creare una queue con nominativo univoco nel broker,
        // composto dal nome passato più una variabile di sessione.
        client.send(this.serverControlQueue, 
                         { durable: false, exclusive: false }, 
                         JSON.stringify(message));
    }


    function connectedCallback(extConnectedCallback) {
        console.log("Connessione a RabbitMQ completata.");
        connected = true;

        // sottoscrive la queue temporanea in attesa della risposta del server
        client.subscribe(clientControlTopic + '.' + uniqueClientId, 
                         handleServerResponse);

        // azioni addizionali da compiere a connessione completata, passate dall'esterno
        extConnectedCallback();
    }


    function errorCallback(extErrorCallback) {
        console.log("Connessione a RabbitMQ non riuscita.");
        connected = false;
        extErrorCallback();
    }


    // gestisce le risposte del broker, in particolare quelle provenienti dal server
    function handleServerResponse(responseMessage) {
        var responseObject = JSON.parse(responseMessage.body);

        // agisci in maniera diversa a seconda della tipologia di messaggio
        switch(responseObject.msgType) {
            case "matchRequest":
                this.gameSessionData = { gameRoom: responseObject.gameRoom, 
                                         playerId: responseObject.playerId };
                break;   

            case "randTiles":
                // memorizza dati tiles?
                break;
        }            
        //doOnResponse(responseObject);
    }

    return rabbit;
};

angular.module('codyColor').factory("rabbit", rabbit);
