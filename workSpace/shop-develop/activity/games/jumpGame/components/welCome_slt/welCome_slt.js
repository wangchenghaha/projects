import {splitGameImg} from '../../../../../utils/utils'
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    autoPlay : Boolean,
    userData : Object,
    paihangSelect : Object,
    ticketSelect : Object,
    zhanweiView : Boolean,
    noGameCount : Boolean,
    isNew: Boolean,
    adapter: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    mainBackground : splitGameImg('2021_51_main_background.jpg','jumpGame0501'),
    mainLogo: splitGameImg('2021_51_main_logo.png','jumpGame0501'),
    mainRank: splitGameImg('2021_51_main_rank.png','jumpGame0501'),
    mainGoods: splitGameImg('2021_51_main_goods.png','jumpGame0501'),
    newCouponBg: splitGameImg('new_coupon.png','jumpGame0501'),
    couponImage: "",
    goHome: splitGameImg('goHome.png','jumpGame0501'),
    ticket: splitGameImg('ticket.png','jumpGame0501'),
    paihangbang:  splitGameImg('rank_bg.png','jumpGame0501'),
    rankMe: splitGameImg('phb_wo.png','jumpGame0501'), 
    ticketImg: splitGameImg('ticketImg.png','jumpGame0501'), 
    jinbi: splitGameImg('jinbi.png','jumpGame0501'), 
    sanjiao: splitGameImg('sanjiao-left.png','jumpGame0501'), 
    closed:  splitGameImg('closed.png','jumpGame0501'), 
    bounced: splitGameImg('jumpGame_bounced.png','jumpGame0501'), 

    autoPlay : false,
    renwuArrs : [ {
      name: '工地劳力士',
      path :  splitGameImg('2021_51_man.png','jumpGame0501'),
      pathS : splitGameImg('2021_51_man.png','jumpGame0501'),
      isSelect : true
    },
    {
      name: '职场小白',
      path :  splitGameImg('2021_51_woman.png','jumpGame0501'),
      pathS : splitGameImg('2021_51_woman.png','jumpGame0501'),
      isSelect : false
    }],
    userData : {},
    paihangSelect : {},
    ticketSelect : {},
    zhanweiView : false,
    noGameCount : false,
    renwuName: '',
    renwuImg: ''
  },
  ready(){
    this.setData({
      adapter: this.properties.adapter,
      autoPlay : this.properties.autoPlay,
      userData : this.properties.userData,
      paihangSelect : this.properties.paihangSelect,
      ticketSelect : this.properties.ticketSelect,
      zhanweiView : this.properties.zhanweiView,
      noGameCount : this.properties.noGameCount,
      isNew: this.properties.isNew,
      renwuName: this.data.renwuArrs[0].name,
      renwuImg:  this.data.renwuArrs[0].path,
      couponImage: app.config.brand === 'FOL' ? splitGameImg('coupon_5_toast.png','jumpGame0501') : splitGameImg('coupon_20_toast.png','jumpGame0501')
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
    play(e){
      let renwu = e.currentTarget.dataset.renwu;
      this.triggerEvent('play', renwu)
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
      let {renwuName, renwuImg, renwuArrs} = this.data;
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
        renwuImg,
        renwuArrs
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
