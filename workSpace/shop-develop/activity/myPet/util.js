
import { splitImg } from '../../utils/utils'
const app = getApp();

function rules(){
    let loveNum = app.config.brand === 'FOL'?'200':'100'
    let rule = [
        { text: '基础规则' }, 
        { text: '领养宠物：' }, 
        { text: '绫致萌宠乐园有树袋熊，羊驼，独角兽三种可爱的萌宠宝宝们供大家选择，挑选领养你喜欢的宠物，就可以开始和它互动啦。' }, 
        { text: '获得爱心值：' }, 
        { text: '1. 每天可以与你的萌宠进行撸宠，洗澡，打扫，喂食等互动并收获不同数量的爱心值，每天的互动次数是有上限的哦。' }, 
        { text: '2. 通过完成任务中心的任务也可以获得爱心值。' }, 
        { text: '3. 通过好友助力功能邀请你的好友帮你给宠物喂食，每次助力可获得'+loveNum+'爱心值。' }, 
        { text: '领取饲料：' }, 
        { text: '1. 每天登录游戏签到即可获得50g饲料。' }, 
        { text: '2. 任务中心中的一些任务是可以获得饲料的，所以一定要记得每天完成任务为您的萌宠赚取饲料哦。' }, 
        { text: '兑换中心：' }, 
        { text: '累计一定数量的爱心值可以在兑换中心兑换优惠券/赠品券。数量有限，先到先得，具体以兑换界面数量为准。' }, 
    ];
    return rule.concat(getTimes());
}


function getTimes(){
    let ruleDetail = [];
    switch(app.config.brand){
        case 'JACKJONES':
        case 'ONLY':
        case 'VEROMODA':
        case 'SELECTED':
            ruleDetail =[
                { text: '活动细则:' }, 
                { text: '1. 活动时间为10月26日-11月15日。'}, 
                { text: '2. 凡在兑换中心兑换的优惠券使用时间截至2020年12月10日23：59：59，活动结束时爱心值未兑奖或优惠券到期未使用，将视为自动放弃，不予补发。' }, 
                { text: '3. 活动期间每位好友仅可以给同一人助力1次，每人每天可以给不同好友助力10次，每人每天有5次邀请好友助力机会。' }, 
                { text: getMsg() }, 
                { text: '5. 凡以不正当手段（包括但不限于作弊、刷奖，扰乱系统、实施网络攻击等）参与活动的用户，绫致有权在不事先通知的前提下撤销其活动资格并不予发放奖品或回收已发放的奖品。因此给绫致造成损失的，绫致有权向侵权者追究法律责任。' } 
            ]
            break;
        case 'FOL':
            ruleDetail =[
                { text: '活动细则:' }, 
                { text: '1. 活动时间为10月29日-11月15日。'}, 
                { text: '2. 凡在兑换中心兑换的优惠券使用时间截至2020年11月22日23：59：59，活动结束时或优惠券到期未兑奖或使用，将视为自动弃奖，不予补发。' }, 
                { text: '3. 活动期间每位好友仅可以给同一人助力1次，每人每天可以给不同好友助力10次。' }, 
                { text: '4.本次活动中，同一金额的优惠券每个用户ID最多可兑换3张。'}, 
                { text: '5. 凡以不正当手段（包括但不限于作弊、刷奖，扰乱系统、实施网络攻击等）参与活动的用户，绫致有权在不事先通知的前提下撤销其活动资格并不予发放奖品或回收已发放的奖品。因此给绫致造成损失的，绫致有权向侵权者追究法律责任。' } 
            ]
            break;
    }
    return ruleDetail;
}


function getMsg(){
    let strMsg = '';
    switch(app.config.brand){
        case 'JACKJONES':
            strMsg = '4.本次活动中，同一金额的优惠券每个用户id最多兑换1张，实物（电脑包/帆布包/毛线帽）最多可兑换一个。';
            break;
        case 'ONLY':
            strMsg = '4.本次活动中，同一金额的优惠券每个用户id最多兑换1张，实物（笔记本/毛线帽/项链）最多可兑换一个。';
            break;
        case 'VEROMODA':
            strMsg = '4.本次活动中，同一金额的优惠券每个用户id最多兑换1张，实物（雨伞/太阳镜/项链）最多可兑换一个。';
            break;
        case 'SELECTED':
            strMsg = '4.本次活动中，同一金额的优惠券每个用户id最多兑换1张，实物（丝巾/太阳镜/围巾）最多可兑换一个。';
            break;
        case 'FOL':
            strMsg = '4.本次活动中，同一金额的优惠券每个用户ID最多可兑换3张。';
            break;
    }
    return strMsg;
}

