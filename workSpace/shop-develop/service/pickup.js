//自提业务模块

import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'
let utils = require('../utils/utils.js');
// 到店自提
function pickupStoreList(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.PICKUP_STORE_LIST,
      data: data,
      method: 'post'
    }).then(res => {
      if(res.code === 0){
        res.data.forEach(ele=>{
          let name = ele.name;
          let newName = "";
          for(let char of name){
              if(utils.isChinese(char)){
                  newName+=char;
              }
          }
          if(!("店"==newName.charAt(newName.length-1))){
              newName+="店";
          }
          ele.name = newName;
      });
        resolve(res.data)
      } else{
        reject(new Error(res.msg))
      }

    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
export {
  pickupStoreList
}