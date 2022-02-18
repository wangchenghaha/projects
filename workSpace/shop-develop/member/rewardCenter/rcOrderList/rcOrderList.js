import { EVENTS, KEYSTORAGE, URL } from '../../../src/const.js'
import events from '../../../src/events.js';

var Util = require('../../../utils/utils.js');   //网络请求，传参必用
var http = require('../../../utils/httpclient.js');
var tongji = require('../../../utils/tongji.js');

var wxbarcode = require('../../../utils/wxbarcode.js');

var app = getApp();
const brand = app.config.brand;
const cdn = app.config.cdn;

var n_page = 1;
var all_page = 1;
var rotate = 3;
var timer = null;
var toLower_onOff = true;
var dingdanStatus = {};
var isTuihuo_global = false;
var isOtherJump = false;

//判断当前订单商品中是否都有货
function isCanPay(contentIDs, callTrue, callFalse) {
  var _isCanPayNum = 0;
  var _isCanPayLeng = contentIDs.length;
  var _diaoyongLeng = 0;

  for (var j = 0; j < contentIDs.length; j++) {
    var _contentID = contentIDs[j].substr(0, 9);
    var _contentSku = contentIDs[j];

    getaaa(_contentID, _contentSku);

  };

  function getaaa(aaa, bbb) {
    //获取库存 
    http.req(
      'goods/getStock',
      { goodsCode: aaa },
      {
        token: wx.getStorageSync('token'),
        
        'content-type': 'application/json'
      },
      'GET',
      function (res) {
        var Data = res.data;
        if (Data.code == 0) {

          _diaoyongLeng++;

          if (Data.data[bbb] && Number(Data.data[bbb]) > 0) {
            _isCanPayNum++;
            if (_isCanPayNum == _diaoyongLeng && _diaoyongLeng == _isCanPayLeng) {
              callTrue();
            } else if (_isCanPayNum != _diaoyongLeng && _diaoyongLeng == _isCanPayLeng) {
              callFalse();
            };
          } else if (Data.data[bbb] && Number(Data.data[bbb]) == 0){
            callFalse();
          };
        } else {
        };
      },
      function () {
      }
    );
  };

};

//获取非退货订单列表
function getDingdanList(thisPage, Status, that){
  wx.showLoading({
    title: '加载中'
  });
  var _crmId = wx.getStorageSync("user_info").memberno;
  //获取非退货订单列表接口
  http.req(
    'order/orderList',
    {
      pointFlag:'POINT',
      currentPage: thisPage,
      status: Status,
      crmId: _crmId,
    },
    {
      token: wx.getStorageSync('token'),
      
      'content-type': 'application/json'
    },
    'GET',
    function (res) {
      var Data = res.data;

      if (Data.code == 0) {
        
        var toFixed2 = Data.data;
        all_page = Data.totalPage;

        for (var i = 0; i < toFixed2.length; i++) {
          toFixed2[i].payPrice = toFixed2[i].payPrice.toFixed(2);
        };
        if (Data.data.length == 0) {
          that.setData({
            dingdanIsHidden: true,
            load_more_hidden : 'none'
          });
        } else {
          var nowData = that.data.dingdanList;
          var newData = nowData.concat(toFixed2);
          newData.forEach((item)=>{
            item.mainPicPath = `${cdn}${item.skuPic}`
          })
          that.setData({
            dingdanIsHidden: false,
            dingdanList: newData,
            load_more_hidden: 'none',
            ul_show : true
          });
          toLower_onOff = true;
          clearInterval(timer);
        };
        wx.hideLoading();

      };
    },
    function () {
      wx.hideLoading();
    }
  );
};


//获取退货订单列表
function getTuihuoList(thisPage, that) {
  wx.showLoading({
    title: '加载中'
  });
  var _crmId = wx.getStorageSync("user_info").memberno;
  //获取退货订单列表接口
  http.req(
    'refund/refundOrderList',
    {
      currentPage: thisPage,
      crmId: _crmId,
    },
    {
      token: wx.getStorageSync('token'),
      
      'content-type': 'application/json'
    },
    'GET',
    function (res) {
      var Data = res.data;

      if (Data.msg == 'OK') {
        var toFixed2 = Data.data;
        all_page = Data.totalPage;

        for (var i = 0; i < toFixed2.length; i++) {
          toFixed2[i].payPrice = toFixed2[i].realPayPrice.toFixed(2);
          toFixed2[i].createTime = Util.getdate(toFixed2[i].createTime)
        };
        if (Data.data.length == 0) {
          that.setData({
            dingdanIsHidden: true,
            load_more_hidden: 'none'
          });
        } else {
          var nowData = that.data.dingdanList;
          var newData = nowData.concat(toFixed2);

          // 这里是 到店退需要的 productCode 的拼接
          newData=newData.map((item,index)=>{
            item.refundSkus[0] = item.refundSkus.join(',');
            item.refundSkus.length=1;
            return item;
          });

          that.setData({
            dingdanIsHidden: false,
            dingdanList: newData,
            load_more_hidden: 'none',
            ul_show: true
          });
          toLower_onOff = true;
          clearInterval(timer);
        };
        wx.hideLoading();
      };

    },
    function () {
      wx.hideLoading();
    }
  );
};
/**
     * 订阅的事件回调
     */
