import firebase from '../Firebase';
import { Alert } from 'react-native';

export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
const userLoginSuccess = user => ({
	type: USER_LOGIN_SUCCESS,
	user
});

export const USER_LOGOUT = 'USER_LOGOUT';
const userLogout = () => ({
	type: USER_LOGOUT,
});

export const tryLogin = ({ email, password, token = null, provider = null }) => dispatch => {
	switch (provider) {
		case 'facebook':
		console.log('facebook firebase')
		break;
		case null:
			//email
			console.log('email')
			default:
			return firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then(user => {
				const action = userLoginSuccess(user);
				dispatch(action);
				return user;
			})
			.catch(error => {
				console.log(error)

				return Promise.reject(error)
			})
			break;
		}

	}