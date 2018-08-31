
Page({
  data: {
    texts: "至少5个字",
    min: 5,//最少字数
    max: 140, //最多字数 (根据自己需求改变) 
    textContent:'',
    barcode:'',
    thumb: '',
    nickname: '',
    show: false,
    cancelWithMask: true,
    actions: [{
      name: '随笔',
      subname: '',
      loading: false
    }, {
        name: '日记',
      subname: '',
      loading: false
    }, {
        name: '鱼书',
        subname: '',
        loading: false
    }, {
        name: '诗一首',
      subname: '',
      loading: false
    }, {
        name: '书摘',
        subname: '',
        loading: false
      }
    ],
    cancelText: '取消',
    typeArr: ['随笔', '日记', '鱼书','诗一首','书摘'],
    typeName:'随笔',
    typeIndex:0,
    nodeImgUrl: "",
    canvasWidth:200,
    canvasHeight :200,
    tempFilePath:''
  },
  onLoad: function (options) {
    var barcode = options.barcode ? options.barcode : '';
    this.setData({
      barcode: barcode
    });
  },
  onShow() {
    var self = this;
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function (res) {
        self.setData({
          thumb: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName
        })
      }
    })

  },
  //字数限制  
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    this.setData({
      textContent: value
    })
    //最少字数限制
    // if (len <= this.data.min)
    //   this.setData({
    //     texts: "加油，够5个字可以得20积分哦"
    //   })
    // else if (len > this.data.min)
    //   this.setData({
    //     texts: " "
    //   })

    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });
  },
  commit(){
    wx.showLoading({
      title: '加载中..',
    })
    var self = this;
    var app = getApp();
    var userId = app.globalData.userId;
    
    var userName = this.data.nickname ? this.data.nickname:'匿名';
    var userImg = this.data.thumb ? this.data.thumb : 'null';
    var data={
      authorName: userName, //用户昵称
      token: userId,  //用户ID
      content: this.data.textContent, //留言文本内容
      imgUrl: userImg,  //用户的头像
      code: this.data.barcode,  //商品的条码
      typeIndex: this.data.typeIndex, //留言的类型
      nodeImgUrl: this.data.nodeImgUrl //用户上传的图片的地址
    }
    wx.request({
      url: "https://mp.orancat.com/product/submitNode",
      method: "POST",
      data:data,
      complete: function (res) {
        wx.hideLoading();
        console.log(res, 'commit');
        if (res.data.status == 0) {
          wx.showModal({
            title: '提示',
            content: '手账添加成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                var pages = getCurrentPages();
                var prePage = pages[pages.length - 2];
                prePage.getProductInfo(self.data.barcode)
                wx.navigateBack({})

              } 
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '提交失败，请联系管理员',
            showCancel: false
          })
        }
      }
    })
  
  },
  openActionSheet() {
    this.setData({
      'show': true
    });
  },
  closeActionSheet() {
    this.setData({
      'show': false
    });
  },
  handleActionClick({ detail }) {
    // 获取被点击的按钮 index
    const { index } = detail;
    console.log(index)
    this.setData({
      'show': false,
      'typeName': this.data.typeArr[index],
      'typeIndex':index
    });
  },
  commitImg() {
    let self = this;
    
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        self.compressedImg(res)
        // wx.showLoading({
        //   title: '图片上传中..'
        // })
        // wx.uploadFile({
        //   url: 'https://mp.orancat.com/proImgUpload',
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        //   header: {
        //     'content-type': 'multipart/form-data'
        //   },
        //   success: function (res) {
        //     var data = JSON.parse(res.data);
        //     //console.log(res.statusCode);
        //     //console.log(res.data.status);
        //     wx.hideLoading()
        //     if (res.statusCode == 200) {
        //       if (data.status == '0') {
        //         self.setData({
        //           nodeImgUrl: data.imgUrl
        //         })
        //         //console.log(data.nodeImgUrl, 2221)
        //       }else{
        //         wx.showModal({
        //           title: '提示',
        //           content: '图片提交失败，我也不知道为什么'
        //         })
        //       }
        //     }else{
        //       wx.showModal({
        //         title: '提示',
        //         content: '网络异常'
        //       })
        //     }
        //   }
        //})
      }
    })

  },
  compressedImg(photo){
    let _this=this
    console.log(photo,2000)
    wx.showLoading({
      title: '图片上传中..'
    })
    wx.getImageInfo({
      src: photo.tempFilePaths[0],
      success: function (res) {
        var ctx = wx.createCanvasContext('photo_canvas');
        var ratio = 2;
        var canvasWidth = res.width
        var canvasHeight = res.height;
        console.log(res,1002)
        if(res.type=='gif'){
           if(res.width>666||res.height>666){
             wx.hideLoading()
             wx.showModal({
               title: '提示',
               content: '动图太大了，请上传小一点的',
               showCancel: false
             })
             return false;
           }
           res.tempFilePath=res.path;
           _this.uploadImg(res)
           return false;
        }
        // 保证宽高均在220以内
        console.log(res,"imgINfooo")
        while (canvasWidth > 220 || canvasHeight > 220) {
          //比例取整
          canvasWidth = Math.trunc(res.width / ratio)
          canvasHeight = Math.trunc(res.height / ratio)
          ratio++;
        }
        _this.setData({
          canvasWidth: canvasWidth,
          canvasHeight: canvasHeight
        })//设置canvas尺寸
        console.log(canvasWidth, "imgINfooo2222222222")
        ctx.drawImage(photo.tempFilePaths[0], 0, 0, canvasWidth, canvasHeight)
        ctx.draw()
        //下载canvas图片
        setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: 'photo_canvas',
            success: function (res) {
              console.log(res.tempFilePath,10000)
              _this.setData({
                tempFilePath: res.tempFilePath
              })
              _this.uploadImg(res)
            },
            fail: function (error) {
              console.log(error)
            }
          })
        }, 600)
      },
      fail: function (error) {
        console.log(error)
      }
    })

  },
  uploadImg(photo){
        let self = this;
        wx.uploadFile({
          url: 'https://mp.orancat.com/proImgUpload',
          filePath: photo.tempFilePath,
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          success: function (res) {
            console.log(res,'jim')
            var data = JSON.parse(res.data);
            console.log(data,1200);
            //console.log(res.data.status);
            if (res.statusCode == 200) {
              if (data.status == '0') {
                self.setData({
                  nodeImgUrl: data.imgUrl
                })
                //console.log(data.nodeImgUrl, 2221)
              }else{
                wx.showModal({
                  title: '提示',
                  content: '图片提交失败，我也不知道为什么',
                  showCancel: false
                })
              }
            }else{
              wx.showModal({
                title: '提示',
                content: '网络异常',
                showCancel: false
              })
            }
          },
          fail: function (e) {
            console.log(e);
            wx.showModal({
              title: '提示',
              content: '上传失败',
              showCancel: false
            })
          },
          complete: function () {
            wx.hideLoading()
          }
        })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: [current]
    })
    console.log(current,200)
  } 

})
