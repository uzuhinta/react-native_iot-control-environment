import request from '../common/axios';
// import AsyncStorage from '@react-native-community/async-storage'
export function getDetailInvoice(key, page, size, status) {
  return request({
    url: `/api/secure/invoices?key${key ? '=' + key : ''}&page${
      page ? '=' + page : ''
    }&size${size ? '=' + size : ''}&status${status ? '=' + status : ''}`,
    method: 'get',
  });
}
export function getSummaryInvoice() {
  return request({
    url: '/api/secure/user/invoices',
    method: 'get',
  });
}
