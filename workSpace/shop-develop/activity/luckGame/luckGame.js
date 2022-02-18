import {extAward, addUser, awardAndSuccess, extUser} from '../service/wxVideo'
import {splitImg} from '../../utils/utils'
import {wxShowToast} from '../../utils/wxMethods'
import {KEYSTORAGE} from '../../src/const'
const app = getApp();
const {brand, cdn} = app.config;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		wxPhone: wx.getStorageSync(KEYSTORAGE.wxPhone),
		banner: splitImg('luck_game_1225.jpg'),
		// 游戏角色信息
		playUser: {},
		// 中奖列表
		allSuccessList: [],
		// 所有参与活动人数
		userTotal: 0,
		// 是否参与游戏
		isJoined: false,
		// 是否开奖
		currentAwardIsOpen: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getAllData();
	},
	getAllData(){
		this.setData({wxPhone: wx.getStorageSync(KEYSTORAGE.wxPhone)})
		this.getExtAward();
		this.getUser();
		this.getAwardAndSuccess();
	},
	// 查询当前抽奖信息
	getExtAward(){
		extAward().then(res => {
			if(res && res.id){
				this.setData({ playUser: res })
			}
		}).catch(err => wxShowToast(err.message))
	},
	// 查询当前用户的抽奖信息
	getUser(){
		const {wxPhone} = this.data;
		extUser(wxPhone).then(res => {
			this.setData({isJoined: !!(Array.isArray(res) && res.length)});
		}).catch(err => wxShowToast(err.message))
	},
	// 查询当前奖品参与总人数与所有奖品类型的中奖记录
	getAwardAndSuccess(){
		awardAndSuccess().then(res => {
			if(res){
				const { allSuccessList = [], currentAwardIsOpen = false, userTotal = 0} = res;
				this.setData({allSuccessList, currentAwardIsOpen, userTotal})
			}
		}).catch(err => wxShowToast(err.message))
	},
	// 获取手机号
	async getPhoneNumber(e){
		const {encryptedData = '', iv = ''} = e.detail;
		if(encryptedData && iv){
			try {
				const wxPhone = await app.getWxPhone(encryptedData,  iv);
				wx.setStorageSync(KEYSTORAGE.wxPhone, wxPhone);
				this.setData({wxPhone});
				this.getUser();
			}catch(e){
				wxShowToast(e.message)
			}
		}
	},
	// 玩游戏
	playGame(){
		const {wxPhone, isJoined} = this.data;
		if(isJoined){
			return;
		}
		const {nickName, avatarUrl, openId, unionId} = wx.getStorageSync(KEYSTORAGE.wxInfo)
		const param = {
			 nickName,
			"openid": openId,
			"phone": wxPhone,
			"unionid": unionId,
		}
		wx.showLoading({
			title: '加载中...',
		})
		addUser(param).then(res => {
			wxShowToast(res.msg);
			if(res.code === 0){
				this.setData({isJoined: true})
			}
		}).catch(err => wxShowToast(err.message))
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	goHome(){
		app.goBack();
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		this.getAllData();
		wx.stopPullDownRefresh()
		// wx.redirectTo({
		// 	url: '/activity/luckGame/luckGame',
		// })
	},

})