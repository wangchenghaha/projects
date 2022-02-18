let header_json = { 'content-type': 'application/json' };
let header_form = { 'content-type': 'application/x-www-form-urlencoded' };
import regeneratorRunTime from '../common/regenerator/index.js'
import API from '../common/api/index'
import Config from '../config/index'

function showmodel(cont) {
    wx.showModal({
        title: '提示',
        content: cont || '活动火爆，请稍后再试~',
        mask : true,
        showCancel:false
    })
}

const baseAxios = (options, success, fail) => {
    if (!options.noloading ) {
        wx.showLoading({
            title: '',
            mask: true
        })
    }
    wx.request({
        url: options.url,
        data: options.data,
        header: options.headerType == 1 || !options.headerType ? header_json : header_form,
        method: options.method.toUpperCase() || 'GET',
        dataType: 'json',
        responseType: 'text',
        success: res => success(res),
        fail: (error) => fail(error),
        complete : (back) => {
            if (!options.noloading ) {
                wx.hideLoading()
            }
        }
    })
}

const getSession = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout:10000,
            success: (result) => {
                let params = {
                    code: result.code,
                    brand: Config.brand,
                    config_name: Config.config_name,
                }
                baseAxios({method: 'GET', headerType: 2, data: params, url: API.getSession }, res => {
                    let { data, errcode } = res.data
                    if (errcode == 0 || errcode== -1) {
                        wx.setStorageSync('openid', data.openid)
                        wx.setStorageSync('sessionId', data.miniapp_session_id)
                        resolve(data)
                    } else {
                        reject({errcode})
                    }
                }, fail => {
                    reject(fail)
                })
            },
            fail: error => {
                reject(error)
            }
        })
    })
}

const axios = (options = {method: 'get', headerType: 1, data: {session_id:''}, url: ''}) => new Promise(async (resolve, reject) => {
    // if (options.url !== API.getSession) {
    //     options.data.session_id = wx.getStorageSync('sessionId')
    //     options.data.brand = Config.brand
    //     options.data.openid = wx.getStorageSync('wxOpenID') || ''
    //     options.data.unionid = wx.getStorageSync('unionid') || ''
    // }
    // if(!wx.getStorageSync('sessionId')) {
    //     let _ses = await getSession()
    //     options.data.session_id = _ses.miniapp_session_id
    // }
    options.data.brand = Config.brand
    options.data.openid = wx.getStorageSync('wxOpenID') || ''
    options.data.unionid = wx.getStorageSync('unionid') || ''

    baseAxios(options, res => {
        // console.log('接口返回结果：',res,`接口是：${options.url}`,`入参是：${JSON.stringify(options.data)}`)
        if (res.data && res.data.errcode != 0) {
            // 需要重新授权
            if (res.data.errcode == 30001 || res.data.errcode == 202 || res.data.errcode == 201) {
                resolve(res.data)   
            } else {
                if (options.url != API.a_status) {
                    wx.showToast({
                      title: res.data.errmsg || '网络不稳定',
                      icon: 'none',
                    })
                  }
                  
            }
        } else if(res.data.errcode == 0) {
            resolve(res.data)
        }
    }, error => {
        showmodel()
        reject(error)
    })
})
export default {
    request(options = {method: 'POST',headerType: 1, data: {}, url:'', noloading: false}) {
        return axios(options)
    },
    getSessionkey() {
        return getSession()
    }
}