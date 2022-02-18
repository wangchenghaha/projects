import { getDetailPage, preSellGoodsDetail} from '../../../service/goods'
import { getNineSku, skuToImg, chengfa, countDown, splitImg, deteleObject, getCurrentUrl, timeStamp} from '../../../utils/utils'
import {wxShowToast} from '../../../utils/wxMethods'
import {goodsDetailgetCouponList} from "../../../service/coupon";
import {URL_CDN} from "../../../src/const";
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
let goodsCode = '';
let preInfo = '';
const swiperImgSize = 5;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataRightShow: false,
    colorDefaultIndex: 0, // 默认颜色索引
    goodsCode: '',
    swiper: {
      indicatorDots: true,
      autoplay: true,
      circular: true,
      interval: 3000,
      duration: 1000,
      data: []
    },
    goods: {},
    goodsColor: [], // 当前颜色
    showSelectSize: false,
    // 小图展示
    goodsImg: '',
    stock: 0,
    selectGoodsInfo: {},
    setList: [], // 推荐搭配
    detailShow: false,
    isShowNotice: false,
    timeObj : {
      day: '00',
      hou: '00',
      min: '00',
      sec: '00'
    },

    fixedRightArr: [
      {
        type: 'collection',
        img: splitImg('icon_collect.png', 'common'),
        isShow: app.config.isCollection ,
      },
      {
        type: 'deleteCollection',
        img: splitImg('icon_collected.png', 'common'),
        isShow: app.config.isCollection && false,
      },
      {
        type: 'share',
        img: splitImg('icon_share.png', 'common'),
        isShow: true,
      },
      {
        type: 'home',
        img: splitImg('icon_home.png', 'common'),
        isShow: true,
      },
      {
        type: 'recommend',
        img: splitImg('icon_recommend.png', 'common'),
        isShow: true,
      }
    ],
    product: {},
    showSelecte: false,
    depPrice: '',
    lastPrice: '',
    curPrice: '',
    originalPrice: '',
    lastStartDate: '',
    lastEndDate: '',
    endDateRemark: '',
    remark: '',
    ruleList: [],
    activityTitle: '预售规则',
    bodyContent:'',

    CoupontitleImage: '',
    coupon_display: false,

    // 是否有优惠券活动
    hasCoupon: false,
    // 活动列表
    activityInfo:[],
    inputUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.colorCode = "219232526E37";
    if(options.colorCode){
      goodsCode = options.colorCode;
      this.setData({goodsCode});
      this.getGoodsDetailFn();
      this.getCouponList();
    }else{
      app.goBack();
    }

  },
  // 改变图片
  changeColorImg: function(sku){
    let skuToImgParam = {
      size: URL_CDN.IMGSIZE240400,
      sku,
    };
    this.setData({goodsImg: `${cdn}${skuToImg(skuToImgParam)}`})
  },

  getGoodsDetailFn: function(){
    const wxData = this.data;
    let param = getNineSku(goodsCode);
    let swiper = wxData.swiper,
      goods = wxData.goods,
      goodsColor = wxData.goodsColor,
      colorDefaultIndex = wxData.colorDefaultIndex,
      selectGoodsInfo = wxData.selectGoodsInfo,
      setList = wxData.setList;
      wx.showLoading();
      preSellGoodsDetail(param).then(res => {
        wx.hideLoading()
        if(res.goods){

          goodsColor = res.goods.color || res.goods.colorList;
          preInfo = res.presellActivity;
          if(preInfo){
            console.log("..........preInfo.ruleExplain-------", preInfo.ruleExplain);
            this.setData({
              lastStartDate: preInfo.twoStageStart,
              lastEndDate: preInfo.twoStageEnd,
              endDateRemark: preInfo.oneStageEnd.substring(0, 11),
              remark: preInfo.remark,
              ruleList: preInfo.stepExplain? JSON.parse(preInfo.stepExplain) : '',
            })
            this.activityCountDown(preInfo.oneStageEnd);
            let oneTimeStamp = timeStamp(preInfo.oneStageEnd);
            let curTimes = Date.parse(new Date()) / 1000;
            if(curTimes > oneTimeStamp){
              wx.showModal({
                title: '提示',
                content: "支付定金时间已过！请选择其他商品。",
                showCancel: false,
                success: function (res) {
                   app.goBack();
                }
              });
              return;
            }
          }
          if(goodsColor){
            let stock = 0;
            let depPrice = 0;
            let lastPrice = 0;
            let fullPrice = 0
            goodsColor.forEach((item, index)=> {
              if(item.colorCode === goodsCode){
                colorDefaultIndex = index;
              }
              // 推荐搭配
              setList.push(...item.setList);
            });
            if(colorDefaultIndex <= 0){
              colorDefaultIndex = 0;
            }
            // 库存计算
            goodsColor[colorDefaultIndex].sizes.forEach(item => {
              item.selected = false;
              stock = stock + item.stock;
              depPrice = item.prePrice;
              lastPrice = item.endPrice;
              fullPrice = item.fullPrice;
            });
            const defaultGoods = goodsColor[colorDefaultIndex];
            let skuToImgParam = {
              size: URL_CDN.IMGSIZE750750,
              sku: defaultGoods.colorCode,
            };
            // 轮播图
            for(let i = 0; i < swiperImgSize; i++){
              skuToImgParam.suffix = `T0${i+1}`;
              swiper.data.push(`${cdn}${skuToImg(skuToImgParam)}`);
            }
            // 默认选中商品信息
            selectGoodsInfo = {
              allPrice: defaultGoods.originalPrice,
              color: defaultGoods,
              discount: defaultGoods.discount,
              goodsCode: defaultGoods.colorCode,
              goodsName:   res.goods.goodsName,
              goodsSku: '',// 15位
              nums: 1,
              onePrice: defaultGoods.originalPrice,
              subGoodsName: defaultGoods.subGoodsName,
              handleDiscount: chengfa(defaultGoods.discount, 10),
              classifyNames: defaultGoods.classifyNames,
              preInfo: preInfo,
            };
            /*if(setList.length){
              setList.forEach(item => {
                item.goodsImg = `${cdn}${skuToImg({
                  size: URL_CDN.IMGSIZE360640,
                  sku: item.goodsColorCode,
                })}`
              })
            }
            if(setList.length > 1){
              setList = deteleObject(setList);
            }*/

            // 好物圈
            let product = this.data.product;
            const itemCode = defaultGoods.colorCode + '';
            const nineCode = defaultGoods.colorCode.substr(0,9);
            product = {
              item_code: itemCode, //物品的唯一标识 是
              title: res.goods.goodsName, // 物品的名称 是
              desc: defaultGoods.classifyNames,
              category_list: [defaultGoods.categoryName],
              image_list: [],// 是
              src_mini_program_path: getCurrentUrl(),
              brand_info:{
                name: app.config.appName,
                logo: splitImg('logo-black-square.png')
              },
              sku_list:[],
            };
            for (let i = 0; i<=5; i++){
              product.image_list.push(
                `${cdn}/goodsImagePC/${app.config.brand}/${nineCode}/${itemCode}/${itemCode}_T0${i+1}.jpg`
              )
            }
            goodsColor.forEach(item => {
              product.sku_list.push({
                sku_id: item.colorCode,
                price: chengfa(item.price, 100),
                original_price: chengfa(item.originalPrice, 100),
                status: item.status === 'InShelf' ? 1 : 2,
                sku_attr_list: [
                  {
                    name: '颜色',
                    value: item.colorAlias
                  },
                  {
                    name: '尺码',
                    value: item.sizes.length ? item.sizes[0].sizeAlias : '',
                  }
                ]
              })
            });
            this.changeColorImg(defaultGoods.colorCode);
            this.setData({
              dataRightShow: true,
              swiper,
              goods,
              goodsColor,
              colorDefaultIndex,
              selectGoodsInfo,
              setList,
              product,
              stock,
              depPrice,
              lastPrice,
              curPrice: fullPrice,
              originalPrice: defaultGoods.originalPrice,
            });
          }
        } else {
          wx.showModal({
            title: '提示',
            content: "该商品已下架",
            showCancel: false,
            success: function (res) {
                wx.navigateBack({
                  delta: 1,
                })
            }
          });
        }
    })
    .then( ()=> {
      this.loadDetailPage()
    }).catch(res => {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: res.msg,
        showCancel: false,
        success: function (res) {
            wx.navigateBack({
              delta: 1,
            })
        }
      });
    })
  },
  loadDetailPage: function(){
    getDetailPage(getNineSku(goodsCode)).then(res => {
      if(res && typeof res === 'string' &&  !res.includes('Not Found')){
        this.setData({
          detailShow:true,  // 详情页是否显示
        });
        const reg_body = /<body[^>]*>([\s\S]*)<\/body>/;
        let bodyContent = reg_body.exec(res)[1];
        this.setData({bodyContent})
        // WxParse.wxParse('article', 'html', bodyContent, this, 5);
      }
    })
  },

  getCoupon: function(e){
    wx.hideLoading();
      if (!getApp().checkLogin()) {
        return;
      } else {
        if( wx.getStorageSync('user_info').phone){
          this.setData({
            coupon_display: true,
          })
        }else{
          app.getCRMInfoFn();
        }
      }
},

  onClick: function(e){
    const dataType = e.currentTarget.dataset.type || e.detail.target.dataset.type;
    if(!app.checkLogin()){
      return;
    }
    switch (dataType){
      case 'selectGoods':
        this.selectGoods(true);
        break;
      case 'close':
        this.selectGoods();
        break;
      case 'selectColor':
        this.selectColorFn(e);
        break;
      case 'selectSize':
        this.selectSizeFn(e);
        break;
      case 'home':
        app.goBack();
        break;
    }
  },


  // 选择颜色
  selectColorFn(e) {
    const index = e.currentTarget.dataset.index || e.detail.target.dataset.index;
    const goodsColor = this.data.goodsColor;
    console.log(">>>>>>>>>>>>>>>", goodsColor);
    const selectGoodsInfo = this.data.selectGoodsInfo;
    let stock = 0;
    this.changeColorImg(goodsColor[index].colorCode);
    // 尺码清空
    goodsColor[index].sizes.forEach(item => {
      item.selected = false;
      stock = stock + item.stock;
    });
    // 重置选择的商品信息
    selectGoodsInfo.goodsSku = '';
    selectGoodsInfo.color = goodsColor[index];
    this.setData({colorDefaultIndex: index, selectGoodsInfo, goodsColor, stock});
    const formId = e.detail.formId;
    if(formId){
      // app.saveFormIdFn(formId)
    }
  },
  // 选择尺码
  selectSizeFn(e){
    const wxData = this.data;
    const dataIndex = e.currentTarget.dataset.index || e.detail.target.dataset.index;
    const goodsColor = wxData.goodsColor;
    const colorIndex = wxData.colorDefaultIndex;
    const selectGoodsInfo = wxData.selectGoodsInfo;
    let goodsColorSize = goodsColor[colorIndex].sizes;
    let depPrice = wxData.depPrice;
    let lastPrice = wxData.lastPrice;
    let stock = wxData.stock; // 库存
    let sizeInfo = {size: {}, goodsSku: ''};
    goodsColorSize.forEach((item, index) => {
      item.selected = index === dataIndex;
      if(item.selected){
        stock = item.stock;
        if(stock === 0){
          item.selected = false;
          wxShowToast('暂无库存，请重新选择')
        }else{
          sizeInfo = {
            size: item,
            goodsSku: item.sku,
            depPrice: item.prePrice,
            lastPrice: item.endPrice,
          };
        }
      }
    });
    Object.assign(selectGoodsInfo, sizeInfo);
    this.setData({goodsColor, stock, selectGoodsInfo, depPrice, lastPrice});
    const formId = e.detail.formId;
    if(formId){
      // app.saveFormIdFn(formId)
    }
  },

  selectGoods: function(status){
    const showSelecte = status || false;
    const showSelectSize = status || false;
    this.setData({
      showSelectSize,
      showSelecte,
    });
  },
  markNotice: function(){
    this.setData({
      isShowNotice: true,
    })
  },

  // closeNotice: function(){
  //   this.setData({
  //     isShowNotice: false,
  //   })
  // },

  // 检测是否开启秒杀活动
  activityCountDown:function(endTime){
        let that = this;
        var year =  endTime.substring(0, 4) + '/' + endTime.substring(5, 7) + '/' + endTime.substring(8, 11);
        var time = endTime.substring(11)
        setInterval(() => {
          let endTime = parseInt(new Date(`${year} ${time}`).getTime()) +  1000
          let countTimer = countDown(endTime);
          that.setData({
            timeObj: countTimer,
          })
        }, 1000);
  },

  submitBtn: function(){
    console.log("======>>>>>>>>>>>>======",this.data.selectGoodsInfo);
    let selectedGoods = this.data.selectGoodsInfo;
    if(!selectedGoods.goodsSku){
      wx.showModal({
        title: '提示',
        content: '请您选择尺码后购买',
        showCancel: false
      });
      return;
    }
    wx.setStorageSync('dingdanCon', [selectedGoods]);
    wx.navigateTo({
      url: '../orderSave/orderSave'
    })
  },

  closeThisPop: function(){
    this.setData({
      isShowNotice: false,
    })
  },


  getCouponList: function(){
    let beanJson = {
      brandCode: app.config.brand,
      channelCode:'PRESELL',
    }
    // 获取优惠券
    goodsDetailgetCouponList(beanJson).then(data=>{
      if(data.promotionActionList.length === 0){
        return
      }
      let actionCouponList = data.promotionActionList[0];
      let curTime = new Date().getTime();
      if(curTime < (new Date(actionCouponList.actionStartDate).getTime() - 288000000)
       || (new Date(actionCouponList.actionEndDate).getTime() + 57600000) < curTime){
        return
      }
      if(actionCouponList){
        this.setData({
          hasCoupon: true,
          CoupontitleImage: cdn + actionCouponList.actionLogo
        })
        let actionList = actionCouponList.actionCouponList;
        for (let i = 0; i < actionList.length; i++) {
          actionList[i].imgUrl = cdn + actionList[i].imgUrl
        }

        this.setData({
          activityInfo: actionCouponList,
        })

      } else {
        this.setData({
          hasCoupon: false,
        })
      }

    }).catch(err=>{

    })
  },

  // 去掉优惠券弹窗
  changeShow: function(e){
    this.setData({
      coupon_display: false,
    });
  },
})
