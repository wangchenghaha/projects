// import img from '../model/img.model'
import main from '../utils/utils'
import API from '../api/index'
import fetch from '../sever/index'
const config = require('../../src/config.js')
Page({
    data: {
        isloading: false,
        isloading2: false,
        activity_num: '',
        is_join: '',
        is_get_coupon: '',
        card_data: [],
        isBigPhone: main.judgeBigScreen(),
        showrule: false,
        brand: main.config.brand,
        activity_info: {},
        channel: '',
        ruleimg: '',
        active2_is_join: 0,
        token: ''
    },
    onShow: function() {
        if (this.data.activity_num) {
            this.init()
        }
    },
    onReady: function() {
        wx.setNavigationBarTitle({
            title: config.title
        })
    },
    onLoad(options) {
        this.setData({
            activity_num: options.activity_num || '',
        })
    },
    //首页状态
    init() {
        fetch({ url: API.index, data: { activity_num: this.data.activity_num }, loading: true }).then(res => {
            let { data, errcode, errmsg } = res
            this.setData({
                isloading: false
            })
            if (errcode == 0) {
                this.setData({
                    activity_info: data.activity_info,
                    active2_is_join: data.is_join,
                    token: data.token,
                    isloading: true
                })
                let channel = main.getQueryVariable(data.activity_info.coupon_address_one, 'channel')
                if (channel) {
                    this.setData({
                        channel
                    })
                    this.active1init(channel)
                }
            }
        }).catch(err => {
            this.setData({
                isloading: false
            })
        })
    },
    //活动1的状态
    active1init(channel) {
        fetch({ url: API.activeindex, data: { channel }, loading: true }).then(res => {
            let { data, errcode, errmsg } = res
            if (errcode == 0) {
                this.setData({
                    isloading2: true
                })
                let { is_join, is_get_coupon, card_data } = data
                this.setData({
                    is_join,
                    is_get_coupon,
                    card_data
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: errmsg || '网络错误，稍后再试',
                    showCancel: false
                })
            }
        }).catch(err => {
            this.setData({
                isloading: false
            })
        })
    },
    //跳转活动二
    goactive2() {
        console.log(this.data.active2_is_join)
        if (this.data.active2_is_join) {
            let channel = this.data.activity_info.channel
            let delivery_id = this.data.activity_info.delivery_id
            let token = this.data.token
            let redirect_page = this.data.activity_info.redirect_page
            wx.navigateTo({
                url: redirect_page
            })
        } else if (this.data.activity_info.coupon_address_two) {
            let activity_num = this.data.activity_num
            let ruleimg = this.data.activity_info.activity_rule_two
            let package_pic = this.data.activity_info.package_pic
            let url = this.data.activity_info.redirect_address_two.charAt(0) == '/' ? `${this.data.activity_info.redirect_address_two}?activity_num=${activity_num}&ruleimg=${ruleimg}&pic=${package_pic}` : `/${this.data.activity_info.redirect_address_two}?activity_num=${activity_num}&ruleimg=${ruleimg}&pic=${package_pic}`
            wx.navigateTo({
                url
            })
        }
    },
    //领取卡券
    goactive1_addcard() {
        let _this = this
        main.throttle(() => {
            if (this.data.is_join) { //参与活动但未领卡
                wx.addCard({
                    cardList: _this.data.card_data.cardList,
                    success(res) {
                        _this.updateCoupon()
                    }
                })
            } else { //未参与活动，需要跳到whitepage领券
                if (_this.data.activity_info.coupon_address_one) {
                    let url = _this.data.activity_info.coupon_address_one.charAt(0) == '/' ? `/${_this.data.activity_info.coupon_address_one}&need_open_card=1` : `/${_this.data.activity_info.coupon_address_one}&need_open_card=1`
                    wx.navigateTo({
                        url
                    })
                }
            }
        }, 1000)()
    },
    //查看卡券
    goactive1_opnecard() {
        let _this = this
        main.throttle(() => {
            wx.openCard({
                cardList: _this.data.card_data
            })
        }, 1000)()
    },
    //更新卡券接口
    updateCoupon() {
        fetch({ url: API.updateCoupon, data: { channel: this.data.channel }, loading: true }).then(res => {
            let { data, errcode, errmsg } = res
            if (errcode == 0) {
                this.init()
            } else {
                wx.showModal({
                    title: '提示',
                    content: errmsg || '网络错误，稍后再试',
                    showCancel: false
                })
            }
        })
    },
    showrulefun(e) {
        let ruleimg = e.currentTarget.dataset.ruletype == 1 ? this.data.activity_info.activity_rule : this.data.activity_info.activity_rule_two
        this.setData({
            showrule: true,
            ruleimg
        })
    },
    closerule() {
        this.setData({
            showrule: false
        })
    },
})