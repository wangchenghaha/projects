//加载配置
const config = require('../../src/config.js');
const cdn = config.cdn; //内容分发网络主机地址
const brand = config.brand; //当前品牌
//接口前缀
const newPrefix = '/rest';
// 抢红包前缀
const trendInfo = `${newPrefix}/trendInfo`


exports.URL_TRENDINFO = {
    BINDVISITOR : `${trendInfo}/bindVisitor`,
    // 潮流资讯列表
    TRENDINFOLIST: `${trendInfo}/list`,
    // 潮流资讯旧接口
    TRENDINFOLISTTWO: `${newPrefix}/fashionNews/list`,
    // 潮流资讯详情
    TRENDINFODETAIL: `${trendInfo}/detail`,
    // 潮流资讯编辑个人中心
    TRENDINFOEDITUSER: `${trendInfo}/editUser`,
    // 潮流资讯取消关注
    TRENDINFOCANCELFOCUS: `${trendInfo}/cancelFocus`,
    // 潮流资讯点赞列表
    TRENDINFOCANCELPRAISE: `${trendInfo}/cancelPraise`,
    // 潮流资讯点赞
    TRENDINFOPAISE: `${trendInfo}/praise`,
    // 潮流资讯关注
    TRENDINFOFOCUS: `${trendInfo}/focus`,
    // 潮流资讯访客个人中心
    TRENDINFOVISTORCENTER: `${trendInfo}/visitorCenter`,
    // 潮流资讯作者个人中心
    TRENDINFOAUTORCENTER: `${trendInfo}/authorCenter`,
    // 盲盒商品
    BLIND_GOODS: `${cdn}/assets/common/ONLY/json/mysteryBox.json`,
    // 盲盒库存
    BLIND_BOX_STOCK: `${newPrefix}/h5Promotion/getBlindBoxRuleStock`,

}
exports.ACTIVITY = {
  // 主播本周推荐
  RECOMMENDED_WEEK: `${newPrefix}/recommended/getPage`,
}
