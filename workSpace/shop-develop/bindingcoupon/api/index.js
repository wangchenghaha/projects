//var aimsUlr = "http://10.10.89.21:3000"; //目标服务器地址
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
 const Url = 'https://bestseller-wechat.woaap.com';
export default {
    activeInfo:`${Url}/bestsellercrm/campainTemplate/info`, //活动详情
    getUtmInfo: `${Url}/bestsellercrm/campainchannel/infoList`,//获取UTM参数列表
    memberIsMember:`${Url}`+'/api/member/mini-is-member', //判断是否会员
    bindingCoupon:`${Url}`+'/bestsellercrm/bindcoupon/bindingCoupon', //优惠券绑定
    couponUtm:`${Url}`+'/bestsellercrm/bindcoupon/getCouponUtm', //优惠券UTM
}