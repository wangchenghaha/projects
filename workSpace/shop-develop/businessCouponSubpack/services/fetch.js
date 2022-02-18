// import configModel from '../models/wemallActiveConfig.mpdel'
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
    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    let unionid = wx.getStorageSync('unionid')
        // 找不到openid
    console.log('openid === ', openid)
    console.log('unionid === ', unionid)
    if (!openid) {
        wx.navigateTo({
                url: '/pages/setting/requestPermission'
            })
            // wx.showToast({
            //     title: '请先授权',
            //     icon: 'none',
            // })
            // wx.hideLoading()
        return
    }
    // if (options.needUnionid) {
    //     if (!unionid) {
    //         wx.navigateTo({
    //             url: '/pages/memberModule/pages/auth/auth'
    //         })
    //         return
    //     }
    // }
    // options.data.brand = configModel.brand
        // options.data.brand = 1
    options.data.openid = openid
    options.data.unionid = unionid || ''
    // options.data.record_id = options.data.record_id || 0
    // options.data.type = options.data.type || 0
    
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
            // if (result.data.errcode == 0 || result.data.errcode == 80002 || result.data.errcode == 80003) {
            //     resolve(result.data)
            // }else{
            //     wx.showModal({
            //         title: '提示',
            //         content: result.data.errmsg || '活动火爆，稍后再试哦~',
            //         showCancel : false
            //     })
            // }
        },
        fail: (error) => {
            reject(error)
        },
        complete: (res) => {
            // console.log(options.url, options.data, res)
            if(options.loading){
                wx.hideLoading()
            }
        }
    });

})