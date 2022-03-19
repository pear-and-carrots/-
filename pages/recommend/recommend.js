import {
  selfLike, //猜你喜欢
  likeSign, //根据标签推送文章
  getVideoList, //获取视频列表
  getHome, //获取话题圈列表
  mnotice,
  getAllSign,
  followArticle,
  supportArticle, //用户点赞
  collectionArticle,
  getNewArticles,
  getHotArticles,
  getArticleAndAuthorFromBySignByHot, //通过标签名查询文章（热门：根据点赞数）
} from '../../core/api.js'
const baseUrl = getApp().globalData.baseUrl
const TOP_DISTANCE = 1000;
Page({
  data: {
    navId: 0,
    navList: [{
      id: 0,
      name: '视频'
    }, {
      id: 1,
      name: '话题'
    }, {
      id: 2,
      name: '推荐'
    }],
    cpage: 1,
    Vpage: 1,
    guessList: [],
    videoList: [], //视频区列表
    topicList: [], //话题圈列表
    list: [], //推荐列表
    showBackTop: false,
    userId: wx.getStorageSync('userId'),
    none: false,
    showModalStatus: false,
    bigNum: 3,
    smallNum: 0,
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      userId: wx.getStorageSync('userId')
    })
    this.videoList(1)
    this.getHome(1)
    this.selfLike(1) //猜你喜欢
    this.likeSign(1) //根据标签推送文章
  },

  onShow() {
    const upscData = wx.getStorageSync('upscData')
    const list = this.data.list
    list.forEach(item => {
      if (item.articleId === upscData.articleId) {
        item.isSupport = upscData.isSupport
        item.isCollection = upscData.isCollection
        item.supports = upscData.supports
        item.collections = upscData.collections
      }
    })
    this.setData({
      list: list
    })
  },

  // 顶部导航
  topNav(e) {
    this.setData({
      navId: e.currentTarget.dataset.id
    })
    // if (e.currentTarget.dataset.id === 0) {

    // } else if (e.currentTarget.dataset.id === 1) {
    //   this.getHome(1)
    // } else if (e.currentTarget.dataset.id === 2) {
    //   this.selfLike(1) //猜你喜欢
    //   this.likeSign(1) //根据标签推送文章
    // }
    if (e.currentTarget.dataset.id === 2 && this.data.list.length === 0) {
      wx.showLoading({
        title: '加载中',
      })
    }
  },

  // 获取视频区的列表
  videoList(data) {
    getVideoList({
      PageNum: data,
      PageSize: 10,
      UserId: wx.getStorageSync('userId')
    }).then(res => {
      console.log('获取视频列表', res);
      if (res === null) {
        wx.showToast({
          title: '暂无更多内容',
          icon: 'none'
        })
      } else {
        const list = this.data.videoList
        let arr = res.rows
        arr.forEach(item => {
          list.push(item)
        })
        this.setData({
          videoList: list
        })
      }
    }).catch(error => {
      console.log(error);
    })
  },

  // 获取话题列表
  getHome(data) {
    getHome({
      PageNum: data,
      PageSize: 10
    }).then(res => {
      console.log('获取话题列表', res);
      if (res === null) {
        wx.showToast({
          title: '暂无更多内容',
          icon: 'none'
        })
      } else {
        const list = this.data.topicList
        let arr = res
        arr.forEach(item => {
          list.push(item)
        })
        this.setData({
          topicList: list
        })
      }
    }).catch(error => {
      console.log(error);
    })
  },

  // 猜你喜欢更新
  update(e) {
    if (this.data.bigNum < 9) {
      this.setData({
        bigNum: this.data.bigNum + 3,
        smallNum: this.data.smallNum + 3
      })
    } else {
      this.setData({
        bigNum: 3,
        smallNum: 0
      })
    }
  },

  // 猜你喜欢
  selfLike(data) {
    selfLike({
      page: data,
      pageSize: 10,
      userId: wx.getStorageSync('userId')
    }).then(res => {
      console.log('猜你喜欢', res);
      this.setData({
        guessList: res.rows
      })
    }).catch(error => {

    })
  },

  // 根据标签推送文章
  likeSign(data) {
    likeSign({
      page: data,
      pageSize: 10,
      userId: wx.getStorageSync('userId')
    }).then(res => {
      console.log(res);
      const list = this.data.list
      let arr = res.rows
      arr.forEach(item => {
        list.push(item)
      })
      this.setData({
        list
      })
      wx.hideLoading()
    }).catch(error => {
      console.log('error', error);
      this.setData({
        none: true
      })
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
    supportArticle({
      articleCommentId,
      supportId,
      userId
    }).then(res => {
      console.log('用户点赞', res)
      let list = []
      if (this.data.navId === 0) {
        list = this.data.videoList
      } else if (this.data.navId === 1) {

      } else if (this.data.navId === 2) {
        list = this.data.list
      }
      list.forEach(item => {
        if (item.articleId === articleCommentId) {
          item.isSupport = !item.isSupport
          if (res === '点赞成功') {
            item.supports = item.supports + 1
          } else if (res === '取消点赞成功！') {
            item.supports = item.supports - 1
          }
        }
      })
      if (this.data.navId === 0) {
        this.setData({
          videoList: list
        })
      } else if (this.data.navId === 1) {

      } else if (this.data.navId === 2) {
        this.setData({
          list: list
        })
      }
    }).catch(error => {
      console.log('error', error)
    })
  },

  // 用户收藏文章
  collectionArticle(e) {
    const articleId = e.currentTarget.dataset.articleid
    console.log(articleId);
    collectionArticle({
      articleId,
      userId: wx.getStorageSync('userId'),
    }).then(res => {
      console.log('用户收藏', res)
      let list = []
      if (this.data.navId === 0) {
        list = this.data.videoList
      } else if (this.data.navId === 1) {

      } else if (this.data.navId === 2) {
        list = this.data.list
      }
      list.forEach(item => {
        if (item.articleId === articleId) {
          item.isCollection = !item.isCollection
          if (res === '收藏成功') {
            item.collections = item.collections + 1
          } else if (res === '取消收藏成功') {
            item.collections = item.collections - 1
          }
        }
      })
      if (this.data.navId === 0) {
        this.setData({
          videoList: list
        })
      } else if (this.data.navId === 1) {

      } else if (this.data.navId === 2) {
        this.setData({
          list: list
        })
      }
      // list.forEach(item => {
      //   if (item.articleId === articleId) {
      //     item.isCollection = !item.isCollection
      //     if (res === '收藏成功') {
      //       item.collections = item.collections + 1
      //     } else if (res === '取消收藏成功') {
      //       item.collections = item.collections - 1
      //     }
      //   }
      // })
      // this.setData({
      //   list: list
      // })
    }).catch(error => {
      console.log('error', error)
    })
  },

  // 点击头像跳转用户详情页
  goToPersonal(e) {
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: '../../home_page/Personal/Personal?userId=' + e.currentTarget.dataset.userid,
    })
  },

  //点击跳转视频详情页
  gotoVideoDetail(e) {
    console.log(e.currentTarget.dataset.id);
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../recommend/videoDetail/videoDetail?id=' + id,
    })
  },

  // 点击跳转话题详情页
  gotoTopic(e) {
    console.log(e.currentTarget.dataset.item);
    const data = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '../../recommend/topic/topic?data=' + data,
    })
  },

  // 关注
  followPeople(e) {
    const that = this
    const userId = e.currentTarget.dataset.userid
    wx.request({
      url: `${baseUrl}/follow/followPeople`, //仅为示例，并非真实的接口地址
      data: {
        followId: userId,
        userId: wx.getStorageSync('userId')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        let list = that.data.videoList
        list.forEach(item => {
          if (item.userId === userId) {
            item.isFollow = !item.isFollow
          }
        })
        that.setData({
          videoList: list
        })
      }
    })
  },

  onPullDownRefresh: function () {

  },

  // 触底分页加载
  onReachBottom: function () {
    if (this.data.navId === 0) {
      let Vpage = this.data.Vpage + 1
      this.videoList(Vpage)
      this.setData({
        Vpage: Vpage
      })
    } else if (this.data.navId === 1) {

    } else if (this.data.navId === 2) {
      let cpage = this.data.cpage + 1
      this.likeSign(cpage)
      this.setData({
        cpage: cpage
      })
    }
  },

  //一键回到顶部
  onPageScroll(options) {
    const scrollTop = options.scrollTop;
    this.setData({
      showBackTop: scrollTop >= TOP_DISTANCE
    })
  },

  // 用户点击右上角分享
  onShareAppMessage: function (options) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "盒部出图", // 默认是小程序的名称(可以写slogan等)
      path: '', // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: res => {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {}
      },
      fail: err => {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: e => {
        // 转发结束之后的回调（转发成不成功都会执行）
      }
    };
    // 来自页面内的按钮的转发
    if (options.from == 'button') {
      var eData = options.target.dataset;
      console.log(eData.name); // shareBtn
      // 此处可以修改 shareObj 中的内容
      shareObj.path = '/pages/btnname/btnname?btn_name=' + eData.name;
    }
    // 返回shareObj
    return shareObj;
  }
})