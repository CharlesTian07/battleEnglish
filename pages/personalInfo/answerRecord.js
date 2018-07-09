const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    playAudioAnimation: {},
    nodataViewHidden: true,
  },

  goToAnswerDetails: function(e){
    let that = this;
    let idiomId = e.currentTarget.id;
    let datas = e.currentTarget.dataset.type;
    let costTime = datas.costTime;
    let score = datas.score;
    let accuracy = datas.accuracy;
    let updated_at = datas.updated_at;
    let voiceUrl = datas.voiceUrl
    wx.navigateTo({
      url: '../recordDetails/answerDetails?idiomId=' + idiomId + '&costTime=' + costTime + '&score=' + score + '&accuracy=' + accuracy + '&updated_at=' + updated_at + '&voiceUrl=' + voiceUrl,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // let token = wx.getStorageSync("token");
    let token = app.globalData.token;
    if(token == '' || token == null){
      setTimeout(function(){
        token = app.globalData.token;
        that.getAnswerRecords(token);
      },1000)
    }else{
      that.getAnswerRecords(token);
    }
  },

  getAnswerRecords: function (token){
    let that = this;
    wx.request({
      url: app.globalConfig.pre_api_url + 'public/getAnswerRecorders?token=' + token,
      success: function (res) {
        console.log(res.data)
        let answerRecorders = res.data.data.answerRecorders;
        that.handleResponse(answerRecorders)
      }
    })
  },

  handleResponse: function (answerRecorders){
    let that = this;
    if (answerRecorders == '' || answerRecorders == null){
      that.setData({
        nodataViewHidden: false,
      })
    }else{
      for (let i = 0; i < answerRecorders.length; i++){
        console.log("updated_at:" + answerRecorders[i].updated_at)
        let score = Math.round(answerRecorders[i].score);
        let updated_at_dateFormat = app.ChangeDateFormat(answerRecorders[i].updated_at);
        let updated_at = app.DateFormat(updated_at_dateFormat, "yyyy-MM-dd hh:mm:ss");
        answerRecorders[i].score = score;
        answerRecorders[i].updated_at = updated_at;
        console.log("updated_at:" + answerRecorders[i].updated_at)
      }
      that.setData({
        answerRecorders: answerRecorders
      })
    }
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