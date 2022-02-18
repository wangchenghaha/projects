import main from '../utils/utils'
import API from '../api/index'
import fetch from '../sever/index'
import Poster from './pallete'
import img from '../model/img-model'

const config = require('../../src/config.js')
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;


Page({
    data: {
        brand,
        bigPhone: main.judgeBigScreen(),
        showrule: false,
        showalert: false,
        avterlist: [],
        avterNum: 0,
        showposter: false,
        imageurl: '',
        imgok: false,
        canvas: {},
        authorize: true,
        token: '',
        showoption: {
            type: 1,
            show: false,
            alerttext: '',
            btntext: ''
        },
        joinNum: 0,
        couponlist: img.couponlist,
        imgmodel: {
            unknow: img.unknow,
        },
        imgUrl:API.CrmImgUrl,
        groupList:img.groupList,
        basecolor: img.basecolor,
        chiefId:'',
        campainId:'',
        user_utm_channel:'',
        btnTextList:''
    },
    onShow: function () {

        var _this = this;

        let imgList = wx.getStorageSync("imgList");
        if(imgList){
            _this.setData({
                imgList: imgList
            });
        }else {
            main.getPictureList(API.getPictureList, '').then(res => {
                _this.setData({
                    imgList: res.data.data
                });
            });
        }
        this.activeInfo();
    },
    onLoad(options) {
        var ac = wx.getStorageSync("campainId");
        var ch = wx.getStorageSync("user_utm_channel");
        // = wx.getStorageSync("Join_chiefId");
        var chf;

        if (options.camp) {
            ac = main.getQueryVariable2(options.camp, 'ac');
            ch = main.getQueryVariable2(options.camp, 'ch');
            chf = main.getQueryVariable2(options.camp, 'chf');
        }

        if (!options.chf && !chf) {
            wx.showToast({
                title: '缺少团ID',
                icon: 'none'
            });
            return
        }
        if (!options.ac && !ac) {
            wx.showToast({
                title: '缺少活动ID',
                icon: 'none'
            });
            return
        }

        this.setData({
            campainId: options.ac || ac,
            user_utm_channel: options.ch || ch,
            chiefId: options.chf || chf
        });

        console.log("options===group==========", options)
        console.log("====index====ac================" + this.data.campainId);
        console.log("=====index===ch================" + this.data.user_utm_channel);
        console.log("=====index===chf================" + this.data.chiefId);
        wx.setStorageSync("campainId", this.data.campainId);
        wx.setStorageSync("user_utm_channel", this.data.user_utm_channel);
        wx.setStorageSync("Join_chiefId", this.data.chiefId);

        //获取按钮文字
        main.getButtonText().then(res => {
            console.log("==================btn",res);
            this.setData({
                btnTextList: res
            });
        });
      this.info()
    },
    registerFormSubmit2(e) {
        // if(e.detail.formId) {
        //   main.debounce(this.formId(e.detail.formId),500)
        // }
    },
    requestSubscribeMessage() {
        wx.requestSubscribeMessage({
            // tmplIds: ['mzfexAzJxSJqMxwL9npW8tft6IsLV-uMv7LhI5v3bwA','uUT6Do3Rcavkyol8crO7GjEYgPRVptCpN2NkLeJnoRg','3KHXZjmHAuDWEfyeMX-Y0PylhQk5nn9ojUVYx6xLHeg'],
            tmplIds: ['5kk7ZMmPcGJuH1Los9aK2ieHS8BtxI6A8YspiVSBWDU', 'VCfKSpXiIuNDruG9IhlqNBpokRAXxbsc9mwy0GtdMRo', 'GWnGF1SwiIkkoAXEwUmK3M9F9HH91D8ZQ0vag6aVvdM'],
            success(res) {
            },
            fail(err) {
            },
            complete(res) {
                console.log(res)
            }
        })
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: config.title
        })
    },
    //上传formid
    // formId(form_id) {
    //     fetch({url: API.formId, data: {form_id}}).then(res => {
    //     })
    // },
    //拼团详情
    info() {
        fetch({url: API.tuanInfo, data: {id: this.data.chiefId}, method: 'POST'}).then(res => {
            let {data, code} = res
            console.log(data)
            if (res.code == 200) {

                if (data.isFail) {
                    wx.redirectTo({
                        url: `/attendgroup/coupon/coupon?chf=`+this.data.chiefId
                    })
                    return
                } else {
                    let avterlist = new Array(data.stock);
                    if (data.membersleagues.length) {
                        data.membersleagues.forEach((item, index) => {
                            avterlist[index] = item
                        });
                    }
                    this.setData({
                        avterlist,
                        balance: data.balance
                    })
                }
            } else if (res.code == 5001) {
                // this.endfun()
                this.setData({
                    showoption: {
                        type: 1,
                        show: true,
                        alerttext: res.msg,
                        btntext: this.data.btnTextList.type_9,//'开启我的战队
                        success() {
                            wx.redirectTo({
                                url: '/attendgroup/index/index'
                            })
                        }
                    }
                })
            }
        })
    },
    startDraw(obj) {
        const me = this
        console.log('obj', obj)
        let poster = new Poster().palette(obj)
        me.setData({
            canvas: poster,
            showposter: true
        })
    },
    handleSetting(e) {
        let writePhotosAlbum = e.detail.authSetting['scope.writePhotosAlbum']
        if (writePhotosAlbum) {
            this.setData({
                authorize: true
            })
        }
    },
    getSettings() {
        let that = this;
        wx.showLoading({
            title: '获取授权中...',
            mask: true,
        })
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() { //这里是用户同意授权后的回调
                            wx.showLoading({
                                title: '图片保存中...',
                                mask: true,
                            })
                            that.downloadFile(that.data.imageurl)
                        },
                        fail() { //这里是用户拒绝授权后的回调
                            // console.log('拒绝授权')
                            wx.showToast({
                                title: '拒绝授权',
                                icon: 'none',
                                duration: 2000
                            })
                            that.setData({
                                authorize: false
                            })
                        }
                    })
                } else {
                    wx.showLoading({
                        title: '图片保存中...',
                        mask: true,
                    })
                    that.downloadFile(that.data.imageurl)
                }
            },
            fail(err) {
                console.log('授权失败--------------')
            }
        })
    },
    // 获取权限
    getSetting() {
        const me = this
        wx.getSetting({
            success(resp) {
                if (resp.authSetting['scope.writePhotosAlbum']) {
                    me.downloadFile(me.data.imageurl)
                }
            }
        })
    },
    // 下载图片
    downloadFile(tempFilePath) {
        wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: function (res) {
                wx.showToast({
                    title: '保存图片成功',
                    icon: 'success',
                    duration: 400,
                })
            },
            fail: function (err) {
                wx.showToast({
                    title: '保存失败',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    downloadUrl(url) {
        return new Promise((resolve, reject) => {
            wx.downloadFile({
                url: url,
                success: (result) => {
                    resolve(result)
                },
                fail: (err) => {
                    reject(err)
                },
                complete: () => {
                }
            });
        })
    },
    onImgOK(res) {
        this.setData({
            imageurl: res.detail.path,
            imgok: true
        })
    },
    clicksure(obj) {
        obj.detail.success && obj.detail.success();
    },
    endfun() {
        this.setData({
            showoption: {
                type: 1,
                show: true,
                alerttext: '您来晚了，活动已结束！',
                btntext: this.data.btnTextList.type_5,//'我知道了'
                success() {
                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                }
            }
        })
    },
    shareRecord() {
        fetch({url: API.shareRecord, data: {token: this.data.token}}).then(res => {
        })
    },
    miniqrcode() {
        wx.showLoading({
          title: ' ',
          icon: 'loading',
          mask: true
        })
      var _this = this;
      var utm_info = wx.getStorageSync('utm_info');
      console.log("=================================utm_info",utm_info);
      var user_utm;
      utm_info.forEach((item, index) => {
        if (item.channelName == '分享朋友圈') {
          user_utm = item;
        }
      });
      console.log("使用的UTM为：",user_utm);
      let data = {
        "campainId": wx.getStorageSync("campainId"),
        "chiefId": _this.data.chiefId,
        "channelId": user_utm.id,
        "type": 1,
        brandId: getApp().config.etoBrand
      };
      wx.request({
        url: API.getWeChartImgUrl,
        method: 'POST',
        data: data,
        success: function (res) {
          let {data, code} = res;
          console.log(res);
          console.log(data);
          if (data.code === 200) {

              let imgUrl = API.CrmImgUrl+_this.data.imgList.posterbg;
              let qcUrl = API.CrmImgUrl+data.data.picUrl;

              // let imgUrl = img.postershare;
              // let qcUrl = API.CrmImgUrl+data.data.picUrl;
              let obj = {
                  bg: imgUrl,
                  qc: qcUrl
              };
              _this.startDraw(obj)
          }
        },
        fail: function (d) {
        }
      });
    },
    _getImageInfo(imgPath, index) {
        return new Promise((resolve, reject) => {
            wx.getImageInfo({
                src: imgPath,
                success(res) {
                    resolve({ imgPath, imgInfo: res, index });
                },
                fail(err) {
                    reject(err);
                },
            });
        });
    },
    shareposter() {
        this.miniqrcode()
    },
    closeposter() {
        this.setData({
            showposter: false
        })
    },
    catchclick() {

    },
    onShareAppMessage() {
        var _this = this;
        return main.baseshare(this.data.chiefId,API.CrmImgUrl+_this.data.imgList.share);
    },
    activeInfo(){
        var _this = this;
        let activeInfo = wx.getStorageSync("activeInfo");
        if(activeInfo){
            _this.setData({
                basecolor: activeInfo.buttonColour
            });
        }else{
            let data = {
                id: this.data.campainId,
            };
            fetch({url: API.activeInfo, data, method: 'POST'}).then(res => {
                let {data, code, msg} = res;
                if (res.code == 200) {

                    //将活动信息存储缓存
                    wx.setStorageSync("activeInfo", res.data);
                    _this.setData({
                        basecolor: res.data.buttonColour
                    });
                }
            });
        }
    }

})