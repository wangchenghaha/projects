import { request } from '../../utils/request.js'
import { URL, KEYSTORAGE } from '../../src/const.js'
import {uploadFile} from "../../service/upload";

// 查询商品评价/买家秀列表
function getGoodsComment(_data) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.GETGOODSCOMMENT,
      data: _data,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

/**
 *
 * @param filePath
 * @param bigorderCode
 * @returns {Promise<unknown>}
 */
function goodsReviewUpload(filePath, bigorderCode) {
  return new Promise(((resolve, reject) => {
    wx.uploadFile({
      url: `${URL.GOODS_REVIEW_UPLOAD}?bigorderCode=${bigorderCode}`,
      filePath,
      name: 'image',
      header: {
        token: wx.getStorageSync('token'),
        'content-type': 'multipart/form-data',
        brand: getApp().config.brand,
      },
      success (res){
        if(res.statusCode === 200){
          const result = JSON.parse(res.data);
          if(result){
            result.code === 0 ? resolve(result.data) :  reject(new Error(result.msg));
          }else{
            reject(new Error('上传失败！'))
          }
        }else{
          reject(new Error(res.errMsg))
        }
      },
      fail(err){
        console.log(err,'err***')
      }
    })

  }))
}

/**
 *
 * @param data {
 *   bigorderCode	订单号	body	true	string
    buyerShowImgs	买家秀图片(最多六张,逗号隔开)	body	false	string
    goodsOrderId	订单商品id	body	true	integer(int64)
    headimgurl	用户头像	body	false	string
    isBuyerShow	是否买家秀: Y-是,N-否	body	false	string
    memberId	会员ID	body	true	integer(int64)
    nickname	用户昵称	body	false	string
    reviewContent	评价内容	body	false	string
    reviewType	评价类型: PUBLIC-公开,ANONYMOUS-匿名	body	false	string
    starRatings	评星(4项逗号隔开.格式:商品评价,描述相符,物流服务,服务态度)	body	false	string
 * }
 * @returns {Promise<unknown>}
 */
function goodsReviewCreate(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GOODS_REVIEW_CREATE,
      data,
      method:'post',
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err=>{
      reject(new Error(err.message))
    })
  })
}

function goodsReviewList(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GOODS_REVIEW_LIST,
      data,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  })
}
function goodsReviewDetail(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GOODS_REVIEW_DETAIL,
      data,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  })
}
function buyerShowZan(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GOODS_REVIEW_ZAN,
      data,
      method:'post',
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  })
}
// 评论数量
function goodsReviewCount(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GOODS_REVIEW_COUNT,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  })
}

export {
  getGoodsComment,
  goodsReviewUpload,
  goodsReviewCreate,
  goodsReviewList,
  goodsReviewDetail,
  buyerShowZan,
  goodsReviewCount
}