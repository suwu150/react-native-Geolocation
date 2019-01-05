import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

class Home extends React.Component { // eslint-disable-line
  _renderItem(imgSource, title, routeName) {
    return (
      <TouchableOpacity onPress={() => this._toPage(routeName)}>
        <View
          style={{ height: 36, width: '100%', backgroundColor: '#fff', alignItems: 'center', paddingLeft: 15,
            paddingRight: 5, flexDirection: 'row', justifyContent: 'space-between', borderColor: '#eae6e4',
            borderBottomWidth: 0.5 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
              <Text style={{ color: '#514b46' }} >
                {title}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  _toPage = (routeName) => {
    const { navigation } = this.props;
    if (navigation) {
      navigation.navigate(routeName);
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {
          this._renderItem(
            '',
            '百度',
            'BaiduApi'
          )
        }
        {this._renderItem('', '高德', 'AMapApi')}
        {this._renderItem('', '百度-桥接获取经纬度信息', 'BaiduSDKBri')}
        {/*{this._renderItem(*/}
          {/*'',*/}
          {/*'react-native-maps',*/}
          {/*'ReactNativeMaps'*/}
        {/*)}*/}
      </View>
    );
  }
}

export default Home;
