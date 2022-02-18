// activity/redRain/components/help_fol/help_fol.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    zhanweiView : Boolean,
    userData : Object,
    imgPath : String,
    guize : Array,
    zhuli : Boolean,
    zhuliArr : Array,
    canAuthPhone : Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    zhanweiView : false,
    userData : {},
    imgPath : '',
    guize : [],
    zhuli : false,
    zhuliArr : [],
    canAuthPhone : false
  },
  ready(){
    this.setData({
      zhanweiView : this.properties.zhanweiView,
      userData : this.properties.userData,
      imgPath : this.properties.imgPath,
      guize : this.properties.guize,
      zhuli : this.properties.zhuli,
      zhuliArr : this.properties.zhuliArr,
      canAuthPhone : this.properties.canAuthPhone
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapss(e){
      let type = e.currentTarget.dataset.type
      this.triggerEvent('tapss',type)
    },
    closed(){this.triggerEvent('closed')},
    getPhoneNumber(e){
      let detail = e.detail
      this.triggerEvent('getPhoneNumber',detail)
    },
    goHome(){

      wx.switchTab({
        url: '/pages/index/index'
      })
      
    }
  }
})
