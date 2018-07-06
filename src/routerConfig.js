import Home from './pages/home';
import BaiduApi from './pages/content/baiduApi';
import AMapApi from './pages/content/aMapApi';

const stackConfig = {
  Home: { screen: Home },
  BaiduApi: { screen: BaiduApi },
  AMapApi: { screen: AMapApi },
};

const stackNavigatorConfig = {
  initialRouteName: 'Home',
  navigationOptions: {
    headerBackTitle: null,
    headerTintColor: '#fff',
    title: 'geolocation',
    showIcon: true,
    swipeEnabled: false,
    animationEnabled: false,
    headerStyle: {
      backgroundColor: '#514b46',
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontWeight: 'bold',
      color: '#fff'
    }
  },
  mode: 'card',
  headerMode: 'float',
};

export {
  stackConfig,
  stackNavigatorConfig,
};
