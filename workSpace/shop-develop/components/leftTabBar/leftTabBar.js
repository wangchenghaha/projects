/*
 * @Author: your name
 * @Date: 2020-12-01 10:24:11
 * @LastEditTime: 2020-12-03 16:36:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /SELECTED/components/leftTabBar/leftTabBar.js
 */
// components/leftTabBar/leftTabBar.js
import {URL_CDN, KEYSTORAGE, EVENTS} from '../../src/const'
const app = getApp();
const {brand} = app.config;
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		ruleClassify: {
			type: Array,
			value: []
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		hasThreeLevel: brand === 'FOL',
		// 第一级索引
		levelIndex1: 0,
		// 第二级索引
		levelIndex2: 0,
		// 第三级索引
		levelIndex3: 0,
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onClick(e){
			const {index, type} = e.currentTarget.dataset;
			this.setData({[`levelIndex${type}`]: index});
			let {levelIndex1, levelIndex2, levelIndex3, ruleClassify} = this.data;
			let classifyId = '';
			switch (type){
				case '1':
					classifyId = ruleClassify[levelIndex1].classifyId || '';
					if(!ruleClassify[levelIndex1].list || ruleClassify[levelIndex1].list.length === 0){
						this.triggerEvent('selectClassfyId', classifyId);
					}
					levelIndex3 = levelIndex2 = 0;
					break;
				case '2':
					levelIndex3 = 0;
					let curList = ruleClassify[levelIndex1].list || [];
					classifyId = curList[levelIndex2].classifyId || '';
					if(!curList[levelIndex2].list || curList[levelIndex2].list.length === 0){
						this.triggerEvent('selectClassfyId', classifyId);
					}
					break;
				case '3':
					curList = ruleClassify[levelIndex1].list[levelIndex2].list || [];
					classifyId = curList[levelIndex3].classifyId || '';
					if(!curList[levelIndex3].list || curList[levelIndex3].list.length === 0){
						this.triggerEvent('selectClassfyId', classifyId);
					}
			}
		},
		
	}
})
