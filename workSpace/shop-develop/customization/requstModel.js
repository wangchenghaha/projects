function customModel(jsons){
    // console.log(`接收的数据:${JSON.stringify(jsons)}`)
    let jsonData = jsons.jsonData
    let colorAndChima = jsons.colorAndChimaArrs

    let datas = []
    let json = {
        "goodsName":jsonData.template_name,
        "goodsCount":1,
        "gscolPicPath":`${jsonData.pic_preview.replace(/https:\/\/cdn.bestseller.com.cn/g,'')}`,
        "price":jsonData.sale_price,
        "originalPrice":jsonData.original_price,
        "discount":1,
        "colorName":colorAndChima[0].title,
        "sizeName":colorAndChima[1].title,
        "gcsSku":colorAndChima[1].sku,
        "goodsColorCode":jsonData.sku,
        "clearingType":4,
        "picFront":`${jsonData.pic_front.replace(/https:\/\/cdn.bestseller.com.cn/g,'')}`,
        "picBack":`${jsonData.pic_back.replace(/https:\/\/cdn.bestseller.com.cn/g,'')}`,
        "customRemark": ''
    }
    datas.push(json)

    let price = 0
    let sku = ''
    let backStr = ''
    let frontStr = ''
    jsonData.graphics.forEach(item => {
        if (item.graphic_type == 'graphic'){
            if (parseInt(item.graphic_price) > parseInt(price)){
                price = item.graphic_price
                sku = item.graphic_sku
            }
            if (item.side == 'back'){
                backStr += `/${item.graphic_pic_url}`
                backStr += ','
            }
            else{
                frontStr += `/${item.graphic_pic_url}`
                frontStr += ','
            }
        }
    });
    frontStr = frontStr != '' ? frontStr.substr(0,frontStr.length - 1) : ''
    backStr = backStr != '' ? backStr.substr(0,backStr.length - 1) : ''
    let ht = {
        "goodsName":"绘图",
        "goodsCount":1,
        "gscolPicPath":frontStr == '' ? backStr.split(',')[0] : frontStr.split(',')[0],
        "price":price,
        "originalPrice":price,
        "discount":1,
        "colorName":"ACC",
        "sizeName":"ACC",
        "gcsSku":sku,
        "goodsColorCode":sku.substr(0,12),
        "picFront":frontStr,
        "picBack":backStr
    }
    datas.push(ht)
    // 正反面图匹配
    let preViewPic = datas[0].gscolPicPath
    if (frontStr != ''){
        datas[0].picFront = preViewPic
    }
    else{
        datas[0].picBack = preViewPic
    }
    backStr = ''
    frontStr = ''
    jsonData.graphics.forEach(item => {
        if (item.graphic_type == 'label'){
            if (item.side == 'back'){
                backStr = `/${item.graphic_pic_url}`
            }
            else{
                frontStr = `/${item.graphic_pic_url}`
            }
            let tbJson = {
            "goodsName":"贴标",
            "goodsCount":1,
            "gscolPicPath":frontStr == '' ? backStr.split(',')[0] : frontStr.split(',')[0],
            "price":item.graphic_price,
            "originalPrice":item.graphic_price,
            "discount":1,
            "colorName":"ACC",
            "sizeName":"ACC",
            "gcsSku":item.graphic_sku,
            "goodsColorCode":item.graphic_sku.substr(0,12),
            "picFront":frontStr,
            "picBack": backStr
            }
            datas.push(tbJson)
        }
    });
    
    // console.log(`封装结果:${JSON.stringify(datas)}`)
    wx.setStorageSync('dzRequstDatas', datas);
}
module.exports = {
    customModel
}