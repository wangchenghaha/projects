import main from '../utils/utils'
import API from '../api/index'
import fetch from '../sever/index'
import img from '../imgmodel/imgmodel'
const config = require('../../src/config.js')
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;


Page({
    data: {
        showrule: false,
        couponbg: img.couponbg,
        isloading: true
    },
    onShow: function() {},
    onReady: function() {
        wx.setNavigationBarTitle({
            title: config.title
        })
    },
    onLoad(options) {

    },
    registerFormSubmit(e) { //上传form_id
        if (e.detail.formId) {
            this.formId(e.detail.formId)
        }
    },
    formId(form_id) {
        console.log('form_id', form_id)
        fetch({ url: API.form_id, data: { form_id }, method: "post" }).then(res => {
            console.log(res)
        })
    },
    wxpaythrottle() {
        let _this = this
        if (this.data.isloading) {
            this.setData({
                isloading: false
            })
            throttle(() => {
                _this.wxpay()
            }, 1000)()
        }
    },
    wxpay() { //支付
        let _this = this
        fetch({ url: API.create_order, data: { type: 2 }, method: "post" }).then(res => {
            console.log(res)
            _this.setData({
                isloading: true
            })
            let { data, errcode } = res
            if (errcode == 0) {
                wx.requestPayment({
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    // package: decodeURIComponent(data.package),
                    package: data.package,
                    signType: data.signType,
                    paySign: data.paySign,
                    success(res) {
                        _this.setData({
                            isloading: false
                        })
                        _this.share_token(data.order_id)
                    },
                    fail(res) {
                        console.log(res)
                    }
                })
            }
        })
    },
    share_token(order_id) { //回调
        fetch({ url: API.share_token, data: { order_id, type: 2 } }).then(res => {
            console.log(res)
            let { data: { channel, delivery_id, token, redirect_page }, errcode } = res
            if (errcode == 0 && redirect_page) {
                wx.redirectTo({
                    url: redirect_page
                })
            }
        })
    },
    showrules() {
        this.setData({
            showrule: true
        })
    },
    closerule() {
        this.setData({
            showrule: false
        })
    }
})

let _lastTime = null

function throttle(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
        gapTime = 1000
    }
    return function() {
        let _nowTime = +new Date()
        if (_nowTime - _lastTime > gapTime || !_lastTime) {
            fn()
            _lastTime = _nowTime
        }
    }
}