// activity/redRain/components/ticketView_fol/ticketView_fol.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    jinbi : Number,
    imgPath : String,
    yhqArrs : Array,
    showTwoBounced : Boolean,
    showThreeBounced : Boolean,
    qrImgJson : Object,
    showGuize : Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    jinbi : 0,
    imgPath : '',
    yhqArrs : [],
    showTwoBounced : false,
    showThreeBounced : false,
    showGuize : false,
    qrImgJson : {},

    currentTapTitle : ''
  },
  ready(){
    this.setData({
      jinbi : this.properties.jinbi,
      imgPath : this.properties.imgPath,
      yhqArrs : this.properties.yhqArrs,
      showTwoBounced : this.properties.showTwoBounced,
      showThreeBounced : this.properties.showThreeBounced,
      qrImgJson : this.properties.qrImgJson,
      showGuize : this.properties.showGuize
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
      this.setData({currentTapTitle : detail.giftName})
      this.triggerEvent('requestGetCoupon',detail)
    },
    closed(e){
      let detail = e.currentTarget.dataset.type
      this.triggerEvent('closed',detail)
    },
    saveImg(){
      this.triggerEvent('saveImg')
    },
    guize(){
      this.triggerEvent('guize')
    },
    guizeClose(){
      this.triggerEvent('guizeClose')
    }
  }
})
