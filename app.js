//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    globalConfig: {
      pre_api_url: 'https://www.encryption.funwall.cn/branch/server/',
    },

    globalData: {
      userInfo: {
        avatarUrl: '',
        nickName: ''
      },
      userDatas: [],
      singleTrainingTipStatus: false,//这个是进入单人训练时提示信息的状态，false表示还未提示过，true表示提示过，提示一次后便不再提示
      recordingTipStatus: false,//这个是进行录音时提示信息的状态，false表示还未提示过，true表示提示过，提示一次后便不再提示
      token: '',
      logged: false,
    },

    onLaunch: function () {
      // 展示本地存储能力
      let logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)
      wx.showLoading({
        title: '正在登录中...',
      })
      let that = this;
      that.userLogin();
    },

    //用户登录请求
    userLogin: function () {
      let that = this;
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            // console.log(res.code)
            var url = that.globalConfig.pre_api_url + 'public/miniAPPLogin';
            wx.request({
              url: url,
              data: {
                code: res.code
              }, 
              success: function (response) {
                wx.hideLoading()
                that.handleResponse(response)
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });
    },

    handleResponse: function (response){
      let that = this;
      let status = response.data.status;
      let userDatas = response.data.data;
      let token = userDatas.user.token;
      that.globalData.logged = true;
      // wx.setStorageSync("token", token)
      that.globalData.token = token;
      console.log("token:" + token)
      if (status === "2") {
        that.globalData.userDatas = userDatas;
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })
      } else if (status === "3") {
        that.getUserInfo(token)
      } else {
        wx.showModal({
          title: '提示',
          content: '登录失败，请重启小程序',
        })
      }
    },

    getUserInfo: function (token){
      let that = this;
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                that.globalData.userInfo = res.userInfo;
                that.authorize(token, res.userInfo)
              }
            })
          } else {
            console.log('授权失败');
            // 显示提示弹窗
            wx.showModal({
              title: '警告',
              content: '若不授权微信登陆，则无法使用主要功能。点击授权，则可重新使用',
              cancelText: '放弃',
              confirmText: '授权',
              success: function (res) {
                if (res.confirm || res.cancel) {
                  wx.openSetting({
                    success: function (response) {
                      response.authSetting = { "scope.userInfo": true, };
                      // 要调到指定界面登录
                      wx.navigateTo({
                        url: '../manualLogin/manualLogin',
                      })
                    },
                    fail: function () {
                      console.log('授权失败');
                    },
                  });
                }
              },
            });
          }
        }
      })
    },

    //授权获取更多用户信息，该函数只会在新用户第一次进入时调用
    authorize: function (token, userInfo) {
      let that = this;
      console.log("userInfo:" + userInfo)
      let url = that.globalConfig.pre_api_url + "public/makeupUserInfo?token=" + token + "&avatarUrl=" + userInfo.avatarUrl + "&city=" + userInfo.city + "&country=" + userInfo.country + "&gender=" + userInfo.gender + "&language=" + userInfo.language + "&nickname=" + userInfo.nickName + "&province=" + userInfo.province;
      wx.request({
        url: url,
        success: function (response) {
          if (response.data.status == "2") {
            wx.hideLoading()
            wx.showToast({
              title: '载入中...',
              icon: 'loading'
            })
          } else {
            let msg = response.data.msg;
            wx.showToast({
              title: msg,
              icon: 'none'
            })
          }
        }
      })
    },

    onShow: function(){

    },

    onLoad: function(){
      
    },

    //验证手机号是否合法
    isMobileNumber: function (phone) {
      if (phone == null) {
        phone = '';
      }
      var flag = false;
      var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
      if (phone.length != 11) {
        this.errorHint('请输入11位手机号码');
      } else if (!myreg.test(phone)) {
        this.errorHint('请输入有效的手机号码！');
      } else {
        flag = true;
      }
      return flag;
    },

    //之前信息加密里设计的一个函数，用于提示错误操作
    errorHint: function (hint, callback, time_customized) {
      if (time_customized == null) {
        time_customized = 2000;
      }
      wx.showToast({
        title: hint,
        image: '../image/error.png',
        mask: true,
        success: function (res) {
          setTimeout(function () {
            wx.hideToast();
            if (callback != null) {
              callback();
            }
          }, time_customized);
        },
      });
    },

    // 验证参数的合法性
    isParameterdValidate: function (content, hint) {
      if (content == null) {
        content = '';
      }
      if (content.length <= 0) {
        this.errorHint(hint);
        return false;
      } else {
        return true;
      }
    },

    //将毫秒数的时间转化为xxxx-xx-xxdate格式
    ChangeDateFormat: function (cellval) {
      var date = new Date(parseInt(cellval.replace("/Date(", "").replace(")/", ""), 10));
      var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return date.getFullYear() + "-" + month + "-" + currentDate;
    },

    //将date格式转化为xxxx-xx-xx xx-xx-xx格式
    DateFormat: function (date, format) {
      if (date == null) return "";
      date = date.replace('T', ' ');
      date = new Date(date);
      var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
      };
      format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
          if (all.length > 1) {
            v = '0' + v;
            v = v.substr(v.length - 2);
          }
          return v;
        }
        else if (t === 'y') {
          return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
      });
      return format;
    },
})