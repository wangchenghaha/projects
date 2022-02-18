import { KEYSTORAGE, URL_CDN } from '../../src/const.js'
import {queryGoodsCollection, deleteCollections} from '../../service/collection.js'
import { getGoodsDetail } from "../../service/goods";
import {wxShowToast} from '../../utils/wxMethods'
import {skuToImg, animateShow, animateHide, chengfa} from '../../utils/utils'
import {shoppingAdd} from '../../service/cart'
import {wxUserActions} from "../../service/collect";

var app = getApp();
const CDN = app.config.cdn;
let goodsDetail;
let colorlist = {};  // 颜色列表
let sizelist = {};    // 尺码列表
let delGood;
let skuToImgParam = {
  size: URL_CDN.IMGSIZE240400
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    //删除商品确认
    remove_display: 'none',
    haveGoods: true,
    noGoods: false,
    collectionList:[],
    dmpGoodsItemIds:[],
    isEdit: false,
    isSeacher: false,
    collectionNums: 0,
    seacherText: '',
    editText: "编辑",
    isAllSelected: false,
    isBottom: false,
    //动画效果
    animationOpacity: {},
    animationBottom: {},
    //颜色分类
    b_li: ['350洗水牛仔蓝350JeansBlue'],
    //请选择尺码
    xzChicun: '请选择尺码',
    //尺码
    c_li: ['155/60A/XSR', '160/64A/SR'],
    chima_list_num: -1,
    chimaList: [],
    colorKucuns: [],
    colors: {},
    sizes: {},
    color_list_num: 0,
    size_list_num: -1,
    nums: 1,
    stock_nums: 0,
    goodsImg: '',
    goodsSku: '',
    addAndDelGoodsId: "",
    isSelDel: false, // 判断是否是删除操作
    //弹框显示/隐藏
    details_display: 'none',
    isStock: false,
    currentPage: 1,
    projeckName: app.config.brand === 'SELECTED' ? 'detail-gender' : 'detailPage',
    isFol: app.config.brand === 'FOL',
    currentPrice: '',
    originalPrice: '',
    // 显示推荐商品
    showDMP: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._queryGoodsCollection(this.data.currentPage, '');
  },


  onReady: function () {
    var animation_bottom = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });

    var animation_oapcity = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })

    this.animation_bottom = animation_bottom;
    this.animation_oapcity = animation_oapcity;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //删除事件
  del: function (e) {
    this.data.items.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      items: this.data.items
    })
  },
  _queryGoodsCollection: function(curPage, searcher){
      let jsData={
        currentPage: curPage,
        pageSize: 10,
        nameOrSKU: searcher,
        unionId: "", // wx.getStorageSync('unionid'),
      }
      wx.showLoading({
        title: "加载中...",
        mask:true,
      })
      queryGoodsCollection(jsData).then(res => {
          wx.hideLoading();
          this.setData({
            showDMP: true,
          })
          if(searcher && res.datas.length === 0){
            if(curPage === 1){
              wx.showModal({
                title: '提示',
                content: "您搜索的商品不存在！",
                showCancel: false
              })
              this.setData({
                searchValue: '',
              });
              return;
            }
          } else if(searcher && res.datas.length > 0){
            this.setData({
              collectionList: [],
              dmpGoodsItemIds: []
            })
          }

          let collectioned = res.datas;
          let collectionList = this.data.collectionList;
          this.setData({
            collectionNums: res.totalCount,
          })
          if(res.totalPage === this.data.currentPage){
            this.setData({
              isBottom: true,
            })
          }
          let dmpGoodsItemIds = this.data.dmpGoodsItemIds
          for (let i = 0; i < collectioned.length; i++) {
            let skuToImgParam = {
              size: URL_CDN.IMGSIZE240400,
              sku: collectioned[i].goodsCode,
            };
            collectioned[i].imagePic =`${CDN}${skuToImg(skuToImgParam)}`;
            if(this.data.isAllSelected){
              collectioned[i].isSelected = true;
            }
            //20210817 猜你喜欢
            if(collectioned.length<3&&collectioned[i].status==='InShelf'){
              dmpGoodsItemIds.push(collectioned[i].goodsCode)
            }
          }
          if(collectionList.length > 0){
            collectionList = collectionList.concat(collectioned);
          } else {
            collectionList = collectioned;
          }
          if(collectionList.length > 0){
            this.setData({
              collectionList,
              dmpGoodsItemIds,
              haveGoods: true,
              noGoods: false,
            })
          } else {
            this.setData({
              haveGoods: false,
              noGoods: true,
              isBottom: false,
              isEdit: false,
            })
          }

      }).catch( err=>{
        this.setData({
          showDMP: true,
        })
        wx.hideLoading();
        wxShowToast(err.message);
      })
  },

  collectionEdit: function () {
    let isEdit = this.data.isEdit;
    if (this.data.collectionList.length > 0) {
      isEdit = !isEdit;
      this.setData({
        isEdit: isEdit,
        editText: isEdit ? '完成' : '编辑',
      })
      app.gioTrack('pageclick_collection_edit')
    }
  },

  collectionSeacher: function () {
    if (this.data.collectionList.length > 0) {
      app.gioTrack('pageclick_personalcenter_collectionlist_search')
      this.setData({
        isSeacher: true,
      })
    }
  },

  canncelSeacher: function () {
    this.setData({
      isSeacher: false,
      currentPage: 1,
      collectionList: [],
      searchValue: '',
    })
    this._queryGoodsCollection(1, '');
  },


  searchInput: function (e) {
    console.log(e);
    let seacherText = e.detail.value.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, "")
      .replace(/\s/g, "");
    this.setData({
      searchValue: seacherText,
    })
  },

  seacherGoods: function () {
    const {searchValue} = this.data;
    if (!searchValue) {
      wxShowToast("请输入搜索内容！");
      return;
    }

    app.gioTrack('pageclick_personalcenter_collectionlist_search_sub', {keyword: searchValue})
    this._queryGoodsCollection(1, searchValue);
  },

  // 单选
  checked: function (e) {
    let index = e.currentTarget.dataset.index;
    let collectionList = this.data.collectionList;
    let isSelected = collectionList[index].isSelected;
    collectionList[index].isSelected = !isSelected;
    let selects = 0;
    let isAllSelected = this.data.isAllSelected;
    for (let i = 0; i < collectionList.length; i++) {
      if (collectionList[i].isSelected) {
        selects++;
      }           // 改变所有商品状态
    }
    if (selects === collectionList.length) {
      isAllSelected = true;
    } else {
      isAllSelected = false;
    }       // 改变状态
    this.setData({
      collectionList,
      isAllSelected,
    })
  },

  goDetail: function (e) {
    let {index} = e.currentTarget.dataset;
    let collectionList = this.data.collectionList;
    let colorCode = collectionList[index].goodsCode;
    app.gioTrack('pageclick_collection_goods', {
      spu_id: colorCode
    })
    wx.navigateTo({
      url: `/pages/content/content?colorCode=${colorCode}`
    })
  },

  // 全选
  allCheckGood: function () {
    let isAllSelected = this.data.isAllSelected;
    let collectionList = this.data.collectionList;
    isAllSelected = !isAllSelected;
    for (let i = 0; i < collectionList.length; i++) {
      collectionList[i].isSelected = isAllSelected;
    }
    this.setData({
      isAllSelected,
      collectionList,
    })
  },

  // 添加致购物车
  addShopCart: function (e) {
    let index = e.currentTarget.dataset.index;
    const {goodsCode, id} = this.data.collectionList[index];
    this.addCart(goodsCode);
    this.setData({
      isSelDel: false,
      addAndDelGoodsId: id,
    })
    app.gioTrack('pageclick_collection_addtocart', {
      spu_id: goodsCode
    });
  },

  // 删除收藏
  deleteThis: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      isSelDel: true,
      remove_display: 'block'
    })
    delGood = this.data.collectionList[index].id;
    const {isEdit, collectionList} = this.data;
    const gioName = isEdit ? 'pageclick_collection_edit_delete' : 'pageclick_collection_delete';
    app.gioTrack(gioName);
  },

  // 提示框确认按钮
  remove_true: function () {
    if (delGood) {
      this.deleteCollection("single", delGood);
      const {isEdit, collectionList} = this.data;
      const gioName = isEdit ? 'pageclick_collection_edit_delete' : 'pageclick_collection_delete_confirm';
      const goods = collectionList.find(item => item.id === delGood);
      app.gioTrack('pageclick_collection_delete_confirm', {spu_id: goods.goodsCode});
    }
  },

  //提示框取消按钮
  remove_false: function () {
    this.setData({
      remove_display: 'none'
    });
  },

  // 批量删除收藏
  deleteSel: function () {
    this.setData({
      isSelDel: true,
    })
    this.deleteCollection("all", "");
  },

  // 隐藏搜索
  hideToast: function () {
    this.setData({
      isSeacher: false,
    })
  },

  deleteCollection: function (deleteType, goodID) {
    let goodsIds = [];
    let goods = this.data.collectionList;
    if (deleteType === 'all') {
      for (let i = 0; i < goods.length; i++) {
        if (goods[i].isSelected) {
          goodsIds.push(goods[i].id);
        }
      }
    } else {
      goodsIds.push(goodID);
    }
    deleteCollections(goodsIds).then(res => {
      // this.deleteCollectionList(goodsIds)
      this.setData({
        isSeacher: false,
        currentPage: 1,
        collectionList: [],
        searchValue: '',
      })
      this._queryGoodsCollection(1, '');
      if (this.data.isSelDel) {
        wx.showToast({
          title: "删除成功！",
        })
        this.setData({
          remove_display: 'none',
        })
      }
    })
  },

  // 整合删除数据
  deleteCollectionList: function (goodsIds) {
    let collectionList = this.data.collectionList;
    for (let i = 0; i < goodsIds.length; i++) {
      for (let j = 0; j < collectionList.length; j++) {
        if (goodsIds[i] === collectionList[j].id) {
          collectionList.splice(j, 1);
          break;
        }
      }
    }
    let collectionNums = this.data.collectionNums;
    collectionNums = collectionNums - goodsIds.length;
    this.setData({
      collectionList,
      collectionNums
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("isBottom =====", this.data.isBottom)
    if (this.data.isBottom) {
      return;
    }

    this.data.currentPage++;
    this._queryGoodsCollection(this.data.currentPage, "");
  },

  // 购物车
  addCart(goodsColorCode) {
    let goodsCode = goodsColorCode.substr(0, 9) || '';

    animateShow(this);
    this.getGoodCon(goodsCode, goodsColorCode);
  },

  //获取商品详情及库存
  getGoodCon: function (goodsCode, colorCode) {

    wx.showLoading({
      title: '加载中'
    });

    //获取商品信息
    getGoodsDetail(goodsCode, '')
      .then(res => {
        wx.hideLoading();
        goodsDetail = res;
        colorlist = res.color;
        let colorArr = [];
        for (let i = 0; i < res.color.length; i++) {
          if (colorCode === res.color[i].colorCode) {
            skuToImgParam.sku = colorCode;
            this.setData({
              color_list_num: i,
              goodsImg: `${CDN}${skuToImg(skuToImgParam)}`,
              goodsSku: colorCode,
              currentPrice: res.color[i].price,
              originalPrice: res.color[i].originalPrice,
            });
          }
          colorArr.push(res.color[i].status === "OutShelf");
        }
        let arr = [];
        sizelist = res.color[this.data.color_list_num].sizes;
        let totalStock = 0;
        for (let i = 0; i < sizelist.length; i++) {
          totalStock += sizelist[i].sellStock;
          arr.push(sizelist[i].sellStock <= 0);
        }

        this.setData({
          colors: res.color,
          sizes: sizelist,
          chimaList: arr,
          yanseList: colorArr,
          size_list_num: -1,
          stock_nums: totalStock,
          details_display: 'block'
        })
      })
      .catch(e => {
        console.log(e.message);
      });
  },

  //选择尺寸 - 关闭
  chicunHide: function (e) {
    animateHide(this);
  },

  toIndex: function () {
    app.goBack();
  },

  // 选择颜色
  colorChange: function (e) {
    let index = e.currentTarget.dataset.index;
    sizelist = colorlist[index].sizes;
    skuToImgParam.sku = colorlist[index].colorCode;
    if (colorlist[index].status === "OutShelf") {
      return;
    }
    let arr = [];
    let totalStock = 0;
    for (let i = 0; i < sizelist.length; i++) {
      totalStock += sizelist[i].sellStock;
      arr.push(sizelist[i].sellStock <= 0);
    }
    this.setData({
      color_list_num: index,
      nums: 1,
      chimaList: arr,
      stock_nums: totalStock,
      sizes: sizelist,
      goodsImg: `${CDN}${skuToImg(skuToImgParam)}`,
      goodsSku: skuToImgParam.sku,
      size_list_num: -1,
      currentPrice: colorlist[index].price,
      originalPrice: colorlist[index].originalPrice,
    })
  },

  // 选择尺码
  sizeChange: function (e) {
    let index = e.currentTarget.dataset.index;
    const curSize = sizelist[index];
    if (curSize.sellStock === 0) {
      return;
    }
    // 库存为0不可选择
    this.setData({
      size_list_num: index,
      nums: 1,
      stock_nums: curSize.sellStock,
      goodsSku: curSize.sku
    })
  },

  //件数增加
  add_number: function (e) {
    var numm = this.data.nums;
    if (numm >= this.data.stock_nums) {
      return false;
    }
    numm++;
    this.setData({
      nums: numm
    });
  },

  //件数减少
  jian_number: function (e) {
    var numm = this.data.nums;
    if (numm == 1) {
      return;
    }
    numm--;
    this.setData({
      nums: numm
    });
  },
  // 微信用户行为
  _wxUserAction: function (param) {
    let data = [];
    data.push({
      action_type: 'ADD_CART',
      action_param: {
        'product_id': param.gsColorCode,
        'industry_id': '',
        'product_name': param.goodsName,
      }
    });
    wxUserActions(data);
  },

  // 确认修改
  submitChange: function () {
    if (this.data.size_list_num < 0) {
      wx.showToast({
        title: '请选择尺码',
        image: '../../images/joinFalse.png',
        duration: 1500
      });
      return;
    }
    wx.showLoading({
      title: "Loading....",
      mask: true
    }, setTimeout(() => {
      wx.hideLoading();
      let colorListNum = this.data.color_list_num;
      let sizeNum = this.data.size_list_num;
      let addColor = colorlist[colorListNum];
      let addSize = colorlist[colorListNum].sizes[sizeNum];
      let categoryList = [];
      if (addColor.classifyNames) {
        if (addColor.classifyNames.includes(',')) {
          categoryList = addColor.classifyNames.split(',')
        } else {
          categoryList.push(addColor.classifyNames)
        }
        if (!categoryList[categoryList.length - 1]) {
          categoryList.splice(categoryList.length - 1, 1)
        }
      }
      let addCartParam = {
        goodsName: goodsDetail.goodsName,
        goodsCode: goodsDetail.projectCode,
        gsColorCode: addColor.colorCode,
        gscPicmainId: "",
        gscPicmainPath: addColor.picurls[2],
        goodsSku: addSize.sku,
        sizeName: addSize.sizeAlias,
        colorName: addColor.colorAlias,
        quantity: this.data.nums,
        category_list: categoryList,  //Array
        price: chengfa(addColor.price, 100),   // Number  售价精确到分
        original_price:  chengfa(addColor.originalPrice, 100),   // Number  原价精确到分
      };
      /*if(app.config.isFOL){
        addCartParam.quantity = this.data.nums;
      }*/
      shoppingAdd(addCartParam).then(res => {
        if (res === '成功') {
          // 微信用户行为“加入购物车”
          if (app.config.brand === 'JACKJONES' || app.config.brand === 'VEROMODA') {
            this._wxUserAction(addCartParam);
          }
          wx.showToast({
            title: "添加成功",
            icon: 'success',
            duration: 1500
          });
          let localCartList = wx.getStorageSync(KEYSTORAGE.cartList);
          let changeNum = localCartList.totalCounts + 1;
          app.changeLocalCart(changeNum);
        } else if (res === '已添加！') {
          wx.showToast({
            title: '商品已添加',
            image: '../../images/joinFalse.png',
            duration: 1500
          });
        }
        if (this.data.addAndDelGoodsId) {
          this.deleteCollection("single", this.data.addAndDelGoodsId);
        }

      }).catch(err => {
        wx.showToast({
          title: err.message,
          icon: 'none'
        });
      });
      app.gioTrack('pageclick_collection_addtocart_choosecolorsize', {
        spu_id: addCartParam.gsColorCode,
        color: addCartParam.colorName,
        sizeTags: addCartParam.sizeName,
        num: addCartParam.quantity,
        sku_id: addCartParam.goodsSku
      });
    }, 1500));
    animateHide(this);
  },

})
