
const config = require('../../src/config.js');

const cdn = config.cdn //cdn
const domain = config.domain //后台接口主机地址
const brand = config.brand

import { request } from '../../utils/request.js'
import { getStockNew } from '../../service/goods'
import { getAddress} from '../../service/member'
import {newOrderSave} from "../../service/order";
// 拼团列表Api
const shoppingListApi = `${domain}/rest/pintuan/list`
// 详情页拼团数据
const detailPintuanApi = `${domain}/rest/pintuan/detail?`

// 去拼单
const getGoPindanApi = `${domain}/rest/bigOrder/onGoingPinTuanList?`

// 获取团所有参与人
const getFaceAndIconApi = `${domain}/rest/bigOrder/getPintuanOrderLists?`
// 合图接口
const getPicGenApi = `${domain}/api/pintuan/sharePicGen`

// 获取商品详情页拼团数据
function PTGetGoodsDetailPinTuan(goodCode_9){
  wx.showLoading({
    title: 'Loading...', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve,reject)=>{
    request({
      url:`${detailPintuanApi}goodsCode=${goodCode_9}`
    }).then(res=>{
      wx.hideLoading();
      res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
      if(res.code != 0){
        wx.showToast({
          title: res.msg,
          icon: "none",
        })
      }
    }).catch(e=>{
      wx.hideLoading();
      let a = e.message?e.message:e.msg
      wx.showToast({
        title: a,
        icon: "none",
      })
      reject(new Error(a))
    })
  })
}
// 获取去拼单数据
function PTGetGoPindan(sku_9){
  wx.showLoading({
    title: 'Loading...', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve,reject)=>{
    request({
      url:`${getGoPindanApi}sku=${sku_9}`
    }).then(res=>{
      wx.hideLoading();
      if (res.code == 0){


        let arrs = res.data.filter(item => {
          return item.pintuanOrderType == '0' && new Date(item.paymentTime.replace(/-/g,'/')).getTime() + (24 * 60 * 60 * 1000) > new Date().getTime()
        })

        if (arrs.length > 5){
          // 随机返回5条
          getSuiji(arrs,resolve)
        }
        else{
          if (arrs.length > 0){
            resolve(arrs)
          }
        }

      }
      else{
        wx.showToast({
          title: res.msg,
          icon: "none",
        })
      }
    }).catch(e=>{
      wx.hideLoading();
      let a = e.message?e.message:e.msg
      wx.showToast({
        title: a,
        icon: "none",
      })
      reject(new Error(a))
    })
  })
}
// 随机不重复5个
function getSuiji(arrs,resolve){

  let a = []
  for (let i=0;i<5;i++){
      a.push(Math.floor(Math.random() * arrs.length + 0))
  }

  let isRepeat = false
  let aa = a.sort()
  for (let i=0;i<aa.length;i++){
    if (aa[i] === aa[i+1]){
      // 重复
      console.log(`重复了:${aa}`)
      isRepeat = true
    }
  }
  if (isRepeat){
    getSuiji(arrs,resolve)
  }
  else{
    // 没有重复的
    console.log(`没有重复的:${a}`)
    let resultArrs = []
    for (let i=0;i<a.length;i++){
      resultArrs.push(arrs[a[i]])
    }
    resolve(resultArrs)
  }
}
// 获取列表数据
function PTShoppingListData(){
  wx.showLoading({
    title: 'Loading...', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve, reject)=>{
    request({ 
      url: shoppingListApi,

    }).then(res=>{
      wx.hideLoading();
      res.code == 0 ? resolve(res.data) : reject(new Error(res.msg));
      if(res.code != 0){
        wx.showToast({
          title: res.msg,
          icon: "none",
        })
      }
    }).catch((e)=>{
      wx.hideLoading();
      let a = e.message?e.message:e.msg
      wx.showToast({
        title: a,
        icon: "none",
      })
      reject(new Error(a))
    })
  })
}
// 获取库存
function PTGetKucun(params){
  wx.showLoading({
    title: 'Loading...', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve, reject)=>{
    getStockNew(params, '').then(res => {
      wx.hideLoading();
      resolve(res)
    }).catch(err => {
      wx.hideLoading();
      reject(err)
    })
  })
}
  // 保存拼团订单
function PTOrderSave(params){
  wx.showLoading({
    title: 'Loading...', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve,reject)=>{
    newOrderSave(params).then(res => {
      wx.hideLoading();
      resolve(res)
    }).catch(a => {

      wx.hideLoading();
      wx.showToast({
        title: a,
        icon: "none",
      })
      reject(new Error(a))
    })
  })
}
// 获取地址
function PTGetAddress(){
  wx.showLoading({
    title: 'Loading...', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });

  return new Promise((resolve,reject)=>{
    getAddress().then(res => {
      wx.hideLoading();
      resolve(res)
    }).catch((a)=>{
      wx.hideLoading();
      wx.showToast({
        title: a,
        icon: "none",
      })
      reject(new Error(a))
    })
  })

}
// 获取团所有的参与人
function PTGetFaceAndIcon(bigorderCode){
  wx.showLoading({
    title: 'Loading...', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve,reject)=>{
    request({
      url: `${getFaceAndIconApi}pintuanOrderPerson=${bigorderCode}`
    }).then(res=>{
      wx.hideLoading();
      if(res.code == 0){
        let arrs = []
        res.data.forEach(es => {
          
          if (es.status == 'WaitingShipment'){
            arrs.push(es)
          }

        });
        resolve(arrs)
      }
      else{
        reject(new Error(res.msg))
      }
      if(res.code != 0){
        wx.showToast({
          title: res.msg,
          icon: "none",
        })
      }
    }).catch(e=>{
      wx.hideLoading();
      let a = e.message?e.message:e.msg
      wx.showToast({
        title: a,
        icon: "none",
      })
      reject(new Error(a))
    })
  })
}

// 合图数据
function PTGetPicGen(dJson){
  wx.showLoading({
    title: 'Loading...', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve,reject)=>{
    request({
      url: `${getPicGenApi}`,
      method: 'POST',
      data: dJson
    }).then(res=>{
      wx.hideLoading();
      res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
      if(res.code != 0){
        wx.showToast({
          title: res.msg,
          icon: "none",
        })
      }
    }).catch(e=>{
      wx.hideLoading();
      let a = e.message?e.message:e.msg
      wx.showToast({
        title: a,
        icon: "none",
      })
      reject(new Error(a))
    })
  })
}
export{
  PTGetGoodsDetailPinTuan,
  PTShoppingListData,
  PTOrderSave,
  PTGetKucun,
  PTGetAddress,

  PTGetFaceAndIcon,
  PTGetPicGen,
  PTGetGoPindan
}