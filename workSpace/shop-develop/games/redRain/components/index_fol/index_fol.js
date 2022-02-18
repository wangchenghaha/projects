// activity/redRain/components/index_fol/index_fol.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgPath : String,
    zhanweiView : Boolean,
    userData : Object,
    guize : Array,
    friends : Array,
    isFiveNum : Boolean,
    canOpen : Boolean,
    baoxiangJson : Object,
    indexBgImage : String,
    canAuthPhone : Boolean,
    showOneBounced : Boolean,
    showTwoBounced : Boolean,
    showZhuanjinbi : Boolean,
    taskArrs : Array,
    jpListText : String
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgPath : '',
    zhanweiView : false,
    userData : {},
    guize : [],
    friends : [],
    isFiveNum : false,
    canOpen : false,
    baoxiangJson : {},
    indexBgImage : '',
    canAuthPhone : false,
    showOneBounced : false,
    showTwoBounced : false,
    showZhuanjinbi : false,
    taskArrs : [],
    jpListText : ''
  },

  ready(){
    this.setData({
      imgPath : this.properties.imgPath,
      zhanweiView : this.properties.zhanweiView,
      userData : this.properties.userData,
      guize : this.properties.guize,
      friends : this.properties.friends,
      isFiveNum : this.properties.isFiveNum,
      canOpen : this.properties.canOpen,
      baoxiangJson : this.properties.baoxiangJson,
      indexBgImage : this.properties.indexBgImage,
      canAuthPhone : this.properties.canAuthPhone,
      showOneBounced : this.properties.showOneBounced,
      showTwoBounced : this.properties.showTwoBounced,
      showZhuanjinbi : this.properties.showZhuanjinbi,
      taskArrs : this.properties.taskArrs,
      jpListText : this.properties.jpListText
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    startGame(){
      this.triggerEvent('startGame')
    },
    duihuan(){this.triggerEvent('duihuan')},
    openTap(){this.triggerEvent('openTap')},
    closed(){this.triggerEvent('closed')},
    oneClosed(){this.triggerEvent('oneClosed')},
    backTap(){this.triggerEvent('backTap')},
    getPhoneNumber(e){
      let detail = e.detail
      this.triggerEvent('getPhoneNumber',detail)
    },
    zhuanjinbi(){
      this.triggerEvent('zhuanjinbi')
    },
    closedZhuanjinbi(){
      this.triggerEvent('closedZhuanjinbi')
    },
    goFinish(e){
      let detail = e.currentTarget.dataset.detail
      this.triggerEvent('goFinish',detail)
    },
    goHome(){

      wx.switchTab({
        url: '/pages/index/index'
      })
      
    }
  }
})
