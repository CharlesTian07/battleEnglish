var qcloud = require('../../vendor/wafer2-client-sdk/index.js')
var config = require('../../config.js')
var util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    phone: '',
    inputFocusStyle: '',
  },

  textareaInput: function (e) {
    this.setData({
      content: e.detail.value,
    });
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value,
    });
  },
  loseFocus: function (e) {
    let flag = app.isMobileNumber(e.detail.data);
    if (flag == false) { return; }
  },
  clickSubmit: function () {
    // let url = app.globalConfig.pre_api + '/api/user/feedback.php';
    // let openId = this.data.openId;
    let content = this.data.content;
    let phone = this.data.phone;
    let flag = true;
    // if (openId == "" || openId == null){
    //   wx.showToast({
    //     title: '您还未登录，请登录后再提交',
    //     icon: 'none'
    //   })
    //   //这里执行完之后应该要加上调取获取用户信息的提示界面，这里还需要进一步优化
    //   return
    // }
    // 验证参数的合法性
    flag = app.isParameterdValidate(user_id, '该用户不存在');
    if (flag == false) { return; }
    flag = app.isParameterdValidate(content, '请先输入内容');
    if (flag == false) { return; }
    if (phone.length > 0) {
      flag = app.isMobileNumber(phone);
      if (flag == false) { return; }
    }
    if (flag == false) { return; }
    // 发送请求
    // wx.request({
    //   // url: `${config.service.host}/weapp/database_ss`,//这里url的路径应该是连接数据库的接口api，但是暂未研究出来怎么设计api,
    //   data: {
    //     // openId: openId,
    //     content: content,
    //     phone: phone,
    //   },
    //   success: function (res) {
    //     console.log(res.data.msg);
    //     app.successHint(res.data.msg);
    //     // 做相应的处理
    //   },
    //   fail: function (res) {
    //     console.log(res.data.msg);
    //   },
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    // let openId = options.openId;
    // console.log(openId);
    // this.setData({
    //   openId: openId
    // })

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