/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('createMatchCtrl', ['$scope', 'rabbit', 'navigationHandler',
    'scopeService', '$translate', 'translationHandler', 'audioHandler', '$location', 'sessionHandler', 'gameData',
    function ($scope, rabbit, navigationHandler, scopeService, $translate, translationHandler,
              audioHandler, $location, sessionHandler, gameData) {
        console.log("Create match controller ready.");

        // validazione sessione
        navigationHandler.initializeBackBlock($scope);
        sessionHandler.validateSession();

        if (!rabbit.getServerConnectionState())
            rabbit.connect();

        $scope.connected = rabbit.getServerConnectionState();
        $scope.creatingMatch = false;

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

            gameData.getFixedSetting().botName = $scope.username;
            gameData.getFixedSetting().diffSetting = $scope.diffSettings[$scope.diffIndex].value;
            gameData.getFixedSetting().timerSetting = $scope.timerSettings[$scope.timerIndex].value;

            // todo flusso autenticazione. Provvisoriamente, vengono accettate a priori le credenziali:
            // username: CodyColor, password: d1g1t
            if ($scope.username === 'CodyColor' && $scope.password === 'd1g1t') {
                audioHandler.initializeAudio($scope.audioSettings[$scope.audioIndex].value);
                navigationHandler.goToPage($location, '/mmaking');

            } else {
                $scope.wrongCredentials = true;
            }
        };

        $scope.outdatedClient = false;
        rabbit.setPageCallbacks({
            onGeneralInfoMessage: function () {
                if (!sessionHandler.isClientVersionValid()) {
                    scopeService.safeApply($scope, function () {
                        $scope.outdatedClient = true;
                    });
                }
                scopeService.safeApply($scope, function () {
                    $scope.connected = true;
                });
            },
            onConnectionLost: function () {
                scopeService.safeApply($scope, function () {
                    $scope.connected = false;
                });
            }
        });
    }
]);