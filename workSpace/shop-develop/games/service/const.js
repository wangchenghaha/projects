//加载配置
const config = require('../../src/config.js');
const cdn = config.cdn; //内容分发网络主机地址
const brand = config.brand; //当前品牌
//接口前缀
const newPrefix = '/rest';
// 抢红包前缀
const robRedBagPrefix = `${newPrefix}/game/grab`
// 拆快递前缀
const courierPrefix = `${newPrefix}/game/cut`
// 圣诞前缀
const christmasPrefix = `${newPrefix}/game/skiing`;
// 视频号抽奖
const WX_VIDEO = `${newPrefix}/game/extAward`
// 接红包
const redEvnelop = `${newPrefix}/game/redRain`
// 打年兽
const attackNian = `${newPrefix}/game/beast`;
// 年度账单
const yearBillFix = `${newPrefix}/orderBill`;
// 春游
const springOuting = `${newPrefix}/game/spring`;
// 抽奖
const lottery = `${newPrefix}/game/bigWheel`;
// 翻拍抽奖
const sharpEyes = `${newPrefix}/game/flop`;
// 红包雨-充能
const redRain_chargedPrefix = `${newPrefix}/game/energy`

exports.URL_ACTIVITY = {
  /**
   * 抢红包接口
   */
  // 创建抢红包活动
  GRAB_ADD_ACTIVITY: `${robRedBagPrefix}/addActivity`,
  // 获取优惠券兑奖记录列表
  GRAB_COUPON_RECORDS: `${robRedBagPrefix}/couponRecords`,
  // 获取游戏时间范围
  GRAB_GET_ACTIVITY_TIME: `${robRedBagPrefix}/getActivityTime`,
  // 获取活动红包领取列表
  GRAB_LIST_REDS: `${robRedBagPrefix}/listReds`,
  // 查询用户信息
  GRAB_QUERY_USER: `${robRedBagPrefix}/queryUserPoints`,
  // 创建用户信息
  GRAB_CREAT_USER: `${robRedBagPrefix}/addUserPoints`,
  // 抢红包详情
  GRAB_REDS_DETAIL: `${robRedBagPrefix}/getActivityInfo`,
  // 抢红包
  GRAB_REDS: `${robRedBagPrefix}/grab`,
  // 获取我的活动红包领取列表
  GRAB_MY_REDS: `${robRedBagPrefix}/listMyReds`,

  // 查询当前抽奖信息
  GET_EXT_AWARD: `${WX_VIDEO}/getExtAward`,
  // 查询用户抽奖信息
  GET_EXT_USER: `${WX_VIDEO}/getExtUser`,
  // 参与抽奖
  ADD_EXT_USER: `${WX_VIDEO}/addExtUser`,
  // 查询当前抽奖信息
  GET_AWARD_AND_SUCCESS: `${WX_VIDEO}/getAwardAndSuccess`,



}
// 本地存储
exports.KEYSTORAGE_ACTIVITY = {
  //  抢红包用户ID
  robRedBagUserInfo: 'robRedBagUserInfo'
}
/**
 *  拆快递接口
 */
exports.COURIER = {

  // 获取游戏时间范围
  GETGAMETIME: `${courierPrefix}/getActivityTime`,
  // 查询用户
  SEARCHUSERINFO: `${courierPrefix}/queryUserPoints`,
  // 创建用户
  CREATUSERINFO: `${courierPrefix}/addUserPoints`,
  // 好友助力列表
  HELPLIST: `${courierPrefix}/listHelpForIndex`,
  // 开启宝箱
  OPENBOX: `${courierPrefix}/openBox`,
  // 游戏开始
  STARTGAME: `${courierPrefix}/gameStart`,
  // 游戏结束
  ENDGAME: `${courierPrefix}/gameEnd`,
  // 优惠券列表
  YHQLIST: `${courierPrefix}/listCoupon`,
  // 领取优惠券
  LINGQUYHQ: `${courierPrefix}/getCoupon`,
  // 兑换记录
  DUIHUANJILU: `${courierPrefix}/couponRecords`,
  // 助力
  ZHULI: `${courierPrefix}/addHelp`,
}
/**
 *  圣诞接口
 */
