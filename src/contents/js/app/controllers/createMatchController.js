/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('createMatchCtrl', ['$scope', 'rabbit', 'navigationHandler',
    'scopeService', '$translate', 'translationHandler', 'audioHandler', '$location', 'sessionHandler', 'gameData', '$http',
    function ($scope, rabbit, navigationHandler, scopeService, $translate, translationHandler,
              audioHandler, $location, sessionHandler, gameData, $http) {

        // validazione sessione
        navigationHandler.initializeBackBlock($scope);
        sessionHandler.validateSession();

        if (!rabbit.getServerConnectionState())
            rabbit.connect();

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

            $translate(['LANG_ENGLISH', 'LANG_ITALIAN']).then(function (translations) {
                $scope.langSettings = [
                    {text: translations['LANG_ENGLISH'], value: 'en'},
                    {text: translations['LANG_ITALIAN'], value: 'it'},
                ];
            });

            $translate(['AUDIO_OFF', 'AUDIO_ON']).then(function (translations) {
                $scope.audioSettings = [
                    {text: translations['AUDIO_OFF'], value: false},
                    {text: translations['AUDIO_ON'], value: true},
                ];
            });

            $translate(['AI_EASY', 'AI_MEDIUM', 'AI_HARD']).then(function (translations) {
                $scope.diffSettings = [
                    {text: translations['AI_EASY'], value: 0},
                    {text: translations['AI_MEDIUM'], value: 1},
                    {text: translations['AI_HARD'], value: 2},
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

        // audio selector
        $scope.audioIndex = 0;
        $scope.editAudio = function (increment) {
            if (increment)
                $scope.audioIndex = ($scope.audioIndex < 1 ? $scope.audioIndex + 1 : 0);
            else
                $scope.audioIndex = ($scope.audioIndex > 0 ? $scope.audioIndex - 1 : 1);
        };

        // language selector
        $scope.langIndex = ($translate.use() === 'en' ? 0 : 1);
        $scope.editLang = function (increment) {
            if (increment)
                $scope.langIndex = ($scope.langIndex < 1 ? $scope.langIndex + 1 : 0);
            else
                $scope.langIndex = ($scope.langIndex > 0 ? $scope.langIndex - 1 : 1);

            $translate.use($scope.langSettings[$scope.langIndex].value);
            setSelectorTranslations();
        };

        $scope.wrongCredentials = false;
        $scope.createMatch = function () {
            $scope.wrongCredentials = false;

            // dummy credentials
            if (($scope.email === 'CodyColor' && $scope.password === 'd1g1t') ||
                ($scope.email === 'CodyRoby' && $scope.password === 'compleanno') ) {
                startMatch();

            } else {
                let url = "https://dev.codemooc.net/api/members/verify?email=" + $scope.email;
                let headers = {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic " + window.btoa($scope.email + ":" + $scope.password),
                    "Access-Control-Allow-Origin": "https://dev.codemooc.net",
                    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
                };

                $http.post(url, {headers: headers})
                    .then(function (response) {
                        scopeService.safeApply($scope, function () {
                            let isMember = JSON.parse(response.data).isMember;
                            if (isMember) {
                                startMatch();
                            } else {
                                $scope.wrongCredentials = true;
                            }
                        });
                });
            }
        };

        let startMatch = function() {
            gameData.editFixedSettings({
                nickname: $scope.username,
                botSetting: $scope.diffSettings[$scope.diffIndex].value,
                timerSetting: $scope.timerSettings[$scope.timerIndex].value
            });
            audioHandler.initializeAudio($scope.audioSettings[$scope.audioIndex].value);
            navigationHandler.goToPage($location, '/mmaking');
        };


        $scope.outdatedClient = false;
        rabbit.setPageCallbacks({
            onGeneralInfoMessage: function () {
                scopeService.safeApply($scope, function () {
                    if (!sessionHandler.isWallVersionValid()) {
                        $scope.outdatedClient = true;
                    }

                    $scope.connected = true;
                });

            }, onConnectionLost: function () {
                scopeService.safeApply($scope, function () {
                    $scope.connected = false;
                });
            }
        });
    }
]);