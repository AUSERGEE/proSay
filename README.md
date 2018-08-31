### 一.功能介绍
  【 图 图 图 】

&nbsp;&nbsp;首先打开小程序，然后我们找来了一只非常专业的猫扮演一瓶330ml的可口可乐，摁住它开始扫码，扫码成功后页面就跳转到商品详情页面，如果别人曾经在这个商品下留言的话，你就可以看得到，然后点击右下角的蓝色按钮就可以开始写留言了；  
 &nbsp;&nbsp;一个商品对应一个条码，扫描同一个商品条码就可以进入同一个留言列表；  
&nbsp;&nbsp;留言越多的商品，在排行榜上就排在越前面；


### 一.首页扫码
  图：首页

  &nbsp;&nbsp;如图首页分三个部分：
 &nbsp;&nbsp;&nbsp;1.用户的头像和昵称显示；
   &nbsp;&nbsp;&nbsp;2.轮播图；
   &nbsp;&nbsp;&nbsp;3.扫码按钮；
  &nbsp;&nbsp;主要是扫码按钮，当用户点击扫码按钮时，我们就调用小程序的扫码接口，当用户扫描好商品条码后，我们就得到了商品条码（barcode）；  
 &nbsp;&nbsp;这时，我们就可以跳转到商品详情页面了，顺便把条码传过去，这样才能知道是什么商品：
```
    wx.navigateTo({
          url: "/page/component/proDtl/proDtl?barcode=" + barcode,
    })
```

### 一.商品详情页

   【图】

  &nbsp;&nbsp;进入详情页后，我们的第一件事情：在生命周期onLoad中获取商品条码，然后根据条码请求当前商品的留言列表，如果这个商品还没有人扫过的话，就可能就没有留言
```
  onLoad(options){
       var barcode = options.barcode ? options.barcode:'';
       this.getProductInfo(barcode)  //根据条码请求当前商品的留言列表
  },
```
 &nbsp;&nbsp;在getProductInfo（）方法中，我们获取了商品留言列表的同时，也获取到了商品的名称；
 &nbsp;&nbsp;然后我们把请求到的数据渲染到页面上:
｛图｝

&nbsp;&nbsp;如果用户觉得商品名称是不对的，还可以点击名称进行修改：
｛图｝

&nbsp;&nbsp;然后，页面底部还有一个提交留言的小按钮：
｛图｝
&nbsp;&nbsp;假设现在我要在该商品下留言，我就会点击它：
｛图｝

&nbsp;&nbsp;用户点击该按钮后，小程序就会携带商品条码跳转到提交留言页面

```
  turnToSubmit(){
    wx.navigateTo({
      url: "/page/component/addNode/addNode?barcode=" + this.data.barcode,
    })
  },
```
### 添加留言页面
  ｛图｝｛图-类型｝｛图-上传图片｝
  &nbsp;&nbsp;如图，这时候我们就可以开始提交留言了，
   &nbsp;&nbsp;如果你觉得你写的是一首诗，你可以选择类型为‘诗一首’；   
   &nbsp;&nbsp;如果你觉得你写的是一封信，等待别人扫码阅读，你可以选择类型为‘鱼书’；
   &nbsp;&nbsp;如果你扫描的是一本书的条码，你可以选择类型为‘书摘’；

  &nbsp;&nbsp;然后是上传图片功能，
   &nbsp;&nbsp;首先，我们点击'添加图片'小图标，这时就会使用小程序选择图片的接口打开相册或者直接拍照，
   &nbsp;&nbsp;得到图片之后，因为选择手机的图片动不动就是3M，或者6M，有点大，上传会很慢，占服务器空间，请求也会很慢  
   &nbsp;&nbsp;所以有必要压缩一下

```
 wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {  //图片选择成功之后
        
               var tempFilePaths = res.tempFilePaths;
               self.compressedImg(res)  //调用compressedImg方法，先把图片压缩一下

        }
    })
```
 &nbsp;&nbsp;图片压缩是使用小程序提供的canvas画布，把用户上传的图片搞到画布上（....），如果根据画布上的图片高和宽判断图片是否过大，如果过大，就直接把画布按比例缩小；

