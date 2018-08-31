const Dialog = require('../../../zanui/dialog/dialog');
Page({
  data:{
    thumb:'',
    nickname:'',
    nodeList:[],
    proInfo:[],
    barcode:'',
    addnodeHide:false,
    typeArr: ['随笔', '日记', '鱼书', '诗一首', '书摘'],
    ifEdit:true,
    bottomLoading:false,
    loadingComplete:false,
    pageIndex:1,
    isPullDownRefreshNow:false,
    proNameUndefine:false
  },
  onLoad(options){
    var barcode = options.barcode ? options.barcode:'';
    this.setData({
      barcode: barcode
    });
    this.getProductInfo(barcode)  //请求当前商品的留言列表
    if (options.fromPage&&options.fromPage=="rank"){
      this.setData({
        addnodeHide: true,
        ifEdit:false
      });
    }
    //this.getProductInfo('6925009926745')
  },
  onShow(){
    //从添加手账页面回来时重新请求数据***已废弃
    // if (this.data.barcode!=''){
    //   this.getProductInfo(this.data.barcode)
    // }
  },
  getProductInfo(barcode){
    this.showLoading('加载中..');
    var self=this;
    wx.request({
      url: "https://mp.orancat.com/product/getProduct",
      method: "POST",
      data: { scanresult: barcode},
      complete: function (res) {
        self.hideLoading();
        console.log(res, 343);
        if (res.data.status==0){
           res.data.nodeList.forEach(function(item,index){
             item.creatDate = self.format(item.creatDate)
           })
            self.setData({
              nodeList: res.data.nodeList,
              proInfo: res.data.proInfo
            })
            if (res.data.proInfo.name.substr(0,3)=="未命名"){
              self.setData({
                proNameUndefine:true
              })
            }
            if (self.data.isPullDownRefreshNow){ //如果是通过下拉刷新事件进来的话
              wx.stopPullDownRefresh()
              self.setData({
                isPullDownRefreshNow: false
              })
            }
            
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          })
        }
      }
    });
  },
  getProductMore(barcode) {
    var self = this;
    wx.request({
      url: "https://mp.orancat.com/product/getProductMore",
      method: "POST",
      data: { scanresult: barcode,pageIndex:self.data.pageIndex+1},
      complete: function (res) {
        
        //console.log(res, 'getProductMore');
        if (res.data.status == 0) {
          if (res.data.nodeList.length>0){
            let newNodeList = self.data.nodeList.concat(res.data.nodeList)
            self.setData({
              nodeList: newNodeList,
              pageIndex:self.data.pageIndex+1,
              bottomLoading: false
            })
            
          } else {
            
            self.setData({
              loadingComplete: true,
              bottomLoading: false
            })
          }

        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          })
        }
      }
    });
  },
  turnToSubmit(){
    wx.navigateTo({
      url: "/page/component/addNode/addNode?barcode=" + this.data.barcode,
    })
  },
  format(datestr) {
    var shijianchuo = parseInt(datestr);
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    var week = time.getDay()
    var weekArr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    let formatString="";
    if (Number(h) < 12) {
      formatString = "上午" + this.add0(h);
    } else if (Number(h) < 18){
      formatString = "下午" + this.add0((Number(h) - 12));
    }else{
      formatString = "晚上" + this.add0((Number(h) - 12));
    }
    return y + '年' + this.add0(m) + '月' + this.add0(d) + '日' + ' ' + weekArr[week]+' ' + formatString + ':'+  this.add0(mm)
  },
  add0(m) { return m < 10 ? '0' + m : m },
  comfirmorder(){
    this.showLoading('加载中..');
    var self=this;
    var productInfo = JSON.stringify(this.data.productArr)
    wx.request({
      url: 'https://mp.orancat.com/sshop/commitOrder',
      header: {
        "Content-Type": "application/json",
        "userId": wx.getStorageSync('userId')
      },
      method: "POST",
      data: {
        accountPrice: self.data.accountMoney,
        productInfo: productInfo
      },
      success: function (res) {
        console.log(res, 'req-R')
        self.hideLoading();
        if(res.data.status==0){
          self.resetOrder();
          self.handleClick('订单生成成功，请在交易记录中查看');
        }else{
          self.handleClick('订单生成失败');
        }
        
      }
    })
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
  turnToEditPro(){
    if (this.data.ifEdit){
      wx.navigateTo({
        url: "/page/component/editPro/editPro?barcode=" + this.data.barcode + "&proName=" + this.data.proInfo.name
      })
    }
  },
  modifyProName(name) {
    this.setData({
      ['proInfo.name']: name
    })
  },
  onReachBottom: function () {
    var that = this;
    // 显示加载图标
    this.setData({
      bottomLoading:true
    })
    this.getProductMore(this.data.barcode)

  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      isPullDownRefreshNow:true
    })
    this.getProductInfo(this.data.barcode)
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: [current]
    })
    console.log(current, 200)
  },
  loadmore(){
    var that = this;
    // 显示加载图标
    this.setData({
      bottomLoading: true
    })
    this.getProductMore(this.data.barcode)
  } 
})