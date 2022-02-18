// activity/jumpGame/components/welCome_jj/welCome_jj.js
const guize = [
  {
    title:"1.活动时间：2020年9月21日 – 2020年11月30日 ",
    subTitles : [
      "核销时间：2020年9月21日 – 2020年12月31日"
    ]
  },
  {
    title:"2.参与方式：",
    subTitles : [
      "1.进入JACK&JONES微信号：Jack_Jones_China对话框输入关键词“ CITY FUN CLUB ”，点击弹出信息即可进入游戏。",
      "2.进入JACK&JONES小程序，点击CITY FUN CLUB跳一跳轮播焦点图即可参与游戏。",
      "3.进入JACK&JONES 微信号：Jack_Jones_China，点击菜单栏“CITY FUN CLUB”"
    ]
  },
  {
    title:"3.游戏方式：",
    subTitles : [
      "1.打开跳一跳小游戏，选择心仪游戏角色，点击开始游戏，即可有机会获得精美礼品。",
      "2.每人每天有3次游戏机会，3次机会用完后，可以通过邀请好友助力获得额外的游戏次数。每邀请1人将额外获得1次机会。",
      "3.获得的金币可按页面要求兑换金额不等的 无门槛优惠券和精美礼品。",
      "4.每人在活动期间仅可以兑换1次优惠券或赠品。",
      "5.奖品数量有限，先到先得",
    ]
  },
  {
    title:"4.注意事项:",
    subTitles : [
      "1.JACK&JONES 是绫致时装(天津)有限公司旗下品牌，绫致时装(天津)有限公司及其关联公司(以下简称“绫致”)为本次活动的举办方。请中奖用户在活动期间准确填写信息，并保持手机畅通，若信息填写错误或未在规定时间内填写完成导致无法发放奖品，将视为用户自行弃奖。",
      "2.本次活动中，不同种类的奖品每人各仅限兑奖1次。",
      "3.奖品过期未兑奖或使用，将视为自动弃奖，不予补发。",
      "4.凡以不正当手段(包括但不限于作弊、刷奖、扰乱系统、实施网络攻击等)参与活动的用户，绫致有权在不事先通知的前提下撤销其活动资格并不予发放奖品或收回已发放的奖品。因此给绫致造成损失的，绫致有权向侵权者追究法律责任",
      "5.为保证活动的真实性、公平性，绫致有权要求参与用户出示身份证明进行活动参与及获奖资格的核实。",
      "6.如您有其他活动相关疑问，请在工作时间内(周一至周五9:00-18:00，节假日除外)拨打活动电话：400-862-8888，我们将竭诚为您解答。",
    ]
  },
  {
    title:"5.免责声明:",
    subTitles : [
      "1.鉴于互联网之特殊性质，活动期间若发生黑客攻击、电信部门]技术调整导致重大影响、病毒侵袭、网络故障、微信平台、宽带、域名解析故障或其他网络设备或技术提供商的服务延迟、服务障碍或任何其他类似事件，致使活动无法正常进行，在法律法规允许的范围内绫致不对活动暂停或终止给参与者造成的损失进行额外赔偿或补偿。",
      "2.活动中如因系统维护或升级将暂停服务，绫致将提前发布公告通知。暂停服务期间给用户造成的- -切不便与损失,在法律法规允许的范围内绫致均得免得免责。",
      "3.活动奖品的领取将以用户填写的信息为准。若出现填写错误、冒领等情况,由用户自行承担相关责任，在法律允许的范围内绫致不对用户的损失进行额外赔偿或补偿。",
      "4.由于参与用户自身参与活动方式不当或不正确而导致不能参与活动，在法律法规允许的范围内绫致不承担责任。",
      "5.凡以任何方式参加本次活动的，视为自愿接受本免责声明的约束。",
      "6.本声明未涉及的问题参见国家有关法律法规.当本声明与国家法律法规冲突时，以国家法律法规为准。",
      "7.本活动在法律允许范围内由绫致解释。"
    ]
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
    noGameCount : Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgPath : '',
    autoPlay : false,
    renwuArrs : [],
    guize,
    userData : {},
    paihangSelect : {},
    ticketSelect : {},
    zhanweiView : false,
    noGameCount : false
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
      noGameCount : this.properties.noGameCount
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
      
    }
  }
})
