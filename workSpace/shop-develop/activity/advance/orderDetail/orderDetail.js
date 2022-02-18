// activity//advance/orderDetail/orderDetail.js
import {preSaleOrderDetail, preSaleOrderSave, preSaleCancel} from '../../../service/order'
import {wxCopyText, wxShowToast} from '../../../utils/wxMethods'
import {getDateByOrder, objToQuery, orderStatus, jiafa, jianfa, toDecimal, skuToImg} from '../../../utils/utils'
import {getVoucher} from '../../../service/voucher'
import {	KEYSTORAGE } from '../../../src/const.js'
const app = getApp();
const cdn = app.config.cdn;
let bigOrderCode = '';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		orderStep: {
			title: '',
			step: [
				{
					name: '付定金',
				},
				{
					name: '付尾款',
				},
				{
					name: '待发货',
				}
			],
		},
		payStep: [
			{
				name: '阶段1',
				payInfo: [
					{
						name: '商品定金',
						price: 0,
					},
					{
						name: '定金实付款',
						price: 0,
					}
				]
			},
			{
				name: '阶段2：',
				payInfo: [
					{
						name: '商品尾款',
						price: 0,
					},
					{
						name: '尾款实付款',
						price: 0,
					}
				]
			}
		],
		orderDetail: {},
		btnList: [
			{
				type: 'cancel',
				name: '取消订单',
				isActive: true,
			},
			{
				type: 'firstPayPrice',
				name: '支付定金'
			},
			{
				type: 'lastPayPrice',
				name: '支付尾款'
			},
			{
				type: 'shipment',
				name: '提醒发货',
			},
			{
				type: 'confirm',
				name: '确认收货',
			}
		],
		payPrice: 0,
		voucherList: [],
		popup:{
			show: false,
			bgColor: '#fef4f3'
		},
		usingCardVoucher: {}, // 使用的优惠券
		usingCoupon: {}, // 使用的活动券
		voucherPrice: 0,
		selectText: '',
		voucherLoading: true,
		showVoucherCar: false,
		preSaleUseVoucher: app.config.preSaleUseVoucher
	},
	hideVoucherLoading(){
		this.setData({voucherLoading: false})
	},
	// 订单参数
	orderSaveParam: {
		presellFlag: 2,
		channelId: 1,
		channelCode: app.config.channel,
		realSellPrice: '',
		payPrice: '',
		goodsTotalCount: '',
		gscPicmianId: "",
		picUrl: "",
		province: "",
		city: "",
		area: "",
		detailAddress: "",
		contactTel: "",
		consignee: "",
		goodsOrderList: [{
			colorName: "",
			gcsSku: "",
			goodsName: "",
			goodsCount: 0,
			goodsColorCode: "",
			gscolPicPath: "",
			originalPrice: '',
			sizeName: "",
			price: '',
			isGift: "N"
		}],
		bigOrderAppendix: {"targetUrl": "", "utmCampaign": "", "utmMedium": "", "utmSource": "", "utmTerm": ""},
		crmId: "",
		utmWxScene: '',
		expressFare: 0,
		unionid: wx.getStorageSync(KEYSTORAGE.unionid),
		customerNickname: "",
		customerFaceImg: "",
		latitude: "",
		longitude: "",
		phone: "",
		openId: "",
		bookActivityId: "",
		balancePayment: '',
		presellDeadline: "",
	}
	,
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// bigorderCode=21201912181620320001
		bigOrderCode = options.bigorderCode || '';
		this.getPreSaleOrderDetail(bigOrderCode)
	},
	getPreSaleOrderDetail(bigOrderCode) {
		let {payStep, orderStep, btnList, showVoucherCar, preSaleUseVoucher} = this.data;
		preSaleOrderDetail(bigOrderCode).then(res => {
			if (res && res.length) {
				let deposit = {}, balance = {}, payPrice = 0;
				res.forEach(item => {
					item.deposit ? deposit = item.deposit : '';
					item.balance ? balance = item.balance : '';
				});
				const actualPrice = jiafa(deposit.payPrice, balance.payPrice)
				// let {deposit, balance, payPrice} = resData;
				let orderDetail = orderDetail = (deposit.goodsOrderList && deposit.goodsOrderList.length) ? deposit : balance;
				// 订单状态
				// deposit.status = 'AlreadyPay';
				// balance.status = 'AlreadyPay';
				if (deposit.status === 'WaitingPay') {
					orderStep.title = '定金待付款';
					orderStep.active = 0;
					payPrice = deposit.payPrice;
					btnList.forEach((item, index) => item.show = index < 2);
				} else if(deposit.status === 'AlreadyPay'){
					const {balanceStartTime, balanceEndTime, couponValue, prepayType} = balance;
					const startTimeStamp = new Date(balanceStartTime.replace(/-/g, '/')).getTime();
					const endTmeStamp = new Date(balanceEndTime.replace(/-/g, '/')).getTime();
					if(startTimeStamp > Date.now() || Date.now() > endTmeStamp){
						btnList[2].disabled = true;
					}
					orderStep.active = 1;
					btnList[2].show = true;
					payPrice = balance.payPrice;
					orderStep.title = orderStatus(balance.status);
					showVoucherCar = !prepayType; // 是否显示优惠券  prepayType 是否发起支付
				}else{
					// 第二阶段
					orderStep.title = '支付成功';
					orderStep.active = 2;
					btnList[3].show = true;
				}
				orderStep.step.forEach((item, index) => item.active = orderStep.active >= index);
				// 预售信息
				payStep.forEach((item, index) => {
					item.active = orderStep.active >= index;
					item.orderInfo = index ? balance : deposit;
					item.subName = index ? orderStatus(item.orderInfo.status) : '付定金';
					item.payInfo.forEach(priceItem => priceItem.price = item.orderInfo.payPrice)
				});
				orderDetail.goodsOrderList.forEach(item => {
					item.goodsImg = cdn + skuToImg({sku: item.gcsSku});
					item.actualPrice = actualPrice
				});
				this.setData({orderDetail, payStep, orderStep, btnList, payPrice, showVoucherCar});
				this.handleOrderParam();
				return showVoucherCar
			}
		}).then( showVoucherCar_=> {
			if(showVoucherCar && preSaleUseVoucher){
				this._getVoucherList()
			}
		}).catch(err => {
			wxShowToast(err.message);
			console.log(err,'***')
		})
	},
	closePopup: function(e){
		let {popup} = this.data;
		popup.show = false;
		this.setData({popup});
	},
	showPopup: function(e){
		let {popup, voucherList} = this.data;
		if(!voucherList.length){
			wxShowToast('暂无优惠券可用');
			return
		}
		popup.show = true;
		this.setData({popup});
	},
	// 取消订单
	cancelOrder(){
		const {orderInfo} = this.data.payStep[0];
		preSaleCancel(orderInfo.id).then(res => {
			wx.showModal({
				title: '提示',
				content: '订单取消成功',
				confirmText: '继续逛逛',
				showCancel: false,
				success (res) {
					app.goBack();
				}
			})
		}).catch(err => wxShowToast(err.message))
	},
	// 获取优惠券列表
	_getVoucherList() {
		let user_info = wx.getStorageSync(KEYSTORAGE.crmInfo);
		let phone = user_info.phone;
		if (!phone) {
			return;
		}
		let {payPrice, voucherList} = this.data;
		const reqParam = {
			phone,
			type: 'time',
			channelType: 'P', // 需要过滤的渠道，
			returnListFlag: '0' // 0: 可用券 2: 全部券
		};
		getVoucher(reqParam).then(res => {
			this.hideVoucherLoading();
			if(Array.isArray(res) && res.length){
				// 优惠券
				voucherList = res.filter(item => (item.type === 'coupon' && payPrice >= item.threshold && payPrice > item.value) );
				this.setData({voucherList});
				if(voucherList.length){
					// 默认选中最大一张面额优惠券
					const maxValueCoupon = voucherList.sort( (a, b) => b.value - a.value)[0];
					const maxVoucherNum = maxValueCoupon.voucherno;
					this.useVoucher(maxVoucherNum)
				}
			}
		}).catch(err => {
			wxShowToast(err.message);
			this.hideVoucherLoading();
		});

	},
	onClick(e) {
		const dataType = e.currentTarget.dataset.type;
		switch (dataType) {
			case 'copyOrderCode':
				this.copyText(e);
				break;
			case 'firstPayPrice':
				this.firstPay();
				break;
			case 'lastPayPrice':
				this.lastPay(e);
				break;
			case 'card':
				this.showPopup();
				break;
			case 'useVoucher':
				this.useVoucher(e);
				break;
			case 'cancel':
				this.cancelOrder();
				break;
			case 'goBack':
				app.goBack();
				break;
			case 'shipment':
				this.goOrderPage();
				break
		}
	},
	firstPay(){
		const {orderInfo} = this.data.payStep[0];
		const startTimeStamp = new Date(orderInfo.depositStartTime.replace(/-/g, '/')).getTime();
		const endTmeStamp = new Date(orderInfo.depositEndTime.replace(/-/g, '/')).getTime();
		const curDate = Date.now();
		if(curDate >= startTimeStamp && curDate <= endTmeStamp){
			this.orderSaveSuccess(orderInfo)
		}else{
			wxShowToast('支付时间不符合')
		}
	},
	goOrderPage: function(){
		wx.setStorageSync('dingdanStatus', {
			index: 2,
			status: 'WaitingShipment'
		});
		wx.navigateTo({
			url: `/pages/allDingdan/allDingdan`
		});
	},
	// 使用优惠券
	useVoucher(e){
		let wxData = this.data;
		let voucherNum = e.currentTarget ? e.currentTarget.dataset.number : e;
		let {voucherList, payPrice, voucherPrice, usingCardVoucher, selectText} = wxData;
		voucherList.forEach(item => {
			if(voucherNum === item.voucherno){
				if(item.threshold){
					if (parseFloat(payPrice) < parseFloat(item.threshold)) {
						wxShowToast('不满足使用条件');
					}
				}
				// 是否已经使用优惠券，已使用优惠券则清除优惠价
				if(usingCardVoucher.voucherno){
					payPrice = jiafa(payPrice, usingCardVoucher.value);
					voucherPrice = jianfa(voucherPrice, usingCardVoucher.value);
				}
				item.selected = true;
				usingCardVoucher = item;
				payPrice = jianfa(payPrice, item.value);
				voucherPrice = jiafa(voucherPrice, item.value);
				selectText = `已使用${item.value}元优惠券`;
				payPrice = toDecimal(payPrice);
				voucherPrice = toDecimal(voucherPrice);
				this.setData({payPrice, voucherPrice, selectText});
				this.closePopup();
				let orderParam = {
					couponNo: voucherNum,
					couponValue: parseFloat(item.value),
					couponType: '现金券',
					couponName: item.channel,
					payPrice: payPrice,
					realSellPrice: payPrice
				};
				Object.assign(this.orderSaveParam, orderParam);
			}else{
				item.selected = false;
			}
		});
		this.setData({ voucherList, usingCardVoucher })
	},
	handleOrderParam(){
		let {orderInfo} = this.data.payStep[0];
		let orderSaveParam = this.orderSaveParam;
		const balance = this.data.payStep[1].orderInfo;
		for(let key in orderSaveParam){
			orderSaveParam[key] = orderSaveParam[key] || orderInfo[key];
			if(key === 'bigOrderAppendix'){
				// UTM参数
				const utmObj = orderSaveParam[key]
				for(let utmKey in utmObj){
					utmObj[utmKey] =  orderInfo[utmKey]
				}
			}else if(key === 'goodsOrderList'){
				const goodsOrderList = orderSaveParam[key];
				const goodsKey = goodsOrderList[0];
				console.log(goodsKey,'***')
				// 商品信息
				orderSaveParam[key] = [];
				let orderInfoGoods = [];
				orderInfoGoods = orderInfo[key] || balance[key];
				orderInfoGoods.forEach(item => {
					const goodsItem = {};
					for(let goods in goodsKey){
						goodsItem[goods] = item[goods];
					}
					orderSaveParam[key].push(goodsItem)
				})
			}
		}

		let {payPrice, realSellPrice, bigorderCode, status} = balance;
		Object.assign(this.orderSaveParam, {payPrice, realSellPrice, bigorderCode, status});
	},
	lastPay(e){
		const dataIndex = e.currentTarget.dataset.index;
		const btnItem = this.data.btnList[dataIndex];
		if(btnItem.disabled){
			wxShowToast('支付时间不符合');
			return
		}
		const {payStep} = this.data;
		let stepIndex = 0;
		payStep.forEach((item, index) => item.active ? stepIndex = index : '');
		const {orderInfo} = payStep[stepIndex];
		console.log(stepIndex,'******');
		let orderSaveParam = this.orderSaveParam;
		console.log(orderSaveParam,'*****');
		if(stepIndex > 0 && orderInfo.prepayType){
			console.log('不生成尾款***')
			// 通过订单号支付
			this.orderSaveSuccess(orderInfo);
			return;
		}
		console.log('生成尾款***')
		wx.showLoading({
			title: '提交中...'
		});
		preSaleOrderSave(orderSaveParam).then(res => {
			wx.hideLoading();
			if(res){
				this.orderSaveSuccess(res);
			}
		}).catch(err => wxShowToast(err.message))
	},
	// 通过订单号支付
	orderSaveSuccess(orderInfo, orderType) {
		let queryString = {
			amountPaid: orderInfo.payPrice,
			bigorderCode: orderInfo.bigorderCode,
			orderType: orderType || 'preSale'
		};
		wx.redirectTo({
			url: `../../../pages/wxPay/wxPay${objToQuery(queryString)}`
		});
	},
	// 复制订单号
	copyText(e) {
		const text = e.currentTarget.dataset.text;
		wxCopyText(text);
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

})