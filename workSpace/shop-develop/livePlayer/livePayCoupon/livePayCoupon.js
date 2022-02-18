// livePlayer/livePayCoupon/livePayCoupon.js
const ERR_GET_LIVE_INFO_SYS_ERR = 16001, //查房间状态系统失败 
	ERR_LIVE_STATUS_MUST_NOT_START = 16002, //房间不是未开播状态 
	ERR_SUBSCRIBE_ERR = 16010, //订阅系统失败

	SEND_COUPON_ERR_IS_FINISHE = 30006, //券已发完 
	SEND_COUPON_ERR_ACCOUNT_BUDGET_EMPTY = 30012, //账户预算不⾜ 
	SEND_COUPON_ERR_STOCK_INVALID = 30013, //批次⽆效 
	SEND_COUPON_ERR_STATE_EXPIRED = 30014, //批次已过期
	SEND_COUPON_ERR_BEYOND_THE_LIMIT_COLLAR = 30015, //触发⾃然⼈限领 
	SEND_COUPON_ERR_REACH_USER_DAY_LIMIT = 30016, //达到⽤户当⽇领取上限
	SEND_COUPON_ERR_REACH_DAY_SEND_LIMIT = 30017, //达到券单⽇发放上限
	SEND_COUPON_ERR_UIN_SPAMCHECK = 30018, //⽤户⼩号拦截 
	SEND_COUPON_ERR_OTHERS_FAIL = 30019, //发券其他失败 
	SEND_COUPON_ERR_ID_IS_EMPTY = 30020, //发券异常-券id为空 
	SEND_COUPON_ERR_STOCK_NOT_AUTHORIZED = 30021; //批次未被授权
let livePlayer = requirePlugin('live-player-plugin')
import { liveRoom } from '../../service/livePlayer'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cover_img: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getRoomInfo();
		this.getPayCoupon();
	},
	async getRoomInfo(){
		const room_id = 284;
		try{
			const {room_info = []} = await liveRoom();
			if(room_info.length){
				const curRoom = room_info.find(({roomid}) => roomid === room_id)
				if(curRoom && curRoom.cover_img){
					this.setData({
						cover_img: curRoom.cover_img,
						share_img: curRoom.share_img
					})
				}
			}
		}catch(e){
			console.log(e);
		}
	},
	async getPayCoupon() {
		const room_id = 284 // 替换成真正的房间号
		try {
			const couponInfo = await livePlayer.getCouponInfo({
				room_id
			});
			console.log('getCouponInfo res', couponInfo);

			if (coupons.length) {
				const subscribe = await livePlayer.subscribeAndObtainCoupon({
					coupon_id: subscribe.coupons[0].coupon_id,
					room_id: room_id
				})
				console.log('subscribeAndObtainCoupon res', subscribe)
			}
		} catch (e) {
			console.log(e.message);
		}


	
	},
	aaa(){
		let room_id = 111;
		livePlayer.getCouponInfo({
			room_id: room_id
		}).then(res => {
			console.log('getCouponInfo res', res)
			if (res.coupons.length) {
				livePlayer.subscribeAndObtainCoupon({
					coupon_id: res.coupons[0].coupon_id,
					room_id: room_id
				}).then(res => {
					console.log('subscribeAndObtainCoupon res', res)
				}).catch(err => {
					console.error('subscribeAndObtainCoupon err', err)
				})
			}
		}).catch(err => {
			console.log('getCouponInfo err', err)
		})
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

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

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})