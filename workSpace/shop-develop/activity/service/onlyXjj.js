import { request } from '../../utils/request.js'
import { ONLYXJJ } from './const'

function getContentJson() {
    return new Promise((resolve, reject) => {
        request({ url: ONLYXJJ.GETCONTENTURL}).then(res => {
            res.status === '200' ? resolve(res.data) : reject(new Error(res.msg))
        }).catch((e) => { reject(new Error(e.msg)) })
    })
}

// 获取优惠券
function getCoupon(_phone){
    return new Promise((resolve, reject)=>{
        request({
            url: ONLYXJJ.GETCOUPON,
            data : {
                phone: _phone
            }
        }).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
            noticeMsg(res.msg)
        }
        else{
            resolve(res.data)
        }
        }).catch((e)=>{
          reject(new Error(e))
        })
    })
}

// 查询优惠券
function queryCoupon(_phone){
    return new Promise((resolve, reject)=>{
        request({
            url: ONLYXJJ.QUERYCOUPON,
            data : {
                phone: _phone
            }
        }).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
            noticeMsg(res.msg)
        }
        else{
            resolve(res.data)
        }
        }).catch((e)=>{
          reject(new Error(e))
        })
    })
}

export {
    getContentJson,
    getCoupon,
    queryCoupon
}