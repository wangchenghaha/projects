import { request } from '../utils/request.js'
import {URL} from "../src/const";

// 添加足迹
function addTrack(_data) {
    return new Promise((resolve, reject)=>{
      request({
        url:URL.ADD_TRACK,
        method: 'post',
        data:_data
      }).then(res=>{
        res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
      }).catch((e)=>{reject(new Error(e.msg || e.message))})
    })
  }

  // 查询足迹
function getTrack() {
    return new Promise((resolve, reject)=>{
      request({
        url:URL.GETTRACK,
      }).then(res=>{
        res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
      }).catch((e)=>{reject(new Error(e.msg || e.message))})
    })
  }


  // 删除足迹
function removeTrack(goodsCode) {
    return new Promise((resolve, reject)=>{
      request({
        url:URL.REMOVETRACK,
        method: 'post',
        data: goodsCode
      }).then(res=>{
        res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
      }).catch((e)=>{reject(new Error(e.msg || e.message))})
    })
  }

  export{
      addTrack,
      getTrack,
      removeTrack
  }