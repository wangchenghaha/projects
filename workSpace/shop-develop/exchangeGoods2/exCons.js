const config = require('../src/config.js')

const DEBUG = false

// const domain = DEBUG ? config.domain_test : config.domain //后台接口主机地址
const domain = config.domain //后台接口主机地址

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



const EX_WAY_EXPRESS = "exchangeExpress"
const EX_WAY_ATSHOP = "exchangeAtShopOnlineChoose"

const TEST_H_CODE = "H3201810161612453019"

const TYPE_NEARBY = "SHOP_TYPE_NEARBY"
const TYPE_REFUND = "SHOP_TYPE_REFUND"




const EX_PROTOCOL = `*此协议适用于无质量问题的商品
        
1、换货支持两种模式：门店换货或邮寄换货

2、以下情况不支持换货
A).已穿着或已洗涤的商品；
B).直接接触皮肤的内衣类商品；
C).已修改裤脚等加工后的商品；
D).商品吊牌、水洗标、配饰等有缺损；
E).因顾客原因导致沾污(包括但不限于有烟叶味、香味等异味)的商品；

3、换货商品需与收货时状态一致，如配件、吊牌、水洗标等齐全无损坏

4、仅调换尺码（同款同色）的换货需求，如商品价格提高，不需要再支付差价，如商品价格降低，支持退还差价
示例：保价条件：申请换货原商品和换货新商品为同款同色时
A). 向上保价：价格调高时，换货新商品价格为原商品实际支付价格。如原单中商品 A实付价为400元，申请换货时，换货新商品A（换不同尺码）的实时销售价为600元，则保价 换货新商品A为400元，无需支付差价200元。
B). 向下保价：价格调低时，换货新商品价格为实际实时销售价。如原单中的商品A实付价为400元，顾客在页面确认换货时，换货新商品A的实时销售价为350元，则保价换货新商品A为350元。

5、除调换尺码的换货需求，所换新商品的价格以原商品入库后、顾客在页面确认换货时的新商品的实时销售价格为准

6、如所换商品与原商品存在差价，差价部分多退少补
实际差额 = 【新商品总金额 – 优惠券金额 + 运费】- 原商品总金额
实际差额 > 0 少补，
实际差额 = 0 等价，
实际差额 < 0 多退

7、如优惠券溢出商品差价，优惠券不可兑换现金

8、在确认收到换货原商品及差价之前，我司有权不提供所换商品

9、如我司发现原商品有穿着痕迹、破损、污染、洗涤痕迹、非我司商品、没有购买记录的商品换货、恶意性的大量（同一订单超过5件商品）换货的情况，我司有权拒绝换货并需要寄方支付双向运费

10、如换货改为退货，顾客需在我司寄出换货商品前，修改换货申请为退货申请

11、对于已经发货的订单我们无法修改配送信息

12、顾客换货申请经我司审批完成后7天内未到店退回商品或将商品邮寄发出的，换货单将自动失效

13、使用微信立减金的订单不支持换货

14、赠送商品不支持换货

15、仅开通此业务的门店可提供换货服务 具体请询店内


`


const EX_RETURN_TIP_0 = `
如您逾期未填写退货物流信息，系统将自动关闭本次换货申请。
未经商家同意，请不要使用到付或平邮。
如有发票，请将发票一并寄回。
我们还提供了到店退货服务，门店验收无误实时退款。
`
const EX_RETURN_TIP_1 = `
如您逾期未到预约门店办理退货，系统将自动关闭本次换货申请。
如有发票，请将发票一并寄回。
如您不想到店退货，可选择邮寄退货。
`