exports.CHRISTMAS = {

  // 获取游戏时间范围
  GETGAMETIME: `${christmasPrefix}/getActivityTime`,
  // 查询用户
  SEARCHUSERINFO: `${christmasPrefix}/queryUserPoints`,
  // 创建用户
  CREATUSERINFO: `${christmasPrefix}/addUserPoints`,
  // 好友助力列表
  HELPLIST: `${christmasPrefix}/listHelpForIndex`,
  // 开启宝箱
  OPENBOX: `${christmasPrefix}/openBox`,
  // 游戏开始
  STARTGAME: `${christmasPrefix}/gameStart`,
  // 游戏结束
  ENDGAME: `${christmasPrefix}/gameEnd`,
  // 优惠券列表
  YHQLIST: `${christmasPrefix}/listCoupon`,
  // 领取优惠券
  LINGQUYHQ: `${christmasPrefix}/getCoupon`,
  // 兑换记录
  DUIHUANJILU: `${christmasPrefix}/couponRecords`,
  // 助力
  ZHULI: `${christmasPrefix}/addHelp`,
}

exports.REDRAIN = {
  // 红包雨 start
  // 查询用户信息
  GETUSERINFO: `${redEvnelop}/queryUserPoints`,
  // 创建用户
  CREATEUSER: `${redEvnelop}/addUserPoints`,
  // 获取优惠券列表
  GETCOUPONLIST: `${redEvnelop}/couponRecords`,
  // 游戏开始
  STARTGAME: `${redEvnelop}/gameStart`,
  // 游戏结束
  GAMEOVER: `${redEvnelop}/gameEnd`,
  // 开宝箱
  OPENBOX: `${redEvnelop}/openBox`,
  // 助力好友获得券
  ADDHELP: `${redEvnelop}/addHelp`,
  // 获取游戏时间
  GETACTIVITYTIME: `${redEvnelop}/getActivityTime`,
  // 领取分享券
  SHARECOUPON: `${redEvnelop}/shareGift`,
  // 红包雨 end

}
/**
 *  打年兽
 */
exports.NIAN = {

  // 获取游戏时间范围
  GETGAMETIME: `${attackNian}/getActivityTime`,
  // 查询用户
  SEARCHUSERINFO: `${attackNian}/queryUserPoints`,
  // 创建用户
  CREATUSERINFO: `${attackNian}/addUserPoints`,
  // 查询获得的生肖列表
  SEARCHZODIACLIST: `${attackNian}/userZodiac`,
  // 开盲盒
  OPENBOX: `${attackNian}/openBlindBox`,
  // 打年兽
  ATTACK: `${attackNian}/fightBeast`,
  // 我的奖品
  MYPRIZE: `${attackNian}/couponRecords`,
  // 终极大礼包
  LASTPRIZE: `${attackNian}/openBigGift`,
  // 助力
  ADDZHULI: `${attackNian}/addHelp`,
}
/**
 *  年度账单
 */
exports.YEARBILL = {

  // 年度账单数据
  YEARBILLAPI: `${yearBillFix}/getOrderBill`,
  // 转发发券
  SENDCOUPHON: `${yearBillFix}/sendCoupon`,
}

/**
 *  红包雨-充能
 */
 exports.REDRAINCHARGED = {
  //  游戏配置
  GAMECONFIG : `${redRain_chargedPrefix}/config`,
  // 查询用户
  SEARCHUSERINFO : `${redRain_chargedPrefix}/user/get`,
  // 创建用户
  CREATEUSER : `${redRain_chargedPrefix}/user/add`,
  // 我的奖品
  MYPRIZE : `${redRain_chargedPrefix}/user/coupon`,
  // 任务列表
  TASKLIST : `${redRain_chargedPrefix}/task`,
  // 完成的任务列表
  SURETASKLIST : `${redRain_chargedPrefix}/user/task`,
  // 完成任务
  FINISHTASK : `${redRain_chargedPrefix}/user/taskFinish`,
  // 游戏结束
  GAMEOVER : `${redRain_chargedPrefix}/user/gameOver`,
  // 助力
  HELP : `${redRain_chargedPrefix}/user/helpAdd`,
  // 充能
  CHARGED : `${redRain_chargedPrefix}/user/charge`
}



