import Utils from '../../common/utils/index'
import { getWeChatInfo, wxLogin } from '../../../service/user'
import { KEYSTORAGE } from '../../../src/const'
import Service from '../../request/index'
const app = getApp()
const brand = app.config.brand;
Page({
  data: {
    isBigPhone: Utils.judgeBigScreen(),
    sbH: wx.getStorageSync('systemData').statusBarHeight,
    wh: wx.getStorageSync('systemData').windowHeight,
    selectBar: [{
      name: 1,
      select: false
    }, {
      name: 2,
      select: false
    }, {
      name: 3,
      select: false
    }, {
      name: 4,
      select: false
    }],
    userinfo: wx.getStorageSync(KEYSTORAGE.wxInfo) || {},

  },
  onLoad: function (options) {
    // wx.hideShareMenu()

  },
  onShow: function () {

  },
  selectThis(e) {
    let { index } = e.currentTarget.dataset
    let { selectBar } = this.data
    let arr = selectBar.filter(el => el.select).map(el => {
      return el.name
    })
    let _k = null
    if (arr.length == 2) {
      if (index < arr[0] - 1) {
        _k = selectBar.findIndex(el => el.name == arr[1])
        selectBar[_k].select = false
      }
      if ((index > arr[1] - 1) || (index > arr[0] - 1 && index < arr[1] - 1)) {
        _k = selectBar.findIndex(el => el.name == arr[0])
        selectBar[_k].select = false
      }
    }

    selectBar[index || 0].select = !selectBar[index || 0].select
    // console.log(selectBar)
    this.setData({
      selectBar
    })

  },
  // shouquans授权纤细
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
            me.createPoster()
          })
        })
      })


    }
  },
  // 清除选择
  clearAll() {
    let data = this.data.selectBar.map(el => {
      if (el.select) {
        el.select = false
      }
      return el
    })
    this.setData({
      selectBar: data
    })
  },
  // 开始生成海报
  createPoster() {
    let arr = this.data.selectBar.filter(el => el.select).map(el => {
      return el.name
    })

    if (arr.length < 2) {
      wx.showToast({
        title: '需要选两个烦恼哦',
        icon: 'none'
      })
      return
    }
    wx.setStorageSync('frameBox', arr);
    const op = wx.getStorageSync('crayonOtions')

    let params = {
      term: op.utm_term,
      campaign: op.utm_campaign,
      is_share: op.is_share,
      select_ids: arr,
      big_channel: op.big_channel,
      small_channel: op.small_channel
    }
    Service.join(params).then(res => {
      if (res.errcode == 0) {
        wx.redirectTo({
          url: `/crayongame/pages/poster/index`
        })
      }
    })

  },
  onShareAppMessage: function () {
    return Utils.share()
  },
})