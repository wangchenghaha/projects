import configModel from '../models/wemallActiveConfig.mpdel';
const { url } = configModel;

export default {
    
    // 情人节活动
    love_init: `${url}/api/valentine/index`, // 初始化
    love_ismember: `${url}/api/valentine/isMember`, // 判断是否会员
    love_upload: `${url}/api/file/oss/upload`, // 上传音频文件
    love_updateRecord: `${url}/api/valentine/uploadRound`, // 上传音频
    love_share: `${url}/api/valentine/share`, // 获取分享链接
    love_pwd: `${url}/api/valentine/validation`, // 验证密码
    love_office: `${url}/api/valentine/jump/officer`, // 跳转官网上报
    love_btnAd: `${url}/api/valentine/customized/advert`, // 定制告白贺卡上报
    love_giftCard:`${url}/api/valentine/qrcode`, // 生成二维码
    love_giftView:`${url}/api/valentine/view`, // 查看贺卡
    love_coupon_update: `${url}/page/mini-update-coupon`,
    love_coupon_get: `${url}/page/shop/mini-is-getcoupon`
}