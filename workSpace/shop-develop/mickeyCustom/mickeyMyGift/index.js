import API from '../api/index'
import main from "../base/mains.js"
import {urls} from "../base/url.js"
import { checkNetwork } from '../../service/saveImg'
// 123
// import { url } from 'inspector'

Page({
  data: {
    imgList:[],
    cardInfo:{},
    membercard:"",
    loadImageList:[
      'https://alioss.woaap.com/bestseller/campaign2001/images/gift_bg.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/gift_alert_head.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/prize5.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/prize2.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/prize3.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/prize4.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/new_user_view.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/prize_sub.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/prize_view.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/gift_alert_bottom.png',
      'https://alioss.woaap.com/bestseller/campaign2001/images/rules_back.png',
    ],
  },
  id:'', // 领奖和查看的id
  onLoad: function (options) {
    this.setData({
      membercard:options.membercard
    })
    wx.hideShareMenu()
  },
  init(){
    main.request(API.record, {type:"2", }, "GET").then(res => {
      let {errcode, errmsg, data = []} = res.data;
      if(errcode == 0){
        this.setData({
          imgList:data
        })
      } else {
        main.showToast(errmsg);
      }
      console.log(res);
    })
  },
  onShow: function(){

    this.init();
  },
  back(){
    main.navigateBack();
  },
  view(e){
    let item = e.currentTarget.dataset.item;
    this.id = item.record_id;
    if(item.award_id == 5){
      main.link(`${urls.mickeyAddress}?record_id=${item.record_id}&showOnly=true`)
    } else if (item.award_id == 3 || item.award_id == 4){
      main.request(API.luck_ticket, {id:this.id}, "POST", { 'content-type': 'application/x-www-form-urlencoded' }, 1, "text", true).then(res => {
        console.log(res.data.data);
        let{errcode, errmsg} = res.data;
        if(errcode == 0){
            wx.openCard({
              cardList: res.data.data.cardList,
              success: () => {
                
              }
            })
        } else {
          main.showToast(errmsg);
        }
      })
    }
  },
  sub(e){
    let item = e.currentTarget.dataset.item;
    this.id = item.record_id;
    if(item.award_id == 5){
      this.checkIsMember(res=>{
        main.link(`${urls.mickeyAddress}?record_id=${item.record_id}&from=myGift`)
      });
    } else if (item.award_id == 3 || item.award_id == 4){
      this.checkIsMember(res=>{
        this.goCoupon();
      });
    }
  
  },
  //检查是否是会员
  checkIsMember(cb) {

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
        let {data, errcode, errmsg, activatemembercard_url,is_member, is_get_card } = res.data
        
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
    main.request(API.luck_ticket, {id:this.id, unionid:wx.getStorageSync('unionid')}, "POST").then(res => {
      console.log(res.data.data);
      let{errcode, errmsg} = res.data;
      if(errcode == 0){
          wx.addCard({
            cardList: res.data.data.cardList,
            success: () => {
              main.request(API.updateticket, {id:res.data.data.id}, "POST").then(result => {          
                this.init();
              })
            }
          })
      } else {
        main.showToast(errmsg);
      }
    })
  },

})
