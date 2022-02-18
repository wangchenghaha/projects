function aPennyModel(jsonData,jsonCoupou,address,phone){
    let utmParams = wx.getStorageSync('pintuan-utm');
    var utmCampaign = ''
    var utmMedium = ''
    var utmSource = ''
    var utmTerm = ''
    if (utmParams.utm_source){
      utmTerm = utmParams.utm_term
      utmSource = utmParams.utm_source
      utmMedium = utmParams.utm_medium
      utmCampaign = utmParams.utm_campaign

      wx.removeStorageSync('pintuan-utm');
    }

    let tempUrl = getApp().config.cdn
    var gscolPicPath = jsonData.color[jsonData.colorDefault].image.replace(new RegExp(tempUrl,'g'),'')
    gscolPicPath = gscolPicPath.replace(new RegExp('240400/','g'),'')

    var picUrl = jsonData.color[jsonData.colorDefault].image.replace(new RegExp(tempUrl,'g'),''),
    picUrl = picUrl.replace(new RegExp('240400/','g'),'')
    
    var requstData = {
        "phone" : phone,
        "activitySkuId" : jsonData.activitySkuId,
        "province":"",
        "city":"",
        "area":"",
        "detailAddress":"",
        "consignee":"",
        "contactTel":"",

        "bigOrderAppendix":{
          "targetUrl":"",
          "utmCampaign": utmCampaign,
          "utmMedium": utmMedium,
          "utmSource": utmSource,
          "utmTerm": utmTerm
        },
        "channelCode":"MINIPROGRAM",
        "channelId":1,
        'couponName' : '',
        'couponNo' : '',
        'couponType' : '',
        'couponValue' : '',
        "expressFare":0,
        "fromBrand" : 1,
        "goodsOrderList":[{
          "colorName":jsonData.color[jsonData.colorDefault].colorAlias,
          "gcsSku":jsonData.color[jsonData.colorDefault].sizes[jsonData.sizeDefault].sku,
          "goodsColorCode":jsonData.color[jsonData.colorDefault].sizes[jsonData.sizeDefault].sku.substring(0,12),
          "goodsCount":1,
          "goodsName":jsonData.goodsName,
          "gscolPicPath":gscolPicPath,
          "isGift":"Y",
          "originalPrice":jsonData.color[jsonData.colorDefault].originalPrice,
          "price":jsonData.color[jsonData.colorDefault].price,
          "sizeName":jsonData.color[jsonData.colorDefault].sizes[jsonData.sizeDefault].sizeAlias
        }],
        "goodsTotalCount":1,
        "gscPicmianId":"",
        "payPrice":0.01,
        "picUrl":picUrl,
        "realSellPrice":0.01,
        "ruleId":"",
        "ticketNo" : ""
      }
      Object.assign(requstData,address)
      Object.assign(requstData,jsonCoupou)

      return requstData
}
module.exports = {
    aPennyModel
}