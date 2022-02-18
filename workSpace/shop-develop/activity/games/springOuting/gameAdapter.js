import {splitGameImg ,toDecimal} from '../../../utils/utils'
const app = getApp();

function getRules(){
    let ruleDetail = [];
    switch(app.config.brand){
        case 'JACKJONES':
        case 'ONLY':
        case 'VEROMODA':
        case 'SELECTED':
            ruleDetail =[
                {title: '规则一',
                contents: '春风和煦，踏青的季节又到啦~ 通过点击屏幕“左侧”或“右侧”控制游戏角色不断向上跳跃，遇到礼物方块可获得神秘奖励，也有可能遇到前来阻碍的小动物注意躲避哦~积累步数还可获得成就奖励，快去探险吧！' },
                {title: '规则二',
                contents: '每名用户每天有3次踏青机会，3次机会用完后，可以邀请好友助力获得额外次数。每邀请1人将额外获得1次踏青机会，每位好友仅可给同一人助力一次。'},
                {title: '规则三',
                contents: '获得的奖励可在“我的奖品”页面查看，实际金额以页面显示为准。' },
                {title: '规则四',
                contents: '奖品数量有限，先到先得。' }
            ]
            break;
        case 'FOL':
            ruleDetail =[
                {title: '规则一',
                contents: '天朗气清，春风和煦，BESTSELLER官网邀请您一起踏春寻宝！ 通过点击手机屏幕“左侧”或“右侧”控制游戏角色不断向上跳跃。如果遇到礼物方块，即可获得神秘奖励宝贝，如果遇到偶然出没的小动物，请注意避让哦，游戏中积累踏春步数还可获得成就奖励！' },
                {title: '规则二',
                contents: ' 每名用户每天有3次踏青机会，3次机会用完后，可邀请好友助力以获得额外次数。每邀请1人将额外获得1次踏青机会，活动期间每位好友仅可给同一人助力一次，每人每天可给他人助力2次。'},
                {title: '规则三',
                contents: ' 游戏过程中有机会获得我们的惊喜优惠券。部分优惠券数量有限，先到先得。 获得的优惠券可在“我的奖品”页面查看，实际金额以页面显示为准。优惠券使用规则请以具体优惠券页面显示为准。' }
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

export{
    getRules,
    getGiftRule
}