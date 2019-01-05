package com.locations;

import android.util.Log;
import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

public class LocationModule extends ReactContextBaseJavaModule {

    private Promise mScanImagePromise;

    ReactApplicationContext reactApplicationContext = null;
    private static final String RESPONSE_CODE_ERROR = "RESPONSE_CODE_ERROR";
    public LocationClient mLocationClient;
    private boolean isFirstLocate = true;

    public LocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactApplicationContext= reactContext;
    }

    @ReactMethod
    private void initLocation() {
        mLocationClient = new LocationClient(getReactApplicationContext());
        mLocationClient.registerLocationListener(new MyLocationListener());
        LocationClientOption option = new LocationClientOption();
        option.setLocationMode(LocationClientOption.LocationMode.Hight_Accuracy);
        //可选，设置定位模式，默认高精度
        //LocationMode.Hight_Accuracy：高精度；
        //LocationMode. Battery_Saving：低功耗；
        //LocationMode. Device_Sensors：仅使用设备；

        option.setCoorType("bd09ll");
//        locationOption.setCoorType("gcj02");
        //可选，设置返回经纬度坐标类型，默认GCJ02
        //GCJ02：国测局坐标；
        //BD09ll：百度经纬度坐标；
        //BD09：百度墨卡托坐标；
        //海外地区定位，无需设置坐标类型，统一返回WGS84类型坐标
        option.setScanSpan(5000);
        //可选，设置发起定位请求的间隔，int类型，单位ms
        //如果设置为0，则代表单次定位，即仅定位一次，默认为0
        //如果设置非0，需设置1000ms以上才有效
        option.setIsNeedAddress(true);
        option.setOpenGps(true);
        //可选，默认false，设置是否需要POI结果，可以在BDLocation.getPoiList里得到
//        option.setIsNeedLocationPoiList(true);

//            option.setEnableSimulateGps(true);
        //可选，设置是否需要过滤GPS仿真结果，默认需要，即参数为false

        mLocationClient.setLocOption(option);
        requestLocation();
    }

    private void requestLocation() {
        mLocationClient.start();
    }

    @Override
    public String getName() {
        return "LocationModule";
    }

    @ReactMethod
    public void getBDLocation(Promise promise) {
        mScanImagePromise = promise;
    }

    private void navigateTo(BDLocation location) {
        if (isFirstLocate) {
            try {
                WritableMap map = Arguments.createMap();
                map.putDouble("latitude", location.getLatitude());
                map.putDouble("longitude", location.getLongitude());
                mScanImagePromise.resolve(map);
                mLocationClient.stop();
            } catch (Exception e) {
                mScanImagePromise.reject(RESPONSE_CODE_ERROR, e.getMessage());
                Log.d("LocationModule:", e.getMessage());
            }
        }
    }

    public class MyLocationListener implements BDLocationListener {
        @Override
        public void onReceiveLocation(BDLocation bdLocation) {
            if (bdLocation.getLocType() == BDLocation.TypeGpsLocation ||
                    bdLocation.getLocType() == BDLocation.TypeNetWorkLocation) {
                navigateTo(bdLocation);
            }
        }
    }
}
