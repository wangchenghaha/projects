//var aimsUlr = "http://10.10.89.21:3000"; //目标服务器地址
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
const BaseUrl = 'https://bestseller-wechat.woaap.com'
    // const BaseUrl = 'https://bestseller-wechat-test.woaap.com'

export default {
    index: `${BaseUrl}/api/assemble/index`, //首页拼团
    open: `${BaseUrl}/api/assemble/open`, //开启拼团
    join: `${BaseUrl}/api/assemble/join`, //参与拼团
    info: `${BaseUrl}/api/assemble/info`, //拼团详情
    shareRecord: `${BaseUrl}/api/assemble/share-record`, //分享次数上报
    miniqrcode: `${BaseUrl}/api/assemble/miniqrcode`, //太阳码
    formId: `${BaseUrl}/api/assemble/form-id`, //上传formId

    //领卡领券
    isMember: `${BaseUrl}/api/assemble/send-coupon`, //是否是会员
    updateCouponStatus: `${BaseUrl}/api/assemble/updateCouponStatus`, //跟新状态
    is_get_coupon: `${BaseUrl}/api/assemble/is-get-coupon`, //是否领过卡
}