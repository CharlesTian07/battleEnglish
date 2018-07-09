const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    enTitle: null,
    countDownNum: "30",
    translatedByTool: null,
    imageUrl: null,
    textInfoHidden: true,
    imageInfoHidden: true,
    timer: '',//定时器名字
    entranceType: 1,
  },

  //倒计时函数。这里有个问题，在倒计时尚未结束时用户点击返回按钮或者点击按钮跳转到另一页面。这个时候定时器还是在工作，解决这个问题的方法就是将定时器写在data里，页面加载的时候用调用；页面卸载的时候清除定时器即可。
  countDown: function (entranceType){
    let that = this;
    clearInterval(that.data.timer);
    let showTipOneTime = 20;
    let showTipTwoTime = 15;
    let countDownNum = that.data.countDownNum;
    if (countDownNum <= 0) {
      clearInterval(that.data.timer);
    }else{
      that.setData({
        timer: setInterval(function () {
          countDownNum--;
          that.setData({
            countDownNum: countDownNum
          })
          if (countDownNum == showTipOneTime) {
            that.setData({
              textInfoHidden: false
            })
          } else if (countDownNum == showTipTwoTime) {
            that.setData({
              imageInfoHidden: false
            })
          } else if (countDownNum == 0) {
            clearInterval(that.data.timer);
            wx.showToast({
              title: '对不起！您没能在规定时间内完成答题',
              icon: 'none',
              duration: 1000
            })
            let isCorrect = 0;//用户未在规定时间内完成答题的状态
            let costTime = 60;
            that.handleAfterAnswer(isCorrect, costTime, entranceType)
          }
        }, 1000)
      })
    }    
  },

  //获取训练英文条目
  getTrainIdiom: function (token, entranceType, challengerAnswerRecordId){
    let that = this;
    let url = app.globalConfig.pre_api_url + "public/getTrainIdiom";
    console.log("getTrainIdiom : token:" + token + " entranceType:" + entranceType + " challengerAnswerRecordId:" + challengerAnswerRecordId);
    wx.request({
      url: url,
      data: {
        token: token,
        entranceType: entranceType,
        challengerAnswerRecordId: challengerAnswerRecordId
      },
      success: function (response) {
        console.log("getTrainIdiom:response.data:" + response.data)
        let status = response.data.status;
        let msg = response.data.msg;
        console.log("getTrainIdiom:status:" + status)
        console.log("getTrainIdiom:msg:" + msg)
        //由于返回的状态有且只有一个，所以有switch语句，减少代码执行
        switch (status) {
          case "0":
            wx.showModal({
              title: '提示',
              content: msg,
              showCancel: false,
              confirmText: '朕知道啦',
              success: function(){
                wx.redirectTo({
                  url: '../index/index',
                })
              }
            })
          case "2":
            that.handleGetTrainIdiomStatusTwo(response)
            break;
          case "4":
            that.handleGetTrainIdiomStatusFour(msg)
            break;
          case "6":
            that.handleGetTrainIdiomStatusSix(msg, entranceType)
            break;
          case "7":
            that.handleGetTrainIdiomStatusSeven(msg)
            break;
        }
      }
    })
  },

  handleGetTrainIdiomStatusTwo: function (response){
    let that = this;
    let datas = response.data.data;
    wx.setStorageSync("idiomData", response.data.data)
    let enTitle = datas.enTitle;
    let imageUrl = app.globalConfig.pre_api_url + "storage/app/public/" + datas.imgUrl;
    let translatedByTool = datas.titleTranslatedByTool;
    let answer = datas.title;
    let idiomId = datas.id;
    that.setData({
      idiomId: idiomId,
      answer: answer,
      enTitle: enTitle,
      imageUrl: imageUrl,
      translatedByTool: translatedByTool,
    })
  },

  handleGetTrainIdiomStatusFour: function (msg){
    let that = this;
    clearInterval(that.data.timer)
    wx.showModal({
      title: '提示',
      content: msg,
      success: function (res) {
        if (res.cancel) {
          wx.redirectTo({
            url: '../index/index',
          })
        }
        else if (res.confirm) {
          wx.redirectTo({
            url: '../tips/tips',
          })
        }
      }
    })
  },

  handleGetTrainIdiomStatusSix: function (msg, entranceType){
    let that = this;
    clearInterval(that.data.timer)
    wx.showModal({
      title: '提示',
      content: msg,
      success: function (res) {
        if (entranceType == 3) {
          wx.redirectTo({
            url: '../index/index',
          })
        } else {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },

  handleGetTrainIdiomStatusSeven: function (msg){
    let that = this;
    clearInterval(that.data.timer)
    that.setData({
      enTitle: msg
    })
    wx.showModal({
      title: '提示',
      content: '恭喜您已学完所有的题库！快去选择组队竞赛寻找优越感吧~',
      success: function (res) {
        wx.redirectTo({
          url: "../index/index"
        })
      }
    })
  },

  //进入单人训练结果，在进入之前要做一些数据处理
  goToResult: function(){
    clearInterval(this.data.timer);
    wx.showLoading({
      title: '答案核对中...',
    })
    let that = this;
    let answer = that.data.answer;
    let userAnswer = that.data.userAnswerContent;
    if (userAnswer == answer){
      wx.hideLoading()
      clearInterval(that.data.timer);
      wx.showToast({
        title: '回答正确',
        icon: 'success'
      })
      let isCorrect = 1;
      let costTime = 60 - that.data.countDownNum;
      let entranceType = that.data.entranceType;
      that.handleAfterAnswer(isCorrect, costTime, entranceType)
    }else{
      wx.hideLoading()
      wx.showToast({
        title: '回答错误',
        icon: 'none',
        duration: 1000
      })
    }
  },

  //处理回答之后的数据
  handleAfterAnswer: function (isCorrect, costTime, entranceType){
    let that = this;
    // let token = wx.getStorageSync("token");
    let token = app.globalData.token;
    let idiomId = that.data.idiomId;
    // 挑战者的答题记录id，如果没有，默认为0
    let challengerAnswerRecordId = that.data.challengerAnswerRecordId;
    wx.request({
      url: app.globalConfig.pre_api_url + 'public/handleAfterAnswer',
      data: {
        token: token,
        idiomId: idiomId,
        isCorrect: isCorrect,
        costTime: costTime,
        entranceType: entranceType,
        challengerAnswerRecordId: challengerAnswerRecordId
      },
      success: function (res) {
        console.log("handleAfterAnswer:" + res.data)
        //这个用户答题记录id，这个要保存下来是因为，如果该用户发起跳战是需要这个数据与被跳战用户的答题记录（challengerAnswerRecordId）作对比
        let status = res.data.status;
        let msg = res.data.msg;
        console.log("msg:" + msg)
        if (status == "2"){
          let answerRecord = res.data.data.answerRecord;
          wx.setStorageSync("answerRecord", answerRecord)
          setTimeout(function () {
            wx.navigateTo({
              url: '../singleTraining/result',
            })
          }, 1000)
        }else{
          wx.showModal({
            title: '提示',
            content: msg + '请重新进入。',
            showCancel: false,
            confirmText: 'copy that',
            success: function(){
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      }
    })
  },

  //获取用户输入的成语
  getUserAnswer: function(e){
    this.setData({
      userAnswerContent: e.detail.value
    })
  },

  //图片点击，预览大图效果
  showBigImage:function(){
    let that = this;
    let imageUrl = that.data.imageUrl;
    wx.previewImage({
      current: imageUrl,
      urls: [imageUrl],
      success: function(res){

      },
      complete: function(){
        that.countDown();//这个函数写在这里，是因为setInterval和setTimeout是异步线程；HTTPS请求默认也是异步的；js执行代码时，由于是单线程的，所以在点击图片预览大图时，会中断正在执行的异步线程setInterval，优先执行请求imageUrl，即在请求imageUrl之后，setInterval（也就是倒计时效果会被停止）会被中断。所以为了防止这种情况，要把setInterval异步线程的执行提到获取imageUrl的前面（这里也体现到了js是单线程解析代码的）。
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let entranceType = options.entranceType;
    // 这个是挑战者挑战的记录id
    let challengerAnswerRecordId = options.challengerAnswerRecordId;
    if (challengerAnswerRecordId == undefined || challengerAnswerRecordId == null || challengerAnswerRecordId == '') {
      challengerAnswerRecordId = 0;
    }
    if (entranceType == undefined || entranceType == null || entranceType == '') {
      entranceType = 1;
    }
    // 模拟挑战
    // challengerAnswerRecordId = 42;
    // entranceType = 3;
    console.log("entranceType=" + entranceType)
    console.log("challengerAnswerRecordId=" + challengerAnswerRecordId)
    that.setData({
      entranceType: entranceType,
      challengerAnswerRecordId: challengerAnswerRecordId
    })
    let token = app.globalData.token;
    console.log("token:" + token)
    if(token){
      that.handleTipStatus(token, entranceType, challengerAnswerRecordId);
    }else{
      app.userLogin();
      that.getUserToken(entranceType, challengerAnswerRecordId)
    }   
  },

  getUserToken: function (entranceType, challengerAnswerRecordId){
    let that = this;
    setTimeout(function(){
      let token = app.globalData.token;
      if (token == '' || token == null) {
        that.getUserToken()
      }else{
        that.handleTipStatus(token, entranceType, challengerAnswerRecordId);
      }
    },500)
  },

  handleTipStatus: function (token, entranceType, challengerAnswerRecordId){
    let that = this;
    let singleTrainingTipStatus = app.globalData.singleTrainingTipStatus;
    let countDownNum = 30;
    if (singleTrainingTipStatus == false) {
      wx.showModal({
        title: '提示',
        content: '如果您在未完成训练之前退出，系统默认您已训练该项目，且消耗一次训练数及得分为零',
        success: function (res) {
          if (res.confirm) {
            app.globalData.singleTrainingTipStatus = true;
            that.setData({
              countDownNum: countDownNum
            })
            that.getTrainIdiom(token, entranceType, challengerAnswerRecordId);
            that.countDown(entranceType);
          } else if (res.cancel) {
            if (entranceType != 1) {
              //如果是主动进来的，那么用户点击取消的时候返回首页即可。
              that.cancleTipsNavTo();
            } else {
              //如果不是主动进来的，那么在用户点击取消的时候要直接退出小程序。
              that.cancelTipsNavBack();
            }
          }
        }
      })
    } else {
      that.setData({
        countDownNum: countDownNum
      })
      that.getTrainIdiom(token, entranceType, challengerAnswerRecordId);
      that.countDown(entranceType);
    }
  },

  cancelTipsNavBack: function(){
    wx.navigateBack({
      delta: 1,
    })
  },

  cancleTipsNavTo: function(){
    wx.redirectTo({
      url: '../index/index',
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
    //页面卸载时清除定时器
    clearInterval(this.data.timer);
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