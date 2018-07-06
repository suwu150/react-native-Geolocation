/**
 * Created by jkwu on 2018/6/20.
 */
import React, { Component } from 'react';
import Qs from 'qs';
import {
  View, ScrollView, Text, StyleSheet, InteractionManager,
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
    // 最后一步 百度地图逆地理编码转
    // lat<纬度>,lng<经度>

    const baiduLocationConfig = {
      // callback: 'renderReverse',
      ak: '3nHjylGdT3z5jSldf2o2E1qyF85YDLZ4',
      pois: 1,
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
