// 获取心愿单列表
import {request} from "../../utils/request";
import {URL} from "./const";

function pages(currentPage = 1) {
  return new Promise((resolve, reject)=>{
    request({
      url: `${URL.ALBUM}?pageSize=10&currentPage=${currentPage}`,
    }).then(res=>{
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
function getFeedLive(){
  const {cdn, brand} = getApp().config;
  return new Promise((resolve, reject)=>{
    request({ url: `${cdn}/assets/wechat/JSON/${brand}/0709.json?v=${Date.now()}`}).then(res=>{
      resolve(res)
    })
  })
}
export {
  pages,
  getFeedLive
}
