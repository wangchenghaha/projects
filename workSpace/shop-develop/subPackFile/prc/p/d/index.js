import Utils from '../../common/utils/index'
import config from '../../config/index'
import Service from '../../request/index'
import Poster from '../../component/qrcode/poster/poster'
import Pallte from './pallate'
import { getWeChatInfo, wxLogin } from '../../../../service/user'
import { KEYSTORAGE } from '../../../../src/const'

const app = getApp()
const brand = app.config.brand;

Page({
  data: {
    isBigPhone: Utils.judgeBigScreen(),
    qsIndex: -1,
    qrcode: {
      GFGZ: `${config.cdnUrl}/qrcode/GFGZ.png`,
      DPYQ: `${config.cdnUrl}/qrcode/DPYQ.png`,
      WEIB: `${config.cdnUrl}/qrcode/WEIB.png`,
      XXMD: `${config.cdnUrl}/qrcode/XXMD.png`,
      XHSH: `${config.cdnUrl}/qrcode/XHSH.png`,
      KSMD: `${config.cdnUrl}/qrcode/KSMD.png`,
      QTQD: `${config.cdnUrl}/qrcode/QTQD.png`,
    },
    unionid: wx.getStorageSync(KEYSTORAGE.unionid) || wx.getStorageSync(KEYSTORAGE.wxInfo) || '',
    posterConfig: {},
    qrcodex: '',
    info: {},
    options: {},
    showModal: false,
    animate: false,
    authorize: true
  },
  onLoad: function (options) {
    this._home()
    this.setData({
      qsIndex: wx.getStorageSync('frameBox')[0],
      options
    })
  },
  onShow: function () {

  },
  onShareAppMessage: function (e) {
    let { type } = e.target?e.target.dataset:{}
    if (type === 'click') {
      setTimeout(() => {
        this.getCoupon()
      }, 1000)
    } 
    if (type == 'custom') {
      this.closeModal()
    }
    return Utils.share()
  },
  _home() {
    let frame = wx.getStorageSync('frameBox')
    let BC = wx.getStorageSync('princessOtions').big_channel

    Service.home().then(res => {
      if (res.errcode == 0) {
        if (frame && BC) {
          this.setData({
            frame,
            qsIndex: frame[0],
            qrcodex: this.data.qrcode[BC],
            info: res.data,
          }, () => {
            this.createPoster()
          })
        } else {
          frame = res.data.data.select_ids
          BC = res.data.data.big_channel
          wx.setStorageSync('princessOtions', { "big_channel": res.data.data.big_channel, "small_channel": res.data.data.small_channel, "utm_term": res.data.data.term, "utm_campaign": res.data.data.campaign, "is_share": 1 });

          this.setData({
            frame,
            qsIndex: frame[0],
            qrcodex: this.data.qrcode[BC],
            info: res.data,
          }, () => {
            this.createPoster()
          })
        }
      }
    })
  },
  createPoster() {
    this.setData({
      posterConfig: new Pallte().palatte(this.data.qrcodex, this.data.qsIndex, this.data.isBigPhone),
    }, () => {
      Poster.create(true)
    })
  },
  // ??????????????????
  onPosterSuccess(e) {
    const { detail } = e;
    this.setData({
      posterCatch: detail
    })
  },
  onPosterFail(err) {
    console.error(err);
  },
  playAgain() {
    Utils.throttle(() => {
      wx.showLoading({
        title: '?????????',
        mask: true
      })
      wx.reLaunch({
        url: '/subPackFile/prc/p/b/index?playagain=true',
        success: (result) => {
          wx.hideLoading();
        },
      })
    }, 2000)
  },
  // ????????????
  downloadFile(tempFilePath) {
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success: function (res) {
        wx.showToast({
          title: '??????????????????',
          icon: 'success',
          duration: 2000,
          success: function () {}
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '????????????',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  handleSetting: function (e) {
    // console.log(e)
    this.closeModal()
    if (e.detail.authSetting['scope.writePhotosAlbum']) {
      this.setData({
        authorize: true
      })
      wx.showLoading({
        title: '???????????????...',
        mask: true,
      })
      this.saveImage()
    }
  },
  getSettings() {
    let that = this;
    wx.showLoading({
      title: '???????????????...',
      mask: true,
    })
    this.closeModal()
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() { //???????????????????????????????????????
              wx.showLoading({
                title: '???????????????...',
                mask: true,
              })
              that.saveImage()
            },
            fail() { //???????????????????????????????????????
              // console.log('????????????')
              wx.showToast({
                title: '????????????',
                icon: 'none',
                duration: 2000
              })
              that.setData({
                authorize: false
              })
            }
          })
        } else {
          wx.showLoading({
            title: '???????????????...',
            mask: true,
          })
          that.saveImage()
        }
      }
    })
  },
  saveImage() {
    const me = this
    let imgUrl = me.data.posterCatch
    // ????????????b???????????????
    me.downloadFile(imgUrl)
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
      wx.openCard({
        cardList: arr
      })
    }
  },
  // ????????????
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
          wx.setStorageSync('shakeCouoponHandler', 'getCoupon');
        }
      }
    })
  },
  // ????????????
  openMemberCard(key, _url, cardList) {
    /*?????????????????????????????? */
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
          appId: 'wxeb490c6f9b154ef9', // ???????????? appid???????????????
          extraData: _data, // ?????? encrypt_card_id, outer_str, biz????????????????????? step3 ?????????????????????????????????
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
  // ??????????????????
  getuserinfo(e) {
    const me = this
    if (e.detail.errMsg === 'getUserInfo:ok') {
      wx.showLoading({ title: '????????????...', mask: true });
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
            userinfo: res,
            unionid : res.unionId || ''
          }, () => {
            me.getCoupon()
          })
        })
      })
    }
  },
  stopmove() {
    return false
  },
  closeModal() {
    this.setData({
      animate: false
    }, () => {
      setTimeout(() => {
        this.setData({
          showModal: false
        }, 500)
      })
    })
  },
  showOther() {
    this.setData({
      showModal: true,
      
    }, () => {
      setTimeout(() => {
        this.setData({
          animate: true
        })
      }, 100)
    })
  }
})