/*
 * Controllers: codice responsabile del binding e del collegamento al model delle varie schermate
 */

var app = angular.module('codyColor');


 // controller schermata home e componenti generici
app.controller('splashCtrl', function ($scope, rabbit) {
	console.log("Controller splash ready.");
	
	$scope.connected = rabbit.getConnectionState();
	rabbit.connect(function(){/* onConnected */}, function(){ /* onError */});
});



// controller schermata home e componenti generici
app.controller('homeCtrl', function ($scope, rabbit) {
	console.log("Controller home ready.");

	$scope.connected = rabbit.getConnectionState();
	if(!$scope.connected)
		rabbit.connect(function(){/* onConnected */}, function(){ /* onError */});
});

// controller per elementi che non hanno bisogno di funzioni specifiche
app.controller('emptyCtrl', function ($scope, rabbit) {
	console.log("Empty controller ready.");
	
	$scope.connected = rabbit.getConnectionState();
	if(!$scope.connected)
		rabbit.connect(function(){/* onConnected */}, function(){ /* onError */});
});

// controller partita con avversario casuale
app.controller('rmmakingCtrl', function ($scope, rabbit) {
	console.log("Controller random matchmaking ready.");
	
	$scope.connected = rabbit.getConnectionState();
	if(!$scope.connected) {
		rabbit.connect(function() { // onConnected
			$scope.connected = true;
			rabbit.sendMatchRequest(function() {/*doOnResponse*/});
					   
		 }, function() { // onErrorInConnection
			$scope.connected = false;
		 });
	} else {
		// se la connessione è già avvenuta, invia direttamente una richiesta
		// di gioco
		rabbit.sendMatchRequest(function() {/*doOnResponse*/})
	}

});

// controller partita con avversario casuale
app.controller('pmmakingCtrl', function (/* $scope, $location, $http */) {
	console.log("Controller custom matchmaking ready.");
});

// controller partita con avversario casuale
app.controller('matchCtrl', function (/* $scope, $location, $http */) {
	console.log("Controller match ready.");
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
