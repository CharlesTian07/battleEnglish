//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    userInfo: {},
    logged: false,
    challengerNum: '',
    challengeHint: "快去查看具体战绩吧~",
    // canIUse: wx.canIUse('button.open-type.getUserInfo')//检查有没有使用权限
  },

  onLoad: function(options){
    let that = this
    that.getUserGlobalData()
  },

  // 因为用户的数据获取都是异步的，在Index页面加载完成后会取不到用户数据的情况，所以用setTimeout将获取用户数据的时间延迟，这里用到了递归的想法，即每500定时检查是否已获取到userDatas的值。
  getUserGlobalData: function(){
    let that = this;
    setTimeout(function () {
      // let userDatas = wx.getStorageSync("userDatas");
      let userDatas = app.globalData.userDatas;
      console.log("userDatas:" + userDatas)
      if (userDatas == '' || userDatas == null) {
        that.getUserGlobalData()
      }else{
        app.globalData.userInfo.avatarUrl = userDatas.user.headerUrl;
        app.globalData.userInfo.nickName = userDatas.user.name;
        app.globalData.rateOfWin = userDatas.user.rateOfWin;
        app.globalData.token = userDatas.user.token;
        // console.log("token:" + app.globalData.token)
        let challengerNum = userDatas.neededData.countOfUnReadChallenge;
        let numOfCanJoin = userDatas.user.numOfCanJoin;
        let numOfChallenge = userDatas.user.numOfChallenge;
        // let numOfJoin = userDatas.user.numOfJoin;
        // let updated_at = userDatas.user.updated_at;
        that.setData({
          userInfo: app.globalData.userInfo,
          logged: app.globalData.logged,
          challengerNum: challengerNum,
          numOfCanJoin: numOfCanJoin,
          numOfChallenge: numOfChallenge,
          token: app.globalData.token
        })
      }
    }, 500)
  },

  onShow: function(){

  },

  //跳转到单人训练界面
  goToSingleTraining: function () {
    // let token = wx.getStorageSync("token");
    let token = this.data.token;
    if (token) {
      wx.navigateTo({
        url: '../singleTraining/singleTraining',
      })
    } else {
      wx.showToast({
        title: '请先登录再训练噢~',
        icon: 'none'
      })
    }
  },

  //跳转查看挑战记录界面
  checkChallengeRecord: function () {
    // let token = wx.getStorageSync("token");
    let token = this.data.token;
    if (token) {
      wx.navigateTo({
        url: '../personalInfo/personalInfo',
      })
    } else {
      wx.showToast({
        title: '请先登录再查看噢~',
        icon: 'none'
      })
    }
  },

  goToRandomMatch: function () {
    // let token = wx.getStorageSync("token");
    let token = this.data.token;
    if (token) {
      wx.navigateTo({
        url: '../randomMatch/randomMatch',
      })
    } else {
      wx.showToast({
        title: '请先登录再竞赛噢~',
        icon: 'none'
      })
    }
  },

  //跳转到组队竞赛界面
  goToTeamReplies: function () {
    // let token = wx.getStorageSync("token");
    let token = this.data.token;
    if (token) {
      wx.navigateTo({
        url: '../teamReplies/teamReplies',
      })
    } else {
      wx.showToast({
        title: '请先登录再竞赛噢~',
        icon: 'none'
      })
    }
  },

  goToSendGifts: function () {
    wx.navigateTo({
      url: '../sendGifts/sendGifts',
    })
  },

  //跳转到意见或录音界面
  goToSuggestionAndRecording: function () {
    wx.navigateTo({
      url: '../suggestionAndRecording/suggestionAndRecording',
    })
  },
})
