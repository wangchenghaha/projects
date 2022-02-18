import main from '../utils/utils'
import API from '../api/index'
import fetch from '../sever/index'
import img from '../model/img-model'
import Poster from './pallete'

const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;


Page({
    data: {
        brand,
        bigPhone: main.judgeBigScreen(),
        showalert: false,
        token: '',
        showoption: {
            type: 1,
            show: false,
            alerttext: '',
            btntext: ''
        },
        imgmodel: {
        },
        basecolor: img.basecolor,
        showshareflag: false,
        imageurl: '',
        imgok: false,
        canvas: {},
        authorize: true,
        imgUrl: API.CrmImgUrl,
        recordId: '',
        btnTextList:''
    },
    onShow: function () {
        //获取该页面所需要的图片，进行图片渲染
        var _this = this;
        let activeInfo = wx.getStorageSync("activeInfo");
        _this.setData({
            basecolor: activeInfo.buttonColour
        });
        let imgList = wx.getStorageSync("imgList");
        if (imgList) {
            _this.setData({
                imgList: imgList
            });
        } else {
            main.getPictureList(API.getPictureList, '').then(res => {
                _this.setData({
                    imgList: res.data.data
                });
            });
        }
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '拼团详情'
        })
    },
    onLoad(options) {
        if (!options.recordId) {
            wx.showToast({
                title: '缺少参数',
                icon: 'none',
                duration: 2000
            })
            return
        }
        this.setData({
            recordId: options.recordId
        });
        //获取按钮文字
        main.getButtonText().then(res => {
            this.setData({
                btnTextList: res
            });
        });
    },
    closeshareclick() {

    },
    closeshare() {
        this.setData({
            showshareflag: false
        })
    },
    showshare() {
        this.setData({
            showshareflag: true
        })
    },
    openCard() {

        let data = {
            record_id: this.data.recordId
        }
        fetch({url: API.getCoupons, data: data, needUnionid: true, method: 'GET'}).then(res => {
            if (res.errcode == 0) {
                if (res.data.is_get_coupon) {
                    //打开卡券
                    console.log('result=============', res.data.cardList.cardList);
                  console.log(res.data.cardList.cardList);
                    wx.openCard({
                        cardList:  res.data.cardList.cardList,
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
                }
            } else {
                wx.showModal({
                    title: '提示',
                    content: errmsg || '网络异常,请再来一次呗！',
                    showCancel: false
                })

            }
        })
    },
    endfun() {
        this.setData({
            showoption: {
                type: 1,
                show: true,
                alerttext: '您来晚了，活动已结束！',
                btntext: this.data.btnTextList.type_5,//'活动已结束
                success() {
                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                }
            }
        })
    },
    onShareAppMessage() {
        var _this = this;
        return main.baseshare('', API.CrmImgUrl + _this.data.imgList.share);
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
    miniqrcode() {
        // fetch({url: API.miniqrcode}).then(res => {
        //     let {data, errcode} = res
        //     if (errcode == 0) {
        //         let obj = {
        //             bg: img.posterbg,
        //             qc: data.qrcode_url
        //         }
        //         this.startDraw(obj)
        //     }
        // })

        var _this = this;
        var utm_info = wx.getStorageSync('utm_info');
        console.log("=================================user_utm");
        console.log(utm_info);
        var user_utm;
        utm_info.forEach((item, index) => {
            if (item.channelName == '分享朋友圈') {
                user_utm = item;
            }
        });
        console.log(user_utm.id);
        let data = {
            "campainId": wx.getStorageSync("campainId"),
            "chiefId": '',
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
                if (data.code == 200) {
                    let obj = {
                        bg: API.CrmImgUrl+_this.data.imgList.posterbg,
                        qc: API.CrmImgUrl+data.data.picUrl
                    };

                    _this.startDraw(obj)
                }
            },
            fail: function (d) {
            }
        });

    },
    shareposter() {
        this.setData({
            showshareflag: false
        })
        this.miniqrcode()
    },
    closeposter() {
        this.setData({
            showposter: false
        })
    },
    catchclick() {

    },
    goCompain(){
        let ac = wx.getStorageSync("campainId");
        let ch = wx.getStorageSync("user_utm_channel");
        wx.redirectTo({
            url: `/attendgroup/index/index?ac=${ac}?ch=${ch}`
        });
    },
    // 打开首页
    goBack: function () {
        wx.switchTab({url: '/pages/index/index'})
    }
});