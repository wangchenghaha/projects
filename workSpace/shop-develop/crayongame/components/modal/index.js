
import Utils from '../../common/utils/index'
Component({
  properties: { 
    modalconfig: {
      type: Object,
      value: {}
    },
    showModal:{
      type: Boolean,
      value: false,
    }
  },
  observers: {
    showModal: function(val) {
      if (val) {
        setTimeout(() => {
          this.setData({
            animate: true
          })
        }, 200)
      }
    }
  },

  data: {
    animate: false
  },

  methods: {
    getcard() {
      Utils.throttle(() => {
        if (this.data.modalconfig.handleCoupon) {
          this.data.modalconfig.handleCoupon()
        }
      },1000)()
    },
    stop() {
      return false
    },
    close() {
      this.setData({
        animate: false
      }, () => {
        setTimeout(() => {
          this.triggerEvent('close')
        }, 450)
      })
    }
  }
})
