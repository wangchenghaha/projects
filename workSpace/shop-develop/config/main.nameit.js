/*
 * @Author: your name
 * @Date: 2020-06-01 18:13:46
 * @LastEditTime: 2020-06-02 11:04:13
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /SELECTED/config/main.nameit.js
 */
//童装配置
import {DEV} from './main'
const domain = 'https://minini.bestseller.com.cn';  // 正式地址
const domain_test = 'http://minini.vm.cn'; // 测试地址
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
    appkey: '637ABD5B8EE74FD380385E94C0BCE2E7',
  },
  //app id
  wxAppid: 'wx77598b397deea286',

  //判断转盘次数显示隐藏
  isTurntableNum: true,

  //app 名字
  appName: 'NAMEIT',

  //API主机地址
  domain: DEV ? domain_test : domain,
  //老H5主机地址
  domain_h5: 'https://m.nameit.cn',
  //标题行名字
  title:"NAMEIT",
  //微信公众号名称
  publicName:'nameit童装',

  memberLoopID:[ ],

  refundAddress : '退货地址：上海市松江区石湖荡镇双金公路8号202办公室收 \n 收件人：张翠花\n 电话： 021-37015920\n 邮编：201617',
  refundAddressDetail:`上海市松江区石湖荡镇双金公路8号202办公室收`,
  singleBrand: false,  // 和单品牌不一样
  saveImgGif: false,  // 保存图片出现gif
  // 折扣商品是否使用优惠券
  discountGoodsUseVoucher: true,
  // 是否需要运费，
  needExpressFare: true,
  // 是否显示用户协议
  showUserServer: false,
  // 是否打开容联在线客服
  onlineServiceEnabled:false,
  // 是否到店自提，到店退货
  isStoreOption: false,
   // 是否显示收藏夹
   isCollection: false,
  // 是否显示活动标记
  isShowActivityMark: false,
  // 首页导航会员卡
  navMemberCard: true,
   // saleforce
   isSaleForce: true,
   // 拼团二维码分享域名
   pintuanUrl : '',
  // 分类页默认logo图
  classificationLOGO : '',
  // 首页直播入口数量
  homeLiveCount: 3,
  // 首页是否显示回播
  homeLiveReplay: false,
  // 兑吧入口
  duibaEntry: false
}

