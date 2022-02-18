export default class ImageExample {
    palette(options) {
      console.log('海报绘制',options)
      return ({
        width: '670rpx',
        height: '1490rpx',
        background: '#ffffff',
        views: [
          {
            type: 'image',
            url: options.avatar,
            css: {
              width: '148rpx',
              height: '148rpx',
              left: '41rpx',
              top: '44rpx',
              mode:'widthfix',
              borderRadius: '50px'
            },
          },
          {
            type: 'text',
            text: options.username,
            css: {
              width: '470rpx',
              left: '208rpx',
              top: '80rpx',
              fontSize: '38rpx',
              color: '#000000',
              textAlign: 'left'
            },
          },
          {
            type: 'text',
            text: options.shareText,
            css: {
              width: '450rpx',
              left: '208rpx',
              top: '140rpx',
              fontSize: '30rpx',
              color: '#000000',
              textAlign: 'left'
            },
          },
          {
            type: 'image',
            url: options.product_pic,
            css: {
              width: '595rpx',
              height: '585rpx',
              left: '33rpx',
              top: '330rpx',
              mode:'aspectFit'
            },
          },
          {
            type: 'image',
            url: options.toBg,
            css: {
              width: '580rpx',
              height: '90rpx',
              left: '33rpx',
              top: '228rpx',
              mode:'widthfix'
            },
          },
          {
            type: 'text',
            text: options.name,
            css: {
              width: '470rpx',
              left: '138rpx',
              top: '241rpx',
              fontSize: '32rpx',
              color: '#000000',
              textAlign: 'center'
            },
          },
          {
            type: 'text',
            text: options.zhufuyu1,
            css: {
              width: '270rpx',
              left: '33rpx',
              top: '970rpx',
              fontSize: '32rpx',
              color: '#333333',
              textAlign: 'left'
            },
          },
          {
            type: 'text',
            text: options.zhufuyu2,
            css: {
              width: '270rpx',
              left: '33rpx',
              top: '1020rpx',
              fontSize: '32rpx',
              color: '#333333',
              textAlign: 'left'
            },
          },
          {
            type: 'image',
            url: options.qrcode,
            css: {
              width: '186rpx',
              height: '232rpx',
              right: '39rpx',
              top: '970rpx',
              mode:'aspectFit'
            },
          },
          {
            type: 'image',
            url: options.qrcodeMy,
            css: {
              width: '232rpx',
              height: '232rpx',
              right: '39rpx',
              top: '970rpx',
              mode:'aspectFit'
            },
          },
          {
            type: 'image',
            url: options.info,
            css: {
              width: '345rpx',
              height: '320rpx',
              left: '33rpx',
              top: '1100rpx',
              mode:'widthfix'
            },
          },
          {
            type: 'image',
            url: options.logo,
            css: {
              width: '250rpx',
              height: '60rpx',
              right: '33rpx',
              top: '1230rpx',
              mode:'widthfix'
            },
          },

        ],
        // background: options.backgroundImage,
      });
    }
  }