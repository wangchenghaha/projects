// pages/userDaogou/daogouLearn/daogouLearn.js
import {KEYSTORAGE} from "../../src/const";

const { URL_CDN } = require('../../src/const.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ulData: [
      {
        img: URL_CDN.WSZT_CARD_BG01,
        desc:'guideLogin',
        gioName: 'pageclick_share_wszt_sharesa'
      },
      {
        img: URL_CDN.WSZT_CARD_BG02,
        desc: 'shareOption',
        gioName: 'pageclick_share_wszt_op'
      },
      {
        img: URL_CDN.WSZT_CARD_BG03,
        desc: 'queryAchievement',
        gioName: 'pageclick_share_wszt_perf'
      },
      {
        img: URL_CDN.WSZT_CARD_BG04,
        desc: 'question',
        gioName: 'pageclick_share_wszt_qa'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  toNextPage: function (e) {
    let {desc, index} = e.currentTarget.dataset;
    try {
      app.tdSdkEvent(`pageclick_instruction_vedio${index+1}`, {
        GUIDE_DAID:wx.getStorageSync(KEYSTORAGE.guideInfo).employeeId || ''
      });
      app.gioTrack(this.data.ulData[index].gioName)
    }catch (e) {

    }
    wx.navigateTo({
      url: desc === 'shareOption' ? '/weMall/weMallOperation/weMallOperation' :`/weMall/daogouVideo/daogouVideo?videoName=${desc}`,
    })
  }

})