function getCoupons(_couponList){
    let coupons = [];
    switch(app.config.brand){
        case 'JACKJONES':
            coupons = getJJCoupons(_couponList);
            break;
        case 'ONLY':
            coupons = getONLYCoupons(_couponList);
            break;
        case 'VEROMODA':
            coupons = getVMCoupons(_couponList);
            break;
        case 'SELECTED':
            coupons = getSLTCoupons(_couponList);
            break;
        case 'FOL':
            coupons = getFOLCoupons(_couponList);
            break;
    }

    return coupons;
}

function getCouponRecord(_couponList){
    let coupons = [];
    switch(app.config.brand){
        case 'JACKJONES':
            coupons = getJJRecord(_couponList);
            break;
        case 'ONLY':
            coupons = getONLYRecord(_couponList);
            break;
        case 'VEROMODA':
            coupons = getVMRecord(_couponList);
            break;
        case 'SELECTED':
            coupons = getSLTRecord(_couponList);
            break;
        case 'FOL':
            coupons = getFOLRecord(_couponList);
            break;
    }

    return coupons;
}

function getJJCoupons(couponList){
    for (let i = 0; i < couponList.length; i++) {
        switch(couponList[i].promotionId){
            case '2YH92000718':
                couponList[i].exChangePic = splitImg("images/coupon_10.png", 'littlePet');
                break;
            case '2YH92000719':
                couponList[i].exChangePic = splitImg("images/coupon_20.png", 'littlePet');
                break;
            case '2CR12000720':
                couponList[i].exChangePic = splitImg("images/coupon_fbb.png", 'littlePet');
                break;
            case '2CR12000721':
                couponList[i].exChangePic = splitImg("images/coupon_mxm.png", 'littlePet');
                break;
            case '2CR12000722':
                couponList[i].exChangePic = splitImg("images/coupon_dnb.png", 'littlePet');
                break;
        }
    }

    return couponList;
}


function getONLYCoupons(couponList){
    for (let i = 0; i < couponList.length; i++) {
        switch(couponList[i].promotionId){
            case '1YH92000725':
                couponList[i].exChangePic = splitImg("images/coupon_10.png", 'littlePet');
                break;
            case '1YH92000726':
                couponList[i].exChangePic = splitImg("images/coupon_20.png", 'littlePet');
                break;
            case '1CR12000727':
                couponList[i].exChangePic = splitImg("images/coupon_bjb.png", 'littlePet');
                break;
            case '1CR12000728':
                couponList[i].exChangePic = splitImg("images/coupon_mxm.png", 'littlePet');
                break;
            case '1CR12000729':
                couponList[i].exChangePic = splitImg("images/coupon_xl.png", 'littlePet');
                break;
        }
    }

    return couponList;
}



function getSLTCoupons(couponList){
    for (let i = 0; i < couponList.length; i++) {
        switch(couponList[i].promotionId){
            case '4YH92000476':
                couponList[i].exChangePic = splitImg("images/coupon_10.png", 'littlePet');
                break;
            case '4YH92000477':
                couponList[i].exChangePic = splitImg("images/coupon_20.png", 'littlePet');
                break;
            case '4CR12000478':
                couponList[i].exChangePic = splitImg("images/coupon_wj.png", 'littlePet');
                break;
            case '4CR12000479':
                couponList[i].exChangePic = splitImg("images/coupon_sj.png", 'littlePet');
                break;
            case '4CR12000480':
                couponList[i].exChangePic = splitImg("images/coupon_tyj.png", 'littlePet');
                break;
        }
    }

    return couponList;
}



function getVMCoupons(couponList){
    for (let i = 0; i < couponList.length; i++) {
        switch(couponList[i].promotionId){
            case '3YH92000557':
                couponList[i].exChangePic = splitImg("images/coupon_10.png", 'littlePet');
                break;
            case '3YH92000558':
                couponList[i].exChangePic = splitImg("images/coupon_20.png", 'littlePet');
                break;
            case '3CR12000559':
                couponList[i].exChangePic = splitImg("images/coupon_ys.png", 'littlePet');
                break;
            case '3CR12000560':
                couponList[i].exChangePic = splitImg("images/coupon_tyj.png", 'littlePet');
                break;
            case '3CR12000561':
                couponList[i].exChangePic = splitImg("images/coupon_xl.png", 'littlePet');
                break;
        }
    }

    return couponList;
}



