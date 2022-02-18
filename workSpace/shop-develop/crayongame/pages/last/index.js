import utils from '../../common/utils/index'
import Service from '../../request/index'
import Poster from '../../components/qrcode/poster/poster'
import Pallte from '../result/palatte'
import config from '../../config/index'
import { KEYSTORAGE } from '../../../src/const'

Page({
  data: {
    isBigPhone: utils.judgeBigScreen(),
    info: {},
    images: {
      view: {
        view1_2: `${config.cdnUrl}/view1-2.png`,
        view1_3: `${config.cdnUrl}/view1-3.png`,
        view1_4: `${config.cdnUrl}/view1-4.png`,
        view2_4: `${config.cdnUrl}/view2-4.png`,
        view2_3: `${config.cdnUrl}/view2-3.png`,
        view3_4: `${config.cdnUrl}/view3-4.png`,
      },
      poster: {
        poster1_2: `${config.cdnUrl}/poster1-2.png`,
        poster1_3: `${config.cdnUrl}/poster1-3.png`,
        poster1_4: `${config.cdnUrl}/poster1-4.png`,
        poster2_4: `${config.cdnUrl}/poster2-4.png`,
        poster2_3: `${config.cdnUrl}/poster2-3.png`,
        poster3_4: `${config.cdnUrl}/poster3-4.png`,
      },
      qrcode: {
        GWBR: `${config.cdnUrl}/qrcode/GWBR.png`,
        LPYQ: `${config.cdnUrl}/qrcode/LPYQ.png`,
        WEIB: `${config.cdnUrl}/qrcode/WEIB.png`,
        WXGZ: `${config.cdnUrl}/qrcode/WXGZ.png`,
        XHS1: `${config.cdnUrl}/qrcode/XHS1.png`,
        XHS2: `${config.cdnUrl}/qrcode/XHS2.png`,
        XXMD: `${config.cdnUrl}/qrcode/XXMD.png`,
        ZRLL: `${config.cdnUrl}/qrcode/ZRLL.png`,
        DPYQ: `${config.cdnUrl}/qrcode/DPYQ.png`,
      }
    },
    showImage: false,
    qrcode: '',
    poster: ''
  },
  onLoad: function (options) {
    // wx.hideShareMenu()
    this._home()
  },
  // 获取首页数据
  _home() {
    let frame = wx.getStorageSync('frameBox')
    let BC = wx.getStorageSync('crayonOtions').big_channel

    Service.home().then(res => {
      if (res.errcode == 0) {
        if (frame && BC) {
          this.setData({
            frame,
            poster: this.data.images.poster['poster' + frame[0] + '_' + frame[1]],
            qrcode: this.data.images.qrcode[BC],
            info: res.data
          }, () => {
            this.createPoster()
          })
        } else {
          frame = res.data.data.select_ids
          BC = res.data.data.big_channel
          wx.setStorageSync('crayonOtions', { "big_channel": res.data.data.big_channel, "small_channel": res.data.data.small_channel, "utm_term": res.data.data.term, "utm_campaign": res.data.data.campaign, "is_share": 1 });

          this.setData({
            frame,
            poster: this.data.images.poster['poster' + frame[0] + '_' + frame[1]],
            qrcode: this.data.images.qrcode[BC],
            info: res.data
          }, () => {
            this.createPoster()
          })
        }
      }
    })
  },
  // 生成海报
  createPoster() {
    this.setData({
      posterConfig: new Pallte().palatte(this.data.qrcode, this.data.poster, wx.getStorageSync(KEYSTORAGE.wxInfo).nickName),
    }, () => {
      Poster.create(true)
    })
  },
  // 海报下载部分
  onPosterSuccess(e) {
    const { detail } = e;
    this.setData({
      posterCatch: detail
    })
  },
  onPosterFail(err) {
    console.error(err);
  },
  hideModal() {
    this.setData({
      showImage: false
    })
  },
  openCard() {
    let { data: { card_data } } = this.data.info
    if (card_data && card_data.length) {
      let arr = card_data.map(el => {
        return {
          cardId: el.card_id,
          code: el.code
        }
      })
      console.log(arr)
      wx.openCard({
        cardList: arr
      })
    }
  },
  // 立即领取
  getCoupon() {
    const me = this
    Service.sendCoupon().then(res => {
      if (res.errcode == 0) {
        let { is_get_coupon, cardList, is_get_card, is_member, activatemembercard_url, id } = res.data
        if (is_member == 1 && is_get_card) {
          wx.addCard({
            cardList: cardList,
            success: () => {
              Service.toggleCoupon({ id }).then(resp => {
                if (resp.errcode == 0) {
                  me._home()
                }
              })
            }
          })
        } else {
          this.openMemberCard('isLogin', activatemembercard_url)
          wx.setStorageSync('shakeCouoponHandler', 'handleSendCoupon');
        }
      }
    })
  },
  // 重新玩游戏
  reback() {
    this.setData({
      showImage: true
    })
  },
  // 开卡流程
  openMemberCard(key, _url, cardList) {
    /*没有领过卡正常走开卡 */
    const that = this
    const _data = {
      encrypt_card_id: utils.GetQueryString(_url, 'encrypt_card_id'),
      biz: utils.GetQueryString(_url, 'biz').split('#')[0],
      outer_str: utils.GetQueryString(_url, 'outer_str'),
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
  onShareAppMessage: function () {
    return utils.share()
  },
})