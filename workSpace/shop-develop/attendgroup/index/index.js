import main from '../utils/utils';
import API from '../api/index';
import fetch from '../sever/index';
import img from '../model/img-model';

var url = require("../../base/url.js");
const config = require('../../src/config.js');
var mCard = require('../api/member_card.js');

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
        pictureIdList: img.indexList,
        imgUrl: API.CrmImgUrl,
        imgmodel: {
            brandheight: img.brandheight,
            brandwidth: img.brandwidth,
        },
        chiefId: '',
        campainId: '',
        user_utm_channel: '',
        campainExplain: '',
        btnTextList:''
    },

    onShow: function () {
        var _this = this;

        //获取该页面所需要的图片，进行图片渲染
        let imgList = wx.getStorageSync("imgList");
        main.getPictureList(API.getPictureList, '').then(res => {
            _this.setData({
                imgList: res.data.data
            });
        });

        this.getUtmInfo();
        this.activeInfo();
        //获取按钮文字
        main.getButtonText().then(res => {
            this.setData({
                btnTextList: res
            });
        });

        //保存pv数据
        this.savepv();
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: config.title
        })
    },
    onLoad(options) {
        console.log("options=======index======", options)
        var ac = wx.getStorageSync("campainId");
        var ch = wx.getStorageSync("user_utm_channel");
        // var chf = wx.getStorageSync("Join_chiefId");
        var chf;
        console.log("1111111111111111111")
        if (options.scene) {
            console.log("2222222222")
            let scene = decodeURIComponent(options.scene);
            console.log("===========scene=============" + scene);
            ac = main.getQueryVariable(scene, 'ac');//活动ID
            ch = main.getQueryVariable(scene, 'ch');//渠道ID
            chf = main.getQueryVariable(scene, 'chf');//渠道ID
        }
        console.log("666666666666666")
        if (options.camp) {
            console.log("44444444")
            ac = main.getQueryVariable2(options.camp, 'ac');
            ch = main.getQueryVariable2(options.camp, 'ch');
            chf = main.getQueryVariable2(options.camp, 'chf');
        }
        console.log("55555555555")

        this.setData({
            campainId: options.ac || ac,
            user_utm_channel: options.ch || ch,
            chiefId: options.chf || chf
        });

        console.log("====index====ac================" + this.data.campainId);
        console.log("=====index===ch================" + this.data.user_utm_channel);
        console.log("=====index===chf================" + this.data.chiefId);
        wx.setStorageSync("campainId", this.data.campainId);
        wx.setStorageSync("user_utm_channel", this.data.user_utm_channel);
        wx.setStorageSync("Join_chiefId", this.data.chiefId);
    },
    getUserInfoProfile(){
        let _this = this;
        let user_info_cf = wx.getStorageSync('user_info_cf');
        let user_info_cf_flag = wx.getStorageSync('user_info_cf_flag');
        console.log("user_info_cf========",user_info_cf);
        if(user_info_cf || user_info_cf_flag) {
            _this.activegroup();
        }else{
            main.getUserProfile().then(res =>{
                console.log("user_info_cf",res);
            });

        }
    },
    //参加活动
    activegroup() {

        let _this = this;
        let joinTmplIds = [];
        let sendTempIds = wx.getStorageSync("sendTempIds");
        console.log("=====sendTempIds", sendTempIds);

        _this.isCheckMember().then(res => {
            //如果是参与者则需要进行根据活动配置进行判断是否有资格参团
            console.log("===========is_tuan=", _this.data.is_tuan);
            if (_this.data.is_tuan === 0) {
                _this.isCheckNewMembers().then(res => {
                    console.log("===isCheckNewMembers=", res);
                    if (res) {
                        _this.openSubscribeMessage(sendTempIds, joinTmplIds).then(joinTmplIds => {
                            console.log("=====sendTempIds2", res);
                            if (_this.data.is_tuan) {
                                main.debounce(_this.openGroup(joinTmplIds), 500)
                            } else {
                                main.debounce(_this.joinGroup(joinTmplIds), 500)
                            }
                        });
                    }
                });
            } else {
                _this.openSubscribeMessage(sendTempIds, joinTmplIds).then(joinTmplIds => {
                    console.log("=====sendTempIds3", joinTmplIds);
                    if (_this.data.is_tuan) {
                        main.debounce(_this.openGroup(joinTmplIds), 500)
                    } else {
                        main.debounce(_this.joinGroup(joinTmplIds), 500)
                    }
                });
            }
        });
    },
    //订阅消息授权
    openSubscribeMessage(tempIds, joinTmplIds) {
        return new Promise((resolve, reject) => {
            wx.requestSubscribeMessage({
                tmplIds: tempIds,
                success(res) {
                    if (res.errMsg == 'requestSubscribeMessage:ok') {
                        console.log("====================joinTmplIds", joinTmplIds)
                        for (let key in res) {
                            if (key != 'errMsg') {
                                if (res[key] == 'accept') { //允许
                                    joinTmplIds.push(key);
                                }
                            }
                        }
                        resolve(joinTmplIds);
                    }
                },
                fail(err) {
                },
                complete(res) {
                }
            });
        });
    },
    //开启拼团
    openGroup(tmplIds) {
        // wx.navigateTo({
        //     url: `/attendgroup/fail/fail`
        // })
        // return ;

        let userInfo = wx.getStorageSync('user_info_cf');
        console.log("开始拼团",userInfo);
        let avatarUrl = userInfo.avatarUrl || 'https://tc.woaap.com/lingzhi/fightgroup/user.png';
        let campainId = this.data.campainId;
        let data = {
            campainId: campainId,
            avatarUrl: avatarUrl,
            noticeTemplate: tmplIds,
            channelId: this.data.user_utm_channel
        };
        fetch({url: API.startFight, data, method: 'POST'}).then(res => {
            let {data, errcode, errmsg} = res
            console.log(data);
            if (res.code == 200) {
                // if (data.is_open) { //是否开过团
                this.setData({
                    showoption: {
                        type: 1,
                        show: true,
                        alerttext: '开团成功，快邀请好友一起参加吧',
                        btntext: this.data.btnTextList.type_14,//'我知道了'
                        success() {
                            wx.navigateTo({
                                url: `/attendgroup/group/group?chf=${data.id}`
                            })
                        }
                    }
                });
            } else if (errcode == 201) {
                this.endfun();
                return;
            } else if (errcode == 202) {
                this.startfun()
                return;
            }
        })
    },
    //参与拼团
    joinGroup(tmplIds) {
        let _this = this;
        var chiefId = wx.getStorageSync("Join_chiefId");

        let userInfo = wx.getStorageSync('user_info_cf');
        console.log("userInfo.avatarUrl=======",userInfo);
        let avatarUrl = userInfo.avatarUrl || 'https://tc.woaap.com/lingzhi/fightgroup/user.png';
        let campainId = this.data.campainId;
        console.log(tmplIds);
        let data = {
            avatarUrl: avatarUrl,
            campainId: campainId,
            chiefId: chiefId,
            noticeTemplate: tmplIds,
            channelId: this.data.user_utm_channel
        };
        fetch({url: API.jointuan, data, method: 'POST'}).then(res => {
            let {data} = res;
            console.log(res);
            //（拼团成功）该团已经满员，且为最后一人
            if (res.code == 5013 || res.code == 5010) {
                wx.redirectTo({
                    url: `/attendgroup/coupon/coupon?chf=${chiefId}`
                });
            }
            if (res.code == 5012 || res.code == 5014) {
                wx.navigateTo({
                    url: `/attendgroup/group/group?chf=${chiefId}`
                });
            }
            if (res.code == 5011) {
                this.setData({
                    showoption: {
                        type: 1,
                        show: true,
                        alerttext: '该团已经满员',
                        btntext: this.data.btnTextList.type_9,//'开启我的战队
                        success() {
                            wx.redirectTo({
                                url: '/attendgroup/index/index'
                            })
                        }
                    }
                });
            }
            if (res.code == 5001 || res.code == 5007 || res.code == 5008) {
                this.setData({
                    showoption: {
                        type: 1,
                        show: true,
                        alerttext: res.msg,
                        btntext: this.data.btnTextList.type_9,//'开启我的战队
                        success() {
                            wx.redirectTo({
                                url: '/attendgroup/index/index'
                            })
                        }
                    }
                })
            } else {
                this.errCodeMessage(res.code, res.msg);
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
    //活动未开始预约活动，订阅活动通知消息
    startfun() {
        let _this = this;
        // _this.isCheckMember();
        var activeInfo = wx.getStorageSync("activeInfo");
        //是否开启预约活动
        var isPreheat = activeInfo.isPreheat;
        var msg = this.data.btnTextList.type_14;//'我知道了'

        if (isPreheat == 1) {
            msg = this.data.btnTextList.type_7;//订阅活动
        }
        var hotTempIds = wx.getStorageSync("hotTempIds");
        this.setData({
            showoption: {
                type: 1,
                show: true,
                alerttext: '活动未开始，可打开订阅提醒～',
                btntext: msg,
                success() {
                    //如果开启预热则发送预热消息，提醒活动开启
                    if (isPreheat == 1) {
                        var joinTmplIds = [];
                        _this.openSubscribeMessage(hotTempIds, joinTmplIds).then(res => {
                            console.log("=====sendTempIds", res);
                            var data = {
                                "campainId": _this.data.campainId,
                                "noticeTemplate": joinTmplIds,
                                channelId:_this.data.user_utm_channel
                            };
                            fetch({url: API.hot, data, method: 'POST'}).then(res => {
                                let {data, code, msg} = res;
                                if(code === 200){
                                    wx.showToast({
                                        title: '订阅成功',
                                        duration: 1000,
                                        success: function () {
                                            setTimeout(function () {
                                                //预约成功后跳转到首页
                                                wx.switchTab({
                                                    url: '/pages/index/index'
                                                })
                                            }, 1000);
                                        }
                                    });
                                }else{

                                    wx.showToast({
                                        title: msg,
                                        duration: 1000,
                                        success: function () {
                                            setTimeout(function () {
                                                //预约成功后跳转到首页
                                                wx.navigateTo({
                                                    url: `/attendgroup/index/index`
                                                })
                                            }, 1000);
                                        }
                                    });
                                    return;
                                }
                            });
                        });
                    } else {
                        wx.switchTab({
                            url: '/pages/index/index'
                        })
                    }
                }
            }
        });
    },
    onShareAppMessage() {
        var _this = this;
        return main.baseshare('', API.CrmImgUrl + _this.data.imgList.share);
    },

    //获取活动配置
    activeInfo() {
        var _this = this;
        var ac = wx.getStorageSync("campainId");
        let data = {
            id: ac,
        };
        fetch({url: API.activeInfo, data, method: 'POST'}).then(res => {
            let {data, code, msg} = res;
            if (res.code == 200) {

                //将活动信息存储缓存
                wx.setStorageSync("activeInfo", res.data);

                //存储拼团订阅模板ID
                var sendTempIds = [];
                var hotTempIds = [];
                var couponTempIds = [];
                res.data.noticeTemplate.forEach(item => {
                    if (item.type === 4) {
                        couponTempIds.push(item.templateId);
                    } else if (item.type === 5) {
                        hotTempIds.push(item.templateId);
                    } else {
                        sendTempIds.push(item.templateId);
                    }
                });
                wx.setStorageSync("sendTempIds", sendTempIds);
                wx.setStorageSync("hotTempIds", hotTempIds);
                wx.setStorageSync("couponTempIds", couponTempIds);

                let start = new Date(main.strToDate(res.data.startDate)).getTime();
                let end = new Date(main.strToDate(res.data.endDate)).getTime();
                let current = new Date().getTime();

                //判断当前是否是开团时间是否在开团范围内

                let startDate = main.dateUtils(res.data.startDate);
                let endDate = main.dateUtils(res.data.endDate);
                console.log("==============startDate", startDate)
                console.log("==============endDate", endDate)
                this.setData({
                    start_time: startDate,
                    end_time: endDate,
                    isloading: true,
                    is_preheat: res.data.isPreheat,
                    campainExplain: res.data.campainExplain,
                    basecolor: res.data.buttonColour
                });
                var is_tuan = 0;
                if (current < start) {
                    // _this.startfun();
                    this.setData({
                        is_tuan: 2
                    });
                    return;
                } else if (current > end) {
                    _this.endfun();
                    return;
                } else if (current > start && current < end) {
                    is_tuan = 1;
                }
                if (this.data.chiefId) {
                    is_tuan = 0;
                    _this.info();
                } else {

                    _this.isOpenCampain();
                }
                this.setData({
                    is_tuan: is_tuan
                });
            }
        });
    },
    //判断该会员是否开过团，如果开过团则直接跳转到详情页，反之进入首页
    isOpenCampain() {
        let campainId = this.data.campainId;
        let data = {
            campainId: campainId
        };
        fetch({url: API.isOpenCampain, data, method: 'POST'}).then(res => {
            let {data, code, msg} = res;
            console.log(res);
            if (res.code == 3002 || res.code == 5004) {

            } else if (res.code == 5003) {//该团还没有过期
                //跳转到我的团详情页
                wx.navigateTo({
                    url: `/attendgroup/group/group?chf=${res.data.id}`
                });

            } else if (res.code == 5005) {//达到(当天/总共)开启拼团上限
                this.setData({
                    showoption: {
                        type: 1,
                        show: true,
                        alerttext: '达到活动期间内拼团次数上限',
                        btntext: this.data.btnTextList.type_14,//'我知道了'
                        success() {
                            wx.switchTab({
                                url: '/pages/index/index'
                            })
                        }
                    }
                })
            }
        });
    },
    //判断参与者是否是新老会员，参加活动
    isCheckNewMembers() {
        return new Promise((resolve, reject) => {

            var res = true;
            var _this = this;
            var activeInfo = wx.getStorageSync("activeInfo");

            //拼团参与对象，0：全部，1：新领取微信会员卡，2：全新CRM会员
            var campainTarget = activeInfo.campainTarget;
            var isNewMemberCard = wx.getStorageSync('isNewMemberCard');
            var isMemberNewCard = wx.getStorageSync('isMemberNewCard');
            var _ismMember = wx.getStorageSync('isMember');

            console.log("campainTarget=====", campainTarget)
            console.log("isNewMemberCard=====", isNewMemberCard)
            console.log("isMemberNewCard=====", isMemberNewCard)
            console.log("_ismMember=====", _ismMember)
            //全部都可以参加
            if (campainTarget === 0 && _ismMember === 1) {
                //如果是新会员则清除新会员标识
                wx.setStorageSync('isMemberNew', 0);
                wx.setStorageSync('isMemberNewCard', 0);
                resolve(res)
                return;
            } else if (campainTarget === 1 && _ismMember === 1) { //1：新领取微信会员卡，
                if (isMemberNewCard === 1) {
                    //如果是新领取会员卡则清除新领取标识
                    wx.setStorageSync('isMemberNewCard', 0);
                    resolve(res)
                    return;
                }
            } else if (campainTarget === 2 && _ismMember === 1) {//2：全新CRM会员
                if (isNewMemberCard === 1) {
                    wx.setStorageSync('isNewMemberCard', 0);
                    resolve(res)
                    return;
                }
            }

            _this.setData({
                showoption: {
                    type: 1,
                    show: true,
                    alerttext: '您已经是会员，无法助力。\n即刻开启自己的战队！',
                    btntext: this.data.btnTextList.type_9,//'自己开团
                    success() {
                        wx.navigateTo({
                            url: `/attendgroup/index/index`
                        })
                    }
                }
            });
            res = false;
            resolve(res);
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
    //获取UTM参数配置
    getUtmInfo() {
        let utm_info = wx.getStorageSync("utm_info");
        let data = {
            "campainId": this.data.campainId
        };
        main.getProise(API.getUtmInfo, data,).then(res => {
            wx.setStorageSync("utm_info", res.data.data);
        });
    },
    //全局错误提醒
    errCodeMessage(code, msg) {
        if (code == 4001 || code == 4002 || code == 4003) {
            this.setData({
                showoption: {
                    type: 1,
                    show: true,
                    alerttext: msg,
                    btntext: '去首页',
                    success() {
                        wx.switchTab({
                            url: '/pages/index/index'
                        })
                    }
                }
            });
        }
    },
    //该团详情
    info() {
        var _this = this;
        console.log("this.data.chiefId======", this.data.chiefId)
        let unionid = wx.getStorageSync('unionid')
        fetch({url: API.tuanInfo, data: {id: this.data.chiefId}, method: 'POST'}).then(res => {
                let {data, code} = res
                console.log("tuan info========", data)
                if (res.code === 200) {
                    data.membersleagues.forEach(item => {
                        if (item.unionid === unionid) {
                            if (data.isFail === 1) {
                                _this.is_get_coupon();
                                return
                            } else {
                                wx.navigateTo({
                                    url: `/attendgroup/group/group?chf=` + this.data.chiefId
                                });
                                return
                            }
                        }
                    });
                    if (data.isFail === 1) {
                        this.setData({
                            showoption: {
                                type: 1,
                                show: true,
                                alerttext: '该团已经满员',
                                btntext: this.data.btnTextList.type_9,//'开启我的战队
                                success() {
                                    wx.redirectTo({
                                        url: '/attendgroup/index/index'
                                    })
                                }
                            }
                        });
                        return
                    }
                } else if (res.code === 5001) {
                    _this.setData({
                        showoption: {
                            type: 1,
                            show: true,
                            alerttext: '该团不存在！',
                            btntext: this.data.btnTextList.type_9,//'开启我的战队
                            success() {
                                wx.navigateTo({
                                    url: `/attendgroup/index/index`
                                })
                            }
                        }
                    });
                }
            }
        )
    },
    //判断是否领取过优惠券
    is_get_coupon() {
        let data = {
            campainId: this.data.campainId,
            chiefId: this.data.chiefId,
        }
        console.log('index === is_get_coupon====', data)
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
                } else {
                    wx.redirectTo({
                        url: `/attendgroup/coupon/coupon?chf=` + this.data.chiefId
                    });
                }
            }

        }).catch(err => {
        });
    },
    //保存PV数据
    savepv() {
        let data={
            campainId: this.data.campainId,
            channelId: this.data.user_utm_channel
        };
        console.log("savepv data==========================",data);
        fetch({url: API.savepv, data:data , method: 'POST'}).then(res => {
                let {data, code} = res
                console.log("savepv========", res)
                console.log("savepv======data==", data)
            }
        )
    },
    hot(){
        var _this = this;
        _this.startfun();
        // this.setData({
        //     showoption: {
        //         type: 1,
        //         show: true,
        //         alerttext: '活动未开始~',
        //         btntext: '我知道了',
        //         success() {
        //             setTimeout(function () {
        //                 //预约成功后跳转到首页
        //                 wx.switchTab({
        //                     url: '/pages/index/index'
        //                 })
        //             }, 1000);
        //         }
        //     }
        // });
    }
});