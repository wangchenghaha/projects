
import main from '../utils/utils'
let cont = 0
export default (options = {method: 'GET',url:'' , data: {openid:''},  header: 1, loading: true,needUnionid:false}) => new Promise((resolve, reject) => {
    options.method = options.method || 'GET'
    options.data = options.data || {}
    options.header = options.header || 1
    options.loading = options.loading == undefined ? true : options.loading
    console.log('loading----->',options.url,options.loading)
    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    let unionid = wx.getStorageSync('unionid')
    console.log('openid-->',openid)
    console.log('unionid-->',unionid)
    // 找不到openid
    if (!openid || !unionid) {
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
    // options.data.brand = main.config.brand
    options.data.brand = 2
    options.data.openid = openid
    options.data.unionid = unionid || ''
    if((options.method == 'GET' || options.method == 'POST') && options.loading) {
        wx.showLoading({
            title: '正在加载',
            icon: 'loading'
        })
        cont += 1
        console.log('conts----->',options.url,cont)
    }
    wx.request({
        url: options.url,
        data: options.data,
        header: options.header === 1 ? {'content-type':'application/json'} : { 'content-type': 'application/x-www-form-urlencoded' },
        method: options.method,
        success: (result) => {
            console.log(options.url+'------->',result)
            if(result.statusCode != 200) {
                wx.showModal({
                    title: '提示',
                    content: '网络出小差了，请稍后重试',
                    showCancel: false,
                })
                return
            }
            resolve(result.data)
        },
        fail: (error) => {
            reject(error)
        },
        complete: () => {
            if(options.loading) {
                cont -= 1
                if(cont == 0) {
                    wx.hideLoading()
                }
                console.log('cont-',cont)
            }
        }
    });
      
}) 