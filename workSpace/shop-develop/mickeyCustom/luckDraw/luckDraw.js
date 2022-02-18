
import API from '../api/index'
import main from "../base/mains.js"
import {urls} from "../base/url.js"
import Card from '../post/palette/card.js';
let interval = null;
//值越大旋转时间越长  即旋转速度
let intime = 50;
Page({
  onShareAppMessage(){
    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    let channel = "";
    return {
      title: 'SELECTED送您新年350元新年礼券包，一起来赢上海迪士尼乐园门票！',
      path: `${urls.mickeyHelp}?openId=${openid}&channel=${this.data.channel}&shop_type=${this.data.shop_type}`,
      imageUrl:'https://alioss.woaap.com/bestseller/campaign2001/images/mickey_share.jpg'
    }
  },
  data: {
    //12张奖品图片
    channel:"",
    shop_type:"",
    loadImageList:[
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward1.png', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward2.png', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward3.png', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward4.png', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward5.png', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/start.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/mickey_share.jpg',
      'https://alioss.woaap.com/bestseller/campaign2001/images/luckDraw.jpg',
      'https://alioss.woaap.com/bestseller/campaign2001/images/afterBack_x.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/afterBack.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/rewardNo.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/afterBi.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/afterT.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/afterYi.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/afterMickey.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/tiger_more.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/tiger_haoyou.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/tiger_haibao.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/haibao_text.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/haibao_back.png',
    ],
    images: [
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward2', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward1', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward4', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward1', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward5', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward2', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward1', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward2', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward1',
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward3',
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward1',
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward3',
    ],
    images2: [
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward2', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward1', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward4', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward1', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward5', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward2', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward1', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward2', 
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward1',
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward3',
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward1',
      'https://alioss.woaap.com/bestseller/campaign2001/images/reward3',
    ],
    btnconfirm: 'https://alioss.woaap.com/bestseller/campaign2001/images/start.png',
    clickLuck:'clickLuck',
    luckPosition: 0,
    isFinally: false,
    finally: '1',
    isBigScreen: false,
    goBack: '< 返回',
    balance: 0,
    allow_times: 0,
    record_id: null,
    cardInfo: null,
    is_get_card: 0, //是否领取过优惠券,
    getMoreAlert: false,
    template: new Card().palette(''), //海报
  },
  onLoad: function (options) {
    this.setData({
      channel:options.channel || wx.getStorageSync("mickeyChannel") || "",
      shop_type:options.shop_type || wx.getStorageSync("mickeyShopType") || "",
    })
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
    if(options.membercard == 1 && wx.getStorageSync('rewardType')) {
      this.getRewardHas()
    }
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '米奇抽奖'
    })
  },
  onShow: function () {
    this.init();
  },

  input:function(e){
    let data = e.detail.value;
      this.setData({
        luckPosition: data
      })
  },

  init(){
    main.request(API.is_hand, {}, "GET").then(res=>{
      let {errcode, errmsg, data} = res.data;
      if(errcode == 0){
        let {balance, allow_times} = data;
        this.setData({
          balance,
          allow_times,
          isFinally: false,
        })
      } else {
        main.showToast(errmsg)
      }
    })
  },
  getRewardHas() {
    const type = wx.getStorageSync('rewardType');
    this.setData({
      isFinally: true,
      finally: type,
    })
    wx.setStorageSync('rewardType', null)
  },

  //点击抽奖按钮
  clickLuck:function(){
    let e = this;
    //判断中奖位置格式
    if (e.data.luckPosition == null || isNaN(e.data.luckPosition) || e.data.luckPosition>11){
      wx.showModal({
        title: '提示',
        content: '请填写正确数值',
        showCancel:false,
      })
      return;
    }
    //判断是否有金币
    if (e.data.allow_times <= 0){
      e.setData({
        getMoreAlert: true,
      })
      return;
    }
    //设置按钮不可点击
    e.setData({
      clickLuck:'',
    })
    //清空计时器
    clearInterval(interval);
    let index = 0;
    //循环设置每一项的透明度
    interval = setInterval(function () {
      if (index > 11) {
        index = 0;
        e.data.images[11] = e.data.images2[11]
      } else if (index != 0) {
        e.data.images[index - 1] = e.data.images2[index - 1]
      }
      e.data.images[index] = e.data.images2[index] + e.data.images2[index][e.data.images2[index].length -1]
      e.setData({
        images: e.data.images,
      })
      index++;
    }, intime);
    //请求接口获取结果
    this.makeReward();
  },

  makeReward(){
    let e = this;
    main.request(API.luck_draw, {}, "POST", { 'content-type': 'application/x-www-form-urlencoded' }, 2).then(res=>{
      let {errcode, errmsg, data} = res.data;
      if(errcode == 0){
        let { random_num, } = data;
        let record_id = null;
        if(data.record_id) {
          record_id = data.record_id;
        }
        e.setData({
          record_id
        })
        setTimeout(function () {
          e.stop(random_num);
        }, 2000)

        let reqData = {
          activity_no:"luck",
          channel: this.data.channel,
          shop_type: this.data.shop_type,
          id: data.award_id,
          raw_data: JSON.stringify(res.data.data),
          inviter_openid: wx.getStorageSync("mickeyInviterOpenid") || "", 
        }
        main.request(API.set_channel, reqData, "POST", { 'content-type': 'application/x-www-form-urlencoded' }, 0).then(msg => {
          console.log(msg)
        })
      } else {
        setTimeout(function () {
          e.stop(0);
        }, 3000)
      }
    }).catch(error => {
      setTimeout(function () {
        e.stop(0);
      }, 3000)
    })
  },

  stop: function (which){
    let e = this;
    clearInterval(interval);
    let current = -1;
    let images = e.data.images;
    for (let i = 0; i < images.length; i++) {
      console.log('iiiiii',images[i].length)
      if (images[i].length > 63) {
        current = i;
      }
    }
    //下标从1开始
    let index = current + 1;
    console.log('yyyyy', index)
    e.stopLuck(which, index, intime, 10);
  },

  /**
   * which:中奖位置
   * index:当前位置
   * time：时间标记
   * splittime：每次增加的时间 值越大减速越快
   */
  stopLuck: function (which, index, time, splittime){
    let e = this;
    //值越大出现中奖结果后减速时间越长
    let images = e.data.images;
    setTimeout(function () {
      if (index > 11) {
        index = 0;
        e.data.images[11] = e.data.images2[11]
      } else if (index != 0) {
        e.data.images[index - 1] = e.data.images2[index - 1]
      }
      //当前位置为选中状态
      images[index] = e.data.images2[index] + e.data.images2[index][e.data.images2[index].length -1]
      e.setData({
        images: images
      })
      //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
      //直到旋转至中奖位置
      if (time < 400 || index != which){
        //越来越慢
        splittime++;
        time += splittime;
        //当前位置+1
        index++;
        e.stopLuck(which, index, time, splittime);
      }else{
        //1秒后显示弹窗
        setTimeout(function () {
          if (which == 0 || which == 5 || which == 7) {
            //中奖50金币
            e.setData({
              isFinally: true,
              finally: '2',
              clickLuck: 'clickLuck',
            })
          } else if (which == 9 || which == 11) {
            //中奖
            e.setData({
              isFinally: true,
              finally: '3',
              clickLuck: 'clickLuck',
            })
          } else if (which == 4) {
            //中奖
            e.setData({
              isFinally: true,
              finally: '4',
              clickLuck: 'clickLuck',
            })
          } else if (which == 2) {
            //中奖
            e.setData({
              isFinally: true,
              finally: '5',
              clickLuck: 'clickLuck',
            })
          } else {
            //中奖
            e.setData({
              isFinally: true,
              finally: '1',
              clickLuck: 'clickLuck',
            })
          }
        }, 1000);
      }
    }, time);
    console.log(time);
  },
    //进入页面时缓慢切换
  loadAnimation:function (){
    let e = this;
    let index = 0;
    interval = setInterval(function () {
      if (index > 11) {
        index = 0;
        e.data.images[11] = e.data.images2[11] + e.data.images2[11][e.data.images2[11].length -1]
      } else if (index != 0) {
        e.data.images[index - 1] = e.data.images2[index - 1] + e.data.images2[index - 1][e.data.images2[index - 1].length -1]
      }
      e.data.images[index] = e.data.images2[index]
      e.setData({
        images: e.data.images,
      })
      index++;
    }, 1000);
  },

  goBackMain() {
    this.init();
  },

  //查看我的奖品
  seeMyReward() {
    main.link(urls.mickeyMyGift)
  },
  //转跳到固定页
  seeMyGoods() {
    this.openWebView('https://m.selected.com.cn/customPage/SELECTED/MIQI0114/index.html')
  },
  openWebView: function(linkUrl){
    let deCodeURL = encodeURIComponent(linkUrl);
    wx.navigateTo({
      url: `/pages/webview/webview?linkUrl=${deCodeURL}`
    });
  },
  
  goBigPrize(e) {
    this.checkIsMember(()=>{
      main.link(`${urls.mickeyAddress}?record_id=${this.data.record_id}&from=luck`)
    });
  },

  goBigCoupon(e) {
    let { currentTarget: {dataset: {type}}} = e;
    this.checkIsMember(()=>{
      wx.setStorageSync('rewardType', type)
      this.goCoupon();
    });
  },

  //检查是否是会员
  checkIsMember(cb) {
    console.log('查询是否是会员')
    const me = this
    let unionid = wx.getStorageSync('unionid')
    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    if(!openid || !unionid) {
      wx.navigateTo({
          url: '/pages/etoLogin/etoLogin'
      })
      return false
    }
    wx.showLoading({
      title: ' ',
      icon: 'loading',
      // mask: true
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
        let {data, errcode, errmsg, activatemembercard_url, is_member, is_get_card } = res.data
        me.setData({
          is_get_card
        })
        if ( errcode === 0 ) {
          // 是会员
          if ( is_member ) {
            cb();
          }else {
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
            wx.setStorageSync('isStart', 10)
          },
          fail: function (res) {
            wx.hideLoading();
          }
        })
      }
    }) //设置参数 
  },

  goCoupon(){ // 获取优惠券
    const e = this;
    main.request(API.luck_ticket, {id: this.data.record_id, unionid : wx.getStorageSync('unionid')}, "POST").then(res => {
      console.log(res.data.data);
      let{errcode, errmsg} = res.data;
      if(errcode == 0){
          wx.addCard({
            cardList: res.data.data.cardList,
            success: () => {
              main.request(API.updateticket, {id:res.data.data.id}, "POST").then(result => {   
                e.setData({
                  isFinally: false
                })
              })
            }
          })
      } else {
        main.showToast(errmsg);
      }
      
    })
  },
  closeAlert(){
    this.setData({
      getMoreAlert:false,
    })
  },
  catchtouchmove(){},
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