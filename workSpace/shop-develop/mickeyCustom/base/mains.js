import { URL, KEYSTORAGE } from '../../src/const.js'


// export default {
const mains = {
  requestNum: 1,  // 请求次数
  newUrl: {}, // 当前请求的 url
  currentPageUrl: '', // 当前页面路径 
  requestHeader: { 'content-type': 'application/json' }, // 普通请求 header 
  sessionidHeader: { 'content-type': 'application/x-www-form-urlencoded' }, // 请求sessionid header
  timeout: null,
  /**
   * 
   * @param {Number} max 最大值
   * @param {Number} min  最小值
   */
  randomFun(max,min){
    return Math.floor(Math.random() * (max - min) + min)
  },
  navigateBack(i=1){
    wx.navigateBack({
      delta: i
    })
  },
  /**
   * @param {string} url 地址
   * @param {object} Data 参数
   * @param {string} method 请求方式
   * @param {object} header 请求头
   * @param {number} loadingType  1-showLoading 2-showNavigationBarLoading
  **/
  request(url, Data, method = "GET", header = this.sessionidHeader, loadingType = 1, responseType = 'text', needUnionid = false) {
    let resolve_previous = null; // 接住外层的resolve，处理session过期的问题
    function closure() {
      return new Promise((resovle, reject) => {
        // 判断加载类型
        if (loadingType == 1) {
          wx.showLoading({
            title: '加载中',
            mask: true
          })
        } else if (loadingType == 2) {
          wx.showNavigationBarLoading();
        }
        // 判断sessionid
        this.getOpenId((openid, unionid) => {
          Data.openid = openid;
          Data.config_name = "mickey_game_4";
          wx.request({
            url,
            method,
            data: Data,
            header,
            responseType,
            success: (res) => {
              let { data, data: { errcode } } = res;
              console.log(`请求url=${url}`); // 测试专用
              console.log(res); // 测试专用

              if (res.statusCode != 200) {
                wx.showToast({
                  title: '服务器内部错误',
                  icon: 'none',
                  duration: 2000
                })
                return
              }
              return resovle(res);
              console.log(res);
              // if (errcode == 30001) { // 过期
              //   this.requestNum++;
              //   resolve_previous = resovle;
              //   this.removeCurrentUrl(url);
              //   if (this.requestNum <= 5) {
              //     wx.setStorageSync('sessionid', '');
              //     this.overdue((sessionid) => {
              //       closure.call(this);
              //     })
              //   } else {
              //     this.requestNum = 1;
              //     this.userInfoFailAlert();
              //   }
              // } else {
              //   this.requestNum = 1;
              //   resovle(res);
              //   if (resolve_previous) {
              //     resolve_previous(res);
              //     resolve_previous = null;
              //   }
              // }
            },
            fail: (d) => {
              reject(d);
            },
            complete: (k) => {
              wx.hideLoading();
              wx.hideNavigationBarLoading();
            },
          });
        }, needUnionid)
      })
    }
    return closure.call(this);
  },
  /**
   * @param {number} count  1开始;如果失败,变2
  **/
  getOpenId(cb, needUnionid) {
    // 获取 sessionId
    let openid = wx.getStorageSync('mickeyOpenid');
    let unionid = wx.getStorageSync('mickeyUnionid');
    if (openid) {
      if(needUnionid && !unionid){
        this.login(cb, 1);
      } else {
        cb(openid, unionid);
      }
    } else {
      this.login(cb, 1);
    }
  },
  /**
   * @param {Function} cb 回调
   * @param {number} count 请求登陆次数
  **/
  login(cb, count) {
    wx.login({
      success: (data) => {
        let { code } = data;
        wx.request({
          url:URL.GETMINIOPENID,
          method:"GET",
          data:{js_code:code, brand:"SELECTED"},
          success: (res) => {
            let {code} = res.data;
            if(code == 0){
              let {openid, unionid} = res.data.data;
              wx.setStorageSync('mickeyOpenid', openid);
              unionid && wx.setStorageSync('mickeyUnionid', unionid);
              cb && cb(openid, unionid);
            }
            console.log(res)

          },
        })
      },
      fail: (err) => {
        console.log(err);
        if (count == 1) { // 首次调用失败，再登录一次
          this.login(cb, 2);
        }
      }
    })
  },
  /**
   * @param {Function} cb 回调
   * @param {number} count 请求登陆次数
  **/
  getUserInfo(cb, count, data) {
    let { encryptedData, iv } = data;
    wx.request({
      url: apis.getSession_2,
      method: 'GET',
      header: this.sessionidHeader,
      data: {
        encryptedData,
        iv,
        templateid: userModel.template_id,
        organization_id: userModel.organization_id,
        temp_miniapp_auth_token: wx.getStorageSync('old_sessionid')
      },
      success: (res) => {
        if (res.statusCode != 200) {
          wx.showToast({
            title: '服务器内部错误',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        let { data, data: { miniapp_session_id, code } } = res;
        if (code == 200) { // 授权成功
          wx.setStorageSync('old_sessionid', '');
          wx.setStorageSync('sessionid', miniapp_session_id);
          cb(miniapp_session_id);
        }
      },
      fail: (res) => {
        this.userInfoFailAlert();
        return;
      }
    })
  },
  /**
   * 页面跳转
   * @param {string} url 跳转页面url
   * @param {number} type 跳转类型  1:redirectTo , 2:reLaunch , 3:switchTab , 不传 navigateTo
   */
  link(url, type) {
    let timer = null;
    console.log(wx.getStorageSync('originPath'));
    if (wx.getStorageSync('originPath') === url) {
      console.log('重复提交');
      timer = setTimeout(() => { // add-new
        clearTimeout(timer);
        timer = null;
        wx.setStorageSync('originPath', '');
      }, 800);
    }
    wx.setStorageSync('originPath', url);
    if (type === 1) {
      wx.redirectTo({
        url,
        complete() {
          timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            wx.setStorageSync('originPath', '');
          }, 1000);
        },
      });
    } else if (type === 2) {
      wx.reLaunch({
        url,
        complete() {
          timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            wx.setStorageSync('originPath', '');
          }, 1000);
        },
      });
    } else if (type === 3) {
      wx.switchTab({
        url,
        complete: () => {
          timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            wx.setStorageSync('originPath', '');
          }, 1000);
        },
      });
    } else {
      wx.navigateTo({
        url,
        fail: (e) => {
          timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            this.link(url, 1);
          }, 1000)
        },
        complete: (e) => {
          timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            wx.setStorageSync('originPath', '');
          }, 1000);
        },
      });
    }
    return true;
  },
  showToast(title) {
    wx.showToast({
      icon: 'none',
      title,
    });
  },
}

export default mains;


