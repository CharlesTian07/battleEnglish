const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let idiomId = options.idiomId;
    idiomId = 6;
    let token = app.globalData.token;
    // console.log("token:" + token)
    if (token == '' || token == null){
      setTimeout(function(){
        token = app.globalData.token;
        that.getIdiomInfo(token, idiomId);
      },1000)
    }else{
      that.getIdiomInfo(token, idiomId);
    }
  },

  getIdiomInfo: function (token, idiomId){
    let that = this;
    let url = app.globalConfig.pre_api_url + 'public/getIdiom';
    wx.request({
      url: url,
      data: {
        token: token,
        idiomId: idiomId
      },
      success: function(res){
        let status = res.data.status;
        let msg = res.data.msg;
        if (status === "2"){
          let idiomInfo = res.data.data;
          let title = idiomInfo.idiom.title;
          let videoUrl = idiomInfo.idiom.video.videoUrl;
          // 测试数据
          videoUrl = 'idiomVideos/望子成龙_1.mp4';
          let referenceVideoUrl = app.globalConfig.pre_api_url + "storage/app/public/" + videoUrl;
          console.log("referenceVideoUrl:" + referenceVideoUrl)
          that.setData({
            title: title,
            referenceVideoUrl: referenceVideoUrl
          })
        }
      }
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})