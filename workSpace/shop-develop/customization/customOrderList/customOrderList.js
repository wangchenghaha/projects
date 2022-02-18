import {perOrderList} from '../../service/order'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    isBottom: false,
    dingdanIsHidden: false,
    currentPage: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPreOrderList(this.data.currentPage)
  },

  getPreOrderList: function(curPage){
    let jsData = {
      currPage: curPage,
      pageSize: 10,
    }
    perOrderList(jsData).then(res=>{
      let orderList = this.data.orderList;
      if(orderList.length > 0){
        orderList = orderList.concat(res.records);
      } else {
        orderList = res.records;
      }
      let isBottom = this.data.isBottom;
	    isBottom = res.pages === this.data.currentPage;
      if(orderList.length > 0){
        this.setData({
          dingdanIsHidden: false,
          orderList,
          isBottom,
        })
      } else {
        this.setData({
          dingdanIsHidden: true,
          isBottom: false,
        })
      }
    })

  },

  refreOrderList: function(e){
    let orderList = this.data.orderList;
    console.log("orderList ============", orderList);
    orderList = orderList.filter(item=>{ // item.id   Number
      return item.deposit.id !== e.detail
    });
    console.log("orderList 11111============", orderList);
    orderList = orderList;
    this.setData({
      orderList,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("isBottom =====", this.data.isBottom)
    if(this.data.isBottom){
      return;
    }
    this.data.currentPage ++;
    this.getPreOrderList(this.data.currentPage);
  },

})