```
      while (canvasWidth > 220 || canvasHeight > 220) {  //如果宽度或者高度大于220，我就认为图片要进一步压缩，你可以根据需求改成其他的数字
          //比例取整
          canvasWidth = Math.trunc(res.width / ratio)
          canvasHeight = Math.trunc(res.height / ratio)
          ratio++;
       }
```
>图片的压缩参考自：[微信小程序：利用canvas缩小图片][https://blog.csdn.net/akony/article/details/78815544]


  &nbsp;&nbsp;图片压缩完了之后，我们就开始上传这张图片：
```
   ......
   wx.uploadFile({  //上传图片
          url: 'https://mp.orancat.com/proImgUpload',
          filePath: photo.tempFilePath,  //压缩后的图片
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          success: function (res) {
    .......          

```
 &nbsp;&nbsp;图片上传成功之后，后台会返回上传图片的地址给我们，我们把图片渲染到页面上，用户就会知道图片上传成功了；

  &nbsp;&nbsp;最后点击'提交'按钮，就会把以下内容发送给后台，后台就会自动将留言保存到数据库；

```
   var data={
      authorName: userName, //用户昵称
      token: userId,  //用户ID
      content: this.data.textContent, //留言文本内容
      imgUrl: userImg,  //用户的头像
      code: this.data.barcode,  //商品的条码
      typeIndex: this.data.typeIndex, //留言的类型
      nodeImgUrl: this.data.nodeImgUrl //用户上传的图片的地址
    }
```

&nbsp;&nbsp;留言提交成功之后，页面切回商品详情页面，这时，你就可以看到自己刚刚的留言了；

[图]

### 排行榜页面
[图]
&nbsp;&nbsp;有留言的商品都会出现在排行榜页面，并且按照留言的数量进行排列，点击某个商品就会直接进入商品详情页面；
&nbsp;&nbsp;这页面主要做的事情就是请求排行榜的数据，然后再页面上渲染出来；

### 其他实现的功能
#### 1.分页
&nbsp;&nbsp;在商品详情页，有可能出现这中情况，比如说假设A商品有120条留言，如果一进A商品就要加载120条留言的话，可能要花一点时间，也可能页面加载半天都没有出来；这样的话用户体验就会非常不好。所以相对理想的方式应该是，假设12条留言为一页，那么A商品的留言总共有10页，当我们进入A商品的详情页面时，先加载第一页（前12条留言），当我们往上滑动页面到底部时就自动加载下一页的内容；

&nbsp;&nbsp;我们使用小程序提供的OnReachBottom触底事件实现分页加载：
```
  onReachBottom: function () { //滑动到底部时触发
       this.setData({
           bottomLoading: true  // 显示loading提示
       })
       this.getRankList()  //请求下一页数据
  },
```
&nbsp;&nbsp;同理，排行榜页面也使用了分页加载；

#### 2.通过wx.login获取用户唯一凭证openId
   ![](https://images2018.cnblogs.com/blog/1178432/201808/1178432-20180831135258317-1713789822.png)

&nbsp;&nbsp;由于用户的昵称，头像什么的都可能随时会改变，当openID不会变，所以使用openId作为用户唯一凭证；  
&nbsp;&nbsp;虽然我获取了用户的Id，但暂时还没有使用到；  
&nbsp;&nbsp;如果以后要弄个用户个人主页或者留言回复等等可能就要用到openId；

### 下载与本地电脑运行

&nbsp;&nbsp; github下载源码，用微信开发者工具打开项目，填上你的appId即可；
&nbsp;&nbsp;记得在开发者工具点击‘’详情‘’设置不校验域名：
 ![](https://images2018.cnblogs.com/blog/1178432/201808/1178432-20180831163206438-1734095750.png)

&nbsp;&nbsp;需要注意的是，当你在本地电脑调试时，由于我们都是使用同一个后台接口，所以你发的留言都会同步到我的小程序上，所以尽量不要发送太明显的测试留言，例如：
![](https://images2018.cnblogs.com/blog/1178432/201808/1178432-20180831164458356-1196936848.png)
可以发一些强颜欢笑，积极向上，人畜无害的留言，例如：

![](https://images2018.cnblogs.com/blog/1178432/201808/1178432-20180831164646085-261794296.png)

### 扫码体验
&nbsp;&nbsp;你也可以直接扫描下面的小程序码体验一下：  


![](https://images2018.cnblogs.com/blog/1178432/201808/1178432-20180831165024411-236298724.png)

