/*
 * BaseRouting module: definisce la logica di base che consente la navigazione tra le pagine
 */
var app = angular.module('codyColor');


/*
 * Routing: codice responsabile dello switch tra le varie schermate
 */
app.config(function ($routeProvider, $locationProvider) {
	// rimuove il punto esclamativo posto avanti all'hash in alcuni browser
	$locationProvider.hashPrefix('');
	
	$routeProvider

		// splash screen all'avvio dell'app
		.when("/", 
			  { templateUrl: "partials/splash.html", 
			    controller:  "splashCtrl"
			  })

		// schermata home menu
		.when("/home", 
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
			    controller:  "emptyCtrl"
			  })
				  
		// schermata regristrati
		.when("/register", 
			  { templateUrl: "partials/register.html", 
			    controller:  "loginCtrl" 
			  })
				  
		// schermata random match making
		.when("/rmmaking", 
			  { templateUrl: "partials/mmaking.html", 
			    controller:  "rmmakingCtrl" 
			  })

		// schermata custom match making
		.when("/pmmaking", 
			  { templateUrl: "partials/mmaking.html", 
			    controller:  "pmmakingCtrl" 
			  })
			  
		// schermata match	  
		.when("/match", 
			  { templateUrl: "partials/match.html", 
			    controller:  "matchCtrl" 
			  })

		// schermata after match	  
		.when("/aftermatch", 
			  { templateUrl: "partials/aftermatch.html", 
			    controller:  "aftermatchCtrl" 
			  })

		// schermata classifiche-statistiche
		.when("/ranking", 
			  { templateUrl: "partials/ranking.html", 
			    controller:  "rankingCtrl" 
			  })

		// schermata profilo
		.when("/profile", 
			  { templateUrl: "partials/ranking.html", 
			    controller:  "rankingCtrl" 
			  })
		
		// schermata errore
		.otherwise("/404", 
				   { templateUrl: "partials/404.html", 
				     controller: "emptyCtrl" 
				   });
});