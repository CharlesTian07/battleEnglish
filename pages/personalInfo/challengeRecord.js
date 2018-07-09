const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unreadBtnColor: 'red',
    clicked: false,
    recordingAnimation: {},
    unreadRecordingHidden: false,
    readRecordingHidden: true,
    readRecording: [
      {
        title: '望子成龙',
        enTitle: 'I have high hopes for my son or daughter',
        costTime: 30,
        accuracy: 40,
        score: 48,
        competitor: {
          accuracy: 50,
          score: 48,
        },
        created_at: '2018-06-01 12:12:12',
        isWin: 1,
      },
      {
        title: '如鱼得水',
        enTitle: 'like duck to water',
        costTime: 20,
        accuracy: 46,
        score: 45,
        competitor: {
          accuracy: 50,
          score: 48,
        },
        created_at: '2018-06-01 12:12:12',
        isWin: 0,
      },
      {
        title: '如鱼得水',
        enTitle: 'like duck to water',
        costTime: 20,
        accuracy: 46,
        score: 45,
        competitor: {
          accuracy: 50,
          score: 48,
        },
        created_at: '2018-06-01 12:12:12',
        isWin: 1,
      }
    ]
  },

  unreadRecording: function(){
    let that = this;
    let clicked = false;
    let unreadBtnColor = 'red';
    let readBtnColor = '#666';
    let recordingAnimation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
      delay: 0,
      transformOrigin: '0% 50% 100%'
    });
    that.recordingAnimation = recordingAnimation;
    recordingAnimation.left(0).step();
    that.setData({
      unreadRecordingHidden: false,
      readRecordingHidden: true,
      recordingAnimation: recordingAnimation.export(),
      clicked: clicked,
      unreadBtnColor: unreadBtnColor,
      readBtnColor: readBtnColor
    })
  },

  readRecording: function(){
    let that = this;
    let clicked = true;
    let readBtnColor = 'red';
    let unreadBtnColor = '#666';
    let recordingAnimation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
      delay: 0,
    });
    that.recordingAnimation = recordingAnimation;
    //这里要传自适应设备的左边距值的话，要以字符串的形式传入百分比
    recordingAnimation.left('-100%').step();
    that.setData({
      unreadRecordingHidden: true,
      readRecordingHidden: false,
      recordingAnimation: recordingAnimation.export(),
      clicked: clicked,
      readBtnColor: readBtnColor,
      unreadBtnColor: unreadBtnColor
    })
  },

  goToChallengeDetails: function(){
    wx.navigateTo({
      url: '../recordDetails/challengeDetails',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    })
    // let token = wx.getStorageSync("token");
    let token = app.globalData.token;
    let recordType = 0;
    wx.request({
      url: app.globalConfig.pre_api_url + 'public/getChallengeRecorders',
      data: {
        token: token,
        type: recordType
      },
      success: function(res){
        console.log(res.data)
        let challengeRecorders = res.data.data.challengeRecorders;
        that.setData({
          unreadChallengeRecorders: challengeRecorders
        })
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