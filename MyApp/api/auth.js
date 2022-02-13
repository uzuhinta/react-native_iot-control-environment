import request from '../common/axios';

export function signin(data) {
  // console.log(data);
  return request({
    url: '/api/auth/signIn',
    method: 'post',
    data,
  });
}

export function signup(data) {
  console.log(data);
  return request({
    url: '/api/auth/signUp',
    method: 'post',
    data,
  });
}
