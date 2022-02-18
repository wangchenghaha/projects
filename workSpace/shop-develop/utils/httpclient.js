//不要使用这个HTTP客户端，使用request.js
import {HTTPLogger} from "./request.log";

//事件总线
import { EVENTS } from '../src/const.js'
import events from '../src/events.js';

var app = getApp();
function req(url, data, headers,method, success, fail){
    let logger = new HTTPLogger();
    var mydata = data || {};
    let path = `${app.config.domain}/api/${url}`;
    logger.begin({
      url: url, //接口地址
      method: method, //请求类型
      data: data, //请求体
      header: headers, //请求头
    });
    wx.request({
      url: path,
      data: mydata, 
      header: {
        'token': wx.getStorageSync('token'),
        'content-type': 'application/json'
      },
      method: method,
      success: success,
      fail: function(err){
        logger.error(err)
      },
      complete: function(res) {
        logger.end(res)
        logger.print();
        //{ "data":{ "code":1, "msg":"未授权" },"header": { "Server": "nginx", "Date": "Thu, 03 Aug 2017 07:51:51 GMT", "Content-Type": "text/plain; charset=utf-8", "Content-Length": "28", "Connection": "keep-alive" }, "statusCode": 401, "errMsg": "request:ok"}
        if (res.statusCode == 401){
          events.post(res,EVENTS.EVENT_401);
        }
      }
    })
};
function reqcdn(url, data, headers, method, success, fail) {

  var mydata = data || {};
  wx.request({
    url: app.config.cdn + url,
    data: mydata,
    header: headers,
    method: method,
    success: success,
    fail: function (err) {
    },
    complete: function (res) {
      //{ "data":{ "code":1, "msg":"未授权" },"header": { "Server": "nginx", "Date": "Thu, 03 Aug 2017 07:51:51 GMT", "Content-Type": "text/plain; charset=utf-8", "Content-Length": "28", "Connection": "keep-alive" }, "statusCode": 401, "errMsg": "request:ok"}
      if (res.statusCode == 401) {
        app.initApp(); //退出并重新登陆(用户不可见)
      } else {
      };
    }
  })
};

// 封装 Promise的wx.request请求
function wxRequest(url, data, method) {
  var promise = new Promise(function (resolve, reject) {
    var options = {
      method: method ? method.toLocaleUpperCase():'',   //  请求方式
      url: url,           //  URL
      data: data,         //  data传参
      //请求头
      header: {
        token: wx.getStorageSync('token'),
        'content-type': 'application/json'
      },
      //  成功回调
      success: resolve,
      //  失败回调
      fail: reject,
      complete: function (res) {
        if (res.statusCode == 401) {
          app.initApp(); //退出并重新登陆(用户不可见)
        } else {
        };
      }
    };
    // 如果请求的是JSON文件，则删除data，header，methods
    if (url.indexOf('.json') > -1) {
      delete options.data;
      delete options.header;
      delete options.method
    }
    // methods 不传的话就删除methods，wx.request 默认GET请求
    if (typeof method === 'undefined') {
      delete options.method
    }
    // data 不传的话则删除 data
    if (typeof data === 'undefined') {
      delete options.data;
    }
    //默认GET请求
    wx.request(options)
  })
  return promise;
}

module.exports = {
  req: req,
  reqcdn: reqcdn,
  wxRequest: wxRequest,
}