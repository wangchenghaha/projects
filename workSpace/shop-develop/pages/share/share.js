const app = getApp();
const brand = app.config.brand;
const hostname = 'https://bestseller-wechat.woaap.com/'
// let hostname = 'https://bestseller-wechat-test.woaap.com/'
let shareFlag = false   // 分享后防止重复请求，分享卡片会关闭showloading
Page({
  /**
   * 页面的初始数据
   */
  data: {
    status: 0, //页面进程 -显示哪个页面
    sharePic: false,
    headerImg: [
      "https://tc.woaap.com/lingzhi/share/image/1.png",
      "https://tc.woaap.com/lingzhi/share/image/2.png",
      "https://tc.woaap.com/lingzhi/share/image/3.png",
      "https://tc.woaap.com/lingzhi/share/image/4.png",
      "https://tc.woaap.com/lingzhi/share/image/5.png",
      "https://tc.woaap.com/lingzhi/share/image/6.png",
      "https://tc.woaap.com/lingzhi/share/image/7.png",
      "https://tc.woaap.com/lingzhi/share/image/8.png",
      "https://tc.woaap.com/lingzhi/share/image/9.png",
      "https://tc.woaap.com/lingzhi/share/image/10.png",
      "https://tc.woaap.com/lingzhi/share/image/11.png",
      "https://tc.woaap.com/lingzhi/share/image/12.png",   
      "https://tc.woaap.com/lingzhi/share/image/13.png",
    ],
    logoImg: [
      "https://tc.woaap.com/lingzhi/share/image/logo1.jpg",
      "https://tc.woaap.com/lingzhi/share/image/logo2.jpg",
      "https://tc.woaap.com/lingzhi/share/image/logo3.png",
      "https://tc.woaap.com/lingzhi/share/image/logo4.png",
      "https://tc.woaap.com/lingzhi/share/image/logo5.jpg",
      "https://tc.woaap.com/lingzhi/share/image/logo6.jpg"
    ],
    btnColor: [
      "border: 2px solid #a2d61c;color: #a2d61c;",
      "border: 2px solid #f08500;color: #f08500;",
      "border: 2px solid #e4b138;color: #e4b138;",
      "border: 2px solid #cf3e36;color: #cf3e36;",
      "border: 2px solid #5e6671;color: #5e6671;",
      "border: 2px solid #ee903c;color: #ee903c;",
      "border: 2px solid #5885cf;color: #5885cf;",
      "border: 2px solid #2c9f67;color: #2c9f67;",
      "border: 2px solid #cc463d;color: #cc463d;",
      "border: 2px solid #509fc9;color: #509fc9;",
      "border: 2px solid #dc6144;color: #dc6144;",
      "border: 2px solid #d09a45;color: #d09a45;",
      "border: 2px solid #9062c0;color: #9062c0;"
    ],
    bgColor: [
      "background-color:#a2d61c",
      "background-color:#f08500",
      "background-color:#e4b138",
      "background-color:#cf3e36",
      "background-color:#5e6671",
      "background-color:#ee903c",
      "background-color:#5885cf",
      "background-color:#2c9f67",
      "background-color:#cc463d",
      "background-color:#509fc9",
      "background-color:#dc6144",
      "background-color:#d09a45",
      "background-color:#9062c0",
    ],
    acInfo: {}, //活动信息
    userInfo: {}, //用户信息
    token: "", //标记组的信息
    successInfo: {}, //分享成功之后返回的信息
    channel: "", //启动参数
    delivery_id: "", //启动参数
    gifImg: "",
    isShowMask: true,
    isShare: false,
    showBtn: false,
    gifImg: '',
    channelList: ['15608485169774', '15608483473122', '15608482962825', '15608482261913', '15608481716147', '15608433056778', '15613628673926', '15613628348067', '15613628061537', '15613627731936', '15613627311298', '15645569514113', '15645570003597', '15645570386951'],
    isActChannel: false,
    gohome: 0,     // == 1是从吴正的活动跳过来的
    point: 0,    // 积分兑换优惠券
    store_id: '',
    shopper_id: '',
    id: '',// wemember活动传过来的 和store_id store_id
    from: null,
  },
  onLoad: function (e) {
    console.log(e,'-------------------------------------------eeeee');
    this.setData({
      wxwork: e.wxwork||''
    })
    if(e.q) {
      let scene=decodeURIComponent(e.q)
      let channel = this.getQueryVariable(scene,'channel') || ''
      let delivery_id = this.getQueryVariable(scene,'delivery_id') || ''
      let token = this.getQueryVariable(scene,'token') || ''
      let isShare =  token ? true : false
      let isStart = this.getQueryVariable(scene,'isStart') || ''
      let gohome = this.getQueryVariable(scene,'gohome') || 0
      let shopper_id = this.getQueryVariable(scene,'shopper_id') || ''
      let store_id = this.getQueryVariable(scene,'store_id') || ''
      let id = this.getQueryVariable(scene,'id') || ''
      let from = this.getQueryVariable(scene,'from') || ''
      let wxwork = this.getQueryVariable(scene, 'wxwork') || ''
      // from == wemember 的时候是导购从wemember进来的，只需要分享，不需要其他领券的动作
      if (!channel || !delivery_id) {
        wx.showToast({
          title: '启动参数错误',
          icon: 'none'
        })
      } else {
        this.setData({
          channel,
          delivery_id,
          token,
          isShare,
          isShowMask: true,
          isStart,
          gohome,
          shopper_id,
          store_id,
          id,
          from,
          wxwork
        })
      }
    } else {
      if (!e.channel || !e.delivery_id) {
        wx.showToast({
          title: '启动参数错误',
          icon: 'none'
        })
      } else {
        var doke = e.token ? e.token : "";
        console.log(e,"+++++++++")
        this.setData({
          channel: e.channel,
          delivery_id: e.delivery_id,
          token: doke,
          isShare: e.token ? true : false,
          isShowMask: true,
          isStart: e.isStart ? e.isStart : '',
          gohome: e.gohome ? e.gohome : 0,
          shopper_id: e.shopper_id || '',
          store_id: e.store_id || '',
          id: e.id || '',
          from: e.from || '',
          wxwork: e.wxwork || ''
        })
      }
    }
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (shareFlag) {
      wx.showLoading({
        mask: true,
        title: '正在加载…'
      });
    }
    
    console.log(this.data.isStart, 'this.data.isStart')
    if (wx.getStorageSync('isStart') == 4) {   // 注册回来
      this.setData({
        isShowMask: true
      })
      return;
    }
    if (this.data.isAddcard) {
      this.setData({
        isShowMask: true
      })
      return;
    }
    if (this.data.isStart == 4) {
      this.setData({
        isShowMask: true
      })
    }
    console.log("onshow", this.data.isShowMask)
    //先判断是否授权过
    if (this.checkIfHadUnionId()) {
      const userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo,
        isShowMask: true
      })
      if (!userInfo.unionId) {
        //如果没有就跳去授权(eto获取unionid)
        wx.navigateTo({
          url: '/pages/etoLogin/etoLogin'
        })
        return;
      }
      let params = {
        openid: userInfo.openId,
        unionid: userInfo.unionId,
        nickname: userInfo.nickName,
        head_url: userInfo.avatarUrl,
        channel: this.data.channel,
        delivery_id: this.data.delivery_id,
        token: this.data.token
      }
      console.log("getAcInfo-parma", params)
      // 判断是否来源于多张券领取卡包成功回调
      let lock = wx.getStorageSync('share-status-lock');
      if (lock == 4) {
        this.setData({
          status: 4,
          isShowMask: false,
          ['acInfo.is_get_coupon']: 1
        });
        wx.removeStorageSync('share-status-lock');
      } else {
        this.getAcInfo(params); //获取活动信息
      }

    } else {
      //如果没有就跳去授权(eto获取unionid)
      wx.navigateTo({
        url: '/pages/etoLogin/etoLogin'
      })
    }
  },
  getQueryVariable(url,variable){
    let query = url.split('?')[1]
    let vars = query.split("&");
    for (let i=0;i<vars.length;i++) {
      let pair = vars[i].split("=");
      if(pair[0] == variable){return pair[1];}
    }
    return(false);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log('ShareAppMessage', res);
    var $this = this;
    let shareUrl
    
    if ($this.data.from != 'wemember') {
      shareUrl = `/pages/share/share?channel=${$this.data.channel}&delivery_id=${$this.data.delivery_id}&token=${$this.data.token}`
      wx.showShareMenu({
        success: function () {
          let data = {
            openid: $this.data.userInfo.openId,
            unionid: $this.data.userInfo.unionId,
            nickname: $this.data.userInfo.nickName,
            head_url: $this.data.userInfo.avatarUrl,
            channel: $this.data.channel,
            delivery_id: $this.data.delivery_id,
            source: 0,
            token: $this.data.token
          }
          $this.setData({
            shareing: true,     //开启购物之旅按钮  正在分享。。。当自动调用分享后接口时拿不到分享动作的时候调用
            isShowMask: true
          })
          $this.doShare(data);
        }
      })
    } else {
      shareUrl = `/pages/share/share?channel=${$this.data.channel}&delivery_id=${$this.data.delivery_id}`
    }
    if ($this.data.shopper_id) {
      shareUrl += `&shopper_id=${$this.data.shopper_id}&store_id=${this.data.store_id}&id=${this.data.id}`
    }
    if (this.data.wxwork == '2') {
      shareUrl = shareUrl + "&wxwork=2"
    }
    console.log(shareUrl, this.data.wxwork,'shareUrl-----------------------------------------')
    return {
      title: $this.data.acInfo.share_title,
      imageUrl: $this.data.acInfo.share_picture,
      path: shareUrl // 路径，传递参数到指定页面。  
    }


  },
  goToShare() {
    this.setData({
      sharePic: true
    })
  },
  /**
   * 是否显示分享弹窗
   */
  ifShowShareModal() {
    this.setData({
      sharePic: false
    })
  },
  /**
   * 获取活动信息
   */
  getAcInfo(params) {
    var $this = this;
    wx.request({
      url: hostname + 'mini/coupon-share/share-group',
      data: params,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        console.log('获取活动信息', res);
        if (res.data.errcode == 0) {
          $this.setData({
            // gifImg: '',
            gifImg: res.data.data.activity.receive_success_pic,
            gifImgUrl: res.data.data.activity.redirect_miniapp,
            // gifImg: res.data.data.activity.coupons[0].gif,
            token: res.data.data.token
          })
          if ($this.data.from == 'wemember') {
            $this.setData({
              isShowMask: false,
              acInfo: res.data.data.activity
            })
            return
          }
          // 判断是否从注册回来
          console.log($this.data.isStart, 'isStart')
          if ($this.data.isStart == 4) {
            let data = {
              openid: $this.data.userInfo.openId,
              unionid: $this.data.userInfo.unionId,
              nickname: $this.data.userInfo.nickName,
              head_url: $this.data.userInfo.avatarUrl,
              channel: $this.data.channel,
              delivery_id: $this.data.delivery_id,
              source: 0,
              token: res.data.data.token
            }
            $this.setData({
              acInfo: res.data.data.activity,
              //  isShowMask: false,
            }, function () {
              console.log("acInfo", $this.data.acInfo);
              $this.doShare(data);
            });
            return;
          }
          // 判断是否参加过活动
          if (res.data.data.activity.is_join == 1) {
            if (res.data.data.receive_count >= res.data.data.activity.share_num) {
              console.log("isShare", $this.data.isShare)
              $this.setData({
                status: 2,
                successInfo: $this.data.successInfoHas ? $this.data.successInfoHas : res.data.data,
                isShowMask: false,
                acInfo: res.data.data.activity
              })
              console.log("success", $this.data.successInfo)
            } else {
              // 参加过但是没领过券
              if (res.data.data.activity.is_get_coupon == 0) {
                $this.setData({
                  successInfo: $this.data.successInfoHas ? $this.data.successInfoHas : res.data.data,
                  isShowMask: false,
                  acInfo: res.data.data.activity
                })
              } else {
                $this.setData({
                  status: 4,
                  successInfo: $this.data.successInfoHas ? $this.data.successInfoHas : res.data.data,
                  isShowMask: false,
                  acInfo: res.data.data.activity
                })
              }

              console.log("success3", $this.data.successInfo)
            }
            return false;
          }
          if (res.data.data.activity.is_get_coupon == 1) {
            let data = {
              openid: $this.data.userInfo.openId,
              unionid: $this.data.userInfo.unionId,
              nickname: $this.data.userInfo.nickName,
              head_url: $this.data.userInfo.avatarUrl,
              channel: $this.data.channel,
              delivery_id: $this.data.delivery_id,
              source: 0,
              token: res.data.data.token
            }
            $this.setData({
              acInfo: res.data.data.activity,
              successInfo: $this.data.successInfoHas ? $this.data.successInfoHas : res.data.data,
              //  isShowMask: false,
            }, function () {
              console.log("acInfo", $this.data.acInfo);
              $this.doShare(data);
            });
          } else {
            //被别人领了
            if (res.data.data.receive_count >= res.data.data.activity.share_num) {
              $this.setData({
                status: 6,
                successInfo: $this.data.successInfoHas ? $this.data.successInfoHas : res.data.data,
                isShowMask: false,
                acInfo: res.data.data.activity
              })
              $this.isActChannelFun();
              console.log("success2", $this.data.successInfo)
            } else {
              $this.setData({
                acInfo: res.data.data.activity,
                token: res.data.data.token,
                isShowMask: false,
                successInfo: $this.data.successInfoHas ? $this.data.successInfoHas : res.data.data,
              })
              if ($this.data.isShare) {
                if ($this.data.gohome == 1) {
                  $this.setData({
                    status: 0,
                    isShowMask: false
                  })
                } else {
                  $this.setData({
                    status: 1,
                    isShowMask: false
                  })
                }
              }
            }

          }
        } else {
          console.log(res.data.errmsg);
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }

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
   * 分享成功
   */
  doShare(data) {
    var $this = this;
    wx.showLoading({
      mask: true,
      title: '正在加载…'
    });
    
    wx.request({
      url: hostname + 'mini/coupon-share/do-share',
      data: data,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        // wx.hideLoading();
        //保存token
        if (res.data.errcode == 0) {
          $this.setData({
            token: res.data.data.token
          })
          // 判断已达上线 
          console.log('已领券又去开组的情况，没有次数了',$this.data.successInfo)
          if ($this.data.successInfo && $this.data.successInfo.activity && $this.data.successInfo.all_count >= $this.data.successInfo.activity.join_num) { 
            // 判断是否领取过券
            if ($this.data.acInfo.is_get_coupon == 1) {
              // 判断是否已经全部被领取
              if ($this.data.successInfo.receive_count == $this.data.successInfo.activity.share_num) {
                wx.hideLoading();
                $this.setData({
                  isShowMask: false,
                  status: 2
                })
              }else{
                wx.hideLoading();
                $this.setData({
                  isShowMask: false,
                  status: 4,
                  showBtn: true     //开启购物之旅按钮
                })
              }
              
              return false
            }else{
              console.log('次数已达上线')
              $this.setData({WisStart: true})
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '参加次数已达到上限',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    // console.log('用户点击确定')
                  } else if (res.cancel) {
                    // console.log('用户点击取消')
                  }
                }
              })
              $this.setData({
                isShowMask: false,
                status: 1,
              });
              return false
            }
            
          }else{
            //请求参数
            const params = {
              openid: data.openid,
              unionid: data.unionid,
              channel: data.channel,
              delivery_id: data.delivery_id,
              brand: $this.data.acInfo.brand_id,
              share_record_id: res.data.data.share_record_id
            }
            if ($this.data.acInfo.is_join == 1) {
              // wx.showModal({
              //   title: '提示信息',
              //   content:'您已参与此活动。',
              //   showCancel:false
              // })
              $this.shareSuccess(params);
            } else {
              console.log("doShare-data", params)
              $this.shareSuccess(params);
            }
          }
          
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none',
            duration: 20000
          })
        }
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
   * 检查本地存储内有没UnionId
   * @return boolean 
   */
  checkIfHadUnionId() {
    try {
      var userInfo = wx.getStorageSync('userInfo');
      if (userInfo && userInfo != '' && userInfo != null) {
        return true
      } else {
        //如果没有就跳去授权
        return false
      }
    } catch (e) {
      wx.showModal({
        title: '提示',
        content: 'unionid获取错误，请删除小程序重试',
      })
    }
  },
  /**
   * 分享成功后获取信息
   * @param
   * 
   */
  shareSuccess(params) {
    params.shopper_id = this.data.shopper_id
    params.store_id = this.data.store_id
    params.id = this.data.id
    params.nickname = this.data.userInfo.nickName
    console.log(this.data.wxwork, "++++++++1111++++++++")
    if(this.data.wxwork == 2){
      params.type = 2
    }
    
    var $this = this;
    // 判断参加次数是否已达上线   （遇到的问题：先领券又去开这个券的组）
    // if ($this.data.acInfo.is_get_coupon == 0) {
    //   wx.hideLoading();
    //   wx.showModal({
    //     title: '提示',
    //     content: '参加次数已达到上限',
    //     showCancel: false,
    //     success(res) {
    //       if (res.confirm) {
    //         // console.log('用户点击确定')
    //       } else if (res.cancel) {
    //         // console.log('用户点击取消')
    //       }
    //     }
    //   })
    //   $this.setData({
    //     isShowMask: false,
    //     status: 1,
    //   });
    //   return false
    // }
    if (shareFlag) return
    shareFlag = true
    
    wx.showLoading({
      mask: true,
      title: '正在加载…'
    });
    let url = hostname + 'mini/coupon-share/share-send-coupon'
    if (this.data.shopper_id) {
      url = 'https://bestseller.woaap.com/bestseller/addShareCard'
    }
    console.log(url, '领券接口-----------------------------------------', params)
    wx.request({
      url: url,
      data: params,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        console.log("分享成功后的信息", res)
        wx.hideLoading();
        shareFlag = false
        //判断是否是会员
        if (res.data.errcode == 0) {
          if (res.data.is_member == 0) {
            // wx.showModal({
            //   title: '提示',
            //   content: '授权领取微信会员卡+优惠券',
            //   showCancel: false,
            //   success(ret) {
            //     if (ret.confirm) {


            if (res.data.is_get_card == 1) { //判断是否领卡 领过 opencard
              wx.openCard({
                cardList: res.data.data.cardList,
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
            } else { //没有领过卡正常走开卡
              wx.showModal({
                title: '提示',
                content: '您还不是会员,是否需要注册',
                success(ret) {
                  if (ret.confirm) {
                    var url = res.data.activatemembercard_url;
                    var a = url.split("#")[0];
                    var b = a.split("?")[1].split("&");
                    var result = {};
                    for (var i = 0; i < b.length; i++) {
                      var c = b[i].split("=");
                      result[c[0]] = c[1];
                    }
                    console.log("微信开卡组件", url);
                    let data = {
                      biz: decodeURIComponent(result.biz),
                      encrypt_card_id: decodeURIComponent(result.encrypt_card_id),
                      outer_str: decodeURIComponent(result.outer_str)
                    }
                    console.log("传入data", data);
                    $this.memberRegistration(data);
                  } else if (ret.cancel) {

                  }
                }
              })
            }

            //     }
            //   }
            // })
          } else {
            //进入正常分享流程
            $this.setData({
              successInfo: res.data,
              successInfoHas: res.data,
            }, () => {
              $this.handleSuccessInfo();
            })
          }
        } else if (res.data.errcode == 201) {
          // 99积分弹窗
          
          wx.showModal({
            title: '积分兑换优惠券',
            content: res.data.data.points + '积分兑换优惠券',
            success: (res) => {
              if (res.confirm) {
                params.isConfirm = 1
                console.log(params,'积分兑换优惠券params')
                $this.shareSuccess(params)
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none',
            duration: 20000
          })
        }
      },
      fail: function (res) {
        // fail
        wx.showToast({
          title: res,
          icon: 'none'
        })
      }
    })
  },
  /**
   * 处理分享成功后的逻辑信息
   */
  handleSuccessInfo() {
    this.statusCheck();
  },
  /**
   * 页面状态判断
   */
  statusCheck() {
    let $this = this;
    if (this.data.shareing) {
      this.setData({
        showBtn: true     //开启购物之旅按钮
      })
    }
    //先判断是不是所有的券都被领取了
    console.log('successInfo', this.data.successInfo)
    if (this.data.successInfo.coupon_share_record.is_get_coupon == 0) {
      this.setData({
        isShowMask: true
      })
      this.getAllCard();
      return false
    }
    //判断当前活动可参与次数
    let isSelf = false;
    // 判断是否本人
    if ($this.data.successInfo.coupon_share_groups.openid == $this.data.userInfo.openId) {
      isSelf = true;
    }
    if (this.data.successInfo.all_count >= this.data.successInfo.activity.join_num && !isSelf) {
      // 领过券
      if (this.data.successInfo.coupon_share_record.is_get_coupon == 1) {
        this.setData({
          isShowMask: false,
          status: 4
        })
        return false
      }else {
        wx.showModal({
          title: '提示',
          content: '参加次数已达到上限',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              // console.log('用户点击确定')
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
        this.setData({
          status: 3,
          isShowMask: false
        });
        return false
      }
      
    }
    //判断当前活动可领取份数
    if (this.data.successInfo.receive_count == this.data.successInfo.activity.share_num) {
      if (this.data.acInfo.is_join == 1) {           //是否参与此活动
        this.setData({
          status: 2,
          isShowMask: false
        });
        return false;
      }

      if (this.data.acInfo.is_get_coupon == 1) {    // 领过
        this.setData({
          status: 2,
          isShowMask: false
        });
      } else {   // 没有领到，需要加按钮可以自己分享
        this.setData({
          status: 6,
          isShowMask: false
        });
        this.isActChannelFun();
      }

      return false
    }
    //正常状态
    let lock = wx.getStorageSync('share-status-lock');
    if (lock != 4) {
      this.setData({
        status: 4,
        isShowMask: false
      });
    } else {
      wx.removeStorageSync('share-status-lock');
    }
  },
  /**
   * 生成新礼包与好友分享
   */
  toNewGift() {
    // this.setData({
    //   status: 0
    // });

    let $this = this;
    let newUrl = `/pages/share/share?channel=${$this.data.channel}&delivery_id=${$this.data.delivery_id}`
    if ($this.data.shopper_id) {
      newUrl += `&shopper_id=${$this.data.shopper_id}&store_id=${this.data.store_id}&id=${this.data.id}`
    }
    wx.navigateTo({
      url: newUrl
    })
  },
  /**
   * 领卡领券
   */
  getAllCard() {
    var _this = this;
    if (this.data.WisStart) {
      wx.showModal({
        title: '提示',
        content: '参加次数已达到上限',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
      return;
    }
    wx.showLoading({
      title: '正在加载…'
    })
    _this.setData({
      isShowMask: true,
      isAddcard: true,
      showBtn: true     //开启购物之旅按钮
    })
    wx.addCard({
      cardList: _this.data.successInfo.data.cardList,
      success: function (back) {
        //判断是单张券还是多张券  单张券需要展示
        if (back.cardList.length == 1) {
          _this.codeGet(back.cardList[0].cardId, back.cardList[0].code);
        } else {
          _this.setData({
            isShowMask: true,
            isAddcard: false
          })
          wx.setStorageSync('share-status-lock', 4);
          _this.getCardSuccess();
        }
      },
      fail: function (res) {
        console.log("addcard fail")
        _this.setData({
          isShowMask: false,
          status: 1,
          isAddcard: false
        }, () => {
          wx.hideLoading();
        })
      }
    })
  },
  shareGetAllCard() {
    let $this = this;
    console.log($this.data.successInfo)
    //判断当前活动可参与次数
    let isSelf = false;
    // 判断是否本人
    if ($this.data.successInfo.coupon_share_groups.openid == $this.data.userInfo.openId) {
      isSelf = true;
    }
    if ($this.data.successInfo.all_count >= $this.data.successInfo.activity.join_num && !isSelf) {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '参加次数已达到上限',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
      $this.setData({
        isShowMask: false,
        status: 3
      });
      return false
    }
    let data = {
      openid: $this.data.userInfo.openId,
      unionid: $this.data.userInfo.unionId,
      nickname: $this.data.userInfo.nickName,
      head_url: $this.data.userInfo.avatarUrl,
      channel: $this.data.channel,
      delivery_id: $this.data.delivery_id,
      source: 0,
      token: $this.data.token
    }
    console.log("shareGetAllCard-data", data);
    $this.doShare(data);
  },
  getCardSuccess() {
    console.log("getCardSuccess")

    var _this = this;
    console.log(_this.data.successInfo)
    console.log(_this.data.acInfo)
    wx.request({
      url: hostname + 'coupon-share/receive-callback',
      data: {
        share_record_id: _this.data.successInfo.coupon_share_record.id,
        delivery_id: _this.data.successInfo.delivery_id,
        brand: _this.data.acInfo.brand_id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        console.log("getCardSuccess", "success")
        if (_this.data.successInfo.receive_count == _this.data.acInfo.share_num) { // 最后一组券
          _this.setData({
            isShowMask: false,
            status: 2
          })
        } else {
          _this.setData({
            isShowMask: false,
            status: 4
          })
        }
        wx.hideLoading();
      },
      fail: function () {
        // fail
        console.log("getCardSuccess", "fail")
        wx.hideLoading();
        _this.setData({
          isShowMask: false,
        })
      },
      complete: function () {
        // complete
      }
    })
  },
  /**
   * 跳转到指定页面
   */
  jumpToShop() {
    let URL = "/" + this.data.acInfo.miniapp_url;
    if (this.data.acInfo.miniapp_url && this.data.acInfo.miniapp_url != '') {
      if (
        URL == '/pages/index/index' ||
        URL == '/pages/memberCenter/memberCenter' ||
        URL == '/pages/informat/informat' ||
        URL == '/pages/userDaogou/guide/guide' ||
        URL == '/pages/nearbyShops/main/main'
      ) {
        wx.switchTab({
          url: URL,
        })
      } else {
        wx.redirectTo({
          url: URL,
        })
      }
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
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
        console.log(data);
        wx.navigateToMiniProgram({
          appId: 'wxeb490c6f9b154ef9', // 固定为此 appid，不可改动
          extraData: data, // 包括 encrypt_card_id, outer_str, biz三个字段，须从 step3 中获得的链接中获取参数
          success: function (res) {
            wx.setStorageSync('isStart', 4);
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
  codeGet(cardId, code) {
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
        _this.getCardSuccess();
        wx.openCard({
          cardList: [{
            cardId: cardId,
            code: res.data.data.code
          }],
          success: function () {
            _this.setData({
              status: 4,
              isAddcard: false
            }, () => {
              // _this.getCardSuccess();
            })
          }
        })
      },
      fail: function (ret) {
        // fail
        _this.setData({
          isShowMask: false,
        })
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
  isActChannelFun() {
    console.log('isActChannelFun')
    let _this = this
    // 判断这些活动是否需要   ”生成新礼包与好友分享“按钮
    wx.request({
      url: hostname + 'mini/coupon-share/getChannel',
      data: {
        channel: _this.data.channel,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        if (res.data.data.exists == 1) {
          _this.setData({ isActChannel: true });
        } else {
          console.log('需要生成新礼包按钮')
        }
      },
      fail: function (ret) {
        
      },
      complete: function () {
        // complete
      }
    })
    
  },
  /**
   * 图片跳转
   */
  gifImgjumpToShop() {
    let URL;
    if(this.data.acInfo.redirect_miniapp.substr(0, 1) == "/"){
      URL = this.data.acInfo.redirect_miniapp;
    } else {
      URL = "/" + this.data.acInfo.redirect_miniapp;
    }
    // let URL = "/" + this.data.acInfo.redirect_miniapp;
    if (this.data.acInfo.redirect_miniapp && this.data.acInfo.redirect_miniapp != '') {
      console.log(URL)
      if (
        URL == '/pages/index/index' ||
        URL == '/pages/memberCenter/memberCenter' ||
        URL == '/pages/informat/informat' ||
        URL == '/pages/userDaogou/guide/guide' ||
        URL == '/pages/nearbyShops/main/main'
      ) {
        wx.switchTab({
          url: URL,
        })
      } else {
        wx.redirectTo({
          url: URL,
        })
      }
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }
})