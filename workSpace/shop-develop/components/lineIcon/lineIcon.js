// components/lineIcon/lineIcon.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    color: String,
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    onclick(){
      app.gioTrack('pageclick_home_categoryall')
      wx.navigateTo({
        url: '/pages/search/search'
      })
    }
  }
})
