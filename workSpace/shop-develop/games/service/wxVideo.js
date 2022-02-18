import { request } from '../../utils/request.js'
import {URL_ACTIVITY} from './const'

/**
 * 查询当前抽奖信息
 * @param phone
 * @returns {Promise<unknown>}
 */
const extAward = () => {
  return new Promise((resolve, reject)=>{
    request({
      url:  URL_ACTIVITY.GET_EXT_AWARD,
    }).then(res=>{
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
/**
 * 查询用户抽奖信息
 * @returns {Promise<unknown>}
 */
const extUser = (phone) => {
  return new Promise((resolve, reject)=>{
    request({
      url:  `${URL_ACTIVITY.GET_EXT_USER}?phone=${phone}`,
    }).then(res=>{
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
/**
 * 参与抽奖
 * @param data
 * @returns {Promise<unknown>}
 */
const addUser = (data) => {
  return new Promise((resolve, reject)=>{
    request({
      url:  URL_ACTIVITY.ADD_EXT_USER,
      method: 'post',
      data,
    }).then(res=>{
			resolve(res);
      // res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
/**
 * 查询当前奖品参与总人数与所有奖品类型的中奖记录
 * @returns {Promise<unknown>}
 */
const awardAndSuccess = () => {
  return new Promise((resolve, reject)=>{
    request({
      url:  URL_ACTIVITY.GET_AWARD_AND_SUCCESS,
    }).then(res=>{
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
export {
  extAward,
  extUser,
  addUser,
  awardAndSuccess
}