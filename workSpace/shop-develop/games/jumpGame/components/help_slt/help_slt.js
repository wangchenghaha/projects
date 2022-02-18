// activity/jumpGame/components/help_jj/help_jj.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgPath : String,
    zhanweiView : Boolean,
    myIcon : String,
    otherIcon : String
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgPath : '',
    zhanweiView : false,
    myIcon : '',
    otherIcon : ''
  },
  ready(){

    this.setData({
      imgPath : this.properties.imgPath,
      zhanweiView : this.properties.zhanweiView,
      myIcon : this.properties.myIcon,
      otherIcon : this.properties.otherIcon
    })

  },

  /**
   * 组件的方法列表
   */
  methods: {
    tiaozhan(){
      this.triggerEvent('tiaozhan')
    },
    backTap(){
      this.triggerEvent('backTap')
    },
    goHome(){
      this.triggerEvent('goHome')
    }
  }
})
