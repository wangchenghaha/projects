//定义常量

//加载配置
const config = require('./config.js');
const DEV = config.DEV; // 是否测试环境
const domain = config.domain //后台接口主机地址
const cdn = config.cdn; //内容分发网络主机地址
const brand = config.brand; //当前品牌
const prefix = '/api';  //接口前缀
const newPrefix = '/rest';  //接口前缀
const domainETO = config.domainETO;
// const domainETO = 'http://atest.woaap.com:11010';
// const API_WOAPP = 'https://api-test.woaap.com';
const API_WOAPP = 'https://api.woaap.com';
const weMemberHost = config.bestsellerWoaap;
//内容分发网络地址
exports.URL_CDN = {

  //导购微商城LABEL
  LABEL_WSC: `${cdn}/assets/common/pub/image/dg/label-wsc.png`,

  //LOGO-黑色长方形
  LOGO_BLACK_RECT: `${cdn}/assets/common/${brand}/image/logo-black-rect.png`,
  //LOGO-黑色长方形-OY
  LOGO_BLACK_RECT_OL: `${cdn}/assets/common/ONLY/image/logo-black-rect.png`,
  //LOGO-黑色长方形-JJ
  LOGO_BLACK_RECT_JJ: `${cdn}/assets/common/JACKJONES/image/logo-black-rect.png`,
  //LOGO-黑色长方形-VM
  LOGO_BLACK_RECT_VM: `${cdn}/assets/common/VEROMODA/image/logo-black-rect.png`,
  //LOGO-黑色长方形-ST
  LOGO_BLACK_RECT_ST: `${cdn}/assets/common/SELECTED/image/logo-black-rect.png`,
  //LOGO-黑色长方形-BS
  LOGO_BLACK_RECT_BS: `${cdn}/assets/common/BESTSELLER/image/logo-black-rect.png`,
  //LOGO-黑色长方形-NI
  LOGO_BLACK_RECT_NI: `${cdn}/assets/common/NAMEIT/image/logo-black-rect.png`,

  //LOGO-白色长方形
  LOGO_WHITE_RECT: `${cdn}/assets/common/${brand}/image/logo-white-rect.png`,

  //LOGO-黑色正方形
  LOGO_BLACK_SQUARE: `${cdn}/assets/common/${brand}/image/logo-black-square.png`,

  //普卡图标
  VIP_CARD_BASIC: `${cdn}/assets/common/${brand}/image/vip_card_basic.jpg`,
  //银卡图标
  VIP_CARD_SILVER: `${cdn}/assets/common/${brand}/image/vip_card_silver.jpg`,
  //金卡图标
  VIP_CARD_GOLDEN: `${cdn}/assets/common/${brand}/image/vip_card_golden.jpg`,

  //导购模板封面图(巴萨足球俱乐部授权男装秋羽绒服外套)
  SAA_MB_COVER: `${cdn}/assets/common/pub/image/dg/template/cover-217312513F38.jpg`,

  //会员界面 banner 图(横向图)
  MEMBER_CENTER_BANNER: `${cdn}/assets/common/${brand}/image/member_banner.jpg`,

  //订单页未完成图标
  STATUS_ORDER_NO: `${cdn}/assets/common/pub/image/order_no_complete.png`,
  //订单页完成图标
  STATUS_ORDER_OK: `${cdn}/assets/common/pub/image/order_complete.png`,

  //修改个人资料背景图
  MEMBER_MODIFY_BG: `${cdn}/assets/common/${brand}/image/member_modify_bg.jpg`,

  //品牌活动背景图
  BRAND_ACTIVITY_BG: `${cdn}/assets/common/${brand}/image/ba_bg.jpg`,

  //积分商城顶部背景图
  POINT_TOP_BG: `${cdn}/assets/common/${brand}/image/point_bg.jpg`,

  //视频遮罩图
  VIDEO_TOP: `${cdn}/assets/common/${brand}/image/video_top.jpg`,

  //我的积分VIP卡片背景
  POINT_VIP_BG: `${cdn}/assets/common/${brand}/image/point_vipcard_bg.png`,

  //分享封面图
  COVER_SHARE: `${cdn}/assets/common/${brand}/image/cover_share.jpg`,

  //导购二维码背景
  // GUIDE_QRCODE_BG: `${cdn}/assets/common/${brand}/image/guide_qrcode_bg.png`,
  //带参二维码
  PARAM_QRCODE: `${cdn}/assets/common/${brand}/image/param_qrcode.jpg`,
  //微商城卡片背景1
  WSZT_CARD_BG01: `${cdn}/assets/common/${brand}/image/wszt_card_bg01.png`,
  //微商城卡片背景1
  WSZT_CARD_BG02: `${cdn}/assets/common/${brand}/image/wszt_card_bg02.png`,
  //微商城卡片背景1
  WSZT_CARD_BG03: `${cdn}/assets/common/${brand}/image/wszt_card_bg03.png`,
  //微商城卡片背景1
  WSZT_CARD_BG04: `${cdn}/assets/common/${brand}/image/wszt_card_bg04.png`,
  // dgbpay订单LOGO
  DGBPAY_LOGO: `${cdn}/assets/common/${brand}/image/logo-black-rect.png`,

  //积分商城轮播图标题title
  POINT_TITLE_OL: `${cdn}/assets/common/ONLY/image/point_title.png`,
  POINT_TITLE_JJ: `${cdn}/assets/common/JACKJONES/image/point_title.png`,
  POINT_TITLE_VM: `${cdn}/assets/common/VEROMODA/image/point_title.png`,
  POINT_TITLE_ST: `${cdn}/assets/common/SELECTED/image/point_title.png`,
  POINT_TITLE_NI: `${cdn}/assets/common/NAMEIT/image/point_title.png`,
  POINT_TITLE_JL: `${cdn}/assets/common/BESTSELLER/image/jl.png`,

  PRICE_TIP: `${cdn}/assets/common/image/price_tip.jpg`,
  // 图片尺寸
  IMGSIZE108178: `108178`,
  IMGSIZE123197: `123197`,
  IMGSIZE185296: `185296`,
  IMGSIZE240400: `240400`,
  IMGSIZE313500: `313500`,
  IMGSIZE360640: `360640`,
  IMGSIZE750750: `750750`,
  IMGSIZE6241000: `6241000`,
  IMGSIZE7201280: `7201280`,

  //附近门店 换货 门店店铺图片
  PIC_NEARBY_SHOP_BG: `${cdn}/assets/common/${brand}/image/pic_nearby_shop_bg.jpg`,
  //附近门店 店铺图片 新
  PIC_NEARBY_SHOP_BG_2: `${cdn}/assets/common/${brand}/image/pic_nearby_shop_bg_3.jpg`,
  //附近门店 店铺活动图
  PIC_NEARBY_SHOP_ACTIVITY_DIAGRAM: `${cdn}/assets/common/${brand}/image/pic_nearby_shop_activity_diagram.jpg`,

  //附近门店 会员权益图片
  ICON_RIGHTS_AND_INTERESTS_1: `${cdn}/assets/common/pub/image/icon_integral_7.png`,
  ICON_RIGHTS_AND_INTERESTS_2: `${cdn}/assets/common/pub/image/icon_gift_7.png`,
  ICON_RIGHTS_AND_INTERESTS_3: `${cdn}/assets/common/pub/image/icon_coupon_7.png`,
  ICON_RIGHTS_AND_INTERESTS_4: `${cdn}/assets/common/pub/image/icon_reward_3.png`,

  //附近门店 店铺详情 会员卡
  MEMBERSHIP_CARD_ORDINARY: `${cdn}/assets/h5/${brand}/image/traditionalCard.png`,
  MEMBERSHIP_CARD_SILVER: `${cdn}/assets/h5/${brand}/image/silverCard.jpg`,
  MEMBERSHIP_CARD_GOLDEN: `${cdn}/assets/h5/${brand}/image/goldenCard.jpg`,
  MEMBERSHIP_CARD_PLATINUM: `${cdn}/assets/h5/${brand}/image/platinaCard.jpg`,


  JLCOUPONBG: `${cdn}/assets/common/image/coupon_leftbg.png`,
  COLLECTGOOD: `${cdn}/assets/common/${brand}/image/collect_good.png`,
  SHOWGETIWATCH: `${cdn}/assets/common/image/show_getiwatch.jpg`,
  SHOWDRAWER: `${cdn}/assets/common/image/drawer.jpg`,

  NEW_GOODS: `${cdn}/coverPic/newGoods.png`,
  SALEQTY: `${cdn}/coverPic/salesQty.png`,
  DISCOUNTIMG: `${cdn}/coverPic/discountImg.png`,

  //导购二维码背景
  GUIDE_QRCODE_TITLE: `${cdn}/assets/common/${brand}/image/qr_title.png`,
  GUIDE_QRCODE_BACKGROUND: `${cdn}/assets/common/${brand}/image/qr_background.jpg`,

  GUIDE_QRCODE_DISCOUNT: `${cdn}/assets/common/image/qr_discount.png`,
  GUIDE_QRCODE_GIFT: `${cdn}/assets/common/image/qr_gift.png`,
  GUIDE_QRCODE_SUPERISE: `${cdn}/assets/common/image/qr_superise.png`,
}

