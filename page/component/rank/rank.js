// page/component/suggest/suggest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankList:[],
    vcode:0,
    bottomLoading: false,
    loadingComplete: false,
    pageIndex: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setVcode()
    this.getRankList()
  },
  setVcode() {
    var app = getApp();
    var vcode = app.globalData.vcode;
    console.log(vcode,545)
    this.setData({ vcode: vcode })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

 
  getRankList: function () {
    if (this.data.pageIndex==1){
      wx.showLoading({ title: '加载中..' })
    }
   
    var self = this;
    let reqIndex=this.data.pageIndex
    let newRankList=[]
    wx.request({
      url: "https://mp.orancat.com/product/getRanking?pageIndex=" + reqIndex,
      method: "GET",
      complete: function (res) {
        if (self.data.pageIndex == 1) {
          wx.hideLoading();
          newRankList = res.data.result;
        }else{
          newRankList = self.data.rankList.concat(res.data.result)
        }
        console.log(res.data.result,'getRanking')
        if (res.data.status == 0) {
          if (res.data.result.length > 0) {
              self.setData({
                rankList: newRankList,
                pageIndex: self.data.pageIndex + 1,
                bottomLoading: false
              })
          }else{
              self.setData({
                loadingComplete: true,
                bottomLoading: false
              })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '请求失败，请联系管理员',
            showCancel: false
          })
        }
      }

    });
  },
  onReachBottom: function () { //滑动到底部时触发
    var that = this;
    this.setData({
      bottomLoading: true  // 显示loading提示
    })
    this.getRankList()  //请求下一页数据
  },
  loadmore() {
    var that = this;
    this.setData({
      bottomLoading: true
    })
    this.getRankList()
  }, 
  // 下拉刷新
  //刷新后，需重置页数为第一页
  onPullDownRefresh: function () {
    wx.showLoading({ title: '更新中..' })
    var self = this;
    let newRankList = []
    wx.request({
      url: "https://mp.orancat.com/product/getRanking?pageIndex=" + 1,
      method: "GET",
      complete: function (res) {
        wx.hideLoading();
        newRankList = res.data.result;
        //console.log(res.data.result,'getRanking')
        if (res.data.status == 0) {
            self.setData({
              rankList: newRankList,
              pageIndex:1
            })
            wx.stopPullDownRefresh()
        } else {
          wx.showModal({
            title: '提示',
            content: '请求失败，请联系管理员',
            showCancel: false
          })
        }
      }

    });
  },
  turnToProDtl(e) {
    var barcode = e.currentTarget.dataset.barcode;
    wx.navigateTo({
      url: "/page/component/proDtl/proDtl?barcode=" + barcode+"&fromPage=rank",
    })
  }
})