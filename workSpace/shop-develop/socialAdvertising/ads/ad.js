import { cdn, brand } from '../../src/config'
import { request } from '../../utils/request.js'
function getAdConfig() {
    return new Promise((resolve, reject) => {
        request({
            url: `${cdn}/assets/common/${brand}/json/ad_20210224_config.json?v=${Math.random()}`,
            method: 'GET',
        })
            .then(res => {
                resolve(res)
            })
            .catch(e => {
                console.log(e)
            })
    })
}

function getAdd0306Json() {
    return new Promise((resolve, reject) => {
        request({ 
            url: `${cdn}/assets/wechat/VEROMODA/ad_2021_0306.json?v=${Math.random()}`
        }).then(res => {
            res.status === '200' ? resolve(res.data) : reject(new Error(res.msg))
        }).catch((e) => { reject(new Error(e.msg)) })
    })
}


function getAdd0306JsonNew() {
    return new Promise((resolve, reject) => {
        request({ 
            url: `${cdn}/assets/wechat/VEROMODA/ad_2021_0306_new.json?v=${Math.random()}`
        }).then(res => {
            res.status === '200' ? resolve(res.data) : reject(new Error(res.msg))
        }).catch((e) => { reject(new Error(e.msg)) })
    })
}


function getAdd0307Json() {
    return new Promise((resolve, reject) => {
        request({ 
            url: `${cdn}/assets/wechat/SELECTED/ad_2021_0307.json?v=${Math.random()}`
        }).then(res => {
            res.status === '200' ? resolve(res.data) : reject(new Error(res.msg))
        }).catch((e) => { reject(new Error(e.msg)) })
    })
}


function getAdd0521Json() {
    return new Promise((resolve, reject) => {
        request({ 
            url: `${cdn}/assets/wechat/ONLY/ad_2021_0521.json?v=${Math.random()}`
        }).then(res => {
            res.status === '200' ? resolve(res.data) : reject(new Error(res.msg))
        }).catch((e) => { reject(new Error(e.msg)) })
    })
}

function getAddJson(_jsName) {
    return new Promise((resolve, reject) => {
        request({ 
            url: `${cdn}/assets/wechat/ONLY/${_jsName}.json?v=${Math.random()}`
        }).then(res => {
            res.status === '200' ? resolve(res.data) : reject(new Error(res.msg))
        }).catch((e) => { reject(new Error(e.msg)) })
    })
}



export {
    getAdConfig,
    getAdd0306Json,
    getAdd0306JsonNew,
    getAdd0307Json,
    getAdd0521Json,
    getAddJson
}