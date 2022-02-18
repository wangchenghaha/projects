//购物车业务模块

import { request } from '../utils/request.js'
import { URL } from '../src/const.js'

// 直播
function liveRoom() {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.LIVE_ROOM,
      data: {
        "start": 0, // 为起始页
        "limit": 10 // 为每页多少个
      },
      method: 'POST',
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}
// 回放视频
function roomReplay(roomId) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.ROOM_REPLAY,
      data: {
        "action": "get_replay", // 获取回放
        "room_id": roomId, // 直播间id
        "start": 0, // 为起始页
        "limit": 10 // 为每页多少个
      },
      method: 'POST',
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}
function shareLiveList(data) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.SHARE_LIVE_LIST,
      data,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}
function shareLiveDetail(id) {
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL.SHARE_LIVE_DETAIL}?id=${id}`,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}
function shareLiveCount(data) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.SHARE_LIVE_COUNT,
      data,
      method: 'PUT',
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}
function shareLiveAdd(data) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.SHARE_LIVE_ADD,
      data,
      method: 'POST',
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

function shareLiveRemove(id) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.SHARE_LIVE_REMOVE,
      data: {id},
    }).then(res => {
      res.code === 0 ? resolve(res) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

export {
  liveRoom,
  roomReplay,
  shareLiveList,
  shareLiveDetail,
  shareLiveCount,
  shareLiveAdd,
  shareLiveRemove
}