import React from 'react';
import { createAppContainer, createDrawerNavigator, DrawerItems } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { View, Image, Dimensions } from 'react-native';
import AppLoading from "./components/AppLoading";

//Pages import
import LoginPage from './pages/LoginPage';
import SeriesPage from './pages/SeriesPage';
import SerieDetailPage from './pages/SerieDetailPage';
import Profile from './pages/profile';
import SerieFormPage from './pages/SerieFormPage';

import rootReducer from './reducers';


const WINDOW_WIDTH = Dimensions.get('window').width;

const CustomDrawerContentComponent = props => (
  <View style={{ flex: 1, backgroundColor: '#43484d' }}>
  <View
  style={{ marginTop: 40, justifyContent: 'center', alignItems: 'center' }}
  >
  <Image
  source={require('./images/logo.png')}
  style={{ width: Math.min(WINDOW_WIDTH * 0.57, 200) }}
  resizeMode="contain"
  />
  </View>
  <View style={{ marginLeft: 10 }}>
  <DrawerItems {...props} />
  </View>
  </View>
  );

const MainRoot  = createAppContainer(createDrawerNavigator(
{
    'Main': {
        path: '/profile',
        screen: Profile
    },
    'Login': {
        path: '/profile',
        screen: LoginPage
    },
},
{
    initialRouteName: 'Main',
    contentOptions: {
        activeTintColor: '#548ff7',
        activeBackgroundColor: 'transparent',
        inactiveTintColor: '#ffffff',
        inactiveBackgroundColor: 'transparent',
        labelStyle: {
          fontSize: 15,
          marginLeft: 0,
      },
  },
  drawerWidth: Math.min(WINDOW_WIDTH * 0.8, 300),
  contentComponent: CustomDrawerContentComponent,
}
));
const Login  = createAppContainer(
{
    'Login': {
        screen: LoginPage,
        navigationOptions: {
            title: 'GasPass',
        }
    }
})
//const AppContainer = createAppContainer(MainRoot);

//export default AppContainer;

export default class AppContainer extends React.Component {
   state = {
      isReady: false,
      dataList: null,
  };


  async _loadAssetsAsync() {

  }
  render() {
    console.log(rootReducer)
      if (!this.state.isReady) {
        return (
          <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
              />
              );
          }

          return <MainRoot />;
      }

  }