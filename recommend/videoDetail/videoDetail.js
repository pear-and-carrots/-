function getRandomColor() {
  const rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length === 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}
import {
  getArticleDesc3, //获取文章详情
  getCommentList, //获取文章评论（详情页）
  followPeople, //用户界面的关注功能，关注那个按钮点击时调用的接口
  publishComment, //发布一级评论
  collectionArticle, //文章的收藏
  supportArticle, //文章的点赞
  supportComment, //评论的点赞
  getCreeping, //查看文章弹幕
  insertcreeping, //发送弹幕
} from '../../core/api.js'
const baseUrl = getApp().globalData.baseUrl

Page({
  inputValue: '',
  data: {
    src: '',
    danmuList: [{
      text: '第 1s 出现的弹幕',
      color: '#ff0000',
      time: 1
    }, {
      text: '第 3s 出现的弹幕',
      color: '#ff00ff',
      time: 3
    }],
    list: {
      'user': '网易小云',
      'time': '刚刚',
      'title': '2021网易游戏中秋礼盒 | 风来韵转，福铃响至',
      'dec': '<p>-</p><p>HELLO，朋友们好久不见！时隔一年，我终于又发东西了（感动ing</p><p>今年过得好快，一晃眼都要国庆了！卡点祝大家国庆快乐~</p><p>今年换了新公司，在组里向小伙伴们学到了好多！感谢大佬们带我飞555（我又有奋斗的动力了！</p><p>要说的东西基本也都在图里啦~</p><p>-</p><p>监制指导Supervise Director：李德耀</p><p>项目统筹Project Coordinator：仁博</p><p>创意设计Creative Design：天才饽饽@天才饽饽</p><p>视觉设计Graphic Design：kyrja</p><p>插画设计Illustration：杨宸@myux</p><p>3D渲染3D rendering：康康/杨宸</p><p>动效设计Animation Design：易俊伶@Ejunjun</p>'
    },
    focus: true,
    contentList: [],
    showInput: false,
    comment: ''
  },

  onLoad: function (options) {
    console.log('?????????????', options);
    this.setData({
      articleId: options.id,
      userId: wx.getStorageSync('userId')
    })
    this.getCreeping(options.id)
    this.getArticleDesc() // 获取文章详情
    this.getCommentList() // 获取文章评论（详情页）
  },

  getCreeping(data) {
    getCreeping({
      ArticleId: data
    }).then(res => {
      console.log('查看文章弹幕', res);
      const danmuList = []
      res.forEach(item => {
        let data = {
          text: item.contex,
          color: item.color,
          time: item.time
        }
        danmuList.push(data)
      })
      this.setData({
        danmuList: danmuList
      })
    }).catch(error => {
      console.log(error);
    })
  },

  onShareAppMessage() {
    return {
      title: 'video',
      path: 'page/component/pages/video/video'
    }
  },

  onReady() {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  bindInputBlur(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  bindButtonTap() {
    const that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success(res) {
        that.setData({
          src: res.tempFilePath
        })
      }
    })
  },

  bindVideoEnterPictureInPicture() {
    console.log('进入小窗模式')
  },

  bindVideoLeavePictureInPicture() {
    console.log('退出小窗模式')
  },

  // 截取弹幕发送时间
  bindtimeupdate(e) {
    const time = (e.detail.currentTime).toFixed()
    this.setData({
      time: time
    })
  },

  // 发送弹幕
  bindSendDanmu(e) {
    // wx.request({
    //   url: 'http://121.37.246.0:8099/creeping/insertcreeping', //仅为示例，并非真实的接口地址
    //   data: {
    //     articleId: this.data.articleId,
    //     color: getRandomColor(),
    //     contex: this.data.inputValue,
    //     time: this.data.time
    //   },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     console.log(res.data)
    //   }
    // })
    insertcreeping({
      articleId: this.data.articleId,
      color: getRandomColor(),
      contex: this.data.inputValue,
      time: this.data.time
    }).then(res => {
      console.log(res);
      if (res === true) {
        this.setData({
          inputValue: ''
        })
      }
    }).catch(error => {
      console.log(error);
    })
    this.videoContext.sendDanmu({
      text: this.data.inputValue,
      color: getRandomColor()
    })
  },

  videoErrorCallback(e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  },

  onShow() {
    this.getArticleDesc() // 获取文章详情
    this.getCommentList() // 获取文章评论（详情页）
  },

  onUnload: function () {
    const list = this.data.list
    const obj = {
      articleId: list.articleId,
      supports: list.supports,
      collections: list.collections,
      isCollection: list.isCollection,
      isSupport: list.isSupport,
    }
    wx.setStorageSync('upscData', obj)
    this.getArticleDesc() // 获取文章详情
    this.getCommentList() // 获取文章评论（详情页）
  },

  // 绑定菜单
  bindMenu(e) {
    this.setData({
      authorUserId: this.data.list.userId,
      authorTitle: this.data.list.title,
      author: this.data.list.userName,
      showModalStatus: true
    })
  },

  // 获取文章详情
  getArticleDesc() {
    getArticleDesc3({
      articleId: this.data.articleId,
      userId: this.data.userId
    }).then(res => {
      console.log('获取文章详情', res)
      this.setData({
        list: res,
      })
      this.makeHistory() //加入足迹
    }).catch(error => {
      console.log('error', error)
    })
  },

  //获取文章评论（详情页）
  getCommentList() {
    getCommentList({
      articleId: this.data.articleId,
      userId: wx.getStorageSync('userId')
    }).then(res => {
      console.log('获取文章评论（详情页）', res)
      this.setData({
        contentList: res
      })
    }).catch(error => {
      wx.showToast({
        title: '操作失败！',
        icon: 'error'
      })
      console.log(error)
    })
  },

  // 加入足迹
  makeHistory: function (e) {
    let history = wx.getStorageSync('history')
    let lg = history.length
    if (lg >= 100) {
      history.splice(0, 1)
      history.splice(lg, 1, this.data.list)
    } else if (lg < 100) {
      history.splice(lg, 1, this.data.list)
    }
    this.remove(history)
  },

  // 数据去重
  remove: function (history) {
    var array = history || [];
    // console.log("array", array);
    var newData = []
    var isHad

    array.map(item => {
      isHad = false
      newData.map(item1 => {
        if (item1.articleId === item.articleId) {
          // console.log('aaa')
          isHad = true
          return false
        }
      })
      if (!isHad) {
        newData.push(item)
      }
    })
    // console.log(newData)
    wx.setStorageSync('history', newData)
  },

  followPeople(e) {
    const that = this
    wx.request({
      url: `${baseUrl}/follow/followPeople`, //仅为示例，并非真实的接口地址
      data: {
        followId: this.data.list.userId,
        userId: wx.getStorageSync('userId')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.getArticleDesc()
      }
    })
    // followPeople({
    // followId: this.data.list.userId,
    // userId: wx.getStorageSync('userId')
    // }).then(res => {
    //   console.log('关注', res)
    // }).catch(error => {
    //   console.log(error)
    // })
  },

  gotoDetail(e) {
    wx.navigateTo({
      url: '../../home_page/Personal/Personal?userId=' + this.data.list.userId,
    })
  },

  input(e) {
    console.log(e);
    this.setData({
      comment: e.detail.value
    })
  },

  // 发送评论
  publishComment(e) {
    publishComment({
      articleId: this.data.articleId,
      comment: this.data.comment,
      commentId: wx.getStorageSync('userId'),
      userId: this.data.list.userId
    }).then(res => {
      console.log('发送评论', res)
      this.setData({
        comment: ''
      })
      this.hideContent()
      this.getCommentList()
    }).catch(error => {
      console.log(error)
    })
  },

  showInput(e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    that.animation = animation
    that.setData({
      animationData: animation.export(),
      width: 600,
      showInput: true
    })
  },

  // 隐藏
  hideContent: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    })
    that.animation = animation
    that.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      that.setData({
        animationData: animation.export(),
        showInput: false,
        width: '45%'
      })
    }, 500)
  },

  // 文章的点赞
  supportArticle(e) {
    const list = this.data.list
    supportArticle({
      articleCommentId: this.data.articleId,
      supportId: wx.getStorageSync('userId'),
      userId: this.data.list.userId
    }).then(res => {
      console.log('文章的点赞', res)
      list.isSupport = !list.isSupport
      if (res === '点赞成功') {
        list.supports = list.supports + 1
      } else if (res === '取消点赞成功！') {
        list.supports = list.supports - 1
      }
      this.setData({
        list: list
      })
    }).catch(error => {
      console.log(error)
    })
  },

  // 文章的收藏
  collectionArticle(e) {
    const list = this.data.list
    collectionArticle({
      articleId: this.data.articleId,
      userId: wx.getStorageSync('userId'),
    }).then(res => {
      console.log('文章的收藏', res)
      list.isCollection = !list.isCollection
      if (res === '收藏成功') {
        list.collections = list.collections + 1
      } else if (res === '取消收藏成功') {
        list.collections = list.collections - 1
      }
      this.setData({
        list: list
      })
    }).catch(error => {
      console.log(error)
    })
  },

  // 评论点赞
  supportComment(e) {
    supportComment({
      articleCommentId: e.currentTarget.dataset.articlecommentid,
      supportId: wx.getStorageSync('userId'),
      userId: this.data.list.userId,
    }).then(res => {
      console.log('点赞评论', res)
      this.getCommentList()
    }).catch(error => {
      console.log(error)
    })
  },

  // 跳转评论详情页
  gotoComment(e) {
    const datas = JSON.stringify(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../comment/comment?datas=' + datas,
    })
  },

  // 截取firtId
  setFirtId(e) {
    console.log(e.currentTarget.dataset);
    this.setData({
      fistid: e.currentTarget.dataset
    })
  },

  goto() {
    setTimeout(res => {
      const datas = JSON.stringify(this.data.fistid)
      console.log('???????', datas);
      wx.navigateTo({
        url: '../comment/comment?datas=' + datas,
      })
    }, 300)
  },

  onShareAppMessage: function (options) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: that.data.list.title, // 默认是小程序的名称(可以写slogan等)
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