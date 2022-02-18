import main from '../utils/utils'
import API from '../api/index'
import fetch from '../sever/index'

const config = require('../../src/config.js')
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
var mCard = require('../api/member_card.js');

Page({
    data: {
        brand,
        bigPhone: main.judgeBigScreen(),
        isloading: true,
        start_time: '',
        end_time: '',
        showrule: false,
        token: '',
        showoption: {
            type: 2,
            show: false,
            alerttext: '',
            btntext: ''
        },
        is_tuan: '',
        couponCode: '',
        brandId:'',
        campainExplain:''
    },
    onShow: function () {
        this.getUtmInfo();
        this.activeInfo();
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: config.title
        })
    },
    onLoad(options) {
        if (options.brand) {
            this.setData({
                // brandId: options.brand
            })
        }
    },
    couponCodeInput: function (e) {
        this.setData({
            couponCode: e.detail.value
        })
    },
    //获取活动配置
    activeInfo() {
        var _this = this;
        let data = {
            id: 101,
        };
        fetch({url: API.activeInfo, data, method: 'POST'}).then(res => {
            let {data, code, msg} = res;
            if (res.code == 200) {

                //将活动信息存储缓存
                wx.setStorageSync("campainExplain", res.data.campainExplain);

                this.setData({
                    campainExplain: res.data.campainExplain,
                });
            }
        });
    },
    //获取UTM参数配置
    getUtmInfo() {
        let utm_info = wx.getStorageSync("utm_info");
        let data = {
            "campainId": 101
        };
        main.getProise(API.getUtmInfo, data,).then(res => {
            wx.setStorageSync("utm_info", res.data.data);
        });
    },
    //判断是否是会员，如果不是会员则进行开卡注册
    isCheckMember() {
        var _this = this
        return new Promise((resolve, reject) => {
            let bool = false;
            //判断如果非会员则进行注册，才可以预约活动。否则不可预约活动
            var isMember = wx.getStorageSync("isMember");
            console.log("=================isMember", isMember)
            var falg = isMember === 1 ? true : false;
            if (!falg) {
                //会员注册、授权
                console.log("=================isMember2", isMember)
                console.log("=================falg", falg)
                _this.isMember().then(res => {
                    bool = true;
                    resolve(bool);
                });
            } else {
                bool = true;
                resolve(bool);
            }
        });
    },
    isMember() {
        return new Promise((resolve, reject) => {
            mCard.isMember(function (isMember) {
                resolve(isMember);
            }, 0);
        });
    },

    //绑定
    bindingCoupon() {
        var _this = this
        if (!this.data.couponCode) {
            wx.showModal({
                title: '提示',
                content: "请输入券码！",
                showCancel: false,
                confirmText: "我知道了",
                success: function (_res) {
                }
            });
            return;
        }

        main.throttle(function () {

            _this.getCouponUtm(_this.data.couponCode).then(res => {

                _this.isCheckMember().then(res => {

                    console.log("is member:", res);

                    let data = {
                        couponCode : _this.data.couponCode,
                        brand:_this.data.brandId
                    };

                    fetch({url: API.bindingCoupon, data, method: 'POST'}).then(res => {
                            let {data, code, msg} = res;
                            console.log(res);
                            if (res.code == 200) {
                                wx.showModal({
                                    title: '提示',
                                    content: "绑定成功！预计10分钟到账！",
                                    showCancel: false,
                                    confirmText: "我知道了",
                                    success: function (_res) {
                                    }
                                });
                            } else if (res.code == 1017) {//未注册
                                wx.showModal({
                                    title: '绑定失败',
                                    content: "您还未注册会员，请先注册！",
                                    showCancel: false,
                                    confirmText: "我知道了",
                                    success: function (_res) {
                                        wx.setStorageSync('isMember',0);
                                        wx.setStorageSync('isGetCard',0);
                                        mCard.isMember(function (isMember) {

                                        }, 0);
                                    }
                                });
                            }else{
                                wx.showModal({
                                    title: '绑定失败',
                                    content: msg,
                                    showCancel: false,
                                    confirmText: "我知道了",
                                    success: function (_res) {
                                    }
                                });
                            }
                        }
                    );
                });

            });

        }, 5000)()
    },

    registerFormSubmit(e) {
        if (e.detail.formId && this.data.isloading) {
            main.debounce(this.formId(e.detail.formId), 500)
        }
        if (this.data.is_tuan) {
            main.debounce(this.openGroup(), 500)
        } else {
            main.debounce(this.joinGroup(), 500)
        }
    },
    clicksure(obj) {
        obj.detail.success && obj.detail.success();
    },
    showrulefun() {
        this.setData({
            showrule: true
        })
    },
    closerule() {
        this.setData({
            showrule: false
        })
    },
    onShareAppMessage() {
        return main.baseshare()
    },
    //根据券码获取对应的UTM参数
    getCouponUtm(couponCode){

        let data = {
            voucherno: couponCode,
        };

        return new Promise((resolve, reject) => {

            fetch({url: API.couponUtm, data, method: 'POST'}).then(res => {
                let {data, code, msg} = res;
                console.log("======code=UTM",res)
                if (res.code == 200) {
                    //将活动信息存储缓存
                    console.log("======code=UTM",res.data)
                    wx.setStorageSync("voucherno_utm", res.data);
                }else{
                    wx.setStorageSync("voucherno_utm","");
                }

                resolve(true);
            });

        });

    }
})