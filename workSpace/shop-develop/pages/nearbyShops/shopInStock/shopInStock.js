const { URL, URL_CDN } = require('../../../src/const.js');
import { cutProvince } from '../../../service/location.js';
import { getThumbnailNormPath } from '../../../utils/utils.js';
var CityJS = require('../../../utils/city.js');
var ShopUtil = require('../../../service/shop.js');
var GoodsUtil = require('../../../service/goods.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index1: 0,
    index2: 0,
    index3: 0,
    hasShop: false,
    flagRefresh: false,
    flagLoading: false,
    flagLoadingComplete: false,
    currentPage: 1,
    totalPage: 0,
    picUrl: "",

    flagShowMap: true,
    flagShowStockDetail: false,

    flagDefaultSize: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { currLongi, currLati, sku, sku15Temp, currProvince, currCity, currDist } = options;
    console.log(`previous currLongi ========= ${currLongi}`);
    console.log(`previous currLati ========= ${currLati}`);
    console.log(`previous sku ========= ${sku}`);
    console.log(`previous sku15Temp ========= ${sku15Temp}`);
    console.log(`previous currProvince ========= ${currProvince}`);
    console.log(`previous currCity ========= ${currCity}`);
    console.log(`previous currDist ========= ${currDist}`);

    // this.setData({
    //   currLongi: currLongi,
    //   currLati: currLati,
    //   sku: sku,
    //   spu: sku.substring(0, 9),
    //   sku15:sku15Temp,
    //   currProvince: currProvince,
    //   currCity: currCity,
    //   currDist: currDist,
    // });
    this.currLongi = currLongi;
    this.currLati = currLati;
    this.sku = sku;
    // this.spu          = sku.substring(0, 9);
    // this.sku15        =sku15Temp;
    this.currProvince = currProvince;
    this.currCity = currCity;
    this.currDist = currDist;

    this.setData({
      spu: sku.substring(0, 9),
      sku15: sku15Temp,
    });

    CityJS.init(this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('mMap');
    GoodsUtil.getDetail(this.data.spu)
      .then(res => {
        //因为是从content页面进来的，所以商品一定未下架，直接展示即可
        console.log("get goods detail success ......................");
        let picUrl = getThumbnailNormPath(res.color, this.sku, 0);
        this.setData({
          picUrl: picUrl,
          goodsName: res.goodsName,
          priceNow: res.color[0].price,
          priceOriginal: res.color[0].originalPrice,
          colorList: res.color,
          colorIndex: 0,
          sizeList: res.color[0].sizes,
          sizeIndex: 0,
          goodsDetailBean: res,//商品详情保存到 弹出页
        });
      })
      .catch(e => {
        wx.showToast({
          title: `${e.message}`,
        })
      });
    this.addressBean = {
      brandCode: getApp().config.brand,
      province: cutProvince(this.currProvince),
      city: this.currCity,
      // district: this.currDist,
      pageNum: 1,
      pageSize: 10,
      distance: 30,
      longitude: this.currLongi,
      latitude: this.currLati,
      sku: this.data.sku15
    };
    this.setData({
      hasShop: false,
      currentPage: 1,
      flagRefresh: true,
      flagLoading: true,
      flagLoadingComplete: false,
      // addressBean: {
      //   brandCode: getApp().config.brand,
      //   province: province = cutProvince(this.data.currProvince),
      //   city: this.data.currCity,
      //   district: this.data.currDist,
      //   pageNum: 1,
      //   pageSize: 10,
      //   distance: 30,
      //   longitude: this.data.currLongi,
      //   latitude: this.data.currLati,
      //   sku: this.data.sku15
      // },
    });

    let proIndex = CityJS.getProvinceIndex(this.currProvince);
    this.setData({
      index1: Number(proIndex),
    });
    CityJS.change(1, proIndex, this);

    let cityIndex = CityJS.getCityIndex(this.currCity);
    this.setData({
      index2: Number(cityIndex),
    });
    CityJS.change(2, cityIndex, this);
    // let districtIndex = CityJS.getDistrictIndex(this.currDist,this);
    // CityJS.change(3, districtIndex, this);
    this.getShopList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  //省 选择
  onPickerConfirm1: function (e) {
    console.log(e);
    this.setData({
      index1: Number(e.detail.value),
      index2: 0,
      index3: 0
    });
    const current_value = e.detail.value;
    CityJS.change(1, current_value, this);
  },

  //市 选择
  onPickerConfirm2: function (e) {
    this.setData({
      index2: Number(e.detail.value),
      index3: 0
    });
    const current_value = e.detail.value;
    CityJS.change(2, current_value, this);
  },

  //地区 选择
  onPickerConfirm3: function (e) {
    this.setData({
      index3: Number(e.detail.value)
    });
    const current_value = e.detail.value;
    CityJS.change(3, current_value, this);
  },

  searchShopsList: function () {
    this.data.flagRefresh = true;
    let _index1 = this.data.index1;
    let _index2 = this.data.index2;
    let _index3 = this.data.index3;

    let province = this.data.proviceData[_index1].name;
    let city = this.data.cityData[_index2].name;
    let district = this.data.districtData[_index3].DisName;

    if (_index1 == 0) {
      wx.showModal({
        title: '提示',
        content: '请填写省或直辖市信息',
        showCancel: false
      });
    } else {
      // 注意：四个直辖市要转成不带“市”的写法
      // if ("北京市" == province || "上海市" == province || "天津市" == province || "重庆市" == province) {
      //   province = province.substring(0, 2);
      //   console.log(`原来的省已经改为${province}`);
      // }
      province = cutProvince(province);
      this.addressBean = {
        brandCode: getApp().config.brand,
        city: _index2 == 0 ? '' : city,
        district: _index3 == 0 ? '' : district,
        province: province,
        pageNum: 1,
        pageSize: 10,
        distance: 30,
        longitude: this.currLongi,
        latitude: this.currLati,
        sku: this.data.sku15
      }
      this.setData({
        hasShop: false,
        markers: [],
        includePoints: [],
        currentPage: 1,
        flagRefresh: true,
        flagLoading: true,
        flagLoadingComplete: false,
        shopList: new Array(),
        // addressBean: {
        //   brandCode: getApp().config.brand,
        //   city: _index2 == 0 ? '' : city,
        //   district: _index3 == 0 ? '' : district,
        //   province: province,
        //   pageNum: 1,
        //   pageSize: 10,
        //   distance: 30,
        //   longitude: currLongi,
        //   latitude: currLati,
        //   sku: sku15
        // }
      });
      this.getShopList();
    };
  },

  getShopList: function () {
    wx.showLoading({
      title: '加载中'
    });
    let postBean = this.addressBean;
    ShopUtil.getNearbyShops(postBean)
      .then(backBean => {
        if (this.data.flagSearch) {
          this.setData({
            flagSearch: false,
            totalPage: Math.ceil(backBean.size / 10),
          });
        }
        this.setData({
          flagLoading: false,
          flagLoadingComplete: this.data.currentPage >= this.data.totalPage,
          hasShop: true,
          shopList: this.data.flagRefresh ? backBean.list : this.data.shopList.concat(backBean.list),
          shopListStable: this.data.flagRefresh ? backBean.list : this.data.shopList.concat(backBean.list)
        });
        // this.createMarkers();//必须在获取了shoplist之后执行
        this.setData(ShopUtil.createMarkerList(this.data.shopList));
        // let {includePoints} = ShopUtil.createMarkerList(this.data.shopList);
        // this.mapCtx.includePoints({
        //   padding: [30],
        //   points: includePoints
        // })
        wx.hideLoading();
      })
      .catch(e => {
        wx.hideLoading();
        if (this.data.flagSearch) {
          this.setData({
            markers: [],
            includePoints: [],
            hasShop: false
          });
        }
        wx.showToast({
          title: `${e.message}`,
        })
      });
  },

  onReachBottom: function (e) {
    console.log("------------onReachBottom---------------");
    console.log('this.data.currentPage==' + this.data.currentPage);
    if (this.data.currentPage >= this.data.totalPage) {
      this.setData({
        flagRefresh: false,
        flagLoading: false,
        flagLoadingComplete: true,
      });
      return
    }
    let currP = this.data.currentPage + 1;
    let addressBean = this.addressBean;
    addressBean.pageNum = currP;
    this.setData({
      flagRefresh: false,
      flagLoading: true,
      currentPage: currP,
      addressBean: addressBean,
    });
    this.getShopList();
    console.log("------------addressBean.currentPage after =" + this.data.currentPage);
  },


  onShopsItemBarClick: function (e) {
    console.log(e);

    // let shopBean = JSON.stringify(e.currentTarget.dataset.shopBean);
    // wx.navigateTo({
    //   url: `/nearbyShops2/shopDetail/shopDetail?shopBean=${shopBean}`,
    // })

    // let currIndex = e.currentTarget.dataset.currIndex;
    // let shopList = this.data.shopList;
    // let transmitListRaw = new Array()
    // //先添加一条
    // let shopBean0 = shopList[currIndex];
    // transmitListRaw.push(shopBean0);
    // //再看有没有第二条可以添加
    // if (currIndex + 1 >= shopList.length) {
    //   if (currIndex > 0) {
    //     transmitListRaw.push(shopList[--currIndex]);
    //   }
    // } else {
    //   transmitListRaw.push(shopList[++currIndex]);
    // }
    // let transmitList = JSON.stringify(transmitListRaw);
    // wx.navigateTo({
    //   url: '/nearbyShops2/shopDetail/shopDetail?shopBeanList=' + transmitList
    // })


    let currIndex = e.currentTarget.dataset.currIndex;
    let shopList = this.data.shopList;
    let transmitListRaw = new Array();

    //先添加一条
    let shopBean0 = shopList[currIndex];
    transmitListRaw.push(shopBean0);

    //再看有没有第二条可以添加
    if(currIndex + 1 >= shopList.length){
        //说明是最后一个条目，则看有没有前一条
        // if(currIndex==0){
        //     //没有前一条
        //     //直接传送
        //     // navToShopDetail
        // }else{
        //     //有前一条
        //     transmitListRaw.push(shopList[--currIndex]);
        // }

        if(currIndex>0){
            transmitListRaw.push(shopList[--currIndex]);
        }

    }else{
        //不是最后一个条目，直接把后一条目加入 transmitListRaw
        //add to list
        transmitListRaw.push(shopList[++currIndex]);
    }
    // let transmitList = JSON.stringify(transmitListRaw);
    // let transmitList = encodeURIComponent(JSON.stringify(transmitListRaw));
    // wx.navigateTo({
    //     // url: '/nearbyShops2/shopDetail/shopDetail?shopBean=' + shopBean
    //     url: '/nearbyShops2/shopDetail/shopDetail?shopBeanList=' + transmitList
    // })

    wx.setStorage({
        key: 'shop_detail_shopBeanList',
        data: transmitListRaw,
    });
    wx.navigateTo({
        url: '/nearbyShops2/shopDetail/shopDetail'
    })

  },


  onColorChange: function (e) {
    let colorIndex = Number(e.detail.value);
    let colorList = this.data.colorList;
    let picUrl = getThumbnailNormPath(colorList, this.sku, colorIndex);
    this.setData({
      picUrl: picUrl,
      colorIndex: colorIndex,
      priceNow: colorList[colorIndex].price,
      priceOriginal: colorList[colorIndex].originalPrice,
      sizeList: colorList[colorIndex].sizes,
      sizeIndex: 0,
    });
  },

  onSizeChange: function (e) {
    if (this.data.flagDefaultSize) {
      this.setData({ flagDefaultSize: false });
    }
    let sizeIndex = Number(e.detail.value);
    //现在只能请求 12 位的sku，所以直接查询本地缓存的shopBean里面的15位sku相应库存 --- 已废弃，可以查15位
    let sku15 = this.data.colorList[this.data.colorIndex].sizes[sizeIndex].sku;
    this.setData({
      sku15: sku15,
      sizeIndex: sizeIndex,
    });
    // let shopListStable = this.data.shopListStable;
    // console.log("  start ...   shopListStable.length ===" + shopListStable.lengh);
    // let shopListNew = new Array();
    // shopListStable.forEach(shopBean => {
    //   shopBean.mapList.forEach(skuItem => {
    //     console.log("sku15 = ", sku15);
    //     console.log("skuItem = ", skuItem);
    //     if (skuItem[sku15] && (skuItem[sku15] > 0)) {
    //       //该店铺的该sku15有库存，存入shopList
    //       shopListNew.push(shopBean);
    //       console.log(" add success .....");
    //     }
    //   });
    // });
    // this.setData({
    //   shopList: shopListNew,
    // });


    // let addressBean = this.addressBean;
    // addressBean.sku = sku15;
    // this.setData({
    //   addressBean:addressBean,
    // });
    this.searchShopsList();
  },


  //暂时不用了
  onTmplStockBagClick: function (e) {
    wx.showLoading({
      title: '加载中'
    });
    let shopCodeClicked = e.currentTarget.dataset.shopCode;
    console.log(`onTmplStockBagClick clicked..... shopCodeClicked = ${shopCodeClicked}`);
    let postB = {
      shopCode: shopCodeClicked,
      sku: this.sku,
    };

    ShopUtil.getShopStock(postB)
      .then(processed => {
        this.setData({
          goodsStockBean: processed,
        });
        wx.hideLoading();
      })
      .catch(e => {
        wx.hideLoading();
      });
    this.setData({
      flagShowMap: false,
      flagShowStockDetail: true
    });
  },

  onTmplNavToShopClick: function (e) {
    console.log(e);
    let shopBean = e.currentTarget.dataset.shopBean
    wx.openLocation({
      name: shopBean.shopNameCn,
      address: shopBean.address,
      latitude: shopBean.latitude,
      longitude: shopBean.longitude,
      scale: 28
    });
    // let navBean = {
    //   mCurrLatitude: this.currLati,
    //   mCurrLongitude: this.currLongi,
    //   shopBean: e.currentTarget.dataset.shopBean,
    // }
    // let param = JSON.stringify(navBean);
    // wx.navigateTo({
    //   url: `/pages/nearbyShops/navMap/navMap?navBean=${param}`,
    // })
  },


  onTmplColorItemClick: function (e) {
    let id = e.currentTarget.id;
    let picUrlNew = getThumbnailNormPath(this.data.colorList, this.sku, id);
    let sizeListNew = this.data.colorList[id].sizes;//该颜色下的尺寸集合
    this.setData({
      picUrl: picUrlNew,
      colorIndex: id,
      // stockTip: '请选择尺码',
      sizeIndex: -1,
      sizeList: sizeListNew,
    });
  },

  onTmplSizeItemClick: function (e) {
    console.log(e);
    this.setData({
      sizeIndex: e.currentTarget.id,
    });
  },

  onTmplPopGoodsStockClose: function (e) {
    this.setData({
      flagShowStockDetail: false,
      colorIndex: -1,
      sizeIndex: -1,
    });
  }

})