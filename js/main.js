/*
 * Main AngularJS Web Application
 */
var app = angular.module('codyColor', ['ngRoute', 'ngAnimate']);


// ROUTING ===============================================
app.config(function ($routeProvider, $locationProvider) {
	// rimuove il punto esclamativo posto avanti all'hash in alcuni browser
	$locationProvider.hashPrefix('');
	
	$routeProvider

		// schermata home menu
		.when("/", 
			  { templateUrl: "partials/home.html", 
			    controller:  "homeCtrl"
			  })
				
		// schermata di login		  
		.when("/login", 
		      { templateUrl: "partials/login.html", 
 			  	controller: "loginCtrl"
			  })

		// regole del gioco
		.when("/rules", 
			  { templateUrl: "partials/rules.html", 
			    controller:  "homeCtrl"
			  })
				  
		// schermata registrazione
		.when("/register", 
			  { templateUrl: "partials/register.html", 
			    controller:  "loginCtrl" 
			  })
				  
		// schermata random match making
		.when("/rmmaking", 
			  { templateUrl: "partials/mmaking.html", 
			    controller:  "randomMatchCtrl" 
			  })

		.when("/pmmaking", 
			  { templateUrl: "partials/mmaking.html", 
			    controller:  "personalMatchCtrl" 
			  })
			  
		// schermata random match	  
		.when("/match", 
			  { templateUrl: "partials/match.html", 
			    controller:  "randomMatchCtrl" 
			  })

		// schermata random after match	  
		.when("/aftermatch", 
			  { templateUrl: "partials/aftermatch.html", 
			    controller:  "randomMatchCtrl" 
			  })

		// schermata classifiche
		.when("/ranking", 
			  { templateUrl: "partials/ranking.html", 
			    controller:  "rankingCtrl" 
			  })
		
		.otherwise("/404", 
				   { templateUrl: "partials/404.html", 
				     controller: "homeCtrl" 
				   });
});


// CONTROLLERS ============================================
// controller schermata home e componenti generici
app.controller('homeCtrl', function (/* $scope, $location, $http */) {
	console.log("Controller home ready.");
});


// controller componenti di login e registrazione
app.controller('loginCtrl', function (/* $scope, $location, $http */) {
	console.log("Controller login-registration ready.");
});


// controller componente classifica
app.controller('rankingCtrl', function (/* $scope, $location, $http */) {
	console.log("Controller ranking ready.");
});


// controller partita con avversario casuale
app.controller('randomMatchCtrl', function (/* $scope, $location, $http */) {
	console.log("Controller random match ready.");
});

// controller partita con avversario casuale
app.controller('personalMatchCtrl', function (/* $scope, $location, $http */) {
	console.log("Controller personal match ready.");
});
