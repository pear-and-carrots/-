import {
  mnotice,
  getAllSign,
  followArticle,
  supportArticle, //用户点赞
  collectionArticle,
  getNewArticles,
  getHotArticles,
  getArticleAndAuthorFromBySignByHot, //通过标签名查询文章（热门：根据点赞数）
  getUserLikeSign, //查询用户喜欢标签
  updateLikeSign //修改用户标签
} from '../../core/api.js'
const baseUrl = getApp().globalData.baseUrl
const userId = wx.getStorageSync('userId')
const TOP_DISTANCE = 1000;
Page({
  data: {
    notice: [{
      id: 0,
      text: "国家公祭日不能发布任何社区信息！注意注意注意注意"
    }, {
      id: 1,
      text: "设计图设计图设计图设计图设计图设计图设计图设计图设计图"
    }, {
      id: 2,
      text: "绿色上网绿色上网绿色上网绿色上网绿色上网绿色上网绿色上网绿色上网绿色上网"
    }],
    swiperList: [{
      id: 0,
      signName: "关注",
      isShow: true,
      signId: -1
    }, {
      id: 1,
      signName: "热门",
      isShow: true,
      signId: -1
    }, {
      id: 2,
      signName: "最新",
      isShow: true,
      signId: -1
    }],
    swiperIndex: 0,
    currentId: 0,
    list: [],
    showBackTop: false,
    userId: wx.getStorageSync('userId'),
    none: false,
    signShow: false,
    showModalStatus: false,
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: wx.getStorageSync('userId')
    })
    this.check()
  },

  check() {
    const that = this
    wx.request({
      url: `${baseUrl}/user/` + wx.getStorageSync('userId'),
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          console.log(res.data.data)
          if (res.data.data.gender === null || res.data.data.gender.length === 0) {
            wx.reLaunch({
              url: '/home_page/index/index',
            })
          } else {
            that.mnotice() //获取公告
            that.getAllSign() //获取所有标签
            that.followArticle(1) //获取关注文章
          }
        }
      }
    })
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
    // const swiperList = this.data.swiperList
    // if (swiperList === 0) {
    //   this.followArticle(this.data.page)
    // } else if (swiperList === 1) {
    //   this.getHotArticles(this.data.page)
    // } else if (swiperList === 2) {
    //   this.getNewArticles(this.data.page)
    // } else {
    //   this.signArticles(wx.getStorageSync('signId'))
    // }
  },

  swiperItem(e) {
    console.log(e.currentTarget.dataset);
    this.setData({
      currentId: e.currentTarget.dataset.id
    })
    wx.setStorageSync('signIdd', e.currentTarget.dataset.signid)
  },

  // 获取关注文章
  followArticle(data) {
    console.log(data, typeof(data))
    followArticle({
      page: data,
      pageSize: 10,
      userId: wx.getStorageSync('userId')
    }).then(res => {
      wx.hideLoading()
      console.log('获取关注文章', res)
      const list = this.data.list
      let arr = res.rows
      arr.forEach(item => {
        list.push(item)
      })
      this.setData({
        list
      })
    }).catch(error => {
      console.log(error)
      this.getHotArticles(1)
      this.setData({
        none: true,
        noneUser: true
      })
    })
  },

  // 获取热门文章
  getHotArticles(data) {
    getHotArticles({
      page: data,
      pageSize: 10,
      userId: wx.getStorageSync('userId')
    }).then(res => {
      console.log('获取热门文章', res)
      const list = this.data.list
      let arr = res.rows
      arr.forEach(item => {
        list.push(item)
      })
      this.setData({
        list: list
      })
    }).catch(error => {
      console.log("error", error)
      this.setData({
        none: true
      })
    })
  },

  // 获取最新文章
  getNewArticles(data) {
    getNewArticles({
      page: data,
      pageSize: 10,
      userId: wx.getStorageSync('userId')
    }).then(res => {
      console.log('获取最新文章', res)
      const list = this.data.list
      let arr = res.rows
      arr.forEach(item => {
        list.push(item)
      })
      this.setData({
        list
      })
    }).catch(error => {
      console.log("error", error)
      this.setData({
        none: true
      })
    })
  },

  //通过标签名查询文章（热门：根据点赞数）
  signArticles(data) {
    getArticleAndAuthorFromBySignByHot({
      userId: wx.getStorageSync('userId')
    }).then(res => {
      console.log('通过标签名查询文章（热门：根据点赞数）', res)
      const list = this.data.list
      let arr = res
      arr.forEach(item => {
        list.push(item)
      })
      this.setData({
        list: list
      })
    }).catch(error => {
      console.log("error", error)
      this.setData({
        none: true
      })
    })
  },

  // 获取公告
  mnotice() {
    mnotice({}).then(res => {
      console.log('获取公告栏信息', res)
      this.setData({
        notice: res
      })
    }).catch(error => {
      console.log("error", error)
    })
  },

  // 获取所有标签
  getAllSign(e) {
    const swiperList = this.data.swiperList
    getAllSign({}).then(res => {
      console.log('获取所有标签', res)
      res.forEach((item, index) => {
        item['isShow'] = false
        item['id'] = index + 3
        swiperList.push(item)
      })
      console.log(swiperList);
      this.setData({
        swiperList: swiperList
      })
      this.getUserLikeSign(swiperList) //查询用户喜欢标签
    }).catch(error => {
      console.log(error)
    })
  },

  // 查询用户喜爱的标签
  getUserLikeSign(swiperList) {
    let idd = 0
    getUserLikeSign({
      userId: wx.getStorageSync('userId')
    }).then(res => {
      console.log('查询用户喜爱的标签', res);
      swiperList.forEach(item => {
        res.forEach(res => {
          if (item.signId == res.signId) {
            console.log(item);
            item['isShow'] = true
          }
        })
      })
      swiperList.forEach(item=>{
        if (item.isShow == true) {
          item.idd = idd
          idd = idd + 1
        }
      })
      this.setData({
        swiperList: swiperList
      })
      console.log('swiperList..............:', swiperList);
    }).catch(error => {

    })
  },

  // 修改用户喜爱的标签
  updateLikeSign(e) {
    updateLikeSign({
      "likeSign": [
        "string"
      ],
      userId: wx.getStorageSync('userId')
    }).then(res => {
      console.log('修改用户喜爱的标签', res);
    }).catch(error => {

    })
  },

  // 绑定导航
  bindSwiper(e) {
    const swiperList = this.data.swiperList
    if (e.detail.current === this.data.swiperIndex) {} else {
      this.setData({
        swiperIndex: e.detail.current,
        list: [],
        page: 1
      })
      if (e.detail.current === 0) {
        this.followArticle(this.data.page)
      } else if (e.detail.current === 1) {
        this.getHotArticles(this.data.page)
      } else if (e.detail.current === 2) {
        this.getNewArticles(this.data.page)
      } else {
        var signId = 0
        swiperList.forEach(item => {
          if (item.id == e.detail.current) {
            signId = item.signId
          }
        })
        wx.setStorageSync('signId', signId)
        this.signArticles(signId)
      }
    }
  },

  // 标签
  viewCases() {
    const that = this
    this.setData({
      signShow: !this.data.signShow,
    })
    if (this.data.signShow === false) {
      const sign = that.data.sign
      sign.splice(0, 3);
      updateLikeSign({
        "likeSign": sign,
        userId: wx.getStorageSync('userId')
      }).then(res => {
        console.log('修改用户喜爱的标签', res);
      }).catch(error => {
        console.log(error)
      })
    }
  },

  actionActive(e) {
    let swiperList = this.data.swiperList
    let idd = 0
    let arr = [...swiperList];
    arr.forEach((item, index) => {
      if (e.target.dataset.id == item.id) {
        item.isShow = !item.isShow;
      }
      if (item.isShow == true) {
        item.idd = idd
        idd = idd + 1
      }
    })
    console.log(arr);
    this.setData({
      swiperList,
    })
    this.swiperList()
  },

  swiperList(e) {
    let swiperList = this.data.swiperList
    let sign = []
    swiperList.forEach((item, index) => {
      if (item.isShow == true) {
        sign.push(item.signId)
      }
    })
    console.log(sign)
    this.setData({
      sign: sign
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

  // 点击头像跳转用户详情页
  goToPersonal(e) {
    wx.navigateTo({
      url: '../../home_page/Personal/Personal?userId=' + e.currentTarget.dataset.userid,
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
          if (res === '点赞成功') {
            item.supports = item.supports + 1
          } else if (res === '取消点赞成功！') {
            item.supports = item.supports - 1
          }
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
    const list = this.data.list
    console.log(articleId);
    collectionArticle({
      articleId,
      userId: wx.getStorageSync('userId'),
    }).then(res => {
      console.log('用户收藏', res)
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
      this.setData({
        list: list
      })
    }).catch(error => {
      console.log('error', error)
    })
  },

  //一键回到顶部
  onPageScroll(options) {
    const scrollTop = options.scrollTop;
    this.setData({
      showBackTop: scrollTop >= TOP_DISTANCE
    })
  },

  //  页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {

  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    let page = this.data.page + 1
    console.log(this.data.page);
    if (this.data.currentId === 0) { //关注
      this.followArticle(page)
    } else if (this.data.currentId === 1) { //热门
      this.getHotArticles(page)
    } else if (this.data.currentId === 2) { //最新
      this.getNewArticles(page)
    } else { //标签
      this.signArticles(page)
    }
    this.setData({
      page: page
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