handleEvent: (event, type) => {
  if (type === EVENTS.EVENT_LOGINED && event) {
    //获取非退货总条数
    getTuihuoList(1, this);
  }
},
Page({

  //页面的初始数据
  data: {
    titleLogo:`${cdn}/assets/common/${brand}/image/logo-black-rect.png`,
    nav: [
      {
        name: '全部'
      }, {
        name: '待付款'
      }, {
        name: '待发货'
      }, {
        name: '待收货'
      }, {
        name: '退货/售后'
      }
    ],
    nav_id: 0,
    dingdanIsHidden : false,

    //加载中
    load_isHidden: true,
    text_isHidden: true,


    //加载更多 - 动画
    animationLoad: {},
    load_more_hidden: 'none',

    //列表是否显示
    ul_show : false,

    //是否是退货单列表
    isTuihuo : false,



    //是否关闭提示窗口信息
    isTip:false,
    oriorderCode:'',
    refundCode:'',
    //上传单号
    submitDanhao:false,
    danhao_name : '',
    //上传单号中的字段
    danhao_name_tishi: false,
    //上传单号中的字段
    danhao_name_text: '物流名称不能为空',
    //上传单号中的字段
    danhao_number: '',
    //上传单号中的字段
    danhao_tishi: false,
    //上传单号中的字段
    danhao_text: '快递单号不能为空',

    //是否显示修改退货方式
    isShowWay:99999999999,
    isResetWay: 'block',
    isVoucher: false,  //提货码
    bigorderCode: '',//一维码订单号
    checkcode: '',//二维码
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    if(options.phone && options.crmId){
      wx.setStorageSync("other_mini_phone",  options.phone);
      wx.setStorageSync("other_mini_crmid",  options.crmId);
      wx.setStorageSync("other_mini_appid", options.appid);
      isOtherJump = true;
    }
    // 注册刷新
    events.register(this, EVENTS.EVENT_LOGINED);

    if (!this.checkLogin()) {
      return;
    } else {
      //登录成功 => 通知组件更新
      events.post(true, EVENTS.EVENT_LOGINED);
    }
  },
    /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED) {
      isOtherJump = false;
      getDingdanList(1, '', this)
      wx.setStorageSync('dingdanStatus', {
        index: 0,
        status: ''
      });
    }
  },

  //生命周期函数--监听页面显示
  onShow: function () {
   
    var that = this;
    rotate = 3;
    n_page = 1;
    that.setData({
      dingdanList: []
    });
    
    dingdanStatus = wx.getStorageSync('dingdanStatus');
    isTuihuo_global = dingdanStatus.status=="isTuihuo"?true:false;
    
    if(!isOtherJump){
        //获取订单列表
        if (!isTuihuo_global ){
          getDingdanList(n_page, dingdanStatus.status, this);
        }else{
          getTuihuoList(n_page, this);
        };
    };
   
    this.setData({
      nav_id: dingdanStatus.index,
      isTuihuo: isTuihuo_global
    });

    //动画初始化
    var animation_load = wx.createAnimation({
      duration: 2000,
      timingFunction: 'linear'
    });
    this.animation_load = animation_load;

    /* 统计代码 */
    var _pages = getCurrentPages();
    var _this_page = _pages[_pages.length - 1].route;
    var _prevPage = wx.getStorageSync('prevPage');
    var _url = wx.getStorageSync('appInitData');
    if (_prevPage == '') {
      tongji.tongji(_this_page, _url.scene, '');
    } else {
      tongji.tongji(_this_page, _prevPage, '');
    };
    wx.setStorageSync('prevPage', _this_page);
    /* 统计代码 */

  },

  checkLogin: function () {
    let isLogin = !!wx.getStorageSync(KEYSTORAGE.loginInfo);
    if (!isLogin) {
        wx.navigateTo({url: '/pages/setting/requestPermission'});
    }
    return isLogin;
  },
  //复制订单号
  onClick: function (e) {
    let text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success:res=>{
        wx.showToast({
          title: '复制成功',
          icon: 'success',
        })
      }
    })
  },

  //上拉触底 - 加载更多
  onReachBottom: function(e) {
    var that = this;

    if (toLower_onOff) {
      this.setData({
        load_more_hidden: 'block',
        text_isHidden: true
      });
      toLower_onOff = false;

      noStop(rotate);
      rotate += 3;
      function noStop(n) {
        that.animation_load.rotate(360 * n).step();
        that.setData({
          animationLoad: that.animation_load.export()
        });
      };
      
      if (n_page < all_page) {
        n_page++;
        getDingdanList(n_page, '', this);
      }else{
        that.setData({
          load_more_hidden: 'block',
          load_isHidden: false,
          text_isHidden: false
        });
        clearInterval(timer);
        timer = setInterval(function () {
          that.setData({
            load_more_hidden: 'none'
          });
          toLower_onOff = true;
        }, 500);
      };
    };  
    
  },

  //点击切换导航
  liClick : function(e){
    var index = e.currentTarget.id;
    wx.showLoading({
      title: '加载中'
    });

    n_page = 1;
    isTuihuo_global = false;
    this.setData({
      nav_id: index,
      dingdanList : []
    });

    switch(Number(index)){
      //全部订单
      case 0:
        getDingdanList(n_page, '', this);
        wx.setStorageSync('dingdanStatus', {
          index: 0,
          status: ''
        });
      break;

      //待付款
      case 1:
        getDingdanList(n_page, 'WaitingPay', this);
        wx.setStorageSync('dingdanStatus', {
          index: 1,
          status: 'WaitingPay'
        });
      break;

      //待发货
      case 2:
        getDingdanList(n_page, 'WaitingShipment', this);
        wx.setStorageSync('dingdanStatus', {
          index: 2,
          status: 'WaitingShipment'
        });
      break;

      //待收货
      case 3:
        getDingdanList(n_page, 'WaitingReceive', this);
        wx.setStorageSync('dingdanStatus', {
          index: 3,
          status: 'WaitingReceive'
        });
      break;

      //退货/售后
      default:
        isTuihuo_global = true;
        getTuihuoList(n_page, this);
        wx.setStorageSync('dingdanStatus', {
          index: 4,
          status: 'tuihuo'
        });
    };
    this.setData({
      isTuihuo: isTuihuo_global
    });
  },

  //查看订单详情 并 付款
  toDingdanCon:function(e){
    var Index = e.currentTarget.id;
    var List = this.data.dingdanList;
  
    wx.setStorageSync('allToDingdan', List[Index]);
    wx.setStorageSync('isTuihuo', false);
    wx.navigateTo({
      url: '/pages/dingdanToPay/dingdanToPay'
    });
  },

  //查看退货订单详情
  toDingdanCon1: function(e){
    var Index = e.currentTarget.id;
    var List = this.data.dingdanList;

    wx.setStorageSync('allToDingdan', List[Index]);
    wx.setStorageSync('isTuihuo', true);
    wx.setStorageSync('tuikuanCode', '');

    //  这个是到店退标识 gzl  直接点击  退货商品进入
    wx.setStorageSync('toShop',false);

    //初始化时，选择的地区商店清除
    try {
      wx.setStorageSync('selectShopInfos', null);
    } catch (e) {
    }
    //end gzl

    wx.navigateTo({
      url: '/pages/dingdanToPay/dingdanToPay'
    });
  },

  //立即支付
  wxPay: function(e){
    wx.showLoading({
      title: '加载中'
    });
    var that = this;
    var Index = e.currentTarget.id;
    var dingdanCon = this.data.dingdanList[Index];
   
    //获取非退货订单详情
    http.req(
      'order/orderDetail',
      {
        bigOrderId: dingdanCon.id,
        orderToken: dingdanCon.orderToken
      },
      {
        token: wx.getStorageSync('token'),
        
        'content-type': 'application/json'
      },
      'GET',
      function (res) {
        var Data = res.data;

        if (Data.code == 0) {
          var _contentIDs = new Array();
          var _contentList = Data.data.goodsOrderList;
          for (let i = 0; i < _contentList.length; i++) {
            _contentIDs.push(_contentList[i].gcsSku);
          };
          isCanPay(_contentIDs, function () {
            //每件商品都有库存

            let bigOrderCode = dingdanCon.bigorderCode;
            let orderToken = dingdanCon.orderToken;
            let payToken = dingdanCon.payToken;
            let payTokenTime = dingdanCon.payTokenTime;
            let amountPaid = dingdanCon.payPrice;
            let id = dingdanCon.id;

            let querystring = `id=${id}&bigOrderCode=${bigOrderCode}&orderToken=${orderToken}&payToken=${payToken}&payTokenTime=${payTokenTime}&amountPaid=${amountPaid}`;

            wx.hideLoading();
            wx.navigateTo({
              url: '/pages/wxPay/wxPay?' + querystring
            });
          }, function () {
            //有个别商品没有库存
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '当前订单中有个别商品没有库存,所以暂不能立即支付',
              showCancel: false
            });
          });
        };
      },
      function () {
      }
    );
      

