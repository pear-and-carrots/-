// home_page/direct/direct.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  input (e) {
    this.setData({
      content: e.detail.value
    })
  },

  reback (e) {
    wx.reLaunch({
      url: '../../pages/home_page/home_page',
    })
  },

  setImg () {
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res.tempFilePaths[0])
      }
    })
  },

  previewImage () {
    wx.previewImage({
      current:'' ,   // 获取当前点击的 图片 url
      urls:[]		//查看图片的数组
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})