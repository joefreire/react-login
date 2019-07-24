import firebase from 'firebase';
const config={
	  apiKey: "AIzaSyD_RVgTJBmugYUrALpeii8GZpcwsjkzA2I",
	  authDomain: "gaspass-9b097.firebaseapp.com",
	  databaseURL: "https://gaspass-9b097.firebaseio.com",
	  projectId: "gaspass-9b097",
	  storageBucket: "",
	  messagingSenderId: "191409216558",
	  appId: "1:191409216558:web:6628198004153f8c"
}
const Firebase = firebase.initializeApp(config);
export default Firebase;