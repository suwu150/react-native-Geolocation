/**
 * Created by jkwu on 2018/6/20.
 */
import React, { Component } from 'react';
import Qs from 'qs';
import {
  View, ScrollView, Text, StyleSheet, InteractionManager, Platform, Alert, DeviceEventEmitter
} from 'react-native';
import { gaxios } from '../../utils/axios';

const styles = StyleSheet.create({
  title: {
    color: '#00dddd'
  },
});

export default class BaiduApi extends Component {
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
    //收到监听,另外一种接受监听的方法
    this.listener = DeviceEventEmitter.addListener('geolocationDidChange', (e) => {
      console.log(e);
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchPosition);
  }

  _getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => this.setState({ initialPosition }, () => {
        this._getAddress();
      }),
      (error) => {
        if (Platform.OS === 'ios') {
          if (error && error.code === 1) {
            Alert.alert('请允许该应用访问位置服务', '', [{ text: '好' }]);
          } else if (error && error.code === 2) {
            Alert.alert('位置信息GPS服务不可用', '', [{ text: '好' }]);
          } else if (error && error.code === 3) {
            Alert.alert('获取GPS信息超时，请重新打开该页面获取信息', '', [{ text: '好' }]);
          } else {
            Alert.alert('未知错误', '', [{ text: '好' }]);
          }
        } else if (Platform.OS === 'android') {
          // ANDROID:message: "No location provider available.", code: 2
          // ANDROID:message: "Geolocation timed out.", code: 3
          if (error && error.code === 2) {
            Alert.alert('请打开位置信息服务', '', [{ text: '好' }]);
          } else if (error && error.code === 3) {
            Alert.alert('获取GPS信息超时，请打开高精度GPS定位服务功能', '', [{ text: '好' }]);
          }
        }
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
    );
  };

  _getWatchPosition = () => {
    return navigator.geolocation.watchPosition(
      (lastPosition) => {
        this.setState({ lastPosition }, () => { this._getAddress(); });
      },
      (error) => alert(error.message),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
    );
  };

  _getAddress = () => {
    // 经度：positionData.longitude
    // 纬度：positionData.latitude
    // 最后一步 百度地图逆地理编码转
    // lat<纬度>,lng<经度>

    const baiduLocationConfig = {
      // callback: 'renderReverse',
      ak: '3nHjylGdT3z5jSldf2o2E1qyF85YDLZ4',
      pois: 1,
      coordtype: 'wgs84ll', // 进行合理的选择，可能会影响精度
      output: 'json',
      latest_admin: 1,
      language_auto: 1,
      extensions_town: true,
      extensions_road: true,
      radius: 1000,
    };
    const baiduLocationURL = 'https://api.map.baidu.com/geocoder/v2/'; //GET请求
    // callback=renderReverse&location=35.658651,139.745415&output=json&pois=1&ak=您的ak

    const { lastPosition } = this.state;
    if (!lastPosition) return null;
    const { longitude, latitude } = lastPosition && lastPosition.coords;
    const location = latitude + ',' + longitude;
    const baiduUrl = baiduLocationURL + '?' + Qs.stringify({ ...baiduLocationConfig }) + '&location=' + location;

    InteractionManager.runAfterInteractions(() => {
      gaxios(baiduUrl)
        .then((response) => {
          this.setState({
            address: response
          }, () => {
          });
        }).catch((err) => {
          console.log('获取地址信息出错', err);
        });
    });
  };

  render() {
    const { address } = this.state;
    const { result } = address && address.data;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 }}>
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
            {/*<Text style={{ color: '#86c3ff' }}>{ JSON.stringify(result) }</Text>*/}
            <Text style={styles.title}>status()返回结果状态值:</Text>
            <Text>{address.status} </Text>
            <Text style={styles.title}>location(经纬度坐标):</Text>
            <Text>{ JSON.stringify(result && result.location) } </Text>
            <Text style={styles.title}>formatted_address(结构化地址信息): </Text>
            <Text>{ JSON.stringify(result && result.formatted_address) }</Text>

            <Text style={styles.title}>business(商圈信息):</Text>
            <Text>{ JSON.stringify(result && result.business) }</Text>

            <Text style={styles.title}>addressComponent:</Text>
            <Text>{ JSON.stringify(result && result.addressComponent) }</Text>

            <Text style={styles.title}>pois(周边数组):</Text>
            {
              result && result.pois && result.pois.map(item => {
                return (
                  <View style={{ borderColor: '#09f', borderBottomWidth: 0.5 }}>
                    <Text>{ JSON.stringify(item) }</Text>
                  </View>);
              })
            }
            <Text style={styles.title}>poiRegions:</Text>
            <Text>{ JSON.stringify(result && result.poiRegions) }</Text>

            <Text style={styles.title}>sematic_description:</Text>
            <Text>{ JSON.stringify(result && result.sematic_description) }</Text>

            <Text style={styles.title}>cityCode:</Text>
            <Text>{ JSON.stringify(result && result.cityCode) }</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
