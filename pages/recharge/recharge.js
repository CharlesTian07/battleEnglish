var app = getApp();
Page({
  data: {
    one_month_img: "display:block",       //默认选中一个月选项
    three_months_img: "display:none",
    one_year_img: "display:none",
    vipType: 0,       //默认选项一个月为1
    totalFee: 5,       //默认选中一个月选项总费用为5元
  },

  // 页面初始化
  onLoad:function(){
    let that = this;
    let token = wx.getStorageSync("token");
    wx.request({
      url: app.globalConfig.pre_api_url + 'public/getVipTypes?token=' + token,
      success: function(res){
        let status = res.data.status;
        let msg = res.data.msg;
        let datas = res.data.data;
        console.log("datas is:" + datas)
        if(status == 2){
          let vipTypes = datas.vipTypes;
          that.setData({
            vipTypes: vipTypes
          })
        }else{
          wx.showModal({
            title: '提示',
            content: msg + '点击确认重新获取数据...',
            success: function(res){
              if(res.confirm){
                wx.navigateTo({
                  url: '../recharge/recharge',
                })
              }else{
                wx.navigateTo({
                  url: '../index/index',
                })
              }
            }
          })
        }
      }
    })
  },

  seviceSelection: function(e){
    let that = this;
    let vipTypes = that.data.vipTypes;
    let totalFee;
    let vipType = e.target.id;
    if (vipType == 0){
      vipType = 0;
      totalFee = vipTypes[vipType].price;
      that.setData({
        one_month_img: "display:block",
        three_months_img: "display:none",
        one_year_img: "display:none",
      })
    } else if (vipType == 1){
        vipType = 1;
        totalFee = vipTypes[vipType].price;
        that.setData({
          one_month_img: "display:none",
          three_months_img: "display:block",
          one_year_img: "display:none",
        })
    }else{
        vipType = 2;
        totalFee = vipTypes[vipType].price;
        that.setData({
          one_month_img: "display:none",
          three_months_img: "display:none",
          one_year_img: "display:block",       
        })
    };
    //暂时搞不懂这里为啥不能用switch循环
    // switch (vipType){
    //   case 0:
    //     vipType = 0;
    //     totalFee = vipTypes[0].price;
    //     that.setData({
    //       one_month_img: "display:block",
    //       three_months_img: "display:none",
    //       one_year_img: "display:none",
    //     })
    //   case 1:
    //     vipType = 1;
    //     totalFee = vipTypes[1].price;
    //     that.setData({
    //       one_month_img: "display:none",
    //       three_months_img: "display:block",
    //       one_year_img: "display:none",
    //     })
    //     break;
    //   case 2:
    //     vipType = 2;
    //     totalFee = vipTypes[2].price;
    //     that.setData({
    //       one_month_img: "display:none",
    //       three_months_img: "display:none",
    //       one_year_img: "display:block",       
    //     })
    //     break;
    // }
    that.setData({
      totalFee: totalFee,
      vipType: vipType
    })
  },

  // 点击立即充值
  /*
  type:
  1：充值1个月vip 
  2：充值3个月vip 
  3：充值12个月vip
  */
  immediateRecharge:function(){
    let that = this;
    let url = app.globalConfig.pre_api_url + "public/getWxPayParams";
    let token = wx.getStorageSync("token");
    let good_id = that.data.vipType;
    // var total_fee = that.data.totalFee;
    let total_fee = 0.01;
    //total_fee = 0.01;//测试数据
    // var balance_spending = this.data.balanceSpending;
    wx.request({
      url: url,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        "token": token,
        "total_fee": total_fee,
        "good_id": good_id,
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
        // var timeStamp = res.data.wxPayParams.timeStamp;
        // console.log('调起支付 timeStamp:' + timeStamp);
        wx.requestPayment({
          'timeStamp': res.data.data.wxPayParams.timeStamp,
          'nonceStr': res.data.data.wxPayParams.nonceStr,
          'package': res.data.data.wxPayParams.package,
          'signType': 'MD5',
          'paySign': res.data.data.wxPayParams.paySign,
          'success': function (res) {
            console.log('success');
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 3000
            });

          },
          'fail': function (res) {

            app.errorHint('请求失败，请重新支付');
            return;
            console.log('fail');
          },
          'complete': function (res) {
            console.log('complete');
          }
        });
      },
      fail: function (res) {
        console.log(res.data)
      }
    });
  }
})