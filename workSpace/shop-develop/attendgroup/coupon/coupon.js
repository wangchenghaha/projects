import main from '../utils/utils'
import API from '../api/index'
import fetch from '../sever/index'
import img from '../model/img-model'

const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
var mCard = require('../api/member_card.js');

Page({
    data: {
        brand,
        bigPhone: main.judgeBigScreen(),

        isloading: false,
        showalert: false,
        token: '',
        showoption: {
            type: 1,
            show: false,
            alerttext: '',
            btntext: ''
        },
        couponlist: img.couponlist,
        basecolor: img.basecolor,
        showbtn: false,
        imgUrl: API.CrmImgUrl,
        send_coupon_params: [],
        sign: '',
        send_coupon_merchant: '',
        record_id: '',
        lq: '',
        couponIds: '',
        couponNames: '',
        user_utm_channel: '',
        campainId: '',
        chiefId: '',
        btnTextList:'',
        errMsg: ''
    },
    onShow: function () {
        this.getUtmInfo();
        this.is_get_coupon();
        this.activeInfo();
        var _this = this;
        let imgList = wx.getStorageSync("imgList");
        if (imgList) {
            _this.setData({
                imgList: imgList
            });
        } else {
            main.getPictureList(API.getPictureList, '').then(res => {
                _this.setData({
                    imgList: res.data.data
                });
            });
        }
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '拼团详情'
        })
    },
    onLoad(options) {
        console.log("options=============", options)
        var ac = wx.getStorageSync("campainId");
        var ch = wx.getStorageSync("user_utm_channel");
        var chf = wx.getStorageSync("Join_chiefId");

        if (options.camp) {
            ac = main.getQueryVariable2(options.camp, 'ac');
            ch = main.getQueryVariable2(options.camp, 'ch');
            chf = main.getQueryVariable2(options.camp, 'chf');
        }
        if (!options.ch && !ch) {
            wx.showToast({
                title: '缺少渠道ID',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (!options.chf && !chf) {
            wx.showToast({
                title: '缺少团ID',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (!options.ac && !ac) {
            wx.showToast({
                title: '缺少活动ID',
                icon: 'none',
                duration: 2000
            });
            return
        }

        this.setData({
            campainId: options.ac || ac,
            user_utm_channel: options.ch || ch,
            chiefId: options.chf || chf,
            isloading: true
        });
        console.log("options===coupon==========", options)
        console.log("====coupon====ac================" + this.data.campainId);
        console.log("=====coupon===ch================" + this.data.user_utm_channel);
        console.log("=====coupon===chf================" + this.data.chiefId);

        wx.setStorageSync("campainId", this.data.campainId);
        wx.setStorageSync("user_utm_channel", this.data.user_utm_channel);
        wx.setStorageSync("Join_chiefId", this.data.chiefId);

        //获取按钮文字
        main.getButtonText().then(res => {
            this.setData({
                btnTextList: res
            });
        });
    },
    //判断是否领取过优惠券
    is_get_coupon() {
        let data = {
            campainId: this.data.campainId,
            chiefId: this.data.chiefId,
        }
        console.log('is_get_coupon====', data)
        let _this = this;
        fetch({url: API.couponinfo, data: data, method: 'POST'}).then(res => {
            let {code, msg, data: {recordId}} = res
            if (code == 200) {
                console.log('+++++++++++++666++++++' + recordId)
                //领过券了
                if (recordId) {
                    wx.redirectTo({
                        url: `/attendgroup/result/result?recordId=${recordId}`
                    });
                    return false
                }
                console.log("res.data.couponList===", res.data.couponList)
                var couponCodes = [];
                res.data.couponList.forEach(item => {
                    couponCodes.push(item.couponCode);
                });

                couponCodes = couponCodes.join(',');
                console.log("=============couponCodes=", couponCodes)
                _this.setData({
                    couponIds: couponCodes,
                    showbtn: true,
                    lq: 0
                });
            }

            _this.sendCoupons()
            // }
        }).catch(err => {
        })
    },
    // _getcoupon() {
    //     let _this = this
    //     main.throttle(function () {
    //         _this.sendCoupons()
    //     }, 5000)()
    // },
    //获取商家券
    sendCoupons() {
        let _this = this;
        //获取UTM参数
        let utm_info = wx.getStorageSync("utm_info");

        let user_utm_channel = _this.data.user_utm_channel;
        console.log("ch==",user_utm_channel);
        console.log("utm_info ALL==",utm_info);
        //如果有渠道则获取对应的UTM参数
        var user_utm;
        if(user_utm_channel){
            utm_info.forEach((item, index) => {
                console.log("item=========",item.id)
                if (user_utm_channel == item.id) {
                    user_utm = item;
                }
            });
        }else{
            var channal_name = '自然渠道';
            utm_info.forEach((item, index) => {
                if (item.channelName == channal_name) {
                    user_utm = item;
                }
            });
        }
        console.log("user_utm=====",user_utm)
        let data1 = {
            couponIds: this.data.couponIds,
            channelTag: 'WeChat_ETO',
            channelToken: 'NWU4ZTLKZTAZODY4MW',
            subChannel: user_utm ? user_utm.channelName :'',
            campaign: user_utm ? user_utm.couponUtmCampaign :'',
            medium: user_utm ? user_utm.couponUtmMedium : '',
            source: user_utm ? user_utm.couponUtmSource : '',
            term: user_utm ? user_utm.couponUtmTerm : '',
            guideId: '',
            storeId: '',
            wemember: '',
        };
        console.log("send coupon req===========",data1);
        fetch({url: API.sendCoupon, data: data1, needUnionid: true, method: "POST"}).then(res => {
            console.log('couponres------>', res)
            wx.hideLoading();
            let {errcode, errmsg} = res
            if (errcode === 0) {
                console.log('couponres----is_member-->', res.data.is_member)
                console.log('couponres----is_get_card-->', res.data.is_get_card)
                // 是会员
                if (res.data.is_member === 1) {
                    console.log('res.data.cardList==============', res.data.cardList)
                    //如果是商家券
                    if (res.data.cardList.send_coupon_merchant) {
                        //获取卡券名称
                        var couponNames = [];
                        res.data.coupon_list.forEach(item => {
                            couponNames.push(item.title);
                        });

                        couponNames = couponNames.join(',');

                        _this.setData({
                            send_coupon_params: res.data.cardList.send_coupon_params,
                            sign: res.data.cardList.sign,
                            send_coupon_merchant: res.data.cardList.send_coupon_merchant,
                            record_id: res.data.record_id,
                            couponNames: couponNames
                        });
                        console.log('send_coupon_params===', this.data.send_coupon_params)
                        console.log('sign===', this.data.sign)
                        console.log('send_coupon_merchant===', this.data.send_coupon_merchant)
                        console.log('record_id===', this.data.record_id)
                        console.log('couponNames===', this.data.couponNames)
                    }
                } else {
                    _this.isMember().then(res => {
                        console.log("检测到非会员，进行注册",res);
                    });
                }
            } else {
                wx.showModal({
                    title: '提示',
                    content: res.errmsg || '网络异常,请再来一次呗！',
                    showCancel: false
                });
                _this.setData({
                    errMsg: res.errmsg
                });
            }
        });
    },
    //注册会员
    isMember() {
        return new Promise((resolve, reject) => {
            mCard.isMember(function (isMember) {
                resolve(isMember);
            }, 0);
        });
    },
    /**
     *  跳转微信原生开卡
     * @param {*} data  微信需要的参数
     */
    // memberRegistration(data) {
    //     wx.setStorage({
    //         key: 'isLogin',
    //         data: true,
    //         success: function (res) {
    //             wx.navigateToMiniProgram({
    //                 appId: 'wxeb490c6f9b154ef9', // 固定为此 appid，不可改动
    //                 extraData: data, // 包括 encrypt_card_id, outer_str, biz三个字段，须从 step3 中获得的链接中获取参数
    //                 success: function (res) {
    //                     wx.setStorageSync('isStart', 5);
    //                     wx.setStorageSync('activecoupon2', true);
    //                 },
    //                 fail: function (res) {
    //                     console.log(res, "navigateToMiniProgram-fail");
    //                     wx.hideLoading();
    //                 }
    //             })
    //         },
    //         fail: function () {
    //             // fail
    //         }
    //     }) //设置参数
    // },
    /**
     * 领券并跳转
     */
    // addCardJump(res) {
    //     console.log("====领券并跳转======", res.data.cardList)
    //     let _this = this
    //     wx.addCard({
    //         cardList: res.data.cardList,
    //         success: function (back) {
    //             _this.updateCouponStatus()
    //         },
    //         fail: function () {
    //             // wx.navigateBack({delta: 1})
    //         }
    //     })
    // },
    endfun() {
        this.setData({
            showoption: {
                type: 1,
                show: true,
                alerttext: '您来晚了，活动已结束！',
                btntext: this.data.btnTextList.type_5,//'活动已结束
                success() {
                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                }
            }
        })
    },
    //更新领卡状态
    updateCouponStatus(record_id) {
        let _this = this;
        let userInfo = wx.getStorageSync('userInfo');
        let nickName = userInfo.avatarUrl || 'name';
        let data = {
            recordId: record_id,
            campainId: this.data.campainId,
            chiefId: this.data.chiefId,
            couponName: this.data.couponNames,
            nickName: nickName
        };
        console.log("============================log",data)
        fetch({url: API.updateStatus, data: data, needUnionid: true, method: 'POST'}).then(res => {
            if (res.code === 200) {
                console.log("====领券并跳转======", res)
                wx.hideLoading();
                //打开卡券
                _this.openCard();
            }
        })
    },
    onShareAppMessage() {
        var _this = this;
        return main.baseshare('', API.CrmImgUrl + _this.data.imgList.share);
    },
    //领取商家券的回调事件
    getCouponMerchant: function (params) {
        // 插件返回信息在params.detail
        let _this = this
        console.log('getCouponMerchant===', params)
        console.log('detail===', params.detail);
        wx.showLoading({
            title: ' ',
            icon: 'loading',
            mask: true
        });
        if(params.detail.errcode === 'OK'){
            main.throttle(function () {
                _this.updateCouponStatus(_this.data.record_id);
                _this.setData({
                    lq: 1
                });
            }, 5000)()
        }else{
            // this.data.campainId
            wx.showModal({
                title: '提示',
                content: _this.data.errMsg || '网络异常,请再来一次呗！',
                showCancel: false
            });
            wx.hideLoading();
        }
    },
    openCard() {

        let data = {
            record_id: this.data.record_id
        };
        fetch({url: API.getCoupons, data: data, needUnionid: true, method: 'GET'}).then(res => {
            if (res.errcode == 0) {
                if (res.data.is_get_coupon) {
                    //打开卡券
                    console.log('result=============', res.data.cardList.cardList);
                    console.log(res.data.cardList.cardList);
                    wx.openCard({
                        cardList: res.data.cardList.cardList,
                        success: function () {
                            console.log('成功进入opencard');
                        },
                        fail: function (res) {
                            wx.showToast({
                                title: res,
                                icon: 'none'
                            })
                        }
                    })
                }
            }
        })
    },
    //订阅消息授权
    // openSubscribeMessage() {
    //     let _this = this
    //     let couponTempIds = wx.getStorageSync("couponTempIds");
    //         console.log('=====123')
    //         var joinTmplIds = [];
    //         // _this.openSubscribeMessage(couponTempIds, joinTmplIds).then(res => {
    //         //     console.log("===coupon=====joinTmplIds",res)
    //         // });
    //         wx.requestSubscribeMessage({
    //             tmplIds: couponTempIds,
    //             success(res) {
    //                 if (res.errMsg == 'requestSubscribeMessage:ok') {
    //                     console.log("====================joinTmplIds", joinTmplIds)
    //                     for (let key in res) {
    //                         if (key != 'errMsg') {
    //                             if (res[key] == 'accept') { //允许
    //                                 joinTmplIds.push(key);
    //                             }
    //                         }
    //                     }
    //                     // resolve(joinTmplIds);
    //                 }
    //                 console.log("=========succ===========joinTmplIds", joinTmplIds)
    //                 _this.setData({
    //                     lq: 1
    //                 })
    //             },
    //             fail(err) {
    //             },
    //             complete(res) {
    //             }
    //         });
    // },
    //获取活动配置
    activeInfo() {
        var _this = this;
        var ac = wx.getStorageSync("campainId");

        let activeInfo = wx.getStorageSync("activeInfo");
        if (!activeInfo) {
            let data = {
                id: ac,
            };
            fetch({url: API.activeInfo, data, method: 'POST'}).then(res => {
                let {data, code, msg} = res;
                if (res.code == 200) {
                    //将活动信息存储缓存
                    wx.setStorageSync("activeInfo", res.data);
                    _this.setData({
                        basecolor: res.data.buttonColour
                    });
                    //存储拼团订阅模板ID
                    // var sendTempIds = [];
                    // var hotTempIds = [];
                    // var couponTempIds = [];
                    // res.data.noticeTemplate.forEach(item => {
                    //     if (item.type === 4) {
                    //         couponTempIds.push(item.templateId);
                    //     }else if (item.type === 5) {
                    //         hotTempIds.push(item.templateId);
                    //     } else {
                    //         sendTempIds.push(item.templateId);
                    //     }
                    // });
                    // wx.setStorageSync("sendTempIds", sendTempIds);
                    // wx.setStorageSync("hotTempIds", hotTempIds);
                    // wx.setStorageSync("couponTempIds", couponTempIds);
                    let start = new Date(main.strToDate(res.data.startDate)).getTime();
                    let end = new Date(main.strToDate(res.data.endDate)).getTime();
                    let current = new Date().getTime();

                    判断当前是否是开团时间是否在开团范围内
                    // var is_tuan = 0;
                    if (current < start) {
                        _this.startfun();
                    } else if (current > end) {
                        _this.endfun();
                    } else if (current > start && current < end) {
                        // is_tuan = 1;
                    }
                }
            });
        }else{
            _this.setData({
                basecolor: activeInfo.buttonColour
            });
        }

    },
    //获取UTM参数配置
    getUtmInfo() {
        let data = {
            "campainId": this.data.campainId
        };
        main.getProise(API.getUtmInfo, data,).then(res => {
            console.log("获取最新UTM参数：",res.data.data);
            wx.setStorageSync("utm_info", res.data.data);
        });
    },
});