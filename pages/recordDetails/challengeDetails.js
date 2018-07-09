const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commonIdiom: {
      title: '望子成龙',
      enTitle: 'I have high hopes for my son or daughter',
    },
    answerRecord: [
      {
        title: '望子成龙',
        enTitle: 'I have high hopes for my son or daughter',
        costTime: 30,
        accuracy: 40,
        score: 48,
        created_at: '2018-06-01 12:12:12',
        isWin: 1,
      },
      {
        title: '如鱼得水',
        enTitle: 'like duck to water',
        costTime: 20,
        accuracy: 46,
        score: 45,
        created_at: '2018-06-01 12:12:12',
        isWin: 0
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let userInfo = app.globalData.userInfo;
    that.setData({
      userInfo: userInfo
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