//var aimsUlr = "http://10.10.89.21:3000"; //目标服务器地址
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
const BaseUrl = 'https://bestseller-wechat.woaap.com'
// const BaseUrl = 'https://bestseller-wechat-test.woaap.com'

export default {
    // index : `${BaseUrl}/`,   //
    // activeindex : `${BaseUrl}/`,   //
    // updateCoupon : `${BaseUrl}/`,   //
    isMember: `${BaseUrl}/api/member/mini-is-member`, //是否是会员
    is_hand: `${BaseUrl}/api/mickey/is-hand`, //检测用户是否是第一次参与活动
    luck_bandit: `${BaseUrl}/api/mickey/luck-bandit`, //检测用户是否是第一次参与活动
    luck_draw: `${BaseUrl}/api/mickey/luck-draw`, //抽奖
    record: `${BaseUrl}/api/mickey/game/record`, //我的奖品
    get_coupon: `${BaseUrl}/api/mickey/get-coupon`, //领取优惠券
    update_coupon: `${BaseUrl}/api/mickey/user-coupon-update`, //领取优惠券
    disney: `${BaseUrl}/api/mickey/luck/disney`, //保存迪士尼地址
    invite: `${BaseUrl}/api/mickey/invite`, //为好友助力
    qrcode: `${BaseUrl}/api/mickey/qrcode`, //获取小程序码
    luckticket: `${BaseUrl}/api/mickey/luck-ticket`, //抽奖后获取优惠券
    updateticket: `${BaseUrl}/api/mickey/luck/ticket-update`, //更新抽奖发券的状态
    luck_ticket: `${BaseUrl}/api/mickey/luck-ticket`, //获取小程序码
    getAddress: `${BaseUrl}/api/mickey/get-address`, //获取迪士尼地址详情
    set_channel: `${BaseUrl}/api/mickey/set-channel`, //保存参活渠道
    
    
    
    
    

}