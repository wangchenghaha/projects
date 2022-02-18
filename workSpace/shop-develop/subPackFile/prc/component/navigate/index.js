Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    sbH: wx.getStorageSync('systemData').statusBarHeight,
    len: 0
  },

  ready() {
    this.setData({
      len: getCurrentPages().length
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateBack() {
      wx.navigateBack({
        delta: 1
      })
    }
  }
})
