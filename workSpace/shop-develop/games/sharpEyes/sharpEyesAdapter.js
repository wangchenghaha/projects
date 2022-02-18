import {splitGameImg ,toDecimal} from '../../utils/utils'
const app = getApp();
let innerAudioContext = null;
function getRules(){
    let ruleDetail = [];
    switch(app.config.brand){
        case 'JACKJONES':
        case 'ONLY':
        case 'VEROMODA':
        case 'SELECTED':
            ruleDetail =[
                '1、玩家需要记忆九宫格中每个卡片下对应的标记，在倒计时结束后，正确选择与屏幕上方所示标记相同的卡片即为挑战成功。每成功挑战一次会随机获取一块拼图碎片，集齐所有拼图碎片可获得大奖。游戏共设有四个难度，成功挑战后依据难易程度不同获得相应积分，积分可兑换奖品。',
                '2、每名玩家每天有5次游戏机会，5次机会用完后，每邀请一名好友助力可获得一次额外的游戏机会，每位好友仅可给同一人助力一次。',
                '3、获得的奖励可在我的奖品页面查看，实际金额以页面显示为准。',
                '4、奖品数量有限，先到先得。'
            ]
            break;
        case 'FOL':
            ruleDetail =[
                '1、在游戏主页点击“GO”正式进入游戏环节，大屏幕倒计时闪烁， 玩家需要记忆九宫格中每个卡片下对应的标记，在倒计时结束后，正确选择与屏幕上方所示标记相同的卡片即为挑战成功。每成功挑战一次会随机获取一块拼图碎片，集齐所有拼图碎片可获得大奖。游戏共设有四个难度，成功挑战后依据难易程度不同获得相应积分，积分可兑换奖品。',
                '2、每名玩家每天有5次游戏机会，5次机会用完后，每邀请一名好友助力可获得一次额外的游戏机会，每位好友仅可给同一人助力一次。',
                '3、获得的奖励可在我的奖品页面查看，实际金额以页面显示为准。',
                '4、奖品数量有限，先到先得。'
            ]
            break;
    }
    return ruleDetail;
}

function getGiftRule(){
    let giftDetail = [];
    switch(app.config.brand){
        case 'JACKJONES':
        case 'ONLY':
        case 'VEROMODA':
        case 'SELECTED':
            giftDetail =[
                {
                    width: '10%',
                    color: '#8ebe06',
                    couponNum: '30元优惠券',
                    logo: splitGameImg('coupon_logo_1.png', 'springOuting'),
                    step: '100步',
                    steps: 100
                  },
                  {
                    width: '40%',
                    color: '#8ebe06',
                    couponNum: '50元优惠券',
                    logo: splitGameImg('coupon_logo_2.png', 'springOuting'),
                    step: '500步',
                    steps: 500
                  },
                  {
                    width: '50%',
                    color: '#ff8227',
                    couponNum: '神秘大奖',
                    logo: splitGameImg('coupon_logo_3.png', 'springOuting'),
                    step: '1000步',
                    steps: 1000
                  } 
                ]
            break;
        case 'FOL':
            giftDetail =[
                {
                    width: '21%',
                    color: '#8ebe06',
                    couponNum: '10元优惠券',
                    logo: splitGameImg('coupon_logo_1.png', 'springOuting'),
                    step: '188步',
                    steps: 188
                  },
                  {
                    width: '75%',
                    color: '#8ebe06',
                    couponNum: '39元优惠券',
                    logo: splitGameImg('coupon_logo_2.png', 'springOuting'),
                    step: '666步',
                    steps: 666
                  },
                  {
                    width: '50%',
                    color: '#ff8227',
                    couponNum: '神秘大奖',
                    logo: splitGameImg('coupon_logo_3.png', 'springOuting'),
                    step: '888步',
                    steps: 888
                  }
            ]
            break;
    }
    return giftDetail;
}

function playMuisc(){
    let musicUrl = splitGameImg('game_bgm.mp3', 'sharpEyes')
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = musicUrl
    innerAudioContext.autoplay = true
    innerAudioContext.loop = true
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
}

function closeMuisc(){
    if(innerAudioContext){
        innerAudioContext.destroy();
    }
}

function gameMode(index){
    let modeTyoe = '';
    let adapter = {
        modeTyoe: '',
        point: ''
    }
    let  _modeTyoe = '', _point =''
    switch(index){
        case 3:
            _modeTyoe = "简单模式"
            _point = app.config.brand === 'FOL'? 200 : 200
            break;
        case 5:
            _modeTyoe = "普通模式"
            _point = app.config.brand === 'FOL'? 400 :300
            break;
        case 7:
            _modeTyoe = "困难模式"
            _point = app.config.brand === 'FOL'? 600 :400
            break;
        case 9:
            _modeTyoe = "炼狱模式"
            _point = app.config.brand === 'FOL'? 800 :500
            break;    
    }
    adapter.modeTyoe = _modeTyoe;
    adapter.point = _point
    return adapter;
}


export{
    getRules,
    getGiftRule,
    playMuisc,
    closeMuisc,
    gameMode
}