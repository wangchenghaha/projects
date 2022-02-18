import { getMiniOpenid } from '../../../service/mini'
import { wxLogin } from '../../../service/user'
import Config from '../config/index'
const header = [{ 'content-type': 'application/json' }, { 'content-type': 'application/x-www-form-urlencoded' }]
const brand = Config.debug ? Config.local.brand : Config.proxy.brand

const axios = (options = {}, success, fail) => {
    if (!options.noloading) {
        wx.showLoading({
            title: '',
            mask: true
        })
    }
    wx.request({
        url: options.url,
        data: options.data,
        header: header[options.headerType || 0],
        method: options.method.toUpperCase() || 'GET',
        dataType: 'json',
        responseType: 'text',
        success: res => success(res),
        fail: (error) => fail(error),
        complete: (back) => {
            if (!options.noloading) {
                wx.hideLoading()
            }
        }
    })
}

const getOid = () => {
    return new Promise((resolve, reject) => {

        if (Config.debug) {
            resolve({
                openId: 'oowuL5d5MYQKtExiyoU7qp9ljGSI',
                unionId: 'ozYoQswiYv9eG4AjeP5rx3iXDhd4'
            })
            return
        }
        if (wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')) {
            resolve({
                openId: wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid'),
                unionId: wx.getStorageSync('unionid') || wx.getStorageSync('userInfo').unionId || ''
            })
        } else {
            wxLogin().then(wxRes => {
                //发起网络请求
                getMiniOpenid(wxRes, brand).then(res => {
                    wx.setStorageSync('wxOpenID', res.openid);
                    wx.setStorageSync('openid', res.openid);
                    res.unionid ? wx.setStorageSync('unionid', res.unionid) : '';
                    resolve({
                        openId: res.openid || '',
                        unionId: res.unionid || wx.getStorageSync('unionid') || wx.getStorageSync('userInfo').unionId || ''
                    })
                })
            })
        }
    })
}

const rp = (options= {}) => new Promise((resolve, reject) => {
    getOid().then(wxRes => {
        options.data.openid = wxRes.openId
        options.data.brand = brand
        options.data.unionid = wxRes.unionId
        
        axios(options, res => {
            console.log('接口返回结果：',res,`接口是：${options.url}`,`入参是：${JSON.stringify(options.data)}`)

            if (res.data.errcode == 0) {
                resolve(res.data)
            } else {
                wx.showToast({
                    title: res.data.errmsg || '网络不稳定',
                    icon: 'none',
                    mask: true
                })
                wx.showModal({
                    title: '提示',
                    content: res.data.errmsg || '网络不稳定',
                    showCancel : false,
                    success (res) {
                    }
                })
            }
        }, err => {
            wx.showModal({
                title: '提示',
                content: err || '活动火爆，请稍后再试~',
                mask : true,
                showCancel:false
            })
            reject(err)
        })
    })
})


export default rp