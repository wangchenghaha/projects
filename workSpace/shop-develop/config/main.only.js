//ONLY 配置
import {DEV} from './main'
const domain = 'https://minionly.bestseller.com.cn';  // 正式地址
const domain_test = 'http://miniol.vm.cn'; // 测试地址
module.exports = {

  //埋点相关配置
  td:{
    appkey: 'D0B928825A704304A9E8F42D48F8466C',//app 密匙
    getUserInfo: false, // 默认不获取用户信息
    getLocation: false, // 默认不获取用户位置
    autoOnPullDownRefresh: true, // 默认不统计下拉刷新数据
    autoOnReachBottom: true // 默认不统计页面触底数据
  },

  // TDNew 埋点
  tdNew: {
    appkey: 'FFF2834DB6C94A3AB8A0123D8463A20C',
  },

  //app id
  wxAppid: 'wxa3d9d2199eeded73',
  // 微信上报APPid
  // wxReportAppid: DEV ? 'bi53ce0b13baaa447c' : 'bi41c59737d0bf414d',
  wxReportAppid: 'bi41c59737d0bf414d',
  // 微信上报Secret
  wxReportAppSecret: '857e5b8aa9ae4e7598f302c7611015c5',
  // 逛一逛APPid
  gygAPPid: 'wx9d4f5f62ea059f08',
  //判断转盘次数显示隐藏
  isTurntableNum: true,

  //礼品卡 appid
  giftCardWxAppid: 'wxbcaa8a9ea4e17e42',

  //爱show appid
  aiShowAppid: 'wx5429d9173c70dad0',

  //app 名字
  appName: 'ONLY奥莉',

  //API主机地址
  domain: DEV ? domain_test : domain,
  //老H5主机地址
  domain_h5: 'https://m.only.cn',
  //标题行名字
  title:"ONLY",
  //微信公众号名称
  publicName:'ONLY',
  // 运营DA账号
  operateDA: ['DA00521268'],
  memberLoop: [
    {
      id:115305,
      img:'https://cdn.bestseller.com.cn/assets/common/ONLY/image/member_loop_2.jpg'
  },
  {
    id:114762,
    img:'https://cdn.bestseller.com.cn/assets/common/ONLY/image/member_loop_3.jpg'
  }],

  refundAddress : '地址：天津市 武清区 开发区泉秀路9号 绫致时装6号库A01-A02门（ONLY仓）, 公司名称：绫致时装（天津）有限公司, 收件人：H5手机Inbound收货组, 联系电话：400-862-8888, 邮 编：301700',
  singleBrand: true,  // 和单品牌不一样
  saveImgGif: true,  // 保存图片出现gif

  refundAddressDetail:`天津市 武清区 开发区泉秀路9号 绫致时装6号库A01-A02门（ONLY仓）`,
  flagEnableApplyForEx:true,//是否可以申请换货
  turnOnShowExOrderList: true,//是否显示换货单列表
  paySuccessActivity: true,
  // 折扣商品是否使用优惠券
  discountGoodsUseVoucher: true,
  //是否开启附近门店功能
  NEARBY_SHOP_ENABLED:true,
  // 分享集赞
  shareZan: true,
  BRAND_SHORT_UPPERCASE:"ONLY",
  // 客服
  CUSTOMER_WX_NAME: 'ONLY-VIP1',
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
  // 导购微信号true
  guideWXNums: 'ONLY-VIP1',
   // 是否显示收藏夹
   isCollection: true,
  // wemember Appid
  WE_MEMBER_APP_ID: 'wx5b5a319ad751562f',
  // 是否显示活动标记
  isShowActivityMark: false,
  // 是否显示不记名券
  showNoNameCoupon: true,
  // 是否查询关注公众号
  subscribe: true,
  // 集卡appid
  cardAppId: 'wxf594102a90b440f5',
   // saleforce
   isSaleForce: true,
   shopCartTemplateIds: ['4','5','6'],
   orderPayTemplateIds :['_tQ_8pZG8CeyJgBQ_EUcHUme2cZFfdjfkYuALAVdJOY','xnNKXldOL7vneO3gzHZx1bEzByziZeU82Umkza6KrYc','OVafn4kr1rG3ALBOMbZBtb5-Yi0McE9ywVgRb9Le5Co'],
   refundTemplateIds:['9fN1WHL018g6q6VqG45LZzVzXrJXQtKiujVNz_-PoZs'],
   activityTemplateIds:['CTEiQNY7yuifYmeRp_xj6Es4RlmryBuWYViqnI-wTvU','PfAgTQ93q3sN1-XEhj8QyZiVEdtlc6ZeUNoBqsPU6Zk'],
   couponTemplateIds: ['lPJWXypufwOnWjKGr2kcbCHKF7NHZV8iMQCpcEBC_z8','xaZqBSFq8Nt_QI_W2BfUBElX36YEHDhPbL1DlwAaYd0'],
   paySuccessTemplateIds:['AZC2DcjQhUxzcXH7dbuq14XcJpjGV8GM4Tq0zt14pck', 'w87uD8oxPBXEkptBcOItLPOuLtBDhSY6YYl5hmt7UxQ', 'ZYTqLXG5ht2U6P5Zh2MzfSbTZao7pftiiH7HKVwZdPo'],
   newGoodsNoticeTemplateIds: ['gOIZ8KxcCbFqlmEY1-WN3pTzw9FQQIYYYzk2jfdpxNw'],
   refundTemplateIdsNew:['-ADE3rx5UTsnwkiiHMNWFsCmzlAIWx1MIz70I6R0KL8','js6imUmhH6Ni_SP4jrvBhTJbBU5ZpI9TVWqacMiqvpY','peQDtG5NEIpkP--ak5U9HEI92BoyCh9OviZOYNNyC4k'],
   jumpGameTemplateIds:['PfAgTQ93q3sN1-XEhj8QyStTxOvvDLDEquwLTpIIYCQ'],
   courierGameTeplateIds:['PfAgTQ93q3sN1-XEhj8QyStTxOvvDLDEquwLTpIIYCQ'],

   // 拼团二维码分享域名
   pintuanUrl : 'https://www.only.cn/',
   //  回播分享二维码域名
   hbQrCodeUrl : 'https://hbol.truu.com.cn/',
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
  nearShopUrl: '/store/storelist/storelist?tpl_id=106&tag_id=404',
  // 兑吧入口
  duibaEntry: true,
  // 砍价活动ID
  barginCode: '10007',
  // 是否wemember登录
  isWeMemberLogin: true,
  // 是否显示心愿单
  showWish: true,
  wishMsg: [
    '快来ONLY看看我的七夕心愿单吧！',
    '浪漫七夕 ，穿着ONLY美衣去见你！',
    '七夕，向你表白我的心愿！ ',
    '解锁七夕心愿单，开启浪漫仪式感！',
    '你问我想要什么礼物，清空心愿单算不算！',
  ],

  // 王者插件 品牌ID
  brandId: 'b1602745465',

  // 需要不展示业绩的店铺
  shopCodeArr: ['1R91'],
  // 列表，详情不显示折扣
  SHOW_DISCOUNT: true,
  friendRanklabel: '202103_only_spring',
  // 关注公众号链接
  OFFICIAL_ACCOUNT: 'https://mp.weixin.qq.com/s/hP1hKbu7Xe5TXZcYnk7R_w',
  // 视频号ID
  FEED_ID: 'sphXPJWTyLmuIBY',
  // GIO 埋点
  GIO: {
    // SOURCE_ID: '9d6f5e7e8118d49f'
    SOURCE_ID: '9ff4c10d44c0d113'
  },
  GIO_ONLINE: true,
  // 是否全屏
  FULL_SCREEN: true,
  //猜你喜欢sourceId
  SOURCE_ID:51,
  // 储值卡小程序appid
  STORE_VALUE: 'wx80ecd4fe84bedd3e',
  STORE_VALUE_PAGE_BG_COLOR: '#fade1b',
}

