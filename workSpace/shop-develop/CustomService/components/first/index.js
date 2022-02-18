// CustomService/components/first/index.js
Component({
  properties: {
    title: {
      type: String
    },
    img: {
      type: String
    }
  },

  data: {
    showModal: false
  },

  methods: {
    stop() {
      return false
    },
    hidemodal() {
      this.setData({
        showModal: false
      })
    },
    activeRunning() {
      // this.setData({
      //   showModal: true
      // })
      wx.navigateTo({
        url: '/CustomService/form/index'
      })
    }
  }
})
