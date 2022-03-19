import {
  support, //我的粉丝列表
  getUserOrdr, //排行榜列表
  follow, //我的关注列表
} from '../../core/api.js'
const baseUrl = getApp().globalData.baseUrl

const userId = wx.getStorageSync('userId')
Page({
  data: {
    userListId: -1,
    list: []
  },

  onLoad: function (options) {
    console.log(options);
    const userListId = parseInt(options.userListId)
    this.setData({
      userListId: userListId
    })
    if (userListId === 1) {
      this.support() // 我的粉丝列表
    } else if (userListId === 2) { //总排行榜
      this.getUserOrdr() //
    } else if (userListId === 3) {
      this.follow() //我的关注
    }
  },

    // 点击头像跳转用户详情页
    goToPersonal(e) {
      wx.navigateTo({
        url: '../../home_page/Personal/Personal?userId=' + e.currentTarget.dataset.userid,
      })
    },

  // 我的粉丝列表
  support() {
    const that = this
    wx.request({
      url: `${baseUrl}/user/support/` + wx.getStorageSync('userId'),
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('我的粉丝列表,按时间顺序', res);
        that.setData({
          list: res.data.data
        })
      }
    })
    // support({
    //   userId: userId
    // }).then(res => {
    //   console.log('我的粉丝列表', res);
    //   this.setData({
    //     list: res
    //   })
    // }).catch(error => {
    //   console.log('error', error);
    // })
  },

  // 我的关注
  follow() {
    const that = this
    wx.request({
      url: `${baseUrl}/follow/people/` + wx.getStorageSync('userId'),
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('我的粉丝列表,按时间顺序', res);
        that.setData({
          list: res.data.data
        })
      }
    })
    // follow({
    //   userId: userId
    // }).then(res => {
    //   console.log('我的关注', res);
    //   this.setData({
    //     list: res
    //   })
    // }).catch(error => {
    //   console.log('error', error);
    // })
  },

//总排行榜
  getUserOrdr() 
  {
    getUserOrdr({}).then(res => {
      console.log('总排行榜', res);
      this.setData({
        list: res
      })
    }).catch(error => {
      console.log('error', error);
    })
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})