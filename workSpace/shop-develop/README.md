## TODO

### 1、整理分支

1.1、清理无用的分支

```bash
remotes/origin/develop
remotes/origin/develop
remotes/origin/feature-customization
remotes/origin/develop
remotes/origin/feature-new-order
remotes/origin/feature-new-wemall
remotes/origin/feature-online-service
remotes/origin/feature-release
remotes/origin/feature_new_activity
remotes/origin/game
remotes/origin/makai_dev
remotes/origin/master
remotes/origin/new_wxsubscribe
remotes/origin/qs-feature-share
remotes/origin/release
remotes/origin/zixun
```

1.2、引用Git工作流

> 使用相对简单的Flow: master 作为保护分支，develop 作为开发分支，release 作为发布分支，feature-xxx 作为新的功能分支，hotfix-xxx 作为修复Bug分支

```bash
hotfix-xxx
feature-xxx
develop
release
master
```

1.3、规范团队 commit 信息标准

```bash
...
```

1.4、使用 Tag

> 大版本都要按时打tag
```
...
```

1.5、使用发布分支

使用`release`最为发布分支，代码由`develop`分支，`merge`进入 `release` 后再进行发布。

### 2、使用新的图形化工具

使用新开发的图形化工具管理不同品牌


### 3、整理文件夹

处理项目根目录文件夹过多的问题。

### 4、游戏页面路径
九宫格抽奖：
games/pages/turntablePromotion/turntablePromotion?gameCode=JJ202111

VM抽奖： 
activity/games/lottery/lotteryVm/lottery?actname=wechatgroup0817&bgColor=d5d0bc

会员日抽奖：
games/pages/turntableMemberDay/turntableMemberDay?gameCode=20210815

分享裂变：activity/couponShareFOL/shareIndex/shareIndex

