//小程序业务模块
import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'
import { brand } from '../config/brand'
const config = require('../src/config');


function getCustomizationJson(){
  return new Promise((resolve, reject)=>{
    request({ url:URL.CUSTOMIZATIONJSON}).then(res=>{
      resolve(res.data)
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}

function getCustomizationRule(){
  return new Promise((resolve, reject)=>{
    request({ url:URL.CUSTOMIZATIONRULE}).then(res=>{
      resolve(res)
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}


function getCustomizationClassify(_data){
  return new Promise(((resolve, reject) => {
    request({
      url: URL.CUSTOMIZATIONCLASSIFY,
      data: _data,
      method: 'POST',
    }).then(res => {
      res.code === "0" ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

function customizationOrderSave(_data){
  return new Promise(((resolve, reject) => {
    request({
      url: URL.CREATE_GOODS_ORDER,
      data: _data,
      method: 'POST',
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}
function getDetail(_data){
  return new Promise(((resolve, reject) => {
    request({
      url: URL.CUSTOMIZATIONDETAIL,
      data: _data,
      method: 'POST',
    }).then(res => {
      res.code === "0" ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}
function getIMGList(_data){
  return new Promise(((resolve, reject) => {
    request({
      url: URL.CUSTOMIZATIONIMGLIST,
      data: _data,
      method: 'POST',
    }).then(res => {
      res.code === "0" ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

function getCompound(_data){
  return new Promise(((resolve, reject) => {
    request({
      url: URL.CUSTOMIZTIONPIC,
      data: _data,
      method: 'POST',
    }).then(res => {
      res.code === "0" ? resolve(res.image_url) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}
function textToImg(_data){
  return new Promise(((resolve, reject) => {
    request({
      url: URL.CUSTOMIZATIONTEXTTOIMAGE,
      data: _data,
      method: 'POST',
    }).then(res => {
      res.code === "0" ? resolve(res.image_url) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

function getCustomizationlimitJson(){
  return new Promise((resolve, reject)=>{
    request({ url:URL.CUSTOMIZATIONLIMITJSON}).then(res=>{
      resolve(res.data)
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}

export {
    getCustomizationJson,
    getCustomizationClassify,
    customizationOrderSave,
    getDetail,
    getIMGList,
    getCustomizationRule,
    getCompound,
    textToImg,
    getCustomizationlimitJson
}