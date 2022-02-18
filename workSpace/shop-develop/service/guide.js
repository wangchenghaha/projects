//导购业务模块

import {request} from '../utils/request.js'
import {URL, KEYSTORAGE} from '../src/const.js'
import { signQuery } from '../utils/signer'
import {requestPermission} from './init.js';

// 获取导购二维码
function getGuideQR(DANO) {
  let url = URL.GETDAOGOUQRCODE;
  if(DANO.startsWith('FX')){
    url = URL.DISTRIBUTOR_QR
  }else{
    DANO = DANO.slice(4, 10);
  }
  return new Promise((resolve, reject) => {
    request({
      url,
      data: { DANO }
    })
      .then((response) => {
        if (response.code === 0) {
          let picUrl = response.data.url;
          resolve(picUrl);
        } else {
          reject(new Error(response.msg)); //视图层显示错误信息
        }
      })
      .catch((e) => {
        reject(new Error(e.msg || e.message)); //视图层显示错误信息
      });
  });
}
/**
 * 虚拟工号二维码
 * @param DA GET传参
 * @param data
 * @returns {Promise<unknown>}
 */
const fictitiousGuideQR = (DA, data) => {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.FICTITIOUS_GUIDE_QR}?DANO=${DA}`,
      data,
      method:'post'
    }).then((response) => {
      response.code === 0 ? resolve(response.data) : reject(new Error(response.msg));
    }).catch((e) => {
      reject(new Error(e.msg || e.message));
    });
  })
};

function getWShopList(pageSize, page) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GETWSHOPlIST,
      data: {
        pageSize: pageSize,
        page: page
      }
    })
      .then((response) => {
        if (response.code === 0) {
          let data = response.data;
          resolve(data);
        } else {
          reject(new Error(response.msg));
        }
      })
      .catch((e) => {
        reject(new Error(e.msg || e.message));
      });
  })
}

function sendTemplateMsg(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.SENDTEMPLATEMESSAGE,
      method: 'POST',
      data: data
    })
      .then((response) => {
        if (response.code === 0) {
	        resolve(response);
        } else {
          if(typeof response.msg === 'object'){
          	if(response.msg.errcode === 43004){
          		resolve(response)
	          }else {
		          reject(new Error('● 亲爱的导购，十分抱歉，您需要的内容无法成功发送。 请确认是否已关注微信公众号。\n● 若关注后仍无法成功获取，请及时反馈给微商城对接人，邮箱：lixinlei@bestseller.com.cn，并请优先使用“推荐搭配”等其它功能，感谢您的理解！\n'));
	          }
          }else{
            reject(new Error(response.msg));
          }

        }
      })
      .catch((e) => {
        reject(new Error(e.msg || e.message));
      });
  })
}

/*判断是否导购*/
function getGuideInfoByOpenId(openid) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GETGUIDEINFOBYOPENID,
      data: {
        miniOpenId: openid
      }
    })
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(new Error(e.msg || e.message)); //视图层显示错误信息
      });
  })
}
// 判断是否导购
function isGuide(openid) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.ISGUIDE}?miniOpenId=${openid}`,
    }).then(res => {
      resolve(res)
    }).catch(e=>{
      reject(new Error(e.msg || e.message))
    })
  })
}

/*创建模板*/
function shareGoods(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.SHAREGOODS,
      data: data,
      method: 'post'
    }).then((response) => {
      response.code === 0 ? resolve(response.data): reject(new Error(response.msg))
    }).catch((e) => {
      reject(new Error(e.msg || e.message)); //视图层显示错误信息
    });
  })
}
// 删除
function deleteTemp(id) {
  return new Promise((resolve, reject) => {
    const url = URL.SHARE_GOODS_REMOVE;
    let method = 'get';
    /*if(url.includes('/remove')){
      method = 'put'
    }*/
    request({
      url,
      data: {id},
      method,
    }).then((response) => {
      response.code === 0 ? resolve(response.data): reject(new Error(response.msg))
    }).catch((e) => {
      reject(new Error(e.msg || e.message)); //视图层显示错误信息
    });
  })
}

/*生成小程序码*/
function getWxaCodeUnpubAddrQR(data) {
  const {WE_MALL_CDN} = getApp().config;
  return new Promise((resolve, reject) => {
    request({
      url: URL.GETWXACODEUNPUBADDRQR,
      data: data,
      method: 'post'
    }).then(res => {
      if(res.code === 0 && res.data){
        resolve(WE_MALL_CDN + res.data)
      }else{
        reject(new Error(res.msg))
      }
      // res.code === 0 ? resolve(res) : reject(new Error(res.msg));
    }).catch((e) => {
      reject(new Error(e.msg || e.message)); //视图层显示错误信息
    });
  })
}

// 生成合并图片
function getCompoundImg(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GETCOMPOUNDIMG,
      data: data,
      method: 'post'
    }).then(res => {
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e) => {
      reject(new Error(e.msg || e.message)); //视图层显示错误信息
    });
  })
}
function getCompoundImgNew(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.SHARE_QR_IMG,
      data: data,
      method: 'post'
    }).then(res => {
      if(res.code === 0){
        resolve(res.data)
      }else{
        resolve(getCompoundImg(data))
      }
      // res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch((e) => {
      reject(new Error(e.msg || e.message)); //视图层显示错误信息
    });
  })
}

