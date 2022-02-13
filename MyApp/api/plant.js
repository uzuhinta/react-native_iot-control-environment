import request from '../common/axios';

export function getPlant(key, page, size, status) {
  return request({
    url: `/api/secure/plants?key${key ? '=' + key : ''}&page${
      page ? '=' + page : ''
    }&size${size ? '=' + size : ''}&status${status ? '=' + status : ''}`,
    method: 'get',
  });
}

// /api/secure/plants?key&page=1&size=1&status=1
