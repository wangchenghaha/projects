/*
 * @Author: your name
 * @Date: 2020-06-04 16:03:19
 * @LastEditTime: 2020-07-14 17:27:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /FOL/activity/redRain/ticketView/ticketView.js
 */ 
//Page Object

import {getCouponList,getCouphon,addUserNum} from "../../../service/redRain"
import {KEYSTORAGE} from '../../../src/const'

const brand = getApp().config.brand

var userData = {}
// 图片地址
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${brand}/redRains/`



const qrWidthPX = 120
const qrHeightPX = 120
Page({
    data: {
        brand,
        // 我的金币
        jinbi : 0,
        imgPath,
        yhqArrs : [],
        showTwoBounced : false,
        showThreeBounced : false,
        showGuize : false,
        qrImgJson : {},
        // 生成图用
        currentTapTitle : ''
        
    },
    // 获取优惠券列表
    request(){

        getCouponList().then(res => {
            if (res){
                this.setData({yhqArrs : res})
            }
        })
    },
    //options(Object)
    onLoad: function(options){
        userData = wx.getStorageSync('hby_userInfo');
        this.setData({jinbi : userData.points?userData.points:0})
        this.request()

        let navColor = brand == 'VEROMODA' ? '#0072CB' : '#0055FA'
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: navColor
        })
    },
    // 兑奖记录
    jilu(){
        wx.navigateTo({
            url: `../myTicketView/myTicketView?jinbi=${this.data.jinbi}`
        });
    },
    closed(e){
        let type = e.detail
        this.setData({
            showTwoBounced : false,
            showThreeBounced : false
        })
        if (type == 'shengcheng'){
            if (this.data.qrImgJson.path && this.data.qrImgJson.path != ''){
                this.setData({showThreeBounced : true})
            }
            else{
                wx.showLoading({
                    title: '加载中……',
                    mask: true
                });
                this.createQrCode().then(res => {
                    wx.hideLoading();
                    this.setData({showThreeBounced : true,qrImgJson : res})
                })
            }
        }
    },
    // 领取优惠券
    requestGetCoupon(e){
        let item = e.detail
        if (this.data.jinbi >= parseInt(item.pointsRequire)){

        let isMember = wx.getStorageSync('isMember');
        if(!isMember){
            // 注册会员
            getApp().isMemberETO()
            return
        }

        let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)

            let jinbi = this.data.jinbi
      
            let json = {
                phone : userInfo.phone,
                userId : userData.id,
                exchangeGiftName : item.giftName,
                giftId : item.id,
                giftPic : item.giftPic
            }
            getCouphon(json).then(res => {
                if (res){
                    jinbi -= parseInt(item.pointsRequire)
                    this.setData({jinbi,showTwoBounced : true,currentTapTitle : json.exchangeGiftName})
                    let _this = this
                    setTimeout(() => {
                        _this.request()
                    }, 1000);
                    
                }
            })
            
        }
        else{
            wx.showToast({
                title: '金币不足',
                icon: 'none'
            });
        }
        

    },
    onReady: function(){
        
    },
    onShow: function(){
        
    },
    onHide: function(){

    },
    onUnload: function(){

    },
    onPullDownRefresh: function(){

    },
    onReachBottom: function(){

    },
    onPageScroll: function(){

    },
    //item(index,pagePath,text)
    onTabItemTap:function(item){

    },

  // 生成二维码
  createQrCode(){

    return new Promise((resolve, reject) => {

      let scene = '1'
      const param = {
        scene,
        page: 'activity/redRain/index/index',
        is_hyaline: false,
        width : qrWidthPX,
        height : qrHeightPX
      };
      // console.log(`aaaaaa:${JSON.stringify(param)}`)
      // aaaaaa:{"scene":"2_2_1260447545985773569","page":"livePlayer/playerDetail/playerDetail","is_hyaline":false,"width":120,"height":120}
  
      getWxaCodeUnpubAddrQR(param).then(res=>{
        wx.getImageInfo({
          src: res,
          success (res) {
            let json = {
              path : res.path,
              width : res.width * 0.7,
              height : res.height * 0.7
            }
            resolve(json)
          }
        })
      }).catch(err=> {
        wx.hideLoading();
        reject(err)
      });

    })

  },
  saveImg(){
      wx.showLoading({
          title: '生成中……',
          mask: true
      });

    let canvasID = 'canvasID'
    let img = `${imgPath}hby_haibaotu.png`

    let _this = this
    wx.getImageInfo({
        src: img,
        success (res) {

            let imgW = res.width
            let imgH = res.height


                var cvsCtx = wx.createCanvasContext(canvasID,_this);
                cvsCtx.clearRect(0, 0, imgW, imgH);
                cvsCtx.drawImage(res.path, 0, 0, imgW, imgH);

                let x = imgW - imgW * 0.2 - _this.data.qrImgJson.width
                let y = imgH - imgH * 0.05 - _this.data.qrImgJson.height

                cvsCtx.drawImage(_this.data.qrImgJson.path, x,y,_this.data.qrImgJson.width,_this.data.qrImgJson.height);

                let fontSize = 28
                let textColor = '#EE2C50'
                let text = '我在绫致七夕甜蜜鹊桥惠小游戏获得了'
                let text1 = `${_this.data.currentTapTitle}!`

                x = imgW * 0.15
                y = imgH - imgH * 0.27 - fontSize * 2
                cvsCtx.setFontSize(fontSize)
                cvsCtx.setFillStyle(textColor)

                cvsCtx.fillText(text,x,y)
                y += fontSize + 2
                const metrics = cvsCtx.measureText(text)
                x += metrics.width / 3
                cvsCtx.fillText(text1,x,y)

                cvsCtx.draw(true,()=>{
                    wx.canvasToTempFilePath({
                        x: 0,
                        y: 0,
                        width: imgW,
                        height: imgH,
                        destWidth: imgW * 2,  //解决生成图模糊问题
                        destHeight: imgH * 2,    //解决生成图模糊问题
                        canvasId: canvasID,
                        success(res) {
                        wx.hideLoading();
                        console.log(`绘制完成:${JSON.stringify(res)}`)
                            _this.shouquan(res)
                        }
                    })
                });

        },
        fail:(err =>{
          wx.hideLoading();
            console.log(`错误：￥「${JSON.stringify(err)}」`)
        })
      })


  },
  shouquan(imgRes){

    // 授权
    wx.getSetting({ success: res => {

        if (!res.authSetting['scope.writePhotosAlbum']){
          wx.authorize({
            scope:
              'scope.writePhotosAlbum',
            success: res => {
  
              this.saveImage(imgRes)
  
            },
            fail: () => {
              wx.showModal({
                title: '提示', //提示的标题,
                content: '需要授权相册权限才能保存', //提示的内容,
                showCancel: true, //是否显示取消按钮,
                cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
                cancelColor: '#000000', //取消按钮的文字颜色,
                confirmText: '设置', //确定按钮的文字，默认为取消，最多 4 个字符,
                confirmColor: '#3CC51F', //确定按钮的文字颜色,
                success: res => {
                  if (res.confirm) {
                    wx.openSetting({ success: res => {
                      if (res.authSetting['scope.writePhotosAlbum']){
                        
                        this.saveImage(imgRes)
  
                      }
                    } });
                  } 
                }
              });
            }
          });
        }
        else{
  
          this.saveImage(imgRes)
  
        }
      } });
  },
  saveImage : function(imgRes){
    let _this = this
    wx.saveImageToPhotosAlbum({
      filePath: imgRes.tempFilePath, //图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径,
      success: res => {
        wx.showToast({
          title: '图片保存成功',
          icon: 'none'
        });

        setTimeout(() => {
          _this.setData({
            showTwoBounced : false,
            showThreeBounced : false
          })
          _this.addNum()
        }, 1600);
      }
    });

  },
  guize(){
    this.setData({showGuize : true})
  },
  guizeClose(){
    this.setData({showGuize : false})
  },
  // 增加用户积分
  addNum(){
    addUserNum({userid : userData.id}).then(e => {

      userData = wx.getStorageSync('hby_userInfo');
      userData.points = e
      wx.setStorageSync('hby_userInfo', userData);
      this.setData({jinbi : userData.points?userData.points:0})
    })
  }
});