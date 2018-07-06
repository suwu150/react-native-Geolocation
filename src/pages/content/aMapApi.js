/**
 * Created by jkwu on 2018/6/20.
 */
import React, { Component } from 'react';
import Qs from 'qs';
import {
  View, ScrollView, Text, StyleSheet, InteractionManager
} from 'react-native';
import { gaxios } from '../../utils/axios';

const styles = StyleSheet.create({
  title: {
    color: '#00dddd'
  },
});

export default class AMapApi extends Component {
  constructor(props) {
    super(props);
    this.watchPosition = null;
    this.state = {
      initialPosition: '',
      address: ''
    };
  }

  componentDidMount() {
    this._getLocation();
    this.watchPosition = this._getWatchPosition();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchPosition);
  }

  _getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => this.setState({ initialPosition }, () => {
        this._getAddress();
      }),
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  _getWatchPosition = () => {
    return navigator.geolocation.watchPosition(
      (lastPosition) => {
        this.setState({ lastPosition }, () => { this._getAddress(); });
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  _getAddress = () => {
    // 经度：positionData.longitude
    // 纬度：positionData.latitude
    // 最后一步 高德逆地理编码转
    // lat<纬度>,lng<经度>

    const aMapLocationConfig = {
      key: 'df39f60a9d525043c1472fc67888e336',
      poitype: 'all',
      radius: 3000,
      output: 'json',
      extensions: 'all',
      roadlevel: 0,
    };
    const aMapLocationURL = 'https://restapi.amap.com/v3/geocode/regeo'; //GET请求

    // callback=renderReverse&location=35.658651,139.745415&output=json&pois=1&ak=您的ak
    // radius=3000&output=json&extensions=all&roadlevel=all&location=30.11286062,120.19698604
    // ?output=xml&location=116.310003,39.991957&key=<用户的key>&radius=1000&extensions=all
    const { lastPosition } = this.state;
    if (!lastPosition) return null;
    const { longitude, latitude } = lastPosition.coords;
    const location = longitude + ',' + latitude;
    const aMapUrl = aMapLocationURL + '?' + Qs.stringify({ ...aMapLocationConfig }) + '&location=' + location;

    InteractionManager.runAfterInteractions(() => {
      gaxios(aMapUrl)
        .then((response) => {
          this.setState({
            address: response
          }, () => {
          });
        }).catch((error) => {
          console.log('获取地址信息出错' + error);
        });
    });
  };

  render() {
    const { address } = this.state;
    const { regeocode } = address && address.data;
    console.log('regeocode:');
    console.log(regeocode);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ScrollView>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.title}>Initial position: </Text>
            <Text>{JSON.stringify(this.state.initialPosition)}</Text>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.title}>Current position: </Text>
            <Text>{JSON.stringify(this.state.lastPosition)}</Text>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.title}>this.watchPosition: </Text>
            <Text>{JSON.stringify(this.watchPosition)}</Text>
          </View>
          <View style={{ flexDirection: 'column' }}>
            {/*<Text style={{ color: '#86c3ff' }}>{ JSON.stringify(address) }</Text>*/}
            <Text style={styles.title}>status()返回结果状态值: {address.status} </Text>
            <Text>{address.status} </Text>
            <Text style={styles.title}>info返回结果状态值: </Text>
            <Text>{address.info} </Text>
            {/*<Text style={styles.title}>regeocode逆地理编码列表: </Text>*/}
            {/*<Text>{address.regeocode} </Text>*/}
            <Text style={styles.title}>formatted_address(结构化地址信息): </Text>
            <Text>{ JSON.stringify(regeocode && regeocode.formatted_address) }</Text>

            <Text style={styles.title}>addressComponent:</Text>
            <Text>{ JSON.stringify(regeocode && regeocode.addressComponent) }</Text>

            <Text style={styles.title}>pois(周边数组):</Text>
            {
              regeocode && regeocode.pois && regeocode.pois.map(item => {
                return (
                  <View style={{ borderColor: '#09f', borderBottomWidth: 0.5 }}>
                    <Text>{ JSON.stringify(item) }</Text>
                  </View>);
              })
            }
            <Text style={styles.title}>roads道路信息列表:</Text>
            <Text>{ JSON.stringify(regeocode && regeocode.roads) }</Text>

            <Text style={styles.title}>roadinters(道路交叉口列表):</Text>
            <Text>{ JSON.stringify(regeocode && regeocode.roadinters) }</Text>

            <Text style={styles.title}>aoisaoi信息列表:</Text>
            <Text>{ JSON.stringify(regeocode && regeocode.aois) }</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
