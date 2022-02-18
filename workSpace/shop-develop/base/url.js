//var aimsUlr = "http://10.10.89.21:3000"; //目标服务器地址
var url = {
	"local":{
		"api":"https://bestseller-wechat-test.woaap.com",
		"ws":"https://bestseller-wechat-test.woaap.com"
	},
	"proxy":{
	    "api":"http://atest.woaap.com:11063",
	    "ws":"ws://bestseller-wechat.woaap.com"
	}
}
var getdata = url["proxy"].api
var wsurl = url["proxy"].ws

module.exports = {

	"wxlogin": getdata+ "/api/member/weapp-login", //用户登录
  'memberIsMember':getdata+'/api/member/mini-is-member', //判断是否会员
  'getCard':getdata+'/api/member/mini-get-jsconfig', //获取新开卡参数
  'decryptCode':getdata+'/api/coupon/mini-decrypt-code', //会员卡code解码
  'getUserinfo':getdata+'/api/member/mini-get-userinfo', //获取用户信息
  'getCardInfo':getdata+'/api/member/get-card-code', //获取会员卡id和code
  'getStoreList':getdata+'/api/mini-store/get-nearest-store', //获取门店列表
  'getCouponList':getdata+'/member/all-coupon', //获取优惠券列表  
  'setUserinfo':getdata+'/api/member/mini-set-userinfo', //设置用户信息
  'getCouponStatus':getdata+'/api/coupon/status', //获取优惠券状态  
  'getCoupon':getdata+'/api/mini-member/rewards', //会员专享领取优惠券
  'setChannel': getdata+ '/api/channel/mini-channel', // 上报入会渠道 add
}