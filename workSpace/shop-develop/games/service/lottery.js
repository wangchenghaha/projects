import { request } from '../../utils/request.js'
import { LOTTERY } from './const'
import { wxShowToast } from '../../utils/wxMethods'

// 奖品列表
function getGiftList(_gameCode){
    return new Promise((resolve, reject)=>{
        request({
            url: LOTTERY.GETGIFTLIST,
            data:{
                gameCode: _gameCode
            }
        }).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
            wxShowToast(res.msg)
        }
        else{
            resolve(res.data)
        }
        }).catch((e)=>{
            let a = e.message?e.message:e.msg
            wxShowToast(a)
            reject(new Error(e))
        })
    })
}

// 开始抽奖
function startlottery(param){
    return new Promise((resolve, reject)=>{
        request({
            url: LOTTERY.STARTGAME,
            data: param
        }).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
            wxShowToast(res.msg)
        }
        else{
            resolve(res.data)
        }
        }).catch((e)=>{
            let a = e.message?e.message:e.msg
            wxShowToast(a)
            reject(new Error(e))
        })
    })
}


// 中奖记录列表
function getGiftRecords(_gameCode){
    return new Promise((resolve, reject)=>{
        request({
            url: LOTTERY.GETGIFTRECORDS,
            data:{
                gameCode: _gameCode
            }
        }).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
            wxShowToast(res.msg)
        }
        else{
            resolve(res.data)
        }
        }).catch((e)=>{
            let a = e.message?e.message:e.msg
            wxShowToast(a)
            reject(new Error(e))
        })
    })
}

// 我的中奖记录
function getMyGiftList(_data){
    return new Promise((resolve, reject)=>{
        request({
            url: LOTTERY.MYGIFTLIST,
            data: _data
        }).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
            wxShowToast(res.msg)
        }
        else{
            resolve(res.data)
        }
        }).catch((e)=>{
            let a = e.message?e.message:e.msg
            wxShowToast(a)
            reject(new Error(e))
        })
    })
}


export {
    getGiftList,
    startlottery,
    getGiftRecords,
    getMyGiftList
}