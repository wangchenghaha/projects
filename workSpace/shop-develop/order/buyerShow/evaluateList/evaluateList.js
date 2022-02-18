import {getGoodsComment} from '../../service/buyerShow'
import {wxShowToast} from '../../../utils/wxMethods'
import {buyerShowImage, splitImg} from '../../../utils/utils'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curPage: 1,
    goodsCode: '',
    evaluateList: '',
    replyIcon: splitImg('reply_icon.png','common'),
    agreeIcon: splitImg('agree_icon.png?v=1','common'),
    isBottom: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goodsCode: options.goodCode
    })
    this._getGoodsComment();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  _getGoodsComment: function(){
    let {goodsCode, curPage, evaluateList, isBottom} = this.data;
    let jsData = {
      goodsCode: goodsCode,
      currentPage: curPage,
    }
    getGoodsComment(jsData).then(res =>{
      if(curPage >= res.totalPage){
        isBottom = true;
      }
      for (let i = 0; i < res.list.length; i++) {
        res.list[i].headimgurl = res.list[i].headimgurl?res.list[i].headimgurl : splitImg('evaluate _default_icon.png','common')
        if(res.list[i].buyerShowImgs){
          res.list[i].evaluateImgs =  buyerShowImage(res.list[i].buyerShowImgs, true)
        }
      }
      if(evaluateList && evaluateList.list.length > 0){
        evaluateList.list = evaluateList.list.concat(res.list);
      } else {
        evaluateList = res;
      }

      this.setData({
        evaluateList,
        isBottom
      })
    }).catch(err=>{
      wxShowToast(err)
    })
  },

  
  onClick: function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../commentDetail/commentDetail?id='+ id
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let {curPage, isBottom} = this.data;
    if(isBottom){
      return;
    }
    curPage++;
    this.setData({
      curPage,
    })
    this._getGoodsComment();
  }
})