function getFOLCoupons(couponList){
    for (let i = 0; i < couponList.length; i++) {
        switch(couponList[i].promotionId){
            case 'ZYH92000672':
                couponList[i].exChangePic = splitImg("images/coupon_5.png", 'littlePet');
                break;
            case 'ZYH92000673':
                couponList[i].exChangePic = splitImg("images/coupon_10.png", 'littlePet');
                break;
            case 'ZYH92000674':
                couponList[i].exChangePic = splitImg("images/coupon_15.png", 'littlePet');
                break;
            case 'ZYH92000675':
                couponList[i].exChangePic = splitImg("images/coupon_20.png", 'littlePet');
                break;
            case 'ZYH92000676':
                couponList[i].exChangePic = splitImg("images/coupon_30.png", 'littlePet');
                break;
            case 'ZYH92000677':
                couponList[i].exChangePic = splitImg("images/coupon_50.png", 'littlePet');
                break;
            case 'ZYH92000678':
                couponList[i].exChangePic = splitImg("images/coupon_119.png", 'littlePet');
                break;
            case 'ZYH92000679':
                couponList[i].exChangePic = splitImg("images/coupon_199.png", 'littlePet');
                break;
            case 'ZYH92000680':
                couponList[i].exChangePic = splitImg("images/coupon_299.png", 'littlePet');
                break;
        }
    }

    return couponList;
}

function getJJRecord(couponList){
    for (let i = 0; i < couponList.length; i++) {
        switch(couponList[i].giftInfo.promotionId){
            case '2YH92000718':
                couponList[i].alreadGetPic = splitImg("images/coupon_10_get.png", 'littlePet');
                break;
            case '2YH92000719':
                couponList[i].alreadGetPic = splitImg("images/coupon_20_get.png", 'littlePet');
                break;
            case '2CR12000720':
                couponList[i].alreadGetPic = splitImg("images/coupon_fbb_get.png", 'littlePet');
                break;
            case '2CR12000721':
                couponList[i].alreadGetPic = splitImg("images/coupon_mxm_get.png", 'littlePet');
                break;
            case '2CR12000722':
                couponList[i].alreadGetPic = splitImg("images/coupon_dnb_get.png", 'littlePet');
                break;
        }
    }

    return couponList;
}


function getONLYRecord(couponList){
    for (let i = 0; i < couponList.length; i++) {
        switch(couponList[i].giftInfo.promotionId){
            case '1YH92000725':
                couponList[i].alreadGetPic = splitImg("images/coupon_10_get.png", 'littlePet');
                break;
            case '1YH92000726':
                couponList[i].alreadGetPic = splitImg("images/coupon_20_get.png", 'littlePet');
                break;
            case '1CR12000727':
                couponList[i].alreadGetPic = splitImg("images/coupon_bjb_get.png", 'littlePet');
                break;
            case '1CR12000728':
                couponList[i].alreadGetPic = splitImg("images/coupon_mxm_get.png", 'littlePet');
                break;
            case '1CR12000729':
                couponList[i].alreadGetPic = splitImg("images/coupon_xl_get.png", 'littlePet');
                break;
        }
    }

    return couponList;
}



function getSLTRecord(couponList){
    for (let i = 0; i < couponList.length; i++) {
        switch(couponList[i].giftInfo.promotionId){
            case '4YH92000476':
                couponList[i].alreadGetPic = splitImg("images/coupon_10_get.png", 'littlePet');
                break;
            case '4YH92000477':
                couponList[i].alreadGetPic = splitImg("images/coupon_20_get.png", 'littlePet');
                break;
            case '4CR12000478':
                couponList[i].alreadGetPic = splitImg("images/coupon_wj_get.png", 'littlePet');
                break;
            case '4CR12000479':
                couponList[i].alreadGetPic = splitImg("images/coupon_sj_get.png", 'littlePet');
                break;
            case '4CR12000480':
                couponList[i].alreadGetPic = splitImg("images/coupon_tyj_get.png", 'littlePet');
                break;
        }
    }

    return couponList;
}



function getVMRecord(couponList){
    for (let i = 0; i < couponList.length; i++) {
        switch(couponList[i].giftInfo.promotionId){
            case '3YH92000557':
                couponList[i].alreadGetPic = splitImg("images/coupon_10_get.png", 'littlePet');
                break;
            case '3YH92000558':
                couponList[i].alreadGetPic = splitImg("images/coupon_20_get.png", 'littlePet');
                break;
            case '3CR12000559':
                couponList[i].alreadGetPic = splitImg("images/coupon_ys_get.png", 'littlePet');
                break;
            case '3CR12000560':
                couponList[i].alreadGetPic = splitImg("images/coupon_tyj_get.png", 'littlePet');
                break;
            case '3CR12000561':
                couponList[i].alreadGetPic = splitImg("images/coupon_xl_get.png", 'littlePet');
                break;
        }
    }

    return couponList;
}



