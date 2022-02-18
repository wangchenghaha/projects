import {splitGameImg} from '../../../../../utils/utils'
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    zhanweiView : Boolean,
    myIcon : String,
    otherIcon : String,
    friendName: String,
    adapter: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    helpBg: splitGameImg('help_bg_x_new.jpg', 'jumpGame0501'),
    goHome: splitGameImg('goHome.png', 'jumpGame0501'),
    sanjiao: splitGameImg('sanjiao-left.png', 'jumpGame0501'),
    help1: splitGameImg('help1.png', 'jumpGame0501'),
    brand: app.config.brand,
    zhanweiView : false,
    myIcon : '',
    otherIcon : ''
  },
  ready(){

    this.setData({
      zhanweiView : this.properties.zhanweiView,
      myIcon : this.properties.myIcon,
      otherIcon : this.properties.otherIcon,
      friendName: this.properties.friendName,
      adapter: this.properties.adapter,
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
    },
    // 规则
    guizeTap(){
      wx.navigateTo({
        url: '../ruleContent/ruleContent'
      })
  }
  }
})
