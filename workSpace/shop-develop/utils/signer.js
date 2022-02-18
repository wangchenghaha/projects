const sha = require('./sha512.min')
//生成随机字符串
const randomString = (length) => {
  var stringBuilder = '';
  for (let i = 0; i < length; i++) {
    stringBuilder += Math.random().toString(36).substr(2);
  }
  return stringBuilder;
}

/**
 * 签名GET请求 url
 */
function signQuery(params) {

  //参数合并
  var query = Object.assign({
    t: Date.now(), //时间戳
    n: randomString(4) //防重放攻击字符(客户端生成的随机字符串)
  }, params);

  //按字母正向排序字段key, 如: ['t','k','phone']
  var qskArray = Object.keys(query).sort();

  //按字母正向排序url
  var sortQuey = '';
  for (let key of qskArray) {
    sortQuey += `${key}=${query[key]}&`; //注意签名时减去最后一个&符号
  }

  //对排序好的url进行百分号编码
  // console.log(`-> ${sortQuey}`)
  let data = encodeURI(sortQuey.substring(0, sortQuey.length - 1)); //注意签名时减去最后一个&符号
  // console.log(`-> ${sortQuey}`)
  // console.log(`${`lz${data}sz`}`);

  //使用has512签名
  var signature = sha.sha512(`${data}-bktsv3`)
  // console.log('web : '+signature);
  // console.log(`${signature}`)
  sortQuey += `s=${signature}`
  // console.log(`${sortQuey}`)
  return sortQuey
}

let query = {
  n: '54023e4d4fff8cec95faacfa2fe4bb4b39e453aaeec13272ecdfef5b',
  t: '1526549784649',
  guideId: '480945'
}
signQuery(query);
export {
  signQuery
}
//注意 vue 和 react 请使用 npm install js-sha512 方式安装
//更多使用方式参考 https://github.com/emn178/js-sha512