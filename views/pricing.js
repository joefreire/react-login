import React, { Component } from 'react';
import { WebView } from 'react-native';
import colors from '../config/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { PricingCard, Text } from 'react-native-elements';


class Pricing extends Component {
  render() {
    return (
      <WebView
        source={{uri: 'https://github.com/facebook/react-native'}}
        style={{marginTop: 20}}
      />
    );
  }
}


Pricing.navigationOptions = {
  title: 'WebView',
};



export default Pricing;
