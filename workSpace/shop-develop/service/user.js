//微信用户信息业务模块
import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'
import {getUserinfo} from "../base/url";
import {useWXPhone} from '../src/config'
//微信小程序登录
function wxLogin(isEnterprise) {
	const wxWork = wx.getStorageSync(KEYSTORAGE.wxWork);
	return new Promise((resolve, reject) => {
		if(wxWork && isEnterprise){
			wx.qy.login({
				success: function (res) {
					resolve(res.code) //往wxInfo里追加一个code
				}
			})
		}else{
			wx.login({
				success: function (res) {
					resolve(res.code) //往wxInfo里追加一个code
				}
			})
		}


	})
}
// 微信getUserInfo
function wxGetUserInfo() {
  return new Promise(resolve => {
    wx.getUserInfo({
      success: res => resolve(res)
    })
  })
}
function wxGetUserProfile(desc) {
  return new Promise(((resolve, reject) => {
    wx.getUserProfile({
      desc: '获取您的头像、昵称等',
      success: res => resolve(res.userInfo)
    })
  }))
}

//微信小程序拉起授权页并获取信息
function wxInfo(code, isEnterprise) {
  return new Promise((resolve, reject) => {
    let userInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    if(isEnterprise){
      console.log('企业微信');
      wx.qy.getEnterpriseUserInfo({
        success: function(res) {
          console.log('getEnterpriseUserInfo=>>>',res)
        },
        fail: function (res) {
          console.log('企业微信登录失败')
        }
      });
    }else{
      if(userInfo){
        resolve(Object.assign(userInfo, {
          code: code ,
          //注意下面两个字段只有企业微信登录才有
          encryptedData: wx.getStorageSync('encryptedData') || '',
          iv: wx.getStorageSync('iv') || ''
        }));
      }else{
        wx.setStorageSync(KEYSTORAGE.authed, false);
        reject(new Error('授权失败'))
      }
    }

    /*wx.getUserInfo({
      // withCredentials: false,
      success: (res) => {
        ////同意授权 ////{"nickName":"null","gender":1,"language":"zh_CN","city":"","province":"Beijing","country":"China","avatarUrl":""}
        let userInfo = res.userInfo;
        wx.setStorageSync(KEYSTORAGE.wxInfo, userInfo); //保存微信个人信息
        resolve(Object.assign(userInfo, {
          code: code ,
          //注意下面两个字段只有企业微信登录才有
          encryptedData: res.encryptedData || '',
          iv: res.iv || ''
        }));
      },
      fail: (err) => {
        //拒绝授权
        wx.setStorageSync(KEYSTORAGE.authed, false);
        reject(new Error('授权失败'))
      },
    })*/
  });

}

//自己平台登录
function login(nickname, js_code,encryptedData, iv) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.LOGIN_MINI,
      method: 'POST',
      data: JSON.stringify({
        js_code: js_code, //临时code
        nickname: nickname, //拉去到的微信用户昵称
        grant_type: 'authorization_code', //固定值
        encryptedData: encryptedData,
        iv:iv,
      }),
    })
    .then((response) => {
      if (response.code === 0) {
        console.log('用户登录',response);
        resolve(response.data); //视图层需要的参数
      } else {
        wx.hideLoading();
        resolve(response.msg); //视图层需要的参数
        // reject(new Error(response.msg)); //视图层显示错误信息
      }
    })
    .catch((e) => {
      reject(new Error(e.msg || e.message)); //视图层显示错误信息
    });
  });
}

