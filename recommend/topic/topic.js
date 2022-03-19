import {
  getArticleDesc, //获取文章详情
  getCommentList, //获取文章评论（详情页）
  followPeople, //用户界面的关注功能，关注那个按钮点击时调用的接口
  publishComment, //发布一级评论
  enterHome, //加入群聊
} from '../../core/api.js'
import {
  connect
} from '../../redux/index.js'
import {
  showToast,
  correctData
} from '../../utils/util.js'
import IMController from '../../controller/im.js'
const baseUrl = getApp().globalData.baseUrl
let app = getApp()
let store = app.store
let pageConfig = {
  data: {
    list: {
      'user': '网易小云',
      'time': '刚刚',
      'title': '2021网易游戏中秋礼盒 | 风来韵转，福铃响至',
      'dec': '<p>-</p><p>HELLO，朋友们好久不见！时隔一年，我终于又发东西了（感动ing</p><p>今年过得好快，一晃眼都要国庆了！卡点祝大家国庆快乐~</p><p>今年换了新公司，在组里向小伙伴们学到了好多！感谢大佬们带我飞555（我又有奋斗的动力了！</p><p>要说的东西基本也都在图里啦~</p><p>-</p><p>监制指导Supervise Director：李德耀</p><p>项目统筹Project Coordinator：仁博</p><p>创意设计Creative Design：天才饽饽@天才饽饽</p><p>视觉设计Graphic Design：kyrja</p><p>插画设计Illustration：杨宸@myux</p><p>3D渲染3D rendering：康康/杨宸</p><p>动效设计Animation Design：易俊伶@Ejunjun</p>'
    },
    focus: true,
    contentList: [],
    comment: ''
  },

  onLoad: function (options) {
    const data = JSON.parse(options.data)
    // 作登录处理
    new IMController({
      token: wx.getStorageSync('userToken'),
      account: wx.getStorageSync('account')
    })

    this.setData({
      list: data
    })
    // this.getArticleDesc() // 获取文章详情
    // this.getCommentList() // 获取文章评论（详情页）
  },

  onShow() {},

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
        followId: that.data.list.ownerId,
        userId: wx.getStorageSync('userId')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          "list.isFollow": !that.data.list.isFollow
        })
      }
    })
  },

  gotoDetail(e) {
    wx.navigateTo({
      url: '../../home_page/Personal/Personal?userId=' + this.data.list.ownerId,
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

  onReachBottom: function () {

  },

  // 加入群聊
  join() {
    const that = this
    var tid = this.data.list.tid
    var str = ''
    str = 'team-' + tid
    if (this.data.list.ownerId != wx.getStorageSync('userId')) {
      enterHome({
        ownerId: this.data.list.ownerId,
        tid: tid,
        userId: wx.getStorageSync('userId')
      }).then(res => {
        console.log('hhhhhhhhhhhhh', res);
        that.joinAfter(str)
      }).catch(error => {
        console.log('????', error);
        wx.showToast({
          title: '请求错误！',
          icon: 'none'
        })
      })
    } else if (this.data.list.ownerId == wx.getStorageSync('userId')) {
      that.joinAfter(str)
    }
  },

  joinAfter(session) {
    console.log(session);
    // 更新会话对象
    store.dispatch({
      type: 'CurrentChatTo_Change',
      payload: session
    })
    setTimeout(res => {
      store.dispatch({
        type: 'Set_Current_Group',
        payload: this.data.list.tid
      })
      console.log(this.data.list.tid);
      wx.navigateTo({
        url: '../../partials/chating/chating?chatTo=' + this.data.list.tid + '&type=advanced' + '&ownerId=' + this.data.list.ownerId,
      })
    }, 500)
    app.globalData.nim.resetSessionUnread(session)
  },

  // 点击进去群聊
  switchToChating(e) {
    let account = e.currentTarget.dataset.account
    let session = e.currentTarget.dataset.session
    // 更新会话对象
    store.dispatch({
      type: 'CurrentChatTo_Change',
      payload: session
    })
    let typeAndAccount = session.split('-')
    var chatType
    if (typeAndAccount[0] === 'team') {
      let card = this.data.groupList[typeAndAccount[1]] || {}
      chatType = card.type || 'team'
      store.dispatch({
        type: 'Set_Current_Group',
        payload: account
      })
    } else {
      chatType = 'p2p'
    }
    // 告知服务器，标记会话已读
    app.globalData.nim.resetSessionUnread(session)
    // 跳转
    wx.navigateTo({
      url: `../../partials/chating/chating?chatTo=${account}&type=${chatType}`,
    })
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
}
let mapStateToData = (state) => {
  return {
    userInfo: state.userInfo,
    friendCard: state.friendCard,
    groupList: state.groupList,
    groupMemberList: state.groupMemberList
  }
}
let connectedPageConfig = connect(mapStateToData)(pageConfig)
Page(connectedPageConfig)