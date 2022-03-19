import {
  Userarticle, //我的发布
  userCollection, //我的收藏
  selectArticleBykey, //搜索
  supportArticle, //用户点赞
  collectionArticle,
  deleteArticle, //删除文章
} from '../../core/api.js'
const userId = wx.getStorageSync('userId')
const baseUrl = getApp().globalData.baseUrl

Page({

  data: {
    userListId: -1,
    list: [],
    userLits: [],
    page: 1,
    showLine: false,
    userId: wx.getStorageSync('userId')
  },

  onLoad: function (options) {
    console.log(options);
    const articleId = parseInt(options.articleId)
    this.setData({
      userListId: articleId,
      key: options.key
    })
    if (articleId === 1) {
      this.Userarticle() //我的发布
    } else if (articleId === 2) {
      this.userCollection() //我的收藏
    } else if (articleId === 3) {
      this.selectArticleBykey() //搜索
    } else if (articleId === 4) {
      this.setData({ //我的足迹
        list: wx.getStorageSync('history').reverse()
      })
    }
  },

  //我的发布
  Userarticle() {
    const that = this
    wx.request({
      url: `${baseUrl}/user/article/` + wx.getStorageSync('userId'),
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('我的发布', res.data.data);
        that.setData({
          list: res.data.data
        })
      }
    })
  },

  //我的收藏
  userCollection() {
    const that = this
    wx.request({
      url: `${baseUrl}/user/collection/` + wx.getStorageSync('userId'),
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          list: res.data.data
        })
      }
    })
  },

  // 搜索
  selectArticleBykey() {
    const list = this.data.list
    const userLits = this.data.userLits
    selectArticleBykey({
      key: this.data.key,
      userId: wx.getStorageSync('userId'),
      page: this.data.page,
      pageSize: 10
    }).then(res => {
      let showLine = false
      console.log('搜索结果', res.rows);
      res.rows.forEach(item => {
        list.push(item)
        if (item.articleId !== null) {
          showLine = true
        }
        if (item.articleId === null) {
          userLits.push(item)
        }
      })
      this.setData({
        list: list,
        userLits: userLits,
        showLine: showLine
      })
    }).catch(error => {
      console.log('error', error)
    })
  },

  // 绑定菜单
  bindMenu(e) {
    this.setData({
      authorUserId: e.currentTarget.dataset.userid,
      authorTitle: e.currentTarget.dataset.authortitle,
      author: e.currentTarget.dataset.author,
      showModalStatus: true
    })
  },

  // 用户点赞
  userLove(e) {
    const articleCommentId = e.currentTarget.dataset.articlecommentid
    const supportId = wx.getStorageSync('userId')
    const userId = e.currentTarget.dataset.userid
    const list = this.data.list
    supportArticle({
      articleCommentId,
      supportId,
      userId
    }).then(res => {
      console.log('用户点赞', res)
      list.forEach(item => {
        if (item.articleId === articleCommentId) {
          item.isSupport = !item.isSupport
        }
        if (res === '点赞成功') {
          item.supports = item.supports + 1
        } else if (res === '取消点赞成功！') {
          item.supports = item.supports - 1
        }
      })
      this.setData({
        list: list
      })
    }).catch(error => {
      console.log('error', error)
    })
  },

  // 用户收藏文章
  collectionArticle(e) {
    const articleId = e.currentTarget.dataset.articleid
    const articleCommentId = e.currentTarget.dataset.articlecommentid
    const userId = e.currentTarget.dataset.userid
    const list = this.data.list
    console.log(articleId);
    console.log(userId);
    collectionArticle({
      articleId,
      userId
    }).then(res => {
      console.log('用户收藏', res)
      list.forEach(item => {
        if (item.articleId === articleCommentId) {
          item.isCollection = !item.isCollection
        }
        if (res === '收藏成功') {
          item.collections = item.collections + 1
        } else if (res === '取消收藏成功') {
          item.collections = item.collections - 1
        }
      })
      this.setData({
        list: list
      })
    }).catch(error => {
      console.log('error', error)
    })
  },

  // 点击头像跳转用户详情页
  goToPersonal(e) {
    console.log(e);
    wx.navigateTo({
      url: '../../home_page/Personal/Personal?userId=' + e.currentTarget.dataset.userid,
    })
  },

  gotoDetail(e) {
    const articleId = e.currentTarget.dataset.articleid
    const artticlesign = e.currentTarget.dataset.artticlesign
    if (e.currentTarget.dataset.artticlesign === '视频') {
      wx.navigateTo({
        url: '../../recommend/videoDetail/videoDetail?id=' + articleId,
      })
    } else {
      wx.navigateTo({
        url: '../../home_page/article/article?articleId=' + articleId + '&userId=' + wx.getStorageSync('userId') + '&artticleSign=' + artticlesign,
      })
    }
    // url="{{item.artticleSign === '视频'?'../../recommend/videoDetail/videoDetail?id={{item.articleId}}':'../../pages/article/article?articleId=item.articleId&userId=userId'}}"
  },

  deleteArticle(e) {
    const that = this
    console.log(e.currentTarget.dataset.articleid)
    console.log(wx.getStorageSync('userId'))
    if (that.data.userListId === 1) {
      wx.showModal({
        title: '温馨提示',
        content: '是否删除该文章',
        success(res) {
          if (res.confirm) {
            deleteArticle({
              ArticleId: e.currentTarget.dataset.articleid,
              UserId: wx.getStorageSync('userId'),
            }).then(res => {
              console.log(res);
              wx.showToast({
                title: '删除成功！',
              })
              that.Userarticle() //我的发布
            }).catch(error => {
              console.log(error);
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  onReachBottom: function () {
    const page = this.data.page
    this.setData({
      page: page + 1
    })
    this.selectArticleBykey()
  },

  onShareAppMessage: function () {

  }
})