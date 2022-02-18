import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'

// 查询商品评价/买家秀列表
function getGoodsComment(_data) {
    return new Promise(((resolve, reject) => {
      request({
        url: URL.GETGOODSCOMMENT,
        data: _data,
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    }))
}


export {
    getGoodsComment
}