import config from '../config/index'
const { apiUrl,questionUrl } = config;
export default {
    //玛丽猫活动
    cat_isHandle: `${apiUrl}/api/mariecat/isHandle`, // 初始化接口
    cat_login: `${apiUrl}/api/campagin/login`, // 玛丽猫登录
    cat_userInfo: `${apiUrl}/api/campagin/userInfo`, // 个人解密
    cat_signList: `${apiUrl}/api/mariecat/signList`, // 签到列表
    cat_sign: `${apiUrl}/api/mariecat/sign`, // 签到
    cat_rankList: `${apiUrl}/api/mariecat/rankList`, // 排行榜
    cat_gameStart: `${apiUrl}/api/mariecat/gameStart`, // 开始游戏
    cat_reportScore: `${apiUrl}/api/mariecat/reportScore`, // 游戏结果上报
    cat_share: `${apiUrl}/api/mariecat/share`, // 分享
    cat_luck: `${apiUrl}/api/mariecat/luck`, // 抽奖
    cat_getAward: `${apiUrl}/api/mariecat/getAward`, // 领券
    cat_myAwards: `${apiUrl}/api/mariecat/myAwards`, // 我的奖品
    cat_address: `${apiUrl}/api/mariecat/address`, // 保存地址
    cat_luckSignAward: `${apiUrl}/api/mariecat/luckSignAward`, // 签到领取奖品
    cat_receive: `${apiUrl}/api/mariecat/receive`, // 更新领券状态
    cat_isMember: `${apiUrl}/api/campagin/isMember`, // 判断是否是会员

    // 扭蛋机
    egg_index: `${apiUrl}/api/egg/index`, // 请求图片
    egg_luck: `${apiUrl}/api/egg/luck`, // 抽奖
    egg_receive: `${apiUrl}/api/egg/receive/award`, // 领取
    egg_update: `${apiUrl}/api/egg/update/received`, // 更新领取状态
    egg_ismember: `${apiUrl}/api/egg/member`, // 判断是否会员
    egg_share: `${apiUrl}/api/egg/share`, // 分享
    egg_records: `${apiUrl}/api/egg/records`, // 我的奖品列表

    //商家券
    storecoupon_record: `${apiUrl}/api/shop/coupon/record`, //商家券详情
    //调查问卷
    qs_init: `${questionUrl}/api/evaluate/index`,//初始化接口
    qs_sub: `${questionUrl}/api/evaluate/save`,//提交题目
    qs_member: `${questionUrl}/api/evaluate/member`,//是否是会员
    qs_luck: `${questionUrl}/api/evaluate/luck/url`,//去抽奖上报pvuv
    qs_jump: `${questionUrl}/api/evaluate/jump/url`,//跳转官网pvuv

}