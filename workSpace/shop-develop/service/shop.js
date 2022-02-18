import { request } from '../utils/request.js';
import { URL } from '../src/const';
let utils = require('../utils/utils.js');
let config = require('../src/config.js');
/**
 * 获取附近门店列表
 */
function getNearbyShops(addressBean) {
    if(typeof addressBean === 'object' && !Array.isArray(addressBean)){
        if(Object.keys(addressBean).length){
            for(let key in addressBean){
                if(addressBean[key] === undefined || addressBean[key] === null){
                    delete addressBean[key]
                }
            }
        }
    }
    return new Promise((resolve, reject) => {
        request({
            // url: URL.NEARBY_SHOPS,//正式环境
            url: URL.NEARBY_SHOPS,
            method: 'GET',
            data: addressBean
        })
            .then((response) => {
                console.log(response);
                if (response != null && response.data != null && !utils.isArrayEmpty(response.data.list)) {
                    response.data.list.forEach(ele=>{
                        let shopNameCn = ele.shopNameCn;
                        let newName = "";
                        for(let char of shopNameCn){
                            if(utils.isChinese(char)){
                                newName+=char;
                            }
                        }
                        if(!("店"==newName.charAt(newName.length-1))){
                            newName+="店";
                        }
                        ele.shopNameCn = newName;
                    });
                    resolve(response.data);
                } else {
                    reject(new Error('未查到相应店铺'));
                }
            })
            .catch(e => {
                reject(new Error(e.msg || e.message));
            });
    });
}

/**
 * 获取到门店导航路径
 */
function getNavPath(fromLongi, fromLati, toLongi, toLati) {
    return new Promise((resolve, reject) => {
        if (!checkCoordinateCorrect(toLongi)) {
            [toLongi, toLati] = [toLati, toLongi];
        }
        wx.request({
            url: `https://apis.map.qq.com/ws/direction/v1/driving/?from=${fromLati},${fromLongi}&to=${toLati},${toLongi}&output=json&callback=cb&key=S27BZ-VE7R6-72ES4-ESZON-P7WYT-HWBHQ`,
            method: "GET",
            success: res => resolve(res),
            fail: err => {
                reject(new Error(`获取路径失败`));
            },
        })
    })
        .then(jsonRaw => new Promise((resolve, reject) => {
            console.log("jsonRaw===============================================================");
            console.log(jsonRaw);
            let polyline = jsonRaw.data.result.routes["0"].polyline;
            // let coors = [127.496637, 50.243916, -345, -1828, 19867, -26154];
            //解压缩经纬度
            for (let i = 2; i < polyline.length; i++) {
                polyline[i] = polyline[i - 2] + polyline[i] / 1000000
            }
            // console.log(`polyline end >>>>>>>>>>>> polyline=${polyline}`);
            let pointsList = new Array();
            for (let j = 0; j < polyline.length - 1; j++) {
                let bean = {
                    latitude: polyline[j],
                    longitude: polyline[++j],
                }
                pointsList.push(bean);
            }
            let polylineBean = {
                points: pointsList,
                color: "#ff000088",
                width: 10,
            }
            let polyNew = new Array();
            polyNew.push(polylineBean);
            resolve(polyNew);
        }))
        .catch(e => {
            reject(new Error(e.msg || e.message));
        });
}

function getMarkerDefault(id, longi, lati, shopName) {
    if (!checkCoordinateCorrect(longi)) {
        [longi, lati] = [lati, longi];
    }
    return {
        id: id,
        latitude: lati,
        longitude: longi,
        label: {
            content: shopName,
            x: -30, y: -65,
            color: "#FF0000",
            fontSize: 12,
            borderWidth: 2,
            borderColor: "#000000",
            borderRadius: 7,
            bgColor: "#FFFFFF",
            padding: 7,
            textAlign: "center",
        }
    }
}

function createMarkerList(shopList) {
    let markersList = new Array();
    let pointsList = new Array();
    shopList.forEach(element => {
        let shopName = element.shopNameCn;
        let shopLongi = element.longitude;
        let shopLati = element.latitude;
        let marker = getMarkerDefault(0, shopLongi, shopLati, shopName);
        markersList.push(marker);
        pointsList.push({
            longitude: shopLongi,
            latitude: shopLati,
        });
    });
    return {
        markers: markersList,
        includePoints: pointsList,
    };
}

function checkCoordinateCorrect(longitude) {
    // 北起黑龙江省漠河以北的黑龙江主航道的中心线北纬53°31′
    // 南达南海南沙群岛的曾母暗沙北纬4°15′
    // 西起新疆维吾尔自治区乌恰县以西的帕米尔高原东经73°
    // 东至黑龙江省抚远县境内的黑龙江与乌苏里江汇合处东经135°。
    // long = ( 70,150 )
    // lati =   (4 , 53)
    return parseInt(longitude, 10) > 70.00;
}

//查询特定门店特定商品库存
function getShopStock(postB) {
    return new Promise((resolve, reject) => {
        request({
            // url: URL.SHOP_SKU_STOCK, //正式环境 https://minislt.bestseller.com.cn
            url: URL.SHOP_SKU_STOCK,
            method: 'GET',
            data: postB
        })
            .then(res => {
                if (res.code == 0 && !utils.isArrayEmpty(res.data)) {
                    let processed = {};
                    res.data.forEach(element => {
                        //将库存标准化：负库存转为0
                        if (element.stockQty >= 0) {
                            processed[element.sku] = element.stockQty;
                        } else {
                            processed[element.sku] = 0;
                        }
                    });
                    // resolve(res.data);
                    resolve(processed);
                } else {
                    reject(new Error("未查到库存"));
                }
            })
            .catch(e => {
                reject(new Error(e.msg || e.message))
            });
    });
}

//查询门店信息
function getShopInfo(shopCode) {
    return new Promise((resolve, reject) => {
        request({
            // url: URL.SHOP_INFO, //正式环境 https://minislt.bestseller.com.cn
            url: URL.SHOP_INFO,
            method: 'GET',
            data: {
                shopCode: shopCode,
            }
        })
            .then(res => {
                if (res.code == 0) {
                    resolve(res.data);
                } else {
                    reject(new Error("未查到店铺信息"));
                }
            })
            .catch(e => {
                reject(new Error(e.msg || e.message))
            });
    });
}


export {
    getNearbyShops,
    getNavPath,
    getMarkerDefault,
    createMarkerList,
    getShopStock,
    getShopInfo,
}
