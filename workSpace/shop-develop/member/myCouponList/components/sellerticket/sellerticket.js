/**
 * 商家券组件
 * 
 * create by ant.liu
 */

Component({
  options: {
    multipleSlots: true
  },
  properties: {
    renderDetail: {
      type: Object,
      value: {
        isAddCard: 1, // 是否已经领取到卡包
        couponDetail: {}, // 商家券数据
        cardList: [], // openCard数据
      },
    }
  },
  data: {},
  pageLifetimes: {},
  attached() { },
  methods: {
    addCardHandle(e) {
      console.log(e, '========addCardHandle======')
      let { errcode, msg, send_coupon_result } = e.detail
      if (errcode == 'OK') {
        // 备注：send_coupon_result: [{ code: "SUCCESS", coupon_code: "1211575927001354623152", message: "发券成功", out_request_no: "2PD5fce0387b3c50", stock_id: "1270860000000001", }]
        let { code, coupon_code, message, out_request_no, stock_id, } = send_coupon_result[0]
        if (code == 'SUCCESS') {
          setTimeout(() => {
            this.triggerEvent('addCard', send_coupon_result)
          }, 10)
          return
        }
        wx.showModal({
          content: message,
        })
      } else {
        wx.showModal({
          content: message,
        })
      }
    },
    openCardHandle() {
      wx.openCard({
        cardList: this.data.renderDetail.cardList
      })
    },
  }
})