//后台接口主机地址
exports.URL = {
  // 首页JOSN文件
  MAINJSON: `${cdn}/assets/wechat/${brand}/main.json`,
  HOME: `${newPrefix}/V2/home/query`,
  // 首页预览
  PREVEW_JSON: `${cdn}/assets/wechat/${brand}/mainPreview.json`,
  // 王者活动JSON文件
  GLORY_KING: `${cdn}/assets/wechat/${brand}/gloryKing.json`,
  POPUPVOUCHER: `${cdn}/assets/wechat/JSON/popupVoucher.json`,
  // 用户分析
  TRACK: `${domain}${prefix}/track`,
  //初始化token
  INIT: `${domain}${prefix}/service/init`,
  //图形验证码
  SECURITYCODE: `${domain}${prefix}/service/securityCode`,
  // 分销获取验证码
  DISTRIBUTOR_GET_CODE: `${domain}${newPrefix}/distributor/getCode`,
  //获取验证码 校验图形码
  GETCODE: `${domain}${prefix}/member/getCode`,
  //登录接口(H5/PC)
  LOGIN: `${domain}${prefix}/member/login`,

  //登录注册接口（小程序）
  LOGIN_MINI: `${domain}${prefix}/mini/login`,
  //企业微信登录
  LOGIN_ENTERPRISE: `${domain}${prefix}/mini/loginByEnterprise`,
  //发送微信代金券
  SEND_WX_COUPON: `${domain}${prefix}/mini/sendWxCoupon`,
  // 获取库存
  GETSTOCK: `${domain}${prefix}/goods/getStock`,
  // 获取新库存
  GETSTOCKNEW: `${domain}${newPrefix}/h5Stock/goodsStock`,
  // 搜索词推荐
  GOODS_SUGGEST: `${newPrefix}/h5Goods/suggest`,
  // 获取商品列表
  // GETGOODSLIST: `${domain}${prefix}/goods/goodsList`,
  GETGOODSLIST: `${domain}${newPrefix}/h5Goods/findGoodsList`,
  //获取商品详情 https://cdn.bestseller.com.cn/detail/SELECTED/4182T4576.json?v=0.2622509979152241
  // GOODS_DETAIL: `${DEV ? config.domain : cdn}/detail/${brand}/`,
  GOODS_DETAIL: `${domain}${newPrefix}/h5Goods/goodsDetail`,
  // 查询商品信息
  GOODS_COLOR_LIST: `${newPrefix}/h5Goods/getGoodsColorList`,

  SHAREGOODSLIST: `${domain}${newPrefix}/wxSharePage/getLists`,   // 获取分享列表
  // SHAREGOODSLIST: `${domain}${prefix}/wsc/shareList`,   // 获取分享列表
  //导购微商城-获取分享详情
  // GETSHAREDETAIL: `${domain}${newPrefix}/wxSharePage/getShareDetail`,
  GETSHAREDETAIL: `${domain}${newPrefix}/wxSharePage/getByIdOrCreateBy`, // 可以通过createBy和ID都能查询

  // GETSHAREDETAIL: `${domain}${prefix}/wsc/shareDetail`,
  SHAREGOODS: `${domain}${newPrefix}/wxSharePage/add`,   // 共享商品生成json文件
  // SHAREGOODS: `${domain}${prefix}/wsc/shareCreate`,   // 共享商品生成json文件
  SHARE_GOODS_REMOVE: `${domain}${newPrefix}/wxSharePage/remove`,   // 删除
  // SHARE_GOODS_REMOVE: `${domain}${prefix}/wsc/shareDelete`,   // 删除
  SHAREUPDATE: `${domain}${newPrefix}/wxSharePage/count`,   // 更新分享次数
  // SHAREUPDATE: `${domain}${prefix}/wsc/v2/shareUpdate`,   // 更新分享次数

  // 发送验证码
  GET_CODE: `${domain}${prefix}/wsc/getCode`,
  //复制链接
  SHARE: `${domain}${prefix}/wsc/shareURL`,
  //生成合并图片
  GETCOMPOUNDIMG: `${domain}${prefix}/wsc/v2/shareQRImgs`,
  // 新接口
  SHARE_QR_IMG: `${newPrefix}/wsc/shareQRImgs`,
  // GETCOMPOUNDIMG: `${domain}${prefix}/mini/getCompoundImgTest`,
  // 获取导购带参二维码
  GETDAOGOUQRCODE: `${newPrefix}/mini/getDaQrImg`,
  // 虚拟工号二维码
  FICTITIOUS_GUIDE_QR: `${newPrefix}/mini/v2/getDaQrImg`,
  // 获取导购商城列表
  GETWSHOPlIST: `${domain}${newPrefix}/wxShareArticle/getShareArticlePage`,
  // 发送模板消息
  SENDTEMPLATEMESSAGE: `${domain}${prefix}/wsc/send2PA`,
  // 判断是否导购 XXXXX
  GETGUIDEINFOBYOPENID: `${domain}${prefix}/guide/getGuideInfoByOpenId`,
  //商品点击量
  CLICKRATE: `${domain}${prefix}/goods/addClickRate`,
  //  上传封面图片(带小程序码)
  UPLOADCONVERPICWITHMINICODE: `${domain}${prefix}/wsc/shareCreateConver`,
  // 上传图片
  UPLOAD_IMAGE: `${domain}${newPrefix}/customGoods/picCustom`,
  // 微商城导购发券
  COUPONIMG: `${domain}${prefix}/wsc/couponImg`,
  //获取会员中心素材
  GETMEMBERPICS: `${domain}${newPrefix}/memberCenterFile/list`,
  // 购物车
  // SHOPPINGLIST: `${domain}${newPrefix}/shopCart/getLists`, // 获取购物车列表
  // SHOPPINGDEL: `${domain}${newPrefix}/shopCart/delete`, // 删除购物车商品
  // SHOPPINGADD: `${domain}${newPrefix}/shopCart/add`, // 添加商品到购物车
  // 活动券
  GETCOUPON: `${domain}${prefix}/coupon/getCoupon`, // 获取活动券(废弃)
  GETCOUPONLIST: `${domain}${prefix}/coupon/list`, // 获取活动券new
  EXCHANGECOUPON: `${domain}${newPrefix}/coupon/exchangeCoupon`, // 积分兑换活动券222
  EXCHANGEJLCOUPON: `${domain}${prefix}/voucher/v5/exchangeVoucher`, //兑换JL优惠券
  ORDERCOUPONLIST: `${domain}${prefix}/coupon/orderCouponList`, // 订单页获取对应活动的活动券
  QUERY_NUM_COUPON: `${domain}${newPrefix}/coupon/queryNumCoupon`, // 查询15位活动券

  // 优惠券
  GETVOUCHERLIST: `${domain}${prefix}/voucher/list`,
  // 获取JL优惠券
  GETJLVOUCHERLIST: `${domain}${prefix}/voucher/v5/list`,
  // 新的获取JL优惠券
  JL_VOUCHER_LIST: `${domain}/rest/coupon/list`,
  // 获取新的JL会员信息
  NEW_CRM_INFO: `${domain}/rest/member/crmInfoGet`,
  // 更新新的JL会员信息
  UPDATE_CRM_INFO: `${domain}/rest/member/crmInfoEdit`,
  // 积分变动
  QUERY_POINTS_UPD_REASON: `${newPrefix}/member/queryPointsUpdReason`,
  // 快递
  EXPRESSINFO: `${domain}${prefix}/express/expressInfo`,   // 查看物流信息
  // 导购
  BINDGUIDE: `${domain}${prefix}/guide/v2/bind`,   // 绑定导购获取免邮资格
  ISGUIDE: `${domain}${prefix}/guide/isGuide`,   // 判断是否导购
  GUIDEBINDOPENID: `${domain}${prefix}/guide/guideBindOpenId`,   // 导购绑定openid
  LOGINBIND: `${domain}${prefix}/wsc/loginBind`,   // 判断是否导购
  BINDSTATUS: `${domain}${prefix}/guide/bindStatus`,   // 查询是否绑定导购
  // GETWXACODEUNPUBADDRQR: `${domain}${prefix}/wsc/shareCreateQR`,   // 生成小程序码
  // GETWXACODEUNPUBADDRQR: `${domain}${prefix}/mini/v2/getWxaCodeUnpubAddrQR`,   // 生成小程序码
  GETWXACODEUNPUBADDRQR: `${newPrefix}/mini/getWxaCodeUnpubAddrQR`,   // 生成小程序码
  //获取附近门店列表
  NEARBY_SHOPS: `${domain}${prefix}/store/list`,
  // 到店自提
  PICKUP_STORE_LIST: `${domain}${prefix}/pickup/pickUpStoreList`,
  //查询具体某个门店某个分类下的商品列表
  NEARBY_GOODS_LIST: `${domain}${prefix}/store/goodsList`,
  //获取普通分类商品列表
  NORMAL_GOODS_LIST: `${domain}${newPrefix}/h5Goods/findGoodsList`,
  // GOODS_DETAIL:`${domain}/detail/${brand}/`,
  //商品缩略图第一张
  GOODS_THUMBNAIL: `${cdn}/goodsImagePC/${brand}/`,
  //获取当前店铺 当前SKU 的库存详情 https://minislt.bestseller.com.cn/api/store/stock?shopCode=91D2&sku=4182T4563C15
  SHOP_SKU_STOCK: `${domain}${prefix}/store/stock`,
  //获取店铺信息 //https://m.selected.com.cn/api/store/shopInfo
  SHOP_INFO: `${domain}${prefix}/store/shopInfo`,
  //获取用户IP地址及省市信息
  LOCATION_WITH_IP: `${domain}${prefix}/store/getMemPosition`,

  // SHAREUPDATE: `${domain}${prefix}/wsc/shareUpdate`,   // 更新分享次数
  SALESTATE: `${domain}${prefix}/wsc/saleState`,   // 导购销售业绩
  SHARESTATE: `${domain}${prefix}/wsc/shareState`,   // 导购分享业绩
  // BRANDCONFIG: `${domain}/assets/wechat/brandConfig.json`,   // 品牌配置文件
  BRANDCONFIG: `${domain}/assets/wechat/JSON/brandConfig.json`,   // 品牌配置文件
  // SHARETEXT: `${domain}/assets/wechat/JSON/shareTitle.json`,   // 导购分享文案
  SHARETEXT: `${domain}/assets/wechat/JSON/shareTitle_V3.json`,   // 导购分享文案
  // SEND_COUPON: `${domain}/assets/wechat/JSON/weMallSendCoupon.json`,   // 微商城导购发券
  SEND_COUPON: `${domain}/assets/wechat/JSON/weMallSendCoupon_v2.json`,   // 微商城导购发券
  GETGUIDEINFO: `${domain}${prefix}/guide/guideInfo`,   // 获取导购
  GETSHAREJSON: `${cdn}/assets/share/${brand}/`,   // 获取分享JSON
  QUERYGUIDEWXOPENID: `${domain}${newPrefix}/wxStaff/queryGuideWxOpenId`,   // 查询导购是否有openID
  GETDAINFO: `${domain}${prefix}/guide/getDAInfo`,   // 获取导购DA信息
  // 积分商城
  // GETREWARDCENTERLIST: `${domain}${prefix}/point/v2/goodsList`, old
  GETREWARDCENTERLIST: `${domain}${newPrefix}/rewardCenter/getRewardCenterList`,
  CHANGE_POINTS: `${domain}${prefix}/member/changePoints`, // 积分增加减少（转盘）
  // 用户注册会员（仅联合官网使用）
  REGISTERVIP: `${domain}${prefix}/mini/authUserBest`,
  // 通过手机号查询是否内部员工（限制导购领券）
  COUPONRESTRICTION: `${domain}${prefix}/guide/userIsOrGuide`,

  //查询线上H5分类
  H5_CATEGORY: `${cdn}/classify/h5/${brand}/h5_list.json`,

  // 获取订单列表新
  NORMAL_ORDER_LIST_NEW: `${domain}${prefix}/order/bigOrderList`,
  //查询线上普通商品库存 https://minivm.bestseller.com.cn/api/goods/getStock?goodsCode=31837A503
  // H5_GOODS_STOCK:`${domain}${prefix}/goods/getStock`,
  // 创建换货订单： /exchangeorder/exchangeOrderCreate
  // EXCHANGE_ORDER_CREATE:`${domain}${prefix}/exchangeorder/exchangeOrderCreate`,
  EXCHANGE_ORDER_CREATE: `${domain}${newPrefix}/exchange/create`,
  // 查询换货单列表：  /exchangeorder/exchangeOrderList
  // EXCHANGE_ORDER_LIST:`${domain}${prefix}/exchangeorder/exchangeOrderList`,
  EXCHANGE_ORDER_LIST: `${domain}${newPrefix}/exchange/list`,
  // 查询换货详情： /exchangeorder/exchangeOrderDetail
  EXCHANGE_ORDER_DETAIL: `${domain}${newPrefix}/exchange/detail`,
  // 更新换货方式 exchangeorder/exchangeTypeUpdate
  EXCHANGE_ORDER_EXCHANGE_TYPE_UPDATE: `${domain}${prefix}/exchangeorder/exchangeTypeUpdate`,
  // 获取换发商品价格信息(需要换货单号) /exchangeorder/exchangePrice
  // EXC_ORDER_PRICE_CALC:`${domain}${prefix}/exchangeorder/exchangePrice`,
  EXC_ORDER_PRICE_CALC: `${domain}${newPrefix}/exchange/getExchangePrice`,
  // 获取换发商品价格信息(不需要换货单号) /exchangeorder/exchangePriceCalculate
  // EXC_ORDER_PRICE_CALC_2:`${domain}${prefix}/exchangeorder/exchangePriceCalculate`,
  EXC_ORDER_PRICE_CALC_2: `${domain}${newPrefix}/exchange/calculatePrice`,
  // 更新换货物流信息  /exchangeorder/orderExpressUpdate
  // EXC_ORDER_UPLOAD_EXPRESS_INFO:`${domain}${prefix}/exchangeorder/orderExpressUpdate`,
  EXC_ORDER_UPLOAD_EXPRESS_INFO: `${domain}${newPrefix}/exchange/update/express`,
  // 确认换货:http://mini.bestseller.com.cn/api/exchangeorder/exchangeOrderConfirm
  EXC_CONFIRM: `${domain}${newPrefix}/exchange/update/confirm`,
  // 换货，顾客确认收货
  // EXC_CONFIRM_RECEIPT:`${domain}${prefix}/exchangeorder/exchangeConfirmReceived`,
  EXC_CONFIRM_RECEIPT: `${domain}${newPrefix}/exchange/update/confirmReceived`,
  // 关闭换货单 http://mini.bestseller.com.cn/api/exchangeorder/exchangeOrderClose
  EXC_ORDER_CLOSE: `${domain}${newPrefix}/exchange/close`,
  // 发送模板消息
  SENDTMPINFO: `${domain}${prefix}/mini/sendTmpInfo`,
  // 订单
  ORDERSAVE: `${domain}${prefix}/order/orderSave`,
  // 预售订单
  PRE_SALE_ORDER_SAVE: `${domain}${newPrefix}/orderNew/orderSave`,
  // 取消未支付的预售订单
  PRE_SALE_CANCEL: `${domain}${newPrefix}/bookOrder/remove`,
  // 预售订单详情
  PRE_SALE_ORDER_DETAIL: `${domain}${newPrefix}/bookOrder/queryDetail`,

  // 积分订单
  POINTORDERSAVE: `${domain}/rest/point/orderSave`,
  // 0 元订单
  ORDER_SAVE_FREE: `${domain}${newPrefix}/order/orderSaveFree`,
  // JL订单
  // ORDERSAVEJL: `${domain}${prefix}/order/v5/orderSave`,
  // JL订单
  // ORDERSAVEJL: `${domain}/rest/order/orderSave`, 更换CREATE_GOODS_ORDER
  // 新的保存订单
  CREATE_GOODS_ORDER: `${domain}${newPrefix}/bigOrder/createGoodsOrder`,


  // 取消订单
  ORDER_CANCEL: `${domain}${newPrefix}/order/orderCancel`,
  // 提醒发货
  REMINDEPRESS: `${domain}${prefix}/order/remindSend`,
  // 确认收货
  // CONFIRMORDER: `${domain}${prefix}/order/orderConfirm`,
  // 确认，取消，提醒，收货--前端 1:确认,2:取消,3:提醒发货
  CONFIRMORDER: `${domain}${newPrefix}/bigOrder/confirmReceGoods`,
  //获取普通订单列表，不包括换货和退货单
  NORMAL_ORDER_LIST: `${domain}${newPrefix}/bigOrder/bigOrderList`,
  // 订单列表
  // ORDERLIST: `${domain}${prefix}/order/orderList`,
  ORDERLIST: `${domain}${newPrefix}/bigOrder/bigOrderList`,
  // 订单详情
  ORDERDETAIL: `${domain}${newPrefix}/bigOrder/orderDetailById`,
  // 订单数量
  GETORDERCOUNT: `${domain}${newPrefix}/bigOrder/orderStatusCount`,
  // 删除订单
  HIDE_ORDER: `${newPrefix}/bigOrder/hideOrder`,
  // 退货列表
  // REFUNDLIST: `${domain}${prefix}/refund/refundOrderList`,
  REFUNDLIST: `${domain}${newPrefix}/refundGoods/refundOrderList`,
  // 退货申请
  // REFUND_APPLY: `${domain}${prefix}/refund/refundOrderApply`,
  REFUND_APPLY: `${domain}${newPrefix}/refundGoods/generateRefundOrder`,
  // 退单详情
  // REFUND_DETAIL: `${domain}${prefix}/refund/refundOrderDetail`,
  REFUND_DETAIL: `${domain}${newPrefix}/refundGoods/refundOrderDetail`,
  // 上传快递单号   保存退运费信息
  // SUBMIT_WAY_BILL: `${domain}${prefix}/refund/submitWaybill`,
  SUBMIT_WAY_BILL: `${domain}${newPrefix}/refundGoods/uploadRefundOrder`,
  // 退货门店列表
  REFUND_STORE_LIST: `${prefix}/refund/refundStoreList`,
  // 到店退货
  REFUND_STORE_APPLY: `${domain}${newPrefix}/refundGoods/insertStore`,
  // 收货信息
  GETEXPRESSINFO: `${domain}${newPrefix}/express/getExpressInfo`,
  // 订单物流信息查询 http://mini.bestseller.com.cn/api/order/orderExpress
  ORDER_EXPRESS_INFO: `${domain}${prefix}/order/orderExpress`,
  // 支付
  MINIPAYMENT: `${domain}${newPrefix}/wxPay/miniPay`,
  // 预售支付
  PAYMENT_NEW: `${domain}${newPrefix}/wxPay/toAppPay`,
  // 收集用户数据
  COLLECTDATA: `${domain}${prefix}/mini/createFileForUserAccess`,
  // 微信用户行为
  WX_USERACTIONS: `${domain}${prefix}/mini/wxUserActions`,
  // REDISMINIINFO
  REDISMINIINFO: `${domain}${prefix}/mini/redisMiniInfo`,
  // 获取排序后的导购销售业绩
  SALESTATESORT: `${domain}${prefix}/wsc/saleStateSort`,
  // 导购业绩概览
  SALESPERFORMANCEOVERVIEW: `${domain}${newPrefix}/bigOrder/weMallGuideSales`,
  GET_STAFF_SALE: `${domain}${prefix}/wsc/getStaffSale`,
  // 导购模板分享效果
  SHARETEMPLATESTATE: `${domain}${prefix}/wsc/shareTemplateState`,
  // 导购订单
  // GUIDEORDERLIST: `${domain}${prefix}/wsc/guideOrderList`,
  GUIDEORDERLIST: `${domain}${newPrefix}/bigOrder/getOrderShareBy`,
  // 通过unionId查询DMPopenID
  UNIONIDTOOPENID: `${domain}${prefix}/mini/unionIdToOpenId`,   // 不需要employeed
  UNIONIDBINDOPENID: `${domain}${prefix}/mini/unionIdBindOpenId`,
  //是否关注公众号
  GETUNIONID: `${domain}${prefix}/wechat/getUnionId`,
  //积分商城兑换电影票并发送短信
  GET_MOVIE_TICKET: `${domain}${prefix}/salesactivity/pointExchangeMovieTickets`,
  // 获取小程序openID
  GETMINIOPENID: `${domain}${prefix}/mini/getMiniOpenid`,
  // 只用于解密微信小程序调用wx.login后的用户数据
  GETWECHATINFO: `${domain}${prefix}/mini/wechatInfo`,
  // 通过wx.login的code换取unionid
  GET_UNION_ID_BY_CODE: `${newPrefix}/mini/wechatInfo`,
  // 获取lzInfo
  GETLZINFO: `${prefix}/mini/getLzInfo`,
  // 查询会员信息
  QUERY_USER: `${newPrefix}/member/queryUser`,
  // 游戏会员查询并注册
  GAMEQUERYANDREGIST: `${newPrefix}/member/queryAndRegister`,
  // 小程序登录
  MINI_LOGIN: `${domain}${newPrefix}/mini/loginMini`,
  // 听他们说
  LISTENTOTHEM: `${domain}/assets/wechat/listen.json`,
  // 导购社区
  GUIDE_STUDY: `${domain}/assets/wechat/JSON/studyVideo.json`,
  // 支付成功调用优惠券
  VOUCHERFORRETURN: `${domain}${prefix}/order/voucherForReturn`,
  // JL支付成功调用
  ORDER_FOR_RECEIVE: `${domain}${prefix}/order/v5/weMallOrderForReceive`,
  // 支付成功获取优惠券的配置文件
  VOUCHERFORRETURNJSON: `${domain}/assets/wechat/JSON/paySuccess.json`,
  // 导购排行榜
  GET_RANKING: `${domain}/assets/wechat/JSON/rankingList.json`, // 导购排行榜
  GET_RANKING_AUTO: `${domain}/assets/wechat/JSON/ranking-${brand}.json`, // 导购排行榜
  // 获取地址
  GETADDRESS: `${domain}${prefix}/member/addressGet`,
  // 修改地址
  ADDRESS_UPDATE: `${domain}${prefix}/member/addressEdit`,
  // 删除地址
  ADDRESS_DELETE: `${domain}${prefix}/member/addressDel`,
  // 添加地址
  ADDRESS_ADD: `${domain}${prefix}/member/addressAdd`,
  // 促销
  // RULELISTBYSKU: `${domain}${prefix}/promotion/ruleListBySku`,
  RULELISTBYSKU: `${domain}${newPrefix}/h5Promotion/listBySku`,
  // 赠品列表
  GIFT_PAGE: `${domain}${newPrefix}/h5Promotion/giftPage`,
  // 调用CRM给用户塞多个优惠券
  ADD_COUPONS: `${newPrefix}/h5Promotion/addCoupons`,
  // 提交订单查询订单赠品促销
  ORDER_GIFT: `${newPrefix}/orderGift/getOrderGift`,

  //转盘
  ZP_GETGOODS: `${domain}${prefix}/memberday/getGoods`,//转盘奖品列表
  ZP_COMMODITY: `${domain}${prefix}/memberday/isHasChanceForMemberDay`,//中奖商品（会员日）
  zp_HASORDER: `${domain}${prefix}/memberday/lottery`,//中奖商品（通用4月）
  zp_LIMILOTTERY: `${domain}${prefix}/memberday/limitedLottery`,//中奖商品（集赞）
  zp_COUPON: `${domain}${prefix}/dollmachine/queryCouponByOpenId`,//集赞抽奖，验证是否有券
  zp_HXCOUPON: `${domain}${prefix}/coupon/destroyCouponV2`,//集赞抽奖，核销活动券（四品牌）（new）
  //zp_HXCOUPON: `${domain}${prefix}/coupon/destroyCoupon`,//集赞抽奖，核销活动券（四品牌）（old）
  zp_SENDTICKET: `${domain}${prefix}/salesactivity/sendTicketsPassword`,//卡密短信
  zp_JLDESTROYCOUPON: `${domain}${prefix}/voucher/v5/destroyVoucher`,//jl专用注销券

  // ETO相关
  MINIISMEMBER: `${domainETO}${prefix}/member/mini-is-member`, // 判断是否是会员
  GET_CARD_CODE: `${domainETO}${prefix}/member/get-card-code`, // 获取用户card_id，card_code
  GET_COUPON_STATUS: `${domainETO}${prefix}/coupon/status`, // 获取优惠券状态
  // 判断会员和兑换优惠券
  IS_MEMBER: `${domainETO}/page/mini-coupon-exchange`,
  //联系我们
  CONTACT_US: `${domain}/assets/wechat/${brand}/contact_v2.json`,
  //获取快递费用
  EXPRESS_FARE: `${domain}${prefix}/order/getExpressFare`,
  // 查询ACC商品
  QUERY_ACC_GOODS: `${domain}${prefix}/goods/queryAccGoods`,
  // 用户服务协议
  // USER_SERVICE: `${domain}/assets/wechat/${brand}/userService.json`,
  USER_SERVICE: `${domain}/assets/wechat/${brand}/userService_v2.json`,
  // 小程序配置
  MINI_CONFIG: `${domain}/assets/wechat/JSON/${brand}/templateConfig.json`,
  // 商品详情获取优惠券列表
  GOODSDETAILCOUPONLIST: `${domain}${prefix}/voucherActivity/getPromotionActivityList`,
  // 商品详情页优惠券抽奖记录
  QUERYGETCOUPONRECORD: `${domain}${prefix}/voucherActivity/queryGetRecord`,
  // 潮流资讯
  FASHION_LIST: `${domain}${newPrefix}/fashionNews/list`,
  // 列表详情
  FASHION_LIST_CONTENT: `${domain}${newPrefix}/fashionNews/getFashionNewsDetailList`,

  EXCLUSIVEJSON: `${cdn}/assets/wechat/JSON/exclusiveJson.json?v=11`,

  //支付成功页面调==获取抽奖活动页面---显示
  AWARDACTIVITY: `${domain}/rest/awardActivity/getActivityPage`,

  //获取快递费用(以及自提优惠)
  NEW_EXPRESS_FARE: `${domain}/rest/commodity/getExpressFare`,

  // 从导购宝获取订单号查询
  GET_RECEIPT: `${domain}${newPrefix}/bigOrder/receipt`,
  // JL 查询用户信息
  GET_CRM_INFO_JL: `${domain}${prefix}/member/v5/crmInfoGet`,

  // wemember获取sessionkey
  SESSION_KEY: `${domain}${prefix}/wsc/wemember/sessionKey`,
  // 企业微信wemember获取sessionkey
  QY_SESSION_KEY: `${weMemberHost}getqiyewechatcode`,
  // 企业微信wemember登录
  QY_WEMEMBER_LOGIN: `${weMemberHost}qiyeLogin`,
  // wemember查询是否企业手机号
  IS_ENTERPRISE_PHONE: `${domain}${prefix}/wsc/wemember/isEnterprisePhone`,
  // wemember是否登录
  IS_LOGIN: `${domain}${prefix}/wsc/wemember/isLogin`,
  // wemember登录
  LOGIN_WEMEMBER: `${domain}${prefix}/wsc/wemember/loginWemember`,
  // DA导购员详情
  DA_DETAIL: `${weMemberHost}daDetail`,
  // 通过员工工号查询员工信息
  GET_SYS_USER: `${weMemberHost}getSysUser`,
  //发送手机短信验证码
  SEND_SMS: `${weMemberHost}sendSms`,
  // weMemberLogin
  WE_MEMBER_LOGIN: `${weMemberHost}login`,
  // weMember退出
  WE_MEMBER_OUT_LOGIN: `${weMemberHost}outLogin`,
  // 退货模板查看订单
  REFUNDDETAIL: `${domain}${prefix}/order/getDetailById`,
  // 订单及物流详情
  GETORDEREXPRESSDETAIL: `${domain}${newPrefix}/bigOrder/ship`,
  // 保存formid
  SAVE_FORM_ID: `${domain}${prefix}/mini/saveFormId`,
  // 添加收藏夹
  ADDGOODSCOLLECTION: `${domain}/rest/favorite/add`,
  // 查询是否收藏
  ISGOODSQUERY: `${domain}/rest/favorite/isOrNot`,
  // 查询收藏商品
  QUERYGOODSCOLLECTION: `${domain}/rest/favorite/get`,
  // 批量删除收藏夹
  DELETECOLLECTION: `${domain}/rest/favorite/deleteGCByIds`,
  // 是否可以参加拼团
  GET_PINTUAN_DETAIL: `${domain}${newPrefix}/pintuan/detail`,
  // DMP查询推荐商品
  DMP_RECOMMEND_GOODS: `${domain}${prefix}/goods/dmpRecommendGoods`,
  // DMP查询推荐商品New999
  DMP_RECOMMEND_GOODS_NEW: `${domain}/rest/retail/retailRec`,
  // 获取活动图片
  GETACTIVITYPIC: `${domain}/rest/goodsActivity/getDetail`,
  // 查询已领取微信代金券
  QUERYWXCOUPON: `${domain}/rest/wxCoupon/queryCoupon`,
  // 发放微信代金券
  SENDWXCOUPON: `${domain}/rest/wxCoupon/sendCoupon`,
  // 发放微信代金券
  SENDWXCOUPONCUSTOM: `${domain}/rest/wxCoupon/sendCouponCustom`,
  // 查询微信代金券
  QUERYISWXCOUPON: `${domain}/rest/wxCoupon/queryStock`,
  // 预售详情
  PRESELLGOODSDETAIL: `${domain}/rest/presell/goodsDetail`,
  // 预售订单列表
  PREORDERLIST: `${domain}/rest/bookOrder/getpage`,
  // 预售订单取消
  PREORDERCANCAL: `${domain}/rest/bookOrder/remove`,
  // 定制页JOSN文件
  CUSTOMIZATIONJSON: `${cdn}/assets/wechat/${brand}/customization.json`,
  // 定制商品列表
  CUSTOMIZATIONCLASSIFY: `${domain}/rest/garment/queryTemplateForShow`,
  // 定制提交订单
  CUSTOMIZATIONORDERSAVE: `${domain}${prefix}/customOrder/createOrder`,
  // 定制模板详情
  CUSTOMIZATIONDETAIL: `${domain}/rest/garment/queryTemplateForDetails`,
  // 定制绘图/贴标列表
  CUSTOMIZATIONIMGLIST: `${domain}/rest/garment/queryGraphic`,
  // 定制页JOSN文件
  CUSTOMIZATIONRULE: `${cdn}/assets/wechat/${brand}/customer_rule.json`,
  // 定制合成分享图：
  CUSTOMIZTIONPIC: `${domain}/rest/garment/genSharePic`,
  // 微信订阅通知信息手机
  WXSUBSCRIBECOLLECTION: `${domain}/rest/wxsub/saveAccept`,
  // 定制-艺术文字转图片
  CUSTOMIZATIONTEXTTOIMAGE: `${domain}/rest/garment/textToImg`,
  // 上报用户订阅消息
  SAVE_SUBSCRIBE: `${API_WOAPP}/api/save-subscribe`,
  // 直播
  LIVE_ROOM: `${domain}${newPrefix}/mini/getLiveRoom`,
  // 回放视频api接口
  ROOM_REPLAY: `${domain}${newPrefix}/mini/getRoomReplay`,
  // 获取砍价列表
  GETBARGAINLIST: `${domain}/rest/bargain/listBargainGoods`,
  // 获取砍价列表
  GETBARGAINGOODDETAIL: `${domain}/rest/bargain/goodsDetail`,
  // 获取砍价列表
  CREATEBARGAUNORDER: `${domain}/rest/bargainOrder/createOrder`,
  // 获取砍价订单列表
  GETBARGAINORDERLIST: `${domain}/rest/bargainOrder/queryOrderList`,
  // 砍价订单详情
  GETBARGAINORDERDETAIL: `${domain}/rest/bargainOrder/queryOrder`,
  // 砍价超时
  BARGAINTIMEOUT: `${domain}/rest/bargainOrder/orderTimeout`,
  // 好友帮忙砍价
  BARGAINSHARE: `${domain}/rest/bargaiShareDetail/bargainShare`,
  // 砍价记录列表
  BARGAINRECODELIST: `${domain}/rest/bargaiShareDetail/queryBargainList`,
  // 砍价成功列表
  BARGAINSUCCESSLIST: `${domain}/rest/bargainOrder/successOrderList`,
  // 改变支付状态
  CHANGEPAYSTATUS: `${domain}/rest/bargainOrder/waitingPayOrder`,
  // 定制提交订单判断限时优惠
  CUSTOMIZATIONLIMITJSON: `${cdn}/assets/wechat/${brand}/customization_limit.json`,
  // 搜索关键词 /searchKeyword/list
  SEARCH_KEY_WORD: `${domain}${newPrefix}/searchKeyword/list`,
  // 礼包详情页JOSN文件
  LUCKBAGJSON: `${cdn}/assets/wechat/${brand}/luckbag.json?v=10`,
  // 礼包详情页JOSN文件
  LUCKBAGJSON_320433013: `${cdn}/assets/wechat/${brand}/luckbag_320433013.json?v=1`,
  // 礼包详情页JOSN文件
  LUCKBAGJSON_320433015: `${cdn}/assets/wechat/${brand}/luckbag_320433015.json`,
  // 热销推荐
  RETAILREC: `${domain}/rest/retail/retailRec`,
  RETAIL_REC: `${newPrefix}/retail/retailRecNew`,
  // 发送优惠券获取提醒
  SENDCOUPONNOTIFY: `${domain}${newPrefix}/wxsub/notifyCouponGet`,
  // 获取礼包状态及库存
  GETLUCKBAGSTOCK: `${domain}${newPrefix}/goodsActivity/getGiftPack`,
  // 微商城直播列表
  SHARE_LIVE_LIST: `${domain}${newPrefix}/wxShareLive/getLists`,
  // 微商城直播详情
  SHARE_LIVE_DETAIL: `${domain}${newPrefix}/wxShareLive/getDetail`,
  // 微商城直播分享更新
  SHARE_LIVE_COUNT: `${domain}${newPrefix}/wxShareLive/count`,
  // 新增直播分享
  SHARE_LIVE_ADD: `${domain}${newPrefix}/wxShareLive/add`,
  // 删除直播模板
  SHARE_LIVE_REMOVE: `${domain}${newPrefix}/wxShareLive/remove`,

  // 导购上传视频
  SAVIDEO_ADD: `${domain}/rest/saVideo/add`,
  // 获取员工信息
  SAVIDEO_GETUSERINFO: `${domain}/rest/saVideo/userInfo`,
  // 分页显示导购视频上传列表
  SAVIDEO_PAGE: `${domain}/rest/saVideo/page`,
  // 删除导购视频
  SAVIDEO_DELETE: `${domain}/rest/saVideo/delete`,
  // 根据id获取上传视频详情
  SAVIDEO_DETAIL: `${domain}/rest/saVideo/detail`,
  // 增加人气
  SAVIDEO_CLICKTIME: `${domain}/rest/saVideo/clickTime`,

  // 红包雨-查询用户信息
  HBYSEARCHUSERINFO: `${domain}${newPrefix}/game/redRain/queryUserPoints`,
  // 红包雨-创建用户
  HBYCREATEUSER: `${domain}${newPrefix}/game/redRain/addUserPoints`,
  // 红包雨-获取好友助力列表
  HBYSEARCHZHULI: `${domain}${newPrefix}/game/redRain/listHelpForIndex`,
  // 红包雨-游戏开始
  HBYSTARTGAME: `${domain}${newPrefix}/game/redRain/gameStart`,
  // 红包雨-游戏结束
  HBYENDGAME: `${domain}${newPrefix}/game/redRain/gameEnd`,
  // 红包雨-获取优惠券列表
  HBYCOUPONLIST: `${domain}${newPrefix}/game/redRain/listCoupon`,
  // 红包雨-领取优惠券
  HBYGETCOUPON: `${domain}${newPrefix}/game/redRain/getCoupon`,
  // 红包雨-优惠券兑奖记录
  HBYDUIJIANGLIST: `${domain}${newPrefix}/game/redRain/couponRecords`,
  // 红包雨-助力
  HBYZHULI: `${domain}${newPrefix}/game/redRain/addHelp`,
  // 红包雨-开启宝箱
  HBYKAIQIBX: `${domain}${newPrefix}/game/redRain/openBox`,
  // 红包雨-查询活动时间
  HBYSEARCHACTIONTIME: `${domain}${newPrefix}/game/redRain/getActivityTime`,
  // 红包雨-增加用户积分
  HBYADDUSERJIFEN: `${domain}${newPrefix}/game/redRain/plusUserPoints`,
  // 红包雨-奖品兑换列表
  HBYJPDHLIST: `${domain}${newPrefix}/game/redRain/getGiftLatestList`,
  // 红包雨-任务列表
  HBYTASKLIST: `${domain}${newPrefix}/game/redRain/getTaskList`,
  // 红包雨-用户完成的任务列表
  HBYUSERTASKLIST: `${domain}${newPrefix}/game/redRain/getUserFinishTaskList`,
  // 红包雨-完成任务
  HBYWCTASK: `${domain}${newPrefix}/game/redRain/finishTask`,
  // 20200624---兑吧免登录
  DUIBAFREELOGIN: `${domain}${newPrefix}/duiba/autoLoginUrl`,
  // 小红书列表
  RED_BOOK_LIST: `${domain}${newPrefix}/wxSharePageV2/list`,
  // 小红书详情
  RED_BOOK_DETAIL: `${domain}${newPrefix}/wxSharePageV2/get`,
  // 新增
  RED_BOOK_ADD: `${domain}${newPrefix}/wxSharePageV2/add`,
  // 更新
  RED_BOOK_UPDATE: `${domain}${newPrefix}/wxSharePageV2/updateCount`,
  // 删除
  RED_BOOK_REMOVE: `${domain}${newPrefix}/wxSharePageV2/remove`,
  // 分销登录
  DISTRIBUTOR_LOGIN: `${domain}${newPrefix}/distributor/login`,
  // 通过分销号查询信息
  DISTRIBUTOR_GET_INFO: `${domain}${newPrefix}/distributor/getByDistributorId`,
  // 通过unionId 查询分销人员
  DISTRIBUTOR_UNION_ID: `${domain}${newPrefix}/distributor/isDistributorByUnionId`,
  // 分销订单统计
  DISTRIBUTOR_ORDER: `${domain}${newPrefix}/bigOrder/fenxiaoOrderStatistic`,
  // 分销顾客订单统计
  DISTRIBUTOR_CUSTOMER: `${domain}${newPrefix}/bigOrder/fenxiaoCustomerStatistic`,
  // 分销顾客订单统计列表
  DISTRIBUTOR_CUSTOMER_LIST: `${domain}${newPrefix}/bigOrder/fenxiaoCustomerList`,
  // 分销二维码
  DISTRIBUTOR_QR: `${domain}${newPrefix}/mini/getBarByFenXiao`,
  // 创建点亮优惠券活动
  CREATE_LIGHTCOUPON: `${domain}${newPrefix}/lightCoupon/addLightCoupon`,
  // 查询点亮优惠券活动
  GETLIGHTCOUPONS: `${domain}${newPrefix}/lightCoupon/getLightCoupon`,
  // 点亮优惠券
  LIGHTCOUPON: `${domain}${newPrefix}/lightCoupon/lightCoupon`,
  // 获取点亮活动列表
  GETLIGHTCOUPONLIST: `${domain}${newPrefix}/lightCoupon/getLightCouponList`,
  // 获取成功的点亮活动列表
  GETLIGHTCOUPONSUCCESSLIST: `${domain}${newPrefix}/lightCoupon/getLightCouponSuccessList`,
  // 备案信息
  KEEP_RECORD_INFO: `${cdn}/assets/h5/json/record.json`,
  // albumgirls.json
  ALBUMGIRLS_JSON: `${cdn}/assets/wechat/ONLY/albumgirls.json`,
  // 添加心愿单商品
  ADD_SKU_INTO_SETTING: `${domain}${newPrefix}/xinYuanDan/addSkuIntoSetting`,
  // 查询心愿单商品
  QUERY_SETTING: `${domain}${newPrefix}/xinYuanDan/querySetting`,
  // 删除
  DELETE_SETTING: `${domain}${newPrefix}/xinYuanDan/deleteSkuSetting`,
  // 更新
  UPDATE_SETTING: `${domain}${newPrefix}/xinYuanDan/updateSku`,
  // 生成心愿单
  GENERATE_SETTING: `${domain}${newPrefix}/xinYuanDan/generateXinyuandan`,
  // 心愿单设置
  CREATE_SETTING: `${domain}${newPrefix}/xinYuanDan/generateXinyuandan`,
  // 查询心愿单
  QUERY_WISH: `${domain}${newPrefix}/xinYuanDan/queryById`,
  // 心愿单订单查询
  QUERY_WISH_ORDER: `${domain}${newPrefix}/xinYuanDan/queryMyOrder`,
  // 添加足迹
  ADD_TRACK: `${domain}${newPrefix}/track/add`,
  // 查询足迹
  GETTRACK: `${domain}${newPrefix}/track/getTrack`,
  // 删除足迹
  REMOVETRACK: `${domain}${newPrefix}/track/removeTrack`,
  // 商品详情促销列表
  RULES_BY_COLOR: `${newPrefix}/h5Promotion/rulesByColor`,
  // 详情页促销
  RULES_BY_COLOR_LIST: `${newPrefix}/h5Promotion/rulesByColorCodes`,
  // 购物车促销列表
  PROMOTION_CART: `${newPrefix}/h5Promotion/cartPromotion`,
  /**
   * 宠物相关接口 start
   */
  // 宠物列表
  GETPETLIST: `${domain}${newPrefix}/game/pet/getPetList`,
  // 查询用户积分信息
  QUERYUSERPOINTS: `${domain}${newPrefix}/game/pet/queryUserPoints`,
  // 宠物选择
  PETSELECT: `${domain}${newPrefix}/game/pet/petSelect`,
  // 创建用户积分信息
  ADDUSERPOINTS: `${domain}${newPrefix}/game/pet/addUserPoints`,

  //签到
  PETSIGN: `${domain}${newPrefix}/game/pet/sign`,
  // 修改爱心值及饲料
  EDITFEEDHEART: `${domain}${newPrefix}/game/pet/editFeedHeart`,
  // 添加好友助力
  PETADDHELP: `${domain}${newPrefix}/game/pet/addHelp`,
  // 获取优惠券兑奖记录列表
  PETCOUPONRECORDS: `${domain}${newPrefix}/game/pet/couponRecords`,
  // 获取游戏时间范围
  PETGETACTIVITYTIME: `${domain}${newPrefix}/game/pet/getActivityTime`,
  // 领取优惠券
  PETGETCOUPON: `${domain}${newPrefix}/game/pet/getCoupon`,
  // 获取奖品兑换列表
  PETGETGIFTLATESLIST: `${domain}${newPrefix}/game/pet/getGiftLatestList`,
  // 获取任务列表
  PETGETTASKLIST: `${domain}${newPrefix}/game/pet/getTaskList`,
  // 获取用户完成任务列表
  PETGETUSERFINISHTASKLIST: `${domain}${newPrefix}/game/pet/getUserFinishTaskList`,
  // 获取优惠券列表
  PETLISTCOUPON: `${domain}${newPrefix}/game/pet/listCoupon`,
  // 获取首页好友助力列表
  PETLISTHELPFORINDEX: `${domain}${newPrefix}/game/pet/listHelpForIndex`,
  // 开宝箱
  PETOPENBOX: `${domain}${newPrefix}/game/pet/openBox`,
  // 增加用户积分
  PETPLUSUSERPOINTS: `${domain}${newPrefix}/game/pet/plusUserPoints`,
  // 宠物 - 任务列表
  PETTASKLIST: `${domain}${newPrefix}/game/pet/getTaskList`,
  // 宠物 - 获取用户完成任务列表
  PETGETUSERFINISHITASKLIST: `${domain}${newPrefix}/wemallStaff/getStaffSaleByTop`,
  /**
  * 宠物相关接口 end
  */

  /**
   * 买家秀相关接口 start
   */
  // 查询商品评价
  GETGOODSCOMMENT: `${domain}${newPrefix}/goodsReview/list/goods/get`,
  // 上传图片
  GOODS_REVIEW_UPLOAD: `${domain}${newPrefix}/goodsReview/imgHandle`,
  // 创建评论
  GOODS_REVIEW_CREATE: `${newPrefix}/goodsReview/create`,
  // 评论列表
  GOODS_REVIEW_LIST: `${newPrefix}/goodsReview/list/member/get`,
  // 评论/买家秀详情
  GOODS_REVIEW_DETAIL: `${newPrefix}/goodsReview/detail/goods/get`,
  // 买家秀点赞
  GOODS_REVIEW_ZAN: `${newPrefix}/goodsReview/like`,
  // 评论数量
  GOODS_REVIEW_COUNT: `${newPrefix}/goodsReview/count/member/get`,
  /**
   * 买家秀相关接口 end
   */
  // 导购排行榜
  STAFFSALEBYTOP: `${domain}${newPrefix}/wemallStaff/getStaffSaleByTop`,
  // 抢红包游戏时间范围
  ROB_RED_BAG_TIME: `${newPrefix}/game/grab/getActivityTime`,
  // 积分记录
  POINT_RECORD: `${newPrefix}/member/queryPointsUpdReason`,
  // 积分规则
  POINT_RULE: `${cdn}/assets/common/json/Integralrule.json`,
  // fol创建膨胀券
  CREATEEXPADNDCOUPON: `${newPrefix}/expandCoupon/create`,
  // fol查询用户膨胀券
  GETEXPADNDCOUPON: `${newPrefix}/expandCoupon/getLighting`,
  // fol点亮膨胀券
  LIGHTUPEXPADNDCOUPON: `${newPrefix}/expandCoupon/lightUp`,
  // 点亮成功好友列表
  LIGHTSUCCESSLIST: `${newPrefix}/expandCoupon/listCouponAndSuccess`,
  // 用户领券记录
  EXPANDCOUPONLUST: `${newPrefix}/expandCoupon/listExpandCoupon`,

  BINDVISITOR: `${newPrefix}/trendInfo/bindVisitor`,
  // 潮流资讯列表
  TRENDINFOLIST: `${newPrefix}/trendInfo/list`,
  // 潮流资讯详情
  TRENDINFODETAIL: `${newPrefix}/trendInfo/detail`,
  // 潮流资讯编辑个人中心
  TRENDINFOEDITUSER: `${newPrefix}/trendInfo/editUser`,
  // 潮流资讯取消关注
  TRENDINFOCANCELFOCUS: `${newPrefix}/trendInfo/cancelFocus`,
  // 潮流资讯点赞列表
  TRENDINFOCANCELPRAISE: `${newPrefix}/trendInfo/cancelPraise`,
  // 潮流资讯点赞
  TRENDINFOPAISE: `${newPrefix}/trendInfo/praise`,
  // 潮流资讯关注
  TRENDINFOFOCUS: `${newPrefix}/trendInfo/focus`,
  // 潮流资讯访客个人中心
  TRENDINFOVISTORCENTER: `${newPrefix}/trendInfo/visitorCenter`,
  // 潮流资讯作者个人中心
  TRENDINFOAUTORCENTER: `${newPrefix}/trendInfo/authorCenter`,

  // 奖品列表
  GETGIFTLIST: `${newPrefix}/game/bigWheel/listPrize`,
  // 中奖记录列表
  GETGIFTRECORDS: `${newPrefix}/game/bigWheel/listPrizeRecord`,
  // 开始抽奖
  STARTGAME: `${newPrefix}/game/bigWheel/prize`,
  // 通过手机号验证订单
  CHECKPHONE: `${newPrefix}/bigOrder/getOrderInfoList`,
  // 提交订单新用户发券
  NEWUSERCOUPON: `${newPrefix}/ticket/add`,
  // 生成小程序链接
  MINI_LINK: `${newPrefix}/miniLink/getMini`,
  // 会员储值卡查询
  STORED_VALUE_CARD: `${newPrefix}/storedValueCard/getCardList`,
  // 储值卡核销
  SV_CARD_PAY_BY_ORDER_CODE: `${newPrefix}/storedValueCard/svCardPayByOrderCode`


};

