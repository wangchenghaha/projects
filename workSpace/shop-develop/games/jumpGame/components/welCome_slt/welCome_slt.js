import {splitGameImg} from '../../../../utils/utils'
let  renwuArrs = [
  {
    name: '工地劳力士',
    path :  splitGameImg('2021_51_man.png','jumpGames'),
    pathS : splitGameImg('2021_51_man.png','jumpGames'),
    isSelect : true
  },
  {
    name: '职场小萌新',
    path :  splitGameImg('2021_51_woman.png','jumpGames'),
    pathS : splitGameImg('2021_51_woman.png','jumpGames'),
    isSelect : false
  }
]

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgPath : String,
    autoPlay : Boolean,
    userData : Object,
    paihangSelect : Object,
    ticketSelect : Object,
    zhanweiView : Boolean,
    noGameCount : Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    mainBackground : splitGameImg('2021_51_main_background.jpg','jumpGames'),
    mainLogo: splitGameImg('2021_51_main_logo.png','jumpGames'),
    mainRank: splitGameImg('2021_51_main_rank.png','jumpGames'),
    mainGoods: splitGameImg('2021_51_main_goods.png','jumpGames'),
    autoPlay : false,
    renwuArrs : [],
    userData : {},
    paihangSelect : {},
    ticketSelect : {},
    zhanweiView : false,
    noGameCount : false,
    renwuName: '',
    renwuImg: '',
  },
  ready(){
    this.setData({
      imgPath : this.properties.imgPath,
      autoPlay : this.properties.autoPlay,
      renwuArrs : this.properties.renwuArrs,
      userData : this.properties.userData,
      paihangSelect : this.properties.paihangSelect,
      ticketSelect : this.properties.ticketSelect,
      zhanweiView : this.properties.zhanweiView,
      noGameCount : this.properties.noGameCount,
      renwuName: renwuArrs[0].name,
      renwuImg: renwuArrs[0].path,
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    renwuTap(e){
      let id = e.currentTarget.id
      this.triggerEvent('renwuTap',id)
    },
    btn(e){
      let type = e.currentTarget.dataset.type
      this.triggerEvent('btn',type)
    },
    play(){
      this.triggerEvent('play')
    },
    paihangTap(e){
      let type = e.currentTarget.dataset.type
      this.triggerEvent('paihangTap',type)
    },
    duihuan(e){
      let detail = e.currentTarget.dataset.detail
      this.triggerEvent('duihuan',detail)
    },
    closed(){
      this.triggerEvent('closed')
    },
    chooseRenwu(){
      let {renwuName, renwuImg} = this.data;
      if(renwuArrs[0].isSelect){
        renwuName = renwuArrs[1].name
        renwuImg = renwuArrs[1].path
        renwuArrs[0].isSelect = false
        renwuArrs[1].isSelect = true
      } else {
        renwuName = renwuArrs[0].name
        renwuImg = renwuArrs[0].path
        renwuArrs[1].isSelect = false
        renwuArrs[0].isSelect = true
      }
      this.setData({
        renwuName,
        renwuImg
      })
    },
    backTap(){
      this.triggerEvent('backTap')
    },
    goHome(){

      wx.switchTab({
        url: '/pages/index/index'
      })
      
    },
    // 规则
    guizeTap(){
        wx.navigateTo({
          url: '../ruleContent/ruleContent'
        })
    }
  }
})
