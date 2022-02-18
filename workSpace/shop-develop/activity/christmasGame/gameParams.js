const brand = getApp().config.brand
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${brand}/christmas/`
const version = Date.now();
// const versionText = `?v=${version}`
const versionText = ``
exports.IMG = {
    imgPath,
    bgImg : `${imgPath}gameBg.jpg${versionText}`,
    overBgImg : `${imgPath}overGameBg.jpg${versionText}`,
    shuImg : `${imgPath}shu.png${versionText}`,
    renwuImg : {
        img : `${imgPath}renwu1.gif${versionText}`,
        width : 220,
        height : 270,
        jumpImg : `${imgPath}renwu2.png${versionText}`
    },
    toumingImg : `${imgPath}touming.png${versionText}`,
    qiziImg : `${imgPath}qizi.png${versionText}`,
    gongxiImg : `${imgPath}gongxi.png${versionText}`,
    yihanImg : `${imgPath}canNotPlay.png${versionText}`,
    bouncedBtnImg : `${imgPath}bouncedBtn.png${versionText}`,
    img3 : `${imgPath}3.png${versionText}`,
    img2 : `${imgPath}2.png${versionText}`,
    img1 : `${imgPath}1.png${versionText}`,

    fristImgs : [

      {
        scale: 5622,
        img1: `${imgPath}first1_750.jpg${versionText}`,
        img2: `${imgPath}first2_750.jpg${versionText}`,
        topHeight : 275
      },
      {
        scale: 4618,
        img1: `${imgPath}first1_1125.jpg${versionText}`,
        img2: `${imgPath}first2_1125.jpg${versionText}`,
        topHeight : 335
      }
    
    ],
    backImg : `${imgPath}sanjiao-left.png${versionText}`,
    xuehuaArr : [`${imgPath}xuehua11.png${versionText}`,`${imgPath}xuehua22.png${versionText}`,`${imgPath}xuehua33.png${versionText}`,`${imgPath}xuehua11.png${versionText}`,`${imgPath}xuehua22.png${versionText}`,`${imgPath}xuehua33.png${versionText}`],
    shareImg : `${imgPath}shareImg.png${versionText}`,

}
exports.WELCOME = {
    imgPath,
    xuehuaArr : [`${imgPath}xuehua11.png${versionText}`,`${imgPath}xuehua22.png${versionText}`,`${imgPath}xuehua33.png${versionText}`,`${imgPath}xuehua11.png${versionText}`,`${imgPath}xuehua22.png${versionText}`,`${imgPath}xuehua33.png${versionText}`],
    splashImgList : [

        {
          scale: 5622,
          img: `${imgPath}welComeBg750.jpg${versionText}`, // 375/667 iphone 7
        },
        {
          scale: 4618,
          img: `${imgPath}welComeBg1125.jpg${versionText}`  // 375/812 iphoneX
        }
      
      ],
      // 宝箱奖品
    baoxiang : [
        {
            title : '20元优惠券一张',
            image : `${imgPath}coupon_openbox20.png${versionText}`,
            bgImage : `${imgPath}box.png${versionText}`
        },
        {
            title : '10元优惠券一张',
            image : `${imgPath}coupon_openBox10.png${versionText}`,
            bgImage : `${imgPath}box.png${versionText}`
        },{
            title : '15元优惠券一张',
            image : `${imgPath}coupon_openBox15@2x.png${versionText}`,
            bgImage : `${imgPath}box.png${versionText}`
        },{
            title : '3000金币',
            image : `${imgPath}coupon_openBox3000.png${versionText}`,
            bgImage : `${imgPath}box.png${versionText}`
        },{
            title : '5000金币',
            image : `${imgPath}coupon_openBox5000.png${versionText}`,
            bgImage : `${imgPath}box.png${versionText}`
        }
      ],
      backImg : `${imgPath}sanjiao-left.png${versionText}`,
      friends:{
        bgImg : `${imgPath}friends.png${versionText}`,
        list : [
          {icon : '',name : '',defIcon : `${imgPath}kq0.png${versionText}`,otherIcon : `${imgPath}kq1.png${versionText}`,otherName : '+开启1次'},
          {icon : '',name : '',defIcon : `${imgPath}kq0.png${versionText}`,otherIcon : `${imgPath}kq1.png${versionText}`,otherName : '+开启1次'},
          {icon : '',name : '',defIcon : `${imgPath}kq0.png${versionText}`,otherIcon : `${imgPath}kq1.png${versionText}`,otherName : '+开启1次'},
          {icon : '',name : '',defIcon : `${imgPath}kq0.png${versionText}`,otherIcon : `${imgPath}kq1.png${versionText}`,otherName : '+开启1次'},
          {icon : '',name : '',defIcon : `${imgPath}kq0.png${versionText}`,otherIcon : `${imgPath}kq2.png${versionText}`,otherName : '开启宝箱'}
        ]
      },
      jinbi : `${imgPath}jinbi.png${versionText}`,
      duihuan : `${imgPath}duihuan.png${versionText}`,

      startGame : `${imgPath}startGame.gif${versionText}`,
      canNotPlay : `${imgPath}canNotPlay.png${versionText}`,
      bouncedBtn : `${imgPath}bouncedBtn.png${versionText}`,
      shareImg : `${imgPath}shareImg.png${versionText}`,


}
exports.TICKET = {
  jinbiImg :`${imgPath}ticketJB.png${versionText}`,
  bouncedBtn : `${imgPath}bouncedBtn.png${versionText}`,
  canPlay : `${imgPath}gongxi.png${versionText}`
}
exports.ZHULI = {
  splashImgList : [

    {
      scale: 5622,
      img: `${imgPath}zhuli750.jpg${versionText}`, // 375/667 iphone 7
      adapter : 0
    },
    {
      scale: 4618,
      img: `${imgPath}zhuli1125.jpg${versionText}`,  // 375/812 iphoneX
      adapter : 1
    }
  
  ],
  zhuliBgImg : `${imgPath}zhuliImg.png${versionText}`,
  bouncedBtn : `${imgPath}bouncedBtn.png${versionText}`
}