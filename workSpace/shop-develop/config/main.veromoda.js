//VM配置
import {DEV} from './main'
const domain = 'https://minivm.bestseller.com.cn';  // 正式地址
const domain_test = 'http://minivm.vm.cn'; // 测试地址
module.exports = {

  //埋点相关配置
  td:{
    appkey: '303CD014BED74D89A2DA1C415436D9A5',//app 密匙
    getUserInfo: false, // 默认不获取用户信息
    getLocation: false, // 默认不获取用户位置
    autoOnPullDownRefresh: true, // 默认不统计下拉刷新数据
    autoOnReachBottom: true // 默认不统计页面触底数据
  },
  // TDNew 埋点
  tdNew: {
    appkey: '6DC75C512E2E4DD79A62267AF94564E5',
  },


  //app 密匙
  appName: 'VEROMODA',
  //app 名字
  wxAppid: 'wxccfd1cc23fce2fe5',

  // 微信上报APPid
  // wxReportAppid: DEV ? 'bi6a3458ef4afc4b34' : 'bicc155c6dfa2246d9',
  // wxReportAppid: 'bi6a3458ef4afc4b34' ,
  wxReportAppid: 'bicc155c6dfa2246d9',
  // 微信上报Secret
  // wxReportAppSecret: '0de186d9663d404f9b8981549112f65e',
  wxReportAppSecret: 'd4330ee3f959435a83d393d012f459c0',

  //爱show appid
  aiShowAppid: 'wxea7d47a5243e4859',

  //判断转盘次数显示隐藏
  isTurntableNum: true,

  //礼品卡 appid
  giftCardWxAppid: 'wx931c117551f0f13e',
  //API主机地址
  domain: DEV ? domain_test : domain,
//  domain:'https://mini.bestseller.com.cn',//测试地址
  //老H5主机地址
  domain_h5: 'https://m.veromoda.com.cn',
  //标题行名字
  title:"VERO MODA",
  //微信公众号名称
  publicName:'VEROMODA',
  // 运营DA账号
  operateDA: ['DA00248912','DA00508362'],

  memberLoop: [
    {
      id:115136,
      img:'https://cdn.bestseller.com.cn/assets/common/VEROMODA/image/member_loop_1.jpg'
  },
  {
    id:114595,
    img:'https://cdn.bestseller.com.cn/assets/common/VEROMODA/image/member_loop_3.jpg'
  }],

  refundAddress : '地址：天津市武清区开发区泉秀路9号 绫致时装6号库A01-A02门（VM仓）, 公司名称：绫致时装（天津）有限公司, 收件人：H5手机Inbound收货组, 联系电话：400-862-8888, 邮编：301700',
  singleBrand: true,  // 和单品牌不一样
  saveImgGif: true,  // 保存图片出现gif
  refundAddressDetail:`天津市 武清区 开发区泉秀路9号 绫致时装6号库A01-A02门（VM仓）`,
  flagEnableApplyForEx:true,//是否可以申请换货
  turnOnShowExOrderList: true,//是否显示换货单列表
  paySuccessActivity: true,
  // 折扣商品是否使用优惠券
  discountGoodsUseVoucher: true,
  //是否开启附近门店功能
  NEARBY_SHOP_ENABLED:true,
  // 分享集赞
  shareZan: true,
  BRAND_SHORT_UPPERCASE:"VM",
  // 客服
  CUSTOMER_WX_NAME: 'VEROMODA-VIP4',
  // 自提立减10元
  IS_PICKUP: false,
  // 是否显示用户协议
  showUserServer: true,
  // 是否展示优惠券提示
  showCouponTip: true,
  // 是否打开容联在线客服
  onlineServiceEnabled:false,
  // 是否到店自提，到店退货
  isStoreOption: true,
  // 导购微信号
  guideWXNums: 'VEROMODA-VIP1',
   // 是否显示收藏夹
   isCollection: true,
  // wemember Appid
  WE_MEMBER_APP_ID: 'wx353ae2790f810983',
  // 是否显示活动标记
  isShowActivityMark: false,
  // 是否显示不记名券
  showNoNameCoupon: true,
  // 是否查询关注公众号
  subscribe: true,
  // 集卡appid
  cardAppId: 'wxda7b2ae50ca3e1bf',
  // 首页导航会员卡
  navMemberCard: true,
   // saleforce
   isSaleForce: true,
   shopCartTemplateIds: ['4','5','6'],
   orderPayTemplateIds :['H2jFdHfRaMNUAwpoAz6hPyoJyaDXFTdiVFslXGsYED4', 'RlGYNDKnkxjudUEiKME1D8Zzp-ksYCd-yautB4QBORg', 'R70BEAr0EAN4n6KHGrZEcK8-JctKcGtw2sA5dZ0kieA'],
   refundTemplateIds:['LYkNqjAAkUXWgcy2Lky2gxnZelgz00Z1OMuGZhHqiv0'],
   activityTemplateIds:['ZJwaMlpMEoHZBZL2W-RyVFJeN9RdHab_56DI-mir8f8','C_yAE1juTSLKruRYb2OG1l1HPqqQ2Ks0kQjsPVbMUYo'],
   couponTemplateIds: ['pcH0IMQ-lL0_d7CJ9fYZSoiRAzPgQkg-BEF2d_JhZrk','n8vfVaZ2zaXFbFA-87ETMDKEGUfEkILs-T-Rb8DN9n4'],
   paySuccessTemplateIds:['jDed4Wq_zrizi_5FtqaFUzhO1g5xqgYF2-5-H__iEnE', 'E9sWIRovGfASNuWeG4UC1vtuZiGBkKibSonKnBFG51k', 'AWcSnaqYEWXbk6qS3VkotbdZwel85ioKapx19bdePeY'],
   newGoodsNoticeTemplateIds: ['ntNOl1dvHqs3xoroDmY-iZApiNX5FRTIenXC_9ZC6hs'],
   refundTemplateIdsNew:['XftSDWtQG_X5ue1YWchbwFaDtfv0_5j82FZtSN_tl44','eeG2FB6LOWU3U_ospZYGpIUP26f7ynLxPMsOaXk0jCo','rwkSkNOMRH3zZwlcYUt0L5zpk18b8GbKnsP8Ch5Zs4I'],
   jumpGameTemplateIds:['C_yAE1juTSLKruRYb2OG1mtEh8-fiJEkDMu0Vfe3CzE'],
   courierGameTeplateIds:['C_yAE1juTSLKruRYb2OG1mtEh8-fiJEkDMu0Vfe3CzE'],
   seckillTemplateIds:['ZJwaMlpMEoHZBZL2W-RyVCQEi3o-N88NGiiLdqT8SN0'],

   // 拼团二维码分享域名
   pintuanUrl : 'https://www.veromoda.com.cn/',
   //  回播分享二维码域名
   hbQrCodeUrl : 'https://hbvm.truu.com.cn/',
  // 分类页默认logo图
  classificationLOGO : 'logo-circle.png',
  // 列表分类
  goodsListNavByHot: true,
  // 详情页免洗图片
  markWashing: true,
  // 首页直播入口数量
  homeLiveCount: 3,
  // 首页是否显示回播
  homeLiveReplay: false,
  // 附近门店页面链接
  nearShopUrl: '/store/storelist/storelist?tpl_id=105&tag_id=401',
  // 兑吧入口
  duibaEntry: true,
  // 砍价活动ID
  barginCode: '10001',
  // 是否wemember登录
  isWeMemberLogin: true,
  // 是否显示心愿单
  showWish: true,
  wishMsg: [
    '因为宠爱，所以包下你所有的喜欢',
    '不落单，为所爱买单',
    '因为喜欢，所以把你“取”回家！',
    '所有的小确幸，都会成为大满足'
  ],
  // 王者插件 品牌ID
  // brandId: 'b1606890966',
  brandId: 'b1606890966',
  // 需要不展示业绩的店铺
  shopCodeArr: ['8R79'],
  // 列表，详情不显示折扣
  SHOW_DISCOUNT: true,
  friendRanklabel: '202103_vm_spring',
  // 关注公众号链接
  OFFICIAL_ACCOUNT: 'https://mp.weixin.qq.com/s/qvQTFv6GF3rN5nUybDz2iA',
  // 视频号ID
  FEED_ID: 'sphRl5UGVpJxp8y',
  // GIO 埋点
  GIO: {
    // SOURCE_ID: '8a16543ac8ee26da', 测试
    SOURCE_ID: 'a4f82811b8d09800'
  },
  GIO_ONLINE: true,
  // 是否全屏
  FULL_SCREEN: true,
  //猜你喜欢sourceId
  SOURCE_ID:53,
  // 绑定导购
  SHOW_BIND_GUIDE: true,
  // 储值卡小程序appid
  STORE_VALUE: 'wxd9822ed4b794676b',
  STORE_VALUE_PAGE_BG_COLOR: '#fade1b',
}