function getFOLRecord(couponList){
    for (let i = 0; i < couponList.length; i++) {
        switch(couponList[i].giftInfo.promotionId){
            case 'ZYH92000672':
                couponList[i].alreadGetPic = splitImg("images/coupon_5_get.png", 'littlePet');
                break;
            case 'ZYH92000673':
                couponList[i].alreadGetPic = splitImg("images/coupon_10_get.png", 'littlePet');
                break;
            case 'ZYH92000674':
                couponList[i].alreadGetPic = splitImg("images/coupon_15_get.png", 'littlePet');
                break;
            case 'ZYH92000675':
                couponList[i].alreadGetPic = splitImg("images/coupon_20_get.png", 'littlePet');
                break;
            case 'ZYH92000676':
                couponList[i].alreadGetPic = splitImg("images/coupon_30_get.png", 'littlePet');
                break;
            case 'ZYH92000677':
                couponList[i].alreadGetPic = splitImg("images/coupon_50_get.png", 'littlePet');
                break;
            case 'ZYH92000678':
                couponList[i].alreadGetPic = splitImg("images/coupon_119_get.png", 'littlePet');
                break;
            case 'ZYH92000679':
                couponList[i].alreadGetPic = splitImg("images/coupon_199_get.png", 'littlePet');
                break;
            case 'ZYH92000680':
                couponList[i].alreadGetPic = splitImg("images/coupon_299_get.png", 'littlePet');
                break;
        }
    }

    return couponList;
}


function popMsg(_option){
    let messages = [];
    switch(app.config.brand){
        case 'JACKJONES':
            messages = popMsgJJ(_option);
            break;
        case 'ONLY':
            messages = popMsgONLY(_option);
            break;
        case 'VEROMODA':
            messages = popMsgVM(_option);
            break;
        case 'SELECTED':
            messages = popMsgSLT(_option);
            break;
        case 'FOL':
            messages = popMsgFOL(_option);
            break;
    }

    return messages;
}

function popMsgSLT(option){
    let messages = [];
    switch(option){
        case 'feel':
            messages= ["主人，我会开心也会闹情绪，要照顾好我哦~",
                          "哎呀，好舒服，都快要睡着了~",
                          "主人，你终于回来啦~我好想你~ "]
            break;
        case 'bathtub':
            messages = ["主人回来啦，快来帮我洗澡吧~",
                          "小主给我洗澡，真是享受啊~",
                          "洗澡睡觉觉~主人晚安啦~"]
            break;
        case 'clear':
            messages= ["主人，你回来啦~快来帮我铲屎吧~",
                          "铲屎不积极，思想有问题~",
                          "小主， 醒一醒该去铲屎啦 ~"]
            break;
        case 'feed':
            messages = ["主人！肚子饿，要吃饭饭啦~",
                          "主人，快来喂我吃饭和出去玩了~ ",
                          "爱我，喂我，别丢下我~"]
            break;
        default:
            messages = ["这么有型的穿搭，主人也一定会喜欢~", "这么有型的穿搭，主人也一定会喜欢~", "这么有型的穿搭，主人也一定会喜欢~"]
            break;
    }

    return messages[Math.floor(Math.random()*3)]
}


function popMsgJJ(option){
    let msg = '';
    let messages = [];
    switch(option){
        case 'feel':
            messages= ["哈哈哈，今天的我也“潮”可爱呀~",
                          "哎呀，好舒服，都快要睡着了~",
                          "主人，你终于回来啦~我好想你~ "]
            break;
        case 'bathtub':
            messages = ["洗澡之前，需要主人安抚一下哦~",
                          "小主给我洗澡，真是享受啊~",
                          "洗澡睡觉觉~主人晚安啦~"]
            break;
        case 'clear':
            messages= ["主人，要正确处理便便，才能更好的保护环境哦~",
                          "铲屎不积极，思想有问题~",
                          "小主， 醒一醒该去铲屎啦 ~"]
            break;
        case 'feed':
            messages = ["食物虽美味，但我不会贪吃哦~",
                          "主人，快来喂我吃饭和出去玩了~ ",
                          "爱我，喂我，别丢下我~"]
            break;
        default:
            messages = ["只要装扮的好，就是全场最靓的崽~", "只要装扮的好，就是全场最靓的崽~", "只要装扮的好，就是全场最靓的崽~"]
            break;
    }

    return messages[Math.floor(Math.random()*3)]
}


