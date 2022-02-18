const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;

const url = 'https://tc.woaap.com/lingzhi/fightgroup/'

let times = new Date().getTime()

let bg_s = ''
let bg = ''
let brandimg = ''
let couponbg = ''
let groupbg_s = ''
let groupbg = ''
let groupsuc = ''
let posterbg = ''
let rulebg = ''
let share = ''
let basecolor = ''


let coupon = ''
let indexcard = ''
let rule_close = ''
let rule_next = ''
let rule_bottom = ''
let alert_tip = ''
let succes = ''
let groupcardbg = ''
let jointip = ''
let jointip2 = ''
let fail = ''
let brandwidth = ''
let brandheight = ''
let rulewidth = ''
let ruleheight = ''
let postershare = ''
let unknow = `${url}unkonw.png`

let couponlist = []



//首页图片
let indexList = [1,2,3,11,12]

let ruleList = [9,13,14]
let groupList = [5,6,17,18]
let failList = [5,6,17,20]
let couponList = [4,19]
switch (brand) {
    case 'JLINDEBERG':
        bg_s = `${url}jl-bg-s.png`
        bg = `${url}jl-bg.png`
        brandimg = `${url}jl-brand.png`
        couponbg = `${url}jl-couponbg.png`
        groupbg_s = `${url}jl-groupbg-s.png`
        groupbg = `${url}jl-groupbg.png`
        groupsuc = `${url}jl-groupsuc.png`
        posterbg = `${url}jl-posterbg.png`
        rulebg = `${url}jl-rulebg.png`
        share = `${url}jl-share.jpg?times=${times}`
        coupon = `${url}jl-coupon.png`
        indexcard = `${url}jl-indexcard.png`
        rule_close = `${url}jl-rule-close.png`
        rule_next = `${url}jl-rule-next.png`
        rule_bottom = `${url}jl-rule-bottom.png`
        alert_tip = `${url}jl-alert-tip.png`
        succes = `${url}jl-succes.png`
        groupcardbg = `${url}jl-groupcardbg.png`
        jointip = `${url}jl-jointip.png`
        jointip2 = `${url}jl-jointip2.png`
        fail = `${url}jl-fail.png`
        brandwidth = 362
        brandheight = 88
        couponlist = [
            { price: 15, tip: '满99使用' },
            { price: 49, tip: '满299使用' },
            { price: 89, tip: '满349使用' }
        ]
        postershare = `${url}jl-postershare.png`

        basecolor = '#a24c3d'
        break;
    case 'JACKJONES':
        bg_s = `${url}jj-bg-s.png`
        bg = `${url}jj-bg.png`
        brandimg = `${url}jj-brand.png`
        couponbg = `${url}jj-couponbg.png`
        groupbg_s = `${url}jj-groupbg-s.png`
        groupbg = `${url}jj-groupbg.png`
        groupsuc = `${url}jj-groupsuc.png`
        posterbg = `${url}jj-posterbg.png`
        rulebg = `${url}jj-rulebg.png`
        share = `${url}jj-share.jpg?times=${times}`
        coupon = `${url}jj-coupon.png`
        indexcard = `${url}jj-indexcard.png`
        rule_close = `${url}jj-rule-close.png`
        rule_next = `${url}jj-rule-next.png`
        rule_bottom = `${url}jj-rule-bottom.png`
        alert_tip = `${url}jj-alert-tip.png`
        succes = `${url}jj-succes.png`
        groupcardbg = `${url}jj-groupcardbg.png`
        jointip = `${url}jj-jointip.png`
        jointip2 = `${url}jj-jointip2.png`
        fail = `${url}jj-fail.png`
        brandwidth = 370
        brandheight = 32
        rulewidth = 652
        ruleheight = 434
        couponlist = [
            { price: 60, tip: '满400使用' },
            { price: 90, tip: '满600使用' },
            { price: 120, tip: '满800使用' }
        ]
        postershare = `${url}jj-postershare.png`

        basecolor = '#e64530'
        break;
    case 'SELECTED':
        bg_s = `${url}sel-bg-s.jpg`
        bg = `${url}sel-bg.jpg`
        brandimg = `${url}sel-brand.png`
        couponbg = `${url}sel-couponbg.png`
        groupbg_s = `${url}sel-groupbg-s.jpg`
        groupbg = `${url}sel-groupbg.jpg`
        groupsuc = `${url}sel-groupsuc.png`
        posterbg = `${url}sel-posterbg.png`
        rulebg = `${url}sel-rulebg.jpg`
        share = `${url}sel-share.jpg?times=${times}`
        coupon = `${url}sel-coupon.png`
        indexcard = `${url}sel-indexcard.png`
        rule_close = `${url}sel-rule-close.png`
        rule_next = `${url}sel-rule-next.png`
        rule_bottom = `${url}sel-rule-bottom.png`
        alert_tip = `${url}sel-alert-tip.png`
        succes = `${url}sel-succes.png`
        groupcardbg = `${url}sel-groupcardbg.png`
        jointip = `${url}sel-jointip.png`
        jointip2 = `${url}sel-jointip2.png`
        fail = `${url}sel-fail.png`
        brandwidth = 408
        brandheight = 44
        rulewidth = 652
        ruleheight = 434
        couponlist = [
            { price: 50, tip: '无门槛券' },
            { price: '礼品兑换券', tip: '' },
            { price: 50, tip: '满500使用' }
        ]
        postershare = `${url}sel-postershare.png`

        basecolor = '#e03642'
        break;
    case 'ONLY':
        bg_s = `${url}only-bg-s.png`
        bg = `${url}only-bg.png`
        brandimg = `${url}only-brand.png`
        couponbg = `${url}only-couponbg.png`
        groupbg_s = `${url}only-groupbg-s.png`
        groupbg = `${url}only-groupbg.png`
        groupsuc = `${url}only-groupsuc.png`
        posterbg = `${url}only-posterbg.png`
        rulebg = `${url}only-rulebg.png`
        share = `${url}only-share.jpg?times=${times}`
        coupon = `${url}only-coupon.png`
        indexcard = `${url}only-indexcard.png`
        rule_close = `${url}only-rule-close.png`
        rule_next = `${url}jj-rule-next.png`
        rule_bottom = `${url}only-rule-bottom.png`
        alert_tip = `${url}only-alert-tip.png`
        succes = `${url}only-succes.png`
        groupcardbg = `${url}only-groupcardbg.png`
        jointip = `${url}only-jointip.png`
        jointip2 = `${url}only-jointip2.png`
        fail = `${url}only-fail.png`
        brandwidth = 193
        brandheight = 45
        couponlist = [
            { price: 70, tip: '满500使用' },
            { price: 120, tip: '满800使用' },
            { price: 150, tip: '满1000使用' }
        ]
        postershare = `${url}only-postershare.png`

        basecolor = '#e03642'
        // basecolor = '#21e02a'
        break;
    case 'VEROMODA':
        bg_s = `${url}vm-bg-s.png`
        bg = `${url}vm-bg.png`
        brandimg = `${url}vm-brand.png`
        couponbg = `${url}vm-couponbg.png`
        groupbg_s = `${url}vm-groupbg-s.png`
        groupbg = `${url}vm-groupbg.png`
        groupsuc = `${url}vm-groupsuc.png`
        posterbg = `${url}vm-posterbg.png`
        rulebg = `${url}vm-rulebg.png`
        share = `${url}vm-share.jpg`
        coupon = `${url}vm-coupon.png`
        indexcard = `${url}vm-indexcard.png`
        rule_close = `${url}vm-rule-close.png`
        rule_next = `${url}vm-rule-next.png`
        rule_bottom = `${url}vm-rule-bottom.png`
        alert_tip = `${url}vm-alert-tip.png`
        succes = `${url}vm-succes.png`
        groupcardbg = `${url}vm-groupcardbg.png`
        jointip = `${url}vm-jointip.png`
        jointip2 = `${url}vm-jointip2.png`
        fail = `${url}vm-fail.png`
        brandwidth = 371
        brandheight = 39
        basecolor = '#c66a78'
        couponlist = [
            { price: 70, tip: '满500使用' },
            { price: 120, tip: '满800使用' },
            { price: 150, tip: '满1000使用' }
        ]
        postershare = `${url}vm-postershare.png`
        break;
    case 'FOL':
        bg_s = `${url}fol-bg-s.png`
        bg = `${url}fol-bg.png`
        brandimg = `${url}fol-brand.png`
        couponbg = `${url}fol-couponbg.png`
        groupbg_s = `${url}fol-groupbg-s.png`
        groupbg = `${url}fol-groupbg.png`
        groupsuc = `${url}fol-groupsuc.png`
        posterbg = `${url}fol-posterbg.png?times=${times}`
        rulebg = `${url}fol-rulebg.png`
        share = `${url}fol-share.jpg?times=${times}`
        coupon = `${url}fol-coupon.png`
        indexcard = `${url}fol-indexcardbg.png`
        rule_close = `${url}fol-rule-close.png`
        rule_next = `${url}fol-rule-next.png`
        rule_bottom = `${url}fol-rule-bottom.png`
        alert_tip = `${url}fol-alert-tip.png`
        succes = `${url}fol-succes.png`
        groupcardbg = `${url}fol-groupcardbg.png`
        jointip = `${url}fol-jointip.png`
        jointip2 = `${url}fol-jointip2.png`
        fail = `${url}fol-fail.png`
        brandwidth = 358
        brandheight = 92
        basecolor = '#a24c3d'
        couponlist = [
            { price: 15, tip: '满99使用' },
            { price: 49, tip: '满229使用' },
            { price: 89, tip: '满349使用' }
        ]
        postershare = `${url}fol-postershare.png?times=${times}`
        break;
}

export default {
    bg_s,
    bg,
    brandimg,
    couponbg,
    groupbg_s,
    groupbg,
    groupsuc,
    posterbg,
    rulebg,
    share,
    basecolor,
    coupon,
    indexcard,
    rule_close,
    rule_next,
    rule_bottom,
    alert_tip,
    succes,
    unknow,
    groupcardbg,
    jointip,
    jointip2,
    fail,
    brandwidth,
    brandheight,
    couponlist,
    postershare,

    //最新拼团用到的图片
    indexList,
    groupList,
    ruleList,
    failList,
    couponList,
}
