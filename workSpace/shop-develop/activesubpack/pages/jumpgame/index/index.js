import Utils from '../../../service/util'
import Fetch from '../../../service/fetch'
import Urls from '../../../service/url'

Page({
    data: {
        isBigPhone: Utils.isBigPhone(),
        is_auth: 0,
        channel: 'natural', //渠道值
        friend_openid: '',
        gameInfo: {}, //游戏状态
        getCouponParames: {}, //领取卡片的参数配置，用于注册完成时重新调用开卡
        isLoading: false, //页面是否初始化
        templateList: [
            'Eg8FcO0NsXM12RV1_PZhtqKnCYK5hjplCKDnoqfh_zw',
            'C_yAE1juTSLKruRYb2OG1vpbMRdvfMTz_uAiEn3IUy4'
        ],
        pageoptions : {}
    },
    onLoad: function(options) {
        options = options.scene ? Utils.getRouteObjByStrOfSunQr(options.scene) : options
        console.log('参数----->', options)
        this.setData({
            channel: options.channel || 'natural',
            friend_openid: options.friend_openid || '',
            pageoptions : options
        })
        console.log(options.status, 'status')
        console.log(options.intergal, 'integral')
        
    },
    onShow: function() {
        //status=0&integral=10
        if (wx.getStorageSync('isLoginNew')) {
            wx.showLoading({
                title: '正在注册',
                mask: true
            });
            return
        }
        if (this.data.pageoptions.status != null && this.data.pageoptions.intergal) { //游戏页面回跳回来
            this.reportScore(this.data.pageoptions.status, this.data.pageoptions.intergal)
            this.initData()
            this.setData({
                pageoptions : {}
            })
        }else{
            this.initData(1)
        }
        console.log(getCurrentPages(), '页面')
    },
    //开始玩游戏
    _play() {
        Utils.throttle(() => {
            let _this = this
            if (this.data.gameInfo.is_activity_end == 1 || this.data.gameInfo.is_activity_end == 2) { //活动结束
                this.selectComponent('#endtip-modal').showModal(1)
                return
            }
            if (this.data.gameInfo.is_game) { //可以玩
                wx.requestSubscribeMessage({
                    tmplIds: _this.data.templateList,
                    complete(res) {
                        // _this.play()
                        let isalert = wx.getStorageSync('isalert')
                        if (isalert) {
                            _this.play()
                        } else {
                            _this.selectComponent('#gametip-modal').showModal()
                        }
                    }
                })
            } else {
                let type = this.data.gameInfo.is_share ? 2 : 1 //1还能分享加机会 2:没有机会
                this.selectComponent('#tip-modal').showModal(type)
            }
        }, 500)()
    },
    play() {
        wx.setStorageSync('isalert', 1)
        Fetch({ url: Urls.cat_gameStart }).then(res => {
            if(res.errcode == 0) {
                if (res.data.is_game) {
                    wx.navigateTo({
                        url: '/activesubpack/pages/jumpgame/gamewebview/index',
                        fail(err) {
                            wx.redirectTo({
                                url: '/activesubpack/pages/jumpgame/gamewebview/index'
                            });
                        }
                    });
                } else {
                    let type = res.data.is_share ? 2 : 1 //2还能分享加机会 3:没有机会
                    this.selectComponent('#tip-modal').showModal(type)
                }
            }
        })
    },
    //初始数据
    initData(type) {
        Fetch({
            url: Urls.cat_isHandle,
            data: {
                channel: this.data.channel,
                friend_openid: this.data.friend_openid
            },
        }).then(res => {
            this.setData({
                is_auth: res.data.is_auth,
                isLoading: true,
                gameInfo: res.data
            })
            wx.setStorageSync('is_auth', res.data.is_auth)
            if (res.data.is_activity_end == 1 || res.data.is_activity_end == 2) { //活动结束
                this._activeEndHandle(res.data.is_activity_end)
                return
            }
            if (res.data.is_can_luck == 1 && type == 1) { //带抽奖
                this.selectComponent('#gameResult-modal').showModal(1, res.data.last_integral)
            }
        }).catch(err => {
            console.log(err)
        })
    },
    //活动结束的处理
    _activeEndHandle(type) {
        if (type == 1) { //活动结束,但是还可以领奖,查看排行榜
            Fetch({ url: Urls.cat_rankList }).then(res => {
                if (res.data.is_integral_award && !res.data.is_fill_address) { //活动结束有领奖品资格并且没有填写地址
                    this.selectComponent('#endtip-modal').showModal(2, res.data.my_rank.rank_id || '')
                } else if (!res.data.is_integral_award) { //没有资格领奖
                    this.selectComponent('#endtip-modal').showModal(1)
                }
            })
        } else if (type == 2) { //完全结束
            this.selectComponent('#endtip-modal').showModal(3)
        }
    },
    showModal(e) {
        Utils.throttle(() => {
            let type = e.target.dataset.type
            let component = type == 1 ? '#rule-modal' : type == 2 ? '#rank-modal' : type == 3 ? '#mycoupon-modal' : type == 4 ? '#sign-modal' : ''
            if (type == 2 && !this.data.is_auth) { //未授权
                console.log(wx.getStorageSync('userInfo'))
                if (!wx.getStorageSync('userInfo')) {
                    wx.navigateTo({
                        url: '/pages/etoLogin/etoLogin'
                    })
                    return
                }
            }
            if (component && this.selectComponent(component)) {
                this.selectComponent(component).showModal(this.data.gameInfo.is_activity_end)
            }
        }, 500)()
    },
    //游戏结果上报
    reportScore(status, integral) {
        console.log(status, integral, '游戏上报')
        Fetch({
            url: Urls.cat_reportScore,
            data: {
                status,
                integral
            },
            method: 'post'
        }).then(res => {
            if (res.errcode == 0) {
                let type = ''
                if (status == 1 && res.data.is_can_luck) { //游戏成功,
                    this.selectComponent('#gameResult-modal').showModal(1, res.data.last_integral)
                } else if (status == 0) {
                    if(res.data.is_game) {
                        type = 4
                    }else if(res.data.is_share == 0){
                        type = 2
                    }else{
                        type = 3
                    }
                    this.selectComponent('#gameResult-modal').showModal(type)
                }
            }
        }).catch(err => {

        })
    },
    //领取卡券 data:卡券信息 type :打开卡券时的场景,开卡完成后会根据这个type做不同的操作
    getCoupon(e) {
        let card = e.detail.cardInfo
        if (card.record_id) {
            let wxinfo = wx.getStorageSync('userInfo')
            let unionid = wx.getStorageSync('unionid')
            if (!this.data.is_auth && (!wxinfo || !unionid)) { //未授权
                wx.navigateTo({
                    url: '/pages/etoLogin/etoLogin'
                })
                return
            }
            let data = {
                record_id: card.record_id
            }
            if (!this.data.is_auth) {
                data.avatar_url = wxinfo.avatarUrl
                data.unionid = unionid
                data.nickname = wxinfo.nickName
            }
            this.setData({
                getCouponParames: e || {}
            })
            Fetch({ url: Urls.cat_getAward, data, method: 'post' }).then((res) => {
                if (res.errcode == 0) {
                    if (res.data.is_member) { //是会员
                        this._addCard(res.data.card_data, data.record_id)
                    } else {
                        if (res.data.is_get_card) { //不是会员但是领过卡券
                            this._openCard(res.data.cardList)
                        } else { //不是会员没领过卡券,注册会员
                            Utils.memberRegistration(res.data.activatemembercard_url)
                        }
                    }
                }
            })
        }
    },
    //打开微信原生卡券
    _addCard(cardList, record_id) {
        let _this = this;
        wx.addCard({
            cardList: cardList,
            success: function(back) {
                _this.receive(record_id)
            },
            fail: function() {
                wx.navigateBack({ delta: 1 })
            }
        })
    },
    openCard(e) {
        console.log(e)
        if (e.detail.cardInfo && e.detail.cardInfo.card_data) {
            this._openCard(e.detail.cardInfo.card_data)
        }
    },
    //查看微信原生卡券
    _openCard(cardList) {
        wx.openCard({
            cardList: cardList,
            success(res) {}
        })
    },
    receive(record_id) {
        Fetch({
            url: Urls.cat_receive,
            data: {
                record_id
            },
            method: 'post'
        }).then(res => {
            wx.showToast({ icon: 'none', title: '领取成功' })
                //addCardType 不同场景的领卡成功的处理
            let getCouponParames = this.data.getCouponParames.detail
            if (getCouponParames.addCardType == 'coupon') { //单个奖品弹框领卡完成,隐藏弹框
                this.selectComponent('#prize-modal').close()
            } else if (getCouponParames.addCardType == 'couponlist') { //奖品列表领卡完成,刷新列表
                this.selectComponent('#mycoupon-modal').showModal()
            } else if (getCouponParames.addCardType == 'sign') { //签到页面领卡成功
                this.selectComponent('#sign-modal').showModal(this.data.gameInfo.is_activity_end)
            }
        })
    },
    //填写地址
    address(e) {
        this.isMember(e)
    },
    share() {
        Fetch({
            url: Urls.cat_share,
            method: 'post'
        }).then(res => {
            this.selectComponent('#gameResult-modal').close()
            if (res.errcode == 0 && res.data.is_game) {
                let changeVal = `gameInfo.is_game`
                this.setData({
                    [changeVal]: 1,
                })
            }
        }).catch(err => {

        })
    },
    //抽奖回调
    lucksuc(data) {
        this.selectComponent('#prize-modal').showModal(data.detail)
    },
    //领取签到奖品
    luckSignAward(e) {
        Fetch({ url: Urls.cat_luckSignAward }).then(res => {
            if (res.errcode == 0) {
                e.detail.cardInfo = {...res.data }
                this.getCoupon(e)
            }
        })
    },
    //是否是会员
    isMember(e) {
        let wxinfo = wx.getStorageSync('userInfo')
        let unionid = wx.getStorageSync('unionid')
        if (!this.data.is_auth && (!wxinfo || !unionid)) { //未授权
            wx.navigateTo({
                url: '/pages/etoLogin/etoLogin'
            })
            return
        }
        let data = {
            channle: this.data.channel
        }
        if (!this.data.is_auth) {
            data.avatar_url = wxinfo.avatarUrl
            data.unionid = unionid
            data.nickname = wxinfo.nickName
        }
        this.setData({
            getCouponParames: e || {}
        })
        Fetch({ url: Urls.cat_isMember, data }).then(res => {
            if (res.errcode == 0) {
                if (res.data.is_member) { //是会员
                    this.selectComponent('#rank-modal').close()
                    this.selectComponent('#endtip-modal').close()
                    this.selectComponent('#address-modal').showModal()
                } else {
                    if (res.data.is_get_card) { //不是会员但是领过卡券
                        this._openCard(res.data.cardList)
                    } else { //不是会员没领过卡券,注册会员
                        Utils.memberRegistration(res.data.activatemembercard_url)
                    }
                }
            }
        })
    },
    //注册完成的回调
    registerCallBack() {
        wx.hideLoading();
        if (this.data.getCouponParames.detail && this.data.getCouponParames.detail.addCardType == '"address"') {
            this.isMember(this.data.getCouponParames) //填写地址
        } else { //领券
            this.getCoupon(this.data.getCouponParames)
        }
    },
    onShareAppMessage: function() {
        this.share()
        let path = wx.getStorageSync('openid') ? `/activesubpack/pages/jumpgame/index/index?friend_openid=${wx.getStorageSync('openid')}&channel=${this.data.channel}` : `/activesubpack/pages/jumpgame/index/index?&channel=${this.data.channel}`
        console.log(path)
        return {
            title: '登场即C位，乘风破浪去！',
            path: path,
            imageUrl: 'https://tc.woaap.com/wemall/share.png',
        }
    },
})