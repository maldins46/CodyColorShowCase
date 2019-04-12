/*
 * Controllers: codice responsabile del binding e del collegamento al model delle varie schermate
 */

var app = angular.module('codyColor');


/* 
 * Controller Splash Screen, la schermata mostrata non appena si accede al sito
 */
app.controller('splashCtrl', function($scope, rabbit) {
	console.log("Controller splash ready.");
	rabbit.connect();

});


/* 
 * Controller Home, il menù principale
 */
app.controller('homeCtrl', function($scope, rabbit) {
	console.log("Controller home ready.");

	// perché lo scope? ***È UN SORPRENDENTE STRUMENTO CHE CI SERVIRA' DOPO***
	$scope.connected = rabbit.getConnectionState();
	if(!$scope.connected)
		rabbit.connect();
});


/* 
 * Controller Empty, gestisce le schermate che non necessitano di funzioni specifiche.
 */
app.controller('emptyCtrl', function($scope, rabbit) {
	console.log("Empty controller ready.");
	
	$scope.connected = rabbit.getConnectionState();
	if(!$scope.connected)
		rabbit.connect();
});


/* 
 * Controller Random MatchMaking: gestisce l'accoppiamento casuale di giocatori
 * che intendano iniziare una partita
 */
app.controller('rmmakingCtrl', function($scope, rabbit, gameData, $location) {
	console.log("Controller random matchmaking ready.");
	
	// si assume che arrivati a questo punto, la connessione al broker è già avvnuta con successo
	$scope.connected = rabbit.getConnectionState();

	// utilizzato per mostrare eventualmente la schermata di selezione nickname
	// provvisoriamente settato incondizionatamente a true
	$scope.nicknameRequired = true;

	// mostra quando opportuno la schermata di caricamento. Provvisoriamente
	// inizializzato incondizionatamente a false
	$scope.mmInProgress = false;

	// mostra il tasto start non appena l'accoppiamento viene completato
	$scope.mmCompleted = false;

	// mostra ila schermata di caricamento non appena viene premuto il tasto ready
	$scope.mmReady = false;

	$scope.enemyNickname = "";

	rabbit.setMMakingCallbacks(function(response) { 
		// onGameRequestResponse

		gameData.setGameRoomId(response.gameRoomId);
		gameData.setPlayerId(response.playerId);
		
		rabbit.subscribeGameRoom();
		rabbit.sendHereMessage(true);

	}, function(response) { 
		// onHereMessage

		gameData.setEnemyNickname(response.nickname);
		gameData.setEnemyReady(response.readyState);

		$scope.mmInProgress = false;
		$scope.mmCompleted = true;
		$scope.enemyNickname = gameData.getEnemyNickname();
		$scope.$apply();
		
		if(response.needResponse) {
			rabbit.sendHereMessage(false);
		}
		

	}, function(response) { 
		// onReadyMessage

		gameData.setEnemyReady(true);

		if(gameData.isPlayerReady() && gameData.isEnemyReady())
			rabbit.sendTilesRequest();

	}, function(response) { 
		// onTilesMessage
		gameData.setCurrentMatchTiles(response.tiles);
		$location.path('/match');
		$scope.$apply();
		// avvia partita
	});

	// invocata una volta selezionato il nickname dell'utente
	$scope.requestMMaking = function(nickname) {
		$scope.mmInProgress = true;
		$scope.nicknameRequired = false;
		gameData.setPlayerNickname(nickname);
		rabbit.sendGameRequest();
	};

	// invocata una volta premuto il tasto ready
	$scope.playerReady = function() {
		$scope.mmCompleted = false;
		$scope.mmReady = true;
		gameData.setPlayerReady(true);
		rabbit.sendReadyMessage();
	}

});

// controller partita con avversario casuale
app.controller('pmmakingCtrl', function (/* $scope, $location, $http */) {
	console.log("Controller custom matchmaking ready.");
});

// controller partita con avversario casuale
app.controller('matchCtrl', function ($scope, rabbit, gameData) {
	console.log("Controller match ready.");
	// si assume che arrivati a questo punto, la connessione al broker è già avvnuta con successo
	$scope.connected = rabbit.getConnectionState();

	$scope.getTileStyle = function(i, j) {
		switch(gameData.getCurrentMatchTiles()[i][j]) {
			case 'Y':
				return 'yellow-play-tile';
			case 'R':
				return 'red-play-tile';
			case 'G':
				return 'gray-play-tile';
		}
	}

	$scope.playerPoints = gameData.getPlayerPoints();
	$scope.enemyPoints = gameData.getEnemyPoints();
	$scope.playerNickname = gameData.getPlayerNickname();
	$scope.enemyNickname = gameData.getEnemyNickname();
	$scope.matchInProgress = false;
	var countdown = 3;
	$scope.startCountdown = '3';
	$scope.matchTimerText = '30:00'

	var matchTimer;
	var matchTimerValue = 30000;

	var updateMatchTimerText = function() {
		matchTimerValue -= 10;

		if(matchTimerValue >= 0) {
			var seconds  = Math.floor(matchTimerValue / 1000);
			var decimals = Math.floor((matchTimerValue - (seconds * 1000)) / 10).toString();
			var decimals = decimals.toString();
			var seconds = seconds.toString();
			if(decimals.length == 1)
				decimals = '0' + decimals;

			$scope.matchTimerText = seconds + ':' + decimals; 
			$scope.$apply();
		} else {
			clearInterval(matchTimer);
		}
	}
	
	var startCountdownTimer = setInterval(function() {
		countdown--;
		if(countdown > 0) {
			$scope.startCountdown = countdown.toString();
			$scope.$apply();
		} else if (countdown == 0) {
			$scope.startCountdown = "Let's Cody!"
			$scope.$apply();
		} else {
			$scope.matchInProgress = true;
			$scope.$apply();
			clearInterval(startCountdownTimer);

			matchTimer = setInterval(updateMatchTimerText, 10);
		}
	}, 1000);

});

// controller partita con avversario casuale
app.controller('aftermatchCtrl', function (/* $scope, $location, $http */) {
	console.log("Controller aftermatch ready.");
});


// controller componenti di login e registrazione
app.controller('loginCtrl', function (/* $scope, $location, $http */) {
	console.log("Controller login-registration ready.");
});

// controller componente classifica
app.controller('rankingCtrl', function (/* $scope, $location, $http */) {
	console.log("Controller ranking ready.");
});
