/**
 * Created by jkwu on 2018/6/20.
 */
import React, { Component } from 'react';
import {
  View, ScrollView, Text, NativeModules
} from 'react-native';

const LocationModule = NativeModules.LocationModule;
export default class BaiduApi extends Component {
  constructor(props) {
    super(props);
    this.watchPosition = null;
    this.state = {
      coords: '',
    };
  }

  componentDidMount() {
    LocationModule.initLocation();
    LocationModule.getBDLocation()
      .then(bdlocation => {
        console.log(bdlocation);
        this.setState({ coords: { ...bdlocation } });
      });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 }}>
        <ScrollView>
          <View style={{ flexDirection: 'column' }}>
            <Text>{JSON.stringify(this.state.coords)}</Text>
          </View>
          
        </ScrollView>
      </View>
    );
  }
}
