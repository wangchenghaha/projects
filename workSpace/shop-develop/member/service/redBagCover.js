import {request} from "../../utils/request";
// 游戏前缀
const URL_Prefix = '/rest/game/hongbao'
// 获取游戏配置
function hongBaoConfig() {
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL_Prefix}/config`,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err => {
      reject(new Error(err.message))
    })
  }))
}

/**
 * 查询卡券列表
 * @returns {Promise<unknown>}
 */
function hongBaoCards() {
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL_Prefix}/cards`,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err => {
      reject(new Error(err.message))
    })
  }))
}

/**
 * 创建用户信息
 * @param data: { crmRegTime, crmid , facePic, nickName, openid, phone}
 * @returns {Promise<unknown>}
 */
function createUser(data) {
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL_Prefix}/user/add`,
      data,
      method: 'post'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err => {
      reject(new Error(err.message))
    })
  }))
}

/**
 * 查询用户信息
 * @param  openid
 * @returns {Promise<unknown>}
 */
function queryUser(openid) {
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL_Prefix}/user/get?openid=${openid}`,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err => {
      reject(new Error(err.message))
    })
  }))
}

/**
 * 好友助力
 * @param data: {friendFacePic, friendOpenid, nickName, userId}
 * @returns {Promise<unknown>}
 */
function helpAdd(data) {
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL_Prefix}/user/helpAdd`,
      data,
      method: 'post'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err => {
      reject(new Error(err.message))
    })
  }))
}

/**
 * 查询用户卡片列表
 * @param userId
 * @returns {Promise<unknown>}
 */
function userCards(userId) {
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL_Prefix}/user/cards?userId=${userId}`,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err => {
      reject(new Error(err.message))
    })
  }))
}

/**
 * 抽卡
 * @param userId
 * @returns {Promise<unknown>}
 */
function cardAdd(userId) {
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL_Prefix}/user/cardAdd`,
      data: { userId },
      method: 'post'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err => {
      reject(new Error(err.message))
    })
  }))
}
export {
  hongBaoConfig,
  hongBaoCards,
  createUser,
  queryUser,
  helpAdd,
  userCards,
  cardAdd,
}
