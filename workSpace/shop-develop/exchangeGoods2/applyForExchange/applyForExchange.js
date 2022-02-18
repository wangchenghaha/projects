import { getDetail, getStockNew } from '../../service/goods'
import { chooseFile, uploadImage } from '../../service/upload'
import { throttle } from '../../utils/utils'
import { checkExParamLegal, checkCusReason } from '../ex'
import { DEBUG, intentTestBean } from '../exCons'

const config = require('../../src/config')
const cdn = config.cdn; //内容分发网络主机地址
const brand = config.brand; //当前品牌
var rawBean
const uploadPath = {
    moduleName: `/assets/wechat/${brand}/service/exchange/`
}
Page({

    detailBean: {},

    /**
     * 页面的初始数据
     */
    data: {
        // 判断是否是iphoneX
        isIphoneX: getApp().globalData.isIPhoneX,
        reasonStrList: ["尺码不符", "颜色不喜欢", "质量问题", "7天无理由退换货"],
        showExReasons: false,
        stableReasonList: [
            { value: '0', name: '7天无理由退换货', checked: 'true' },
            {
                value: '1', name: '尺码不符'
                // , checked: 'true'
            },
            { value: '2', name: '颜色不喜欢' },
            { value: '3', name: '质量问题' },
        ],
        currReasonStr: "请选择",
        isQualityIssues: false,
        showDetailLayout: false,
        colorIndex: -1,
        sizeIndex: -1,
        currChosenColorSizeStr: '请选择颜色尺码',
        picList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (DEBUG) {
            rawBean = intentTestBean
        } else {
            rawBean = JSON.parse(options.orderBean);
        }
        // let goodsOrderList = orderBean.goodsOrderList;
        // let goodsList = new Array();
        // goodsOrderList.forEach(ele => {
        //     ele.checked = true;
        //     if (Number(ele.refundCount) + Number(ele.exchangeCount) < Number(ele.goodsCount)) {
        //         goodsList.push(ele);
        //     }
        // });
        let itemBean = rawBean.goodsOrderList[0]
        itemBean.consignee = rawBean.consignee
        itemBean.contactTel = rawBean.contactTel
        itemBean.detailAddress = rawBean.detailAddress
        this.itemBean = itemBean
        wx.showLoading({
            title: `加载中...`
        });
        let goodsName = itemBean.goodsName;
        let goodsColorCode = itemBean.goodsColorCode;
        let gcsSku = itemBean.gcsSku;
        let spu = gcsSku.substring(0, 9);
        this.spu = spu
        // let stockNomal = exchangeWay == `exchangeExpress`;//exchangeAtShopOnlineChoose   exchangeExpress

        this.setData({
            itemBean: itemBean,
            noStockList: new Array(),
            colorList: [],
            sizeList: [],
            goodCount: 1,
            goodsName: goodsName,
            bigThumbUrl: `${cdn}/goodsImagePC/${brand}/${spu}/${goodsColorCode}/750750/${goodsColorCode}_T01.jpg`,
        });
        getDetail(spu)
            .then(res => {
                this.detailBean = res;
                this.setData({
                    colorList: res.color,
                    sizeList: res.color[0].sizes
                });
                return getStockNew(spu) // : getShopStock(postShop);
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // let booleanNone = this.data.itemBean.exorderlist == 0;
        // if (booleanNone) {
        //     wx.showModal({
        //         title: '提示',
        //         content: '该订单所有商品已经申请换货',
        //         showCancel: false,
        //         success: function (res) {
        //             wx.navigateBack({
        //                 delta: 1,
        //             });
        //         }
        //     });
        // }
    },


    onExReasonChange: function (ev) {
        console.log(ev.detail.value);
        this.setData({
            currReasonStr: this.data.stableReasonList[ev.detail.value].name,
            isQualityIssues: Number(ev.detail.value) == 3 ? true : false
        })
    },

    onReasonLayoutClick: function (ev) {
        console.log(Boolean(ev.currentTarget.dataset.visible))
        this.setData({ showExReasons: Boolean(ev.currentTarget.dataset.visible) })
    },


    onExchangeInShop: function (e) {
        if (this._checkExchangeReason() && throttle()) {
            let bean = this._generateTempPostBean();
            let tempPostBean = JSON.stringify(bean);
            let orderBean = JSON.stringify(this.data.orderBean);
            wx.navigateTo({
                url: `/exchangeGoods2/shopList/shopList?tempPostBean=${tempPostBean}&orderBean=${orderBean}`,
            });
        }
    },

    onExchangeInExpress: function (e) {
        if (this._checkExchangeReason() && throttle()) {
            let bean = this._generateTempPostBean();
            if (bean) {
                let tempPostBean = JSON.stringify(bean);
                const { goodsList, orderBean } = this.data;
                orderBean.goodsOrderList = goodsList.filter(item => item.checked);
                let orderBeanStr = JSON.stringify(orderBean);
                wx.navigateTo({
                    url: `/exchangeGoods2/goodsList/goodsList?tempPostBean=${tempPostBean}&orderBean=${orderBeanStr}&exchangeWay=exchangeExpress`,
                });
            }
        }
    },


    onFakeConfirmClick: function (ev) {
        if (checkExParamLegal(this.data.currReasonStr) && checkExParamLegal(this.data.currChosenColorSizeStr)) {
            if (!checkCusReason(this.customReason)) return
            let itemBean = JSON.stringify(this.itemBean)
            let tempPostBean = JSON.stringify(this._generateTempPostBean())
            let cartSingleBean = {
                goodsName: this.itemBean.goodsName,
                colorName: this.data.colorList[this.data.colorIndex].colorAlias,
                originalPrice: this.data.colorList[this.data.colorIndex].originalPrice,
                price: this.data.colorList[this.data.colorIndex].price,
                gcsSku: this.data.sizeList[this.data.sizeIndex].sku,
                sizeName: this.data.sizeList[this.data.sizeIndex].sizeAlias,
                goodsCount: 1,
                gscolPicPath: this.data.colorList[this.data.colorIndex].picurls[0],
            }
            cartSingleBean = JSON.stringify(cartSingleBean)

            let ppp = new Array()
            this.data.picList.forEach(item => {
                ppp.push(uploadImage(item, uploadPath))
            })
            let picPathList = new Array()
            Promise.all(ppp).then(responseList => {
                for (const item of responseList) {
                    if (item.data && item.data.length > 0) {
                        picPathList.push(item.data[0])
                    }
                }
                picPathList = JSON.stringify(picPathList)
            })
                .catch(e => {
                    console.log(e)
                })
                .finally(() => {
                    wx.navigateTo({
                        url: `/exchangeGoods2/fakeConfirmExchange/fakeConfirmExchange?&tempPostBean=${tempPostBean}&itemBean=${itemBean}&cartSingleBean=${cartSingleBean}&picPathList=${picPathList}`,
                    });
                })
        } else {
            wx.showModal({
                title: '提示',
                content: '请选择换货理由和换货商品',
                showCancel: false
            });
        }

    },


    onReasonInputChange: function (e) {
        this.customReason = e.detail.value
        console.log(this.customReason);
    },



    _generateTempPostBean: function () {
        let applySourceList = new Array();
        // let goodsList = this.data.goodsList;
        // let goodsList = this.data.goodsList;
        // goodsList.forEach(ele => {
        //     if (ele.checked) {
        //         // applySourceList.push({
        //         //     "sku": ele.gcsSku,
        //         //     "goodsOrderId": ele.goodsId,
        //         //     "goodsCount": ele.goodsCount,
        //         // });
        //         ele.sku = ele.gcsSku;
        //         applySourceList.push(ele);
        //     }
        // });
        applySourceList.push({
            "sku": this.itemBean.gcsSku,
            "goodsOrderId": this.itemBean.goodsId,
            "goodsCount": this.itemBean.goodsCount,
        })
        let bean = {
            "brandCode": getApp().config.brand,
            "channelId": 1,
            "oriorderCode": rawBean.bigorderCode,
            "exchangeReason": this.data.currReasonStr,
            "exchangeDescription": this.customReason,
            // "evidencePics": "",//todo:上传图片
            "mainPicPath": this.itemBean.gscolPicPath,
            "applySourceList": applySourceList
        }
        return bean
    },


    onNavToFQImg: function (e) {
        if (throttle()) {
            wx.navigateTo({
                url: '/exchangeGoods2/rewardPic/rewardPic',
            });
        }
    },




    onDetailLayoutClick: function (ev) {
        console.log(ev);
        let cIndex = this.data.colorIndex == -1 ? 0 : this.data.colorIndex
        let sIndex = this.data.sizeIndex == - 1 ? 0 : this.data.sizeIndex
        this.setData({
            showDetailLayout: Boolean(ev.currentTarget.dataset.visible),
            currChosenColorSizeStr: this.data.colorList[cIndex].colorAlias + this.data.sizeList[sIndex].sizeAlias,
            colorIndex: cIndex,
            sizeIndex: sIndex,
        })
    },

    onColorClick: function (e) {
        if (throttle()) {
            console.log(e);
            let colorIndex = e.currentTarget.id;
            let colorCode = this.data.colorList[colorIndex].colorCode;
            let sizeListNew = this.data.colorList[colorIndex].sizes;
            let mStockBean = this.data.goodsStockBean;
            let noStockListNew = new Array();
            sizeListNew.forEach(sizeBean => {
                console.log("\n outter ....  sizeBean.sku = " + sizeBean.sku);
                console.log(" inner >>>>>>>>>>>  mStockBean[sizeBean.sku] = " + mStockBean[sizeBean.sku]);
                if (mStockBean[sizeBean.sku]) {
                    mStockBean[sizeBean.sku] <= 0 ? noStockListNew.push(true) : noStockListNew.push(false);
                    console.log(" noStockListNew pushed 000");
                } else {
                    noStockListNew.push(true);
                    console.log(" noStockListNew pushed 111 \n");
                }
            });
            let spu = colorCode.substring(0, 9);
            let goodsColorCode = this.itemBean.goodsColorCode;
            let bigThumbUrl = `${cdn}/goodsImagePC/${brand}/${spu}/${goodsColorCode}/750750/${goodsColorCode}_T01.jpg`;
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
        wx.showToast({
            title: '只能换一件商品',
        });
        return
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
        return
        let goodCount = this.data.goodCount;
        if (goodCount <= 0) {
            return;
        };
        this.setData({
            goodCount: --goodCount,
        });
    },

    onUploadExPic: function () {
        if (this.data.picList.length == 3) {
            wx.showModal({
                title: '提示',
                content: '最多上传3张照片',
                showCancel: false,
            });
            return
        }
        let that = this
        let need = 3 - this.data.picList.length
        chooseFile(need)
            .then(tempFilePaths => {
                let newL = that.data.picList.concat(tempFilePaths)
                that.setData({ picList: newL })
            })
            .catch(e => {
                wx.showToast({
                    title: '提示',
                    image: `${e.message}`,
                });
            })
    },

    onPicDeleteClick: function (ev) {
        console.log(ev)
        let index = ev.currentTarget.id
        let list = this.data.picList
        list.splice(index, 1)
        console.log(list.length)
        this.setData({ picList: list })
    }

})


