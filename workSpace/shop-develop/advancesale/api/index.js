//var aimsUlr = "http://10.10.89.21:3000"; //目标服务器地址
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
// const BaseUrl = brand === 'JLINDEBERG' ? 'https://bestseller-wechat.woaap.com' : 'https://bestseller-wechat.woaap.com'
const BaseUrl = 'https://bestseller-wechat.woaap.com'

export default {
    index : `${BaseUrl}/api/book/init`,   //首页状态
    record : `${BaseUrl}/api/book/book-record`,//预约
    formid : `${BaseUrl}/api/book/formid`,//预约
    coupon : `${BaseUrl}/api/book/coupon`,//领券
    isMember: `${BaseUrl}/api/member/mini-is-member`, //是否是会员
    updateCoupon : `${BaseUrl}/api/book/update-coupon`,//更新卡券状态
    sendmessage : `${BaseUrl}/api/book/send-message`,//发服务通知
    pvUv : `${BaseUrl}/api/book/pv-uv`,//puvu
}