//金林德伯格配置
import {DEV} from './main'
const domain = 'https://minijl.bestseller.com.cn';  // 正式地址
const domain_test = 'http://minijl.vm.cn'; // 测试地址
module.exports = {

  //埋点相关配置
  td:{
    appkey: '-', //app 密匙
    getUserInfo: false, // 默认不获取用户信息
    getLocation: false, // 默认不获取用户位置
    autoOnPullDownRefresh: true, // 默认不统计下拉刷新数据
    autoOnReachBottom: true // 默认不统计页面触底数据
  },
  // TDNew 埋点
  tdNew: {
    appkey: '99D7A679E10D4CF7AAF8E8E99C209147',
  },
  //app id
  wxAppid: 'wx62f300519c55c400',
  //判断转盘次数显示隐藏
  isTurntableNum: true,

  // 微信上报APPid
  // wxReportAppid: 'bi3467ca28c24341bc',
  // 微信上报Secret
  wxReportAppSecret: '440748549fa744c3a6191204ca070b23',

  //爱show appid
  aiShowAppid: 'wx3868a9e789c88647',

  //app 名字
  appName: 'JLINDEBERG',

  //API主机地址
  domain: DEV ? domain_test : domain,
  // 测试地址
  // domain:'http://minijl.vm.cn',
  //老H5主机地址
  domain_h5: 'https://m.jlindeberg.com.cn',
  //标题行名字
  title:"JLINDEBERG",
  //微信公众号名称
  publicName:'JLINDEBERG金林德伯格',

  refundAddress : '地址：上海市松江区石湖荡镇双金公路8号202办公室 收,  公司名称：金林德伯格（天津）有限公司, 收件人：张翠花, 电话： 021-37015920, 邮编：201617',
  refundAddressDetail:`上海市松江区石湖荡镇双金公路8号202办公室`,
  memberLoopID:[ ],
  singleBrand: true,  // 和单品牌不一样
  saveImgGif: false,  // 保存图片出现gif
  // 折扣商品是否使用优惠券
  discountGoodsUseVoucher: true,
  // 分享集赞
  shareZan: true,
  // 使用优惠券
  useVoucher: true,
  paySuccessActivity: true,
  // 客服
  CUSTOMER_WX_NAME: 'JLINDEBERG-VIP1',
  // 是否显示用户协议
  showUserServer: true,
  // 是否打开容联在线客服
  onlineServiceEnabled:false,
  // 是否到店自提，到店退货
  isStoreOption: true,
  // 导购微信号
  guideWXNums: 'JLINDEBERG-VIP1',
   // 是否显示收藏夹
   isCollection: true,
  // wemember Appid
  WE_MEMBER_APP_ID: 'wx38198fc9409093f3',
  // 是否显示活动标记
  isShowActivityMark: false,
  // 新的CRM系统测试
  newCRM: true,
  // 集卡appid
  cardAppId: 'wxf90cbbef5788bf24',
  // saleforce
  isSaleForce: true,
  shopCartTemplateIds: ['4','5','6'],
  orderPayTemplateIds :['xdGwXrdGbc-E6pl8JNbMR7B6irVjK4fGYQ8UPwbcaUc','wbzC1498Urdt-pFUsDu58xH8ThLRSwshV31FmJjP-v8','fsNoPKHZtPasIquyAWYPW-V3i_nb6HbjyX9DLu49Kpk'],
  refundTemplateIds:['ipGJdhnVl1_92hUmYtcat8kB0WxOleOwnOPXr3YxXB0'],
  activityTemplateIds:[' dXEfGcXZhCkpcqNgIlMFHsC_e8PzWxFwKrjfrPQlcTM','B0nw2GsIb_NQH8NAXXuhMbeKFqXce60XBtmU0ivq-FQ'],
  couponTemplateIds: ['CgGP0z5XL0cMuo1jOoqaAlhcZ8AmOKh7j2y_D753E_M','g1D1uADcSH4JeER8NjZrGkdjkrJT87tDRvd1opDbynI'],
  paySuccessTemplateIds:['DcZbkl2U19vvhILiUmtcFbk2TBVDRzmF9kq1TH_rokI', 'X1ajveTSnwLUNoE8mh_IzGN-xI7k83Upiet4_CRMVsE', '_1QY2rFsSZcjc1UuScAQ-p9EqhmCoTS9QgNZDcWgaBk'],
  newGoodsNoticeTemplateIds: ['x0_mhP9J-QqMrdusouvIbYEFQpGWyE4fwmoMECfkiUw'],
  refundTemplateIdsNew:['jzWn8IImbEXXCoezf9AeFOnBlv9AQB1CXGoK9JXCypM','ol3JWUifhDh4XDmxhynP9i071VwoV-I94En-dNLDQgw','6nZO26Ra_VcYrtm5tOQVcMEnnN0L5pT_TaXZyJHzo-w'],

  // 拼团二维码分享域名
  pintuanUrl : '',
  // 分类页默认logo图
  classificationLOGO : 'JLINDEBERG.jpg',
  // 首页直播入口数量
  homeLiveCount: 3,
  // 首页是否显示回播
  homeLiveReplay: false,
  // 兑吧入口
  duibaEntry: false,
  // 是否wemember登录
  isWeMemberLogin: true,
  //猜你喜欢sourceId
  SOURCE_ID:55
}

