import Conf from '../../config/index'

const BaseUrl = Conf.api
export default {
    getSession: `${BaseUrl}/api/miniapp/login`, // 静默授权获取sessionId, openid
    getSessionD: `${BaseUrl}/api/mini-share/advance-login`,  // 小程序非静默登录
    a_status: `${BaseUrl}/api/alice/index`, // 判断是否参与活动
    a_share: `${BaseUrl}/api/alice/share`, // 分享活动
    a_get340: `${BaseUrl}/api/alice/send-coupon`, // 分享好友送券
    a_card_status: `${BaseUrl}/api/alice/update-coupon`, // 修改券状态
    a_reward: `${BaseUrl}/api/alice/lucky-draw`, // 抽奖
    a_get_reward: `${BaseUrl}/api/alice/send-luck-coupon`, // 领取中奖券
    a_record: `${BaseUrl}/api/alice/luck-list`, // 抽奖记录
}