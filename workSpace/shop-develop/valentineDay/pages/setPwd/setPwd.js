// valentineDay/pages/setPwd/setPwd.js
import mainService from '../../../base/main.js';
import Utils from '../../services/util'
import Fetch from '../../services/fetch'
import Urls from '../../services/url'
import pathModel from '../../models/path.model';
import dataModel from '../../models/dataInfo.model';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    isBigPhone: Utils.isBigPhone()

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info('dataModel',dataModel)
    if (dataModel.data) {
      let data =dataModel.data
      this.setData({
        comData: data
      })
    }
    if (options.heartSelect) {
      this.setData({
        heartSelect: options.heartSelect
      })
    }
    if (options.heartId) {
      this.setData({
        heartId: options.heartId
      })
    }
    if (options.soundUrl) {
      this.setData({
        soundUrl: options.soundUrl
      })
    }
  },

  name(e) {
    this.setData({
      name: e.detail.value
    })
  },
  anhao(e) {
    this.setData({
      anhao: e.detail.value
    })
  },
  anhaoAgain(e) {
    console.info(e)

    this.setData({
      anhaoAgain: e.detail.value
    })

  },
  close() {
    wx.navigateBack();
  },
  swiper2Change(e) {
    console.info(e)
    this.setData({
      current: e.detail.current
    })
    console.info('this.properties.comData', this.properties.comData.valentine.blessings[this.data.current].blessing_text)
  },
  sendShare() {
    console.info('123222', this.data.anhao, this.data.anhaoAgain)
    if (!this.data.name) {
      wx.showToast({
        title: '请输入对方爱称~',
        icon:'none'
      })
      return
    }
    if (this.data.anhao == this.data.anhaoAgain && this.data.anhao && this.data.anhaoAgain) {
      console.info('相同')
      Fetch({
        url: Urls.love_updateRecord,
        loading: true,
        method: 'POST',
        data: {
          sound_url: this.data.soundUrl,
          ac_id: wx.getStorageSync('ac_id'),
          user_id: this.data.comData.user_id,
          password: this.data.anhao,
          blessing_id: this.properties.comData.valentine.blessings[this.data.current].id,
          heart_card_id: this.properties.heartId,
          friend_name: this.data.name
        }
      }).then(res => {
        let { errcode, data } = res
        if (errcode == 0) {
          wx.navigateTo({
            url: `${pathModel.vd_share}?name=${this.data.name}&soundUrl=${this.data.soundUrl}&heartSelect=${this.data.heartSelect}&soundUrl=${this.data.soundUrl}&blessingText=${this.data.comData.valentine.blessings[this.data.current].blessing_text}&soundId=${data.sound_id}`,
          })
        }
      })
    } else {
      wx.showToast({
        title: '两次密码不相同~',
        icon:'none'
      })

    }
    // return

  },
  soundUrl(e) {
    console.info('设置密码页', e)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.comData.valentine.share_title,
      path:`${pathModel.vd_index}?ac_id=${wx.getStorageSync('ac_id')}&ch_id=${wx.getStorageSync('ch_id')}`,
      imageUrl: this.data.comData.valentine.card_img, 
    }
  }
})