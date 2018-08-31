const Dialog = require('../../../zanui/dialog/dialog');
Page({
  data:{
    thumb:'',
    nickname:'',
    imageSrc: 'https://mp.orancat.com/images/static/indexbg1.png?random='+parseInt(Math.random()*1000),
    imgUrls: ['https://mp.orancat.com/images/static/indexbg1.png?random=' + parseInt(Math.random() * 1000),
      'https://mp.orancat.com/images/static/indexbg2.png?random=' + parseInt(Math.random() * 1000),
      'https://mp.orancat.com/images/static/indexbg3.png?random=' + parseInt(Math.random() * 1000)
    ],
    interval: 3600,
    duration: 800,
  },
  onLoad(){
    
    
  },
  onShow(){
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
  
  scanCode() {
    var self = this;
    wx.showLoading({
      title: '加载中..',
    })
    console.log('barcode')
    wx.scanCode({
      scanType: ['barCode'],
      success: (res) => {
        console.log(res)
        wx.hideLoading();
        var barcode = res.result;
        console.log(barcode)
        wx.navigateTo({
          url: "/page/component/proDtl/proDtl?barcode=" + barcode,
        })
      }
    })
    setTimeout(function () {
      self.hideLoading();
    }, 2000)
  },
  getProduct(barcode){
    this.showLoading('加载中..');
    var self=this;
    var app = getApp();
    var userId = app.globalData.userId;
    wx.request({
      url: "https://mp.orancat.com/sshop/getProduct",
      header: {
        "userId": userId
      },
      method: "POST",
      data: { barcode: barcode},
      complete: function (res) {
        self.hideLoading();
        console.log(res, 343);
        if (res.data.status==0){
            var arr = self.data.productArr;
            self.data.numArr.push(1)
            arr.push(res.data.product);
            var len = arr.length - 1;
            arr[len]['num'] = self.data.numArr[arr.length - 1];
            arr[len]['priceAll'] = arr[len]['num'] * arr[len]['price'];
            
            console.log(arr[arr.length - 1], 3)
            self.setData({
              productArr:arr
            });
            self.getAccount();
            console.log(self.data.productArr,21)
        }else{
          self.handleClick(res.data.message);
        }
      }
    });
  },

  resetOrder(){
     this.setData({
       productArr:[]
     })
     this.getAccount();
     
  },
  showLoading: function (txt) {
    wx.showLoading({
      title: txt,
    })
  },
  hideLoading(){
    wx.hideLoading()
  },
  delItem(e){
    var index = e.currentTarget.dataset.index;
    var arr = this.data.productArr;
    arr.splice(index, 1);
    this.setData({
      productArr: arr
    })
    this.getAccount();
  },
  onShareAppMessage: function (res) {
    return {
      title: '让你的留言随着条码去流浪',
      path: '/page/component/index/index',
      imageUrl: 'https://mp.orancat.com/images/static/pro54.jpg'
    }
  }
})