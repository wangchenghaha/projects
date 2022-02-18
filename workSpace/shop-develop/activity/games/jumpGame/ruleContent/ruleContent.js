const app = getApp()

const guize = [
  {
    title:"1.	活动时间：2021年4月25日 – 2021年5月10日 ",
    subTitles : [
      "核销时间： 2021年4月25日 – 2021年5月15日",
    ]
  },
  {
    title:"2.活动奖品：",
    subTitles : [
      "20元无门槛优惠券",
      "30元无门槛优惠券",
      "50元无门槛优惠券",
      "满500元-50元优惠券",
      "满1000元-100优惠券",
      "满1000元-188优惠券"
    ]
  },
  {
    title:"3.金币兑换数目：",
    subTitles : [
      "3000个金币可兑换30元无门槛优惠券与满500元-50元优惠券 ",
      "8000个金币可兑换满1000元-100元优惠券",
      "10000金币可兑换50元无门槛优惠券与满1000元-188元优惠券"
    ]
  },
  {
    title:"4.游戏方式：",
    subTitles : [
      "1.选择心仪的游戏角色进入游戏，通过左右滑动屏幕来控制角色移动，不断向上跳跃获得更高的游戏分数，在排行榜与好友一较高下吧～",
      "2.每人每天有3次游戏机会， 3次机会用完后，可以通过邀请好友助力获得额外的游戏次数。每邀请1人将额外获得1次机会。",
      "3.每局游戏还可获得金币奖励，金币可用于兑换优惠券等奖品。",
      "4.单优惠券每人在活动期间仅可以兑换1次。",
      "5.奖品数量有限，先到先得，具体以兑换界面数量为准。"
    ]
  },
  {
    title:"5.注意事项:",
    subTitles : [
      "1. "+ app.config.title +"是绫致时装(天津)有限公司旗下品牌，绫致时装(天津)有限公司及其关联公司(以下简称“绫致”)为本次活动的举办方。请中奖用户在活动期间准确填写信息，并保持手机畅通，若信息填写错误或未在规定时间内填写完成导致无法发放奖品，将视为用户自行弃奖。",
      "2.本次活动中，不同种类的奖品每人各仅限兑奖1次。",
      "3.奖品过期未兑奖或使用，将视为自动弃奖，不予补发。",
      "4.凡以不正当手段(包括但不限于作弊、刷奖、扰乱系统、实施网络攻击等)参与活动的用户，绫致有权在不事先通知的前提下撤销其活动资格并不予发放奖品或收回已发放的奖品。因此给绫致造成损失的，绫致有权向侵权者追究法律责任。",
      "5.为保证活动的真实性、公平性，绫致有权要求参与用户出示身份证明进行活动参与及获奖资格的核实。",
      "6.如您有其他活动相关疑问，请在工作时间内(周一至周五9:00-18:00，节假日除外)拨打活动电话：4008101 666，我们将竭诚为您解答。"
    ]
  },
  {
    title:"6.免责声明:",
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

const guizeFOL = [
  {
    title:"1.	活动时间：2021年4月29日 – 2021年5月5日  ",
    subTitles : [
      "优惠券使用时间： 2021年4月29日 – 2021年5月5日",
      "参加方式：点击官网首页浮窗进入游戏（首页入口按钮）/点击首页小游戏轮播/扫描活动宣传海报下方二维码"
    ]
  },
  {
    title:"2.游戏计分设置",
    subTitles : [
      "第一关，1个台阶=1分=1个金币",
      "第二关，1个台阶=2分=2个金币",
      "第三关，1个台阶=3分=3个金币",
      "第四关，1个台阶=4分=4个金币"
    ]
  },
  {
    title:"3.奖项设置",
    subTitles : [
      "800个金币兑换28-8优惠券（限量1000张） ",
      "1000个金币兑换15-10优惠券 （限量800张）",
      "3000个金币兑换399-39元优惠券（限量300张）",
      "5000个金币可兑换 459-50元优惠券（限量200张）",
      "*优惠券使用方式与注意事项请见券面说明。"
    ]
  },
  {
    title:"4.游戏规则:",
    subTitles : [
      "1.打开跳一跳小游戏，选择心仪游戏角色点击开始游戏，左右移动游戏角色并安全落在云朵上，一旦踩空游戏就结束了哦。每局游戏后分数清零，游戏中获得的金币累积，金币可以用来兑换惊喜优惠券。",
      "2.每名用户每天有3次游戏机会，3次机会用完后，可以邀请好友助力获得额外的游戏次数。每邀请1人将额外获得1次机会，每位好友活动期间仅可给同一人助力一次。每人每天可给他人助力2次。",
      "3.获得的金币可按页面要求兑换金额不等的优惠券，在活动期间各面值的优惠券每位参与者仅可兑换1次，每兑换一次所用金币数量会从用户总金币数中扣除，兑换不可撤销。",
      "4.优惠券数量有限，先到先得，获得的奖励可在“兑换记录”页面查看，实际金额以页面显示为准。优惠券使用规则与注意事项请以具体优惠券页面显示为准。",
      "5.）奖品数量有限，先到先得，具体以兑换界面数量为准。"
    ]
  },
  {
    title:"5.注意事项:",
    subTitles : [
      "1.本次活动中，不同种类的优惠券每人仅限兑奖1次。",
      "2.奖品过期未兑奖或使用，将视为自动弃奖，不予补发。",
      "3.凡以不正当手段(包括但不限于作弊、刷奖、扰乱系统、实施网络攻击等)参与活动的用户，绫致有权在不事先通知的前提下撤销其活动资格并不予发放奖品或收回已发放的奖品。因此给绫致造成损失的，绫致有权向侵权者追究法律责任。",
      "4.为保证活动的真实性、公平性，绫致有权要求参与用户出示身份证明进行活动参与及获奖资格的核实。",
      "5.如您有其他活动相关疑问，请在工作时间内(周一至周五9:00-18:00，节假日除外)拨打活动电话：4008101 666，我们将竭诚为您解答。"
    ]
  },
  {
    title:"6.免责声明:",
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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rules: guize
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      rules: app.config.brand === 'FOL' ? guizeFOL :  guize
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})