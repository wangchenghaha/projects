//var aimsUlr = "http://10.10.89.21:3000"; //目标服务器地址
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
const BaseUrl = 'https://bestseller-wechat.woaap.com'

export default {
    create_order : `${BaseUrl}/api/shopping/create-order`,   //下单
    form_id : `${BaseUrl}/api/shopping/form-id`,   //form_id
    share_token : `${BaseUrl}/api/shopping/share-token`,   //回调地址
    is_get_coupon : `${BaseUrl}/api/shopping/is-get-coupon`  //是否领券
}