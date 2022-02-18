var urls = require('../../base/url.js')
var main = require('../../base/main.js')
var _v = main.getSysInfo().version;
import utils from '../utils/utils'
import API from 'index';
var mCard = {
  //判断是非是会员
  isMember: function (callback, num_first,data ={openid:''}) {
    if (!callback) { var callback = function () { } }
    var self = this;
    var _ismMember = wx.getStorageSync('isMember');
    var _isGetCard = wx.getStorageSync('isGetCard');

    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    let unionid = wx.getStorageSync('unionid')
    // 找不到openid
    if (!openid) {
      wx.navigateTo({
        url: '/pages/etoLogin/etoLogin'
      })
      // wx.showToast({
      //     title: '请先授权',
      //     icon: 'none',
      // })
      // wx.hideLoading()
      return
    }
      if(!unionid) {
        wx.navigateTo({
          url: '/pages/etoLogin/etoLogin'
        })
        return
      }
    //获取UTM参数
    let utm_info = wx.getStorageSync("utm_info");
    let user_utm_channel = wx.getStorageSync("user_utm_channel");
    console.log("ch==",user_utm_channel);
    //如果有渠道则获取对应的UTM参数
    var user_utm;
    if(user_utm_channel){
      utm_info.forEach((item, index) => {
        if (item.id == user_utm_channel) {
          user_utm = item;
        }
      });
    }else{
      var channal_name = '自然渠道';
      utm_info.forEach((item, index) => {
        if (item.channelName == channal_name) {
          user_utm = item;
        }
      });
    }

    console.log("user_utm======",user_utm);
    var data = {
      brand : utils.config.brand,
      openid : openid,
      unionid : unionid || '',
      brandId : getApp().config.etoBrand,
      channel_tag:'WeChat_ETO',
      channel_token:'NWU4ZTLKZTAZODY4MW',
      storeId:'',
      guideId:'',
      campaign:user_utm ? user_utm.regUtmCampaign :'',
      medium:user_utm ? user_utm.regUtmMedium : '',
      source:user_utm ? user_utm.regUtmSource : '',
      term:user_utm ? user_utm.regUtmTerm : ''
    }
    console.log("utm data=",data)
    if (_ismMember == "1") {
      callback(200)
    }
    else {
      main.request(API.memberIsMember, data, function (res) {
        if (res.data.errcode == 0) {
          wx.setStorageSync("isMember", res.data.is_member);
          wx.setStorageSync("isGetCard", res.data.is_get_card);

          if (res.data.is_member == 1) {//是会员
            callback(200);
          }else if (res.data.is_member == 0 && res.data.is_get_card == 1) {//非会员 已领卡
            if (num_first) {
              callback(201);
            };
            var cardId = res.data.data.cardList[0].cardId;
            var cardCode = res.data.data.cardList[0].code;
            wx.setStorageSync("cardId", cardId);
            wx.setStorageSync("cardCode", cardCode);
            wx.showModal({
              title: '提示',
              content: "您还未激活会员卡，请激活",
              showCancel: false,
              confirmText: "确定",
              success: function (_res) {
                wx.openCard({
                  cardList: [
                    {
                      cardId: cardId,
                      code: cardCode
                    }
                  ],
                  success: function (e) {
                    wx.setStorage({
                      key: "isMember",
                      data: 1
                    });
                    //新领取微信会员卡
                    wx.setStorageSync("isMemberNewCard", 1);
                    //全新CRM会员注册成功标识
                    wx.setStorageSync("isNewMemberCard", 1);

                    main.link(main.hitSourceUrl('/attendgroup/index/index'), 2)
                  }
                })
              }
            });
          } else {//非会员 未领卡
            if (num_first) {
              callback(202);
            };
            var cardList = res.data.data.cardList;
            var cardUrl = res.data.activatemembercard_url;
            /*wx.setStorageSync("cardList", cardList);
            wx.setStorageSync("cardUrl", cardUrl);
            wx.setStorageSync("isMember", 0);
            wx.setStorageSync("isGetCard", 1);
            setTimeout(()=>{
              self.getCard()
            });*/
            wx.showModal({
              title: '提示',
              content: "您还未领取会员卡，点击领取！",
              showCancel: false,
              confirmText: "确定",
              success: function (_res) {
                wx.setStorageSync("cardList", cardList);
                wx.setStorageSync("cardUrl", cardUrl);
                wx.setStorageSync("isGetCard", 1);
                //全新CRM会员注册成功标识
                wx.setStorageSync("isNewMemberCard", 1);
                setTimeout(function () {
                  self.getCard()
                }, 200);
                  
              }
            });
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.data
          });
        }
      }, 2);
    }
  },

  //获取会员卡信息
  getCard: function () {
    var self = this;
    if (_v > '6.5.8' || (_v > '6.5' && _v.length > 5)) {
      var cardUrl = wx.getStorageSync('cardUrl');
      var biz = main.GetQueryString(cardUrl, "biz").split("#")[0];
      var encrypt_card_id = main.GetQueryString(cardUrl, "encrypt_card_id");
      var outer_str = main.GetQueryString(cardUrl, "outer_str");
      var data = {
        encrypt_card_id: encrypt_card_id,
        biz: biz,
        outer_str: outer_str
      }
      wx.navigateToMiniProgram({
        "appId": 'wxeb490c6f9b154ef9',
        "extraData": data,
        success: function (res) {
          wx.setStorageSync("isMember", 0);
          wx.setStorageSync("isGetCard", 1);
          //全新CRM会员注册成功标识
          wx.setStorageSync("isNewMemberCard", 1);

          // 上报入会渠道 18-06-29 by golan
          main.request(urls.setChannel, {}, function (res) { console.log(res); })
        },
        fail: function (ret) {
        }
      })
      /*let data = {
        encrypt_card_id: encodeURIComponent(encrypt_card_id),
        biz: encodeURIComponent(biz),
        outer_str: encodeURIComponent(outer_str)
      };
      wx.navigateTo({url: `/pages/fashionID/getCard/getCard${objToQuery(data)}`});*/
    }
    else {//微信版本低于6.5.8，获取会员卡信息，领卡
      self.addCard();
    }
  },
  //唤起原生会员卡
  addCard: function () {
    var self = this;
    var cardList = wx.getStorageSync('cardList');
    wx.addCard({
      cardList: cardList,
      success: function (res) {
        var cardId = res.cardList[0].cardId;
        var enCode = res.cardList[0].code;
        wx.setStorageSync("cardId", cardId);
        wx.setStorageSync("enCode", enCode);
        //TODO brand 待删除硬编码
        main.request(urls.decryptCode, { brand: getApp().config.etoBrand, encrypt_code: enCode }, function (_res) {
          if (_res.data.errcode == 0) {
            var cardCode = _res.data.data.code;
            wx.setStorageSync("cardCode", cardCode);
            wx.openCard({
              cardList: [{
                cardId: cardId,
                code: cardCode
              }],
              success: function (ret) {
                wx.showModal({
                  title: '提示',
                  content: '恭喜您注册成功',
                });
                //全新CRM会员注册成功标识
                wx.setStorageSync("isNewMemberCard", 1);
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: _res,
            });
          }
        })
      },
      fail: function (res) {;
        //self.isMember(false, true);
        self.isMember(false);
      }
    })
  }
}
module.exports = mCard;