const intentTestBean = {
  "area": "东城区",
  "bigOrderStore": null,
  "bigorderCode": "S2202008041758562999",
  "bindReason": "",
  "brandCode": "SELECTED",
  "canRefund": "Y",
  "channelCode": "MINIPROGRAM",
  "channelId": 9,
  "checkcode": null,
  "city": "北京市",
  "consignee": "蒋先生",
  "contactTel": "18811221122",
  "createTime": "2020-08-04 17:58:57",
  "customerNickname": "Joshua",
  "deliveryChangeType": null,
  "deliveryMode": "",
  "deliveryStore": "",
  "detailAddress": "北京市朝阳区光华路5号xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "exchangeAdditionalPrice": 0,
  "exchangeCode": null,
  "expressFare": 0,
  "expressPoList": [
    {
      "eChildList": [],
      "expressCompany": "顺丰速运",
      "expressOrderNo": "323243212",
      "goodsOrderId": "497467677179117111",
      "lResultState": ""
    }
  ],
  "finishTime": null,
  "fromBrand": null,
  "goodsOrderList": [
    {
      "applicationNum": null,
      "bigorderId": 487467676302508000,
      "brandCode": "SELECTED",
      "bsPromotionCode": null,
      "bsPromotionName": null,
      "cancleNum": null,
      "clearingType": 1,
      "colorName": "亮白色BRIGHT WHITE",
      "conponShareValue": 0,
      "createTime": "2020-08-04 17:58:57",
      "customRemark": "",
      "discount": 9,
      "discountLossReason": null,
      "exchangeCount": 0,
      "finishTime": null,
      "gcsSku": "42022J541A06400",
      "goodsColorCode": "42022J541A06",
      "goodsCount": 1,
      "goodsId": "497467677179117568",
      "goodsName": "褶皱蝙蝠袖中长衬衫连衣裙女",
      "goodsStatus": "WaitingReceive",
      "gscolPicPath": "/goodsImagePC/SELECTED/42022J541/42022J541A06/42022J541A06_p1.jpg",
      "gscolorPicId": 0,
      "id": "497467677179117568",
      "integralValue": null,
      "isGift": "N",
      "isJoin": "N",
      "isNormalPrice": null,
      "isSell": "false",
      "originalPrice": 0.02,
      "outstorageTime": "2020-08-04 18:03:39",
      "payStatus": null,
      "picBack": "",
      "picFront": "",
      "pointPrice": 0,
      "price": 0.02,
      "priceBeforePromotion": 0,
      "promotionDeduct": 0,
      "refundCount": 1,
      "returndNum": null,
      "ruleId": 0,
      "settlementPrice": 0,
      "shareMoney": null,
      "shipmentCount": null,
      "sizeName": "170/88A/L",
      "smPromotionCode": null,
      "stockout": "N",
      "stockoutCount": 0,
      "storeNum": null,
      "updateTime": "2020-08-04 18:06:13",
      "valid": true
    }
  ],
  "goodsTotalCount": 1,
  "id": "497467676302508033",
  "isHaveRefund": "2",
  "isSplitOrder": 1,
  "orderToken": "2393b289ca8acfc304489058922b383c",
  "orderType": "NORMAL",
  "outstorageTime": null,
  "pDescription": null,
  "pEndTime": null,
  "pMarkupPrice": null,
  "pPriceRule": null,
  "pQuantityRule": 0,
  "pStartTime": null,
  "pTypeCode": null,
  "payData": null,
  "payIntegral": 0,
  "payPrice": 0.02,
  "payToken": "",
  "payTokenTime": "",
  "payWay": "WeChatPay",
  "paymentRecord": {
    "alipayUid": null,
    "appid": "wxeb2f4c579a95f94e",
    "bigorderCode": "S2202008041758562991",
    "brandCode": "SELECTED",
    "channelId": "9",
    "createBy": null,
    "createTime": null,
    "mchId": "1274868701",
    "openid": "oEQ4S0ROjzXD1TwWcl5sULe8xLLI",
    "payId": 55,
    "payStatus": "",
    "payWay": "Wechatpay_mini",
    "remark": null,
    "updateBy": null,
    "updateTime": "2020-08-04 17:58:57"
  },
  "paymentTime": "2020-08-04 17:59:05",
  "personRequire": 0,
  "phone": "18811221122",
  "pintuanOrderPerson": null,
  "pintuanOrderType": null,
  "pintuanStatus": null,
  "promotionTypeName": null,
  "province": "北京市",
  "refundFlag": 2,
  "settlementTotal": null,
  "shareBy": null,
  "shareByShop": null,
  "shopGuideBindMethod": null,
  "sourceOrderCode": null,
  "status": "WaitingReceive",
  "warning": "N",
  "wxCouponValueTotal": 0
}


