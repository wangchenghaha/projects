const info = wx.getSystemInfoSync();
console.log(info,'=========')
export default class LastMayday {
  palette(imgUrl) {
    const res = wx.getSystemInfoSync();
    return {
      width: '563rpx',
      height: `930rpx`,
      // height: '1215rpx',
      background: 'https://alioss.woaap.com/bestseller/campaign2001/images/haibao_bgl.png',
      // align: 'center',
      backgroundSize: 'no-repeat',
      views: [
        {
          type: 'image',
          url: imgUrl,
          css: {
            bottom: '10rpx',
            left: '30rpx',
            width: '160rpx',
            height: '160rpx',
          },
        },
        // {
        //   type: 'text',
        //   text: '￥'+'单买价',
        //   css: [{
        //     top: '810rpx',
        //     align: 'center',
        //     // width: '400rpx',
        //     right: '380rpx',
        //     fontWeight:'bold',
        //   }, common, { fontSize: '36rpx', textDecoration:'line-through'}],
        // },
        // {
        //   type: 'rect',
        //   css: {
        //     bottom: '40rpx',
        //     right: '40rpx',
        //     color: 'green',
        //     borderRadius: '20rpx',
        //     borderWidth: '10rpx',
        //     width: '120rpx',
        //     height: '120rpx',
        //   },
        // },
        // {
        //   type: 'text',
        //   text: 'borderWidth',
        //   css: {
        //     bottom: '40rpx',
        //     right: '200rpx',
        //     color: 'green',
        //     borderWidth: '2rpx',
        //   },
        // },
      ],
    };
  }
}

const startTop = 50;
const startLeft = 20;
const gapSize = 70;
const common = {
  left: `${startLeft}rpx`,
  fontSize: '34rpx',
};

function _textDecoration(decoration, index, color) {
  return ({
    type: 'text',
    text: decoration,
    css: [{
      top: `${startTop + index * gapSize}rpx`,
      color: color,
      textDecoration: decoration,
    }, common],
  });
}

function _image(index, rotate, borderRadius) {
  return (
    {
      type: 'image',
      url: '/pages/post/palette/avatar.jpg',
      css: {
        top: `${startTop + 8.5 * gapSize}rpx`,
        left: `${startLeft + 160 * index}rpx`,
        width: '120rpx',
        height: '120rpx',
        rotate: rotate,
        borderRadius: borderRadius,
      },
    }
  );
}

function _des(index, content) {
  const des = {
    type: 'text',
    text: content,
    css: {
      fontSize: '22rpx',
      top: `${startTop + 8.5 * gapSize + 140}rpx`,
    },
  };
  if (index === 3) {
    des.css.right = '60rpx';
  } else {
    des.css.left = `${startLeft + 120 * index + 30}rpx`;
  }
  return des;
}
