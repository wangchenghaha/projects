export default class ImageExample {
    palette(options) {
      console.log('绘图',options)
      return ({
        width: '500rpx',
        height: '1090rpx',
        background: '#ffffff',
        views: [
          {
            type: 'image',
            url: options.avatar,
            css: {
              width: '60rpx',
              height: '60rpx',
              left: '41rpx',
              top: '54rpx',
              mode:'aspectFill',
              borderRadius: '40rpx'
            },
          },
          {
            type: 'image',
            url: options.product_pic,
            css: {
              width: '595rpx',
              height: '595rpx',
              left: '33rpx',
              top: '215rpx',
              mode:'aspectFill'
            },
          },
          
          {
            type: 'image',
            url: options.qrcode,
            css: {
              width: '140rpx',
              height: '140rpx',
              left: '478rpx',
              top: '805rpx',
              mode:'aspectFill',
              borderRadius: '70rpx'
            },
          },
          {
            type: 'text',
            text: options.username,
            css: {
              width: '470rpx',
              left: '142rpx',
              top: '50rpx',
              fontSize: '26rpx',
              color: '#333333',
              textAlign: 'left'
            },
          },
          {
            type: 'text',
            text: options.info,
            css: {
              width: '470rpx',
              left: '142rpx',
              top: '85rpx',
              fontSize: '26rpx',
              color: '#333333',
              textAlign: 'left'
            },
          },
          {
            type: 'text',
            text: options.product_name,
            css: {
              width: '400rpx',
              left: '40rpx',
              top: '810rpx',
              fontSize: '28rpx',
              color: '#333333',
              textAlign: 'left'
            },
          },
          {
            type: 'text',
            text: options.price_sign,
            css: {
              width: '18rpx',
              left: '40rpx',
              top: '915rpx',
              fontSize: '22rpx',
              color: '#ff0000',
              textAlign: 'left'
            },
          },
          {
            type: 'text',
            text: options.price,
            css: {
              width: '470rpx',
              left: '60rpx',
              top: '910rpx',
              fontSize: '28rpx',
              color: '#ff0000',
              textAlign: 'left'
            },
          },
        ],
        // background: options.backgroundImage,
      });
    }
  }