//本地存储键名
exports.KEYSTORAGE = {
  brand: 'brand',
  token: 'token', //凭证
  loginInfo: 'login_entiry', //登录信息
  wxInfo: 'userInfo',//微信用户信息
  crmInfo: 'user_info', //CRM系统中的用户信息
  loginInfoByEnterprise: 'daogouInfo', //登录信息(导购)  企业微信
  authed: 'authed',//微信是否授权过
  guideInfo: 'daogouInfo',//导购信息
  isEnterprise: 'isWXWork', //是否是企业微信
  prevPage: 'prevPage', //上一个页面
  highLight: 'highLight',   // 自由选择亮点元素图片
  unionid: 'unionid',
  shareGuideID: 'shareGuideID', // 分享导购ID
  openid: 'openid',
  lastTruntableTime: 'lastTruntableTime',//转盘
  truntable: 'truntable',//转盘
  NEARBY_SHOP_CODE: 'nearbyShopCode',
  SEARCH_VALUE: 'search', // 搜索值
  wxPhone: 'wxPhone', // 微信绑定的手机号
  sessionKey: 'sessionKey', // weMember 的sessionKey
  sessionKeyTime: 'sessionKeyTime', // weMember 的sessionKey保存时间
  cartList: 'cartList',
  newCouponTip: 'newCouponTip', // 新增优惠券
  isMember: 'isMember',  // 是否会员
  guideStudy: 'guideStudy', //导购社区
  phoneType: 'phoneType', // 个人手机：type=2 ； 公司手机：type=1 ；
  deviceType: 'deviceType', // 个人设备：type=2 ； 公司设备：type=1 ；
  chanId: 'chanId', // 引流渠道的标识符
  wxUserAction: 'wxUserAction', // 微信广告用户行为信息
  openCardPage: 'openCardPrevPage', // 开卡跳转之前页面
  utmOptions: 'daogouLists', // utm参数
  curPath: 'curPath',   // 模板列表页面
  wxWork: 'isWXWork', // 是否企业微信
  wxWorkDANum: 'wxWorkDANum', // 企业微信获取
  devFlag: 'devFlag', // 存储是 'wxWork' : 'wxPeople'
  shareDevice: 'shareDevice', // 分享是否公司手机号
  roomId: 'roomId',// 直播房间号
  orderRoomId: 'orderRoomId', // 订单需要的直播间
  setRoomIdDate: 'setRoomIdDate', // 存储时间
  expressInfo: 'expressInfo', // 快递信息
  rePlayer: 'rePlayer', // 直播回放
  wxScene: 'scene', // 场景值
  refundDetail: 'refundDetail', // 退单详情
  liveGuideQR: 'liveGuideQR', // 直播导购二维码
  orderInfo: 'allToDingdan', // 订单信息
  splashImgVersion: 'splashImgVersion', // 开屏版本号
  redBookGoods: 'redBookGoods',// 小红书商品
  webviewLinkUrl: 'webviewLinkUrl', // webview页面linkurl
  ruleClassify: 'ruleClassify', // 列表页查促销
  gameCRMInfo: 'gameCRMInfo',  //游戏crm信息
  wxVideoLiveRoom: 'videoLiveRoom', // 视频号房间ID
  SEARCH_LIST: 'searchList',
  // 首页存储时间
  HOME_DATA_TIME: 'homeDateTime',
  // 首页数据
  HOME_DATA: 'indexData', //
  // 是否同意隐私政策 Boolean
  AGREE_PRIVACY: 'agreePrivacy'
}

