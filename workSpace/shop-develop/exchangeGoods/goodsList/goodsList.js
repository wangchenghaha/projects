import { getDetail, getStockNew, getH5Categories, getNormalGoodsList, getNearbyShopGoodsList } from '../../service/goods';
import { getShopStock } from '../../service/shop';
var Util = require('../../utils/utils.js');
const config = require('../../src/config');
const cdn = config.cdn; //内容分发网络主机地址
const brand = config.brand; //当前品牌

let currClassifyId = '';
let currInput = '';
let cartListMap = new Map();
let detailBean = null;
let tempPostBean = null;
let orderBean = null;
let NAV_NORM = [{ name: '人气', sort: 'desc' }, { name: '价格', sort: 'desc' }, { name: '销量', sort: 'desc' }, { name: '新品', sort: 'desc' }];
let NAV_SHOP = [{ name: '价格', sort: 'desc' }, { name: '新品', sort: 'desc' }];
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 判断是否是iphoneX
        isIphoneX: getApp().globalData.isIPhoneX,
        flagShowItem: false,
        ifShowCategory: false,
        flagShowCart: false,
        flagCartDisplay: "none",
        flagLoading: false,
        flagLoadingComplete: false,
        noneGoods: false,
        currentpage: 1,
        totalPage: 0,
        goodsList: [],
        goodCount: 1,
        colorIndex: -1,
        sizeIndex: -1,
        colorList: [],
        sizeList: [],
        cartList: [],
        animOpacity: {},
        animRight: {},
        sortType: "1",//1：价格2：上架日期  //普通订单：1-点击量[默认](人气)；2-折扣价；3-销量；4-上架时间
        sortDirection: "DESC",

        nav: NAV_NORM,
        navId: 0,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(" goodsList page >>>>>>>>>>>>>>>>>>>>>>> onLoad.......................");
        console.log(options);
        // let { exchangeWay, shopBean, exchangeCode } = options;
        let { exchangeWay, shopBean } = options;
        tempPostBean = options.tempPostBean;
        orderBean = options.orderBean;
        if (shopBean) {
            shopBean = JSON.parse(shopBean);
            this.setData({
                shopCode: shopBean.shopCode,
                shopName: shopBean.shopNameCn,
            });
        }
        let isNearbyShop = exchangeWay == 'exchangeAtShopOnlineChoose';
        this.setData({
            exchangeWay: exchangeWay,
            isNearbyShop: isNearbyShop,
            nav: isNearbyShop ? NAV_SHOP : NAV_NORM,
            navTextIndent: isNearbyShop ? 'text-indent:20%;' : 'text-indent:7%;',
        });
        // if (exchangeCode) {
        //     this.setData({
        //         exchangeCode: exchangeCode,
        //     });
        // }
        cartListMap = new Map();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.getList();
        let anim_right = wx.createAnimation({
            duration: 300,
            timingFunction: 'ease'
        });
        let anim_opacity = wx.createAnimation({
            duration: 300,
            timingFunction: 'ease'
        })
        this.anim_right = anim_right;
        this.anim_opacity = anim_opacity;

        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>  this.anim_right = ");
        console.log(this.anim_right);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>  this.anim_opacity = ");
        console.log(this.anim_opacity);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    onUnload: function () {
        currClassifyId = '';
        currInput = '';
    },

    onSortClick: function (e) {
        if (Util.throttle(1000)) {
            let index = e.currentTarget.id;
            let navId = this.data.navId;
            let navList = this.data.nav;
            let dir = navList[index].sort; //= this.data.nav[index].sort == "desc" ? "asc" : "desc";

            // let isNearbyShop = this.data.exchangeWay == `exchangeAtShopOnlineChoose`;
            if (navId == index) {
                dir = dir == "desc" ? "asc" : "desc";
            } else {
                dir = "desc";
            }
            navList[index].sort = dir;

            this.setData({
                navId: index,
                nav: navList,
                sortDirection: dir,
                sortType: ++index,
                goodsList: [],
                currentpage: 1,
            });
            wx.showLoading({
                title: '加载中...',
            });
            this.getList();
        }
    },

    onItemClick: function (e) {
        console.log("onItemClicked..........................");
        wx.showLoading({
            title: `加载中...`
        });
        let index = e.currentTarget.id;
        let goodsName = this.data.goodsList[index].goodsName;
        let goodsCode = this.data.goodsList[index].goodsCode;
        let gsColorCode = this.data.goodsList[index].gsColorCode;
        let spu = gsColorCode.substring(0, 9);
        let stockNomal = this.data.exchangeWay == `exchangeExpress`;//exchangeAtShopOnlineChoose   exchangeExpress

        this.setData({
            flagShowItem: true,
            noStockList: new Array(),
            colorIndex: -1,
            sizeIndex: -1,
            colorList: [],
            sizeList: [],
            goodCount: 1,
            goodsName: goodsName,
            bigThumbUrl: `${cdn}/goodsImagePC/${brand}/${spu}/${gsColorCode}/750750/${gsColorCode}_T01.jpg`,
        });
        getDetail(goodsCode)
            .then(res => {
                detailBean = res;
                this.setData({
                    colorList: res.color,
                    sizeIndex: 0,
                });
                let postNorm = goodsCode;
                let postShop = {
                    shopCode: this.data.shopCode,
                    sku: spu,
                };
                return stockNomal ? getStockNew(postNorm) : getShopStock(postShop);
            })
            .then(stockBean => {
                this.setData({
                    goodsStockBean: stockBean,
                });
                wx.hideLoading();
            })
            .catch(e => {
                wx.hideLoading();
                wx.showToast({
                    title: `${e.message}`,
                })
            });
    },

    onColorClick: function (e) {
        if (Util.throttle()) {
            console.log(e);
            let colorIndex = e.currentTarget.id;
            let colorCode = this.data.colorList[colorIndex].colorCode;
            let sizeListNew = this.data.colorList[colorIndex].sizes;
            let mStockBean = this.data.goodsStockBean;
            let noStockListNew = new Array();
            sizeListNew.forEach(sizeBean => {
                console.log("\n outter ....  sizeBean.sku = " + sizeBean.sku);
                // Object.keys(mStockBean).forEach(stockSku => {
                console.log(" inner >>>>>>>>>>>  mStockBean[sizeBean.sku] = " + mStockBean[sizeBean.sku]);
                if (mStockBean[sizeBean.sku]) {
                    mStockBean[sizeBean.sku] <= 0 ? noStockListNew.push(true) : noStockListNew.push(false);
                    console.log(" noStockListNew pushed 000");
                } else {
                    noStockListNew.push(true);
                    console.log(" noStockListNew pushed 111 \n");
                }
                // });
            });
            let spu = colorCode.substring(0, 9);
            //picUrl:`${ cdn } / goodsImagePC / ${ brand } / ${ contentID } / ${ url_obj[index].colorCode } / 750750 / ${ url_obj[index].colorCode }_T0${(i + 1)}.jpg`,
            //TODO:切换banner图
            let bigThumbUrl = `${cdn}/goodsImagePC/${brand}/${spu}/${colorCode}/750750/${colorCode}_T01.jpg`;
            console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>> bigThumbUrl =======${bigThumbUrl}`);
            this.setData({
                colorIndex: colorIndex,
                sizeList: sizeListNew,
                sizeIndex: 0,
                noStockList: noStockListNew,
                bigThumbUrl: bigThumbUrl,
            });
        }
    },

    onSizeClick: function (e) {
        this.setData({
            sizeIndex: e.currentTarget.id,
        });
    },

    onCountPlus: function (e) {
        let goodCount = this.data.goodCount;
        if (goodCount >= this.data.goodsStockBean[this.data.sizeList[this.data.sizeIndex].sku]) {
            wx.showToast({
                title: '已达最大库存',
            })
            return;
        };
        this.setData({
            goodCount: ++goodCount,
        });
    },

    onCountMinus: function (e) {
        let goodCount = this.data.goodCount;
        if (goodCount <= 0) {
            return;
        };
        this.setData({
            goodCount: --goodCount,
        });
    },

    onAddToCart: function (e) {
        //TODO: 动画效果
        //TODO: 换货购物车储存在 this.data.cartListMap 中
        // 把库存也存入 cart item 中:
        let sku = this.data.sizeList[this.data.sizeIndex].sku;
        let colorCode = sku.substring(0, 12);
        let spu = sku.substring(0, 9);
        if (this.data.goodsStockBean[this.data.sizeList[this.data.sizeIndex].sku]) {
            //使用 Map 存储
            cartListMap.set(sku, {
                goodsName: detailBean.goodsName,
                colorName: this.data.colorList[this.data.colorIndex].color,
                originalPrice: this.data.colorList[this.data.colorIndex].originalPrice,
                price: this.data.colorList[this.data.colorIndex].price,
                gcsSku: sku,
                sizeName: this.data.sizeList[this.data.sizeIndex].sizeAlias,
                goodsCount: this.data.goodCount,
                gsMainPicPath: this.data.colorList[this.data.colorIndex].picurls[0],
                // gsMainPicPath: `${ cdn } / goodsImagePC / ${ brand } / ${ spu } / ${ colorCode } / 750750 / ${ colorCode }_T01.jpg`,
            });
            wx.showToast({
                title: '已加入购物车',
            })
            console.log(cartListMap);
            this.onItemLayoutClose();
        } else {
            wx.showModal({
                title: '提示',
                content: '请选择一件商品',
                showCancel: false,
            })
        }
    },



    onCartClick: function (e) {
        let cartList = new Array();
        cartListMap.forEach((value, key, map) => {
            cartList.push(value);
        });
        console.log(cartList);
        this.setData({
            cartList: cartList,
            // flagCartDisplay: "block",
            flagShowCart: true,
        })
        // let that = this;
        // let query = wx.createSelectorQuery()
        // query.select('#frame_popup_cart').boundingClientRect()
        // query.exec(function (res) {
        //     Util.animShowRight(that, res[0].right);
        // });
    },


    onCategoryClose: function (e) {
        this.setData({
            ifShowCategory: false,
        });
    },

    onCategoryShow: function (e) {
        getH5Categories()
            .then(data => {
                this.setData({
                    allCate: data,
                });
            })
            .catch(e => {
                wx.hideLoading();
                wx.showToast({
                    title: `${e.message}`,
                });
            });
        this.setData({
            ifShowCategory: true,
        });
    },

    onItemLayoutClose: function (e) {
        this.setData({
            goodCount: 1,
            flagShowItem: false,
            bigThumbUrl: '',
        });
    },

    onLeftCateClick: function (e) {
        console.log(e);
        let index = e.currentTarget.id;
        console.log(index);
        this.setData({
            leftCateIndex: index,
            // thisIndex2: 0
        });
    },

    onRightCateClick: function (e) {
        console.log(e);
        currClassifyId = e.currentTarget.id;
        currInput = "";
        this.setData({
            goodsList: [],
            currentpage: 1,
            ifShowCategory: false,
        });
        wx.showLoading({
            title: '加载中...',
        });
        this.getList();
    },

    searchInput: function (e) {
        console.log(e.detail.value);
        currInput = e.detail.value;
    },

    onSearchClick: function (e) {
        console.log("currInput ==" + currInput);
        currClassifyId = "";
        this.setData({
            goodsList: [],
            currentpage: 1,
            ifShowCategory: false,
        });
        wx.showLoading({
            title: '加载中...',
        });
        this.getList();
    },

    onCartCancel: function (e) {
        // let that = this;
        // let query = wx.createSelectorQuery()
        // query.select('#frame_popup_cart').boundingClientRect()
        // query.exec(function (res) {
        //     console.log(res[0].right);
        //     Util.animHideRight(that, res[0].right);
        // });
        this.setData({
            flagShowCart: false,
        })
    },

    // 购物车item删除
    onItemDelete: function (e) {
        console.log(e);
        let index = e.currentTarget.id;
        let cartList = this.data.cartList;
        let mSku = cartList[index].gcsSku;
        cartListMap.delete(mSku);
        cartList.splice(index, 1);
        this.setData({
            cartList: cartList,
        });
        wx.showToast({
            title: '已删除',
        });
    },

    onCartConfirm: function (e) {
        if (Util.throttle()) {
            this.setData({
                flagShowCart: false,
            });
            if (this.data.cartList.length == 0) {
                wx.showToast({
                    title: '请选择商品',
                })
                return;
            }
            let cartList = JSON.stringify(this.data.cartList);
            // let exchangeCode = this.data.exchangeCode;
            console.log(">>>>>>>>>>>>>.    tempPostBean    ==============");
            console.log(tempPostBean);
            wx.navigateTo({
                url: `/exchangeGoods/fakeConfirmExchange/fakeConfirmExchange?cartList=${cartList}&exchangeWay=${this.data.exchangeWay}&tempPostBean=${tempPostBean}&orderBean=${orderBean}&shopCode=${this.data.shopCode}`,
            });
        }
    },

    getList: function (e) {
        wx.showLoading({
            title: '加载中...'
        });
        this.setData({
            flagLoadingComplete: false,
        })

        let normalBean = {
            classifyIds: currClassifyId,
            goodsSelect: currInput,
            currentpage: this.data.currentpage,
            goodsHighPrice: "",
            goodsLowPrice: "",
            sortDirection: this.data.sortDirection,
            sortType: this.data.sortType,
        };
        let containsChinese = Util.containsChinese(currInput);
        let nearbyShopBean = {
            classifyId: currClassifyId,
            goodsName: containsChinese ? currInput : '',
            sku: containsChinese ? '' : currInput,
            site: getApp().config.brand,
            pageNum: this.data.currentpage,
            pageSize: 10,
            shopCode: this.data.shopCode,
            sortType: this.data.sortType,
            sortDirection: this.data.sortDirection,
        };

        let fooOrin = this.data.exchangeWay == `exchangeAtShopOnlineChoose` ?
            Promise.resolve(getNearbyShopGoodsList(nearbyShopBean)) : Promise.resolve(getNormalGoodsList(normalBean));

        fooOrin.then(res => {
            // this.data.currentpage++;
            let { currentpage } = this.data;
            currentpage++;
            var newData = Util.price(res.data, 'discountPrice', 'originalPrice');
            this.setData({
                flagLoading: false,
                goodsList: this.data.goodsList.concat(newData),
                currentpage: currentpage,
                totalPage: res.totalPage,
            });
            let boo = this.data.goodsList.length == 0 ? true : false;
            let { totalPage } = this.data;
            this.setData({
                noneGoods: boo,
                flagLoadingComplete: boo ? false : currentpage >= totalPage,
            });
            wx.hideLoading();
        })
            .catch(e => {
                this.setData({
                    flagLoading: false,
                });
                wx.hideLoading();
                wx.showToast({
                    title: `${e.message}`,
                })
            });
    },

    onReachBottom: function (e) {
        console.log("------------onReachBottom---------------");
        console.log('this.data.currentpage==' + this.data.currentpage);
        console.log('this.data.totalPage==' + this.data.totalPage);
        if (this.data.currentpage >= this.data.totalPage) {
            this.setData({
                flagLoading: false,
                flagLoadingComplete: true,
            });
            return
        }
        this.setData({
            flagLoading: true,
            currentpage: ++this.data.currentpage,
        });
        this.getList();
    },
})