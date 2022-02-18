import {request} from '../../utils/request.js'
import {ACTIVITY } from './const.js'

function recommendedWeek(data) {
  return new Promise(((resolve, reject) => {
    request({
      url: ACTIVITY.RECOMMENDED_WEEK,
      data,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err => {
      reject(new Error(err.msg))
    })
  }))
}

export {
  recommendedWeek
}
