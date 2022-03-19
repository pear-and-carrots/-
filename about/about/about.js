Page({
  data: {
    arr: [{
      id: 'object_one'
    }, {
      id: 'object_two'
    }, {
      id: 'object_three'
    }, {
      id: 'object_four'
    }, {
      id: 'object_five'
    }, {
      id: 'object_six'
    }, {
      id: 'object_seven'
    }, {
      id: 'object_eight'
    }, ]
  },

  onLoad: function (options) {

  },

  onPullDownRefresh: function () {
    this.setData({
      loadingHidden: false
    });
    var that = this;
    // wx.request({
    //   url: 'https://www.geekxz.com/action/works/recWorks',
    //   data: {
    //     num: '5',
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     console.log(res.data.data.works);
    //     that.setData({
    //       recWorks: res.data.data.works,
    //     })
    //   },
    //   complete: function () { // complete
    //     wx.hideNavigationBarLoading() //完成停止加载
    //     wx.stopPullDownRefresh() //停止下拉刷新
    //   }
    // })
    setTimeout(function () {
      that.setData({
        loadingHidden: true
      });
    }, 2000);
  },

  onShareAppMessage: function () {

  }
})