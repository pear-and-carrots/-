import {
  peopleComment, //获取公告列表
  peopleSupport, //消息推送官方的相关公告
  publishSecondComment, //发布二级评论
} from '../../core/api.js'
const userId = wx.getStorageSync('userId')
const baseUrl = getApp().globalData.baseUrl

Page({
  data: {
    notice: 0,
    list: [],
    showInput: false
  },

  onLoad: function (options) {
    let noticeId = parseInt(options.collectNum)
    this.setData({
      notice: noticeId
    })
    if (noticeId === 1) {
      this.peopleSupport()
    } else if (noticeId === 2) {
      this.peopleComment()
    }
  },

  gotoDec(e) {
    wx.navigateTo({
      url: '../../pages/article/article?articleId=' + e.currentTarget.dataset.textid + '&userId=' + wx.getStorageSync('userId'),
    })
  },

  replay(e) {
    setTimeout(res => {
      const datas = JSON.stringify({
        fistid: e.currentTarget.dataset.id
      })
      wx.navigateTo({
        url: '../../home_page/comment/comment?datas=' + datas,
      })
    }, 300)
  },

  peopleComment() {
    const that = this
    wx.request({
      url: `${baseUrl}/user/peopleComment/` + wx.getStorageSync('userId'),
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('从消息中看别人对我的评论,按时间顺序', res);
        that.setData({
          list: res.data.data
        })
      }
    })
    // peopleComment({
    //   userId: userId
    // }).then(res => {
    //   console.log('从消息中看别人对我的评论,按时间顺序', res);
    //   this.setData({
    //     list: res
    //   })
    // }).catch(error => {
    //   console.log('error', error);
    // })
  },


  peopleSupport() {
    const that = this
    wx.request({
      url: `${baseUrl}/user/peopleSupport/` + wx.getStorageSync('userId'),
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('从消息中看别人对我的点赞,按时间顺序', res);
        that.setData({
          list: res.data.data
        })
      }
    })
    // peopleSupport({
    //   userId: userId
    // }).then(res => {
    //   console.log('从消息中看别人对我的点赞,按时间顺序。', res);
    //   this.setData({
    //     list: res
    //   })
    // }).catch(error => {
    //   console.log('error', error);
    // })
  },

  input(e) {
    this.setData({
      commentText: e.detail.value
    })
  },

  // 发布二级评论
  publishSecondComment(e) {
    if (this.data.commentText.length === 0) {
      wx.showToast({
        title: '内容不能为空！',
        icon: 'none'
      })
    } else {
      const author = this.data.author
      console.log(author.userid);
      publishSecondComment({
        bigCommentId: author.fistid, //一级评论的评论ID
        comment: this.data.commentText, //内容
        commentId: wx.getStorageSync('userId'), //评论者
        commentedId: author.userid, //被评论者ID
        firstId: author.fistid //末级评论内容的ID
      }).then(res => {
        console.log('发布二级评论', res)
        this.FgetComment()
      }).catch(error => {
        console.log(error)
      })
    }
  },

  onUnload() {
    console.log('??????????');
    wx.request({
      url: `${baseUrl}/user/tempSupport/` + wx.getStorageSync('userId'),
      header: {
        'content-type': 'application/json' // 默认值
      }
    })
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})