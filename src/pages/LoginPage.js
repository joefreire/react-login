import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ImageBackground,
	Dimensions,
	LayoutAnimation,
	UIManager,
	ActivityIndicator,
	KeyboardAvoidingView,
	TextInput,
	Alert
} from 'react-native';
import { Input, Button, Icon, SocialIcon  } from 'react-native-elements';
import firebase from '../Firebase';
import { connect } from 'react-redux';
import { tryLogin } from '../actions';

import Expo from 'expo';
import * as Facebook from 'expo-facebook';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../../assets/images/bg_screen4.jpg');
// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);



class LoginPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			isLoading: false,
			isLoginPage: true,
			isEmailValid: true,
			message: '',
			error: null
		}
	}

/*	signInAsync = async () => {
		console.log('dsa')
		try {
			const result = await Expo.Google.logInAsync({
				androidClientId: '191409216558-hus1s97kc6p4celdq73fq8bn1m99lccm.apps.googleusercontent.com',
				iosClientId: YOUR_CLIENT_ID_HERE,
				scopes: ['profile', 'email'],
			});

			if (result.type === 'success') {
				return result.accessToken;
			} else {
				return { cancelled: true };
			}
		} catch (e) {
			console.log(e)
			return { error: true };
		}
	};*/

	logInFacebook = async () => {
		console.log('facebook')
		try {
			const {
				type,
				token,
				expires,
				permissions,
				declinedPermissions,
			} = await Facebook.logInWithReadPermissionsAsync('644353356070660', {
				permissions: ['public_profile'],
			});
			if (type === 'success') {
		      // Get the user's name using Facebook's Graph API
		      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
		      const data = await response.json();
		      var provider = 'facebook';
		      console.log(data)
		      if(data){
		      	this.props.tryLogin({ email, password, token, provider })
		      	.then(user => {
		      		if (user)
		      			return this.props.navigation.replace('Main');

		      		this.setState({
		      			message: ''
		      		});
		      	})
		      	.catch(error => {
		      		this.setState({
		      			message: this.getMessageByErrorCode(error.code)
		      		});
		      	});
		      }

		  } else {
		      // type === 'cancel'
		  }
		} catch ({ message }) {
			alert(`Facebook Login Error: ${message}`);
		
		};
	}

	tryLogin = async () => {
		await this.setState({ isLoading: true, message: '' });
		const { email, password } = this.state;
		await this.props.tryLogin({ email, password })
		.then(user => {
			if (user)
				return this.props.navigation.replace('Main');

			this.setState({
				isLoading: false,
				message: ''
			});
		})
		.catch(error => {
			this.setState({
				isLoading: false,
				message: this.getMessageByErrorCode(error.code)
			});
		});
		

	}

	onChangeHandler(field, value) {
		this.setState({
			[field]: value
		});
	}



	getMessageByErrorCode(errorCode) {
		switch (errorCode) {
			case 'auth/wrong-password':
			return 'Senha incorreta';
			case 'auth/user-not-found':
			return 'Usuário não encontrado';
			return 'Senha incorreta';
			case 'auth/invalid-email':
			return 'Por Favor preencha o Email';
			default:
			return 'Erro desconhecido';
		}
	}

	renderMessage() {
		const { message } = this.state;
		if (!message)
			return null;

		return (
			<View>
			<Text>{message}</Text>
			</View>
			);
	}

	renderButton() {

		if (this.state.isLoading){
			return <ActivityIndicator />;
		}
		return (
			<Button
			buttonStyle={styles.loginButton}
			containerStyle={{ marginTop: 32, flex: 0 }}
			type="clear"
			title={'LOGIN'}
			onPress={ this.tryLogin }
			titleStyle={styles.loginTextButton}
			activeOpacity={0.8}
			containerStyle={{ flex: 1 }}
			/>
			);
	}

	render() {

		return (
			<View style={styles.container}>
			<ImageBackground source={BG_IMAGE} style={styles.bgImage}>
			<KeyboardAvoidingView
			contentContainerStyle={styles.loginContainer}
			behavior="position"
			>
			{ this.renderMessage() }
			<View style={styles.socialButtons}>
			<SocialIcon
			title='Logue com Facebook'
			onPress={ this.logInFacebook }
			button
			type='facebook'
			/>
			<SocialIcon
			onPress={this.signInAsync}
			title='Logue com Google'
			button
			type='google-plus-official'
			/>

			</View>

			<View style={styles.formContainer}>

			<Input
			leftIcon={
				<Icon
				name="envelope-o"
				type="font-awesome"
				color="rgba(0, 0, 0, 0.38)"
				size={25}
				style={{ backgroundColor: 'transparent' }}
				/>
			}
			value={this.state.email}
			keyboardAppearance="light"
			autoFocus={false}
			autoCapitalize="none"
			autoCorrect={false}
			keyboardType="email-address"
			onChangeText={value => this.onChangeHandler('email', value)}
			returnKeyType="next"
			inputStyle={{ marginLeft: 10 }}
			placeholder={'Email'}
			containerStyle={{
				borderBottomColor: 'rgba(0, 0, 0, 0.38)',
			}}
			ref={input => (this.mailInput = input)}
			onSubmitEditing={() => this.passwordInput.focus()}
			/>
			<Input
			leftIcon={
				<Icon
				name="lock"
				type="simple-line-icon"
				color="rgba(0, 0, 0, 0.38)"
				size={25}
				style={{ backgroundColor: 'transparent' }}
				/>
			}
			keyboardAppearance="light"
			autoCapitalize="none"
			autoCorrect={false}
			secureTextEntry={true}
			returnKeyType={!this.state.isLoginPage ? 'next' : 'done'}
			blurOnSubmit={true}
			containerStyle={{
				marginTop: 16,
				borderBottomColor: 'rgba(0, 0, 0, 0.38)',
			}}
			inputStyle={{ marginLeft: 10 }}
			placeholder={'Senha'}
			ref={input => (this.passwordInput = input)}
			value={this.state.password}
			onChangeText={value => this.onChangeHandler('password', value)}
			/>


			{ this.renderButton() }

			</View>
			</KeyboardAvoidingView>
			<View style={styles.helpContainer}>
			<Button
			title={'Ajuda ?'}
			titleStyle={{ color: 'white' }}
			buttonStyle={{ backgroundColor: 'transparent' }}
			underlayColor="transparent"
			onPress={() => console.log('Account created')}
			/>
			</View>

			</ImageBackground>
			</View>
			)
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	socialButtons: {
		alignItems: 'center',
	},
	rowSelector: {
		height: 20,
		flexDirection: 'row',
		alignItems: 'center',
	},
	input: {
		paddingLeft: 5,
		paddingRight: 5,
		paddingBottom: 5,
	},
	selectorContainer: {
		flex: 1,
		alignItems: 'center',
	},
	selected: {
		position: 'absolute',
		borderRadius: 50,
		height: 0,
		width: 0,
		top: -5,
		borderRightWidth: 70,
		borderBottomWidth: 70,
		borderColor: 'white',
		backgroundColor: 'white',
	},
	loginContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	loginTextButton: {
		fontSize: 16,
		color: 'white',
		fontWeight: 'bold',
	},
	loginButton: {
		backgroundColor: 'rgba(232, 147, 142, 1)',
		borderRadius: 10,
		height: 50,
		width: 200,
	},
	titleContainer: {
		height: 150,
		backgroundColor: 'transparent',
		justifyContent: 'center',
	},
	formContainer: {
		backgroundColor: 'white',
		width: SCREEN_WIDTH - 30,
		borderRadius: 10,
		paddingTop: 32,
		paddingBottom: 32,
		alignItems: 'center',
	},
	loginText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: 'white',
	},
	bgImage: {
		flex: 1,
		top: 0,
		left: 0,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		justifyContent: 'center',
		alignItems: 'center',
	},
	categoryText: {
		textAlign: 'center',
		color: 'white',
		fontSize: 24,

		backgroundColor: 'transparent',
		opacity: 0.54,
	},
	selectedCategoryText: {
		opacity: 1,
	},
	titleText: {
		color: 'white',
		fontSize: 30,

	},
	helpContainer: {
		height: 64,
		alignItems: 'center',
		justifyContent: 'center',
	},
});


export default connect(null, { tryLogin })(LoginPage)
