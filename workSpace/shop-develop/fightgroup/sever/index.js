
import main from '../utils/utils'
export default (options = {method: 'GET',url:'' , data: {openid:''},  header: 1, loading: true,needUnionid:false}) => new Promise((resolve, reject) => {
    options.method = options.method || 'GET'
    options.data = options.data || {}
    options.header = options.header || 1
    options.loading = options.loading || true
    if (options.loading) {
        wx.showLoading({
            title: '正在加载',
            icon: 'loading'
        })
    }
    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    let unionid = wx.getStorageSync('unionid')
    // 找不到openid
    if (!openid) {
        wx.navigateTo({
            url: '/pages/etoLogin/etoLogin'
        })
        // wx.showToast({
        //     title: '请先授权',
        //     icon: 'none',
        // })
        // wx.hideLoading()
        return
    }
    if(options.needUnionid) {
        if(!unionid) {
            wx.navigateTo({
                url: '/pages/etoLogin/etoLogin'
            })
            return
        }
    }
    options.data.brand = main.config.brand
    // options.data.brand = 1
    options.data.openid = openid
    options.data.unionid = unionid || ''
    wx.request({
        url: options.url,
        data: options.data,
        header: options.header === 1 ? {'content-type':'application/json'} : { 'content-type': 'application/x-www-form-urlencoded' },
        method: options.method,
        success: (result) => {
            console.log(options.url,options.data,result)
            if(result.statusCode != 200) {
                wx.showModal({
                    title: '提示',
                    content: '网络出小差了，请稍后重试',
                    showCancel: false,
                })
                return
            }
            resolve(result.data)
            if (result.data.errcode !== 0 && result.data.errcode !== 201 && result.data.errcode !== 302 && result.data.errcode !== 202) {
                wx.showModal({
                    title: '提示',
                    content: result.data.errmsg,
                    showCancel: false,
                })
            }
        },
        fail: (error) => {
            reject(error)
        },
        complete: () => {
            wx.hideLoading()
        }
    });
      
}) 