function popMsgONLY(option){
    let msg = '';
    let messages = [];
    switch(option){
        case 'feel':
            messages= ["有主人在身边，简直幸福到冒泡~",
                          "哎呀，好舒服，都快要睡着了~",
                          "主人，你终于回来啦~我好想你~ "]
            break;
        case 'bathtub':
            messages = ["我爱洗澡皮肤好好，今天也要精致哦~",
                          "小主给我洗澡，真是享受啊~",
                          "洗澡睡觉觉~主人晚安啦~"]
            break;
        case 'clear':
            messages= ["主人，你真是个贴心的铲屎官~",
                          "铲屎不积极，思想有问题~",
                          "小主， 醒一醒该去铲屎啦 ~"]
            break;
        case 'feed':
            messages = ["感谢小主的投喂，请接收我的爱心吧~",
                          "主人，快来喂我吃饭和出去玩了~ ",
                          "爱我，喂我，别丢下我~"]
            break;
        default:
            messages = ["时髦的主人带着时髦的我~今天都很上镜哦~", "时髦的主人带着时髦的我~今天都很上镜哦~", "时髦的主人带着时髦的我~今天都很上镜哦~"]
            break;    
    }

    return messages[Math.floor(Math.random()*3)]
}


function popMsgVM(option){
    let msg = '';
    let messages = [];
    switch(option){
        case 'feel':
            messages= ["主人，你的可爱萌宠上线，让我来治愈你吧！",
                          "哎呀，好舒服，都快要睡着了~",
                          "主人，你终于回来啦~我好想你~ "]
            break;
        case 'bathtub':
            messages = ["多洗澡澡，洗香香才能变漂亮哦~",
                          "小主给我洗澡，真是享受啊~",
                          "洗澡睡觉觉~主人晚安啦~"]
            break;
        case 'clear':
            messages= ["主人，要认真检查弄干净哦~",
                          "铲屎不积极，思想有问题~",
                          "小主， 醒一醒该去铲屎啦 ~"]
            break;
        case 'feed':
            messages = ["今天胃口真好，吃饱了才有力气减肥啊~",
                          "主人，快来喂我吃饭和出去玩了~ ",
                          "爱我，喂我，别丢下我~"]
            break;
        default:
            messages = ["只要装扮的好，就是全场最靓的崽~", "只要装扮的好，就是全场最靓的崽~", "只要装扮的好，就是全场最靓的崽~"]
            break;   
    }

    return messages[Math.floor(Math.random()*3)]
}


function popMsgFOL(option){
    let msg = '';
    let messages = [];
    switch(option){
        case 'feel':
            messages= ["主人，再忙也要记得摸摸我呀~",
                          "哎呀，好舒服，都快要睡着了~",
                          "主人，你终于回来啦~我好想你~ "]
            break;
        case 'bathtub':
            messages = ["主人快来和我一起洗去一天的疲惫吧~",
                        "讨厌啦，人家洗澡你也看~",
                        "泡沫打起来~烦恼都冲开~",
                          "小主给我洗澡，真是享受啊~",
                          "洗澡睡觉觉~主人晚安啦~"]
            break;
        case 'clear':
            messages= ["主人，要多多喂我才会获得爱心❤哦~",
                          "铲屎不积极，思想有问题~",
                          "小主， 醒一醒该去铲屎啦 ~"]
            break;
        case 'feed':
            messages = ["今天胃口真好，吃饱了才有力气减肥啊~",
                          "主人，快来喂我吃饭和出去玩了~ ",
                          "爱我，喂我，别丢下我~"]
            break;
        default:
            messages = ["全网最靓的崽要出门放风啦~", "全网最靓的崽要出门放风啦~", "全网最靓的崽要出门放风啦~"]
            break;   
    }

    return messages[Math.floor(Math.random()*3)]
}


function giftImage(giftInfo){
    let giftImg = '';
    switch(giftInfo){
        case '10':
            giftImg = splitImg("images/pet_openBox_10.png", 'littlePet');
            break;
        case '20':
            giftImg = splitImg("images/pet_openBox_20.png", 'littlePet');
            break;
        case '666':
            giftImg = splitImg("images/pet_openBox_666.png", 'littlePet');
            break;    
    }
    return giftImg;
}

export {
    rules,
    getCoupons,
    popMsg,
    getCouponRecord,
    giftImage
}
