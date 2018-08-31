
Page({
  data: {
    texts: "至少5个字",
    min: 5,//最少字数
    max: 140, //最多字数 (根据自己需求改变) 
    textContent:'',
    thumb:'null',
    nickname:'null'
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
    var userName = this.data.nickname;
    var data={
      userName:userName,
      content: this.data.textContent,
      platform:'003'
    }
    wx.request({
      url: "https://mp.orancat.com/omessage/commit",
      header: {
        "userId": userId
      },
      method: "POST",
      data:data,
      complete: function (res) {
        wx.hideLoading();
        console.log(res, 'commit');
        if (res.data.status == 0) {
          self.setData({
            textContent: ''
          })
          wx.showModal({
            title: '提示',
            content: '留言已提交成功',
            showCancel: false
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
  
  }

})
