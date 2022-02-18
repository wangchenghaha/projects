

export default (options = {method: 'GET',url:'' , data: {openid:''},  header: 1, loading: true, hideToast: false}) => new Promise((resolve, reject) => {
    options.method = options.method || 'GET'
    options.data = options.data || {}
    options.header = options.header || 1
    options.loading = options.loading || true
    options.hideToast = options.hideToast || false
    if (options.loading) {
        wx.showLoading({
            title: '正在加载',
            icon: 'loading',
            mask : true
        })
    }
    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    let unionid = wx.getStorageSync('unionid')
    let ac_number = wx.getStorageSync('ac_number') || ''
    // 找不到openid
    if (!openid || !unionid) {
        // wx.navigateTo({
        //     url: '/pages/etoLogin/etoLogin'
        // })
        wx.showToast({
            title: '请先授权',
            icon: 'none'
        })
        wx.hideLoading()
        return
    }
    options.data.openid = openid
    options.data.unionid = unionid
    options.data.ac_number = ac_number+''
    wx.request({
        url: options.url,
        data: options.data,
        header: options.header === 1 ? {'content-type':'application/json'} : { 'content-type': 'application/x-www-form-urlencoded' },
        method: options.method,
        success: (result) => {
            resolve(result.data)
            if (result.data.errcode !== 0 && !options.hideToast) {
                wx.showToast({
                    title: result.data && result.data.errmsg || '',
                    icon: 'none'
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