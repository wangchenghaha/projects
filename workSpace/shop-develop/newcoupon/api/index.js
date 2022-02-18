//var aimsUlr = "http://10.10.89.21:3000"; //目标服务器地址
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
const BaseUrl = 'https://bestseller-wechat.woaap.com'
// const BaseUrl = 'https://bestseller-wechat-test.woaap.com'

export default {
    index : `${BaseUrl}/api/shopping/activity-info`,   //首页状态
    activeindex : `${BaseUrl}/page/mini-is-getcoupon`,   //活动1状态
    updateCoupon : `${BaseUrl}/page/mini-update-coupon`,   //更新领卡状态
}