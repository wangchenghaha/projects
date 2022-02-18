//导购业务模块

import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'
function gloryKing() {
	return new Promise((resolve, reject) => {
		request({
			url: URL.GLORY_KING,
		}).then(res => {
			resolve(res)
		}).catch(e=>{
			reject(new Error(e.msg || e.message))
		})
	})
}
/**
 * 分销登录
 * @param data { phone, password}
 * @returns {Promise<unknown>}
 */
function distributorLogin(data) {
	return new Promise((resolve, reject) => {
		request({
			url: URL.DISTRIBUTOR_LOGIN,
			data
		}).then(res => {
			res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
		}).catch(e=>{
			reject(new Error(e.msg || e.message))
		})
	})
}
// 分销获取验证码
function distributorGetCode(phone) {
	return new Promise((resolve, reject) => {
		request({
			url: URL.DISTRIBUTOR_GET_CODE,
			method:'post',
			data: {phone}
		}).then(res => {
			res.code === 0 ? resolve(res) : reject(new Error(res.msg));
		}).catch(e=>{
			reject(new Error(e.msg || e.message))
		})
	})
}
// 通过分销号查询信息
function distributorInfoByFxId(FxId) {
	return new Promise((resolve, reject) => {
		request({
			url: `${URL.DISTRIBUTOR_GET_INFO}?distributorId=${FxId}`,
		}).then(res => {
			res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
		}).catch(e=>{
			reject(new Error(e.msg || e.message))
		})
	})
}
// 通过unionID查询是否是分销人员
function distributorUnionId(id) {
	return new Promise((resolve, reject) => {
		request({
			url: `${URL.DISTRIBUTOR_UNION_ID}?unionId=${id}`,
		}).then(res => {
			res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
		}).catch(e=>{
			reject(new Error(e.msg || e.message))
		})
	})
}
export {
	gloryKing,
	distributorLogin,
	distributorGetCode,
	distributorInfoByFxId,
	distributorUnionId,
}