/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('createMatchCtrl', ['$scope', 'rabbit', 'navigationHandler',
    'scopeService', '$translate', 'translationHandler', 'audioHandler', '$location', 'sessionHandler', 'gameData', '$http', 'settings', 'authHandler',
    function ($scope, rabbit, navigationHandler, scopeService, $translate, translationHandler,
              audioHandler, $location, sessionHandler, gameData, $http, settings, authHandler) {

        // validazione sessione
        navigationHandler.initializeBackBlock($scope);

        // cambia schermata (senza lasciare la pagina) evitando flickering durante le animazioni
        let changeScreen = function (newScreen) {
            scopeService.safeApply($scope, function () {
                $scope.loginState = screens.loadingScreen;
            });
            setTimeout(function () {
                scopeService.safeApply($scope, function () {
                    $scope.loginState = newScreen;
                });
            }, 200);
        };

        const screens = {
            loadingScreen:     'loadingScreen',    // schermata di transizione
            login:             'login',            // schermata di login (gestita con FirebaseUi)
            profile:           'profile',          // schermata profilo utente
        };
        $scope.screens = screens;
        $scope.timeFormatter = gameData.formatTimeDecimals;

        // inizializza il flusso di autenticazione disabilitando la cookie authentication,
        // in quanto si potrebbe provenire da pendingRedirect
        authHandler.initializeAuth();
        authHandler.initializeUi();
        authHandler.disableCookieSignIn();

        if (sessionHandler.isSessionInvalid() && authHandler.isPendingRedirect()) {
            // flusso di autenticazione in corso: avvia l'interfaccia utente
            $scope.pendingRedirect = true;
            sessionHandler.validateSession();
            changeScreen(screens.login);
            authHandler.startUi();

        } else if (sessionHandler.isSessionInvalid()) {
            // sessione non valida: redirect alla schermata iniziale
            navigationHandler.goToPage($location, '/');
            return;

        } else if (authHandler.loginCompleted()) {
            // utente già autenticato: mostra profile screen, richiedi al server Digit statistiche aggiornate
            $scope.firebaseUserData = authHandler.getFirebaseUserData();
            $scope.serverUserData = authHandler.getServerUserData();
            $scope.pendingRedirect = false;
            rabbit.sendLogInRequest();
            changeScreen(screens.profile);

        } else {
            // utente non autenticato: mostra login screen
            $scope.pendingRedirect = false;
            changeScreen(screens.login);
            authHandler.startUi();
        }

        // testo iniziale visualizzato in fondo a dx
        $scope.userLogged = authHandler.loginCompleted();
        if (authHandler.loginCompleted()) {
            $scope.userNickname = authHandler.getServerUserData().name;
        }

        // avvia la connessione al broker se necessario
        if (!rabbit.getServerConnectionState())
            rabbit.connect();

        authHandler.setAuthCallbacks({
            onFirebaseSignIn: function(authResult) {
                // cosa fare a autenticazione tramite FirebaseAuth completata.
                console.log("Sign in with FirebaseUI completed.");
                authHandler.setFirebaseUserData(authResult.user);

                // se l'utente è nuovo, va completato il flusso di sign in...
                if (authResult.additionalUserInfo.isNewUser) {
                    // ...verificando che l'email sia di un utente registrato Codemooc.net
                    console.log("New user. Query to member verification API...");

                    authHandler.queryMemberVerificationApi(authResult.user.email, {
                        onQuerySuccess: function (response) {
                            scopeService.safeApply($scope, function () {
                                // se la risposta dall'API è affermativa...
                                if (response.data.isMember) {
                                    // ...salvare i dati in cache, ed effettuare una signUp request al server Digit
                                    console.log("Query to member verification API completed with success. Creating user cache, sending sign up request to digit server...");
                                    rabbit.sendSignUpRequest(response.data.name, response.data.surname);

                                } else {
                                    // risposta negativa dell'API. Utente probabilmente registrato in precedenza (su codemooc), ma ora non più socio.
                                    // interrompi il flusso di sign in: mostra errore, vai a schermata login, elimina l'account (firebaseAuth)
                                    console.log("Query to member verification API with negative response. Deleting account firebaseAuth.");
                                    authHandler.deleteAccount();

                                    translationHandler.setTranslation($scope, 'singleOptionText', 'ERR_CODEMOOC');
                                    $scope.singleOptionModal = true;
                                    $scope.firebaseUserData = undefined;
                                    $scope.serverUserData = undefined;
                                    $scope.pendingRedirect = false;

                                    authHandler.logout();
                                    authHandler.initializeUi();
                                    authHandler.startUi();
                                    changeScreen(screens.login);
                                }
                            });
                        }, onQueryError: function () {
                            scopeService.safeApply($scope, function () {
                                // errore 404 dell'API: L'email non appartiene a un socio
                                // altro errore: errore nella comunicazione
                                // interrompi il flusso di sign in: mostra errore, vai a schermata login, elimina l'account (firebaseAuth)
                                console.log("Query to member verification API with connection error. Deleting account firebaseAuth.");
                                authHandler.deleteAccount();

                                translationHandler.setTranslation($scope, 'singleOptionText', 'ERR_CODEMOOC');
                                $scope.singleOptionModal = true;
                                $scope.firebaseUserData = undefined;
                                $scope.serverUserData = undefined;
                                $scope.pendingRedirect = false;

                                authHandler.logout();
                                authHandler.initializeUi();
                                authHandler.startUi();
                                changeScreen(screens.login);
                            });
                        }
                    });

                } else {
                    // LOGIN: se l'account è già presente, va completato il flusso di log in con lo scambio col server
                    console.log("User registered yet on firebaseAuth. Completing login on server...");
                    rabbit.sendLogInRequest();

                    authHandler.queryMemberVerificationApi(authResult.user.email, {
                        onQuerySuccess: function (response) {
                            scopeService.safeApply($scope, function () {
                                // se la risposta dall'API è affermativa...
                                if (!response.data.isMember) {
                                    // si ha un account, già registrato anche sul server Digit, ma che
                                    // non è più valido su codemooc. Avvisa l'utente di rinnovare l'iscrizione
                                    console.log("Query to member verification API with error response. User warning.");

                                    translationHandler.setTranslation($scope, 'singleOptionText', 'ERR_CODEMOOC_EXPIRED');
                                    $scope.singleOptionModal = true;
                                }
                            });
                        }, onQueryError: function () {
                            // API error. Avvisa l'utente
                            console.log("Query to member verification API with error response. User warning.");

                            translationHandler.setTranslation($scope, 'singleOptionText', 'ERR_CODEMOOC_EXPIRED');
                            $scope.singleOptionModal = true;
                        }
                    });
                }

            }, onFirebaseSignInError: function(error) {
                // invocato in caso di errore durante il flusso di sign in firebaseAuth
                // mostra il dialog modale corrispondente e la schermata iniziale
                scopeService.safeApply($scope, function () {
                    console.log("FirebaseAuth error. Simple logout.");

                    translationHandler.setTranslation($scope, 'singleOptionText', 'ERR_LOGIN');
                    $scope.singleOptionModal = true;
                    $scope.firebaseUserData = undefined;
                    $scope.serverUserData = undefined;
                    $scope.pendingRedirect = false;

                    console.log(error.toString());
                    authHandler.logout();
                    authHandler.initializeUi();
                    authHandler.startUi();
                    changeScreen(screens.login);
                });

            }, onFirebaseSignOut: function() {
                // invocato a logout completato, sia da firebaseAuth che dal server.
                // completa il flusso, eliminando i dati utente nello scope e mostrando la schermata di login
                scopeService.safeApply($scope, function () {
                    $scope.firebaseUserData = undefined;
                    $scope.serverUserData = undefined;
                    $scope.userLogged = false;
                    $scope.pendingRedirect = false;

                    authHandler.initializeUi();
                    authHandler.startUi();
                    changeScreen(screens.login);
                });

            }, onFirebaseUserDeleted: function() {
                // invocato a eliminazione utente completata, sia da firebaseAuth che dal server.
                // completa il flusso mostrando la schermata di login
                scopeService.safeApply($scope, function () {
                    $scope.firebaseUserData = undefined;
                    $scope.serverUserData = undefined;
                    $scope.userLogged = false;
                    $scope.pendingRedirect = false;

                    authHandler.initializeUi();
                    authHandler.startUi();
                    changeScreen(screens.login);
                });

            }, onFirebaseUserDeletedError: function(error) {
                // invocato in caso di errore durante il flusso di eliminazione
                // mostra il dialog modale corrispondente
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope, 'singleOptionText', 'ERR_DELETE');
                    $scope.singleOptionModal = true;
                });

            }, onPrivacyClick: function () {
                scopeService.safeApply($scope, function () {
                    navigationHandler.goToPage($location, '/privacy',);
                });

            }, onTosClick: function () {
                scopeService.safeApply($scope, function () {
                    navigationHandler.goToPage($location, '/terms');
                });

            }, onUiShown: function () {
                $scope.safeApply($scope, function () {
                    $scope.pendingRedirect = false;
                });
            }
        });

        rabbit.setPageCallbacks({
            onGeneralInfoMessage: function () {
                scopeService.safeApply($scope, function () {
                    if (!sessionHandler.isWallVersionValid())
                        $scope.outdatedClient = true;

                    $scope.connected = true;
                });

            }, onConnectionLost: function () {
                scopeService.safeApply($scope, function () {
                    $scope.connected = false;
                });

            }, onLogInResponse: function(message) {
                scopeService.safeApply($scope, function () {
                    // risposta del server alla registrazione/autenticazione di un utente
                    if (message.success) {
                        // message.success === true indica che la registrazione è avvenuta con successo. Mostra
                        // quindi la schermata profilo popolata adeguatamente
                        console.log("Digit server positive login/signin response, or updated user stats. Welcome, User.");
                        authHandler.setServerUserData({
                            name: message.name,
                            surname: message.surname,
                            playerMatches: message.playerMatches,
                            bestMatchBot: message.bestMatchBot,
                            bestMatchHuman: message.bestMatchHuman
                        });

                        $scope.firebaseUserData = authHandler.getFirebaseUserData();
                        $scope.serverUserData = authHandler.getServerUserData();
                        $scope.userLogged = true;
                        $scope.userNickname = authHandler.getServerUserData().name;

                        if ($scope.loginState !== screens.profile)
                            changeScreen(screens.profile);

                    } else {
                        // message.success === false indica che non è presente un record utente nel db server
                        // Mostra quindi un messaggio di errore, rimuovi l'account firebaseAuth, e rimanda alla schermata di login
                        console.log("Digit server negative login/signin response. No data into the server. Removing from FirebaseAuth");

                        translationHandler.setTranslation($scope, 'singleOptionText', 'ERR_LOGIN');
                        $scope.singleOptionModal = true;
                        $scope.firebaseUserData = undefined;
                        $scope.serverUserData = undefined;
                        $scope.pendingRedirect = false;

                        authHandler.deleteAccount();
                        authHandler.initializeUi();
                        authHandler.startUi();
                        changeScreen(screens.login);
                    }
                });

            }, onUserDeletedResponse: function(message) {
                // continua il flusso di eliminazione account; nel caso i dati siano stati rimossi con successo dal
                // db server rimuovi anche i dati da firebaseAuth, e vai alla schermata di login
                console.log("Digit server userDelete response. Completing flow removing user from FirebaseAuth");
                if (message.success) {
                    authHandler.deleteAccount();

                } else {
                    // in caso di errore, mostra il dialog modale
                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'singleOptionText', 'ERR_DELETE');
                        $scope.singleOptionModal = true;
                    });
                }
            }
        });

        // click sul tasto logout della schermata profile. Mostra il dialog modale di conferma. In caso
        // di conferma, avvia il flusso di logout
        $scope.logout = function() {
            audioHandler.playSound('menu-click');
            translationHandler.setTranslation($scope, 'multiOptionsText', 'SURE_TO_LOGOUT');
            $scope.multiOptionsModal = true;
            $scope.multiOptionsOk = function() {
                audioHandler.playSound('menu-click');
                authHandler.logout();
                $scope.multiOptionsModal = false;
            };
        };

        // click sul tasto eliminazione account della schermata profile. Mostra il dialog modale di conferma. In caso
        // di conferma, avvia il flusso di eliminazione account
        $scope.deleteAccount = function() {
            audioHandler.playSound('menu-click');
            translationHandler.setTranslation($scope, 'multiOptionsText', 'SURE_TO_DELETE');
            $scope.multiOptionsModal = true;
            $scope.multiOptionsOk = function() {
                audioHandler.playSound('menu-click');
                rabbit.sendUserDeleteRequest();
                $scope.multiOptionsModal = false;
            };
        };

        // gestione dialog modale con due opzioni (ok e cancel)
        $scope.multiOptionsText = '';
        $scope.multiOptionsModal = false;
        $scope.multiOptionsCancel = function () {
            audioHandler.playSound('menu-click');
            $scope.multiOptionsModal = false;
        };

        // gestione dialog modale a opzione singola (ok)
        $scope.singleOptionText = '';
        $scope.singleOptionModal = false;
        $scope.singleOptionOk = function() {
            audioHandler.playSound('menu-click');
            $scope.singleOptionModal = false;
        };

        $scope.connected = rabbit.getServerConnectionState();
        $scope.creatingMatch = false;
        $scope.wallVersion = sessionHandler.getWallVersion();

        let setSelectorTranslations = function() {
            $translate(['15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES']).then(function (translations) {
                $scope.timerSettings = [
                    {text: translations['15_SECONDS'], value: 15000},
                    {text: translations['30_SECONDS'], value: 30000},
                    {text: translations['1_MINUTE'], value: 60000},
                    {text: translations['2_MINUTES'], value: 120000}
                ];
            });

            $translate(['AI_EASY', 'AI_MEDIUM', 'AI_HARD']).then(function (translations) {
                $scope.diffSettings = [
                    {text: translations['AI_EASY'], value: 0},
                    {text: translations['AI_MEDIUM'], value: 1},
                    {text: translations['AI_HARD'], value: 2},
                ];
            });

            $translate(['CUSTOM', 'ROYALE']).then(function (translations) {
                $scope.gameModeSettings = [
                    { text: translations['CUSTOM'], value: gameData.getGameTypes().custom },
                    { text: translations['ROYALE'], value: gameData.getGameTypes().royale },
                ];
            });
        };
        setSelectorTranslations();

        // diff selector
        gameData.getGeneral().diffSetting = 1;
        $scope.diffIndex = 1;
        $scope.editDiff = function (increment) {
            if (increment)
                $scope.diffIndex = ($scope.diffIndex < 2 ? $scope.diffIndex + 1 : 2);
            else
                $scope.diffIndex = ($scope.diffIndex > 0 ? $scope.diffIndex - 1 : 0);
        };

        // timer selector
        $scope.timerIndex = 1;
        $scope.editTimer = function (increment) {
            if (increment)
                $scope.timerIndex = ($scope.timerIndex < 3 ? $scope.timerIndex + 1 : 3);
            else
                $scope.timerIndex = ($scope.timerIndex > 0 ? $scope.timerIndex - 1 : 0);
        };

        // gameMode selector
        $scope.gameModeIndex = 0;
        $scope.editGameMode = function () {
            if ($scope.gameModeIndex === 0)
                $scope.gameModeIndex = 1;
            else
                $scope.gameModeIndex = 0;
        };

        $scope.wrongCredentials = false;
        $scope.createMatch = function () {
            gameData.editFixedSettings({
                nickname: $scope.username,
                botSetting: $scope.diffSettings[$scope.diffIndex].value,
                timerSetting: $scope.timerSettings[$scope.timerIndex].value,
                gameType: $scope.gameModeSettings[$scope.gameModeIndex].value
            });

            if ($scope.gameModeSettings[$scope.gameModeIndex].value === gameData.getGameTypes().custom)
                navigationHandler.goToPage($location, '/custom-mmaking');
            else
                navigationHandler.goToPage($location, '/royale-mmaking');
        };

        $scope.outdatedClient = false;

        // impostazioni multi language
        $scope.openLanguageModal = function() {
            audioHandler.playSound('menu-click');
            $scope.languageModal = true;
        };

        $scope.closeLanguageModal = function() {
            audioHandler.playSound('menu-click');
            $scope.languageModal = false;
        };

        $scope.changeLanguage = function(langKey) {
            audioHandler.playSound('menu-click');
            $translate.use(langKey);
            $scope.languageModal = false;
            setSelectorTranslations();
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
]);