import { request } from '../utils/request.js';
import { URL } from '../src/const.js';
var CityJS = require('../utils/city.js');

function checkLocation() {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (result) => {
                return result.authSetting["scope.userLocation"] == false ? resolve("openSetting")
                    : result.authSetting["scope.userLocation"] == true ? resolve(true) : resolve('openAuthorize');
            },
            fail: () => {
                reject(new Error('获取setting失败'));
            }
        })
    })
        .then(result => new Promise((resolve, reject) => {
            if ('openSetting' == result) {
                resolve(false);
            } else if ('openAuthorize' == result) {
                wx.authorize({
                    scope: 'scope.userLocation',
                    success: (res) => {
                        console.log(res);
                        return resolve(true);
                    },
                    fail: (e) => {
                        console.log(e);
                        // return reject(new Error('授权失败'));
                        return resolve(false);
                    }
                });
            } else {
                return resolve(true);
            }
        }))
        .catch(e => {
            console.log(e);
        });
}

function getCurrLocation() {
    return new Promise((resolve, reject) => {
        wx.getLocation({
            type: 'gcj02',
            success: res => {
                console.log(">>>>>>> wx.getLocation success");
                console.log(res);
                resolve(res);
            },
            fail: e => {
                reject(new Error('定位未开启'));
                wx.showToast({
                    title: '定位未开启',
                    icon: 'none',
                });
            }
        })
    });
}


function getProvincesThroughCoordinate(currLongi, currLati) {
    return new Promise((resolve, reject) => {
        if (!checkCoordinateCorrect(currLongi)) {
            [currLongi, currLati] = [currLati, currLongi];
        }
        request({
            url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${currLati},${currLongi}&key=WXJBZ-PUB6U-LCGVA-B7U4B-RBQ36-UGFTN`,
            method: 'GET',
        })
            .then(res => {
                if (res.status == 0 && res.result != null) {
                    injectDefaultProvince(res);
                    resolve(res.result);
                } else {
                    reject(new Error("没有找到对应省份"));
                }
            })
            .catch(e => {
                reject(e.message);
                console.log(e.message);
            });
    });
}

function getProvincesThroughIP() {
    return new Promise((resolve, reject) => {
        request({
            // url: 'https://apis.map.qq.com/ws/location/v1/ip?ip=163.16.118.238&key=WXJBZ-PUB6U-LCGVA-B7U4B-RBQ36-UGFTN',
            // https://minislt.bestseller.com.cn/api/store/getMemPosition new
            url: URL.LOCATION_WITH_IP,
            method: 'GET',
        })
            .then(res => {
                console.log(" getProvincesThroughIP >>>>>>", res);
                if (res.status == 0 && res.result) {
                    injectDefaultProvince(res);
                    resolve(res.result);
                } else {
                    reject(new Error(""));
                }
            })
            .catch(e => {
                console.log(e);
            });
    });
}

function injectDefaultProvince(res){
    if((!(res.result.ad_info.nation))||(res.result.ad_info.nation.indexOf('中国')<0)){
        let ad_info= {
            "adcode": 110105,
            "city": "北京市",
            "district": "",
            "nation": "中国",
            "province": "北京市"
        }
        let location={
            "lat": 39.9219,
            "lng": 116.44355
        }
        res.result.ad_info = ad_info;
        res.result.location = location;
        console.log("**********  非国内IP ，已经切换为默认地址：北京朝阳区  ------  朝阳区人民群众欢迎您")
    }
}

function checkCoordinateCorrect(longitude) {
    return parseInt(longitude, 10) > 70.00;
}

function cutProvince(rawProvince) {
    if ("北京市" == rawProvince || "上海市" == rawProvince || "天津市" == rawProvince || "重庆市" == rawProvince) {
        let finallyPro = rawProvince.substring(0, 2);
        console.log(`原来的省已经改为${finallyPro}`);
        return finallyPro;
    }
    return rawProvince;
}

function checkAndGetProvincesInfo(){
    return checkLocation()
    .then(res=>{
        let promise =  res ? 
            getCurrLocation().then(res=>{return getProvincesThroughCoordinate(res.longitude,res.latitude);})
            :getProvincesThroughIP();
        return promise;
    })
    .catch(e=>{
        console.log(e);
    })
}

export {
    checkLocation,
    getCurrLocation,
    getProvincesThroughCoordinate,
    getProvincesThroughIP,
    checkAndGetProvincesInfo,
    cutProvince
}