//index.js
//获取应用实例
import API from '../api/index'
import main from "../base/mains.js"
import {urls} from "../base/url.js"
import Card from '../post/palette/card.js';


Page({
  clickTime: 0,
  data: {
    balance:'0', //我的金币
    is_new:0,  
    betCoin:'10', //下注金币
    winCoin:'0',  //赢得的金币
    is_get_card:0, //是否领取过优惠券,
    getMoreAlert:false, //获取更多弹框
    template: new Card().palette(''), //海报
    haibaoAlert:false, //海报弹窗
    qrcode_url:"", //小程序码地址
    cardInfo:{},
    loadImageList:[
      'https://alioss.woaap.com/bestseller/campaign2001/images/mickey_share.jpg',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon1.png', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon2.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon3.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/tiger_bg.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/tiger_left.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/tiger_left.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/tiger_line.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/tiger_more.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/tiger_haoyou.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/tiger_haibao.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/haibao_text.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/haibao_back.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/new_user_bg.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/new_user_view.png',
    ],
    imageList: [
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon1.png', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon2.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon3.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon1.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon2.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon3.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon1.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon2.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon3.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon1.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon2.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon3.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon1.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon2.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon3.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon1.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon2.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/icon3.png', 
    ],
    rotate:[0, 0, 0], //三列转动到的下标
    showMask:false,
    membercard:"",
    
  },
  onLoad: function (options) {
    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    let unionid = wx.getStorageSync('unionid')
    if(!openid || !unionid) {
      wx.navigateTo({
          url: '/pages/etoLogin/etoLogin'
      })
      // return false
    }

    this.setData({
      membercard:options.membercard,
      channel:options.channel || wx.getStorageSync("mickeyChannel") || "",
      shop_type:options.shop_type || wx.getStorageSync("mickeyShopType") || "",
    })
    wx.setStorageSync("mickeyIsNew", 1);
    wx.hideShareMenu()
    wx.getSystemInfo({
      success: (res) => {
        console.log(res.windowHeight, res.windowHeight * 2);
        this.setData({
          isBigScreen:res.windowHeight * 2 > 1208,
        })
      }
    })
    main.request(API.qrcode, {}, 'GET').then(res => {
      console.log(res);
      let {errcode, errmsg, data} = res.data;
      if(errcode == 0){
        this.setData({
          template: new Card().palette(data.qrcode_url),
        })
      } else {
        main.showToast(errmsg);
      }
    })

    // this.init();
  },
  haibao(){
    this.setData({
      haibaoAlert:true
    })
  },
  haibaoBack(){
    this.setData({
      haibaoAlert: false,
    })
  },
  init(){
    let reqData = {}
    main.request(API.is_hand, {}, "GET").then(res=>{
      let {errcode, errmsg, data} = res.data;
      if(errcode == 0){
        let {balance, is_new, is_get_card} = data;
        this.setData({
          is_get_card,
          balance,
          is_new
        })
      } else {
        main.showToast(errmsg)
      }
    })
  },
  closeNewAlert(){
    this.setData({
      is_new:0,
    })
  },
  
  onShow: function () {
    
    if(wx.getStorageSync('isStart') === 8) {
      wx.showLoading({
        title: ' ',
        icon: 'loading',
        mask: true
      })
      return false
    }
    if(this.data.membercard == 1) {
      this.init(false)
      this.data.membercard == ''
      this.checkIsMember()
    }else{
      this.init()
      // this.puuv(this.data.entry)
    }
  },
  start(){
    if(Number(this.data.balance) <= 0){
      this.setData({
        getMoreAlert:true,
      })
      return
    }

    this.setData({
      showMask:true,
    }, ()=>{
      main.request(API.luck_bandit, {gold: this.data.betCoin}, "GET", { 'content-type': 'application/x-www-form-urlencoded' }, 1).then(res => {
        let {errcode, errmsg} = res.data;
        if(errcode == 0){
          //设置转动列
          let {award_id, gold} = res.data.data
          let rotateIndex = this.getRotateArray(award_id);
          this.clickTime++;
          let rotate = this.data.rotate.map((item, index) => {
            return -720 * this.clickTime - (360 * index) * (this.clickTime + 1) - (20 * rotateIndex[index])
          })
          
          //减少金币 开始转动
          let {balance} = this.data;
          balance -= this.data.betCoin;
          this.setData({
            balance,
            winCoin:0,
            rotate
          })
          // 4后展示中间结果
          setTimeout(() => {
            balance += gold;
            this.setData({
              balance,
              winCoin:gold,
              showMask:false,
              betCoin:this.data.betCoin > balance ? balance : this.data.betCoin,
            })
            if(award_id != 1){ //中奖之后的弹框

            }
          }, 4000);

          let reqData = {
            activity_no:"bandit",
            channel: this.data.channel || "1",
            shop_type: this.data.shop_type || "2",
            id: award_id,
            raw_data: JSON.stringify(res.data.data),
            inviter_openid: wx.getStorageSync("mickeyInviterOpenid") || "",
          }
          main.request(API.set_channel, reqData, "POST", { 'content-type': 'application/x-www-form-urlencoded' }, 0).then(msg => {
            console.log(msg)
          })
        } else {
          main.showToast(errmsg)
          this.setData({
            showMask:false,
            betCoin:10
          })
        }
      }).catch(err => {
          console.log(err)
          this.setData({
            showMask:false,
          })
      })
    })
  },
  getRotateArray(awardId){
    // awardId   1、不中奖[数组三个不一致即可]  2、一赔一 对应[0,0,0]    3、一赔二 对应[1,1,1]    4、一赔三 对应[2,2,2] 
    let arr = [];
    for(let i = 0; i < 3; i++){
      if(awardId == 1){
        arr[i] = Math.floor(Math.random()*3);
      } else {
        arr[i] = awardId - 2;
      }
    }
    if(awardId == 1 && arr[0] == arr[1] && arr[2] == arr[1]){
      // 此情况为未中奖的情况下 随机出了三个一样的数字，重新随机
      return this.getRotateArray(1);
    } 
    return arr;
  },
  goLuck(){
    main.link(`${urls.mickeyLuckDraw}?channel=${this.data.channel}&shop_type=${this.data.shop_type}`);
  },
  goRules(){
    main.link(urls.mickeyRules + "?alertType=gift");
  },
  changeBetCoin(e){
    let {betCoin, getCoin} = this.data;
    let num = Number(e.currentTarget.dataset.type + "10");
    betCoin = Number(betCoin) + num;
    if(betCoin > this.data.balance || betCoin > 100){
      main.showToast("加注金币已达上限");
      return;
    }
    if(betCoin < 10){
      main.showToast("加注金币最小为10");
      return;
    }
    this.setData({
      betCoin
    })

  },

  //检查是否是会员
  checkIsMember() {
    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    let unionid = wx.getStorageSync('unionid')
    if(!openid || !unionid) {
      wx.navigateTo({
          url: '/pages/etoLogin/etoLogin'
      })
      return false
    }

    console.log('查询是否是会员')
    const me = this
    wx.showLoading({
      title: ' ',
      icon: 'loading',
      mask: true
    })
    wx.request({
      url: API.isMember,
      data: {
        brand: 2,
        unionid
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      success: (res) => {
        wx.hideLoading()
        console.log('查询会员结果',res.data)
        let {data, errcode, errmsg, activatemembercard_url,is_member } = res.data
        
        if ( errcode === 0 ) {
          // 是会员
          if ( is_member ) {
            me.goCoupon()
            
          }else {
            console.log("未开卡-=-==-=-=");
            //没有领过卡正常走开卡
            var url = activatemembercard_url;
            var a = url.split("#")[0];
            var b = a.split("?")[1].split("&");
            var result = {};
            for (var i = 0; i < b.length; i++) {
              var c = b[i].split("=");
              result[c[0]] = c[1];
            }
            let data = {
              biz: decodeURIComponent(result.biz),
              encrypt_card_id: decodeURIComponent(result.encrypt_card_id),
              outer_str: decodeURIComponent(result.outer_str)
            }
            me.setData({
              cardInfo: data
            })
            this.memberRegistration()
          }
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content:'会员接口崩溃,再来一次呗！',
          showCancel: true,
          cancelText: '返回',
          cancelColor: '#000000',
          confirmText: '确定取消',
          confirmColor: '#3CC51F'
        })
      },
      complete: () => {
      }
    });
  },
  //会员开卡流程
  memberRegistration() {
    let data = this.data.cardInfo
    const me = this
    wx.setStorage({
      key: 'isLogin',
      data: true,
      success: function(res){
        wx.navigateToMiniProgram({
          appId: 'wxeb490c6f9b154ef9', // 固定为此 appid，不可改动
          extraData: data, // 包括 encrypt_card_id, outer_str, biz三个字段，须从 step3 中获得的链接中获取参数
          success: function (res) {
            console.log("wx.setStorageSync('isStart', 8)")
            wx.setStorageSync('isStart', 8)
          },
          fail: function (res) {
            wx.hideLoading();
          }
        })
      }
    }) //设置参数 
  },
  goCoupon(){ // 获取优惠券
    console.log("获取优惠券", wx.getStorageSync('unionid'));
    main.request(API.get_coupon, {unionid:wx.getStorageSync('unionid')}, "POST").then(res => {
      console.log(res.data.data);
      let{errcode, errmsg} = res.data;
      if(errcode == 0){
        console.log(this.data.is_get_card)
        if(this.data.is_get_card){
          wx.openCard({
            cardList: res.data.data.card_list
          })
        } else {
          wx.addCard({
            cardList: res.data.data.card_list,
            success: () => {
              this.setData({
                is_get_card:1,
              })
              main.request(API.update_coupon, {id:res.data.data.id}, "POST").then(result => {          
              })
            }
          })
        }
        
      } else {
        main.showToast(errmsg);
      }
      
    })
  },
  catchtouchmove(){
    return;
  },
  getMore(){
    this.setData({
      getMoreAlert:true,
    })
  },
  closeAlert(){
    this.setData({
      getMoreAlert:false,
    })
  },
  onShareAppMessage(){
    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    let channel = "";
    return {
      title: 'SELECTED送您新年350元新年礼券包，一起来赢上海迪士尼乐园门票！',
      path: `${urls.mickeyHelp}?openId=${openid}&channel=${this.data.channel}&shop_type=${this.data.shop_type}`,
      imageUrl:'https://alioss.woaap.com/bestseller/campaign2001/images/mickey_share.jpg'
    }
  },
  ok(e) {
    let { detail: { path: imagePath } } = e
    this.imagePath = e.detail.path;
    console.log(this.imagePath)

  },
  onImgOK(e) {
    const that = this
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath,
      success(res) {
        wx.showToast({
          title: '图片已保存至相册',
        })
        that.setData({
          showPost: false
        })
      },
      fail(res) {
        wx.navigateTo({ url: '/shopSubpages/post/pages/opensetting/index', })
      }
    })
  },
})
