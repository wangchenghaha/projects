import {URL_CDN} from "../src/const";
import {skuToImg} from './utils'

function wxShowToast(title) {
  wx.hideLoading();
  wx.showToast({
    title,
    icon: 'none',
    duration: 2500,
  })
}
const wxCopyText = text => {
	wx.setClipboardData({
		data: text,
		success:res=>{
			wxShowToast('复制成功！')
		}
	})
};

/**
 * @curThis 当前页面this
 * @param type
 *   商品卡曝光 expose_sku_component
 *   商品收藏 sku_collect
 *   商品卡触发 trigger_sku_component
 *   商品页浏览 browse_sku_page,
 *   商品加购 add_to_cart
 * @param goodsColorObj
 * @param sku_id
 */
function wxReportGoods( type, goodsColorObj, action_type){
  try{
    const {colorCode = '', goodsSku = '', goodsName = '', categoryName = '',classifyIds = '', price = 0, discountPrice = 0, originalPrice = 1, sku_num = 0, gsColorCode = ''} = goodsColorObj;
    const curColorCode = colorCode ||gsColorCode;
    let sku_cat_id = curColorCode;
    if(classifyIds){
      const splitMarkIndex = classifyIds.indexOf(',');
      if(splitMarkIndex > -1){
        sku_cat_id = classifyIds.slice(0, splitMarkIndex)
      }else{
        sku_cat_id = classifyIds;
      }
    }
    const primary_image_url = getApp().config.cdn + skuToImg({
      sku: curColorCode,
      size: URL_CDN.IMGSIZE360640,
    });
    const goodsPrice = Number(price) || Number(discountPrice);
    const goodsInfo = {
      sku: {
        "sku_id": goodsSku || curColorCode, // 若商品无sku_id时，可传spu_id信息
        "sku_name": goodsName// 若商品无sku_name时，可传spu_name信息
      },
      "spu": {
        "spu_id": curColorCode, // 若商品无spu_id时，可传sku_id信息
        "spu_name": goodsName// 若商品无spu_name时，可传sku_name信息
      },
      "sku_category": [
        {
          "sku_cat_id": sku_cat_id,
          "sku_cat_name": categoryName || getApp().config.brand,
          "sku_parent_cat_id": "null" // 若已是顶级类目，传"null"
        }
      ],
      "sale": {
        "original_price": Number(originalPrice), // 对接智慧零售入口必传
        "current_price": Number(goodsPrice) // 对接智慧零售入口必传
      },
      primary_image_url,
    }
    if(sku_num > 0){
      goodsInfo.sku_num = sku_num;
    }
    if(action_type){
      goodsInfo.action_type = action_type
    }
    getApp().WXReport( type, goodsInfo);
  }catch(e){
    console.log(e);
  }
}
module.exports = {
  wxShowToast,
	wxCopyText,
  wxReportGoods
}