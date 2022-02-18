var urls = require('url.js');
const app = getApp();
var main = {
    //获取链接参数
    GetQueryString:function(url,name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        // var url = decodeURI(window.location.search);
        var url = decodeURI(url);
        var r = url.substr(1).match(reg);
         if(r!=null)return  unescape(r[2]); return null;
    },
    //区分全半角判断文字长度
    getByteLen: function(val) {
        if (!val) {
            val = 0
        }
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            if (val.charAt(i).match(/[^\x00-\xff]/ig) != null) //全角
                len += 2; //如果是全角，占用两个字节
            else
                len += 1; //半角占用一个字节
        }
        return len / 2;
    },
    //去字符串格式
    iGetInnerText: function(testStr) {
        var resultStr = testStr.replace(/\ +/g, ""); //去掉空格
        resultStr = testStr.replace(/[ ]/g, ""); //去掉空格
        resultStr = testStr.replace(/[\r\n]/g, ""); //去掉回车换行
        // resultStr= testStr.replace(/<\/?.+?>/g,""); 
        // resultStr= testStr.replace(/&nbsp;/g,"");//去掉html 
        // console.info(resultStr,'11')
        return resultStr;
    },
    //日期 YY-MM-DD
    getYYMMDD: function() {
        var now = new Date()
        var y = now.getFullYear()
        var m = now.getMonth() + 1
        var d = now.getDate()
        m = m < 10 ? "0" + m : m
        d = d < 10 ? "0" + d : d
        return y + "-" + m + "-" + d
    },
    //字体排版设置
    setFontSize: function(data) {
        var res = wx.getSystemInfoSync(); //获取系统信息同步接口
        data.map(function(v, i) {
            v.map(function(vals, j) {
                var arr = v[j].cardName.split(";");
                arr.map(function(m, n) {
                    arr[n] = {
                        "name": m,
                        "fontSize": setFont(arr, m, n)
                    }
                })
                v[j].NewcardName = arr;
            })
        })

        function setFont(arr, m, n) {
            //n--数组下标
            var x = arr.length; //数组里的个数
            var y = m.length; //内容字数
            var size = '';
            if (x > 2) {
                if (n > 0) {
                    if (y < 12) {
                        if (res.windowWidth >= 412) {
                            size = 25;
                        } else if (res.windowWidth >= 360) {
                            size = 23;
                        } else if (res.windowWidth >= 320) {
                            size = 22;
                        }
                    } else {
                        if (res.windowWidth >= 412) {
                            size = 26 - (y - 12);
                            if (size < 21) {
                                size = 21
                            }
                        } else if (res.windowWidth >= 360) {
                            size = 23 - (y - 12);
                            if (size < 18) {
                                size = 18
                            }
                        } else if (res.windowWidth >= 320) {
                            size = 20 - (y - 12);
                            if (size < 15) {
                                size = 15
                            }
                        }
                    }
                } else {
                    if (y >= 12) {
                        if (res.windowWidth >= 412) {
                            size = 27 - (y - 12);
                            if (size < 24) {
                                size = 24
                            }
                        } else if (res.windowWidth >= 360) {
                            size = 25 - (y - 12);
                            if (size < 22) {
                                size = 22
                            }
                        } else if (res.windowWidth >= 320) {
                            size = 24 - (y - 12);
                            if (size < 20) {
                                size = 20
                            }
                        }
                    }
                }
            } else if (x <= 2) {
                if (y >= 12) {
                    if (res.windowWidth >= 412) {
                        size = 26 - (y - 12);
                        if (size < 21) {
                            size = 21
                        }
                    } else if (res.windowWidth >= 360) {
                        size = 23 - (y - 12);
                        if (size < 18) {
                            size = 18
                        }
                    } else if (res.windowWidth >= 320) {
                        size = 20 - (y - 12);
                        if (size < 15) {
                            size = 15
                        }
                    }
                }
            }
            var fontObj = {
                "allLength": x,
                "fontLength": y,
                "num": n,
                "size": size
            }
            return fontObj
        }
        return data
    },
    //网络请求
    request: function(url, data, Fun, judge,method, header,) {
        var self = this
        if(judge!=1){
            if(judge==2){
                wx.showNavigationBarLoading()
            }else{
                wx.showLoading({
                    title: "正在加载...",
                    icon: "loading",
                    duration: 10000
                })
            }
        }
        if(self.hitRequestKey(url)){return;}
        self.addRequestKey(url);
        self.getUnionId(function(err,unionid){
            data['unionid'] = unionid;
            if (!method) {
                method = 'GET'
            }
            if (!header) {
                var header = {
                    'content-type': 'application/json'
                }
            }
            wx.request({
                url: url,
                method: method,
                data: data,
                header: header,
                success: function(d) {
                    Fun(d)
                    if(judge!=1){
                        wx.hideLoading()
                    }
                    wx.hideNavigationBarLoading()
                    self.removeRequestKey(url);
                },
                fail: function(d) {
                    Fun(d)
                    self.removeRequestKey(url);
                }
            })
        })
    },

    showToastF:function(text){
        wx.showToast({
            title: text,
            icon: 'success',
            duration: 1800
          })
    },
    //发送时间
    MsgTime: function(t,type) {
        //时间格式2011-12-22 15:10:54 处理
        var ntime = new Date(t.replace(/\-/g, "/"));
        var nowtime = new Date();
        var leftsecond = parseInt((nowtime.getTime() - ntime.getTime()) / 1000);
        var d = parseInt(leftsecond / 3600 / 24);
        var h = parseInt((leftsecond / 3600) % 24);
        var m = parseInt((leftsecond / 60) % 60);
        var s = parseInt(leftsecond % 60);

        var toTime = new ToTime(t);
        if (d > 365) {
            return toTime.y + "-" + toTime.m + "-" + toTime.d + " " + toTime.h + ":" + toTime.mm;
        } else if (d > 2) {
            return toTime.m + 1 + "-" + toTime.d + " " + toTime.h + ":" + toTime.mm;
        } else if (d > 0) {
            //return d+"天前";
            //return toTime.m + 1 + "-" + toTime.d + " " + toTime.h + ":" + toTime.mm;
            return "昨天 " + toTime.h + ":" + toTime.mm;
        } else if (h > 5) {
            return toTime.h + ":" + toTime.mm;
        } else if (h > 0) {
            return h+"小时前";
            //return toTime.h + ":" + toTime.mm;
        } else if (m > 0) {
            return m+"分钟前";
            //return toTime.h + ":" + toTime.mm;
        } else {
            return "刚刚";
            //return s+"秒前";
            //return toTime.h + ":" + toTime.mm + ":" + toTime.ss;
        }
        //时间输出
        function ToTime(timeString) {
            this.y = timeString.substring(0, 4);
            this.m = timeString.substring(5, 7) - 1;
            this.d = timeString.substring(8, 10);
            this.h = timeString.substring(11, 13);
            this.mm = timeString.substring(14, 16);
            this.ss = timeString.substring(17, 19);
        }
    },
    //处理数据输出
    output:function(arr,unit){  
        return arr.push(unit);
    },
    //查找指定属性数据
    findKeyDate: function(data, key, name) {
        var d = {}
        data.map(function(val) {
            if (val[key] == name) {
                d = val
                return false
            }
        })
        return d
    },
    //查找指定数组数据
    findArrDate: function(data, name) {
        var d = []
        data.map(function(val) {
            if (val == name) {
                d.push(val)
                return false
            }
        })
        return d;
    },

    //获取openid
    getUnionId: function(callback) {
        var self = this;
        if (wx.getStorageSync('unionid')) {
            callback(null, wx.getStorageSync('unionid'))
        } else {
          // getApp().login();
            /*wx.login({
                success: function(data) {
                    var code = data.code;
                    wx.getUserInfo({
                        success:function(_res){
                            var encryptedData = _res.encryptedData;
                            var iv = _res.iv;
                            wx.setStorageSync("userInfo",_res.userInfo);
                            wx.request({
                                url: urls.wxlogin,
                                data: {
                                    code:code,
                                    encryptedData:encryptedData,
                                    iv:iv,
                                    //TODO brand 待删除硬编码
                                    brand : getApp().config.etoBrand
                                },
                                success: function(res) {
                                    if(res.data.errcode == 0){
                                        wx.setStorageSync("unionid",res.data.data.unionid);
                                        callback(null,res.data.data.unionid);
                                    }else{
                                        self.getUnionIdAgain(callback)
                                    }
                                },
                                fail: function(res){
                                    self.getUnionIdAgain(callback)
                                }
                            });
                        },
                        fail: function(res){
                            // main.link("/pages/common/fail/fail",2)
                        }
                    });
                },
                fail: function(err) {
                    callback(err)
                }
            })*/
        }
    },
    //如果重复code，再次获取unionid
    getUnionIdAgain: function(callback) {
        var self = this;
        if (wx.getStorageSync('unionid')) {
            callback(null, wx.getStorageSync('unionid'))
        } else {
          // getApp().login();
            /*wx.login({
                success: function(data) {
                    var code = data.code;
                    wx.getUserInfo({
                        success:function(_res){
                            var encryptedData = _res.encryptedData;
                            var iv = _res.iv;
                            wx.setStorageSync("userInfo",_res.userInfo);
                            wx.request({
                                url: urls.wxlogin,
                                data: {
                                    code:code,
                                    encryptedData:encryptedData,
                                    iv:iv,
                                    //TODO brand 待删除硬编码
                                    brand : getApp().config.etoBrand
                                },
                                success: function(res) {
                                    if(res.data.errcode == 0){
                                        wx.setStorageSync("unionid",res.data.data.unionid);
                                        callback(null,res.data.data.unionid);
                                    }else{
                                      if (!wx.getStorageSync('isWXWork')){
                                        wx.showModal({
                                          title: '提示',
                                          content: '由于网络原因获取信息失败，点击确定重新获取，或者关闭小程序重新打开。',
                                          success: function (_ret) {
                                            if (_ret.confirm) {
                                              self.getUnionIdAgain(callback)
                                            }
                                            else {
                                              self.getUnionIdAgain(callback)
                                            }
                                          }
                                        })
                                      }
                                    }
                                },
                                fail: function (res) {
                                  
                                  //main.link("/pages/common/fail/fail",2)
                                }
                            });
                        },
                        fail: function(res){
                            // main.link("/pages/common/fail/fail",2)
                        }
                    });
                },
                fail: function(err) {
                    callback(err)
                }
            })*/
        }
    },
    //微信支付
    wxPay: function(url,data,callback){
        var self = this
        self.request(url,data,function(res){
            if(res.code == 200){
                wx.requestPayment({
                    'timeStamp': res.data.jsApiParameters.timeStamp,
                    'nonceStr': res.data.jsApiParameters.nonceStr,
                    'package': res.data.jsApiParameters.package,
                    'signType': 'MD5',
                    'paySign': res.data.jsApiParameters.paySign,
                    'success':function(res){
                        callback(res)    
                    },
                    'fail':function(res){
                        callback(res)
                    }
                });
            }else{
                wx.showModal({
                    title: '提示',
                    content: res.data,
                })
            }
        })
    },
    //领取会员卡、优惠卷
    //type=0 会员卡,  type=1 优惠券
    getCard: function(url,data,callback,type) {
        if(!data){
            data = {}
        }
        var self = this;
        self.request(url,data,function(res) {
            if (type == 0) {
                var info = res.data.data;
            }else{
                var info = res.data.data[0];
            }
            wx.addCard({
                "cardList": info.card_json,
                'success': function(res) {
                    callback(res);
                }
            })
        })
    },
    //打开会员卡、优惠卷
    openCard: function(url,data,callback,type){
        if(!data){
            data = {}
        }
        var self = this;
        self.request(url,data,function(res) {
            // if (type == 0) {
            //     var info = res.data.data;
            // } else if(type == 1){
            //     var info = res.data.data[0];
            // }
            var info = res.data.data
            wx.openCard({
                cardList: [{
                    cardId: info.cardid,
                    code: info.cardcode
                }],
                'success': function(res) {
                    callback(res);
                }
            })
        })
    },
    //优惠卷核销，扫描会员卡
    verifyCard: function(url,data,callback,type){
        var self = this;
        if(!data){
            data = {}
        }
        wx.scanCode({
            success: function(res){
                wx.setStorage({
                    key: "cardCode",
                    data: res.result
                });
                var info = res.result;
                self.request(url,{'code': info},function(res){
                    var flag = res.data.code;
                    wx.setStorage({
                        key: "cardData",
                        data: res.data
                    });
                    if(flag == 200){
                        callback(res);
                    }else{
                        callback(res);
                    }
                })
            }
        })
    },
    //获取设备信息
    getSysInfo: function(){
        return wx.getSystemInfoSync();
    },
    //滚动条信息处理
    scrollInfo: function(e) {
        return {
            'scrollLeft': e.detail.scrollLeft,
            'scrollTop': e.detail.scrollTop,
            'scrollHeight': e.detail.scrollHeight,
            'scrollWidth': e.detail.scrollWidth,
            'deltaX': e.detail.deltaX,
            'deltaY': e.detail.deltaY
        }
    },
    //跳转
    link:function(url,r){
      var self= this
      if(self.hitRequestKey(url)){
        setTimeout(function(){
          wx.setStorageSync("requestList",{});
        },500)
        return;
      }
      self.addRequestKey(url);
      if(r== "1"){
        wx.redirectTo({
          url: url
        })
      }
      else if(r== "2"){
        wx.reLaunch({
          url: url
        })
      }
      else if(r=="3"){
        wx.switchTab({
          url: url
        })
      }
      else {
        wx.navigateTo({
          url: url
        })
      }
    },
    //将当前请求的api记录起来
    addRequestKey: function(key){
        var requestList = wx.getStorageSync('requestList');
        requestList[key] = true;
        wx.setStorage({key: "requestList",data: requestList});
    },
    //将请求完成的api从记录中移除
    removeRequestKey :function(key) {
       var requestList = wx.getStorageSync('requestList');
       delete requestList[key];
       wx.setStorage({key: "requestList",data: requestList});
    },
    //当前请求的api是否已有记录
    hitRequestKey: function(key) {
       var requestList = wx.getStorageSync('requestList');
       return requestList[key];
    },
    //记录来源路径
    hitSourceUrl: function(url){
        var sourceURL = wx.getStorageSync('sourceUrl');
        if(url == ''){
            var d = '/';
            if(sourceURL[0] == '' || sourceURL[0] == null){
                sourceURL[0] = "pages/memberCenter/memberCenter";
            }
            console.info(d+sourceURL[0])
            return d+sourceURL[0];
        }else{
            sourceURL[0] = sourceURL[1];
            sourceURL[1] = url;
            if(sourceURL[0] == sourceURL[1]){return;}
            wx.setStorage({key:"sourceUrl",data:sourceURL}); 
        }
    },
    init: function(obj){
        this.hitSourceUrl(obj.url);
        this.networkStatus()
    }
}
//时间格式化
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month 
        "d+": this.getDate(), //day 
        "h+": this.getHours(), //hour 
        "m+": this.getMinutes(), //minute 
        "s+": this.getSeconds(), //second 
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
        "S": this.getMilliseconds() //millisecond 
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

module.exports = main