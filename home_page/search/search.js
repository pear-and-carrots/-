import {
  getArticleForHotKey, //热搜
  selectArticleBykey, //搜索框
  getHistoryKey, //历史记录
  deleteHistory, //清除历史记录
  insertHistory //增加历史记录
} from '../../core/api.js'
const baseUrl = getApp().globalData.baseUrl

Page({
  data: {
    historyList: [{
      id: 0,
      name: "UI"
    }, {
      id: 1,
      name: "网页设计"
    }, {
      id: 2,
      name: "工业设计"
    }, {
      id: 3,
      name: "动漫设计"
    }, {
      id: 4,
      name: "海报设计"
    }, {
      id: 5,
      name: "插画设计"
    }, ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArticleForHotKey() //热搜
    this.getHistoryKey() //历史记录
  },

  onShow() {
    this.getHistoryKey()
  },

  // 热搜
  getArticleForHotKey(e) {
    getArticleForHotKey({}).then(res => {
      console.log('热搜', res)
      this.setData({
        hotList: res
      })
    }).catch(error => {
      console.log(error)
    })
  },

  searchText(e) {
    this.setData({
      searchText: e.detail
    })
  },

  // 搜索框
  search(e) {
    // if (e.detail === true || isSearch === true) {
    wx.navigateTo({
      url: '../../about/articleList/articleList?articleId=3' + '&key=' + this.data.searchText,
    })
    // }
  },

  // 搜索历史记录
  getHistoryKey(e) {
    const that = this
    wx.request({
      url: `${baseUrl}/history/getHistoryKey/` + wx.getStorageSync('userId'),
      data: {
        userId: wx.getStorageSync('userId')
      },
      success(res) {
        console.log('搜索历史记录', res)
        that.setData({
          historyList: res.data.data
        })
      }
    })
    // getHistoryKey({
    //   userId: wx.getStorageSync('userId')
    // }).then(res => {
    //   console.log('搜索历史记录', res)
    //   this.setData({
    //     historyList: res
    //   })
    // }).catch(error => {
    //   console.log(error)
    // })
  },

  // 清除历史记录 
  deleteHistory() {
    const that = this
    wx.request({
      url: `${baseUrl}/history/deleteHistory/` + wx.getStorageSync('userId'),
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'DELETE',
      success(res) {
        console.log('清除历史记录', res)
        that.getHistoryKey()
      }
    })
    // deleteHistory({
    //   userId: wx.getStorageSync('userId')
    // }).then(res => {
    //   console.log('清除历史记录', res)
    //   this.getHistoryKey()
    // }).catch(error => {
    //   console.log(error)
    // })
  },

  // 增加历史记录
  insertHistory() {
    let history = {
      keyword: this.data.searchText,
      userId: wx.getStorageSync('userId')
    }
    insertHistory({
      keyword: this.data.searchText,
      userId: wx.getStorageSync('userId')
    }).then(res => {
      console.log('增加历史记录', res)
      this.getHistoryKey()
    }).catch(error => {
      console.log(error)
    })
  },

  bindhistoryList(e) {
    console.log(e);
    this.setData({
      searchText: e.currentTarget.dataset.name,
      isSearch: true
    })
    this.search()
  },

  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})