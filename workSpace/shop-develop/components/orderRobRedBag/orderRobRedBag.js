import {splitImg} from '../../utils/utils'
import {robRedBagTime} from "../../service/activity";
const {brand} = getApp().config;
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		orderStatus: String,
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		robBagImg: splitImg('order_share_red_bag.png', 'common'),
		// 是否显示
		showRobBag: false,
	},
	lifetimes:{
		ready() {
			this.getRobRedBagTime();
		}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		closeRobBag(){
			this.setData({showRobBag: false})
		},
		getRobRedBagTime(){
			const {orderStatus} = this.properties;
			if(orderStatus === 'WaitingPay' || brand !== 'FOL'){
				return
			}
			robRedBagTime().then(res => {
				if(res && res.constructor === Object){
					let {activityEndTime = '', activityStartTime = ''} = res;
					if(activityStartTime && activityEndTime){
						// 转化为时间戳
						activityEndTime = activityEndTime.replace(/-/g, '/');
						activityStartTime = activityStartTime.replace(/-/g, '/');
						const startTimeStamp = Date.parse(activityStartTime),
							endTimeStamp = Date.parse(activityEndTime),
							curTimeStamp = Date.now();
						if(curTimeStamp <= endTimeStamp && curTimeStamp >= startTimeStamp){
							this.setData({showRobBag: true})
						}
						
					}
				}
			})
		},
	}
})
