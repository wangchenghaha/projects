const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
const Url = 'https://bestseller-wechat.woaap.com';
const imgUrl = 'https://tc.woaap.com/lingzhi/fightgroup/';
const CrmImgUrl = 'https://image-socialcrm.wemallbestseller.com/';
const CouponUrl = 'https://bestseller-wechat.woaap.com';
export default {

  imgUrl : `${imgUrl}`,
  CrmImgUrl : `${CrmImgUrl}`,
  activeInfo:`${Url}/bestsellercrm/campainTemplate/info`, //活动详情
  isOpenCampain: `${Url}/bestsellercrm/members/chief/isOpenCampain`,//是否开团还是进团详情
  startFight: `${Url}/bestsellercrm/members/chief/startFight`,//开团
  jointuan:`${Url}/bestsellercrm/members/league/participate`,//参与拼团
  tuanInfo:`${Url}/bestsellercrm/members/chief/info`,//团详情信息
  getUtmInfo: `${Url}/bestsellercrm/campainchannel/infoList`,//获取UTM参数列表
  getPictureList: `${Url}/bestsellercrm/campain/picture/infoList`,//获取活动图片列表
  getWeChartImgUrl: `${Url}/bestsellercrm/share/sharePerson`,//获取太阳码地址
  couponinfo:`${Url}/bestsellercrm/campaincoupon/couponinfo`,//查券
  updateStatus:`${Url}/bestsellercrm/campaincoupon/updaterecord`,//CRM更新领券状态
  hot:`${Url}/bestsellercrm/members/league/warm`,//预热
  btnList:`${Url}/bestsellercrm/campain/button/infoList`,//获取按钮文本
  savepv:`${Url}/bestsellercrm/campain/savepv`,                 //保存PV数据
  memberIsMember:`${Url}`+'/api/member/mini-is-member', //判断是否会员
  sendCoupon:`${CouponUrl}/api/send/coustom/coupon`,// 发券
  updateCouponStatus:`${CouponUrl}/api/update/coustom/coupon`,//修改领券状态
  getCoupons:`${CouponUrl}/api/get/coustom/coupon`,//打开卡券

}
