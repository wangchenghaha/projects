import config from '../config/index'
export default (options = { method: 'GET', url: '', data: { openid: '' }, header: 1, loading: true, needUnionid: false }) => new Promise((resolve, reject) => {
    options.method = options.method || 'GET'
    options.data = options.data || {}
    options.header = options.header || 1
    options.loading = options.loading
    if (options.loading) {
        wx.showLoading({
            title: '正在加载',
            icon: 'loading'
        })
    }
    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    let unionid = wx.getStorageSync('unionid')
    // 找不到openid
    if (!openid || (options.needUnionid && !unionid)) {
        wx.navigateTo({
            url: '/pages/etoLogin/etoLogin'
        })
        return
    }
    options.data.brand = config.brand
    options.data.config_name = config.config_name
    options.data.openid = openid
    options.data.unionid = unionid || ''
    console.log(`接口${options.url}入参`, options.data)
    wx.request({
        url: options.url,
        data: options.data,
        header: options.header === 1 ? { 'content-type': 'application/json' } : { 'content-type': 'application/x-www-form-urlencoded' },
        method: options.method,
        success: (result) => {
            console.log(`接口${options.url}返回值`, result)
            if (result.statusCode != 200) {
                wx.showModal({
                    title: '提示',
                    content: '网络出小差了，请稍后重试',
                    showCancel: false,
                })
                reject()
                return
            }
            if(result.data.errcode == 0 || result.data.errcode == 30002 || result.data.errcode == 30001 || result.data.errcode == 50001) {
                resolve(result.data)
            }else{
                wx.showModal({
                    title: '提示',
                    content: result.data.errmsg || '活动火爆，稍后再试哦~',
                    showCancel : false
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