const auditTestBean = {
  "additionalPrice": 24.5,
  "applyShop": "89C6",
  "applySourceList": [
    {
      "colorName": "铁锈红IRON OXIDE MELANGE",
      "discount": 9,
      "exchangeGoodsAmount": 0.03,
      "goodsCount": 1,
      "goodsName": "复古灯芯绒男士夹克外套",
      "goodsOrderId": 515227290548830200,
      "gsMainPicPath": "/goodsImagePC/SELECTED/4194OM501/4194OM501E13/4194OM501E13_p1.jpg",
      "id": 2108,
      "originalPrice": 0.1,
      "pointPrice": 0,
      "price": 0.03,
      "sizeName": "195/112A/XXXL",
      "sku": "4194OM501E13460"
    }
  ],
  "applyTargetList": [
    {
      "colorName": "铁锈红IRON OXIDE MELANGE",
      "discount": 9,
      "exchangeGoodsAmount": 0.03,
      "goodsCount": 1,
      "goodsName": "复古灯芯绒男士夹克外套",
      "goodsOrderId": 515227290548830200,
      "gsMainPicPath": "/goodsImagePC/SELECTED/4194OM501/4194OM501E13/4194OM501E13_p1.jpg",
      "id": 2108,
      "originalPrice": 0.1,
      "pointPrice": 0,
      "price": 0.03,
      "sizeName": "195/112A/XXXL",
      "sku": "4194OM501E13460"
    }
  ],
  "consignee": "蒋先生",
  "contactTel": "18811221122",
  "couponValue": 0,
  "actualShop": "",
  "actualSourceList": [
    {
      "colorName": "铁锈红IRON OXIDE MELANGE",
      "discount": 9,
      "exchangeGoodsAmount": 0.03,
      "goodsCount": 1,
      "goodsName": "复古灯芯绒男士夹克外套",
      "goodsOrderId": 515227290548830200,
      "gsMainPicPath": "/goodsImagePC/SELECTED/4194OM501/4194OM501E13/4194OM501E13_p1.jpg",
      "id": 2108,
      "originalPrice": 0.1,
      "pointPrice": 0,
      "price": 0.03,
      "sizeName": "195/112A/XXXL",
      "sku": "4194OM501E13460"
    }
  ],
  "actualTargetList": [
    {
      "colorName": "铁锈红IRON OXIDE MELANGE",
      "discount": 9,
      "exchangeGoodsAmount": 0.03,
      "goodsCount": 1,
      "goodsName": "复古灯芯绒男士夹克外套",
      "goodsOrderId": 515227290548830200,
      "gsMainPicPath": "/goodsImagePC/SELECTED/4194OM501/4194OM501E13/4194OM501E13_p1.jpg",
      "id": 2108,
      "originalPrice": 0.1,
      "pointPrice": 0,
      "price": 0.03,
      "sizeName": "195/112A/XXXL",
      "sku": "4194OM501E13460"
    }
  ],
  "createTime": "2018-10-22 14:14:59",
  "exchangeCode": "H3201810221414583002",
  "exchangeReason": "{\"D\":\"7天无理由退换货\"}",
  "evidencePics": "http://db.vm.cn/assets/wechat/SELECTED/service/exchange/upload_4572bfa726db3924f89107cd69bcb062.png,http://db.vm.cn/assets/wechat/SELECTED/service/exchange/upload_4572bfa726db3924f89107cd69bcb062.png",
  "exchangeType": "MAIL",
  "expressCompany": "测试顺丰公司",
  "expressNo": "1111111111111",
  "mainPicPath": "/goodsImagePC/VEROMODA/318102505/318102505S59/318102505S59_p1.jpg",
  "neworderCode": "41320181025102414587",
  "oriAddress": "原来的地址",
  "oriConsignee": "局座andy",
  "oriContactTel": "18811112222",
  "oriorderCode": "31320181017180645127",
  "payType": "LESS",
  "receiveTime": "2018-10-25 15:20:26",
  "refundCode": null,
  "remark": null,
  "sourceGoodsAmount": 174.5,
  "sourceGoodsCount": 1,
  "status": "CREATED",
  "targetGoodsAmount": 199,
  "targetGoodsCount": 1,
  "updateTime": "2020-10-22 16:51:16"
}