//事件的键名
exports.EVENTS = {
  EVENT_LOGINED: 'Login OK',
  EVENT_401: 'HTTP 401',
  EVENT_GUIDE: 'guide OK',
  EVENT_CRMINFO: 'crm OK',
  EVENT_OREDERCOUNT: 'order count',
  EVENT_SHOPCOUNT: 'shop count',
  EVENT_SAVE: 'saveVideo',
  EVENT_GAMECRMINFO: 'gamecrm ok'
};
// 常用正则
exports.REGEXP = {
  // 匹配中文
  CHINESEREG: /^[\u2E80-\u9FFF]+$/,
  // 匹配字符串
  STRREG: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
  STRREG2: /[a-zA-Z0-9_，。（）？！!,.?\/\u4e00-\u9fa5]+$/,
  PHONEREG: /^1\d{10}$/,
  ZHI_FU_BAO: /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+|\d{9,11}$/,
  // 字母和汉字
  CHINESE_LETTER: /[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
  // 字母和数组
  NUMBER_LETTER: /^[0-9a-zA-Z]*$/
}
// 常用字符
exports.PAGESTR = {
  QY: '_QY', // 企业微信标识
  wxWorkSource: 'enterpise_wechat_guideshare', // 企业微信分享utmsource
}

// 成功状态码
exports.SUCCESS_STATUS = 0
