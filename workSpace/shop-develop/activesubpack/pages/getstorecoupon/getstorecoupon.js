import Utils from '../../service/util'
import Fetch from '../../service/fetch'
import Urls from '../../service/url'
const brandName = getApp().config.brand;
Page({
    data: {
        isBigPhone: Utils.isBigPhone(),
        pageOptions: {},
        coupon_info: {

        },
        code: '',
        code_img: '',
        brandName
    },
    onLoad: function(options) {
        options = options.scene ? Utils.getRouteObjByStrOfSunQr(options.scene) : options
        console.log('商家券页面原始参数', options)
        this.setData({
            pageOptions: options || {}
        })
    },
    onShow: function() {
        if (wx.getStorageSync('isLoginNew')) {
            wx.showLoading({
                title: '正在注册',
                mask: false
            });
            return
        }
        this._couponDetail()
    },
    onReady() {
        wx.setNavigationBarTitle({
            title: '优惠券'
        })
    },
    _couponDetail() {
        let _this = this
        Fetch({ url: Urls.storecoupon_record, method: 'POST', data: this.data.pageOptions,needUnionid:true }).then(res => {
            console.log(res)
            if (res.errcode == 0) {

                if(res.data.type == 2) { //线上券
                    _this.gohome()
                    return
                }
                if (res.data.is_member == 1) { //是会员
                    // this.showQr(res.data.crm_code)
                    this.setData({
                        coupon_info: res.data.coupon_info  || {},
                        code: res.data.crm_code,
                        code_img: res.data.code_img,
                        type :  res.data.type
                    })
                } else { //不是会员
                    Utils.memberRegistration(res.data.activatemembercard_url)
                }
            } else {
                wx.showModal({
                    title: '提示',
                    content: res.errmsg || '活动火爆，请稍后再试',
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            _this.gohome()
                        }
                    }
                })
            }
        })
    },
    gohome() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    //注册完成的回调
    registerCallBack() {
        wx.hideLoading();
        this._couponDetail()
    },
})