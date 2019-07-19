/*
 * AuthHandler: factory per la gestione del flusso di autenticazione legato alle librerie firebase Auth, firebase UI
 * e ai vari provider oAuth
 */
angular.module('codyColor').factory("authHandler", function() {
    let authHandler = {};
    let initialized = false;

    const firebaseConfig = {
        apiKey: "AIzaSyCJoAvdMagPFHTG--zurc3RjBekWLJzvxo",
        authDomain: "codycolor-f2519.firebaseapp.com",
        databaseURL: "https://codycolor-f2519.firebaseio.com",
        projectId: "codycolor-f2519",
        storageBucket: "",
        messagingSenderId: "839718298178",
        appId: "1:839718298178:web:6e3b0cf34856eb12"
    };


    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                // callbacks.onSignInSuccess(authResult, redirectUrl);
                return false;
            },
            signInFailure: function (error) {
                // Return a promise when error handling is completed and FirebaseUI
                // will reset, clearing any UI
                // return callbacks.onSignInError(error);
            }
        },
        signInOptions: [
            /*{
                provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                // Required to enable this provider in One-Tap Sign-up.
                authMethod: 'https://accounts.google.com',
                // Required to enable ID token credentials for this provider.
                clientId: CLIENT_ID
            },*/
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: 'https://www.example.com',
        privacyPolicyUrl: 'https://www.example.com'
        // Privacy policy url/callback.
        /*privacyPolicyUrl: function() {
            // do something, ex. policy inside app
        }*/
    };

    let ui;
    let callbacks = {};

    // dati dell'utente autenticato. Disponibili solo a login completato
    let userData;


    // inizializza i callbacks
    authHandler.setAuthCallbacks = function(args) {
        callbacks.onSignIn = args.onSignIn;
        callbacks.onSignInError = args.onSignInError;
        callbacks.onSignOut = args.onSignOut;
    };


    // cancella i callbacks
    authHandler.clearCallbacks = function() {
        callbacks = {};
    };


    // inizializza la libreria firebase per l'autenticazione. Da chiamare all'avvio dell'app
    authHandler.initializeAuth = function () {
        if (!initialized) {
            firebase.initializeApp(firebaseConfig);

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    // User is signed in.
                    console.log('User signed in: ' + JSON.stringify(user));
                    userData = user;

                    if (callbacks.onSignIn !== undefined) {
                        callbacks.onSignIn(user);
                    }

                } else {
                    // User is signed out.
                    console.log('User signed out.');
                    userData = undefined;

                    if (callbacks.onSignOut !== undefined) {
                        callbacks.onSignOut();
                    }
                }
            }, function (error) {
                console.log(error);

                if (callbacks.onSignInError !== undefined) {
                    callbacks.onSignInError(error);
                }
            });
            initialized = true;
        }
    };


    // crea una nuova istanza di firebaseUI. Da chiamare all'entrata nella pagina di login
    authHandler.initializeUi = function () {
        ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
    };


    // avvia l'istanza firebaseUI
    authHandler.startUi = function () {
        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig);
    };


    authHandler.logout = function () {
        firebase.auth().signOut();
    };


    authHandler.deleteAccount = function () {
        firebase.auth().currentUser.delete().catch(function(error) {
            if (error.code === 'auth/requires-recent-login') {
                // The user's credential is too old. She needs to sign in again.
                firebase.auth().signOut().then(function () {
                    // The timeout allows the message to be displayed after the UI has
                    // changed to the signed out state.
                    setTimeout(function () {
                        alert('Please sign in again to delete your account.');
                    }, 1);
                });
            }
        });
    };

    authHandler.isPendingRedirect = function () {
        return ui.isPendingRedirect();
    };

    authHandler.getUser = function () {
        return userData;
    };

    authHandler.userLogged = function () {
        return userData !== undefined;
    };


    return authHandler;
});