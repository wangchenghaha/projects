import Config from '../../config/index'
import Service from '../../request/index'
import { getWeChatInfo, wxLogin, isMember } from '../../../service/user'
import { KEYSTORAGE } from '../../../src/const'
import Utils from '../../common/utils/index'
const app = getApp()
const brand = app.config.brand;
const awards = Config.debug ? Config.awards.local : Config.awards.proxy
let _options = {}
Page({
    data: {
        wh: wx.getSystemInfoSync().windowHeight,
        preload: true,
        showModal: false,
        modalconfig: {},
        info: {},
        btnDisabled: false,
        animationData: {},
        unionid: wx.getStorageSync(KEYSTORAGE.unionid) || wx.getStorageSync(KEYSTORAGE.wxInfo) || '',
        channel_type : '',
    },
    onLoad: function (options) {
        wx.hideShareMenu()
        _options = options
        this._home(options)
    },
    imageAllLoad() {
        this.setData({
            preload: false
        })
    },
    // 会到商城
    toShop() {
        wx.reLaunch({
            url: '/pages/index/index'
        });

    },
    // 开始抽奖
    startaward() {
        let { modalconfig } = this.data

        if (this.data.btnDisabled) return
        if (this.data.info.is_luck) {
            wx.showToast({
                title: '您已参加过抽奖了！',
                icon: 'none',
                duration: 1500,
                mask: false,
            })
            return
        }
        Service.award().then(res => {
            if (res.errcode == 0) {
                let Index = awards.findIndex(el => el.id == res.data.award_id)

                if (Index > -1) {
                    modalconfig = Object.assign({ index: Index, handleCoupon: this.handleCoupon }, res.data)
                    this.setData({
                        modalconfig
                    })
                    this._home(_options)
                    this.startAnimation(Index)
                }
            }
        })
    },

    // 开始转动
    startAnimation(Index) {
        var runNum = 8;//旋转8周
        var duration = 2500;//时长
        let length = 6

        // 旋转角度

        let runDeg = runNum * 360 + Index * (360 / length)
        //创建动画
        var animationRun = wx.createAnimation({
            duration: duration,
            timingFunction: 'ease-in-out',
        })
        animationRun.rotate(runDeg).step();
        this.setData({
            animationData: animationRun.export()
        })
        setTimeout(() => {
            animationRun.rotate(runDeg).step();
            this.data.btnDisabled = false
            this.setData({
                showModal: true
            })
        }, duration + 200)

    },
    // 查看优惠券
    checkcard() {
        let { cardList } = this.data.info
        let arr = cardList.map(el => {
            return {
                cardId: el.cardId,
                code: el.code
            }
        })
        wx.openCard({
            cardList: arr
        })
    },
    // 领取奖品
    getcard() {

    },
    // 获取用户信息
    getuserinfo(e) {
        const me = this
        if (e.detail.errMsg === 'getUserInfo:ok') {
            wx.showLoading({ title: '正在登录...', mask: true });
            wxLogin().then(js_code => {
                const wxInfoParam = {
                    brand,
                    js_code,
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv
                };
                getWeChatInfo(wxInfoParam).then(res => {
                    wx.setStorageSync(KEYSTORAGE.authed, true);
                    wx.setStorageSync(KEYSTORAGE.openid, res.openId || '');
                    wx.setStorageSync(KEYSTORAGE.unionid, res.unionId || '');
                    wx.setStorageSync(KEYSTORAGE.wxInfo, res)
                    me.setData({
                        userinfo: res
                    }, () => {
                        me.handleCoupon()
                    })
                })
            })
        }
    },
    // 领取优惠券
    handleCoupon() {
        const me = this
        Utils.throttle(() => {
            if (!this.data.info.is_luck) {
                wx.showToast({
                    title: '您还没有抽奖哦~',
                    icon: 'none',
                    duration: 1500,
                    mask: false,
                })
                return
            }
            isMember(app.config.etoBrand,'CRAYON_SHIN_CHAN_1',this.data.channel_type).then(res => {
                if (res.errcode == 0) {
                    if (res.is_member) {
                        me.closemodal()
                        me.sendCard()
                    } else {
                        this.openMemberCard('isLogin', res.activatemembercard_url)
                        wx.setStorageSync('shakeCouoponHandler', 'handleCoupon');
                    }
                }
            })
        },1000)()
    },
    // start开始送券
    sendCard() {
        const me = this
        let params = {
            record_id: this.data.info.record_id
        }
        Service.handleCoupon(params).then(res => {
            if (res.errcode == 0) {
                console.log('cardList',res.data.cardList)
                wx.addCard({
                    cardList: res.data.cardList,
                    success: () => {
                        Service.couponStatus(params).then(resp => {
                            if (resp.errcode == 0) {
                                me._home(_options)
                            }
                        })
                    }
                })
            }

        })
    },
    // 获取数据
    _home(options = {}) {
        let params = {}

        if (options.scene) {
            let Objects = new Object()
            let scene = decodeURIComponent(options.scene)
            let arrPara = scene.split("&")
            arrPara.forEach(el => {
                let arr = el.split('=')
                Objects[arr[0]] = unescape(arr[1]) || ''
            })
            params.channel_type = Objects.channel_type || ''
        } else {
            params.channel_type = options.channel_type || ''
        }
        this.setData({
            channel_type :params.channel_type
        })
        console.log('连接入参：', options)
        Service.thome(params).then(res => {
            if (res.errcode === 0) {
                this.setData({
                    info: res.data
                })
            }
        })
    },
    closemodal() {
        this.setData({
            showModal: false
        })
    },
    // 开卡流程
    openMemberCard(key, _url, cardList) {
        /*没有领过卡正常走开卡 */
        const that = this
        const _data = {
            encrypt_card_id: Utils.GetQueryString(_url, 'encrypt_card_id'),
            biz: Utils.GetQueryString(_url, 'biz').split('#')[0],
            outer_str: Utils.GetQueryString(_url, 'outer_str'),
        };
        wx.setStorage({
            key,
            data: true,
            success: function (res) {
                wx.navigateToMiniProgram({
                    appId: 'wxeb490c6f9b154ef9', // 固定为此 appid，不可改动
                    extraData: _data, // 包括 encrypt_card_id, outer_str, biz三个字段，须从 step3 中获得的链接中获取参数
                    success: function (res) {
                        wx.setStorageSync('isStart', 11)
                    },
                    fail: function (res) {

                    }
                })
            },
            fail: function () { }
        })
    },
})