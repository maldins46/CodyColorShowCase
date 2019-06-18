/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('royaleNewMatchCtrl',
    function ($scope, rabbit, navigationHandler, scopeService, $translate, translationHandler,
              audioHandler, $location, sessionHandler, gameData) {
        console.log("New match royale controller ready.");

        let quitGame = function () {
            rabbit.quitGame();
            gameData.initializeGameData();
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            quitGame();
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        // tenta la connessione, se necessario
        $scope.connected = rabbit.getBrokerConnectionState();
        if (!$scope.connected) {
            rabbit.connect();
        }

        // timer setting selector
        $scope.currentTimerIndex = 1;
        $translate(['15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES']).then(function (translations) {
            $scope.timerSettings = [
                {text: translations['15_SECONDS'], value: 15000},
                {text: translations['30_SECONDS'], value: 30000},
                {text: translations['1_MINUTE'], value: 60000},
                {text: translations['2_MINUTES'], value: 120000}
            ];
        });

        $scope.editTimer = function (increment) {
            audioHandler.playSound('menu-click');
            if (increment)
                $scope.currentTimerIndex = ($scope.currentTimerIndex < 3 ? $scope.currentTimerIndex + 1 : 3);
            else
                $scope.currentTimerIndex = ($scope.currentTimerIndex > 0 ? $scope.currentTimerIndex - 1 : 0);

            gameData.editGeneral({
                timerSetting: $scope.timerSettings[$scope.currentTimerIndex].value
            });
        };


        // start mode selector
        $scope.currentStartIndex = 0;
        $translate(['IN_DATE', 'MANUAL']).then(function (translations) {
            $scope.startSettings = [
                { text: translations['IN_DATE'], value: 0 },
                { text: translations['MANUAL'],  value: 1 }
            ];
        });

        $scope.editStartMode = function () {
            audioHandler.playSound('menu-click');
            if ($scope.currentStartIndex === 0) {
                $scope.currentStartIndex = 1;
            } else {
                $scope.currentStartIndex = 0;
            }
        };

        rabbit.setPageCallbacks({
            onConnectionLost: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope, 'forceExitText', 'FORCE_EXIT');
                    $scope.forceExitModal = true;
                });
            }
        });

        $scope.requestMMaking = function (nicknameValue, gameNameValue, hours, minutes) {
            audioHandler.playSound('menu-click');
            if ($scope.currentStartIndex === 0) {
                if (matchDateValid(hours, minutes)) {
                    let startDateGenerator = new Date();
                    startDateGenerator.setHours(hours, minutes);
                    gameData.editGeneral({
                        startDate: startDateGenerator.getTime()
                    });
                } else {
                    return;
                }
            }
            gameData.editGeneral({
                gameName: gameNameValue,
            });
            gameData.editPlayer({
                nickname: nicknameValue,
                organizer: true
            });
            navigationHandler.goToPage($location, $scope, '/royale-mmaking', false);
        };

        // controlla che l'ora settata come inizio match sia valida
        let matchDateValid = function(hours, minutes) {
            let dateValid = false;
            let now = new Date();

            let nowHours = now.getHours();
            let nowMinutes = now.getMinutes();
            let userHours = parseInt(hours, 10);
            let userMinutes = parseInt(minutes, 10);

            if (nowHours < userHours)
                dateValid = true;

            if (nowHours === userHours && nowMinutes < userMinutes)
                dateValid = true;

            return dateValid;
        };

        // termina la partita alla pressione sul tasto corrispondente
        $scope.exitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = true;
        };
        $scope.continueExitGame = function () {
            audioHandler.playSound('menu-click');
            quitGame();
            navigationHandler.goToPage($location, $scope, '/home', false);
        };
        $scope.stopExitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = false;
        };

        $scope.continueForceExit = function () {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, $scope, '/home', false);
        };

        // impostazioni multi language
        $scope.openLanguageModal = function () {
            $scope.languageModal = true;
            audioHandler.playSound('menu-click');
        };
        $scope.closeLanguageModal = function () {
            $scope.languageModal = false;
            audioHandler.playSound('menu-click');
        };
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
            $scope.languageModal = false;

            $translate(['15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES']).then(function (translations) {
                $scope.timerSettings = [
                    { text: translations['15_SECONDS'], value: 15000  },
                    { text: translations['30_SECONDS'], value: 30000  },
                    { text: translations['1_MINUTE'],   value: 60000  },
                    { text: translations['2_MINUTES'],  value: 120000 }
                ];
            });

            $translate(['IN_DATE', 'MANUAL']).then(function (translations) {
                $scope.startSettings = [
                    { text: translations['IN_DATE'], value: 0 },
                    { text: translations['MANUAL'],  value: 1 }
                ];
            });

            audioHandler.playSound('menu-click');
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
);