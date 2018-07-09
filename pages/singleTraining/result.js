const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    enTitle: "",
    rightAnswerContent: "",
    costTime: "",
    imageUrl: "",
    tipsForUserRecord: '点击图标开始录音...',
    getScoreAlready: false,
    scoreResultHidden: true,
    isCorrectHintHidden: false,
    isNotCorrectHintHidden: true,
    userAudioViewHidden: true,
    videoInfoViewHidden: true,
    btnViewHidden: true,
    recordingViewHidden: false,
    remainRecordTime: 10,
    timer: "",
    recordAnimation: {},
    playAudioAnimation: {},
    accuracy: "80",
    recordingImgUrl: "../image/startRecordingIcon.jpg",
    submitViewHidden: true,
    recordingStatus: 0 ,//0：准备状态 1：正在录音
    playAudioStatus: false, //有这么一个问题就是多次点击播放图标，会重叠在一起播放，这是为了防止这种情况的应对状态，false表示未点击，true表示未结束之前不能点击的状态
  },

  //点击录音的按钮。该按钮有3种状态
  recordingProgress: function(){
    let that = this;
    let recordingStatus = this.data.recordingStatus;
    if (recordingStatus == 0){
      //开始录音
      that.startRecording();
      let recordingImgUrl = '../image/recordingIcon.jpg'
      that.setData({
        recordingStatus: 1,
        recordingImgUrl: recordingImgUrl,
        tipsForUserRecord: '再次点击图标结束录音...'
      });
    } else if (recordingStatus == 1){
      //停止录音
      that.stopRecording();
      //变化按钮底图
      let recordingImgUrl = "../image/startRecordingIcon.jpg";
      let submitViewHidden = false;
      that.setData({
        recordingImgUrl: recordingImgUrl,
        submitViewHidden: submitViewHidden,
        tipsForUserRecord: '点击图标开始录音...',
        recordingStatus: 0
      })
    }
  },

  // 处理点击录音事件
  handleAudioEvents: function(){
    let that = this;
    const recorderManager = wx.getRecorderManager();
    //录音所需参数
    const options = {
      duration: 10000,//可录音的最长时间
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',//暂只支持mp3格式
      frameSize: 50
    };
    recorderManager.start(options);//开启录音准备，还未开始
    //开始录音
    recorderManager.onStart(() => {
      let remainRecordTime = that.data.remainRecordTime;
      that.setData({
        timer: setInterval(function () {
          remainRecordTime--;
          // let recordAnimation = that.data.recordAnimation;
          // that.createAnimationObj(recordAnimation);
          let animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
          })
          that.animation = animation
          animation.opacity(0.5).scale(2, 2).step()
          animation.opacity(1).scale(1, 1).step()
          console.log(remainRecordTime);
          that.setData({
            remainRecordTime: remainRecordTime,
            recordAnimation: animation.export()
          })
          if (remainRecordTime == 0) {
            clearInterval(that.data.timer)
          }
        }, 1000)
      })
    });
    //这个是10s之后录音自动结束
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      clearInterval(that.data.timer)
      wx.showToast({
        title: '录音完成',
        icon: 'success'
      })
      //用户录完音后的音频暂存路径
      let audioFile = res.tempFilePath;
      wx.setStorageSync("audioFile", audioFile)
      let recordingImgUrl = "../image/startRecordingIcon.jpg";
      let submitViewHidden = false;
      that.setData({
        submitViewHidden: submitViewHidden,
        recordingImgUrl: recordingImgUrl
      })
      let enTitle = wx.getStorageSync("enTitle")
      setTimeout(function () {
        //请求测评发音
        that.testAudioScore(audioFile, enTitle);
      }, 500)
    });
    //录音出错事件
    recorderManager.onError((res) => {
      wx.showToast({
        title: '录音失败',
        icon: 'none'
      })
    });
  },

  //正在录音
  startRecording: function(){
    let that = this;
    let remainRecordTime = 10;
    that.setData({
      remainRecordTime: remainRecordTime
    })
    let recordingTipStatus = app.globalData.recordingTipStatus;
    if (recordingTipStatus == false){
      wx.showModal({
        title: '提示',
        content: '请务必认真录音，确认准备完毕之后点击确认开始',
        showCancel: false,
        success: function (res) {
          app.globalData.recordingTipStatus = true;
          that.handleAudioEvents()
        }
      })
    }
    else{
      that.handleAudioEvents()
    }
  },

  // 处理录制好的音频，并上传至后台。
  handleAfterRecord: function (audioFile, token, accuracy, answerRecordId, idiomId, entranceType, challengerAnswerRecordId){
    let that = this;
    wx.uploadFile({
      url: app.globalConfig.pre_api_url + 'public/handleAfterRecord',      //此处换上你的接口地址  
      filePath: audioFile,
      name: 'audioFile',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json',
      },
      formData: {
        'token': token,  //其他额外的formdata，可不写
        'accuracy': accuracy,
        'answerRecordId': answerRecordId,
        'idiomId': idiomId,
        'entranceType': entranceType,
        'challengerAnswerRecordId': challengerAnswerRecordId
      },
      success: function (res) {
        //坑：与wx.request不同，wx.uploadFile返回的是[字符串]，需要自己转为JSON格式
        let datas = null;
        try {
          datas = JSON.parse(res.data);
        } catch (exception) {
          wx.showToast({
            title: "exception:" + exception + " response:" + res,
          });
          console.log("exception:" + exception + " response:" + res.data);
          return;
        }
        console.log("datas:" + datas)　　
        let status = datas.status;
        let msg = datas.msg;        
        console.log("status:" + status + " msg:" + msg)
        if(status == "2"){
          let answerRecord = datas.data.answerRecord;
          console.log("answerRecord：" + answerRecord)
          let submitViewHidden = false;
          wx.showToast({
            title: '上传成功',
            icon: 'success'
          })
          that.setData({
            submitViewHidden: submitViewHidden,
            scoreResultHidden: false
          })
          setTimeout(function () {
            that.setData({
              userAudioViewHidden: false,
              videoInfoViewHidden: false,
              btnViewHidden: false,
              recordingViewHidden: true
            })
            that.saveRecordingFile(audioFile)
            wx.hideLoading()
          }, 600)
        } else if (status == "5"){
          let challengeRecord = datas.data.challengeRecord;
          let challengeUser = datas.data.challengeUser;
          let acceptUser = datas.data.acceptUser;
          wx.setStorageSync("challengeRecord", challengeRecord)
          wx.setStorageSync("challengeUser", challengeUser)
          wx.setStorageSync("acceptUser", acceptUser)
          console.log("challengeRecord:" + challengeRecord)
          console.log("challengeUser:" + challengeUser)
          console.log("acceptUser:" + acceptUser)
          wx.showToast({
            title: '上传成功',
            icon: 'success'
          })
          wx.navigateTo({
            url: '../recordDetails/challengeDetails',
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '上传失败，请重试！ msg:' + msg,
            showCancel: false,
          })
          return;
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '上传失败，请重试！',
        })
        return;
      },
    })  
  },

  //主动停止录音
  stopRecording: function(){
    let that = this;
    const recorderManager = wx.getRecorderManager();
    recorderManager.stop();//处理停止录音，还未停止
    //停止录音事件
    recorderManager.onStop((res) => {
      clearInterval(that.data.timer)
      wx.showToast({
        title: '录音完成',
        icon: 'success'
      })
      //用户录完音后的音频暂存路径
      let audioFile = res.tempFilePath;
      wx.setStorageSync("audioFile", audioFile);
      let recordingImgUrl = "../image/startRecordingIcon.jpg";
      that.setData({
        recordingImgUrl: recordingImgUrl,
        remainRecordTime: 0
      })
      let enTitle = that.data.enTitle;
      setTimeout(function(){
        //请求测评发音
        that.testAudioScore(audioFile, enTitle);
      },500)
    });
  },

 //请求测评发音，返回测试得分
  testAudioScore:function(audioFile,textContent){
    let that = this;
    // let token = wx.getStorageSync("token")
    let token = app.globalData.token;
    wx.showLoading({
      title: '正在获取分数...',
    })
    wx.uploadFile({
      url: app.globalConfig.pre_api_url + 'public/testAudioScore',
      filePath: audioFile,
      name: 'audioFile',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json',
      },
      formData: {
        'token': token,  //其他额外的formdata，可不写
        'textContent': textContent,
      },
      success: function (res) {
        wx.hideLoading()
        let datas = JSON.parse(res.data)
        let status = datas.status;
        if(status == 2){
          wx.showToast({
            title: '获取得分成功',
            icon: 'success'
          })
          //尼玛，这里不能用点运算符去取对象里的属性值，只能通过去对象属性名去取属性值
          let result = datas.data['result']['data']['read_sentence']['rec_paper']['read_chapter'];
          let pronounceScore = parseInt(result.total_score);
          console.log("pronounceScore is " + pronounceScore)
          let pronunciationAccuracy = parseInt(pronounceScore*2);
          that.setData({
            pronunciationAccuracy: pronunciationAccuracy,
            pronounceScore: pronounceScore,
            getScoreAlready: true
          })
        //这里要解析出来total_score
        // console.log("score:"+datas.result.data.read_sentence.rec_paper.read_chapter.total_score);
        }
        else{
          wx.showModal({
            title: '提示',
            content: '评分失败，请重新录音！',
          })
          return;
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '评分失败，请重新录音！',
        })
        return;
      },
    })  
  },

  //播放录音。不知道怎么回事，播放录音好像不支持中途停止播放，要么听完录音，要么退出
  playAudio: function () {
    let that = this;
    let playAudioStatus = that.data.playAudioStatus;
    if (playAudioStatus == false) {
      that.setData({
        playAudioStatus: true
      })
      let savedFilePath = that.data.savedFilePath;
      if (savedFilePath){
        that.createAnInnerAudioContextObj(savedFilePath);
      }else{
        wx.showModal({
          title: '提示',
          content: '播放失败！若您近期录音较多，可能是因为微信录音文件不能超过10M限制导致，请清理后再尝试',
          success: function (res) {

          },
        })
      }
    }else{
      return;
    }
  },

  //创建一个innerAudioContext对象
  createAnInnerAudioContextObj: function (savedFilePath){
    let that = this;
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.autoplay = true;
    //播放录音的路径
    innerAudioContext.src = savedFilePath;
    console.log("savedFilePath is " + savedFilePath)
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      that.setData({
        timer: setInterval(function(){
          // let playAudioAnimation = that.data.playAudioAnimation;
          // that.createAnimationObj(playAudioAnimation);
          let animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
          })
          that.animation = animation
          animation.opacity(0.5).scale(2, 2).step()
          animation.opacity(1).scale(1, 1).step()
          that.setData({
            playAudioAnimation: animation.export()
          })
        },1000)
      })
    })
    innerAudioContext.onEnded(() => {
      console.log('播放结束')
      clearInterval(that.data.timer)
      that.setData({
        playAudioStatus: false,
      })
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  //用户将录音好的音频文件上传至后台
  submitAudio: function(){
    let that = this;
    wx.showLoading({
      title: '正在上传...',
    })
    let audioFile = wx.getStorageSync("audioFile");
    console.log("audioFile:" + audioFile)
    // let token = wx.getStorageSync("token");
    let token = app.globalData.token;
    console.log("token:" + token)
    let idiomId = that.data.idiomId;
    console.log("idiomId:" + idiomId)
    // let answerRecordId = wx.getStorageSync("answerRecordId");
    let answerRecordId = that.data.challengerAnswerRecordId
    console.log("answerRecordId:" + answerRecordId)
    let accuracy = that.data.accuracy;
    console.log("accuracy:" + accuracy)
    let entranceType = that.data.entranceType;
    console.log("entranceType:" + entranceType)
    let challengerAnswerRecordId = that.data.challengerAnswerRecordId;
    console.log("challengerAnswerRecordId:" + challengerAnswerRecordId)
    // 测试数据
    // audioFile = 'wxfile://tmp_f5494d61c8746e79ca387c39d049515f.mp3';
    // token = 'ouxTT5MU3reY3dC7DOyvr8RJkR0Y';
    // idiomId = 6;
    // answerRecordId = 56;
    // accuracy = 98;
    // entranceType = 3;
    // challengerAnswerRecordId = 56;
    if (!audioFile){
      wx.showToast({
        title: '录音文件为空',
        icon: 'none'
      })
    }else{
      that.handleAfterRecord(audioFile, token, accuracy, answerRecordId, idiomId, entranceType, challengerAnswerRecordId)
    //不能将保存音频的操作放在这里执行，这里试验了多次，每次当wx.uploadFile和wx.saveFile一起用时，会出现上传不了音频文件的情况，但是能保存音频文件。但是放在setTimeout里就完美解决问题了，初步原因我认为是在上传音频（异步）和保存音频（同步）执行时代码离的比较近，数据请求（异步）并未处理完成就执行到保存操作，导致有了线程冲突（暂时给出的解释是这样），从而导致上传失败。
    // that.saveRecordingFile(audioFile)
    }
  },

  // 保存用户录制的音频文件
  saveRecordingFile: function (audioFile){
    let that = this;
    wx.saveFile({
      tempFilePath: audioFile,
      success: function (res) {
        let savedFilePath = res.savedFilePath;
        console.log("savedFilePath is " + savedFilePath)
        that.setData({
          savedFilePath: savedFilePath
        })
      }
    })
  },

  //下一关
  nextItem: function(){
    let that = this;
    let entranceType = 1;
    wx.navigateTo({
      url: '../singleTraining/singleTraining?entranceType=' + entranceType,
    })
  },

  // 返回首页
  goToIndex: function(){
    let entranceType = this.data.entranceType;
    if (entranceType == 1){
      wx.navigateBack({
        delta: 2
      })
    }else{
      wx.redirectTo({
        url: '../index/index',
      })
    }
  },

  //跳转到播放视频界面
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
    let idiomData = wx.getStorageSync("idiomData");
    let answerRecord = wx.getStorageSync("answerRecord");
    let answer = idiomData.title;
    let enTitle = idiomData.enTitle;
    let videoCoverUrl = app.globalConfig.pre_api_url + "storage/app/public/" + idiomData.video.videoCoverUrl;
    let score = parseInt(answerRecord.score);
    let costTime = parseInt(answerRecord.costTime);
    let isCorrect = answerRecord.isCorrect;
    let entranceType = answerRecord.entranceType;
    let idiomId = answerRecord.idiomId;
    console.log("entranceType:" + entranceType)
    // 这里的challengerAnswerRecordId其实就是当前用户答题记录id，现在存进data便于分享的时候取出来并携带
    let challengerAnswerRecordId = answerRecord.id;
    console.log("challengerAnswerRecordId:" + challengerAnswerRecordId)
    // 测试数据
    // costTime = 30;
    // isCorrect = 0;
    // entranceType = 1;
    // score = 0;
    // idiomId = 6;
    // challengerAnswerRecordId = 34;
    if (isCorrect == 0) {
      let isCorrectHintHidden = true;
      let isNotCorrectHintHidden = false;
      that.setData({
        isCorrectHintHidden: isCorrectHintHidden,
        isNotCorrectHintHidden: isNotCorrectHintHidden
      })
    }
    that.setData({
      rightAnswerContent: answer,
      enTitle: enTitle,
      costTime: costTime,
      isCorrect: isCorrect,
      videoCoverUrl: videoCoverUrl,
      score: score,
      entranceType: entranceType,
      idiomId: idiomId,
      challengerAnswerRecordId: challengerAnswerRecordId
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
   * 发起挑战
   */
  onShareAppMessage: function (res) {
    let enTitle = this.data.enTitle;
    // let answerRecordId = wx.getStorageSync("answerRecordId");
    let challengerAnswerRecordId = this.data.challengerAnswerRecordId;
    console.log("challengerAnswerRecordId:" + challengerAnswerRecordId)
    if(res.from == "button"){
      console.log(res.target)
    }
    return {
      title: enTitle,
      path: '/pages/singleTraining/singleTraining?entranceType=3&challengerAnswerRecordId=' + challengerAnswerRecordId,
      imageUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528388538253&di=b65f8dd294f9a142707db25dde07461d&imgtype=0&src=http%3A%2F%2Fs14.sinaimg.cn%2Fmw690%2F002GdLSCzy7dYwvTp6Jbd%26690',
      success: function(res){
        console.log(res)
        console.log("answerRecordId:" + answerRecordId)
      },
      fail: function(res){

      }
    }
  }
})