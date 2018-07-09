const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winningRate: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let userInfo = app.globalData.userInfo;
    let winningRate = (app.globalData.rateOfWin).toFixed(2);
    that.setData({
      userInfo: userInfo,
      winningRate: winningRate
    })
  },

  answerRecord: function () {
    wx.navigateTo({
      url: 'answerRecord',
    })
  },

  challengeRecord: function () {
    wx.navigateTo({
      url: 'challengeRecord',
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