const refundShopTestBean = {
  "actualShop": "89C6",
  "actualSourceList": [],
  "actualTargetList": [],
  "additionalPrice": 0,
  "applyShop": "89C6",
  "applySourceList": [
    {
      "colorName": "铁锈红IRON OXIDE MELANGE",
      "discount": 9,
      "exchangeGoodsAmount": 0.03,
      "goodsCount": 1,
      "goodsName": "复古灯芯绒男士夹克外套",
      "goodsOrderId": 515226893125943300,
      "gsMainPicPath": "/goodsImagePC/SELECTED/4194OM501/4194OM501E13/4194OM501E13_p1.jpg",
      "id": 2104,
      "originalPrice": 0.1,
      "pointPrice": 0,
      "price": 0.03,
      "sizeName": "195/112A/XXXL",
      "sku": "4194OM501E13460"
    }
  ],
  "applyTargetList": [
    {
      "colorName": "铁锈红IRON OXIDE MELANGE",
      "discount": 9,
      "exchangeGoodsAmount": 0.03,
      "goodsCount": 1,
      "goodsName": "复古灯芯绒男士夹克外套",
      "goodsOrderId": null,
      "gsMainPicPath": "/goodsImagePC/SELECTED/4194OM501/4194OM501E13/4194OM501E13_p3.jpg",
      "id": 2105,
      "originalPrice": 0.1,
      "pointPrice": 0,
      "price": 0.03,
      "sizeName": "165/88A/XS",
      "sku": "4194OM501E13340"
    }
  ],
  "evidencePics": "http://db.vm.cn/assets/wechat/SELECTED/service/exchange/upload_4572bfa726db3924f89107cd69bcb062.png,http://db.vm.cn/assets/wechat/SELECTED/service/exchange/upload_4572bfa726db3924f89107cd69bcb062.png",
  "consignee": "巨作剧作举座",
  "contactTel": "18812341234",
  "couponValue": null,
  "createTime": "2020-09-23 15:06:10",
  "exchangeCode": "HS202009231506100003",
  "exchangeDescription": "",
  "exchangeReason": "7天无理由退换货",
  "exchangeType": "STORE",
  "expressCompany": "测试顺丰公司",
  "expressNo": "1111111111111",
  "mainPicPath": "/goodsImagePC/SELECTED/4194OM501/4194OM501E13/4194OM501E13_p1.jpg",
  "neworderCode": null,
  "oriAddress": "测试测试测试测试测试测试测试测试测试",
  "oriConsignee": "剧作巨作巨作",
  "oriContactTel": "18812341234",
  "oriorderCode": "S2202009221807436646",
  "payType": "EQUAL",
  "receiveTime": null,
  "refundCode": null,
  "refundShop": "91F4",
  "remark": null,
  "sourceGoodsAmount": 0.03,
  "sourceGoodsCount": 1,
  "status": "BUYER_MAILED",
  "targetGoodsAmount": 0.03,
  "targetGoodsCount": 1,
  "updateTime": "2020-10-14 16:51:16"
}

