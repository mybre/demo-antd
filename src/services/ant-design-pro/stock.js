import jsonp from 'fetch-jsonp';
import qs from 'qs';
export function query(param) {
  return new Promise((resolve, reject) => {
    const str = qs.stringify(param);
    jsonp(`https://searchapi.eastmoney.com/api/suggest/get?${str}`, {
      jsonpCallback: 'cb',
    })
      .then((response) => response.json())
      .then((data) => resolve('1'))
      .catch(function (err) {
        return reject(err);
      });
  });
}

// export function query(param) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve('123123');
//     }, 1000);
//   });
// }
