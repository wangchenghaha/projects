import img from '../model/img-model'

const app = getApp();
let brand = app.config.brand;
let title = ''
let sharebg = img.share

import API from '../api/index';

let dataRes;
switch (brand) {
    case 'JLINDEBERG':
        brand = 5
        title = '3人成团，壕放790元优惠券大礼包！全场通用！'
        break;
    case 'JACKJONES':
        brand = 2
        title = '3人成团，畅享270元优惠券大礼包！全场通用！'
        break;
    case 'SELECTED':
        brand = 4
        title = '邀请好友来拼团，一起领取100元神券礼包及精美潮流配饰！'
        break;
    case 'ONLY':
        brand = 1
        title = '3人成团，壕放340元优惠券大礼包！全场通用！测试'
        break;
    case 'VEROMODA':
        brand = 3
        title = '3人成团，壕放340元优惠券大礼包！全场通用！'
        break;
    case 'FOL':
        brand = 6
        title = '送您153元专享礼包，一起放肆随心购！'
        break;
}
let _lastTime = null
const main = {
    debounce(fn, time = 300) {
        var timer = null
        return function () {
            var args = arguments
            var ctx = this
            clearTimeout(timer)
            timer = setTimeout(function () {
                fn.apply(ctx, args)
            }, time)
        }
    },
    judgeBigScreen() {
        let result = false;
        const res = wx.getSystemInfoSync();
        const rate = res.windowHeight / res.windowWidth;
        let limit = res.windowHeight == res.screenHeight ? 1.8 : 1.65; // 临界判断值
        if (rate > limit) {
            result = true;
        }
        return result;
    },
    getQueryVariable(url, variable) {
        // let query = url.split('?')[1]
        let vars = url.split("&");
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    },
    getQueryVariable2(url, variable) {
        let vars = url.split("#");
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("_");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    },
    throttle(fn, gapTime) {
        if (gapTime == null || gapTime == undefined) {
            gapTime = 1000
        }
        return function () {
            let _nowTime = +new Date()
            if (_nowTime - _lastTime > gapTime || !_lastTime) {
                fn()
                _lastTime = _nowTime
            }
        }
    },
    baseshare(chiefId, img) {
        var utm_info = wx.getStorageSync('utm_info');
        var user_utm;
        utm_info.forEach((item, index) => {
            if (item.channelName == '分享好友') {
                user_utm = item;
            }
        });
        console.log("=================================user_utm", user_utm);
        var activeInfo = wx.getStorageSync("activeInfo");
        var path;
        if (chiefId) {
            path = '/attendgroup/index/index?ch=' + user_utm.id + '&chf=' + chiefId + "&ac=" + activeInfo.id;
        } else {
            path = '/attendgroup/index/index?ch=' + user_utm.id + "&ac=" + activeInfo.id;
        }
        console.log("分享好友的链接地址：",path);
        title = activeInfo.shareTitle;
        return {
            title,
            path,
            imageUrl: img
        }
    },
    getPictureList(url, data) {
        return new Promise((resolve, reject) => {

            let campainId = wx.getStorageSync("campainId");
            if (!campainId) {
                var activeInfo = wx.getStorageSync("activeInfo");
                campainId = activeInfo.id;
            }
            let data = {
                "campainId": campainId,
                "pictureIdList": []
            };
            wx.request({
                url: url,
                data: data,
                method: 'POST',
                success: (result) => {
                    if (result.data.code == 200) {
                        wx.setStorageSync("imgList", result.data.data);
                        resolve(result);
                    }

                },
                fail: (err) => {
                    reject(err)
                },
                complete: () => {
                }
            });
        })
    },
    getProise(url, data) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: url,
                data: data,
                method: 'POST',
                success: (result) => {
                    if (result.data.code == 200) {
                        resolve(result);
                    }
                },
                fail: (err) => {
                    reject(err)
                },
                complete: () => {
                }
            });
        })
    },
    //将string格式日期转换为“/”连接只包含月日的日期
    dateUtils(dataTime) {
        var ctx = this;
        const date = new Date(ctx.strToDate(dataTime));
        const month = date.getMonth() + 1
        const day = date.getDate()
        // return [month, day].join('-')
        return month + '月' + day + '日';
    },
    strToDate(time) {
        //使用replace函数，调用data.replace(/\-/g, "/")将全部的“-”替换为”/“
        console.log("===1=======time",time)
        let datatime = time;
        if (time.indexOf("-") >= 0) {
            datatime = time.replace(/\-/g, "/");
        }
        console.log("=====2=====datatime",datatime)
        return datatime
    },
    getButtonText() {
        return new Promise((resolve, reject) => {

            console.log("==================btn");
            let btnTextList = wx.getStorageSync("btnTextList");
            if(btnTextList){
                console.log("btnTextList=======",btnTextList)
                resolve(btnTextList);
            }else{
                let type_1;
                let type_2;
                let type_3;
                let type_4;
                let type_5;
                let type_6;
                let type_7;
                let type_8;
                let type_9;
                let type_10;
                let type_11;
                let type_12;
                let type_13;
                let type_14;
                let campainId = wx.getStorageSync("campainId");

                let data = {
                    "campainId": campainId,
                    "buttonList": []
                };
                wx.request({
                    url: API.btnList,
                    data: data,
                    method: 'POST',
                    success: (result) => {
                        console.log("result====11===",result)
                        if (result.data.code === 200) {
                            result.data.data.forEach((item, index) => {
                                if (item.buttonId === 1) {
                                    type_1 = item.buttonName;
                                }else if(item.buttonId === 2) {
                                    type_2 = item.buttonName;
                                }else if(item.buttonId === 3) {
                                    type_3 = item.buttonName;
                                }else if(item.buttonId === 4) {
                                    type_4 = item.buttonName;
                                }else if(item.buttonId === 5) {
                                    type_5 = item.buttonName;
                                }else if(item.buttonId === 6) {
                                    type_6 = item.buttonName;
                                }else if(item.buttonId === 7) {
                                    type_7 = item.buttonName;
                                }else if(item.buttonId === 8) {
                                    type_8 = item.buttonName;
                                }else if(item.buttonId === 9) {
                                    type_9 = item.buttonName;
                                }else if(item.buttonId === 10) {
                                    type_10 = item.buttonName;
                                }else if(item.buttonId === 11) {
                                    type_11 = item.buttonName;
                                }else if(item.buttonId === 12) {
                                    type_12 = item.buttonName;
                                }else if(item.buttonId === 13) {
                                    type_13 = item.buttonName;
                                }else if(item.buttonId === 14) {
                                    type_14 = item.buttonName;
                                }
                            });

                            let data = {
                                type_1,
                                type_2,
                                type_3,
                                type_4,
                                type_5,
                                type_6,
                                type_7,
                                type_8,
                                type_9,
                                type_10,
                                type_11,
                                type_12,
                                type_13,
                                type_14,
                            };
                            console.log("data=======",data)
                            wx.setStorageSync("btnTextList", data);
                            resolve(data);
                        }

                    },
                    fail: (err) => {
                        reject(err)
                    },
                    complete: () => {
                    }
                });
            }

        })
    },
    // util.js
    getUserProfile() {
        return new Promise((resolve, reject) => {
            wx.getUserProfile({
                desc: '获得你的公开信息(昵称、头像等)', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    console.log("==========获取会员头像",res.userInfo);
                    wx.setStorageSync('user_info_cf', res.userInfo);
                    wx.showToast({
                        title: '获取成功',
                        icon: 'success',
                        duration: 2000
                    })
                    resolve(res.userInfo);
                },
                fail() {
                    wx.showToast({
                        title: '获取失败',
                        icon: 'success',
                        duration: 2000
                    })
                    wx.setStorageSync('user_info_cf_flag', true);
                    console.log("用户拒绝授权")
                }
            });
        })
},
    config: {
        brand
    }
};
export default main

//
// var login = new Promise((resolve, reject) => {
//     wx.request({
//         url: 'https://test.com/onLogin',
//         data: json,
//         method: 'POST',
//         header: {
//             'content-type': 'application/x-www-form-urlencoded',
//         },
//         success: function (res) {
//             //把token放入本地缓存
//             wx.setStorageSync('cookie', res.header['Set-Cookie'])
//             resolve(res)
//         }
//     });
// },