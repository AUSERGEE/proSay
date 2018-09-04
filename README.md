## 1.功能介绍



![](https://user-gold-cdn.xitu.io/2018/9/3/1659eeabf7eb6ac8?w=240&h=240&f=gif&s=40388)

对准上面的小程序码，扫一下，‘嘀’~地一声，扫码成功，打开小程序，进入小程序首页。

因为手头上没有可乐，所以我找来了一只非常专业的猫，扮演一瓶330ml的可口可乐演示给大家看。

摁住它，对准它的条码，扫一下，‘喵’~地一声，说明猫跑掉了，扫码失败了，去追

如果‘嘀’~地一声，说明扫码成功了，这时页面就自动跳到商品详情页。

然后你就可以看得到别人在可口可乐下写的留言，当然你也可以点击右下角的蓝色按钮就发表你的留言了；  
 

  ![](https://user-gold-cdn.xitu.io/2018/9/3/1659d578e333cb60?w=1041&h=583&f=jpeg&s=312343)


原理：因为一个商品对应唯一一个条码，所以扫描同一个商品条码就可以进入唯一一个留言列表；  
全国各地的可口可乐330ml的条形码都是一样的，扫码后都会进入同一个页面  
条形码就像一个暗号，一句口令，一个邮差..
当然，不只是条形码，二维码也可以留言，比如说别人的微信二维码一般是长时间不会变的，你可以码上说别人坏话。

接下来详细介绍一下每个页面的功能


##  2.首页

  ![](https://user-gold-cdn.xitu.io/2018/9/3/1659d578e31cef2a?w=310&h=551&f=png&s=240766)

 首页有三个部分：

 &nbsp;&nbsp;&nbsp;&nbsp;1.用户的信息：头像和昵称；  
 &nbsp;&nbsp;&nbsp;&nbsp;2.轮播图-可以放一些平时要展示的图片；  
 &nbsp;&nbsp;&nbsp;&nbsp;3.扫码按钮-点击即可打开扫描条码；  

当用户点击扫码按钮时，我们就调用小程序的扫码接口去扫描商品条码，当用户扫描好条码后，我们就得到了商品条码（barcode）；  
这时，我们就可以跳转到商品详情页面了，顺便把条码传过去，这样商品详情页才能知道用户扫的是什么商品：

```
    wx.navigateTo({
          url: "/page/component/proDtl/proDtl?barcode=" + barcode,  //把商品条码传给商品详情页
    })
```


## 3.商品详情页

   ![](https://user-gold-cdn.xitu.io/2018/9/3/1659d578e3090811?w=310&h=551&f=png&s=85700)

进入详情页后，我们的第一件事情：在生命周期onLoad中获取首页传过来商品条码，然后根据条码请求当前商品的留言列表，如果这个商品还没有人扫过的话，就可能没有留言，那我们只要显示“暂无留言”即可

```
  onLoad(options){
       var barcode = options.barcode ? options.barcode:'';
       this.getProductInfo(barcode)  //根据条码请求当前商品的留言列表
  },
```

在getProductInfo（）方法中，我们会向后台请求商品留言列表；
接着我们就把请求到的商品留言列表渲染到页面上:

![](https://user-gold-cdn.xitu.io/2018/9/3/1659d578e5b2fde5?w=322&h=88&f=png&s=56035)


如果用户觉得请求到的商品名称是不对的，还可以点击名称进行编辑：

![](https://user-gold-cdn.xitu.io/2018/9/3/1659d578e6061913?w=322&h=87&f=png&s=14761)


最后，页面底部还有一个提交留言的小按钮：

![](https://user-gold-cdn.xitu.io/2018/9/3/1659d578e617c975?w=322&h=98&f=png&s=7632)


如果你要发表留言，你可以用你的食指点击它：

![](https://user-gold-cdn.xitu.io/2018/9/3/1659d579831de09d?w=348&h=98&f=png&s=22432)


点击按钮后，小程序就会跳到添加留言页面，顺便把商品条码信息传过去：

```
  turnToSubmit(){
    wx.navigateTo({
      url: "/page/component/addNode/addNode?barcode=" + this.data.barcode,
    })
  },
```

## 4.添加留言页面

![](https://user-gold-cdn.xitu.io/2018/9/3/1659d57984cee75b?w=1041&h=583&f=jpeg&s=177355)

 如图，这时候我们就可以开始写我们的留言了。

 写完留言之后，你可以标注一下你的留言类型：  
 如果你觉得你写的是一首诗，你可以选择类型为‘诗一首’；  
 如果你觉得你写的是一封信，等待别人扫码阅读，你可以选择类型为‘鱼书’；  
 如果你扫描的是一本书的条码，你可以选择类型为‘书摘’；  

 类型的右边就是是上传图片功能，  
 首先，我们点击'添加图片'小图标，这时就会使用小程序选择图片的接口打开相册或者直接拍照，  
 得到图片之后，因为现在的手机图片拍照像素都比较高，导致图片比较大，上传会很慢，占服务器空间，请求也会很慢...  
 所以为了优化用户体验，我们需要压缩一下图片然后再上传。  

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

虽然小程序的选择图片接口可以设置默认压缩，但好像没什么用，还是需要找其他的方法压缩一下，
网上最普遍的图片压缩是使用了小程序提供的canvas画布，把用户上传的图片搞到画布上（....），然后根据画布上的图片高和宽判断图片是否过大，如果过大，就直接把画布按比例缩小：

```
   while (canvasWidth > 220 || canvasHeight > 220) {  //如果宽度或者高度大于220，我就认为图片要进一步压缩，你可以根据需求改成其他的数字
          //比例取整
      canvasWidth = Math.trunc(res.width / ratio)
      canvasHeight = Math.trunc(res.height / ratio)
      ratio++;
   }
```

>图片的压缩参考自：[微信小程序：利用canvas缩小图片][https://blog.csdn.net/akony/article/details/78815544]


然后把canvas上这张压缩了的图片上传到后台服务器：

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
 
图片上传成功之后，后台会返回上传图片的地址给我们，我们把图片渲染到页面上，用户就会知道图片上传成功了；
 
![](https://user-gold-cdn.xitu.io/2018/9/3/1659e8ccdc7ca50f?w=64&h=46&f=png&s=5944)
最后点击'提交'按钮，就会把以下内容发送给后台，后台就会自动将留言保存到数据库；

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

留言提交成功之后，页面会自动切回商品详情页面，这时，你就可以看到自己刚刚的留言了；  

![](https://user-gold-cdn.xitu.io/2018/9/3/1659f00b29f79650?w=320&h=150&f=jpeg&s=32606)


## 5.排行榜页面

![](https://user-gold-cdn.xitu.io/2018/9/3/1659d57985fed74b?w=310&h=551&f=png&s=158793)

有过留言的商品都会出现在排行榜页面，并且按照留言的数量多少进行排列，点击单个商品就查看该商品下的留言；

## 6.其他实现的功能

### 1.分页

在商品详情页，有可能出现这种情况，比如说假设A商品有120条留言，如果一进A商品详情页就要加载120条留言的话，可能页面加载半天都没有出来；这样的话用户体验就会非常不好。所以相对理想的方式应该是，假设12条留言为一页，那么A商品的留言总共有10页，当我们进入A商品的详情页面时，先加载第一页（前12条留言），当我们往上滑动页面到底部时就自动加载下一页的内容，一页一页按需加载；

我们使用小程序提供的OnReachBottom触底事件实现分页加载，当用户滑动留言列表到底部时触发加载下一页：

```
  onReachBottom: function () { //滑动到底部时触发
       this.setData({
           bottomLoading: true  // 显示loading提示
       })
       this.getRankList()  //请求下一页数据
  }
```

同理，排行榜页面也使用了分页加载；

### 2.通过wx.login获取用户唯一凭证openId
   ![](https://user-gold-cdn.xitu.io/2018/9/3/1659d5798e96844b?w=723&h=262&f=png&s=47358)

由于用户的昵称，头像什么的都可能随时会改变，当openID不会变，所以使用openId作为用户唯一凭证；  
虽然我获取了用户的Id，但暂时还没有使用到；  
如果以后要弄个用户个人主页或者留言回复等等可能就要用到openId；

### 3.gif图片上传
   
如上所述，在图片上传前，我们把图片压缩了一下
如果图片是jpeg，png时没问题的
但如果图片时gif动图的话，那可能会导致动图不会动了（可能直接变成jpeg图片？）
所以我另外加了一个判断：如果图片时gif格式的话，就不压缩图片,直接上传：

```
    if(res.type=='gif'){
       if(res.width>666||res.height>666){ //如果图片太大了，拒绝上传
         wx.hideLoading()
         wx.showModal({
           title: '提示',
           content: '动图太大了，请上传小一点的',
           showCancel: false
         })
         return false;
       }
       res.tempFilePath=res.path;
       _this.uploadImg(res)  //上传图片
       return false;
    }
```
这样在window和安卓下就可以上传gif图片了。  
苹果手机呢？？  
咳咳..苹果手机一打开相册选动图，动图就自动变成了jpeg的不动图...  
所以苹果手机暂时上传不了动图，似乎没有解决办法。。 

  
  
## 7.下载与本地电脑运行

在本文底部的github地址下载源码，用微信开发者工具，填上你的小程序appId，打开项目即可；

记得在开发者工具点击‘’详情‘’设置不校验域名：

 ![](https://user-gold-cdn.xitu.io/2018/9/3/1659d5798ed881b6?w=322&h=44&f=png&s=4921)

如果你要提交审核并分布小程序的话，你需要在公众号平台上的"设置>开发设置"页面上设置小程序的服务器域名如下：

![](https://user-gold-cdn.xitu.io/2018/9/3/1659ed2888b5782f?w=479&h=258&f=png&s=15472)

然后，由于一般电脑没有摄像头不能扫码，所以当你需要扫码时，你可以把下面这张条码图片保存在本地电脑上，点击扫码按钮时打开这张图片即可：

![](https://user-gold-cdn.xitu.io/2018/9/3/1659d5b62d828a33?w=286&h=192&f=png&s=129947)

当然，你也可以自己找其他的条码；

另外，需要注意的是，当你在本地电脑调试时，由于我们都是使用同一个后台接口，所以你发的留言都会同步到我的小程序上，所以尽量不要发送太明显的测试留言，例如：

&nbsp;&nbsp;![](https://user-gold-cdn.xitu.io/2018/9/3/1659d579a1b74fe7?w=133&h=28&f=png&s=1306)

可以发一些强颜欢笑，积极向上，人畜无害的留言，例如：

&nbsp;&nbsp;![](https://user-gold-cdn.xitu.io/2018/9/3/1659d579ae28ba5a?w=202&h=21&f=png&s=3723)


## 7.扫码体验

你也可以直接扫描这个的小程序码体验一下：  

![](https://user-gold-cdn.xitu.io/2018/9/3/1659d57a1e54cad4?w=241&h=236&f=png&s=33649)


>源码下载地址:[https://github.com/AUSERGEE/proSay]
