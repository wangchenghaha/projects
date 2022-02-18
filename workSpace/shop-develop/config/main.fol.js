//联合官网配置
import {DEV} from './main'
const domain = 'https://fol.bestseller.com.cn';  // 正式地址
const domain_test = 'http://minifol.vm.cn'; // 测试地址
module.exports = {

  //埋点相关配置
  td:{
    appkey: '-',    //app 密匙
    getUserInfo: false, // 默认不获取用户信息
    getLocation: false, // 默认不获取用户位置
    autoOnPullDownRefresh: true, // 默认不统计下拉刷新数据
    autoOnReachBottom: true // 默认不统计页面触底数据
  },
  // TDNew 埋点
  tdNew: {
    appkey: '82CE0CE682E94180B0B9B07C26CDC141',
  },

  //app id
  wxAppid: 'wx22a009dec5fd4b88',
  // 微信上报APPid
  // wxReportAppid: DEV ? 'bic37df847530443f7' : 'bi960e7bfade2d48d9',
  wxReportAppid: 'bi960e7bfade2d48d9',
  // 微信上报Secret
  wxReportAppSecret: 'b170f72071ff460bb4b462c1ed4189be',

  //app 名字
  appName: 'BESTSELLER折扣店',

  //API主机地址
  domain: DEV ? domain_test : domain,
  //测试环境
  // domain:'https://mini.bestseller.com.cn',
  //老H5主机地址
  domain_h5: 'https://fol.bestseller.com.cn',
  //标题行名字
  title:"BESTSELLER折扣店",
  //微信公众号名称
  publicName:'BESTSELLER折扣店',

  refundAddress : '地址：天津市 武清区 开发区 泉秀路9号 绫致时装6号库（FOL官网），邮编：301700， 公司名称：绫致时装（天津）有限公司，收货人：韩建东 ， 联系电话：13312069353',
  flagEnableApplyForEx: false,//是否可以申请换货
  turnOnShowExOrderList: true,//是否显示换货单列表
  refundAddressDetail:`天津市武清区开发区泉秀路9号绫致时装6号库（FOL官网）`,
  REFUND_RECEIVER:`韩建东`,
  singleBrand: true,  // 和单品牌不一样
  saveImgGif: false,  // 保存图片出现gif
  paySuccessActivity: true,
  // 折扣商品是否使用优惠券
  discountGoodsUseVoucher: true,
  // 是否需要运费，
  needExpressFare: true,
  isFOL: true,
  //判断转盘次数显示隐藏
  isTurntableNum: false,
    // 客服
  CUSTOMER_WX_NAME: 'BESTSELLER-VIP2',
  // 是否显示用户协议
  showUserServer: true,
  // 是否展示优惠券提示
  showCouponTip: false,
  // 是否打开容联在线客服
  onlineServiceEnabled:false,
  // 导购微信号
  guideWXNums: 'BESTSELLER-VIP2',
  // 是否显示收藏夹
  isCollection: true,
  // 是否显示活动标记
  isShowActivityMark: false,
  // wemember Appid
  WE_MEMBER_APP_ID: 'wxef8967f52ab3d329',
  // 是否查询关注公众号
  subscribe: false,
  // 集卡appid
  cardAppId: 'wxb0200ea401dccbc1',
   // saleforce
   isSaleForce: true,
   shopCartTemplateIds: ['4','5','6'],
   // 订单支付成功通知， 订单取消通知， 待付款提醒
   orderPayTemplateIds :['SZxKd1llrmYKXE5FdfEoX-_uHGFe3m-6T57Wz_hp6CU','PPfGlwjljigYDizHCPKvr6RtqIPCo70Lsk51R1-u0SA', 'l780LaGKhxUXjQo33ovGJUiSZ1VqpxsjnDvHGDlvvE8'],
   refundTemplateIds:['m30F0ybfhAmUuWQsOdHz7CumQTDw2k4tHw5B7ipQ0J0'],
   activityTemplateIds:['wygVlpLWqeNbMQ1nLsNQfT3kl7yOR6C5G0Q_ukvfxaU','yXCspGz9HSHKFmzFlAhWKgPWPoLWnsm5-jt1uGBLc98'],
   couponTemplateIds: ['uMOxT_roD6-swnRRKBSqnsHGrszKYmDvvTB_YqQmCXQ','6PW59J_E7U1Al2x9ve4mPdHf4bPC6WTd9ILvJ9stOSc'],
   // 订单发货通知, 订单完成通知, 订单商品推荐提醒
   paySuccessTemplateIds:['0jaMNoxhcGhvhKLxwuD-M_AKbSDmYcZiiLaFYadmcxo', 'rT-fGsmJsaAlgORGX-JeSSLrpQJpYXQg7WhBAnbI5IY', 'sI-0CEGbwo17EunsjoNvCeLdIuV3tVbTjlpPX1fLrTM'],
   pintuanPaySuccessTemplateIds:['mzfexAzJxSJqMxwL9npW8tft6IsLV-uMv7LhI5v3bwA'],
   newGoodsNoticeTemplateIds: ['_lv2yTXkCeLFUjx8lnnqTb-iSyLmWtI_lVeUuqhlGhY'],
   refundTemplateIdsNew:['4_H1CtlaZFbI5z5B4bIMSDuWE5rqLA7envsrt9K064U','sKeMS0vj1LdDv3tmkMADWR6WFb6BtMBvvKUAPzl6Pwo','ph_DfvG2pWSXvJ7VRInjSce5vj2s1lf-UgYAKKm0PRg'],
   jumpGameTemplateIds:['yXCspGz9HSHKFmzFlAhWKuf75gU_mGtsmJzsWolPA9I'],
   courierGameTeplateIds:['yXCspGz9HSHKFmzFlAhWKuf75gU_mGtsmJzsWolPA9I'],

   // 拼团二维码分享域名
   pintuanUrl : 'https://ext.bestseller.com.cn/',
  //  回播分享二维码域名
  hbQrCodeUrl : 'https://hbfol.truu.com.cn/',
  // 支付完成导购二维码路径
  guidePathQR: '/fol_img/',
  // 预售
  preSale: true,
  // 列表分类
  goodsListNavByHot: true,
  // 预售是否使用优惠券
  preSaleUseVoucher: false,
  // 是否到店自提，到店退货
  isStoreOption: false,
  // 首页直播入口数量
  homeLiveCount: 5,
  // 首页是否显示回播
  homeLiveReplay: true,
  // 兑吧入口
  duibaEntry: true,
  // 详情商品打标
  goodsMark: true,
  // 是否需要授权手机号登录 2020 08
  useWXPhone: false,
  // 砍价活动ID
  barginCode: '10007',
  // 是否wemember登录
  isWeMemberLogin: true,
  // 是否显示分销
  showFX: true,
  // 是否显示心愿单
  showWish: true,
  wishColor: '#ff7bc7',
  wishMsg: [
    '不落单，为爱买单',
    '因为喜欢，所以把你“带”回家',
    '满心欢喜，只因你爱',
    '愿你一生美丽，可爱幸福',
    '爱你的心一生不变',
    '气质优雅人难比，容貌漂亮你第一'
  ],
  // 列表页是否显示库存排序
  navStockShow: true,
  // 列表，详情不显示折扣
  SHOW_DISCOUNT: false,
  friendRanklabel: '202103_fol_spring',
  // 首页搜索热词背景色
  SEARCH_BG: 'none',
  // 关注公众号链接
  OFFICIAL_ACCOUNT: 'https://mp.weixin.qq.com/s/P6KpyIna4W2nuoD3xzkX7A',
  // GIO 埋点
  GIO: {
    SOURCE_ID: 'a630213633b9db32'
  },
  GIO_ONLINE: true,
  // 是否全屏
  FULL_SCREEN: false,
  //猜你喜欢sourceId
  SOURCE_ID:56
}

