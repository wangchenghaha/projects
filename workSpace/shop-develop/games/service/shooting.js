import { request } from '../../utils/request.js'
import { SHARPEYES } from './const'
/*
*路人王打投
*/

// 投票列表
function getVoteList(data) {
    return new Promise((resolve, reject) => {
        request({
            url: SHARPEYES.VOTE_LIST,
            data: data,
            method: 'POST'
        }).then(res => {
            res.code === 0 ? resolve(res.data) : reject(res.msg);
        }).catch(err => {
            reject(new Error(err.msg))
        })
    })
}


// 执行投票
function doVote(data) {
    return new Promise((resolve, reject) => {
        request({
            url: SHARPEYES.DO_VOTE,
            data: data,
            method: 'POST'
        }).then(res => {
            res.code === 0 ? resolve(res.data) : reject(res.msg);
        }).catch(err => {
            reject(new Error(err.msg))
        })
    })
}

// 分享投票
function shareVote(data) {
    return new Promise((resolve, reject) => {
        request({
            url: SHARPEYES.SHARE_VOTE,
            data: data,
            method: 'POST'
        }).then(res => {
            res.code === 0 ? resolve(res.data) : reject(res.msg);
        }).catch(err => {
            reject(new Error(err.msg))
        })
    })
}


// 获取规则JSON

function getRulesJson() {
    return new Promise((resolve, reject) => {
        request({ url: SHARPEYES.SHOOTINGRULES }).then(res => {
            resolve(res)
        }).catch((e) => { reject(new Error(e.msg)) })
    })
}

export {
    getVoteList,
    doVote,
    shareVote,
    getRulesJson
}