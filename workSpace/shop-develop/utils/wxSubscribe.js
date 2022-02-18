import { KEYSTORAGE } from '../src/const.js'
import { saveSubscribe } from '../service/mini';
import { wxSubscribeCollection } from '../service/init.js'
const config = require('../src/config')

function wxSubscription(templateType){
    let templateIds = [];
    let subscriptionType = {
      isCoupon: false,
      isShopCart: false,
      isOrderPay: false,
      isRefund: false,
      isActivity: false,
      isPaySuccess: false,
      isPintuanPaySuccess : false,
      isNewGoodsNotice: false,
      isJumpGame : false,
      iscourierGame : false,
      isnianGame : false,
      isSeckill: false
    }
    let wxSubscriptions = wx.getStorageSync("wxSubscriptions") || subscriptionType;
    switch(templateType){
      case 'coupon':
          wxSubscriptions.isCoupon = true;
          templateIds = config.couponTemplateIds;
        break
      case 'shopCart':
          wxSubscriptions.isShopCart = true;
          templateIds = config.shopCartTemplateIds;
        break;
      case 'orderPay':
        wxSubscriptions.isOrderPay = true;
        templateIds = config.orderPayTemplateIds;
        break;
      case 'refund':
        wxSubscriptions.isRefund = true;
        templateIds = config.refundTemplateIdsNew;
        break;
      case 'activity':
        wxSubscriptions.isActivity = true;
        templateIds = config.activityTemplateIds;
        break;
      case 'paySuccess':
        wxSubscriptions.isPaySuccess = true;
        templateIds = config.paySuccessTemplateIds;
        break;
      case 'pintuanPaySuccess':
        wxSubscriptions.isPintuanPaySuccess = true;
        templateIds = config.pintuanPaySuccessTemplateIds;
        break;
      case 'newGoods':
        wxSubscriptions.isNewGoodsNotice = true;
        templateIds = config.newGoodsNoticeTemplateIds;
        break;
      case 'jumpGame':
        wxSubscriptions.isJumpGame = true;
        templateIds = config.jumpGameTemplateIds;
        break;
      case 'courierGame':
        wxSubscriptions.iscourierGame = true;
        templateIds = config.courierGameTeplateIds;
        break;
      case 'nianGame':
        wxSubscriptions.isnianGame = true;
        templateIds = config.courierGameTeplateIds;
        break;
      case "seckill":
        wxSubscriptions.isSeckill = true;
        templateIds = config.seckillTemplateIds;
        break;  
    }
    console.log("templateIds======",templateIds);
	  return new Promise((resolve, reject) => {
		  wx.requestSubscribeMessage({
			  tmplIds: templateIds,
			  success(res) {
				  console.log('subSuccess', res);
				  wxSubscribeCollection(res).then(data => { });
				  wx.setStorageSync("wxSubscriptions", wxSubscriptions);
				  // if(url){
					//   wx.navigateTo({url });
				  // }
				  try {
            const saveSubscribeParam = {
              appid: config.wxAppid,
              openid: wx.getStorageSync(KEYSTORAGE.openid),
              template_id: templateIds
            };
            saveSubscribe(saveSubscribeParam).then(res => {});
          }catch (e) { }
				  resolve(res)
			  },
			  fail(err){
				  reject(new Error(err.message));
				  console.log('subError', err);
			  }
		  })
	  })
 };

 module.exports = {
    wxSubscription
 }