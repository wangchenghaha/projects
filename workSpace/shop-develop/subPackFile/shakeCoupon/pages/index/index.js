import Utils from '../../common/utils/index'
import Images from '../../common/image/image'
import API from '../../request/index'
import regeneratorRunTime from '../../common/regenerator/index.js'
import Conf from '../../config/index'
const AWARDS = Conf.Awards
let PAGE = null
let innerAudioContext = wx.createInnerAudioContext()
const AniTime = 400
Page({
  data: {
    isBigPhone: Utils.isBigPhone(),
    statusHeight: wx.getSystemInfoSync().statusBarHeight,
    Images,
    options: {},
    onloadtime: new Date().getTime(), // 页面加载时间
    showModal: false,
    preload: true,
    modalConfig: {
      type: 'doorModal'
    },
    needType: '',
    animateStart: false,
    modallist: {},
    acData: {}, // 活动信息,
    cardList1: [], // 第一个礼包券
    _exData: {}, // 会员卡信息,
    is_join: null, // 是否参与活动
    is_share: 0,
    is_get_coupon: null, // 是否领取礼包券
    invite_count: 0, // 邀请好友数量
    is_luck: 0, // 今天是否抽过奖
    recordList: [], // 抽奖记录
    result: {}, // 中奖结果页
    lastTime: 0, // 下次抽奖时间小时，
    luck_count: 0, // 
    stopInfo: false, // 阻止onshow显示调用数据获取接口
  },

  onLoad: function (options) {
    PAGE = this
    innerAudioContext.src = "https://alioss.woaap.com/adidas/yao.mp3";
    innerAudioContext.loop = false;
    this._modalFormat()
    setTimeout(() => {
      this.formatOptions(options).then(res => {
        this.setData({ options: res })
        this._homeData(res)
      })
    }, 400)
  },
  onReady: function () {},
  onShow: function () {
    let { options, stopInfo } = this.data
    if (!options || !options.inviter_openid) return
    if (stopInfo) return
    this._homeData(options)
  },
  onShareAppMessage: function () {
    let { options, is_join, acData } = this.data
    if (!is_join) {

      setTimeout(() => {
        this.shareActive('first')
      }, 400)
      return {
        title: '女神节福利奉上，快来查收！',
        path: `/subPackFile/shakeCoupon/pages/index/index?big_channel=${options.big_channel || ''}&small_channel=${options.small_channel || ''}&inviter_openid=${wx.getStorageSync('openid') || ''}`,
        imageUrl: 'https://tc.woaap.com/lingzhi/only_shop/share.jpg'
      }
    }

    if (is_join) {

      setTimeout(() => {
        this.shareActive('second')
      }, 400)
      return {
        title: '女神节福利奉上，快来查收！',
        path: `/subPackFile/shakeCoupon/pages/index/index?big_channel=${acData.big_channel || ''}&small_channel=${acData.small_channel || ''}&inviter_openid=${acData.openid || ''}`,
        imageUrl: 'https://tc.woaap.com/lingzhi/only_shop/share.jpg'
      }
    }
  },
  // 图像加载结束
  imageAllLoad() {
    setTimeout(() => {
      this.setData({
        preload: false
      })
    }, 500)
  },
  // 微信摇一摇
  onAccelerometerChange(e) {
    const me = this
    // // 弹窗显示则不需要摇一摇
    if (this.data.showModal) return

    if ((e.x > 0.7 || e.y > 0.7) && !this.data.preload && (this.data.onloadtime + AniTime) <= new Date().getTime() && !this.data.is_join) {
      innerAudioContext.play(); // 开始播放音频
      this.setData({
        animateStart: true
      })
      setTimeout(() => {
        wx.vibrateLong({
          success: function () {
            me._GetReward()
          },
          fail: function () {
            console.log("振动失败")
          }
        })
      }, 1000)
    }
  },
  // 立即抽奖按钮到结果页
  getRewardNow() {
    // this.selectComponent('#modal').setRotate(2, {gift_id: 3})
    // return
    API.startReward({}).then(res => {
      if (res.errcode == 0) {
        let _k = AWARDS.findIndex(el => el.id == res.data.gift_id)
        if (_k > -1) {
          this.selectComponent('#modal').setRotate(_k+1, res.data)
        }
      }
    })
  },
  // 分享zeng增加次数或者继续进行游戏
  shareActive(time) {
    const that = this
    let { options: { big_channel, small_channel, inviter_openid }, invite_count } = this.data
    let params = {
      big_channel,
      small_channel,
      inviter_openid,
      time
    }

    API.shareActive(params).then(res => {
      if (res.errcode === 0) {
        that.setData({
          is_join: 1,
          stopInfo: true,
          invite_count
        }, () => {
          if (time == 'first') {
            this.setData({ ...this.data.modalList['cardone'] })
          }
          let { options } = that.data
          if (!options || !options.inviter_openid) return
          that._homeData(options)
        })
      }
    })
  },
  // 隐藏所有modal
  hideAllModal() {
    this.setData({
      needType: '',
      showModal: false
    })
  },
  // 查看规则
  checkRule() {
    this.setData({needType:'first', ...this.data.modalList['rulebox'] })
  },
  // 通过点击事件出发
  clickShow: Utils.debounce(() => {
    if (!PAGE) return
    if (PAGE.data.showModal || PAGE.data.getWard) return
    if ((PAGE.data.onloadtime + AniTime) <= new Date().getTime()) {
      PAGE.setData({
        animateStart: true
      }, () => {
        setTimeout(() => {
          PAGE._GetReward()
        }, 500)
      })
    }
  }, 240),
  // 立即领取优惠券
  handleSendCoupon() {
    let { options: { big_channel, small_channel, inviter_openid } } = this.data
    let params = {
      big_channel,
      small_channel,
      inviter_openid
    }

    API.getWardOne(params).then(res => {
      if (res.errcode === 0) {
        let { is_get_coupon, cardList, is_get_card, is_member, activatemembercard_url, id }  = res.data
        console.log(is_get_coupon, cardList, is_get_card, is_member, activatemembercard_url, id, new Date().toLocaleDateString(), '开卡回调返回结果')
        // 检查会员身份
        if (is_member == 1) {
          // // 已经领过卡
          if (is_get_card == 1) {
            wx.addCard({
              cardList: cardList,
              success: async () => {
                let _res = await API.changeCardStatus({type: 1, id})
                if (_res.errcode === 0) {
                  this.setData({
                    is_get_coupon: 1,
                    stopInfo: true
                  })
                  this._homeData(params)
                }
              }
            });
          } else {
            // 没有领取会员卡
            this.openMemberCard('isLogin', activatemembercard_url, cardList)
            wx.setStorageSync('shakeCouoponHandler', 'handleSendCoupon');
              
          }

        } else {
          // 不是会员去领会员卡
          this.openMemberCard('isLogin', activatemembercard_url, cardList)
          wx.setStorageSync('shakeCouoponHandler', 'handleSendCoupon');
            
        }
      }
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
            console.log("navigateToMiniProgram-fail....", res);
            /* 设置手动开卡提示 */
            that.setData({

              _exData: _data
            })
          }
        })
      },
      fail: function () { }
    })
  },
  // 整理options参数
  formatOptions: options => {
    return new Promise((resolve, reject) => {
      if (!options) {
        resolve({
          big_channel: 'wxapp',
          small_channel: '',
          inviter_openid: '',
        })
      } else {
        if (!options.scene) {
          let Objects = Object.assign({}, options)
          if (!Objects.hasOwnProperty('inviter_openid')) {
            Objects.inviter_openid = ''
          }
          if (!Objects.hasOwnProperty('big_channel')) {
            Objects.big_channel = ''
          }
          if (!Objects.hasOwnProperty('small_channel')) {
            Objects.small_channel = ''
          }
          resolve(Objects)
        } else {
          let Objects = new Object()
          let scene = decodeURIComponent(options.scene)
          let arrPara = scene.split("&")
          arrPara.forEach(el => {
            let arr = el.split('=')
            Objects[arr[0]] = unescape(arr[1]) || ''
          })
          if (!Objects.hasOwnProperty('inviter_openid')) {
            Objects.inviter_openid = ''
          }
          if (!Objects.hasOwnProperty('big_channel')) {
            Objects.big_channel = ''
          }
          if (!Objects.hasOwnProperty('small_channel')) {
            Objects.small_channel = ''
          }

          resolve(Objects)
        }
      }
    })
  },
  // 立即查看礼包一
  openOneCard() {
    let { cardList1 } = this.data
    let arr = cardList1.map(el => {
      return {
        cardId: el.card_id,
        code: el.code
      }
    })
    wx.openCard({
      cardList: arr,
      success: (result) => {
        this.setData({
          stopInfo: true
        })
      }
    });

  },
  // 领取中奖奖品
  getSecAward(obj) {
    let id = obj && obj.id
    if (id) {
      wx.setStorageSync('SecAward', id)
    } else {
      id = wx.getStorageSync('SecAward')
    }
    let { modalConfig } = this.data
    API.getWardTwo({id}).then(res => {
      if (res.errcode == 0) {
        let { data: { cardList, is_get_card, is_member, activatemembercard_url } } = res
        // 检查会员身份
        if (is_member == 1) {
          // // 已经领过卡
          if (is_get_card == 1) {
            wx.addCard({
              cardList: cardList,
              success: async (result) => {
                let _res = await API.changeCardStatus({type: 2, id})
                if (_res.errcode == 0) {
                  modalConfig.type = 'result'
                  // modalConfig.result.is_get_coupon = 1
                  this.setData({
                    modalConfig
                  })
                }
              },
              fail: () => { },
              complete: () => {

                wx.removeStorageSync('SecAward')
              }
            });
          } else {
            // 没有领取会员卡
            _Page.openMemberCard('isLogin', activatemembercard_url, cardList)
            wx.setStorageSync('shakeCouoponHandler', 'getSecAward');
          }

        } else {
          // 不是会员去领会员卡
          _Page.openMemberCard('isLogin', activatemembercard_url, cardList)
          wx.setStorageSync('shakeCouoponHandler', 'getSecAward');
        }
      }
    })
  },
  // 获取模拟中奖结果
  _GetReward(isFirst = false) {
    this.setData({
      animateStart: false,
      showReward: true,
      showModal: true
    }, () => {
      this.setData({ ...this.data.modalList['doorModal']})
    })
  },
  // 计算今天最后一秒时间
  _formatTime(now) {
    var todayYear = (new Date()).getFullYear();
    var todayMonth = (new Date()).getMonth();
    var todayDay = (new Date()).getDate();
    var todayTime = (new Date(todayYear, todayMonth, todayDay, '23', '59', '59')).getTime() / 1000;//毫秒
    return Math.ceil((todayTime - now) / (60 * 60))
  },

  _homeData(options) {
    const me = this
    API.usrStatus(options).then(res => {
      if (res.errcode == 0) {
        let { is_join, is_get_coupon, invite_count, is_luck, data, luck_time, is_share, luck_count } = res.data
        this.setData({
          is_share,
          luck_count,
          is_join, // 是否参与活动
          is_get_coupon, // 是否领取礼包券
          invite_count, // 邀请好友数量
          is_luck, // 今天是否抽过奖，
          lastTime: me._formatTime((new Date().getTime()) / 1000),
          acData: data,
          cardList1: is_join == 1 ? data.card_data : [],
          // showModal: true,
          // modalConfig: {
          //   type: 'cardone',
          // }
        })
        wx.setStorageSync('unionid', data.unionid);

        // 已经参与过活动
        if (is_join) {
          this.setData({
            showReward: true,
            showModal: true,
            modalConfig: {
              isShare: is_share,
              luckCount: luck_count,
              isJoin: is_join, // 是否参与活动
              isGetCoupon: is_get_coupon, // 是否领取礼包券
              inviteCount: invite_count, // 邀请好友数量
              isLuck: is_luck, // 今天是否抽过奖，
              lastTime: me._formatTime((new Date().getTime()) / 1000),
              type: 'doorModal',
              getOneCard: this.handleSendCoupon,
              openOneCard: this.openOneCard,
              getRewardNow: this.getRewardNow,
              getSecAward: this.getSecAward
            }
          })
          if (options.needRegiste && options.needRegiste == 1) {
            me.handleSendCoupon()
            // 中奖领奖
          } else if (options.needRegiste && options.needRegiste == 2) {
            me.getSecAward()
          }
        }
      } else if (res.errcode == 201) {
        // 活动已结束
        this.setData({ ...this.data.modalList['activeEnd'] })
      } else if (res.errcode == 202){
        // 活动未开始
        this.setData({ ...this.data.modalList['activeBefore'] })
      } else {
        wx.showToast({
          title: res.errmsg||'网络错误',
          icon: 'none',
          mask: true,
        });

      }
    })
  },
  // 各弹窗类型
  _modalFormat() {
    this.setData({
      modalList: {
        activeBefore: {
          showReward: true,
          showModal: true,
          modalConfig: {
            type: 'activeBefore'
          }
        },
        activeEnd: {
          showReward: true,
          showModal: true,
          modalConfig: {
            type: 'activeEnd'
          }
        },
        doorModal: {
          showReward: true,
          showModal: true,
          modalConfig: {
            isShare: this.data.is_share,
            luckCount: this.data.luck_count,
            isJoin: this.data.is_join, // 是否参与活动
            isGetCoupon: this.data.is_get_coupon, // 是否领取礼包券
            inviteCount: this.data.invite_count, // 邀请好友数量
            isLuck: this.data.is_luck, // 今天是否抽过奖，
            lastTime: this.data.lastTime,
            type: 'doorModal',
            getOneCard: this.handleSendCoupon,
            openOneCard: this.openOneCard,
            getRewardNow: this.getRewardNow,
            getSecAward: this.getSecAward
          }
        },
        rulebox: {
          showReward: true,
          showModal: true,
          modalConfig: {
            isShare: this.data.is_share,
            luckCount: this.data.luck_count,
            isJoin: this.data.is_join, // 是否参与活动
            isGetCoupon: this.data.is_get_coupon, // 是否领取礼包券
            inviteCount: this.data.invite_count, // 邀请好友数量
            isLuck: this.data.is_luck, // 今天是否抽过奖，
            lastTime: this.data.lastTime,
            type: 'rulebox',
            hideAllModal: this.hideAllModal
          }
        },
        cardone: {
          showReward: true,
          showModal: true,
          modalConfig: {
            isShare: this.data.is_share,
            luckCount: this.data.luck_count,
            isJoin: this.data.is_join, // 是否参与活动
            isGetCoupon: this.data.is_get_coupon, // 是否领取礼包券
            inviteCount: this.data.invite_count, // 邀请好友数量
            isLuck: this.data.is_luck, // 今天是否抽过奖，
            lastTime: this.data.lastTime,
            type: 'cardone',
            getOneCard: this.handleSendCoupon,
            openOneCard: this.openOneCard
          }
        }
      }
    })
  }
});
