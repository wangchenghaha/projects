// pages/whitePage/whitePage.js
const app = getApp();
const brand = app.config.brand;
import Util from './util'
import Fetch from './fetch'
const hostname = 'https://bestseller-wechat.woaap.com/'
//let wememberhost = 'http://192.168.93.87/bestseller/'
let wememberhost = 'https://bestseller.woaap.com/bestseller/'
//let wememberhost1 = 'http://192.168.93.93/bestseller/'
let coupon_update = `${hostname}/page/mini-update-coupon`
let coupon_card_data = `${hostname}/page/shop/mini-is-getcoupon`
let shareimg = ''
import {
  getMiniOpenid,
  saveFormId,
  saveSubscribe,
  fashionDetail
} from '../../service/mini';
import {
  wxInfo,
  wxLogin,
  wxGetUserInfo,
  login,
  loginByEnterprise,
  getLzInfo,
  getWeChatInfo,
  isMember
} from '../../service/user.js'
var UniondId = wx.getStorageSync("unionid");
var OpenId = wx.getStorageSync("wxOpenID") || wx.getStorageSync("openid");;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardList: [],
    jsondata: {

    },
    optionsData: '',
    appid: '',
    isself: false,
    shopCardBtn: false,
    da: '',
    id: '',
    channel: "", //启动参数
    delivery_id: "", //启动参数
    jump_url: "", //h5跳转地址
    webView: false,
    navigator: false,
    extraData: {
      biz: "MjM5MjAxNzc1NA==",
      encrypt_card_id: "4GgneIxEhqtmCrH+2B4alE8DXBYPLKB5XTq9LzL8MaxSBEkoE8Ag6LFjp39EdKW5",
      outer_str: "001"
    },
    bgsrc: '',
    botimg: '',
    showimg: false,
    showShare: false,
    options: {},
    isShopCard: false,
    isConfirm: 0,
    couponDatas: {
      cardList: {
        send_coupon_params: '',
        send_coupon_merchant: ''
      },
      couponDatas: ''

    },
    record_id: ''
  },
  onLoad: function (e) {
    // console.log(e,"eee")
    // this.setData({
    //   options:e
    // })
    this.init()
    //this.loadshowFun(e)
    this.setData({
      optionsData: e
    })
    if (!wx.getStorageSync('nofirstmodal')) {
      this.setData({
        ifpop1: false,
        ifpop2: true
      })
    }
  },
  //查看卡包
  lookpackage(e) {
    let couponlist = JSON.parse(e.currentTarget.dataset.coupon)
    console.log(couponlist)
    if (couponlist.length) {
      this.setData({
        optionscouponlist: {
          isshow: true,
          couponlist
        }
      })
    }
  },
  hidemodel() {
    this.setData({
      optionscouponlist: {
        isshow: false
      }
    })
  },
  bindEvent(id, label) {
    var params = {
      "BS_OPEN_ID": wx.getStorageSync('openid') || '',
      "BS_UNION_ID": wx.getStorageSync('unionid'),
      "Guide_DAID": this.data.da.length == 10 ? `${this.data.da}` : `DA00${this.data.da}`,
      "Coupon_id": this.data.id
    }

    // getApp().aldstat.sendEvent(label, params)
    /*getApp().tdsdk.event({
      id,
      label,
      params
    });*/
  },
  loadshowFun: function (e) {
    if (e.q) {
      let channel = wx.getStorageSync('qs-channel')
      let delivery_id = wx.getStorageSync('qs-delivery_id')
      let da = wx.getStorageSync('da').trim()
      let id = wx.getStorageSync('id')
      let flag = wx.getStorageSync('flag')
      let scene = decodeURIComponent(e.q)
      channel = this.getQueryVariable(scene, 'channel') || channel
      delivery_id = this.getQueryVariable(scene, 'delivery_id') || delivery_id
      id = this.getQueryVariable(scene, 'id') || id
      da = this.getQueryVariable(scene, 'da') || da
      flag = this.getQueryVariable(scene, 'flag') || flag
      if (!channel || !delivery_id || !id || !da) {
        wx.showToast({
          title: '启动参数错误',
          icon: 'none'
        })
      } else {

        wx.setStorage({
          key: 'qs-channel',
          data: channel
        });
        wx.setStorage({
          key: 'qs-delivery_id',
          data: delivery_id
        })
        wx.setStorage({
          key: 'da',
          data: da
        });
        wx.setStorage({
          key: 'id',
          data: id
        })
        wx.setStorage({
          key: 'flag',
          data: flag
        })

        this.setData({
          channel,
          delivery_id,
          da,
          id,
          flag
        })
        this.getInitcoupon(1)
      }
    } else {
      let channel = wx.getStorageSync('qs-channel')
      let delivery_id = wx.getStorageSync('qs-delivery_id')
      let da = wx.getStorageSync('da').trim()
      let id = wx.getStorageSync('id')
      let flag = wx.getStorageSync('flag')
      channel = e.channel || channel
      delivery_id = e.delivery_id || delivery_id
      id = e.id || id
      da = e.da || da
      flag = e.flag || flag
      if (!channel || !delivery_id || !id || !da) {
        wx.showToast({
          title: '启动参数错误',
          icon: 'none'
        })
      } else {
        wx.setStorage({
          key: 'qs-channel',
          data: channel
        });
        wx.setStorage({
          key: 'qs-delivery_id',
          data: delivery_id
        })
        wx.setStorage({
          key: 'da',
          data: da
        });
        wx.setStorage({
          key: 'id',
          data: id
        })
        wx.setStorage({
          key: 'flag',
          data: flag
        })
        this.setData({
          channel: channel,
          delivery_id: delivery_id,
          da: da,
          id: id,
          flag: flag,
          wxwork: e.wxwork
        })
        this.getInitcoupon(e.work)
        if (e.isself == 1) {
          this.setData({
            isself: true
          })
        }
      }
    }
  },
  _getMiniOpenid(e) {
    wxLogin().then(wxRes => {
      //发起网络请求
      getMiniOpenid(wxRes, brand).then(res => {
        UniondId = res.unionid;
        OpenId = res.openid;
        this.getcoupondetail(e)
      })
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    UniondId = wx.getStorageSync("unionid");
    OpenId = wx.getStorageSync("wxOpenID") || wx.getStorageSync("openid");;
    var that = this;
    if (this.data.optionsData) {
      console.log(this.data.optionsData, "12312312")
      this.loadshowFun(this.data.optionsData)
    }

    wx.getStorage({
      key: 'appInitData',
      success: function (params) {
        if (params.data.query.q) {
          let da = wx.getStorageSync('da').trim()
          let id = wx.getStorageSync('id')
          let scene = decodeURIComponent(params.data.query.q)
          let qid = that.getQueryVariable(scene, 'id')
          let qda = that.getQueryVariable(scene, 'da')
          if (da == qda && id == qid) {
            let channel = wx.getStorageSync('qs-channel')
            let delivery_id = wx.getStorageSync('qs-delivery_id')
            that.setData({
              channel: channel,
              delivery_id: delivery_id,
              da: da,
              id: id
            })
            if (wx.getStorageSync('isStart') == 6) {
              console.log('等待');
              wx.showLoading({
                title: "加载中",
                duration: 2000,
                mask: true
              });
              return false
            }
          } else {
            that.loadshowFun(params.data.query)
          }
        } else {
          let da = wx.getStorageSync('da').trim()
          let id = wx.getStorageSync('id')
          let qid = params.data.query.id
          let qda = params.data.query.da
          if (da == qda && id == qid) {
            let channel = wx.getStorageSync('qs-channel')
            let delivery_id = wx.getStorageSync('qs-delivery_id')
            that.setData({
              channel: channel,
              delivery_id: delivery_id,
              da: da,
              id: id
            })
            if (wx.getStorageSync('isStart') == 6) {
              console.log('等待');
              wx.showLoading({
                title: "加载中",
                duration: 2000,
                mask: true
              });
              return false
            }
          } else {
            that.loadshowFun(params.data.query)
          }
        }
      }
    })
  },

  tolookcoupon() {
    console.log(this.data.record_id, "==========this.data.couponDatas")
    if (this.data.cardList.length) {
      this.opencard()
      return
    }
    this.getopencoupondata((res) => {
      console.log(res)
      this.setData({
        cardList: res
      }, () => {
        this.opencard()
      })
    })

  },

  getopencoupondata(cb) {
    Fetch({
      url: coupon_card_data,
      loading: true,
      data: {
        channel: this.data.channel,
        record_id: this.data.record_id
      },
    }).then(res => {
      console.log(res, '获取打开卡包数据成功')
      let {
        errcode,
        data,
        errmsg
      } = res.data
      if (errcode == 0) {
        cb && cb(data.cardList.cardList)

        return
      }
      wx.showModal({
        title: '提示',
        content: errmsg,
        showCancel: false
      })
    })
  },
  opencard() {
    wx.openCard({
      cardList: this.data.cardList,
      success: function () {
        console.log('成功进入opencard');
      },
      fail: function (res) {
        wx.showToast({
          title: res,
          icon: 'none'
        })
      }
    })
  },

  hadgetcoupon(params) {
    console.log(params.detail, '===========发券回调数据')
    let that = this
    wx.showLoading()
    let {
      errcode,
      msg,
      send_coupon_result
    } = params.detail
    if (errcode == "OK") {
      wx.hideLoading()
      let {
        code,
        coupon_code,
        message,
        out_request_no,
        stock_id
      } = send_coupon_result[0]
      if (code == "SUCCESS") {
        this.data.hadget = true;
        this.setData({
          hadget: this.data.hadget
        })
        setTimeout(() => {
          that.getupdatecoupon()
        }, 10)
      } else {
        wx.showModal({
          content: message,
        })
      }
    } else {
      wx.showModal({
        content: msg,
      })
    }
  },
  getupdatecoupon() {
    let that = this
    Fetch({
      url: coupon_update,
      loading: true,
      data: {
        channel: this.data.channel,
      },
    }).then(res => {
      let {
        errcode,
        data,
        errmsg
      } = res.data
      if (errcode == 0) {
        console.log('领券更新成功')
        that.tolookcoupon()
        wx.showToast({
          title: '领券成功',
          icon: 'none'
        })
        that.setData({
          showCoupon: true
        })
        return
      }
      wx.showModal({
        title: '提示',
        content: res.data.errmsg,
        showCancel: false
      })
    })
  },
  /**
   * 生成hash值
   *
   */
  createHash(hashLength) {
    return Array.from(Array(Number(hashLength) || 24), () => Math.floor(Math.random() * 36).toString(36)).join('');
  },
  init() {
    console.log(this.createHash(10), 333333333)
    let appid = ''
    let bgsrc = ''
    let cardbg = ''
    let botimg = ''
    let maxHeight = '';
    let maincolor = "";
    let brand_wm = "";
    // let offimg = 'https://cdn.bestseller.com.cn/etocrm/wemember/1111off.png';
    let offimg = '';
    let imgurl = 'https://cdn.bestseller.com.cn/etocrm/wemember/'
    switch (brand) {
      case 'JLINDEBERG':
        appid = 'wx38198fc9409093f3';
        bgsrc = `${imgurl}msg-jl.jpg`;
        cardbg = `${imgurl}jl-cardbg.jpg`;
        botimg = `${imgurl}jl-bg-logo.png`;
        shareimg = `${imgurl}JL.jpg`;
        maincolor = "#000";
        brand_wm = "jl";
        maxHeight = "440";
        break;
      case 'JACKJONES':
        appid = 'wx74efb237d78c62f8';
        bgsrc = `${imgurl}msg-jj.jpg`;
        cardbg = `${imgurl}cardbg.jpg`;
        botimg = `${imgurl}jj-bg-logo.png`;
        shareimg = `${imgurl}JJ.jpg`;
        maincolor = "#000";
        brand_wm = "jj";
        maxHeight = "440";
        break;
      case 'SELECTED':
        appid = 'wx49a2655481a77027';
        bgsrc = `${imgurl}msg-sel.jpg`;
        cardbg = `${imgurl}cardbg.jpg`;
        botimg = `${imgurl}sel-bg-logo.png`;
        shareimg = `${imgurl}SLT.jpg`;
        maincolor = "#000";
        brand_wm = "selected";
        maxHeight = "440";
        break;
      case 'ONLY':
        appid = 'wx5b5a319ad751562f';
        bgsrc = `${imgurl}msg-only.jpg`;
        cardbg = `${imgurl}cardbg.jpg`;
        botimg = `${imgurl}only-bg-logo.png`;
        shareimg = `${imgurl}ONLY.jpg`;
        maincolor = "#000";
        brand_wm = "only";
        maxHeight = "200";
        break;
      case 'VEROMODA':
        appid = 'wx353ae2790f810983';
        bgsrc = `${imgurl}msg-vm.jpg`;
        cardbg = `${imgurl}cardbg.jpg`;
        botimg = `${imgurl}vm-bg-logo.png`;
        shareimg = `${imgurl}VM.jpg`;
        maincolor = "#000";
        brand_wm = "vm";
        maxHeight = "440";
        break;
      case 'FOL':
        appid = 'wxef8967f52ab3d329';
        bgsrc = `${imgurl}msg-fol.jpg`;
        cardbg = `${imgurl}cardbg.jpg`;
        botimg = `${imgurl}fol-bg-logo.png`;
        shareimg = `${imgurl}FOL.jpg`;
        maincolor = "#000";
        brand_wm = "fold";
        maxHeight = "440";
        break;
    }
    this.setData({
      appid,
      bgsrc,
      cardbg,
      offimg,
      maincolor,
      botimg,
      maxHeight
    })
    var _this = this;
    wx.request({
      url: wememberhost + 'activeBackgroundGet',
      data: {
        brand: brand_wm
      },
      success: function (res) {
        if (res.data.data) {
          _this.setData({
            bgsrc: res.data.data.path1,
            offimg: res.data.data.path2,
            shareimg: res.data.data.share_background_img,
            title: res.data.data.title
          })
        }
      }
    })
  },
  goback() {
    this.bindEvent('pageclick_share_back', '返回管理中心')
    wx.navigateBackMiniProgram({
      success(res) {
        console.log(res)
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  getQueryVariable(url, variable) {
    let query = url.split('?')[1]
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return (false);
  },
  debouncegetcoupon() {
    let _this = this
    throttle(function () {
      _this.getcoupon()
    }, 1000)()
  },
  getcoupon() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    if (this.data.channel == '') {
      let channel = wx.getStorageSync('qs-channel');
      let delivery_id = wx.getStorageSync('qs-delivery_id');
      let da = wx.getStorageSync('da').trim();
      let id = wx.getStorageSync('id');
      this.setData({
        channel: channel,
        delivery_id: delivery_id,
        da,
        id
      }, () => {
        wx.hideLoading();
        if (wx.getStorageSync('isStart') == 6) {
          console.log('等待');
          wx.showLoading({
            title: "加载中",
            duration: 2000,
            mask: true
          });
        } else {
          if (this.data.webView == false) {
            this.checkIfHadUnionId();
          } else {
            console.log('webview true', this.data)
          }
        }
      })
    } else {
      wx.hideLoading();
      if (wx.getStorageSync('isStart')) {
        console.log('等待');
        wx.showLoading({
          title: "加载中",
          duration: 2000,
          mask: true
        });
      } else {
        if (this.data.webView == false) {
          this.checkIfHadUnionId();
        } else {
          //
          console.log('webview true', this.data)
        }
      }
    }
  },
  onShareAppMessage: function (res) {
    if (res.target != undefined) {
      let title, flag;
      this.bindEvent('pageclick_share_customer', '完成立即分享')
      if (this.data.title) {
        title = this.data.title;
      } else {
        title = '你的朋友分享了一份惊喜给你，立即点击查看！'
      }
      if (this.data.shareimg) {
        shareimg = this.data.shareimg;
      }

      if (res.target.dataset.type) {
        if (res.target.dataset.type == 1) {
          flag = this.createHash(10)
        } else {
          flag = res.target.dataset.type
        }

      }
      let id = this.data.id
      let da = this.data.da
      let channel = this.data.channel
      let delivery_id = this.data.delivery_id
      let that = this
      console.log(`/getcoupon/getcoupon/getcoupon?id=${id}&da=${da}&channel=${channel}&delivery_id=${delivery_id}&flag=${flag}`)
      return {
        title,
        path: `/getcoupon/getcoupon/getcoupon?id=${id}&da=${da}&channel=${channel}&delivery_id=${delivery_id}&flag=${flag}`,
        complete: function (res) {

          console.log(121212211212121221121221)

          that.setData({
            showShare: false
          })

        },
        imageUrl: shareimg
      }
    }

  },
  /**
   * 检查本地存储内有没UnionId
   */
  checkIfHadUnionId(location) {
    try {
      UniondId = wx.getStorageSync("unionid");
      OpenId = wx.getStorageSync("openid") || wx.getStorageSync("wxOpenID");
      if (UniondId) {
        console.log(UniondId, "取到的unionid");
        let userInfo = wx.getStorageSync('userInfo')
        if (userInfo.avatarUrl || userInfo.nickName) {
          //会员判断流程
          location ? this.ifMember(OpenId, UniondId, location) : this.ifMember(OpenId, UniondId);
        } else {
          wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              console.log(res, "===res1")
              wx.setStorageSync('userInfo', res.userInfo)
              this.checkIfHadUnionId(location)
            }
          })
        }
      }
    } catch (e) {
      console.log(e, "unionid报错");
    }
  },
  /**
   * 立即分享
   * 一次分享和立即分享功能
   *
   */
  showShare() {
    this.setData({
      showShare: true
    })
  },
  hideTap(res) {
    if (!wx.getStorageSync('nofirstmodal')) {
      if (!this.data.ifpop1) {
        this.setData({
          ifpop1: true,
          ifpop2: false
        })
      } else {
        this.setData({
          ifpop1: false,
          ifpop2: false
        })
        wx.setStorageSync('nofirstmodal', true)
      }
    } else {
      this.setData({
        showShare: false
      })
    }
  },



  /**
   * 是否会员的流程
   * @parma {*} OpenId wx的openid
   * @parma {*} UniondId wx的unionid
   */
  ifMember(OpenId, UniondId, location) {
    let data = {};
    let userInfo = wx.getStorageSync('userInfo')
    let headurl = userInfo.avatarUrl
    let nickname = userInfo.nickName
    console.log(userInfo)

      data = {
        openid: OpenId,
        unionid: UniondId,
        channel: this.data.channel,
        delivery_id: this.data.delivery_id,
        da: this.data.da,
        id: this.data.id,
        nation: location?location.nation:'',
        province: location?location.province:'',
        city: location?location.city:'',
        district: location?location.district:'',
        brand,
        headurl,
        nickname,
        isConfirm:this.data.isConfirm
      }

    if (this.data.wxwork) {
      data.type = this.data.wxwork
    }
    if (this.data.flag) {
      if (this.data.flag != 2) {
        data.flag = this.data.flag
      }
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    var _this = this;

    wx.request({
      url: wememberhost + 'addCard',
      data,
      success: function (res) {
        console.log("########", res.data);
        _this.bindEvent('pageclick_customer_getcoupon', '（被分享的用户）立即领取')
        switch (res.data.errcode) {
          case 0:
            let back = res.data;

            wx.hideLoading();
            if (!back.data.is_member) {
              wx.showModal({
                content: '您不是会员，点确认入会',
                success: (data) => {
                  if (data.confirm) {
                    Util.memberRegistration(back.data.activatemembercard_url)
                  }
                }
              })
              return false
            }
            if (!back.data.is_get_card) {
              wx.addCard({
                cardList: back.data.cardList,
                success: function (data) {
                  wx.showModal({
                    content: '会员卡领取成功',
                    showCancel: false
                  })
                },
                fail: function () {
                  console.log('会员卡领取失败')
                }
              })
              return false
            }
            if (_this.data.isShopCard) {
              wx.showToast({
                title: '领取成功',
                icon: 'none'
              })
              _this.setData({
                shopCardBtn: true,
                couponDatas: res.data.data,
                record_id: res.data.data.record_id
              })

            } else {
              //直接领券跳转
              _this.addCardJump(res);
            }

            break;
          case 201:
            wx.hideLoading();
            UniondId = wx.getStorageSync("unionid");
            OpenId = wx.getStorageSync("openid") || wx.getStorageSync("wxOpenID");
            wx.showModal({
              title: '积分兑换优惠券',
              content: res.data.errmsg,
              success: function (res) {
                wx.showLoading({
                  title: '加载中',
                  mask: true
                })
                if (res.confirm) {
                  _this.setData({
                    isConfirm: 1
                  })
                  _this.ifMember(OpenId, UniondId)
                }
                if (res.cancel) {
                  wx.switchTab({
                    url: '/pages/index/index'
                  })
                }
              }
            })
            break;
          case 202:
            wx.getLocation({
              type: 'wgs84',
              success(res) {
                const latitude = res.latitude;
                const longitude = res.longitude;
                _this.getLocationSelf(latitude, longitude);
              }
            })
            break
          default:
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: res.data.errmsg,
              showCancel: false,
              success: function (res) {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
        }

      },
      fail: function (res) {
        wx.showToast({
          title: res.errMsg,
          icon: "none",
        })
      }
    })
  },
  /**
   *  跳转微信原生开卡
   * @param {*} data  微信需要的参数
   */
  memberRegistration(data) {
    wx.setStorage({
      key: 'isLogin',
      data: true,
      success: function (res) {
        wx.navigateToMiniProgram({
          appId: 'wxeb490c6f9b154ef9', // 固定为此 appid，不可改动
          extraData: data, // 包括 encrypt_card_id, outer_str, biz三个字段，须从 step3 中获得的链接中获取参数
          success: function (res) {
            wx.setStorageSync('isStart', 6);
          },
          fail: function (res) {
            console.log(res, "navigateToMiniProgram-fail");
            wx.hideLoading();
          }
        })
      },
      fail: function () {
        // fail
      }
    }) //设置参数
  },
  /**
   * 获取省市区
   * @param {*} lat - 经度
   * @param {*} lng - 维度
   */
  getLocationSelf: function (lat, lng) {
    var _this = this;
    wx.request({
      url: hostname + 'api/getLocation',
      data: {
        lat,
        lng
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        var location = {};
        location.nation = res.data.data.nation;
        location.province = res.data.data.province;
        location.city = res.data.data.city;
        location.district = res.data.data.district;
        _this.checkIfHadUnionId(location);
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  /**
   * 领券并跳转
   */
  addCardJump(res) {
    var _this = this;
    wx.addCard({
      cardList: res.data.data.cardList,
      success: function (back) {
        console.log(back);
        // _this.setData({
        //   webView: true
        // })
        if (back.cardList.length == 1) {
          _this.codeGet(back.cardList[0].cardId, back.cardList[0].code, res); //打开卡券展示页面
        } else {
          _this.backJump(res); //如果大于两张直接回跳
        }
      },
      fail: function () {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  /**
   * code解密接口并跳转
   * @param {*} cardId
   * @param {*} code
   * @param {*} oldInfo
   */
  codeGet(cardId, code, oldInfo) {
    var _this = this;
    let brandId = 0;
    switch (brand) {
      case 'ONLY':
        brandId = 1;
        break;
      case 'JACKJONES':
        brandId = 2;
        break;
      case 'VEROMODA':
        brandId = 3;
        break;
      case 'SELECTED':
        brandId = 4;
        break;
      case 'JLINDEBERG':
        brandId = 5;
        break;
      case 'FOL':
        brandId = 6;
        break;
    }
    wx.request({
      url: hostname + 'api/coupon/mini-decrypt-code',
      data: {
        brand: brandId,
        encrypt_code: code
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        wx.openCard({
          cardList: [{
            cardId: cardId,
            code: res.data.data.code
          }],
          success: function () {
            _this.backJump(oldInfo);
          }
        })
      },
      fail: function (ret) {
        // fail
        wx.showToast({
          title: ret.errMsg,
          icon: "none"
        })
      },
      complete: function () {
        // complete
      }
    })
  },
  /**
   * 回跳
   * @param {*} res
   */
  backJump(res) {
    console.log("跳转传入的参数", res);
    let jump_url = res.data.redirect_url ? res.data.redirect_url : '';
    let reg = /http/;
    if (jump_url != '') { //判断是否有跳转地址
      if (reg.test(jump_url)) { //判断是h5链接还是小程序链接
        _this.setData({
          jump_url: jump_url,
          webView: true
        })
      } else {
        let URL = "/" + jump_url;
        console.log(URL)
        if (URL == '/pages/index/index' || URL == '/pages/memberCenter/memberCenter' || URL == '/pages/informat/informat' || URL == '/pages/guide/guide' || URL == '/pages/nearbyShops/main/main') {
          wx.switchTab({
            url: URL,
            success: function (res) {
              // success
            },
            fail: function (res) {
              // fail
              console.log("tab跳转失败")
              wx.switchTab({
                url: '/pages/index/index'
              })
            },
            complete: function () {
              // complete
            }
          })
        } else {
          wx.redirectTo({
            url: URL,
            success: function (res) {
              // success
            },
            fail: function (res) {
              // fail
              console.log("异常失败回跳", URL)
              wx.switchTab({
                url: '/pages/index/index'
              })
            },
            complete: function () {
              // complete
            }
          })
        }
      }
    } else {
      console.log("失败回跳")
      wx.navigateBack({
        delta: 1
      })
    }
  },
  getInitcoupon(e) {
    let that = this
    UniondId = wx.getStorageSync("unionid")
    if (UniondId) {
      this.getcoupondetail(e)
    } else {
      setTimeout(function () {
        UniondId = wx.getStorageSync("unionid")
        console.log(UniondId, 'console.log(UniondId)')
        that.getInitcoupon(e)
      }, 1500)
      return

    }
  },
  getcoupondetail(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var _this = this;
    wx.request({
      url: wememberhost + 'shopCardDetail',
      data: {
        id: _this.data.id,
        openid: OpenId,
        unionid: UniondId,
        type: e || 1
      },
      method: 'post',
      success: function (res) {
        let {
          data: {
            data,
            errcode,
            errmsg
          }
        } = res
        if (errcode == 0) {
          if (data.ac_type == 1) {
            _this.setData({
              isShopCard: true
            })

          }
          data.activity_start_time = data.activity_start_time
          data.activity_end_time = data.activity_end_time
          _this.setData({
            jsondata: data,
            showimg: true
          })
          if (!_this.data.isself && data.is_share == 1) { //如果是立即领取页面并且share为1禁止右上角分享
            wx.hideShareMenu()
          }
        } else {
          wx.showModal({
            title: '提示',
            content: errmsg || '网络错误',
            showCancel: false
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: res.errMsg,
          icon: "none",
        })
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  }
})

let _lastTime = null

function throttle(fn, gapTime) {
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
}
