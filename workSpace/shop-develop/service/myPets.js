import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'

// 查询用户积分信息
function queryUserPoints(_openid) {
    return new Promise(((resolve, reject) => {
      request({
        url: URL.QUERYUSERPOINTS,
        data: {
          openId: _openid
        }
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    }))
  }

  export {
    queryUserPoints
}
