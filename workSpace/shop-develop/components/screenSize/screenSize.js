// components/screenSize/screenSize.js
import { translateArray, filterStr, splitImg } from '../../utils/utils'
import { REGEXP } from '../../src/const'
const app = getApp();
const brand = app.config.brand;
const numberReg= REGEXP.NUMBERREG;
const priceList = [{name: '0-399'}, {name: '399-699'},{name: '699-999'},{name: '999-1399'},{name: '1399-1999'},{name: '1999以上'},];
const sizeList = [{name: "165/88A/XS"},{name: "170/92A/S"},{name: "175/96A/M"}, {name: "180/100A/L"},{name: "185/104A/XL"},{name: "190/108A/XXL"}, {name: "ACC"},{name: "S"},{name: "所有尺码>"}];

let moreList = [
  {
    name: '男装',
    list:[
      {
        name: '上装',
        list: [{name:"165/88A/XS"}, {name:"170/92A/S"},  {name:"175/96A/M"}, {name:"180/100A/L"}, {name:"185/104A/XL"}, {name:"190/108A/XXL"}, {name:"195/112A/XXXL"}]
      },
      {
        name: '下装',
        list: [{name: '160/68A/XXSL'}, {name:"160/68A/XXSR"}, {name:"165/72A/XSL"},  {name:"165/72A/XSR"}, {name:"165/74A/XSLW"}, {name:"165/74A/XSRW"}, {name:"170/76A/SL"}, {name:"170/76A/SR"}, {name:"170/78A/SLW"}, {name:"170/78A/SRW"}, {name:"175/80A/ML"}, {name:"175/80A/MR"}, {name:"175/82A/MLW"}, {name:"175/82A/MRW"}, {name:"180/84A/LL"}, {name:"185/88A/XLL"}, {name:"185/88A/XLLW"}, {name:"185/88A/XLR"}, {name:"185/88A/XLRW"},  {name:"190/92A/XXLL"}, {name:"190/92A/XXLR"}]
      },{
        name: '男鞋',
        list: [{name:"39"}, {name:"40"}, {name:"41"}, {name:"42"}, {name:"43"}, {name:"44"}]
      }
    ]
  },
  {
    name: '女装',
    list:[
      {
        name: '上装',
        list: [{name:"155/76A/XS"},{name:"160/80A/S"}, {name:"165/84A/M"}, {name:"170/88A/L"}, {name:"170/92A/S"},{name:"175/92A/XL"}, {name:"175/96A/M"}, {name:"175/96A/XXL"}, {name:"180/100A/L"}, {name:"180/96A/XXL"}]
      },
      {
        name: '下装',
        list: [{name:"155/60A/XSR"}, {name:"160/64A/SR"}, {name:"165/68A/MR"}, {name:"170/72A/LR"},{name:"175/76A/XLR"}, {name:"175/80A/XXLR"}, {name:"180/80A/XXLR"}]
      },{
        name: '女鞋',
        list: [{name:"225"}, {name:"230"}, {name:"235"},{name:"240"},{name:"245"}, {name:"250"},{name:"255"}, {name:"260"}, {name:"265"},{name:"275"},{name:"280"}, {name:"285"}, {name:"35"}, {name:"36"}, {name:"37"},{name:"38"}, {name:"39"}, {name:"40"}]
      }
    ]
  },
  {
    name: '童装',
    list:[
      {
        name: '',
        list: [{name:"0-1月/50cm"},{name:"1-2月/56cm"}, {name:"2-4月/62cm"}, {name:"4-6月/68cm"}, {name:"6-9月/74cm"}
        ,{name:"9-12月/80cm"}, {name:"1-1.5岁/86cm"}, {name:"1.5-2岁/92cm"}, {name:"2-3岁/98cm"}, {name:"3-4岁/104cm"}
        , {name:"5岁/110cm"}, {name:"6岁/116cm"}, {name:"7岁/122cm"}, {name:"8岁/128cm"}, {name:"9岁/134cm"}
        , {name:"10岁/140cm"}, {name:"11岁/146cm"}, {name:"12岁/152cm"}]
      }
    ]
  },
  {
    name: '配饰',
    list:[
      {
        list: [{name:"ACC"},{name: "175/95/(S/M))"},{name: "180/100/(L/XL))"},{name:"S"},{name:"M"},{name:"L"},{name:"均码"}]
      }
    ]
  }
];
let selectArr = [] ,selectMoreArr = [];
const brandArr = ['ONLY', 'SELECTED', 'VEROMODA', 'JACKJONES', 'NAMEIT'], brandImgArr = [], whiteLogo = 'logo-white-rect.png', blackLogo = 'logo-black-rect.png';
brandArr.forEach( (item, index) => {
  brandImgArr.push({
    brand: item,
    logoImg: splitImg(blackLogo, item),
    width: !index ? '60%' : '90%'
  })
});
let classifyId = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: Boolean,
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    priceList: [],
    sizeList: [],
    /*所有尺码*/
    moreSizeShow: false,
    /*价格区间*/
    price:{
      low: '',
      high: ''
    },
    /*选择的尺码*/
    selectedSizes: '',
    moreList:[],
    // 以下FOL、BESTSELLER 筛选功能用到
    brandImgArr,
    searchValue: '',
    brandDisplay : 'none',
    brandTitle : ''
  },
  ready: function(){
    classifyId = getCurrentPages()[getCurrentPages().length - 1].options.list || ''
    var brandDisplay = this.data.brandDisplay
    if(brand === 'JACKJONES' || brand ==='SELECTED'){
      moreList = moreList.filter( item => {
        return item.name !== '女装' && item.name !== '童装'
      })
    }else if(brand === 'ONLY' || brand === 'VEROMODA'){
      moreList = moreList.filter( item => {
        return item.name !== '男装' && item.name !== '童装'
      })
    } else if(brand === 'FOL' || brand === 'BESTSELLER'){
      brandDisplay = 'flex'
    }
    this.handleList(moreList);
    this.setData({
      priceList:  translateArray(JSON.parse(JSON.stringify(priceList)), 3),
      sizeList: translateArray(JSON.parse(JSON.stringify(sizeList)), 3),
      moreList,
      brandDisplay
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleList(moreList){
      moreList.forEach(classify => {
        classify.list.forEach(item => {
          item.newList = translateArray(JSON.parse(JSON.stringify(item.list)), 3)
        })
      });
    },
    brandImageTap(e){
      this.setData({
        brandTitle : e.currentTarget.dataset.value
      })
    },
    onClick(e){
      let dataType =  e.currentTarget.dataset.type;
      switch (dataType){
        case 'hideScreen':
          this.hideScreen();
          break;
        case 'price':
          this.selectPrice(e);
          break;
        case 'defaultSize':
          this._defaultSize(e);
          break;
        case 'moreSelect':
          this._moreSelect(e);
          break;
        case 'moreConfirm':
          this._moreConfirm(e);
          break;
        case 'confirm':
          this._confirm(e);
          break;
        case 'moreReset':
          this._moreReset(e);
          break;
        case 'reset':
          this.reset(e);
          break;
        case 'brand':
          this.changeBrand(e);
          break;
        case 'search':
          this.inputSearch(e);
          break;
      }
    },
    inputSearch: function(e){
      this.setData({
        searchValue: e.detail.value
      })
    },
    inputPrice(e){
      const {type} = e.currentTarget.dataset;
      const {price} = this.data;
      if(type){
        price[type] = e.detail.value
      }
      this.setData({price})
    },
    changeBrand: function(e){
      let curIndex = e.currentTarget.dataset.index;
      let brandImgArr = this.data.brandImgArr;
      brandImgArr.forEach( (item, index) => {
        item.selected = curIndex === index ? !item.selected : false;
        if(item.selected){
          item.logoImg = splitImg(whiteLogo, item.brand);
          item.width = '90%'
        }else{
          item.logoImg = splitImg(blackLogo, item.brand);
          item.width = !index ? '60%' : '90%'
        }
      });
      this.setData({brandImgArr});
    },
    hideScreen(){
      this.triggerEvent('hideScreen', false);
      this.reset();
      this._moreReset();
    },
    /* 选择价钱 */
    selectPrice(e) {
      let dataValue = e.currentTarget.dataset.value;
      priceList.forEach( item => {
        if(item.name === dataValue){
          item.checked = !item.checked;
          if(item.checked){
            if(dataValue.indexOf('-') > -1){
              let priceArr = dataValue.split('-');
              this.setData({
                price:{
                  low: priceArr[0],
                  high: priceArr[1]
                }
              })
            }else{
              this.setData({
                price:{
                  low: dataValue
                }
              })
            }
          }else{
            this.setData({
              price:{
                low:'',
                high: ''
              }
            })
          }
        }else{
          item.checked = false;
        }
      });
      this.setData({
        priceList: translateArray(JSON.parse(JSON.stringify(priceList)),3)
      });
      app.gioTrack('pageclick_goodslist_filter_price', {classifyId})
    },
    /* 默认尺码 */
    _defaultSize(e){
      let dataValue = e.currentTarget.dataset.value;
      let sizeList = this.data.sizeList;
      if (dataValue.indexOf('所有尺码') > -1){
        this.setData({moreSizeShow: true});
        return;
      }
      sizeList.forEach(itemRow => {
        itemRow.forEach(item => {
          if(item.name === dataValue){
            item.checked = !item.checked;
            if(item.checked){
              selectArr = [];
              selectArr.push(dataValue)
            }else{
              selectArr = selectArr.filter(selectItem => {
                return selectItem !== dataValue
              })
            }
          }else{
            item.checked = false;
          }
        })
      });
      let selectedSizes = selectArr.join('_');
      this.setData({sizeList, selectedSizes});
      app.gioTrack('pageclick_goodslist_filter_size', {classifyId});
    },
    /* 更多选择 */
    _moreSelect(e){
      // 男装
      let dataSex = e.currentTarget.dataset.sex;
      // 上装
      let dataClass = e.currentTarget.dataset.classify;
      // 尺码
      let dataValue = e.currentTarget.dataset.value;
      let moreList = this.data.moreList;
      moreList.forEach(sexItem => {
        if(sexItem.name === dataSex){
          sexItem.list.forEach( classify => {
            if(classify.name === dataClass){
              classify.list.forEach(item => {
                if(item.name === dataValue){
                  item.checked = !item.checked;
                  if(item.checked){
                    selectMoreArr = [];
                    selectMoreArr.push(dataValue)
                  }else{
                    selectMoreArr = selectMoreArr.filter(delItem => {
                      return delItem !== dataValue
                    })
                  }
                }else {
                  item.checked = false;
                }
              })
            }
          })
        }
      });
      this.handleList(moreList);
      this.setData({moreList});
      app.gioTrack('pageclick_goodslist_filter_size', {classifyId});
    },
    /* 更多确定 */
    _moreConfirm(e){
      selectArr = [...selectArr, ...selectMoreArr];
      this.setData({
        moreSizeShow: false,
        selectedSizes: selectArr.join('_'),
      })
    },
    // 确认
    _confirm(e){
      let price = this.data.price;
      let size = this.data.selectedSizes;
      let goodsHighPrice = price.high ? filterStr(price.high) : '';
      let goodsLowPrice = '';
      if(price.low){
        goodsLowPrice = filterStr(price.low).replace(/[\u4e00-\u9fa5]/gm, '')
      }
      let userBrand = '';
      let brandImgArr = this.data.brandImgArr;
      for(let item of brandImgArr){
        if(item.selected){
          userBrand = item.brand;
          break;
        }
      }
      let goodsSelect = this.data.searchValue;
      if(size && size.includes('_')){
        let sizeArr = size.split('_');
        let newSize = [];
        sizeArr.map(sizeItem => {
          newSize.push(sizeItem.includes('/') ? sizeItem.split('/')[0] : sizeItem)
        });
        size = newSize.join('_')
      }else{
        size = size.includes('/') ? size.split('/')[0] : size;
      }
      let res = {size, goodsLowPrice, goodsHighPrice,userBrand,};
      try {
        app.gioTrack('pageclick_goodslist_filter_price_confirm', {classifyId, priceRange: `${goodsLowPrice} - ${goodsHighPrice}`});
        app.gioTrack('pageclick_goodslist_filter_size_confirm', {classifyId, sizeTags: size});

      }catch (err){}
      if(goodsSelect){
        Object.assign(res, {goodsSelect})
      }
      this.triggerEvent('selectedRes', res);
      this.reset();
    },
    /* 更多重置 */
    _moreReset(){
      let moreList = this.data.moreList;
      moreList.forEach(sexItem => {
        sexItem.list.forEach(classify => {
          classify.list.forEach(item => {
            item.checked = false;
          })
        })
      });
      selectMoreArr = [];
      this.handleList(moreList);
      this.setData({moreList})
    },
    /* 重置 */
    reset(){
      sizeList.forEach(item => {
        item.checked = false
      });
      priceList.forEach(item => {
        item.checked = false;
      });
      selectArr = [];
      let selectedSizes = '';
      this.setData({
        brandTitle : '',
        selectedSizes,
        price:{
          low: '',
          high: ''
        },
        sizeList: translateArray(JSON.parse(JSON.stringify(sizeList)), 3),
        priceList: translateArray(JSON.parse(JSON.stringify(priceList)), 3)
      });
    }
  }
});
