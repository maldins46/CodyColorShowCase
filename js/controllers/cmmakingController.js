/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('cmmakingCtrl',
    function ($scope, rabbit, navigationHandler,
              audioHandler, $location, sessionHandler, gameData, scopeService) {
        console.log("Cmmaking controller ready.");

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            rabbit.quitGame();
            gameData.clearGameData();
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        gameData.setGameType('custom');
        $scope.mmakingState = 'joinMatch';

        // tenta la connessione, se necessario
        $scope.connected = rabbit.getConnectionState();
        if (!$scope.connected) {
            rabbit.connect();
        } else {
            console.log("connected in cmmaking; doing your shit");
            if (gameData.getGameCode() !== '0000') {
                $scope.joinMessage = 'Cercando informazioni sulla partita…';
                rabbit.sendGameRequest(false, gameData.getGameCode());
            }
        }

        $scope.goToCreateMatch = function() {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, $scope, "/newcmatch");
        };

        rabbit.setCMMakingCallbacks(function() {
            console.log("connected in cmmaking; doing your shit");
            if (gameData.getGameCode() !== '0000') {
                scopeService.safeApply($scope, function () {
                    $scope.joinMessage = 'Cercando informazioni sulla partita…';
                });
                rabbit.sendGameRequest(false, gameData.getGameCode());
            }

        }, function (message) {
            // onGameRequestResponse
            if(message.code.toString() === '0000') {
                scopeService.safeApply($scope, function () {
                    $scope.joinMessage = 'Il codice inserito non è valido.'
                });
            } else {
                gameData.setGameCode(message.code.toString());
                gameData.setGameRoomId(message.gameRoomId);
                gameData.setPlayerId(message.playerId);
                rabbit.subscribeGameRoom();
                rabbit.sendHereMessage(true);
            }


        }, function (message) {
            // onHereMessage
            gameData.setEnemyNickname(message.nickname);
            gameData.setEnemyReady(message.readyState);
            gameData.setTimerSetting(message.timerSetting);

            if (message.needResponse) {
                rabbit.sendHereMessage(false);
            }

            audioHandler.playSound('enemy-found');
            scopeService.safeApply($scope, function () {
                $scope.enemyNickname = gameData.getEnemyNickname();
                $scope.totTime = gameData.formatTimeEnemyFoundText(gameData.getTimerSetting());
                $scope.mmakingState = 'enemyFound';
            });

        }, function () {
            // onReadyMessage
            gameData.setEnemyReady(true);
            if (gameData.isPlayerReady() && gameData.isEnemyReady())
                rabbit.sendTilesRequest();

        }, function (message) {
            // onTilesMessage
            gameData.setCurrentMatchTiles(message['tiles']);
            navigationHandler.goToPage($location, $scope, '/match', true);

        },  function () {
            // onQuitGameMessage
            scopeService.safeApply($scope, function () {
                $scope.forceExitText = "L'avversario ha abbandonato la partita.";
                $scope.forceExitModal = true;
            });

        }, function () {
            // onConnectionLost
            scopeService.safeApply($scope, function () {
                $scope.forceExitText = "Si è verificato un errore nella connessione con il server. Partita terminata.";
                $scope.forceExitModal = true;
            });


        }, function (response) {
            // onGeneralInfoMessage
            sessionHandler.setTotalMatches(response.totalMatches);
            sessionHandler.setConnectedPlayers(response.connectedPlayers);
            sessionHandler.setRandomWaitingPlayers(response.randomWaitingPlayers);
        });

        $scope.joinMessage = '';
        // click su 'unisciti'
        $scope.joinGame = function(code) {
            audioHandler.playSound('menu-click');
            $scope.joinMessage = 'Cercando informazioni sulla partita…';
            rabbit.sendGameRequest(false, code);
        };

        // click su 'iniziamo'
        $scope.playerReady = function(nickname) {
            $scope.mmakingState = 'waitingConfirm';
            gameData.setPlayerNickname(nickname);
            gameData.setPlayerReady(true);
            rabbit.sendReadyMessage();
        };

        // termina la partita alla pressione sul tasto corrispondente
        $scope.exitGameModal = false;
        $scope.exitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = true;
        };
        $scope.continueExitGame = function() {
            audioHandler.playSound('menu-click');
            rabbit.quitGame();
            navigationHandler.goToPage($location, $scope, '/home', false);
            gameData.clearGameData();
        };
        $scope.stopExitGame = function() {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = false;
        };

        $scope.forceExitModal = false;
        $scope.forceExitText = '';
        $scope.continueForceExit = function() {
            audioHandler.playSound('menu-click');
            rabbit.quitGame();
            navigationHandler.goToPage($location, $scope, '/home', false);
            gameData.clearGameData();
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
);