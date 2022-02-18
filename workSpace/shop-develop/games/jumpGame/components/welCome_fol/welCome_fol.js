// activity/jumpGame/components/welCome_jj/welCome_jj.js
const guize = [
  {
    title:"1.活动时间：2020年9月28日-2020年10月8日",
    subTitles : []
  },
  {
    title:"2.游戏方式：",
    subTitles : [
      "在游戏首页选择自己喜欢的人物后，点击开始游戏即可进入游戏。",
      "控制小人每次跳起后，左右移动并安全落在云朵上，一旦踩空游戏就结束了哦。",
      "每人每天有3次游戏机会，3次机会用完后，可以通过邀请好友助力获得额外的游戏次数。每邀请1人将额外获得1次机会，每位好友活动期间仅可给同一人助力一次;每次发送助力邀请，好友都会收到一个邀请助力的页面，集齐7张不同助力页面截图，组成小作文，有机会兑换神秘礼券一份。",
      "每局游戏后分数清零，游戏中获得的金币累积，金币可以用来兑换不同额度的优惠券。",
      "排行榜将以游戏历史数据最高得分进行排名，如果想要榜上有名，那就控制你的小人，努力向上跳吧！",
      "金币可兑换的奖品数量有限，先到先得，具体以兑换界面数量为准。"
    ]
  },
  {
    title:"3.玩法指导：",
    subTitles : [
      "攒币狂人：勤能补拙，积攒每局游戏获得的金币，再用金币兑换想要的福利券吧！",
      "荣耀王者：挑战极限，在一局游戏中层层通关，尽量获得更高的分数，排行榜奖励等你来拿！",
      "社交达人：多多转发，邀请好友玩，好友会收到不同的邀请界面，活动期间集齐7个不同的邀请界面，组成小作文，截图发送客服或官方群管理员，有机会获得神秘礼券！"
    ]
  },
  {
    title:"4.注意事项：",
    subTitles : [
      "本次活动中，不同种类优惠券每个用户ID限兑换3张。",
      "奖品到期未兑奖或使用，将视为自动弃奖，不予补发。",
      "前200位集齐7张不同文案助力界面截图玩家，可发送给绫致时装折扣店官网在线客服或私信发给BESTSELLER折扣店官方顾客群群管理员，群管理员审核后，奖励会在1-2个工作日内到账，具体内容详询在线客服。",
      "凡以不正当手段（包括但不限于作弊、刷奖，扰乱系统、实施网络攻击等）参与活动的用户，绫致有权在不事先通知的前提下撤销其活动资格并不予发放奖品或回收已发放的奖品。因此给绫致造成损失的，绫致有权向侵权者追究法律责任"
    ]
  }
  
]
const paihangGuize = [
  {
    title:"1.结算时间：2020年10月8日23：59：59。",
    subTitles : []
  },
  {
    title:"2.每局游戏结束后得分清零不进行累积，排行榜以游戏历史数据最高得分进行排名，排行榜前十名玩家可获得我们为您准备的排行榜奖励。",
    subTitles : []
  },
  {
    title:"3.排行榜奖励发放时间：活动结束后7个工作日内发放完毕，会以短信通知发放信息。奖励有效期至2020年10月29日，获奖者到期未使用，视为放弃奖励，不予补发。",
    subTitles : []
  },
  {
    title:"第一名: 104-99元优惠券1张",
    subTitles : []
  },
  {
    title:"第二名: 93-88元优惠券1张",
    subTitles : []
  },
  {
    title:"第三名: 71-66元优惠券1张",
    subTitles : []
  },
  {
    title:"第四名: 55-50元优惠券1张",
    subTitles : []
  },
  {
    title:"第五名: 55-50元优惠券1张",
    subTitles : []
  },
  {
    title:"第六名: 35-30元优惠券1张",
    subTitles : []
  },
  {
    title:"第七名: 35-30元优惠券1张",
    subTitles : []
  },
  {
    title:"第八名: 35-30元优惠券1张",
    subTitles : []
  },
  {
    title:"第九名: 精美袜子商品券1张",
    subTitles : []
  },
  {
    title:"第十名: 精美腰带商品券1张",
    subTitles : []
  }
  
]
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgPath : String,
    autoPlay : Boolean,
    renwuArrs : Array,
    userData : Object,
    paihangSelect : Object,
    ticketSelect : Object,
    zhanweiView : Boolean,
    noGameCount : Boolean,
    brand : String
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgPath : '',
    autoPlay : false,
    renwuArrs : [],
    guize,
    paihangGuize,
    userData : {},
    paihangSelect : {},
    ticketSelect : {},
    zhanweiView : false,
    noGameCount : false,
    brand : ''
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
      brand : this.properties.brand
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
        
        wx.pageScrollTo({
            scrollTop: wx.getSystemInfoSync().windowHeight,
            duration: 300
        });

    }
  }
})
