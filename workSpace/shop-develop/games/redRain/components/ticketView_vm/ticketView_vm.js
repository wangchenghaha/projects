// activity/redRain/components/ticketView_fol/ticketView_fol.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    jinbi : Number,
    imgPath : String,
    yhqArrs : Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    jinbi : 0,
    imgPath : '',
    yhqArrs : []
  },
  ready(){
    this.setData({
      jinbi : this.properties.jinbi,
      imgPath : this.properties.imgPath,
      yhqArrs : this.properties.yhqArrs
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    jilu(){
      this.triggerEvent('jilu')
    },
    requestGetCoupon(e){

      let detail = e.currentTarget.dataset.detail
      this.triggerEvent('requestGetCoupon',detail)
    }
  }
})