//企业微信登录
function loginByEnterprise(encryptedData, iv, code) {
  return new Promise((resolve, reject) => {

    request({
      url: URL.LOGIN_ENTERPRISE,
      method: 'POST',
      data: JSON.stringify({
        js_code: code,
        encryptedData: encryptedData,
        iv: iv
      }),
    })
    .then((response) => {
      if (response.code === 0) {

        var resulet = response.data;
        var userInfo = {
          employeeId: resulet.userid,
          name: resulet.nickName,
          nickName: resulet.nickName,
          phone: resulet.phone,
          portraitPic: resulet.data.avatar,
          position: resulet.positionName,
          brandCode: wx.getStorageSync(KEYSTORAGE.brand),
          shopName: "绫致时装IT",
          openId: resulet.openId,
          unionId: resulet.unionId,
          shopCode: resulet.zzDpdm || '0000'
        }
        resolve(userInfo) //视图层需要的参数
      } else {
        reject(new Error(response.msg)); //视图层显示错误信息
      }
    })
    .catch((e) => {
      reject(new Error(e.msg || e.message)); //视图层显示错误信息
    });
  });
}
function redisMiniInfo(wxInfo) {
  return new Promise((resolve, reject) => {
    request({
      method:'post',
      url: URL.REDISMINIINFO,
      data: {wxInfo:wxInfo}
    }).then( res => {
      resolve(res)
    }).catch(e=>{reject(new Error(e.msg || e.message))})
  })
}
/*
*
* 获取CRM信息
* data = {
*   unionid: '',
*   brand: ''
* }
*
* */
function getCRMInfo(data) {
  return new Promise((resolve, reject) => {
    request({
      url: getUserinfo,
      data: data,
    }).then(res=>{
      res.errcode === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
// 解密微信小程序
function getWeChatInfo(data) {
  return new Promise((resolve, reject) => {
    request({
      method: 'post',
      url: URL.GETWECHATINFO,
      data: data
    }).then(res=>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
// 通过wx.login()获取code换取unionId
function unionIdByCode(js_code) {
  return new Promise((resolve, reject) => {
    request({
      method: 'post',
      url: URL.GET_UNION_ID_BY_CODE,
      data: {js_code}
    }).then(res=>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
// 获取lzInfo
function getLzInfo(data) {
  return new Promise((resolve, reject) => {
    request({
      method: 'post',
      url: useWXPhone ? URL.QUERY_USER : URL.GETLZINFO,
      data: data
    }).then(res=>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
function isMember(brand,config_name,channel_type) {
  const data = {
    brand:brand,
    unionid: wx.getStorageSync(KEYSTORAGE.unionid),
    config_name : config_name || '',
    channel_type : channel_type || '',
    channel_tag: 'WeChat_WeMall',
    channel_token: 'NWU4ZTLKZTAYYZU0YG',
    campaign: '',
    medium: '',
    source: '',
    term: '',
    storeId: '',
    guideId: ''
  };
  // 视频号相关场景值
  const wxVideoScene = {
    '1175': '视频号主页商店入口',
    '1177': '视频号直播商品',
    '1191': '视频号活动',
    '1195': '视频号主页商品入口'
  };
  const wxScene = wx.getStorageSync(KEYSTORAGE.wxScene);
  if(wxScene && wxVideoScene[wxScene]){
    data.subchannel = `${wxScene}-${wxVideoScene[wxScene]}`
  }
  let daogouLists = wx.getStorageSync('daogouLists');
  if(daogouLists && daogouLists.length){
    let utmObj = {};
    daogouLists.forEach(item =>  utmObj[item.key] = item.value );
    for(let key in utmObj){
      if(key && key.startsWith('utm')){
        const dataKey = key.toLowerCase().substr(3);
        if(data.hasOwnProperty(dataKey)){
          Object.assign(data, {[dataKey]: utmObj[key]})
        }
      }
    }
  }
  let shareFrom = wx.getStorageSync('shareFromDaogouInfo');
  if(shareFrom){
    let {share_by = '', share_by_shop = ''} = shareFrom;
    Object.assign(data, {
      storeId: share_by_shop,
      guideId: share_by
    })
  }

  return new Promise((resolve, reject) => {
    request({
      url: URL.MINIISMEMBER,
      data
    }).then(res => {
      res.errcode === 0 ? resolve(res): reject(new Error(res.errmsg))
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
function getUserService() {
  return new Promise((resolve, reject) => {
    request({
      url: URL.USER_SERVICE,
    }).then(res => {
      resolve(res)
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
// 小程序获取用户card_id，card_code
function getCardCode(brand) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GET_CARD_CODE,
      data:{
        brand:brand,
        unionid: wx.getStorageSync(KEYSTORAGE.unionid)
      }
    }).then(res => {
      res.errcode === 0 ? resolve(res):''
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
// 手机号查询并注册会员
function getGameInfo(data) {
  return new Promise((resolve, reject) => {
    request({
      method: 'post',
      url: URL.GAMEQUERYANDREGIST,
      data: data
    }).then(res=>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
export {
  wxInfo,
  wxLogin,
  wxGetUserInfo,
  login,
  loginByEnterprise,
  redisMiniInfo,
  getCRMInfo,
  getWeChatInfo,
  getLzInfo,
  isMember,
  getUserService,
  getCardCode,
  getGameInfo,
  unionIdByCode,
  wxGetUserProfile
}