/**
 * 获取分享详情
 * @param id {id, createBy}
 * @returns {Promise<unknown>}
 */
function getShareDetail(id) {
  const url = URL.GETSHAREDETAIL;
  /*if(url.includes('wxSharePage')){
    data = {sharePageId: id}
  }*/
  let data = {id};
  if(id){
    if(id.startsWith('DA') || id.startsWith('FX')){
      data = {createBy: id}
    }
  }
  return new Promise((resolve, reject) => {
    request({
      url,
      data,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e) => {
      reject(new Error(e.msg || e.message));
    });
  })
}
// 更新
function shareUpdate(data) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.SHAREUPDATE}`,
      data: data,
      method: 'put',
    }).then(res=>{
      resolve(res.data)
    }).catch((e) => {
      reject(new Error(e.msg || e.message));
    });
  })
}
// 复制链接
function copyShareUrl(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.SHARE,
      method: 'post',
      data: data
    }).then(res=>{
      resolve(res.data)
    }).catch((e) => {
      reject(new Error(e.msg || e.message));
    });
  })
}
// 导购登录
function loginBind(data) {
  return new Promise((resolve, reject) => {
    request({
      url:URL.LOGINBIND,
      data: data,
      method: 'post'
    }).then( res =>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch(e=>{
      reject(new Error(e.msg || e.message))
    })
  })
}
//  导购绑定openid
function guideBindOpenid(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GUIDEBINDOPENID,
      data: data,
    }).then( res =>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch( e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
//  导购销售业绩
function saleState(employeeId) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.SALESTATE}?shareBy=${employeeId}`,
    }).then(res => {
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch( e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
//  导购分享业绩
function shareState(employeeId) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.SHARESTATE}?shareBy=${employeeId}`,
    }).then(res => {
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch( e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 运营DA账号
function getBrandConfig() {
  return new Promise((resolve, reject) => {
    request({
      url: URL.BRANDCONFIG
    }).then( res =>{
      resolve(res)
    }).catch( e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 绑定导购
function bindGuide(unionid,guideID,nickname,openid) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.BINDGUIDE}?unionid=${unionid}&openid=${openid}`,
      data:{
        shopGuideId: guideID,
        nickname:nickname
      },
      method:'post'
    }).then(res => {
      res.code === 0 ? resolve(res.msg): reject(new Error(res.msg))
    }).catch( e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 获取导购信息
function getGuideInfo(guideId) {
  return new Promise((resolve, reject) => {
    let querystring = signQuery({ guideId:guideId });
    request({
      url:`${URL.GETGUIDEINFO}?${querystring}`
    }).then(res => {
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch( e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

// 获取分享列表
function getShareGoodsList(data) {
  return new Promise( (resolve, reject) => {
    request({
      url: URL.SHAREGOODSLIST,
      data:data,
    }).then(res => {
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch( e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 获取分享JSON
function getShareJSON(fileName) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.GETSHAREJSON}${fileName}.json`
    }).then(res=>{
      resolve(res)
    }).catch(e=>{
      reject(new Error(e.msg || e.message))
    })
  })
}
// 查询导购是否有openID
function queryGuideWxOpenId(guideId) {
  return new Promise( (resolve, reject) => {
    request({
      url: `${URL.QUERYGUIDEWXOPENID}?shopGuideId=${guideId}`,
    }).then(res => {
      resolve(res);
    }).catch( e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
//获取导购DA信息
function getDAInfo(data) {
  return new Promise( (resolve, reject) => {
    request({
      url: `${URL.GETDAINFO}?DANO=${data}`,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch( e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 听他们说模块
function listenToThem() {
  return new Promise((resolve, reject) => {
    request({
      url: URL.LISTENTOTHEM,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch( e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 导购社区
function guideStudy() {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GUIDE_STUDY,
    }).then(res => {
      resolve(res);
    }).catch( e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 导购排行榜
function getRanking() {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GET_RANKING,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch( e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 导购排行榜
function getAutoRanking() {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GET_RANKING_AUTO,
    }).then(res => {
      resolve(res);
    }).catch( e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 导购发券
function couponImg(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.COUPONIMG,
      method: 'POST',
      data: data
    }).then(res => {
      (res.code === 0 || res.code === '0') ? resolve(res.image_url) : reject(res.msg);
    }).catch( e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
export {
  getGuideQR,
  getWShopList,
  sendTemplateMsg,
  getGuideInfoByOpenId,
  shareGoods,
  getWxaCodeUnpubAddrQR,
  getCompoundImg,
  getShareDetail,
  shareUpdate,
  copyShareUrl,
  isGuide,
  loginBind,
  guideBindOpenid,
  saleState,
  shareState,
  getBrandConfig,
  bindGuide,
  getGuideInfo,
  getShareGoodsList,
  getShareJSON,
  queryGuideWxOpenId,
  getDAInfo,
  listenToThem,
  getRanking,
  couponImg,
  getAutoRanking,
  guideStudy,
  deleteTemp,
  fictitiousGuideQR,
  getCompoundImgNew
}
