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
        couponbg: '',
        isloading: true,
        activity_num: '',
        ruleimg: '',
        pic: '',
        tmp_id: [],
        isgetTmpId: false
    },
    onShow: function() {},
    onReady: function() {
        wx.setNavigationBarTitle({
            title: config.title
        })
    },
    onLoad(options) {
        let activity_num = options.activity_num
        let ruleimg = options.ruleimg
        let couponbg = options.pic || img.couponbg
        this.setData({
            activity_num,
            ruleimg,
            couponbg
        })
        this.get_tmp()
    },
    get_tmp() {
        fetch({ url: API.get_tmp, method: "get", data: { activity_num: this.data.activity_num } }).then(res => {
            this.setData({
                isgetTmpId: true
            })
            let { data, errcode } = res
            if (errcode == 0) {
                if (data && data.length) {
                    this.setData({
                        tmp_id: data
                    })
                }
            }
        })
    },
    wxpaythrottle() {
        let _this = this
        console.log('haha', this.data.isloading)
        if (this.data.isloading) {
            this.setData({
                isloading: false
            })
            throttle(() => {
                _this.uptempid()
            }, 1000)()
        }
    },
    //上传formid
    formId(tmplIds) {
        fetch({ url: API.form_id, method: "post", data: { list: tmplIds, activity_num: this.data.activity_num } }).then(res => {
            console.log('上传成功', tmplIds)
        })
    },
    uptempid() {
        let _this = this
        if (this.data.isgetTmpId) {
            if (this.data.tmp_id.length) {
                wx.requestSubscribeMessage({
                    tmplIds: this.data.tmp_id,
                    success(res) {},
                    fail(err) {},
                    complete(res) {
                        console.log('授权结果', res)
                        if (res.errMsg == 'requestSubscribeMessage:ok') {
                            let tmplIds = []
                            for (let key in res) {
                                if (key != 'errMsg') {
                                    if (res[key] == 'accept') { //允许
                                        tmplIds.push(key)
                                    }
                                }
                            }
                            if (tmplIds.length) {
                                _this.formId(tmplIds)
                                _this.wxpay()
                            } else {
                                _this.setData({
                                    isloading: true
                                })
                            }
                        }
                    }
                })
            } else {
                _this.wxpay()
            }
        }
    },
    wxpay() { //支付
        let _this = this
        fetch({ url: API.create_order, method: "post", data: { activity_num: this.data.activity_num } }).then(res => {
            _this.setData({
                isloading: true
            })
            console.log(res)
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
                        console.log(res)
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
        fetch({ url: API.share_token, data: { order_id, activity_num: this.data.activity_num } }).then(res => {
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