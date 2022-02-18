// pages/whitePage/whitePage.js
const app = getApp();
const brand = app.config.brand;
const hostname = 'https://bestseller-wechat.woaap.com/'

// tabbar的页面路径
const TAB_BAR = [
    '/pages/index/index',
    '/pages/memberCenter/memberCenter',
    '/pages/informat/informat',
    '/pages/weMember/weMember',
    '/pages/nearbyShops/main/main',
]
Page({
    /**
     * 页面的初始数据
     */
    data: {
        channel: "", //启动参数
        delivery_id: "", //启动参数
        need_open_card: '', //启动参数
        guideid: '', //启动参数
        storeid: '', //启动参数
        jump_url: "", //h5跳转地址
        webView: false,
        navigator: false,
        extraData: {
            biz: "MjM5MjAxNzc1NA==",
            encrypt_card_id: "4GgneIxEhqtmCrH+2B4alE8DXBYPLKB5XTq9LzL8MaxSBEkoE8Ag6LFjp39EdKW5",
            outer_str: "001"
        },
        subchannel: ''
    },
    onLoad: function(e) {
        if(e.scene){
            let scene = decodeURIComponent(e.scene)
            console.log('=====onload',scene)
            let sccneVal = scene.split('&')
            let obj = {}
            sccneVal.forEach(item => {
                let itemVal = item.split('=')
                obj[itemVal[0]] = itemVal[1]
            })
            console.log('=====onload obj',obj)
            this.setData({
                subchannel: obj.subchannel || ''
            })
        }else if(e.subchannel){
            console.log('=====onload',e)
            this.setData({
                subchannel: e.subchannel || ''
            })
        }
        if (!e.channel || !e.delivery_id) {
            wx.showToast({
                title: '启动参数错误',
                icon: 'none'
            })
        } else {
            wx.setStorage({
                key: 'qs-channel',
                data: e.channel
            });
            wx.setStorage({
                key: 'qs-delivery_id',
                data: e.delivery_id,
            })
            if (e.need_open_card) {
                wx.setStorage({
                    key: 'need_open_card',
                    data: e.need_open_card,
                })
            }
            if (e.guideid) {
                wx.setStorage({
                    key: 'guideid',
                    data: e.guideid,
                })
            }
            if (e.channel_token) {
                wx.setStorage({
                    key: 'channel_token',
                    data: e.channel_token || ''
                });
            }
            if (e.channel_tag) {
                wx.setStorage({
                    key: 'channel_tag',
                    data: e.channel_tag || '',
                })
            }
            if (e.storeid) {
                wx.setStorage({
                    key: 'storeid',
                    data: e.storeid,
                })
            }

            this.setData({
                channel: e.channel,
                delivery_id: e.delivery_id,
                need_open_card: e.need_open_card || '',
                guideid: e.guideid || '',
                storeid: e.storeid || '',
                channel_token: e.channel_token || '',
                channel_tag: e.channel_tag || '',
            })
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let result = wx.getStorageSync('didOpenCard');
        if (result) { //打开会员卡之后不再执行
            wx.removeStorageSync('didOpenCard');
            this.backJump(result);
        } else {
            wx.showLoading({
                title: '加载中',
            });
            if (this.data.channel == '') {
                let channel = wx.getStorageSync('qs-channel');
                let delivery_id = wx.getStorageSync('qs-delivery_id');
                let need_open_card = wx.getStorageSync('need_open_card') || ''
                let guideid = wx.getStorageSync('guideid') || ''
                let storeid = wx.getStorageSync('storeid') || ''
                let channel_token = wx.getStorageSync('channel_token') || ''
                let channel_tag = wx.getStorageSync('channel_tag') || ''
                this.setData({
                    channel: channel,
                    delivery_id: delivery_id,
                    need_open_card,
                    guideid,
                    storeid,
                    channel_tag,
                    channel_token
                }, () => {
                    wx.hideLoading();
                    if (wx.getStorageSync('isStart')) {
                        console.log('等待');
                        wx.showLoading({
                            title: "加载中",
                            duration: 2000
                        });
                    } else {
                        if (this.data.webView == false) {
                            this.checkIfHadUnionId();
                        } else {
                            console.log('webview true', this.data)
                        }
                    }
                })
            } else {
                wx.hideLoading();
                if (wx.getStorageSync('isStart')) {
                    console.log('等待');
                    wx.showLoading({
                        title: "加载中",
                        duration: 2000
                    });
                } else {
                    if (this.data.webView == false) {
                        this.checkIfHadUnionId();
                    } else {
                        //
                        console.log('webview true', this.data)
                    }
                }
            }
            if (this.data.channel && this.data.delivery_id && wx.getStorageSync("openid")) {
                let data = {
                    channel: this.data.channel,
                    delivery_id: this.data.delivery_id,
                    openid: wx.getStorageSync("openid"),
                    channel_tag: this.data.channel_tag || '',
                    channel_token: this.data.channel_token || ''
                }
                wx.request({
                    url: hostname + 'api/channel/save',
                    method: 'post',
                    data,
                    success: function(res) {

                    },
                    fail: function(res) {}
                })
            }
        }
    },
    /**
     * 检查本地存储内有没UnionId
     */
    checkIfHadUnionId(location) {
        try {
            var UniondId = wx.getStorageSync("unionid");
            var OpenId = wx.getStorageSync("openid");
            if (UniondId && OpenId) {
                console.log(UniondId, "取到的unionid");
                //会员判断流程
                location ? this.ifMember(OpenId, UniondId, location) : this.ifMember(OpenId, UniondId);
            } else {
                //如果没有就跳去授权(eto获取unionid)
                wx.navigateTo({
                    url: '/pages/etoLogin/etoLogin'
                })
            }
        } catch (e) {
            console.log(e, "unionid报错");
        }
    },
    /**
     * 是否会员的流程
     * @parma {*} OpenId wx的openid
     * @parma {*} UniondId wx的unionid
     */
    ifMember(OpenId, UniondId, location) {
        let data = {};
        if (location) {
            data = {
                openid: OpenId,
                unionid: UniondId,
                channel: this.data.channel,
                delivery_id: this.data.delivery_id,
                need_open_card: this.data.need_open_card,
                storeId: this.data.storeid,
                guideId: this.data.guideid,
                nation: location.nation,
                province: location.province,
                city: location.city,
                district: location.district,
                channel_tag: this.data.channel_tag || '',
                channel_token: this.data.channel_token || ''
            }
        } else {
            data = {
                openid: OpenId,
                unionid: UniondId,
                need_open_card: this.data.need_open_card,
                storeId: this.data.storeid,
                guideId: this.data.guideid,
                channel: this.data.channel,
                delivery_id: this.data.delivery_id,
                channel_tag: this.data.channel_tag || '',
                channel_token: this.data.channel_token || ''
            }
        }
        wx.showLoading({
            title: '加载中',
        })
        var _this = this;
        data.subchannel = this.data.subchannel
        console.log('领卡参数', data)
        wx.request({
            url: hostname + 'page/mini-coupon-exchange',
            data,
            success: function(res) {
                console.log("########", res.data);
                let preview = res
                switch (res.data.errcode) {
                    case 0:
                        let back = res.data;
                        if (back.is_member == 0) {
                            if (back.is_get_card == 1) { //判断是否领卡 领过 opencard
                                wx.openCard({
                                    cardList: back.data.cardList,
                                    success: function() {
                                        console.log('成功进入opencard');
                                    },
                                    fail: function(res) {
                                        wx.showToast({
                                            title: res,
                                            icon: 'none'
                                        })
                                    }
                                })
                            } else { //没有领过卡正常走开卡
                                var url = back.activatemembercard_url;
                                var a = url.split("#")[0];
                                var b = a.split("?")[1].split("&");
                                var result = {};
                                for (var i = 0; i < b.length; i++) {
                                    var c = b[i].split("=");
                                    result[c[0]] = c[1];
                                }
                                console.log("微信开卡组件");
                                let data = {
                                    biz: decodeURIComponent(result.biz),
                                    encrypt_card_id: decodeURIComponent(result.encrypt_card_id),
                                    outer_str: decodeURIComponent(result.outer_str)
                                }
                                console.log("传入data", data);
                                _this.memberRegistration(data)
                            }
                        } else {
                            //0需要领券  1 不需要领券
                            if (back.is_card == 1) {
                                console.log('不需要领券的流程')
                                if (back.is_get_card == 0) {
                                    wx.addCard({
                                        cardList: back.data.cardList,
                                        success: function(data) {
                                            let cardId = data.cardList[0].cardId;
                                            let code = data.cardList[0].code;
                                            console.log('opencard参数', cardId, code);
                                            _this.codeGet(cardId, code, res);
                                        },
                                        fail: function() {

                                        }
                                    })
                                } else {
                                    wx.openCard({
                                        cardList: back.data.cardList,
                                        success: (result) => {
                                            console.log('打开会员卡成功');
                                            wx.setStorageSync('didOpenCard', res);
                                        },
                                        fail: (err) => {
                                            console.log('打开会员卡失败', err)
                                        },
                                    });
                                }
                            } else {
                                _this.addCardJump(res);
                            }
                            wx.hideLoading();
                        }
                        break;
                    case 201:
                        wx.hideLoading();
                        wx.showModal({
                            title: '积分兑换优惠券',
                            content: res.data.data.exchange_point + '积分兑换优惠券',
                            success: function(res) {
                                wx.showLoading({
                                    title: '加载中'
                                })
                                if (res.confirm) {
                                    console.log('领卡参数2', {
                                        openid: OpenId,
                                        unionid: UniondId,
                                        channel: _this.data.channel,
                                        delivery_id: _this.data.delivery_id,
                                        isConfirm: 1,
                                        storeId: _this.data.storeid,
                                        channel_tag: _this.data.channel_tag || '',
                                        channel_token: _this.data.channel_token || ''
                                    })
                                    wx.request({
                                        url: hostname + 'page/mini-coupon-exchange',
                                        data: {
                                            openid: OpenId,
                                            unionid: UniondId,
                                            channel: _this.data.channel,
                                            delivery_id: _this.data.delivery_id,
                                            isConfirm: 1,
                                            storeId: _this.data.storeid,
                                            channel_tag: _this.data.channel_tag || '',
                                            channel_token: _this.data.channel_token || ''
                                        },
                                        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                                        // header: {}, // 设置请求的 header
                                        success: function(res) {
                                            if (res.data.errcode == 9) {
                                                wx.showToast({
                                                    title: res.data.errmsg,
                                                    icon: 'none'
                                                })
                                            }
                                            if (res.data.errcode == 0) {
                                                _this.addCardJump(res);
                                            }
                                        },
                                        fail: function(err) {
                                            // fail
                                            console.log(err, 'page/mini-coupon-exchange err')
                                        },
                                        complete: function() {
                                            // complete
                                        }
                                    })
                                }
                                if (res.cancel) {
                                    wx.switchTab({
                                        url: '/pages/index/index'
                                    })
                                }
                            }
                        })
                        break;
                    case 202:
                        wx.getLocation({
                            type: 'wgs84',
                            success(res) {
                                const latitude = res.latitude;
                                const longitude = res.longitude;
                                _this.getLocationSelf(latitude, longitude);
                            }
                        })
                        break
                    default:
                        wx.hideLoading();
                        wx.showModal({
                            title: '提示',
                            content: res.data.errmsg,
                            showCancel: false,
                            success: function(res) {
                                let path = preview.data.mini_jump_url || ''
                                console.log('===========path', path)
                                // 判断路径是否是TAB_BAR
                                if(path){
                                    let is_tab = TAB_BAR.findIndex(item => path == item)
                                    if(is_tab != -1){
                                        wx.switchTab({
                                            url: path
                                        })
                                    }else{
                                        wx.redirectTo({
                                            url: path,
                                        })
                                    }
                                }else{
                                    wx.switchTab({
                                        url: '/pages/index/index'
                                    })
                                }
                            }
                        })
                }

            },
            fail: function(res) {
                wx.showToast({
                    title: res.errMsg,
                    icon: "none",
                })
            }
        })
    },
    /**
     *  跳转微信原生开卡
     * @param {*} data  微信需要的参数
     */
    memberRegistration(data) {
        wx.setStorage({
            key: 'isLogin',
            data: true,
            success: function(res) {
                wx.navigateToMiniProgram({
                    appId: 'wxeb490c6f9b154ef9', // 固定为此 appid，不可改动
                    extraData: data, // 包括 encrypt_card_id, outer_str, biz三个字段，须从 step3 中获得的链接中获取参数
                    success: function(res) {
                        wx.setStorageSync('isStart', 1);
                    },
                    fail: function(res) {
                        console.log(res, "navigateToMiniProgram-fail");
                        wx.hideLoading();
                    }
                })
            },
            fail: function() {
                // fail
            }
        }) //设置参数
    },
    /**
     * 获取省市区
     * @param {*} lat - 经度
     * @param {*} lng - 维度
     */
    getLocationSelf: function(lat, lng) {
        var _this = this;
        wx.request({
            url: hostname + 'api/getLocation',
            data: {
                lat,
                lng
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                var location = {};
                location.nation = res.data.data.nation;
                location.province = res.data.data.province;
                location.city = res.data.data.city;
                location.district = res.data.data.district;
                _this.checkIfHadUnionId(location);
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        })
    },
    /**
     * 领券并跳转
     */
    addCardJump(res) {
        var _this = this;
        _this.setData({
            webView: true
        }, () => {
            wx.addCard({
                cardList: res.data.data.cardList,
                success: function(back) {
                    console.log(back);
                    if (_this.data.need_open_card == 1) {
                        _this.updateCoupon(back)
                    } else {
                        if (back.cardList.length == 1) {
                            _this.codeGet(back.cardList[0].cardId, back.cardList[0].code, res); //打开卡券展示页面
                        } else {
                            _this.backJump(res); //如果大于两张直接回跳
                        }
                    }
                },
                fail: function() {
                    wx.navigateBack({
                        delta: 1,
                        fail: function () {
                            wx.switchTab({
                                url: '/pages/index/index'
                            })
                        }
                    })
                }
            })
        })
    },
    //领卡成功更新
    updateCoupon(back) {
        let _this = this
        let data = {
            openid: wx.getStorageSync("openid") || '',
            channel: this.data.channel
        }
        wx.request({
            url: hostname + 'page/mini-update-coupon',
            data,
            success: function(res) {
                if (res.data.errcode == 0) {
                    if (back.cardList.length == 1) {
                        _this.codeGet(back.cardList[0].cardId, back.cardList[0].code, res); //打开卡券展示页面
                    } else {
                        _this.backJump(res); //如果大于两张直接回跳
                    }
                } else {
                    wx.showToast({
                        title: res.data.errmsg || '更新卡券失败',
                        icon: "none",
                    })
                }
            },
            fail: function(res) {
                wx.showToast({
                    title: res.errMsg,
                    icon: "none",
                })
            }
        })
    },
    /**
     * code解密接口并跳转
     * @param {*} cardId
     * @param {*} code
     * @param {*} oldInfo
     */
    codeGet(cardId, code, oldInfo) {
        var _this = this;
        let brandId = 0;
        switch (brand) {
            case 'ONLY':
                brandId = 1;
                break;
            case 'JACKJONES':
                brandId = 2;
                break;
            case 'VEROMODA':
                brandId = 3;
                break;
            case 'SELECTED':
                brandId = 4;
                break;
            case 'JLINDEBERG':
                brandId = 5;
                break;
            case 'FOL':
                brandId = 6;
                break;
        }
        wx.request({
            url: hostname + 'api/coupon/mini-decrypt-code',
            data: {
                brand: brandId,
                encrypt_code: code
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res) {
                // success
                console.log("解码成功")
                wx.openCard({
                    cardList: [{
                        cardId: cardId,
                        code: res.data.data.code
                    }],
                    success: function() {
                        _this.backJump(oldInfo);
                    },
                    fail: function(err) {
                        console.log("opencard出错出错出错", err)
                    }
                })
            },
            fail: function(ret) {
                // fail
                wx.showToast({
                    title: ret.errMsg,
                    icon: "none"
                })
            },
            complete: function() {
                // complete
            }
        })
    },
    /**
     * 回跳
     * @param {*} res
     */
    backJump(res) {
        console.log("跳转传入的参数", res);
        let jump_url = res.data.redirect_url ? res.data.redirect_url : '';
        let reg = /http/;
        if (jump_url != '') { //判断是否有跳转地址
            if (reg.test(jump_url)) { //判断是h5链接还是小程序链接
                _this.setData({
                    jump_url: jump_url,
                    webView: true
                })
            } else {
                let URL = "/" + jump_url;
                // console.log(URL)
                // return false
                if (URL.indexOf('/pages/index/index') != -1 ||
                  URL.indexOf('/pages/memberCenter/memberCenter') != -1 ||
                  URL.indexOf('/pages/informat/informat') != -1 ||
                  URL.indexOf('/pages/guide/guide') != -1 ||
                  URL.indexOf('/pages/nearbyShops/main/main') != -1
                ) {
                    if (URL.indexOf('/pages/memberCenter/memberCenter') != -1 && URL.indexOf('open=card') != -1) {
                        wx.setStorageSync('fromwhitepage', 1)
                    }
                    wx.switchTab({
                        url: URL,
                        success: function(res) {
                            // success
                        },
                        fail: function(res) {
                            // fail
                            console.log("tab跳转失败")
                            wx.switchTab({
                                url: '/pages/index/index'
                            })
                        },
                        complete: function() {
                            // complete
                        }
                    })
                } else {
                    wx.redirectTo({
                        url: URL,
                        success: function(res) {
                            // success
                        },
                        fail: function(res) {
                            // fail
                            console.log("异常失败回跳", URL)
                            wx.switchTab({
                                url: '/pages/index/index'
                            })
                        },
                        complete: function() {
                            // complete
                        }
                    })
                }
            }
        } else {
            console.log("失败回跳")
            wx.navigateBack({
                delta: 1
            })
        }
    }
})