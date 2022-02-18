// in auditResults Page :----------
const CREATED = "CREATED";//已创建待审核 换货审核中
const CHECK_VALID = "CHECK_VALID";//审核成功
const CHECK_FAIL = "CHECK_FAIL";//审核失败

const CONFIRM_TYPE = "CONFIRM_TYPE";//待寄回或到店 (退回原商品/或者 到店中)

// in prepareGoodsStatus Page :----------
const STOCKING = "STOCKING";//店铺备货中
const STOCKED = "STOCKED";//店铺备货完成
const STOCK_FAIL = "STOCK_FAIL";//备货失败

// in orderStatusNew Page :----------
const BUYER_MAILED = "BUYER_MAILED";//已寄回待入库/待卖家收货
const RECEIVED = "RECEIVED";//待支付
const WAIT_SHIP = "WAIT_SHIP";//等待卖家发货
const SHIPPED = "SHIPPED";//等待买家收货
const CLOSED = "CLOSED";//已关闭
const COMPLETE = "COMPLETE";//换货成功

const DEBUG = false;

const EX_WAY_EXPRESS = "exchangeExpress"
const EX_WAY_ATSHOP = "exchangeAtShopOnlineChoose"

module.exports = {
    CREATED: CREATED,
    CHECK_VALID: CHECK_VALID,
    CHECK_FAIL: CHECK_FAIL,
    CONFIRM_TYPE: CONFIRM_TYPE,
    STOCKING: STOCKING,
    STOCKED: STOCKED,
    STOCK_FAIL: STOCK_FAIL,
    BUYER_MAILED: BUYER_MAILED,
    RECEIVED: RECEIVED,
    WAIT_SHIP: WAIT_SHIP,
    SHIPPED: SHIPPED,
    CLOSED: CLOSED,
    COMPLETE: COMPLETE,
    DEBUG: DEBUG,
    EX_WAY_EXPRESS,
    EX_WAY_ATSHOP,

}
