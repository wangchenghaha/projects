/*
 * @Author: your name
 * @Date: 2020-06-24 10:45:36
 * @LastEditTime: 2020-06-29 10:34:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SELECTED\config\main.selected.js
 */
//思莱德配置
import {DEV} from './main'
const domain = 'https://minislt.bestseller.com.cn';
const domain_test = 'http://minislt.vm.cn'; // 测试地址
module.exports = {

  //埋点相关配置
  td:{
    appkey: '6C1F3BAD546E4C94B2EDA6CBBB3B87F0',//app 密匙
    getUserInfo: false, // 默认不获取用户信息
    getLocation: false, // 默认不获取用户位置
    autoOnPullDownRefresh: true, // 默认不统计下拉刷新数据
    autoOnReachBottom: true // 默认不统计页面触底数据
  },
  // TDNew 埋点
  tdNew: {
    appkey: 'D766E351015F4A549DEBBAED1F885095',
  },

  //app id
  wxAppid: 'wxeb2f4c579a95f94e',
  // 微信上报APPid
  // wxReportAppid: DEV ? 'bi1e4cc24a52674f8a' : 'bia3f35010a24a4230',
  wxReportAppid: 'bia3f35010a24a4230' ,
  // 微信上报Secret
  // wxReportAppSecret: '085f801e99904e8ca373a8e3908d2695',
  wxReportAppSecret: 'a6182f1cad8746a8acc9122442a20f3c',

  //判断转盘次数显示隐藏
  isTurntableNum: true,

  //礼品卡 appid
  giftCardWxAppid: 'wxcae28cff866d199c',

  //爱show appid
  aiShowAppid: 'wx878d1198278e1d74',

  //app 名字
  appName: 'SELECTED',

  //API主机地址
  domain: DEV ? domain_test : domain,

  //老H5主机地址
  domain_h5: 'https://m.selected.com.cn',
  //标题行名字
  title:"SELECTED",
  //微信公众号名称
  publicName:'SELECTED',
  // 运营DA账号
  operateDA: ['DA00441660','DA00050952'],
  memberLoop: [
    {
      id:115487,
      img:'https://cdn.bestseller.com.cn/assets/common/SELECTED/image/member_loop_1.jpg'
  },
  {
    id:111392,
    img:'https://cdn.bestseller.com.cn/assets/common/SELECTED/image/member_loop_2.jpg'
  },
  {
    id:111392,
    img:'http://cdn.bestseller.com.cn/assets/common/SELECTED/image/member_loop_3.jpg'
  }],

  refundAddress : '地址：天津市 武清区 开发区 泉秀路9号 绫致时装6号库A01-A02门（SLT仓）, 公司名称：绫致时装（天津）有限公司 , 收件人：H5手机Inbound收货组 , 电话：400- 862-8888 , 邮编：301700',
  singleBrand: true,  // 和单品牌不一样
  saveImgGif: true,  // 保存图片出现gif

  refundAddressDetail:`天津市 武清区 开发区 泉秀路9号 绫致时装6号库A01-A02门（SLT仓）`,
  flagEnableApplyForEx: false,//是否可以申请换货
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
  // 到店自提活动是否开启
  PICKUP_ACT_ENABLED:false,

  BRAND_SHORT_UPPERCASE:"SLT",
  // 客服
  CUSTOMER_WX_NAME: 'SELECTED-VIP4',
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
  guideWXNums: 'SELECTED-VIP2',
   // 是否显示收藏夹
   isCollection: true,
  // wemember Appid
  WE_MEMBER_APP_ID: 'wx49a2655481a77027',
  // 是否显示活动标记
  isShowActivityMark: false,
  // 是否显示不记名券
  showNoNameCoupon: true,
  // 是否查询关注公众号
  subscribe: true,
  // 集卡appid
  cardAppId: 'wx89b08bac92d73db0',
  // saleforce
  isSaleForce: true,
  shopCartTemplateIds: ['1nISzkQe0Hgbnz8FQIv9LPCHUSrkgdOsMxe8Lwf1xf0'],
  orderPayTemplateIds :['J8wNIsjfTcARrFk_CNVU4sw7J4aqLm2sSjPXiofXoVc','8mnCznGpu_6cPmZVFtppDHaQcP5YKw3cCmZUiHhexxs','7POalK8PRjPMJP6QQkx7UfKEGtGHDzofx9BY8fnwVTg'],
  refundTemplateIds: ['1nISzkQe0Hgbnz8FQIv9LPCHUSrkgdOsMxe8Lwf1xf0'],
  activityTemplateIds:['jhETySEZ-YpXTH8zMkTgX-q0ZOjKU8-5IDnHlmWBSH8','abZ_junxQYGiEwSrl9i9YZkDhNe7RZyemZoWA333Llc'],
  couponTemplateIds: ['8xBDYevazldy4GUYlC37bBWaN5sFUGCpZCry7LspNME','PWUwbjCTa7I8nslGn1eB9o81kESOOIyHX3bARlSMSPY'],
  paySuccessTemplateIds:['wo_4b9Iz6crQh30PdJGYyjwZjE0LJbnQRjB3n7sA6qU', 'wqve26jmFQNQi85xPGb4Oh77ycxc1jjlbj9dBOM5aXk', 'PqKlkkxBHMhbmOHM_4i-jtcGkqN1auTpIk2kI9k7iLE'],
  newGoodsNoticeTemplateIds: ['ADTi00AdHOsnjqRJRhkPMwt0KlGeR6CJb4YYqHWUfGo'],
  refundTemplateIdsNew:['9pd7uKuNeLz7wBeqxcOgwCnKsoV4Liw2i6vCEJ9BxHE','e-9gjBIDzkc3KeL6v959aMk--uUl3gvnODkwATj6zHs','QqXaPyd2C_i00eOEy6wFx4BGNp7mMMkTWajGOjEDgas'],
  jumpGameTemplateIds:['abZ_junxQYGiEwSrl9i9YVke6Lmyms9Nt-MHwxjdkKo'],
  courierGameTeplateIds:['abZ_junxQYGiEwSrl9i9YVke6Lmyms9Nt-MHwxjdkKo'],
  // 是否显示拼团模块
  showPintuan : true,
  // 拼团二维码分享域名
  pintuanUrl : 'https://www.selected.com.cn/',
  //  回播分享二维码域名
  hbQrCodeUrl : 'https://hbslt.truu.com.cn/',
  // 拼团人数
  pintuanPersonNum : "2",
  // 分类页默认logo图
  classificationLOGO : 'SELECTED.jpg',
  // 列表分类
  goodsListNavByHot: true,
  // 详情页免洗图片
  markWashing: true,
  // 首页直播入口数量
  homeLiveCount: 3,
  // 首页是否显示回播
  homeLiveReplay: false,
  // 附近门店页面链接
  nearShopUrl: '/store/storelist/storelist?tpl_id=93&tag_id=400',
  // 兑吧入口
  duibaEntry: true,
  // 砍价活动ID
  barginCode: '10005',
  // 是否wemember登录
  isWeMemberLogin: true,
  // 王者插件 品牌ID
  brandId: 'b1602744305',
  // 需要不展示业绩的店铺
  shopCodeArr: ['9V08', '9V23', '9V12', '9V16', '9V58', '9V13', '9V31', '9V18', '9V02', '9R66', '9R08', '9R62', '9R04', '9K85', "9R02", "9R03", "9R04", "9R08", "9R15", "9R21", "9R23", "9R24", "9R31", "9R44", "9R39", "9R59", "9R62", "9R66", "9R69", "9R34", "9R50"],
  // 列表，详情不显示折扣
  SHOW_DISCOUNT: true,
  friendRanklabel: '202103_slt_spring',
  // 关注公众号链接
  OFFICIAL_ACCOUNT: 'https://mp.weixin.qq.com/s/6Q1-Mqz_ZXFWSTwBnhnsjA',
  // 视频号ID
  FEED_ID: 'sphngg50fj3dnzj',
  // GIO 埋点
  GIO: {
    SOURCE_ID: 'b6876af1240ce2c1'
  },
  GIO_ONLINE: true,
  // 是否全屏
  FULL_SCREEN: true,
  //猜你喜欢sourceId
  SOURCE_ID:54,
  // 绑定导购
  SHOW_BIND_GUIDE: true,
  // 储值卡小程序appid
  STORE_VALUE: 'wxd5e70a51f07222b3',
  STORE_VALUE_PAGE_BG_COLOR: '#fade1b',
}

