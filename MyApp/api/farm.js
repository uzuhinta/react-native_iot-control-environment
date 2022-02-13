import request from '../common/axios';
// import AsyncStorage from '@react-native-community/async-storage'
export function getListFarm() {
  return request({
    url: '/api/secure/farms',
    method: 'get',
  });
  // return setTimeout(() => {
  //   console.log('test');
  // }, 1000);
}
