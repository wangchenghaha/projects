import { request } from '../../utils/request.js'
import {URL_ACTIVITY} from './const'
// 查询用户
const gameUserInfo = (openId) => {
  return new Promise((resolve, reject)=>{
    request({
      url: `${URL_ACTIVITY.GRAB_QUERY_USER}?openId=${openId}`,
    }).then(res=>{
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
// 创建用户
const creatGameUser = (data) => {
  return new Promise((resolve, reject)=>{
    request({
      url: URL_ACTIVITY.GRAB_CREAT_USER,
      method: 'post',
      data,
    }).then(res=>{
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
// 创建红包
function addActivity(data) {
  return new Promise((resolve, reject)=>{
    request({
      url: URL_ACTIVITY.GRAB_ADD_ACTIVITY,
      method: 'post',
      data
    }).then(res=>{
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
// 获取活动红包领取列表
const redBagList = (id) => {
  return new Promise((resolve, reject)=>{
    request({
      url:  `${URL_ACTIVITY.GRAB_LIST_REDS}?activityId=${id}`
    }).then(res=>{
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
/**
 * 抢红包详情
 * @param id: String
 * @returns {Promise<unknown>}
 */
const redBagDetail = (id) => {
  return new Promise((resolve, reject)=>{
    request({
      url:  `${URL_ACTIVITY.GRAB_REDS_DETAIL}?activityId=${id}`
    }).then(res=>{
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
/**
 * 抢红包
 * @param data: {activityId, phone, userid}
 * @returns {Promise<unknown>}
 */
const robRedBag = (data) => {
  return new Promise((resolve, reject)=>{
    request({
      url:  URL_ACTIVITY.GRAB_REDS,
      data,
    }).then(res=>{
      resolve(res);
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
/**
 * 获取我的活动红包领取列表
 * @param data: {activityId, userid}
 * @returns {Promise<unknown>}
 */
const myRedBag = (data) => {
  return new Promise((resolve, reject)=>{
    request({
      url:  URL_ACTIVITY.GRAB_MY_REDS,
      data,
    }).then(res=>{
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
/**
 * 优惠券兑奖记录列表
 * @param userId
 * @returns {Promise<unknown>}
 */
const grabCouponRecords = (userId) => {
  return new Promise((resolve, reject)=>{
    request({
      url:  `${URL_ACTIVITY.GRAB_COUPON_RECORDS}?userid=${userId}`,
    }).then(res=>{
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
export {
  addActivity,
  redBagList,
  gameUserInfo,
  creatGameUser,
  robRedBag,
  myRedBag,
  redBagDetail,
  grabCouponRecords
}