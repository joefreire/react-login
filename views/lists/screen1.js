import _ from 'lodash';
import axios from 'axios';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Avatar, Button, Icon } from 'react-native-elements';

import { cacheFonts } from '../../helpers/AssetsCaching';

const SCREEN_WIDTH = Dimensions.get('window').width;


export default class ListsScreen1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      where: {lat:null, lng:null},
      error: null,
      users: []
    };
  }

  async componentDidMount() {
    await cacheFonts({
      georgia: require('../../assets/fonts/Georgia.ttf'),
      regular: require('../../assets/fonts/Montserrat-Regular.ttf'),
      light: require('../../assets/fonts/Montserrat-Light.ttf'),
      bold: require('../../assets/fonts/Montserrat-Bold.ttf'),
    });

    let geoOptions = {
      enableHighAccuracy: true,
      timeOut: 20000,
      maximumAge: 60 * 60 * 24
    };

    this.setState({ready:false, error: null });
    navigator.geolocation.getCurrentPosition( this.geoSuccess, 
      this.geoFailure,
      geoOptions);

    this.setState({ fontLoaded: true });

    axios
    .get('https://randomuser.me/api/?nat=br&results=15')
    .then(response => {
      const { results } = response.data;
      this.setState({
        users: results,
        ready: true,
      });
    }).catch(error => {
      this.setState({
        ready: false,
        error: true,
      })
    });
  }

  geoSuccess = (position) => {
    console.log(position.coords.latitude);

    this.setState({
      ready:true,
      where: {lat: position.coords.latitude,lng:position.coords.longitude }
    })
  }
  geoFailure = (err) => {
    this.setState({error: err.message});
  }

  renderValue(user) {
    const { name, gender  } = user;


      return (
        <View
        style={{
          backgroundColor: 'rgba(244,230,224,1)',
          width: 70,
          height: 28,
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          marginLeft: 10,
        }}
        >
        <Icon name="md-arrow-dropdown" type="ionicon" color="red" size={25} />
        <Text
        style={{
          color: 'red',
          fontFamily: 'regular',
          fontSize: 13,
          marginLeft: 5,
        }}
        >
        {name.first + gender}
        </Text>
        </View>
        );

  }

  renderCard(user, index) {

    return (
      <View
      key={index}
      style={{
        height: 60,
        marginHorizontal: 10,
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
      }}
      >
      <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ marginLeft: 15 }}>
      <Avatar
      small
      rounded
      source={{
        uri: user.picture.thumbnail,
      }}
      activeOpacity={0.7}
      />
      </View>
      <Text
      style={{
        fontFamily: 'regular',
        fontSize: 15,
        marginLeft: 10,
        color: 'gray',
      }}
      >
      {user.name.first}
      </Text>
      </View>
      <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginRight: 10,
      }}
      >
      {this.renderValue(user)}
      <View
      style={{
        backgroundColor: 'rgba(222,222,222,1)',
        width: 35,
        height: 28,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
      }}
      >
      <Icon name="md-person-add" type="ionicon" color="gray" size={20} />
      </View>
      </View>
      </View>
      );
  }

  renderListCards() {
    return _.map(this.state.users, (user, index) => {
      return this.renderCard(user, index);
    });
  }

  render() {
    return (
      <View>
      {this.state.ready ? (
        <SafeAreaView
        style={{ flex: 1, backgroundColor: 'rgba(241,240,241,1)' }}
        >
        <View style={styles.statusBar} />
        <View style={styles.navBar}>
        <Text style={styles.nameHeader}>Postos</Text>
        </View>
        <ScrollView style={{ flex: 1, marginBottom: 20 }}>

        {this.renderListCards()}
        </ScrollView>
        </SafeAreaView>
        ) : (
        <Text>Loading...</Text>
        )}
        </View>
        );
  }
}

const styles = StyleSheet.create({
  statusBar: {
    height: 10,
  },
  navBar: {
    height: 60,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignContent: 'center',
  },
  nameHeader: {
    color: 'black',
    fontSize: 25,
    fontFamily: 'regular',
    marginLeft: 20,
  },
});