const prepareTestBean = changeType(auditTestBean, "STOCK_FAIL")

const uploadTrackingTestBean = changeType(auditTestBean, "CONFIRM_TYPE")

const mailedTestBean = changeType(auditTestBean, "BUYER_MAILED")//已寄回待入库/待卖家收货

const receivedTestBean = changeType(auditTestBean, "RECEIVED")//待支付
const waitShipTestBean = changeType(auditTestBean, "WAIT_SHIP")//等待卖家发货
const shippedTestBean = changeType(auditTestBean, "SHIPPED")//等待买家收货
const closedTestBean = changeType(refundShopTestBean, "CLOSED")//已关闭
const doneTestBean = changeType(refundShopTestBean, "COMPLETE")//换货成功

function changeType(bean, newStatus) {
  let newB = JSON.parse(JSON.stringify(bean))
  newB.status = newStatus
  return newB
}

export {
  DEBUG,
  CREATED,
  CHECK_VALID,
  CHECK_FAIL,
  CONFIRM_TYPE,
  STOCKING,
  STOCKED,
  STOCK_FAIL,
  BUYER_MAILED,
  RECEIVED,
  WAIT_SHIP,
  SHIPPED,
  CLOSED,
  COMPLETE,
  EX_WAY_EXPRESS,
  EX_WAY_ATSHOP,
  EX_PROTOCOL,
  EX_RETURN_TIP_0,
  EX_RETURN_TIP_1,
  TYPE_NEARBY,
  TYPE_REFUND,

  TEST_H_CODE,
  intentTestBean,
  auditTestBean,
  refundShopTestBean,

  prepareTestBean,
  uploadTrackingTestBean,
  mailedTestBean,
  receivedTestBean,
  waitShipTestBean,
  shippedTestBean,
  closedTestBean,
  doneTestBean,

}

const prefix = '/api';  //接口前缀
const newPrefix = '/rest';  //接口前缀
exports.URL = {
  // 创建换货订单： /rest/exchange/create
  EXCHANGE_ORDER_CREATE: `${domain}${newPrefix}/exchange/create`,
  // 查询换货单列表：  /rest/exchange/list
  EXCHANGE_ORDER_LIST: `${domain}${newPrefix}/exchange/list`,
  // 查询换货详情： /rest/exchange/detail
  EXCHANGE_ORDER_DETAIL: `${domain}${newPrefix}/exchange/detail`,
  // @deprecated 更新换货方式 exchangeorder/exchangeTypeUpdate
  EXCHANGE_ORDER_EXCHANGE_TYPE_UPDATE: `${domain}${prefix}/exchangeorder/exchangeTypeUpdate`,
  // 获取换发商品价格信息(需要换货单号) /rest/exchange/getExchangePrice
  EXC_ORDER_PRICE_CALC: `${domain}${newPrefix}/exchange/getExchangePrice`,
  // 获取换发商品价格信息(不需要换货单号) /rest/exchange/calculatePrice
  EXC_ORDER_PRICE_CALC_2: `/${newPrefix}/exchange/calculatePrice`,
  // 更新换货物流信息  /rest/exchange/update/express
  EXC_ORDER_UPLOAD_EXPRESS_INFO: `${domain}${newPrefix}/exchange/update/express`,
  // 确认换货: /rest/exchange/update/confirm
  EXC_CONFIRM: `${domain}${newPrefix}/exchange/update/confirm`,
  // 换货，顾客确认收货 /rest/exchange/update/confirmReceived
  EXC_CONFIRM_RECEIPT: `${domain}${newPrefix}/exchange/update/confirmReceived`,
  // 关闭换货单 /rest/exchange/close
  EXC_ORDER_CLOSE: `${domain}${newPrefix}/exchange/close`,
}
