import {request} from '../../utils/request.js'
import {URL_TRENDINFO, KEYSTORAGE} from '../service/const.js'

function blindBoxGoods() {
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL_TRENDINFO.BLIND_GOODS}?v=${Date.now()}`
    }).then(res => {
      resolve(res)
      // res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err => {
      reject(new Error(err.msg))
    })
  }))
}

function blindBoxStock(ruleId) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL_TRENDINFO.BLIND_BOX_STOCK,
      data: {ruleId}
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err => {
      reject(new Error(err.msg))
    })
  }))
}

export {
  blindBoxGoods,
  blindBoxStock
}
