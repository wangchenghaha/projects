// dailyCheckIn/points.js
import {
  queryCheckInRecord, getBonusName
} from '../dailycheckin'
import { splitImg, formatDate, isArrayEmpty, throttle } from '../../utils/utils'
let app = getApp()
const cdn = app.config.cdn
const brand = app.config.brand
Page({

  bean: { title: "连续签到10天奖励", date: "2020-06-30 08:00:00", value: "100" },
  /**
   * 页面的初始数据
   */
  data: {
    tabTitles: ['全部'
      // , '获取'
      // , '使用'
    ],

    allRecordList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { userid } = options
    queryCheckInRecord({ userid: userid, brand: brand })
      .then(list => {
        if (!isArrayEmpty(list)) {
          list.forEach(item => {
            item.unit = "绫米  +"
            switch (item.signStatus) {
              case 0:
                item.titleStr = "签到记录"
                break;
              case 1:
                item.titleStr = "补签记录"
                break;
              case 3:
                item.titleStr = "任务奖励"
                if (item.points == 0) {
                  item.unit = "优惠券  x"
                  item.points = "1"
                }
                //  else {
                //   item.unit = "补签卡  x"
                //   item.points = "1"
                // }
                break;
            }
          })
          this.setData({ allRecordList: list })
        }
      })
      .catch(e => {
        console.log(e)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  _onTabChange(event) {
    return
    wx.showToast({
      title: `切换到标签 ${event.detail.index + 1}`,
      icon: 'none'
    });
  },

  onBtClick: function (ev) {
    wx.navigateTo({
      url: '/member/rewardCenter/rcMain/rcMain',
    });
  }

})