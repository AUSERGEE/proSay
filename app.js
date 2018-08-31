App({
  onLaunch: function () {
    console.log('App Launch')
    this.getopenId()
    this.getVcode()
  },
  onShow: function (option) {
  },
  onHide: function () {
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {

          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
              console.log(res.userInfo,'app.js')
            },
            fail: res => {
              console.log(res)
            }
          })
        
    }
  },
  getopenId:function(){
    var that = this
    if (this.globalData.userId) {
      
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          console.log(res)
          wx.request({
            url: "https://mp.orancat.com/puser/getOpenId",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: { code: res.code },
            complete: function (res) {
              typeof cb == "function" && cb(that.globalData.userId)
              that.globalData.userId = res.data.data.openid
              wx.setStorageSync('userId', res.data.data.openid)
              console.log(res,23)
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }

            }
          });

        }
      })
    }
  },
  getVcode() {

    let self = this;
    wx.request({
      url: "https://mp.orancat.com/puser/getvcode",
      method: "GET",
      complete: function (res) {

        if (res.data.status == 0) {
          self.globalData.vcode = res.data.vcode
          console.log(res, 23345)
        } else {
          wx.showModal({
            title: '提示',
            content: '请求失败，请联系管理员',
            showCancel: false
          })
        }
        console.log(self.globalData.vcode, 2545)
      }

    });
  },
  globalData: {
    userInfo: null,
    userId:'',
    checkedProArr:[],
    sortBysListArr:[],
    account:0,
    vcode: 0
  }
})
