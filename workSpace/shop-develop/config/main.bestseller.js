/*
 * @Author: your name
 * @Date: 2020-06-24 10:45:36
 * @LastEditTime: 2020-06-29 10:16:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SELECTED\config\main.bestseller.js
 */
//联合官网配置
import {DEV} from './main'
const domain = 'https://minibs.bestseller.com.cn';  // 正式地址
// const domain_test = 'http://minibs.only.cn'; // 测试地址
const domain_test = 'http://mbs.vm.cn'; // 新接口测试地址
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
    appkey: '46C15A2C7BC249558A57BB866BF8E5F1',
  },

  //app id
  wxAppid: 'wx3f644b3610eb9b20',

  //app 名字
  appName: 'BESTSELLER时装',

  //API主机地址
  domain: DEV ? domain_test : domain,
  //老H5主机地址
  domain_h5: 'https://m.bestseller.com.cn',
  //标题行名字
  title:"BESTSELLER",
  //微信公众号名称
  publicName:'绫致时装官方',
  // 客服
  CUSTOMER_WX_NAME: 'VIP-BESTSELLER',

  refundAddress : '地址：天津市武清区开发区泉秀路9号绫致时装6号库（联合官网仓）, 公司名称： 绫致时装（天津）有限公司（官网仓）, 收件人： BESTSELLER时装官网收货组,  电话：400-862-8888, 邮编：301700',
  refundAddressDetail:`天津市武清区开发区泉秀路9号绫致时装6号库（联合官网仓）`,
  singleBrand: false,  // 和单品牌不一样
  saveImgGif: false,  // 保存图片出现gif
  // 是否显示用户协议
  showUserServer: true,
  isCollection: false,
  // 首页导航会员卡
  navMemberCard: true,
  // saleforce
  isSaleForce: true,
  couponTemplateIds: ['1','2','3'],
  shopCartTemplateIds: ['4','5','6'],
  orderPayTemplateIds :['xZ5jM1plMtRQflQJ-gGCclfPLfgrePGCsH82CAVlRHo','UlrmCEV_AMQzFapGG-WIC9a1J2LgyyjwCdCpBWya4bE','UHZNrtOxFHUxE-1tL0lrkgYy07sq59PLZq4tPAAA-Qg'],
  refundTemplateIds:['MMN7v5msBD7ttbmlVV0oxdSU3wPQeH2ejm7g-i4tsRI'],
  // 拼团二维码分享域名
  pintuanUrl : '',
  // 拼团人数
  pintuanPersonNum : "2",
  // 首页直播入口数量
  homeLiveCount: 3,
  // 首页是否显示回播
  homeLiveReplay: false,
  // 兑吧入口
  duibaEntry:false,
  // 是否需要授权手机号登录
  //判断转盘次数显示隐藏
  isTurntableNum: true,
  useWXPhone: false,
  // GIO 埋点
  GIO: {
    SOURCE_ID: '84012fa3fdedb4dd'
  },
  GIO_ONLINE: true,
  //猜你喜欢sourceId
  SOURCE_ID:56,
  // 是否全屏
  FULL_SCREEN: true,
}

