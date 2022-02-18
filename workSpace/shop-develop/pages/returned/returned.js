
var Util = require('../../utils/utils.js');   //网络请求，传参必用
var cityJS = require('../../utils/city.js');
import {refundStoreList} from '../../service/refund'
import {wxShowToast} from '../../utils/wxMethods'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresses:[],
    shengshiTishi:false,
    chengshiTishi:false,
    diquTishi:false,
    index1: 0,
    index2: 0,
    index3: 0,
    shopList:[],
    firstShop:{},
    ishaveFirst:false
  },


  //生命周期函数--监听页面加载
  onLoad: function (options) {
    cityJS.init(this);
  },

  //生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   let that=this;
    let oriordercode = wx.getStorageSync('oriordercode');
    let refundskus = wx.getStorageSync('refundskus');
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        wx.showLoading({
          title: '加载中'
        });
        let latitude = res.latitude
        let longitude = res.longitude
        let LT = longitude + ',' + latitude;
        that.getRefundStoreList(LT, oriordercode, refundskus);                
      },
      fail:function(res){
      }
    });   
  } ,
 
  //省/市 的 选择
  bindPickerChange1: function (e) {
    let Data=this.data;
    this.setData({
      index1: Number(e.detail.value),
      index2: 0,
      index3: 0,
      shengshiTishi:false,
      chengshiTishi: false,
      diquTishi: false,
      shopList:[],
      firstShop:{}
    });
    const current_value = e.detail.value;
    cityJS.change(1, current_value, this);
  },

  //城市 的 选择
  bindPickerChange2: function (e) {
    let Data = this.data;
    this.setData({
      index2: Number(e.detail.value),
      index3: 0,
      shengshiTishi: false,
      chengshiTishi: false,
      diquTishi: false,
      shopList: []
    });
    const current_value = e.detail.value;
    cityJS.change(2, current_value, this);
  },

  //地区 的 选择
  bindPickerChange3: function (e) {
    let Data = this.data;
    this.setData({
      index3: Number(e.detail.value),
      shengshiTishi: false,
      chengshiTishi: false,
      diquTishi: false,
      shopList: []
    });
    const current_value = e.detail.value;
    cityJS.change(3, current_value, this);
  },
  //搜索
  search:function(){
   
    let that=this;
    let Data= this.data;
     
    let {index1,index2,index3}=this.data;
    //refund / refundStoreList 
    
    let oriordercode = wx.getStorageSync('oriordercode');
    let address = wx.getStorageSync('address');
    let refundskus = wx.getStorageSync('refundskus');
    
    let region = Data.proviceData[Data.index1].name
    region=region.indexOf('市') ? region.substring(0, region.length - 1) : region;

    let city = Data.cityData[Data.index2].name;
    let cityDistrict = Data.districtData[Data.index3].DisName;
    
   
    that.checkRVV(that, index1, index2, index3);
    if (index3 !=0){
      wx.showLoading({
        title: '加载中'
      });
      that.getRefundStoreList(null, oriordercode, refundskus, region, city, cityDistrict, address, refundskus);
    }
  },
  //检测是否选择省市县提示信息
  checkRVV: function (that,index1, index2, index3){
    if (index1 == 0) {
      that.setData({
        shengshiTishi: true,
        chengshiTishi: false,
        diquTishi: false
      });
      return;
    }
    if (index2 == 0 && index1 != 0) {
      that.setData({
        chengshiTishi: true,
        shengshiTishi: false,
        diquTishi: false
      });
      return;
    }
    if (index3 == 0 && index1 != 0 && index2 != 0) {
      that.setData({
        shengshiTishi: false,
        chengshiTishi: false,
        diquTishi: true
      });
    }
  },
  //获取附近店铺列表
  getRefundStoreList: function (LT, oriordercode, refundskus, region, city, cityDistrict, address){
    let params;
    if (LT && !region && !city && !cityDistrict && !address){
      params={
        "ecsOrderID": oriordercode,
        "coordinate": LT,
        "productCode": refundskus
      }
    }else{
      params = {
        "ecsOrderID": oriordercode,
        "region": region,
        "city": city,
        "cityDistrict": cityDistrict,
        "streetName": '+',
        "productCode": refundskus
      }
    }
    refundStoreList(params).then(res => {
      wx.hideLoading();
      if(Array.isArray(res) && res.length){
        res.forEach(item => {
          item.businessHours = item.businessHours ? Util.getdate(item.businessHours):"";
        });
        this.setData({
          shopList: res,
          ishaveFirst: true
        })
      }else{
        wxShowToast('附近暂无店铺');
      }
    }).catch( err => wxShowToast(err.message))
  },
  //查看地图
  lookMap:function(e){
    let { longitude, latitude, address, name}=e.currentTarget.dataset;    

    longitude = parseFloat(longitude);
    latitude =parseFloat(latitude);
    wx.openLocation({
      longitude: latitude ,
      latitude: longitude,
      address: address,
      name:name
    });
   
  },
  //进入退单详情页
  goDetaile:function(e){
    let selectShopInfos;
    //到店截止日期endTime 需要在 退货详情页中拿到 订单创建时间，然后 +15天   得到退货截止日期endTime
    let  id = e.currentTarget.id;
    if(id=='first'){
      let { storeName, storeBusinessHours, storePhone, storeAddress, storeLatitude, storeLongitude, storeCode, storeDistance}=this.data.firstShop.store;
      selectShopInfos = {
        name: storeName,
        businessHours: storeBusinessHours,
        phone1: storePhone,
        address: storeAddress,
        latitude:storeLatitude,
        longitude:storeLongitude,
        storeCode: storeCode,
        distance: storeDistance,
        endTime:''
      };
    }else{
      let { name, businessHours, phone1, address, latitude, longitude, storeCode, distance} = this.data.shopList[id];
      selectShopInfos = {
        name: name,
        businessHours: businessHours,
        phone1: phone1,
        address: address,
        latitude: latitude,
        longitude: longitude,
        storeCode: storeCode,
        distance: distance,
        endTime: ''
      };
    }
    // let  List = this.data.dingdanList;
    let info = JSON.stringify(selectShopInfos)
    // wx.setStorageSync('selectShopInfos',);
    wx.redirectTo({
      url: `../dingdanToPay/dingdanToPay?selectShopInfos=${info}`,
    })
  }
})