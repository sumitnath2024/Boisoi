// common.js
import { firebaseConfig } from './firebase-config.js';
firebase.initializeApp(firebaseConfig);

function initApp() {
    // Initialization code here
}

function login(email, password, rememberMe) {
    firebase.auth().setPersistence(rememberMe ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
            return firebase.auth().signInWithEmailAndPassword(email, password);
        })
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log('Login successful', user);
            // Redirect to dashboard
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error('Login failed', errorCode, errorMessage);
        });
}

function register(data) {
    firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
        .then((userCredential) => {
            // Registered
            var user = userCredential.user;
            console.log('Registration successful', user);
            // Redirect to profile completion
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error('Registration failed', errorCode, errorMessage);
        });
}

function logout() {
    firebase.auth().signOut().then(() => {
        console.log('Logout successful');
        // Redirect to login page
    }).catch((error) => {
        console.error('Logout failed', error);
    });
}

export { initApp, login, register, logout };
