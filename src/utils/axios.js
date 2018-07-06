/**
 * Created by jkwu on 17-11-27.
 */
import axios from 'axios';
import qs from 'qs';

// axios 配置
// axios.defaults.timeout = 5000;
// axios.defaults.baseURL = '/';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.withCredentials = true;
// axios.defaults.crossDomain = true;

/*
*   return axios.get(url, qs.stringify({
 method: 'get',
 url,
 responseType: 'json',
 headers: {
 'Content-Type': 'application/x-www-form-urlencoded',
 Accept: 'application/json',
 'Access-Control-Allow-Origin': '*',
 'Access-Control-Allow-Methods': '*'
 },
 crossdomain: true,
 proxy: {
 host: '127.0.0.1',
 port: 3009
 }
 }));
* */


function gaxios(url) {
  console.log(url);
  return axios(url, {
    method: 'get',
    url,
    responseType: 'json',
  });
}

export { gaxios };