/**
 * only * JJ 联名活动
 */
exports.ONLYXJJ = {
  // 获取页面内容json
  GETCONTENTURL: `${cdn}/assets/wechat/${brand}/onlyXjackjones.json?v=32`,
  // 获取优惠券
  GETCOUPON: `${newPrefix}/jointBrand/sendCoupon`,
  // 查询是否已发券
  QUERYCOUPON: `${newPrefix}/jointBrand/checkSendCoupon`,
}

exports.SPRINGOUTING = {
  // 查询用户信息
  GETUSERINFO: `${springOuting}/queryUserPoints`,
  // 创建用户
  CREATEUSER: `${springOuting}/addUserPoints`,
  // 获取优惠券列表
  GETCOUPONLIST: `${springOuting}/couponRecords`,
  // 游戏开始
  STARTGAME: `${springOuting}/gameStart`,
  // 游戏结束
  GAMEOVER: `${springOuting}/gameEnd`,
  // 开宝箱
  OPENBOX: `${springOuting}/openBox`,
  // 助力好友获得券
  ADDHELP: `${springOuting}/addHelp`,
  // 获取游戏时间
  GETACTIVITYTIME: `${springOuting}/getActivityTime`,
  // 领取分享券
  HELPFORINDEX: `${springOuting}/listHelpForIndex`,
  // 用户排行榜
  UESRRANK: `${springOuting}/userRank`,
  // 领取台阶数奖励
  OPENSTEPGIFT: `${springOuting}/openStepsGift`,
  // 台阶数奖励领取记录
  OPENSTEPRECORDS: `${springOuting}/stepsGiftRecords`,
  // 好友排行榜
  FRIENDSRANKS: `${newPrefix}/game/userRank`,
  //FRIENDSRANKS: `${springOuting}/stepsGiftRecords`,
  // 世界排行榜
  RANKLISTS: `${springOuting}/rankInfo`,
}

exports.LOTTERY = {
  // 奖品列表
  GETGIFTLIST: `${lottery}/listPrize`,
  // 中奖记录列表
  GETGIFTRECORDS: `${lottery}/listPrizeRecord`,
  // 开始抽奖
  STARTGAME: `${lottery}/prize`,
  // 我的中奖记录列表
  MYGIFTLIST: `${springOuting}/listPersonPrizeRecord`,
}

exports.SECKILL = {
  GETSECKILLLIST: `${newPrefix}/seckill/list`,
}


exports.SHARPEYES = {
  // 获取游戏时间
  GETGAMECONFIG: `${sharpEyes}/config`,
  // 创建用户
  CREATEUSER: `${sharpEyes}/user/add`,
  // 查询用户信息
  GETUSERINFO: `${sharpEyes}/user/get`,
  // 获取优惠券列表
  GETUSERCOUPONLIST: `${sharpEyes}/user/coupon`,
  // 获取优惠券列表
  GETCOUPONLIST: `${sharpEyes}/coupon`,
  // 获取用户卡片列表
  GETUSERCARD: `${sharpEyes}/user/card`,
  // 游戏结束
  GAMEOVER: `${sharpEyes}/user/game/over`,
  // 好友助力
  ADDHELP: `${sharpEyes}/user/help/add`,
  // 兑换优惠券
  EXCHANGECOUPON: `${sharpEyes}/coupon/exchange`,
  // 领取大礼包
  OPENBIGGIFT: `${sharpEyes}/user/openBigGift`,

  //打投列表
  VOTE_LIST: `${newPrefix}/vote/list`,
  // 投票
  DO_VOTE: `${newPrefix}/vote/doVote`,
  // 分享
  SHARE_VOTE: `${newPrefix}/vote/share`,

  // 获取打投规则
  SHOOTINGRULES: `${cdn}/assets/wechat/${brand}/shootingRules.json?v=${Date.now()}`
}