return;

    
  },

  //去逛逛
  goToShopping : function(e){
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

//打开提示信息窗口
  tip:function(){
    this.setData({
      isTip: true
    });
  },
  //关闭提示信息
  closeTip: function(e){
    this.setData({
      isTip: false
    });
  },
  //打开上传单号框
  wxUp:function(e){
    let oriordercode= e.currentTarget.dataset.oriordercode;
    let refundcode=e.currentTarget.dataset.refundcode;
    this.setData({
      submitDanhao: true,
      oriorderCode: oriordercode,
      refundCode: refundcode
    });
  },


  //输入物流名称
  nameInput: function (e) {
    var that = this;
    let danhao_name = e.detail.value;
    this.setData({
      danhao_name: danhao_name
    });
    if (danhao_name != '') {
      that.setData({
        danhao_name_tishi: false
      });
    };
  },

  //输入快递单号
  numberInput: function (e) {
    var that = this;
    let danhao_value = e.detail.value;
    this.setData({
      danhao_number: danhao_value
    });
    if (danhao_value != '') {
      that.setData({
        danhao_tishi: false
      });
    };
  },

  //关闭上传单号框, 并上传单号信息
  danhao_true: function () {
    var that = this;
    let danhao_name=this.data.danhao_name;
    let danhao_number = this.data.danhao_number;
    if (danhao_name == '') {
      that.setData({
        danhao_name_tishi: true
      });
    };

    if (danhao_number == '') {
      that.setData({
        danhao_tishi: true
      });
    } else {
      //上传快递单号
      http.req(
          'refund/submitWaybill',
          {
            "refundCode": that.data.refundCode,
            "oriorderCode": that.data.oriorderCode,
            "waybillNum": danhao_number,
            "expressCompany": danhao_name
          },
          {
            token: wx.getStorageSync('token'),
            
            'content-type': 'application/json'
          },
          'POST',
          function (res) {
            var Data = res.data;
            if (Data.code == 0) {
              that.setData({
                submitDanhao: false
              });
              wx.showModal({
                title: '提示',
                content: '上传退货快递单号成功',
                showCancel: false
              });
            };
            if(Data.code==1 ){
              wx.showModal({
                title: '提示',
                content: '您输入的信息不准确，请重新输入',
                showCancel: false
              });
            }
          },
          function () {
            wx.showModal({
              title: '提示',
              content: '上传退货快递单号失败，请重新上传',
              showCancel: false
            });
          }
      );

    };
  },

  //   this.setData({
  //     submitDanhao: false
  //   });
  // },
  //关闭上传单号框
  danhao_false: function () {
    this.setData({
      submitDanhao: false
    });
  },
  //到店退
  goReturned:function(e){
    let { oriordercode, address, refundskus, refundcode, index} = e.currentTarget.dataset;

    var List = this.data.dingdanList;

    wx.setStorageSync('allToDingdan', List[index]);
    wx.setStorageSync('isTuihuo', true);
    wx.setStorageSync('tuikuanCode', '');



    wx.setStorageSync('oriordercode', oriordercode)
    wx.setStorageSync('address', address)
    wx.setStorageSync('refundskus', refundskus)
    wx.setStorageSync('refundcode', refundcode)
    wx.setStorageSync('toShop', true);//点击到店退按钮进入

    wx.navigateTo({
      url: '../returned/returned'
    });
  },
  //修改退货方式
  resetWays:function(e){
    let index = e.currentTarget.id;
    this.setData({
      isShowWay: index,
      isResetWay:'none'
    });
  },

  //提货凭证
  voucher(e) {
    let bigorderCode = e.currentTarget.id;//一维码字符串
    let { checkcode } = e.currentTarget.dataset;//二维码字符串
    wxbarcode.barcode('barcode', bigorderCode, 400, 80);//一维码
    wxbarcode.barcode('qrcode', checkcode, 400, 80);//二维码
    this.setData({
      isVoucher: true,
      bigorderCode: bigorderCode,
      checkcode: checkcode
    });
  },
  //关闭提货凭证
  closeVoucher() {
    this.setData({
      isVoucher: false
    });
  },

  onUnload: function(){
    events.unregister(this,EVENTS.EVENT_LOGINED); //取消订阅登录事件
  }

})
