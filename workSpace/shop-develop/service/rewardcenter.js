
import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'

function getRewardCenterList(_brand, _type, _brandCode, _pointsStart, _pointsEnd, _moneyStart, _moneyEnd, _goodsCouponType){
    return new Promise((resolve, reject) => {
          request({
              url: URL.GETREWARDCENTERLIST,
              data:{
                  type: _type,
                  subBrand: _brandCode,
                  pointsStart: _pointsStart,
                  pointsEnd: _pointsEnd,
                  moneyStart: _moneyStart,
                  moneyEnd: _moneyEnd,
                  goodsCouponType: _goodsCouponType
              },
              header: {
                'content-type': 'application/json', // 请求体类型默认值
                token: wx.getStorageSync('token') || '' ,//请求凭证
                brand : _brand,
             },
          }).then((response) =>{
                if(response.code == 0){
                    resolve(response.data);
                } else {
                    reject(new Error(response.msg));
                }
          })  .catch((e) => {
              reject(new Error(e.msg || e.message));
          })
    })
}
export {
    getRewardCenterList,
}