import React, { Component } from 'react';
import {
  View,
  StatusBar,
  Platform,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import { createStackNavigator, NavigationActions } from 'react-navigation';
import { stackConfig, stackNavigatorConfig } from './routerConfig';

const AppNavigator = createStackNavigator(stackConfig, stackNavigatorConfig);// eslint-disable-line

class RouterManager extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  onBackAndroid = () => {
    if (this.navigator && this.navigator.state.nav.index > 0) {
      this.navigator.dispatch(NavigationActions.back());
      return true;
    } else { // eslint-disable-line
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        return false;
      }

      this.lastBackPressed = Date.now();
      ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
      return true;
    }
  };

  render() {
    return (
      <View
        style={{ flex: 1, backgroundColor: '#fff' }}
        onStartShouldSetResponder={() => dismissKeyboard()}
      >
        <StatusBar barStyle="light-content" />
        <AppNavigator ref={navigator => this.navigator = navigator} />
      </View>
    );
  }
}

export default RouterManager;
