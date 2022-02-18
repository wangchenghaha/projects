/*
 * @Author: your name
 * @Date: 2020-06-01 18:13:46
 * @LastEditTime: 2020-06-02 13:48:35
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /SELECTED/config/main.jackjones.js
 */
//杰克琼斯配置
import {DEV} from './main'
const domain = 'https://minijj.bestseller.com.cn';  // 正式地址
const domain_test = 'http://minijj.vm.cn'; // 测试地址
module.exports = {

  //埋点相关配置
  td:{
    appkey: '28EE62C83A7A4E2E9A89B83D1AEB05EE',//app 密匙
    getUserInfo: false, // 默认不获取用户信息
    getLocation: false, // 默认不获取用户位置
    autoOnPullDownRefresh: true, // 默认不统计下拉刷新数据
    autoOnReachBottom: true // 默认不统计页面触底数据
  },
  // TDNew 埋点
  tdNew: {
    appkey: 'D867B188B0EF44DA84C1B6892449EF91',
  },

  //app id
  wxAppid: 'wx7f1b0d611e93dea4',

  // 微信上报APPid
  // wxReportAppid: DEV ? 'bi18882d14878c4c32' : 'bi895bc2ea90504ac5',
  wxReportAppid: 'bi895bc2ea90504ac5',
  // 微信上报Secret
  wxReportAppSecret: '5998ec3eb32c4f7990c0e692e9c0272d',


  //爱show appid
  aiShowAppid: 'wx4c0757c58b75b82f',

  //礼品卡 appid
  giftCardWxAppid: 'wx4f9e00b72a08b56a',

  //app 名字
  appName: '杰克琼斯JackJones',

  //API主机地址
  domain: DEV ? domain_test : domain,
  //老H5主机地址
  domain_h5: 'https://m.jackjones.com.cn',
  //标题行名字
  title: "JACKJONES",
  //微信公众号名称
  publicName:'杰克琼斯中国',
  // 运营DA账号
  operateDA: ['DA00402577', 'DA00002057', 'DA00063475'],

  memberLoop: [
    {
      id:115403,
      img:'https://cdn.bestseller.com.cn/assets/common/JACKJONES/image/member_loop_2.jpg'
  },
  {
    id:115151,
    img:'https://cdn.bestseller.com.cn/assets/common/JACKJONES/image/member_loop_3.jpg'
  }],

  refundAddress : '地址：天津市 武清区 开发区 泉秀路9号 绫致时装6号库A01-A02门（JJ 仓），公司名称：绫致时装（天津）有限公司，\n 收件人：H5手机Inbound收货组，\n电话：400-862-8888，\n邮编：301700',
  singleBrand: true,  // 和单品牌不一样
  saveImgGif: true,  // 保存图片出现gif
  refundAddressDetail:`天津市 武清区 开发区 泉秀路9号 绫致时装6号库A01-A02门（JJ 仓）`,
  flagEnableApplyForEx:true,//是否可以申请换货
  turnOnShowExOrderList: true,//是否显示换货单列表
  paySuccessActivity: true,
  // 折扣商品是否使用优惠券
  discountGoodsUseVoucher: true,
  //是否开启附近门店功能
  NEARBY_SHOP_ENABLED:true,
  // 分享集赞
  shareZan: true,
  // 排行榜是否显示
  showRankingList: true,
  BRAND_SHORT_UPPERCASE:"JJ",
  // 客服
  CUSTOMER_WX_NAME: 'JACKJONES-VIP3',
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
  guideWXNums: 'HiAbby2000',
  // 是否显示收藏夹
  isCollection: true,
  // wemember Appid
  WE_MEMBER_APP_ID: 'wx74efb237d78c62f8',
  // 是否显示活动标记
  isShowActivityMark: false,
  // 是否显示不记名券
  showNoNameCoupon: true,
  // 是否查询关注公众号
  subscribe: true,
  // 集卡appid
  cardAppId: 'wx492b5b2f87cc304a',
  shopCartTemplateIds: ['4','5','6'],
  orderPayTemplateIds:['hmLqG9cWOO1qiOMz9dJcZ2xd8RXb-t30nO85TlYMQWE', 'TuYQAr9mQcHjKi4GHNzgHD6H2LbG04TGPZY9nFsGsx8', 'RwJ6qhNA7it57XGn5UQJcYXP0uxzZIpeugHgGfTkIhs'],
  refundTemplateIds:['XC43MIN19ALf7Df7JNuovmM_0iOpZmuZjq2Qt6Rnpdc'],
  activityTemplateIds:['x1FqaA2Xqk-60KeEaZHDUvVB3luGj7mLRBcFmaEHjOU','grzEZrcSHLUbYaAJOTZrfKF5iXHlfIxxH_-RqaTjG5E'],
  couponTemplateIds: ['b-YAR78ry2_aIE8uVsZaqCkEQBIv0x1YsKp6VezlnbQ','Z39QyGoWutFD-szeqIFOGSlEQ7OZag--XNNAs0YmBAM'],
  paySuccessTemplateIds:['5WW6EIfsnntqZSDoHr_3WTkUCmJGO3evRdCHIJonHgo', 'fFOejPv2jLACru8JlnplsZqryu8V_LEcex0S0bWyj_s', 'wzmFf4sSNcRLKzkJbN-JyDg4ugcZeBTgw-tzPU-t0fc'],
  newGoodsNoticeTemplateIds: ['6G11Ts42dIl9qDhnKklBjy2-Z1Ye7AeRtQ3BlqMjfAw'],
  refundTemplateIdsNew:['geLbhO4JJOlRjIq8GAWFcyszADgN7yoObmgomeoOc8Q','QSnt7646mItTCnG02vYekPpuPtDtTDTfkGMVbZkLlJk','bZh7Ryn13DJQlJR1in7DzwaFPEcMe5jziKtnK-2qN9s'],
  jumpGameTemplateIds:['grzEZrcSHLUbYaAJOTZrfLV5wUZaQOMgaEXHMWMHHTM'],
  courierGameTeplateIds:['grzEZrcSHLUbYaAJOTZrfLV5wUZaQOMgaEXHMWMHHTM'],
  // saleforce
  isSaleForce: true,
  // 预售
	preSale: false,
  // 预售是否使用优惠券
  //判断转盘次数显示隐藏
  isTurntableNum: true,
  preSaleUseVoucher: true,
  // 拼团二维码分享域名
  pintuanUrl : 'https://www.jackjones.com.cn/',
  //  回播分享二维码域名
  hbQrCodeUrl : 'https://hbjj.truu.com.cn/',
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
  nearShopUrl: '/store/storelist/storelist?tpl_id=152&tag_id=360',
  // 兑吧入口
  duibaEntry: true,
  // 砍价活动ID
  barginCode: '10005',
  // 是否wemember登录
  isWeMemberLogin: true,
  // 王者插件 品牌ID
  brandId: 'b1599535036',
  // 列表，详情不显示折扣
  SHOW_DISCOUNT: true,
  friendRanklabel: '202103_jj_spring',
  // 关注公众号链接
  OFFICIAL_ACCOUNT: 'https://mp.weixin.qq.com/s/6-ZOiFA2OAfp5uFxgEGOlA',
  // 视频号ID
  FEED_ID: 'sphMmlqX6AXbvDq',
  // GIO 埋点
  GIO: {
    SOURCE_ID: '849082f67c296865'
  },
  GIO_ONLINE: true,
  // 是否全屏
  FULL_SCREEN: true,
  //猜你喜欢sourceId
  SOURCE_ID:52,
  // 储值卡小程序appid
  STORE_VALUE: 'wx8b2fb1fc727e8760',
  STORE_VALUE_PAGE_BG_COLOR: '#0d67d7',
}
