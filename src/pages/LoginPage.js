import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import { Input, Button, Icon } from 'react-native-elements';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { tryLogin } from '../actions';

import FormRow from '../components/FormRow';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../../assets/images/bg_screen4.jpg');
// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

const TabSelector = ({ selected }) => {
	return (
		<View style={styles.selectorContainer}>
		<View style={selected && styles.selected} />
		</View>
	);
};

TabSelector.propTypes = {
	selected: PropTypes.bool.isRequired,
};

class LoginPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mail: '',
			password: '',
			isLoading: false,
			isLoginPage: true,
			isEmailValid: true,
			message: ''
		}
	}


	componentDidMount() {
		const firebaseConfig = {
		  apiKey: "AIzaSyD_RVgTJBmugYUrALpeii8GZpcwsjkzA2I",
		  authDomain: "gaspass-9b097.firebaseapp.com",
		  databaseURL: "https://gaspass-9b097.firebaseio.com",
		  projectId: "gaspass-9b097",
		  storageBucket: "",
		  messagingSenderId: "191409216558",
		  appId: "1:191409216558:web:6628198004153f8c"
		};
		firebase.initializeApp(firebaseConfig);
	}

	onChangeHandler(field, value) {
		this.setState({
			[field]: value
		});
	}

	tryLogin() {
		this.setState({ isLoading: true, message: '' });
		const { mail: email, password } = this.state;

		this.props.tryLogin({ email, password })
		.then(user => {
			console.log(user)
			if (user)
			return this.props.navigation.replace('Main');

			this.setState({
				isLoading: false,
				message: ''
			});
		})
		.catch(error => {
			console.log(error)
			this.setState({
				isLoading: false,
				message: this.getMessageByErrorCode(error.code)
			});
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
			title={this.state.isLoginPage ? 'LOGIN' : 'SIGN UP'}
			onPress={this.state.isLoginPage ? () => this.tryLogin() : this.signUp}
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
			<View style={styles.titleContainer}>
			<View style={{ flexDirection: 'row' }}>
			<Text style={styles.titleText}>Gaspass</Text>
			</View>
			</View>
			{ this.renderMessage() }
			<View style={{ flexDirection: 'row' }}>
			<Button
			type="clear"
			activeOpacity={0.7}
			onPress={() => this.selectCategory(0)}
			containerStyle={{ flex: 1 }}
			titleStyle={[
				styles.categoryText,
				this.state.isLoginPage && styles.selectedCategoryText,
			]}
			title={'Login'}
			/>
			<Button
			type="clear"
			activeOpacity={0.7}
			onPress={() => this.selectCategory(1)}
			containerStyle={{ flex: 1 }}
			titleStyle={[
				styles.categoryText,
				!this.state.isLoginPage && styles.selectedCategoryText,
			]}
			title={'Sign up'}
			/>
			</View>
			<View style={styles.rowSelector}>
			<TabSelector selected={this.state.isLoginPage} />
			<TabSelector selected={!this.state.isLoginPage} />
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
			value={this.state.mail}
			keyboardAppearance="light"
			autoFocus={false}
			autoCapitalize="none"
			autoCorrect={false}
			keyboardType="email-address"
			onChangeText={value => this.onChangeHandler('mail', value)}
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
			{!this.state.isLoginPage && (
				<Input
				icon={
					<Icon
					name="lock"
					type="simple-line-icon"
					color="rgba(0, 0, 0, 0.38)"
					size={25}
					style={{ backgroundColor: 'transparent' }}
					/>
				}
				value={passwordConfirmation}
				secureTextEntry={true}
				keyboardAppearance="light"
				autoCapitalize="none"
				autoCorrect={false}
				keyboardType="default"
				returnKeyType={'done'}
				blurOnSubmit={true}
				containerStyle={{
					marginTop: 16,
					borderBottomColor: 'rgba(0, 0, 0, 0.38)',
				}}
				inputStyle={{ marginLeft: 10 }}
				placeholder={'Confirm password'}
				ref={input => (this.confirmationInput = input)}
				onSubmitEditing={this.signUp}
				onChangeText={passwordConfirmation =>
					this.setState({ passwordConfirmation })
				}
				errorMessage={
					isConfirmationValid
					? null
					: 'Please enter the same password'
				}
				/>
			)}
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
			<View style={styles.container}>
			<FormRow first>
			<TextInput
			style={styles.input}
			placeholder="user@mail.com"
			value={this.state.mail}
			onChangeText={value => this.onChangeHandler('mail', value)}
			keyboardType="email-address"
			autoCapitalize="none"
			/>
			</FormRow>
			<FormRow last>
			<TextInput
			style={styles.input}
			placeholder="******"
			secureTextEntry
			value={this.state.password}
			onChangeText={value => this.onChangeHandler('password', value)}
			/>
			</FormRow>

			{ this.renderButton() }
			{ this.renderMessage() }
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
		fontFamily: 'light',
		backgroundColor: 'transparent',
		opacity: 0.54,
	},
	selectedCategoryText: {
		opacity: 1,
	},
	titleText: {
		color: 'white',
		fontSize: 30,
		fontFamily: 'regular',
	},
	helpContainer: {
		height: 64,
		alignItems: 'center',
		justifyContent: 'center',
	},
});


export default connect(null, { tryLogin })(LoginPage)
