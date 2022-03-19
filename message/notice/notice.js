import {
  selectBycoded, //获取公告列表
} from '../../core/api.js'
const userId = wx.getStorageSync('userId')
const baseUrl = getApp().globalData.baseUrl
Page({

  data: {
    noticeId: 1
  },

  onLoad: function (options) {
    let noticeId = parseInt(options.noticeId)
    this.setData({
      noticeId: noticeId
    })
    if (noticeId === 1) {
      this.selectBycoded(0)
    } else if (noticeId === 2) {
      this.selectBycoded(1)
    }
  },

  // 获取公告列表
  // 获取公告列表
  selectBycoded(data) {
    const that = this
    // wx.setStorageSync('code', 0)
    // selectBycoded({}).then(res => {
    //   console.log('获取列表', res);
    // }).catch(error => {
    //   console.log('error', error);
    // })
    wx.request({
      url: `${baseUrl}/notice/selectBycoded/` + data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          selectBycodedList: res.data.data
        })
        console.log('kbjsd', res.data.data)
      }
    })
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})