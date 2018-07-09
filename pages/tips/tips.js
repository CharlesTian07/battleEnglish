const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  getStudyChanceByShare: function (token){
    let that = this;
    wx.request({
      url: app.globalConfig.pre_api_url + 'public/share?token=' + token,
      success: function(res){
        console.log("res.data:" + res.data)
        let status = res.data.status;
        console.log("status = " + status)
        if(status == 2){
          wx.showModal({
            title: '提示',
            content: '分享成功，恭喜您获得了一次学习机会',
            success: function(res){
              if(res.confirm){
                wx.navigateTo({
                  url: '../singleTraining/singleTraining?entranceType=1',
                })
              }
            }
          })
        }
      }
    })
  },

  //送礼入口
  sendGifts: function(){
    wx.navigateTo({
      url: '../sendGifts/sendGifts',
    })
  },

  feedback: function () {
    wx.navigateTo({
      url: 'feedback',
    })
  },

  recharge: function(){
    wx.navigateTo({
      url: '../recharge/recharge',
    })
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
  onShareAppMessage: function (res) {
    let that = this;
    let token = wx.getStorageSync("token"); 
    let entranceType = 2;
    if (res.from == "button") {
      console.log(res.target)
    }
    return {
      title: '快来一起学习英语成语吧~',
      path: '/pages/singleTraining/singleTraining?entranceType=' + entranceType,
      imageUrl: '/pages/image/readyToStudy.jpg',
      success: function(res){
        console.log('分享成功')
        that.getStudyChanceByShare(token);
      },
      fail: function(res){
        console.log('分享失败')
      }
    }
  }
})