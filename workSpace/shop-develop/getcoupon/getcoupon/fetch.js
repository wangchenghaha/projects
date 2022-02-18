// import configModel from '../models/wemallActiveConfig.mpdel'
const app = getApp();
const brand = app.config.brand;
var UniondId = wx.getStorageSync("unionid");
var OpenId = wx.getStorageSync("wxOpenID")||wx.getStorageSync("openid");
export default (options = { method: 'GET', url: '', data: { openid: '' }, header: 1, loading: true, needUnionid: false }) => new Promise((resolve, reject) => {
    console.log('options ====', options)
    options.method = options.method || 'GET'
    options.data = options.data || {}
    options.header = options.header || 1
    options.loading = options.loading || false
    if (options.loading) {
        wx.showLoading({
            title: '正在加载',
            icon: 'loading'
        })
        console.log(options)
    }
    let openid = wx.getStorageSync("wxOpenID")||wx.getStorageSync("openid")
    let unionid = UniondId
        // 找不到openid
    if (!openid) {
        return
    }
    options.data.openid = openid
    options.data.unionid = unionid || ''
    
    console.info('options',options)
    wx.request({
        url: options.url,
        data: options.data,
        header: options.header === 1 ? { 'content-type': 'application/json' } : { 'content-type': 'application/x-www-form-urlencoded' },
        method: options.method,
        success: (result) => {
            console.info('封装的请求结果',result)
            if (result.statusCode != 200) {
                wx.showModal({
                    title: '提示',
                    content: '网络出小差了，请稍后重试',
                    showCancel: false,
                })
                return
            }
            resolve(result)
        },
        fail: (error) => {
            reject(error)
        },
        complete: (res) => {
            wx.hideLoading()
        }
    });

})