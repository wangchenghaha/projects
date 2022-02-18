import { request } from '../utils/request.js'
import { URL } from '../src/const.js'

function getAlbumJson(){
  return new Promise((resolve, reject)=>{
    request({ url:URL.ALBUMGIRLS_JSON}).then(res=>{
      resolve(res.data)
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}
// 获取抢红包的时间范围
const robRedBagTime = () => {
  return new Promise((resolve, reject)=>{
    request({
      url:URL.ROB_RED_BAG_TIME
    }).then(res=>{
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg))})
  })
};
export{
  getAlbumJson,
  robRedBagTime
}
