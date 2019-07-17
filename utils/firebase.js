import firebase from 'firebase';

const prodConfig = {
    apiKey: "AIzaSyAmG9vvm5PUzVYxV_QR0KFOGyZ9sE8kKBo",
    authDomain: "fir-test-c3482.firebaseapp.com",
    databaseURL: "https://fir-test-c3482.firebaseio.com",
    messagingSenderId: "817842099542"
};

const devConfig = {
    apiKey: "AIzaSyAmG9vvm5PUzVYxV_QR0KFOGyZ9sE8kKBo",
    authDomain: "fir-test-c3482.firebaseapp.com",
    databaseURL: "https://fir-test-c3482.firebaseio.com",
    messagingSenderId: "817842099542"
};

const config = process.env.NODE_ENV === 'production'
    ? prodConfig
    : devConfig;

export const firebaseImpl = firebase.initializeApp(config);
export const firebaseDatabase = firebase.database();
export const firebaseAuth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();