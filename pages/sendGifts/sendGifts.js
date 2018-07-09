Page({

  /**
   * 页面的初始数据
   */
  data: {
    contributeVideoNum: 10,
    title: "望子成龙",
    videoUrl: "../image/like father like son.jpg",
    videoNum: "",
    addClass: "",
    videoId: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
    ],
    currentId: 1,
  },

  //利用事件委托，省了大量的DOM事件和系统内存
  chooseGifts: function(e){
    let giftId = e.target.id;
    console.log(giftId);
  },

  //利用事件委托，省了大量的DOM事件和系统内存
  selectVideo: function(e){
    let that = this;
    let videoId = that.data.videoId;
    let currentId = e.currentTarget.id;
    console.log("e.currentTarget.dataset.videoId=" + e.currentTarget.dataset.videoId)
    console.log("currentId=" + currentId)
    // for (var i = 0; i < videoId.length; i++) {
    //   (function (item) {
    //     pageObject['selectVideo' + videoId.id] = function (e) {
    //       var id = parseInt(e.currentTarget.dataset.videoId)

    //       that.setData({
    //         currentId: id
    //       })
    //     }
    //   })(videoId[i])
    // }  
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