//导购分享的配置文案

import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'
// 获取购物车列表
function getShareText() {
  return new Promise((resolve, reject)=>{
    request({
      url:URL.SHARETEXT,
    }).then(res=>{
      if(res.code === 0){
        resolve(res.data)
      }
    }).catch((e)=>{reject(new Error(e.msg))})
  })

}

export {
  getShareText
}