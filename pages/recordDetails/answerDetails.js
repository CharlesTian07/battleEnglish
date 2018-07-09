const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    idiomInfo: [],
    playAudioAnimation: {},
    timer: '',
    playAudioStatus: false,
  },

  playAudio: function () {
    let that = this;
    let playAudioStatus = that.data.playAudioStatus;
    if (playAudioStatus == false) {
      that.setData({
        playAudioStatus: true
      })
      let voiceUrl = that.data.voiceUrl;
      if (voiceUrl) {
        that.createAnInnerAudioContextObj(voiceUrl);
      } else {
        wx.showModal({
          title: '提示',
          content: '播放失败！若您近期录音较多，可能是因为微信录音文件不能超过10M限制导致，请清理后再尝试',
          success: function (res) {

          },
        })
      }
    } else {
      return;
    }
  },

  //动画对象
  createAnInnerAudioContextObj: function (voiceUrl) {
    let that = this;
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.autoplay = true;
    //播放录音的路径
    innerAudioContext.src = voiceUrl;
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      that.setData({
        timer: setInterval(function () {
          let animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
          })
          that.animation = animation
          animation.opacity(0.5).scale(1.5, 1.5).step()
          animation.opacity(1).scale(1, 1).step()
          that.setData({
            playAudioAnimation: animation.export()
          })
        }, 1000)
      })
    })
    innerAudioContext.onEnded(() => {
      console.log('播放结束')
      clearInterval(that.data.timer)
      that.setData({
        playAudioStatus: false,
      })
    })
  },

  goToPlayVideo: function(){
    let that = this;
    let idiomId = that.data.idiomId;
    wx.navigateTo({
      url: '../referenceVideo/referenceVideo?idiomId=' + idiomId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // let token = wx.getStorageSync("token");
    let token = app.globalData.token;
    let idiomId = options.idiomId;
    let costTime = options.costTime;
    let score = options.score;
    let accuracy = options.accuracy;
    let totalScore = parseInt(score) + parseInt(accuracy/2);
    let updated_at = options.updated_at;
    let voiceUrl = app.globalConfig.pre_api_url + "storage/app/public/" + options.voiceUrl;
    that.setData({
      costTime: costTime,
      score: score,
      accuracy: accuracy,
      updated_at: updated_at,
      totalScore: totalScore,
      voiceUrl: voiceUrl,
      idiomId: idiomId
    })
    wx.request({
      url: app.globalConfig.pre_api_url + 'public/getIdiom?token=' + token + '&idiomId=' + idiomId,
      success: function (res) {
        console.log(res.data)
        let idiomInfo = res.data.data.idiom;
        console.log("idiomInfo:" + idiomInfo)
        let videoCoverUrl = app.globalConfig.pre_api_url + "storage/app/public/" + idiomInfo.video.videoCoverUrl;
        idiomInfo.video.videoCoverUrl = videoCoverUrl;
        that.setData({
          idiomInfo: idiomInfo
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