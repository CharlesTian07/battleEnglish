const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  //当用户未授权过，调用该接口将直接报错，所以最好在获取用户信息时，检查下授权情况
  //当用户授权过，可以使用该接口获取用户信息
  login: function () {
    let that = this;
    app.userLogin();
    let logged = app.globalData.logged;
    if(logged === true){
      wx.navigateTo({
        url: '../singleTraining/singleTraining',
      })
    }else{
      wx.showToast({
        title: '请重试',
        icon: 'none'
      })
    }
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
  onShareAppMessage: function () {
    
  }
})