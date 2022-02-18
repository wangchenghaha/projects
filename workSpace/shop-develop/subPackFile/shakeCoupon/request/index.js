import fetch from '../fetch/index'
import api from '../common/api/index'
class Service {
    // 获取用户参与状态
    usrStatus(data) {
        return fetch.request({
            url: api.a_status,
            headerType: 1,
            method: 'GET',
            data: data,
            noloading: false
        })
    }
    // 分享活动
    shareActive(data) {
        return fetch.request({
            url: api.a_share,
            headerType: 1,
            method: 'GET',
            data: data,
            noloading: data.time == 'first'?false:true
        })
    }
    // 领取分享好友奖励
    getWardOne (data) {
        return fetch.request({
            url: api.a_get340,
            headerType: 2,
            method: 'POST',
            data,
            noloading: false
        })
    }
    // 修改中奖券状态
    changeCardStatus(data) {
        return fetch.request({
            url: api.a_card_status,
            headerType: 2,
            method: 'POST',
            data,
            noloading: false
        })
    }
    // kaishi开始抽奖
    startReward(data) {
        return fetch.request({
            url: api.a_reward,
            headerType: 1,
            method: 'GET',
            data,
            noloading: false
        })
    }
    // g领取奖品
    getWardTwo(data) {
        return fetch.request({
            url: api.a_get_reward,
            headerType: 2,
            method: 'POST',
            data,
            noloading: false
        })
    }
    // huo获取抽奖记录
    getHist(data) {
        return fetch.request({
            url: api.a_record,
            headerType: 1,
            method: 'GET',
            data,
            noloading: true
        })
    }
    // 获取用户解密信息
    retUserInfo(data) {
        return fetch.request({
            url: api.getSessionD,
            headerType: 1,
            method: 'GET',
            noloading: false,
            data
        })
    }
}

export default new Service()