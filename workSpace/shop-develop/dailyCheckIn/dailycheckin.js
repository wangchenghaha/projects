import { request } from '../utils/request.js'
const { homeLiveCount = 2, homeLiveReplay } = '../src/const'
import { liveRoom, roomReplay } from '../service/livePlayer'
let utils = require('../utils/utils.js')
let config = require('../src/config.js')
const newPrefix = '/rest'

//查询签到用户信息
function getCheckInUserInfo(query) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signUserInfo/getSignUserInfoByPhone`,
            method: 'GET',
            data: query
        })
            .then(res => {
                res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}


//创建签到用户信息
function createCheckInUser(user) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signUserInfo/addSignUserInfo`,
            method: 'POST',
            data: user
        })
            .then(res => {
                res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}

//获取签到基础配置
function getBaseConfig(bean) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signActivity/querySignList`,
            method: 'GET',
            data: bean
        })
            .then(res => {
                if (res.code == 0 && !utils.isArrayEmpty(res.data)) {
                    resolve(res.data[0])
                } else {
                    reject(new Error(res.msg))
                }
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}

//获取签到邀请活动配置
function getInviteConfig(bean) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signInvite/querySignInviteList`,
            method: 'GET',
            data: bean
        })
            .then(res => {
                //默认返回了开启的活动的列表
                if (res.code == 0 && !utils.isArrayEmpty(res.data)) {
                    resolve(res.data[0])//很多活动，默认取第一个  todo:活动筛选
                } else {
                    reject(new Error(res.msg))
                }
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}

//获取签到任务列表
function getMissionList(bean) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signActivityConfig/getActivityConfig`,
            method: 'GET',
            data: bean
        })
            .then(res => {
                res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}
//获取签到任务完成情况
function checkMissionCompletion(bean) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signUserRecord/getUserTask`,
            method: 'GET',
            data: bean
        })
            .then(res => {
                res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}

//获取签到的连续签到奖励配置列表
function getConsecutiveRewardConfig(bean) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signConfig/getSignConfigList`,
            method: 'GET',
            data: bean
        })
            .then(res => {
                res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}

//查询可兑换的奖品列表
function queryRedeemableList(bean) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signRedeem/getSignRedeem`,
            method: 'GET',
            data: bean
        })
            .then(res => {
                res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}

//执行兑换奖品的操作
function perfromRedeem(bean) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signRedeemRecord/addRecord`,
            method: 'POST',
            data: bean
        })
            .then((res) => {
                res.code == 0 ? resolve(res) : reject(new Error(res.msg))
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}

//查询兑换奖品的历史记录
function getRedeemPrizeHistroy(bean) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signRedeemRecord/getRecord`,
            method: 'GET',
            data: bean
        })
            .then((res) => {
                res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}

//新增签到记录
function addCheckInRecord(bean) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signUserRecord/addSignUserRecord`,
            method: 'POST',
            data: bean
        })
            .then(res => {
                // res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
                resolve(res)
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}
//完成任务
function addMission(bean) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signUserRecord/addTask`,
            method: 'POST',
            data: bean
        })
            .then(res => {
                res.code == 0 ? resolve(res) : reject(new Error(res.msg))
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}
//补签---deprecated
function makeupCheckInRecord(m) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signUserRecord/supplySign`,
            method: 'GET',
            data: m
        })
            .then(res => {
                res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}

//@deprecated 查询用户签到记录按月
function queryCheckInRecordByMonth(m) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signUserRecord/querySignUserRecordForMonth`,
            method: 'GET',
            data: m
        })
            .then(res => {
                res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}
// new -- 查询用户签到记录按月
function queryCheckInRecord(bean) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signUserRecord/queryPage`,
            method: 'GET',
            data: bean
        })
            .then(res => {
                res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}

//添加签到卡
function addCheckInCard(bean) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signCard/addSignCard`,
            method: 'POST',
            data: bean
        })
            .then(res => {
                res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}

//查询签到卡
function queryCheckInCardCount(userid) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signCard/getSignCardCount`,
            method: 'GET',
            data: {
                "userid": userid
            }
        })
            .then(res => {
                res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}

//查询邀请好友助力的情况
function queryInviteInfo(bean) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signFriendInfo/getFriendInfo`,
            method: 'GET',
            data: bean
        })
            .then(res => {
                res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}
//添加好友助力
function addInvite(bean) {
    return new Promise((resolve, reject) => {
        request({
            url: `${newPrefix}/signFriendInfo/addFriendInfo`,
            method: 'POST',
            data: bean
        })
            .then(res => {
                res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
            })
            .catch(e => {
                reject(new Error(e.message))
            })
    })
}

function getQueryDate() {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    month = month < 10 ? "0" + month : month
    return `${year}${month}`
}

function generateCalendarList(list) {
    // const days = [
    //     {
    //         year: '2020',
    //         month: '08',
    //         day: '26',
    //         todoText: ''
    //     }
    // ];
    let daysList = []
    list.forEach(item => {
        let signDate = item.signDate
        daysList.push({
            year: signDate.split("-")[0],
            month: signDate.split("-")[1],
            day: signDate.split("-")[2],
            todoText: ''
        })
    })
    return daysList
}

function addCalendarTodoText(alreadyContiDaysNum, todoDays) {
    let now = new Date()
    let todoDateList = []
    for (const gift of todoDays) {
        let diff = gift.continueDays - alreadyContiDaysNum
        let dayStr = culcFutureDate(now, diff)
        let bean = {
            year: dayStr[0],
            month: dayStr[1],
            day: dayStr[2],
            // todoText: gift.bonusStr  私域团队的UI去掉todotext
            todoText: "   "
        }
        todoDateList.push(bean)
    }
    return todoDateList
}

//@deprecated --
function generateCalendarBonusList(giftDays) {
    // const days = [
    //   `${year}-${month}-${this.generateRandomDate('date')}`,
    // ]
    let days = []
    for (const day of giftDays) {
        days.push(`${day.year}-${day.month}-${day.day}`)
    }
    return days

}
function generateCalendarSelectedList(giftDays) {
    let days = []
    for (const day of giftDays) {
        days.push({
            year: `${day.year}`,
            month: `${day.month}`,
            day: `${day.day}`
        })
    }
    return days
    // const toSet = [
    //   {
    //     year,
    //     month,
    //     day: this.generateRandomDate('date')
    //   },
    //   {
    //     year,
    //     month,
    //     day: this.generateRandomDate('date')
    //   }
    // ]

}


function findMakeupDate(continuousCheckInDays, checkedInDayList) {
    // 根据补签卡数量，显示补签按钮
    // 根据日期，显示一个补签按钮
    // 计算日期
    let diff = -continuousCheckInDays
    let iteratorDays = checkedInDayList//默认是已经按照日期倒序排列
    let now = new Date()
    let baseMakeupDate = culcFutureDate(now, diff)
    //判断此日期是否存在于已签到日期列表中，如果存在，则减一天，继续判断，直到一个不存在的日期为止
    //遍历
    while (iterateAlreadyCheckinDates(baseMakeupDate, iteratorDays)) {
        baseMakeupDate = culcFutureDate(now, --diff)
        console.log(`********************************************** baseMakeupDate==${baseMakeupDate}`)
    }
    return baseMakeupDate
}

function iterateAlreadyCheckinDates(baseMakeupDate, iteratorDays) {
    let isMatch = false
    for (const date of iteratorDays) {
        console.log(`iterateAlreadyCheckinDates  ******* item date=${date.year}-${date.month}-${date.day}  baseMakeupDate=${baseMakeupDate[0]}-${baseMakeupDate[1]}-${baseMakeupDate[2]}`)
        if (date.year == baseMakeupDate[0] && date.month == baseMakeupDate[1] && date.day == baseMakeupDate[2]) {
            isMatch = true
            console.log(`#####################    isMatch=${isMatch}`)
            return isMatch
        }
    }
    console.log(`iterateAlreadyCheckinDates did all loop ... ----------  isMatch=${isMatch}`)
    return isMatch
}

function culcFutureDate(benchmarkDate, diffDay) {
    let newMili = benchmarkDate.getTime() + diffDay * 24 * 60 * 60 * 1000
    let newDate = new Date(newMili).toISOString().split("T")[0]
    let dayList = newDate.split("-")
    return dayList
}

function getTodayDateList(pDate = new Date()) {
    let date = pDate
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    month = month < 10 ? "0" + month : month
    let day = date.getDay() + 1
    return [`${year}`, `${month}`, `${day}`]
}

function getBonusName(intType) {
    let name = ``
    switch (intType) {
        case 0:
            name = `绫米`
            break
        case 1:
            name = `优惠券`
            break
        case 2:
            name = `补签卡`
            break
    }
    return name
}

function getBonusValue(bonusBean) {
    let intType = bonusBean.giftType
    let value = bonusBean.points
    switch (intType) {
        case 0:
            value = bonusBean.points
            break
        case 1:
            value = bonusBean.giftCount
            break
        case 2:
            value = bonusBean.giftCount
            break
    }
    return value
}

function combineBonus(bonusBean) {
    let intType = bonusBean.giftType
    let combineStr = ``
    switch (intType) {
        case 0:
            combineStr = `${bonusBean.points}绫米`
            break
        case 1:
            combineStr = `优惠券x${bonusBean.giftCount}`
            break
        case 2:
            combineStr = `签到卡x${bonusBean.giftCount}`
            break
    }
    return combineStr
}


function getLiveRoom() {
    return new Promise((resolve, reject) => {
        liveRoom().then(res => {
            if (res && res.errcode === 0 && res.room_info && res.room_info.length) {
                // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常;
                const livePlayer = 102, living = 101
                let roomInfo = res.room_info.filter(item => item.live_status === livePlayer || item.live_status === living)
                if (roomInfo.length > homeLiveCount) {
                    roomInfo = roomInfo.slice(0, homeLiveCount)
                }
                const endRoomInfo = res.room_info.filter(item => item.live_status === 103)
                if (roomInfo.length) {
                    roomInfo.forEach(item => {
                        item.text = item.live_status === livePlayer ? '即将直播' : '直播中'
                    })
                }
                if (homeLiveReplay) {
                    let livingSize = roomInfo.filter(item => item.live_status === living).length
                    if (!roomInfo.length || !livingSize) {
                        if (endRoomInfo.length) {
                            const firstEndRoom = endRoomInfo[0]
                            firstEndRoom.text = '直播回放'
                            roomInfo.push(firstEndRoom)
                        }
                    }
                }
                resolve(roomInfo)
            } else {
                reject(new Error(e.message))
            }
        })
    })
}

const TEXT_CHECK_IN_RULES = `
    我是测试规则，
    我是测试规则，
    我是测试规则，
    我是测试规则，
    我是测试规则，
    我是测试规则，
    我是测试规则，
    我是测试规则，
    我是测试规则，
    我是测试规则，
    我是测试规则，
    我是测试规则，
    我是测试规则，
    我是测试规则，
    我是测试规则，
    我是测试规则，
    我是测试规则，
    我是测试规则，
    我是测试规则，
    我是测试规则，
`

const TYPE_NONE = 0x10
const TYPE_MAIN_PLACE = 0x12
const TYPE_LIVE = 0x15
const TYPE_GOODS = 0x25


export {
    getCheckInUserInfo,
    createCheckInUser,
    getBaseConfig,
    getInviteConfig,
    getMissionList,
    checkMissionCompletion,
    getConsecutiveRewardConfig,
    queryRedeemableList,
    perfromRedeem,
    getRedeemPrizeHistroy,
    addCheckInRecord,
    addMission,
    makeupCheckInRecord,
    queryCheckInRecordByMonth,
    queryCheckInRecord,
    addCheckInCard,
    queryCheckInCardCount,
    queryInviteInfo,
    addInvite,
    getQueryDate,
    generateCalendarList,
    addCalendarTodoText,
    generateCalendarBonusList,
    generateCalendarSelectedList,
    findMakeupDate,
    culcFutureDate,
    getBonusName,
    getBonusValue,
    combineBonus,
    getLiveRoom,
    TYPE_NONE,
    TYPE_MAIN_PLACE,
    TYPE_LIVE,
    TYPE_GOODS,
    TEXT_CHECK_IN_RULES,
}