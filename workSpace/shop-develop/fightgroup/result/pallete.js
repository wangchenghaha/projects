export default class ImageExample {
    palette(options) {
      return ({
        width: '566rpx',
        height: '943rpx',
        borderRadius: '45rpx',
        overflow: 'hidden',
        views: [{
            type: 'image',
            url: options.bg,
            css: {
              width: '566rpx',
              height: '943rpx',
              mode: 'scaleToFill',
              top: '0',
              left: '0',
              borderRadius: '10rpx'
            },
          },
          {
            type: 'image',
            url: options.qc,
            css: {
              width: '145rpx',
              height: '145rpx',
              top: '687rpx',
              left: '205rpx',
              overflow: 'hidden'
            },
          },
        //   {
        //     type: 'text',
        //     text: options.name,
        //     css: {
        //       fontSize: '36rpx',
        //       fontWeight: 'bold',
        //       color: '#606266',
        //       lineHeight: '48rpx',
        //       top: main.judgeBigScreen()?'72rpx' : '65rpx',
        //       left: main.judgeBigScreen()?'210rpx' : '189rpx'
        //     },
        //   },
        ],
      });
    }
  }