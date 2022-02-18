import main from '../utils/utils'
import API from '../api/index'
import fetch from '../sever/index'
import img from '../model/img-model'
const config = require('../../src/config.js')
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;


Page({
    data: {
        brand,
        bigPhone: main.judgeBigScreen(),
        isloading: false,
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
        couponlist: img.couponlist,
        basecolor: img.basecolor,
        imgmodel: {
            bg_s: img.bg_s,
            bg: img.bg,
            brandimg: img.brandimg,
            coupon: img.coupon,
            indexcard: img.indexcard,
            brandheight: img.brandheight,
            brandwidth: img.brandwidth,
        }

    },
    onShow: function() {
        this.activeTime()
    },
    onReady: function() {
        wx.setNavigationBarTitle({
            title: config.title
        })
    },
    onLoad(options) {
        if (options.token) {
            this.setData({
                token: options.token
            })
        } else {
            if (options.scene) {
                let scene = decodeURIComponent(options.scene);
                let token = main.getQueryVariable(scene, 'token')
                this.setData({
                    token
                })
            }
        }
    },
    //活动时间
    activeTime() {
        fetch({ url: API.index, data: { token: this.data.token } }).then(res => {
            let { data, errcode } = res
            this.setData({
                start_time: data.time && data.time.start_time,
                end_time: data.time && data.time.end_time,
                isloading: true
            })
            if (errcode == 0) {
                let token = data.token || this.data.token
                this.setData({
                    is_tuan: data.is_tuan
                })
                if (data.is_fail) {
                    wx.redirectTo({
                        url: `/fightgroup/fail/fail?token=${token}`
                    })
                    return
                } else if (data.is_join) { //参与过
                    if (data.is_end) { //团满了
                        if (data.is_get_coupon) { //领过
                            wx.redirectTo({
                                url: `/fightgroup/result/result?token=${token}`
                            })
                            return
                        } else {
                            wx.redirectTo({
                                url: `/fightgroup/coupon/coupon?token=${token}`
                            })
                            return
                        }
                    } else {
                        wx.redirectTo({
                            url: `/fightgroup/group/group?token=${token}`
                        })
                        return
                    }
                }
                if (data.is_tuan && data.has_tuan) {
                    wx.redirectTo({
                        url: `/fightgroup/group/group?token=${token}`
                    })
                    return
                }
            } else if (errcode == 201) {
                this.endfun()
            } else if (errcode == 202) {
                this.startfun()
            }
        })
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
    activegroup() {
        let _this = this
        wx.requestSubscribeMessage({
            tmplIds: ['5kk7ZMmPcGJuH1Los9aK2ieHS8BtxI6A8YspiVSBWDU', 'VCfKSpXiIuNDruG9IhlqNBpokRAXxbsc9mwy0GtdMRo', 'GWnGF1SwiIkkoAXEwUmK3M9F9HH91D8ZQ0vag6aVvdM'],
            success(res) {},
            fail(err) {},
            complete(res) {
                console.log('===========tmplIds', res)
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
                    }
                }
                if (_this.data.is_tuan) {
                    main.debounce(_this.openGroup(), 500)
                } else {
                    main.debounce(_this.joinGroup(), 500)
                }
            }
        })
    },
    //开启拼团
    openGroup() {
        let userInfo = wx.getStorageSync('userInfo')
        let avatarUrl = userInfo.avatarUrl || 'https://tc.woaap.com/lingzhi/fightgroup/user.png'
        let data = {
            avatar_url: avatarUrl,
            token: this.data.token
        }
        fetch({ url: API.open, data, method: 'POST' }).then(res => {
            let { data, errcode, errmsg } = res
            if (errcode == 0) {
                if (data.is_open) { //是否开过团
                    this.setData({
                        showoption: {
                            type: 1,
                            show: true,
                            alerttext: '每个用户仅可开团一次，但仍可\n不限次数邀请好友参团或开团，快\n邀请好友一起参加吧',
                            btntext: '我知道了',
                            success() {
                                wx.navigateTo({
                                    url: `/fightgroup/group/group?token=${data.token}`
                                })
                            }
                        }
                    })
                } else {
                    wx.navigateTo({
                        url: `/fightgroup/group/group?token=${data.token}`
                    })
                }
            } else if (errcode == 201) {
                this.endfun()
            } else if (errcode == 202) {
                this.startfun()
            }
        })
    },
    //参与拼团
    joinGroup() {
        let _this = this
        let userInfo = wx.getStorageSync('userInfo')
        let avatarUrl = userInfo.avatarUrl || 'https://tc.woaap.com/lingzhi/fightgroup/user.png'
        let data = {
            avatar_url: avatarUrl,
            token: this.data.token
        }
        fetch({ url: API.join, data, method: 'POST' }).then(res => {
            let { data, errcode, errmsg } = res
            if (errcode == 0) {
                if (data.is_end) { //是否是最后一个人
                    this.setData({
                        showoption: {
                            type: 2,
                            show: true,
                            success() {
                                wx.navigateTo({
                                    url: `/fightgroup/coupon/coupon?token=${_this.data.token}`
                                })
                            }
                        }
                    })
                } else {
                    wx.navigateTo({
                        url: `/fightgroup/group/group?token=${data.token}`
                    })
                }
            } else if (errcode == 302) { //人员已满
                this.setData({
                    showoption: {
                        type: 1,
                        show: true,
                        alerttext: '很遗憾，拼团名额已满！',
                        btntext: '自己开团',
                        success() {
                            wx.redirectTo({
                                url: '/fightgroup/index/index'
                            })
                        }
                    }
                })
            } else if (errcode == 201) {
                this.endfun()
            } else if (errcode == 202) {
                this.startfun()
            }
        })
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
    //上传formid
    formId(tmplIds) {
        console.log('tmplIds----------------------------->', tmplIds)
        fetch({ url: API.formId, data: { list: tmplIds } }).then(res => {

        })
    },
    endfun() {
        this.setData({
            showoption: {
                type: 1,
                show: true,
                alerttext: '您来晚了，活动已结束！',
                btntext: '我知道了',
                success() {
                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                }
            }
        })
    },
    startfun() {
        this.setData({
            showoption: {
                type: 1,
                show: true,
                alerttext: '您来早了，活动未开始！',
                btntext: '我知道了',
                success() {
                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                }
            }
        })
    },
    onShareAppMessage() {
        return main.baseshare()
    }
})