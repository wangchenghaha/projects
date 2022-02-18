import main from '../utils/utils'
import API from '../api/index'
import fetch from '../sever/index'
import img from '../model/img-model'
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;


Page({
  data: {
    brand,
      bigPhone : main.judgeBigScreen(),
      showrule : false,
      showalert : false,
      couponlist : img.couponlist,
      imgmodel : {
        // groupbg_s : img.groupbg_s,
        // groupbg : img.groupbg,
        // groupcardbg : img.groupcardbg,
        // fail : img.fail
      },
      basecolor:img.basecolor,
      showoption : {
        type : 1,
        show : false,
        alerttext : '',
        btntext : ''
      },
      imgUrl:API.CrmImgUrl,
      failList:img.failList,
      campainId:'',
      user_utm_channel:'',
      btnTextList:''
  },
  onShow: function () {
    var _this = this;
    this.activeInfo();
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
  },
  onLoad(options) {
    console.log("options=============",options)
    var ac = wx.getStorageSync("campainId");
    var ch = wx.getStorageSync("user_utm_channel");
    if (options.camp) {
      ac = main.getQueryVariable2(options.camp, 'ac');
      ch = main.getQueryVariable2(options.camp, 'ch');
    }

    if (!options.ac && !ac) {
      wx.showToast({
        title: '缺少活动ID',
        icon: 'none'
      });
      return
    }

    if (!options.ch && !ch) {
      wx.showToast({
        title: '缺少渠道ID',
        icon: 'none'
      });
      return
    }

    this.setData({
      campainId: options.ac || ac,
      user_utm_channel: options.ch || ch,
    });

    console.log("options========fail=====", options)
    console.log("====fail====ac================" + this.data.campainId);
    console.log("=====fail===ch================" + this.data.user_utm_channel);

    wx.setStorageSync("campainId", this.data.campainId);
    wx.setStorageSync("user_utm_channel", this.data.user_utm_channel);

    //获取按钮文字
    main.getButtonText().then(res => {
      this.setData({
        btnTextList: res
      });
    });
  },
  clicksure(obj) {
    obj.detail.success && obj.detail.success();
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '拼团详情'
    })
  },
    //开启拼团
    openGroup() {

      let campainId = wx.getStorageSync("campainId");
      wx.redirectTo({
        url: `/attendgroup/index/index?ac=${campainId}`
      });
    },
  endfun() {
    this.setData({
      showoption : {
        type : 1,
        show : true,
        alerttext : '您来晚了，活动已结束！',
        btntext : this.data.btnTextList.type_14,//'我知道了'
        success() {
          wx.switchTab({
              url: '/pages/index/index'
          })
        }
      }
    })
  },

  startfun() {
    this.setData({
      showoption : {
        type : 1,
        show : true,
        alerttext : '活动未开始，可打开订阅提醒～',
        btntext : this.data.btnTextList.type_14,//'我知道了'
        success() {
          wx.switchTab({
              url: '/pages/index/index'
          })
        }
      }
    })
  },
  coupondetail(){
    wx.navigateTo({
        url: '/attendgroup/index/index'
    })
  },
  shareRecord() {
    fetch({url: API.shareRecord,data:{token:this.data.token}}).then(res => {})
  },
  onShareAppMessage() {
    var _this = this;
    return main.baseshare('',API.CrmImgUrl+_this.data.imgList.share);
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