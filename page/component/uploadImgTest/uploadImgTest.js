
Page({
  data: {
    imgUrl:""
  },

  
  commitImg(){
    let self=this;
    wx.chooseImage({
      count: 9, // 默认9  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: 'https://mp.orancat.com/proImgUpload',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            console.log(res.statusCode);
            //console.log(res.data.status);
            if(res.statusCode==200){
              if(data.status=='0'){
                  self.setData({
                     imgUrl:data.imgUrl
                  })
                  console.log(data.imgUrl,2221)
              }
            }
          }
        })
      }
    })
  
  }

})
