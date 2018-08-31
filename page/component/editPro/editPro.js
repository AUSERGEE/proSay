
Page({
  data: {
    barcode:'',
    thumb: '',
    nickname: '',
    proName:''
  },
  onLoad: function (options) {
    var barcode = options.barcode ? options.barcode : '';
    var proName = options.proName ? options.proName : '';
    this.setData({
      barcode: barcode,
      proName: proName
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
      code: this.data.barcode,
      proName: this.data.proName
    }
    wx.request({
      url: "https://mp.orancat.com/product/editPro",
      method: "POST",
      data:data,
      complete: function (res) {
        wx.hideLoading();
        if (res.data.status == 0) {
          wx.showModal({
            title: '提示',
            content: '名称修改成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                var pages = getCurrentPages();
                var prePage = pages[pages.length - 2];
                prePage.modifyProName(self.data.proName)
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
  handleFieldChange(e) {
    this.setData({
      proName: e.detail.detail.value
    })
  }
  

})
