import config from '../../config/index'
const baseUrl = config.debug ? config.local.origin : config.proxy.origin
const baseUrlDORA = config.debug ? config.localDORA.origin : config.proxyDORA.origin
// const baseUrl2 = config.tdebug ? config.local.origin : config.proxy.origin

export default {
    home: `${baseUrl}/api/beat-unhappy/index`, // get
    join: `${baseUrl}/api/beat-unhappy/join`, // post
    sendCoupon: `${baseUrl}/api/beat-unhappy/send-coupon`, // post 
    toggleCoupon: `${baseUrl}/api/beat-unhappy/update-coupon`, //post

    // 转盘部分
    thome: `${baseUrl}/api/shin/is-handle`, // get
    award: `${baseUrl}/api/shin/luck`, // post
    handleCoupon: `${baseUrl}/api/shin/receive-luck`, // post
    couponStatus: `${baseUrl}/api/shin/update-card`, // get

    // 哆啦A梦转盘部分
    doraThome: `${baseUrlDORA}/api/dora/is-handle`, // get
    doraAward: `${baseUrlDORA}/api/dora/luck`, // post
    doraHandleCoupon: `${baseUrlDORA}/api/dora/receive-luck`, // post
    doraCouponStatus: `${baseUrlDORA}/api/dora/update-card`, // get
}