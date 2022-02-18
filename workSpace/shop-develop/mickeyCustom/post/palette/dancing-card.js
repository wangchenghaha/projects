export default class SunningJuly {
  context = {}
  constructor(data) {
    this.data = data;
  }
  palette() {
    return {
      width: '750rpx',
      height: '1000rpx',
      background: '#eee',
      views: [{
        type: 'qrcode',
        content: 'https://github.com/Kujiale-Mobile/Painter',
        css: {
          top: '40rpx',
          left: '180rpx',
          color: 'red',
          borderWidth: '10rpx',
          borderColor: 'blue',
          width: '120rpx',
          height: '120rpx',
          align: 'center',
        },
        methods: {
          tap() {
            console.log('qrcode');
          },
        },
        animation: {
          drag: true,
        },
      },
      {
        type: 'rect',
        css: {
          top: '40rpx',
          left: '180rpx',
          color: 'green',
          borderRadius: '20rpx',
          borderWidth: '10rpx',
          width: '120rpx',
          height: '120rpx',
        },
        methods: {
          tap() {
            console.log('rect');
          },
        },
        animation: {
          drag: true,
        },
      },
      {
        type: 'text',
        text: 'borderWidthsdjfkdgjlsdhfdskljdshgdsjalfdjhgdklshgksahf',
        css: {
          top: '240rpx',
          left: '300rpx',
          color: 'green',
          borderWidth: '2rpx',
          fontSize: '40rpx',
          width: '200rpx',
          maxLines: 3,
          align: 'left',
        },
        methods: {
          tap() {
            console.log('text 1');
          },
        },
        animation: {
          drag: true,
        },
      },
      {
        type: 'text',
        text: 'borderWidthsdjfkdgjlsdhfdskljdshgdsjalfdjhgdklshgksahf',
        css: {
          top: '440rpx',
          left: '300rpx',
          color: 'green',
          borderWidth: '2rpx',
          fontSize: '40rpx',
          width: '200rpx',
          maxLines: 3,
          align: 'center',
        },
        methods: {
          tap() {
            console.log('text 2');
          },
        },
        animation: {
          drag: true,
        },
      },
      {
        type: 'text',
        text: 'borderWidthsdjfkdgjlsdhfdskljdshgdsjalfdjhgdklshgksahf',
        css: {
          top: '640rpx',
          left: '300rpx',
          color: 'green',
          borderWidth: '2rpx',
          fontSize: '40rpx',
          width: '200rpx',
          maxLines: 3,
          align: 'right',
          rotate: '10',
        },
        methods: {
          tap() {
            console.log('text 3');
          },
        },
        animation: {
          drag: true,
        },
      },
      ],
    };
  }
}

module.exports = SunningJuly;

