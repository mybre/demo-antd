import jsonp from 'fetch-jsonp';
import qs from 'qs';
import { request } from 'umi';

export function query(param) {
  return new Promise((resolve, reject) => {
    const str = qs.stringify(param);
    jsonp(`https://searchapi.eastmoney.com/api/suggest/get?${str}`, {
      jsonpCallback: 'cb',
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch(function (err) {
        return reject(err);
      });
  });
}

export function getData(params, options) {
  return request('https://datacenter-web.eastmoney.com/api/get', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
