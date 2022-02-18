module.exports = {
  //小程序ID
  ID: {
/*
    wxa3d9d2199eeded73 ONLY
    wx7f1b0d611e93dea4 JJ
    wxccfd1cc23fce2fe5 VM
*/
    JACKJONES: {
      "appid": "wx7f1b0d611e93dea4",
      "projectname": "JACKJONES",
      "usingShopPlugin": true,
      // 需要打开的APPid
      "appIdList": [
        // weMember
        "wx74efb237d78c62f8",
        // 集卡
        "wx492b5b2f87cc304a",
        // ONLY
        "wxa3d9d2199eeded73",
        // VM
        "wxccfd1cc23fce2fe5"
      ]
    },
    /*JLINDEBERG: {
      "appid": "wx62f300519c55c400",
      "projectname": "JLINDEBERG",
      // 需要打开的APPid
      "appIdList": [
        // weMember
        "wx38198fc9409093f3",
        // 集卡
        "wxf90cbbef5788bf24"
      ]
    },
    NAMEIT: {
      "appid": "wx77598b397deea286",
      "projectname": "NAMEIT",
      // 需要打开的APPid
      "appIdList": []
    },*/
    ONLY: {
      "appid": "wxa3d9d2199eeded73",
      "projectname": "ONLY",
      "usingShopPlugin": true,
      // 需要打开的APPid
      "appIdList": [
        // weMember
        "wx5b5a319ad751562f",
        // 集卡
        "wxf594102a90b440f5",
        // JJ
        "wx7f1b0d611e93dea4",
        // VM
        "wxccfd1cc23fce2fe5"
      ]
    },
    SELECTED: {
      "appid": "wxeb2f4c579a95f94e",
      "projectname": "SELECTED",
      "usingShopPlugin": true,
      // 需要打开的APPid
      "appIdList": [
        // weMember
        "wx49a2655481a77027",
        // 集卡
        "wx89b08bac92d73db0"
      ]
    },
    VEROMODA: {
      "appid": "wxccfd1cc23fce2fe5",
      "projectname": "VEROMODA",
      "usingShopPlugin": true,
      // 需要打开的APPid
      "appIdList": [
        // weMember
        "wx353ae2790f810983",
        // 集卡
        "wxda7b2ae50ca3e1bf",
        // ONLY
        "wxa3d9d2199eeded73",
        // JJ
        "wx7f1b0d611e93dea4",
	      // 游戏
	      "wxb6b580d843ea5a98",
      ]
    },
    BESTSELLER: {
      "appid": "wx3f644b3610eb9b20",
      "projectname": "BESTSELLER",
      "usingShopPlugin": false,
      // 需要打开的APPid
      "appIdList": []
    },
    FOL: {
      "appid": "wx22a009dec5fd4b88",
      "projectname": "FOL",
      "usingShopPlugin": false,
      // 需要打开的APPid
      "appIdList": [
        // weMember
        "wxef8967f52ab3d329",
        // 集卡
        "wxb0200ea401dccbc1"
      ],
      "tabBar": {
        "color": "#999",
        "selectedColor": "#000",
        "borderStyle": "black",
        "backgroundColor": "#fafafa",
        "list": [
          {
            "pagePath": "pages/index/index",
            "iconPath": "images/bar1_old.png",
            "selectedIconPath": "images/bar1_hover.png",
            "text": "购物商城"
          },
          {
            "pagePath": "pages/memberCenter/memberCenter",
            "iconPath": "images/bar2_old.png",
            "selectedIconPath": "images/bar2_hover.png",
            "text": "会员中心"
          },
          {
            "pagePath": "pages/informat/informat",
            "iconPath": "images/bar3_old.png",
            "selectedIconPath": "images/bar3_hover.png",
            "text": "潮流资讯"
          },
          {
            "pagePath": "pages/weMember/weMember",
            "iconPath": "images/bar4_old.png",
            "selectedIconPath": "images/bar4_hover.png",
            "text": "导购天地"
          },
          {
            "pagePath": "pages/nearbyShops/main/main",
            "iconPath": "images/bar5_old.png",
            "selectedIconPath": "images/bar5_hover.png",
            "text": "附近门店"
          }
        ]
      },
    }
  },
  // 每个品牌需要展示的底部导航
  TabBar: {
    JACKJONES: ["购物商城", "导购天地", "购物袋", "潮流资讯", "我的"],
    ONLY: ["购物商城", "导购天地", "购物袋", "潮流资讯", "我的"],
    SELECTED: ["购物商城", "导购天地", "购物袋", "潮流资讯", "我的"],
    VEROMODA: ["购物商城", "导购天地", "购物袋", "潮流资讯", "我的"],
    BESTSELLER: ["购物商城", "购物袋", "潮流资讯", "我的"],
  }
}
