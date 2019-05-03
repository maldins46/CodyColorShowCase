/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('newcmatchCtrl',
    function ($scope, rabbit, navigationHandler, scopeService,
              audioHandler, $location, sessionHandler, gameData) {
        console.log("Empty controller ready.");

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        // tenta la connessione, se necessario
        $scope.connected = rabbit.getConnectionState();
        if (!$scope.connected) {
            rabbit.connect();
        }

        $scope.mmakingState = 'createMatch';
        $scope.gameCode = '0000';
        $scope.timerSettings = [ { text: '15 secondi', value: 15000 }, { text: '30 secondi', value: 30000 },
                                 { text: '1 minuto', value: 60000 }, { text: '2 minuti', value: 120000 } ];
        $scope.currentIndex = 1;
        $scope.incrementTime = function() {
            if ($scope.currentIndex < 3)
                $scope.currentIndex++;
            else
                $scope.currentIndex = 3;

            gameData.setTimerSetting($scope.timerSettings[$scope.currentIndex].value);
        };
        $scope.decrementTime = function() {
            if ($scope.currentIndex > 0)
                $scope.currentIndex--;
            else
                $scope.currentIndex = 0;

            gameData.setTimerSetting($scope.timerSettings[$scope.currentIndex].value);
        };

        rabbit.setNewCMatchCallbacks(function (message) {
            // onGameRequestResponse
            gameData.setGameRoomId(message.gameRoomId);
            gameData.setPlayerId(message.playerId);
            gameData.setGameCode(message.code.toString());
            rabbit.subscribeGameRoom();

            scopeService.safeApply($scope, function () {
                $scope.gameCode = message.code.toString();
                $scope.mmakingState = 'enemyInvitation';
            });

        }, function (message) {
            // onHereMessage
            if (message.needResponse) {
                rabbit.sendHereMessage(false);
            }

        }, function (message) {
            // onReadyMessage
            gameData.setEnemyNickname(message.nickname);
            gameData.setEnemyReady(message.readyState);

            if (message.needResponse) {
                rabbit.sendHereMessage(false);
            }

            scopeService.safeApply($scope, function () {
                $scope.enemyNickname = gameData.getEnemyNickname();
                $scope.mmakingState = 'enemyFound';
            });

            gameData.setEnemyReady(true);
            if (gameData.isPlayerReady() && gameData.isEnemyReady())
                rabbit.sendTilesRequest();

        }, function (message) {
            // onTilesMessage
            gameData.setCurrentMatchTiles(message['tiles']);
            navigationHandler.goToPage($location, $scope, '/match', true);

        }, function () {
            // onQuitGameMessage
            rabbit.quitGame();
            navigationHandler.goToPage($location, $scope, '/home', true);
            gameData.clearGameData();
            alert("L'avversario ha abbandonato la partita.");

        }, function () {
            // onConnectionLost
            rabbit.quitGame();
            navigationHandler.goToPage($location, $scope, '/home', true);
            gameData.clearGameData();
            alert("Si è verificato un errore nella connessione con il server. Partita terminata.");
        });

        // tasto iniziamo
        $scope.playerReady = function() {
            $scope.mmakingState = 'waitingConfirm';
            gameData.setPlayerReady(true);
            rabbit.sendReadyMessage();
        };

        $scope.creatingMatch = false;
        $scope.requestMMaking = function(nickname) {
            gameData.setPlayerNickname(nickname);
            rabbit.sendGameRequest(true);
            $scope.creatingMatch = true;
        };

        $scope.linkCopied = false;
        $scope.codeCopied = false;
        $scope.copyLink = function() {
            copyStringToClipboard('https://codycolor.codemooc.net/#!?match=' + gameData.getGameCode());
            $scope.linkCopied = true;
            $scope.codeCopied = false;
        };
        $scope.copyCode = function() {
            copyStringToClipboard(gameData.getGameCode());
            $scope.linkCopied = false;
            $scope.codeCopied = true;
        };

        // termina la partita in modo sicuro, alla pressione sul tasto corrispondente
        $scope.exitGame = function () {
            if (confirm("Sei sicuro di voler abbandonare la partita?")) {
                rabbit.quitGame();
                navigationHandler.goToPage($location, $scope, '/home');
                gameData.clearGameData();
            }
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.getBaseState();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.getBaseState();
        };


        let copyStringToClipboard  = function(text) {
            // Create new element
            let el = document.createElement('textarea');
            // Set value (string to be copied)
            el.value = text;
            // Set non-editable to avoid focus and move outside of view
            el.setAttribute('readonly', '');
            el.style = {position: 'absolute', left: '-9999px'};
            document.body.appendChild(el);
            // Select text inside element
            el.select();
            // Copy text to clipboard
            document.execCommand('copy');
            // Remove temporary element
            document.body.removeChild(el);
        }
    }
);