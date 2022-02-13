import request from '../common/axios';
// import AsyncStorage from '@react-native-community/async-storage'
export function getListDevice(farmId) {
  return request({
    url: `/api/secure/devices?farmId=${farmId}`,
    method: 'get',
  });
}
export function getLastData(deviceID) {
  return request({
    url: `/api/secure/devices/latest?deviceId=${deviceID}`,
    method: 'get',
  });
}

export function controlDevice(data) {
  return request({
    url: '/api/secure/devices/control',
    method: 'post',
    data,
  });
}
export function cropDevice(data) {
  return request({
    url: '/api/secure/crops',
    method: 'post',
    data,
  });
}

export function stopCropDevice(cropId) {
  return request({
    url: `/api/secure/crops?deviceId=${cropId}`,
    method: 'delete',
  });
}

export function getLastStateDevice(deviceID) {
  return request({
    url: `/api/secure/devices/state/latest?deviceId=${deviceID}`,
    method: 'get',
  });
}
