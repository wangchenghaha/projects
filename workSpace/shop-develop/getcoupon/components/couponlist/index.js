/**
 * 券包弹出框
 */

Component({
  properties: {
    options : {
      type: Object,
      default: {
        isshow: false,
        couponlist : []
      }
    }
  },
  data: {
  },
  attached() {
  },
  methods: {
      closemodel() {
          console.log(123)
          this.triggerEvent('hidemodel')
      }
  }
})