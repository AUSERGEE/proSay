// page/component/new-pages/user/user.js
Page({
  data:{
    thumb:'',
    nickname:''
  },
  onLoad(){
    var self = this;
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function(res){
        self.setData({
          thumb: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName
        })
      }
    })

   
  },
  onShow(){
    var self = this;
    
  }
})