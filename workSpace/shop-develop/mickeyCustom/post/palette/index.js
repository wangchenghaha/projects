export default class Index {
  palette(postMessage, imgUrl) {
    const res = wx.getSystemInfoSync();
    return {
      // background: '/pages/post/palette/post.png',
      width: '750rpx',
      height: `110rpx`,
      background: '#123456',
      views: [
        // {
        //   type: 'image',
        //   url: `/pages/post/palette/post.png`,
        //   css: {
        //     top: '0rpx',
        //     left: '0rpx',
        //     width: '750rpx',
        //     height: '140rpx',
        //   },
        // },
        // {
        //   type: 'image',
        //   url: '/pages/post/palette/sky.jpg',
        //   css: {
        //     width: '300rpx',
        //     height: '300rpx',
        //     right: '20rpx',
        //     top: '20rpx',
        //     borderRadius: '1500rpx',
        //   },
        //   animation: {
        //     drag: true,
        //   },
        //   methods: {
        //     tap: this.toStaticDemo,
        //   },
        // },

        // {
        //   type: 'text',
        //   text: '点击仰望天空查看精简版Painter的  Demo(无交互能力)',
        //   css: {
        //     fontSize: '40rpx',
        //     lineHeight: '50rpx',
        //     left: '50rpx',
        //     top: '40rpx',
        //     width: '350rpx',
        //     color: '#0aa',
        //   },
        // },

        // {
        //   type: 'image',
        //   url: '/pages/post/palette/night.png',
        //   css: {
        //     width: '300rpx',
        //     height: '300rpx',
        //     left: '20rpx',
        //     bottom: '100rpx',
        //     borderRadius: '1500rpx',
        //   },
        //   animation: {
        //     drag: true,
        //   },
        //   methods: {
        //     tap: this.toDynamicDemo,
        //   },
        // },

        // {
        //   type: 'image',
        //   url: `${imgUrl}`,
        //   css: {
        //     bottom: '40rpx',
        //     right: '70rpx',
        //     width: '140rpx',
        //     height: '140rpx',
        //   },
        // },
      ],
    };
  }

  toStaticDemo() {
    wx.navigateTo({
      url: '/pages/example/example',
    });
  }
  toDynamicDemo() {
    wx.navigateTo({
      url: '/pages/koo-example/koo-example',
    });
  }
}
module.exports = Index;
