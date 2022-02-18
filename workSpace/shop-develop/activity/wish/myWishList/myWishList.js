import { splitImg, skuToImg, jiafa, orderStatus } from '../../../utils/utils'
import { URL_CDN, KEYSTORAGE } from '../../../src/const'
import { wishGoodsList, generateWish, wishOrder } from "../../service/wish";
import { wxShowToast } from '../../../utils/wxMethods'
import { getAddress } from "../../../service/member";
const app = getApp();
const { cdn, brand, wishMsg = [] } = app.config;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerImg: splitImg('banner@2x.png?v=1103'),
    noReceive: splitImg('no_receive.png'),
    noGoodsImg: splitImg('no-goods@2x.png?v=1'),
    userImg: "",
    userPic: '',
    navi: [{
      name: '我喜欢的',
      selected: true
    },
    {
      name: '我收到的',
      selected: false
    }],

    recevieList: [],
    isLike: true,
    fixedBottom: [
      {
        event: 'more',
        bgColor: '#fff',
        color: '#000',
        name: '添加心愿',
      },
      {
        event: 'show',
        bgColor: '#000',
        color: '#fff',
        name: '生成心愿单',
      }
    ],
    isCreateWish: false,
    details: wishMsg.length ? wishMsg[0] : '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    this.setData({
      userName: wxInfo.nickName, //昵称
      userImg: wxInfo.avatarUrl, // 头像
    })
    this.getWishGoodsList();
    // this.getWishOrder();
  },

  inputMsg(e) {
    this.setData({ details: e.detail.value });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this._getAddress();
  },

  onClick: function (e) {
    let type = e.currentTarget.dataset.type;
    let selected = e.currentTarget.dataset.selected;
    let { navi, fixedBottom, recevieList } = this.data
    switch (type) {
      case 'navi':
        if (selected) {
          return;
        }
        for (let i = 0; i < navi.length; i++) {
          navi[i].selected = !navi[i].selected;
        }
        if (navi[1].selected) {
          recevieList = [];
          this.getWishOrder();
        }
        fixedBottom[1].event = 'show'
        fixedBottom[1].name = '生成心愿单'
        this.setData({
          navi,
          isLike: navi[0].selected,
          fixedBottom,
          isCreateWish: false
        })
        break;
      case 'show':
        const { goodsList } = this.data;
        const selectGoods = goodsList.filter(item => item.myChecked);
        if (selectGoods.length === 0) {
          wxShowToast('请选择商品！');
          return
        }
        fixedBottom[1].event = 'create'
        fixedBottom[1].name = '请Ta来买单'
        this.setData({
          fixedBottom,
          isCreateWish: true
        })
        break;
      case 'create':
        fixedBottom[1].event = 'show'
        fixedBottom[1].name = '生成心愿单'
        this.setData({
          fixedBottom,
          isCreateWish: false
        })
        this.createWish();
        break;
      case 'more':
        app.goBack();
        break
    }
  },

  // 获取心愿单商品列表
  getWishGoodsList() {
    wishGoodsList(brand).then(res => {
      if (res) {
        const { skuList = [] } = res;
        if (Array.isArray(skuList) && skuList.length) {
          skuList.forEach(item => {
            const param = {
              size: URL_CDN.IMGSIZE240400,
              sku: item.gcsSku
            };
            item.goodsImg = cdn + skuToImg(param)
          });
          console.log("goodsList====", skuList);
          this.setData({ goodsList: skuList })
        }
      }
    }).catch(err => wxShowToast(err.message))
  },

  createWish() {
    const { goodsList, address, details } = this.data;
    if (goodsList.length === 0) {
      return;
    }
    const selectGoods = goodsList.filter(item => item.myChecked);
    if (selectGoods.length === 0) {
      wxShowToast('请选择商品！');
      return
    }
    const { phone, userName, province, city, area, detailAddress } = address;
    if (!phone || !userName || !province || !city || !area || !detailAddress) {
      wxShowToast('请选择地址！');
      return;
    }
    const { nickName, avatarUrl, unionId, openId } = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let totalPrice = 0, goodsTotalCount = 0;
    selectGoods.forEach(item => {
      totalPrice += jiafa(totalPrice, item.discountPrice || 0);
      goodsTotalCount += 1;
      delete item.goodsImg
    });
    const param = {
      brand,
      unionId,
      openId,
      nickName,
      faceImg: avatarUrl,
      province,
      city,
      district: area,
      consignee: userName,
      detailAddress,
      phone,
      msg: details || '悄悄告诉你，这是我七夕最想要的礼物',
      totalPrice,
      goodsTotalCount,
      skuList: selectGoods,
    };
    generateWish(param).then(res => {
      if (res && res.xinyuandanId) {
        wx.navigateTo({
          url: `../list/list?id=${res.xinyuandanId}`
        })
      }
    }).catch(err => wxShowToast(err.message))
  },

  //js
  bindTextAreaBlur: function (e) {
    this.setData({
      details: e.detail.value
    });
  },
  changeMsg() {
    let { details } = this.data;
    const curMsgIndex = wishMsg.findIndex(item => item === details);
    if (curMsgIndex === -1 || curMsgIndex === wishMsg.length - 1) {
      details = wishMsg[0]
    } else {
      details = wishMsg[curMsgIndex + 1]
    }
    this.setData({ details })
  },
  changeCheck(e) {
    const index = e.detail;
    console.log("index====", index)
    const { goodsList } = this.data;
    goodsList[index].myChecked = !goodsList[index].myChecked;
    this.setData({ goodsList })
  },

  emptyGoods(e) {
    if (e.detail) {
      this.setData({ goodsList: [] })
    }
  },

  _getAddress() {
    let localAddress = wx.getStorageSync('dingdanAddress');
    if (localAddress && localAddress.phone) {
      if (localAddress.city.includes('行政')) {
        localAddress.city = localAddress.area;
        wx.setStorageSync('dingdanAddress', localAddress);
      }
      if (localAddress.city === '县' || localAddress.province === '重庆市') {
        localAddress.city = localAddress.province;
        wx.setStorageSync('dingdanAddress', localAddress);
      }
      this.handleAddress(localAddress);
      return;
    }
    getAddress().then(res => {
      if (res.length) {
        let addressObj = {}, num = 0;
        res.forEach(item => {
          item.defaultAddress === 'Y' ? addressObj = item : num++;
        });
        res.length === num ? addressObj = res[0] : '';
        wx.setStorageSync('dingdanAddress', addressObj);
        this.handleAddress(addressObj)
      }
    });
  },
  handleAddress(addressObj) {
    this.setData({ address: addressObj });
  },

  getWishOrder: function () {
    wishOrder(brand).then(res => {
      if (res) {
        res.forEach(item => {
          const param = {
            size: URL_CDN.IMGSIZE240400,
            sku: item.gcsSku
          };
          item.goodsImg = cdn + skuToImg(param)
          item.status = orderStatus(item.status)
        });
        console.log("recevieList====", res);
        this.setData({ recevieList: res })
      }
    })
  },

  selectAddress() {
    wx.navigateTo({
      url: '/pages/address/address'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})