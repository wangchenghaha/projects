//优惠券业务模块

import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'
import { judgeETOBrand,formatCRMDate } from '../utils/utils'
const brand = getApp().config.brand;
function getVoucherList(memberno) {
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL.GETVOUCHERLIST}?memberno=${memberno}`
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

function getJLVoucherList(_phone) {
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL.GETJLVOUCHERLIST}?phone=${_phone}`
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}
// 新的JL查询优惠券接口
function JLVoucherList(phone){
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL.JL_VOUCHER_LIST}`,
      method: 'post',
      header: {
        token: wx.getStorageSync(KEYSTORAGE.token),
        brand
      },
      data: {phone}
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}
// 过滤优惠券渠道
function  filterChannel(channelParam, channelType){
  let status = false;
  let channel = channelParam;
  if(channel.includes(';')){
	  channel = channel.split(';');
  }
  if(typeof channel === 'string'){
	  const channelFOL = {
		  'FOL-On': 'MiniApp', // 官网
		  'FOL-H5': 'H5', // H5
		  'FOL-Off': 'P', //门店
		  'FOL-Both': 'T' // 通用
	  };
	  channel = channelFOL[channel] || channel;
    if(channel === 'P' || // 门店
      channel === 'T' || // 通用
      channel === 'MiniApp' ||
      channel === 'FOL-On' ||
      channel === 'FOL-Off' ||
      channel === 'FOL-H5' ||
      channel === 'FOL-Both' ||
      channel === 'H5' ||
      channel === 'U'){
    	// 过滤指定的渠道
	    status = !(channelType && channel === channelType);
    }
  }else{
    if(channel.includes('P') || // 门店
      channel.includes('T') || // 通用
      channel.includes('MiniApp') ||
      channel.includes('H5') ||
      channel.includes('FOL-On') ||
      channel.includes('FOL-Off') ||
      channel.includes('FOL-H5') ||
      channel.includes('FOL-Both') ||
      channel.includes('U')){
      // 过滤指定的渠道
	    status = !(channelType && channel === channelType);
    }
  }
  return status
}
/**
 * 获取JL和所有品牌的优惠券
 * @param phone 手机号
 * @param type 是否时间限制
 * @param channelType 是否过滤门店
 * @param returnListFlag (0: 可用明细， 1:不返回明细，只返回total, 2: 返回所有)
 * @returns {Promise<unknown>}
 */
/**
 *
 * @param reqParam {phone, brandCode, channelType, type}
 * @returns {Promise<unknown>}
 */
function getVoucher(reqParam) {
  let requestConfig = {
    url: ''
  };
  const {phone, brandCode, channelType, type,  returnListFlag=2} = reqParam;
  if(getApp().config.isSaleForce){
    requestConfig = {
      url: URL.JL_VOUCHER_LIST,
      method: 'post',
      header: {
        brand: brandCode || brand,
        token: wx.getStorageSync(KEYSTORAGE.token)
      },
      data: {phone, returnListFlag}
    };
  }else {
    requestConfig.url = `${URL.GETVOUCHERLIST}?phone=${phone}`
    if(type && type === 'time'){
      requestConfig.url += '&type=time'
    }
  }
  return new Promise(((resolve, reject) => {
    request(requestConfig).then(res => {
      if(res.code === 0){
        if(getApp().config.isSaleForce){
          let voucherList = [];
          // 过滤渠道
          res.data.forEach(item => {
	          if(filterChannel(item.channel, channelType)){
		          voucherList.push(item)
	          }
          });
          resolve(voucherList)
        }else{
          resolve(res.data)
        }

      }else{
        reject(new Error(res.msg))
      }
      // res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}
// Get a list of processed coupons
function getProcessedCouponList(newProductPrice){
  let user_info = wx.getStorageSync('user_info');
  let phone = user_info.phone;
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getProcessedCouponList    phone =  "+phone)
  if (!phone) {
    return;
  }
  let couponNum = 0;
  let voucherList = new Array();

  return new Promise((resolve, reject) => {
    getVoucher(phone).then(res => {
      if(Array.isArray(res) && res.length > 0){
        if(getApp().config.useVoucher){
          res = res.filter(item => {
            return item.firsttype !== 'Third Party Voucher' && item.status === 'Not Used'
          })
        }
        res.forEach(item => {
          let voucherBrand = judgeETOBrand(item.brand);
          if(voucherBrand === brand){
            if(item.channel.includes('H5') || item.channel.includes('miniapp') || item.channel.includes('官网') || item.channel.includes('通用') || item.channel.includes('General') ) {
              // 门槛校验
              if(parseFloat(newProductPrice) >= parseFloat(item.threshold) || !Number(item.threshold)){
                couponNum ++;
                item.newStartTime = formatCRMDate(item.startdate, '.') + item.startdate.substr(10);
                item.newEndTime = formatCRMDate(item.enddate, '.') + item.startdate.substr(10);
                item.endTime = formatCRMDate(item.enddate).replace(new RegExp('-', 'g'), '');
                voucherList.push(item);
              }
            }
          }
        });
        // 优惠券排序，先按照优惠价格，价格相同按照过期时间排序
        voucherList.sort(compareCoupon('value', 'endTime'));
        resolve({couponNum:couponNum,voucherList:voucherList,});
      }else{
        reject(new Error('优惠券列表为空'));
      }
    })
    .catch(e=>{
      reject(new Error('查询优惠券失败'));
    });
  });

}

function compareCoupon(key1, key2) {
  return function (obj1, obj2) {
    let value1 = obj1[key1];
    let value2 = obj2[key1];
    if(value1 !== value2){
      return value2 - value1;
    }else {
      return  obj1[key2] - obj2[key2];
    }
  }
}

export {
  getVoucherList,
  getJLVoucherList,
  getVoucher,
  getProcessedCouponList,
  JLVoucherList
}