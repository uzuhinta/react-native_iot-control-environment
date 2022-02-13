import request from '../common/axios';
export function changePassword(data) {
  console.log('dt', data);
  return request({
    url: '/api/secure/users/change_pass',
    method: 'post',
    data,
  });
}
export function changeInfo(data) {
  console.log('dt', data);
  return request({
    url: '/api/secure/users/info',
    method: 'put',
    data,
  });
}
export function getInfo() {
  return request({
    url: '/api/secure/users/info',
    method: 'get',
  });
}
