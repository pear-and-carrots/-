import IMController from '../../controller/im.js'
const baseUrl = getApp().globalData.baseUrl
let app = getApp()
import {
  findUser, //查看用户信息
  Userarticle, //我的发布
  supportArticle, //点赞
  collectionArticle, //收藏
  getUserArticle,
  getUserIndex //获取用户主页面
} from '../../core/api.js'
import {
  connect
} from '../../redux/index.js'
import {
  showToast,
  correctData
} from '../../utils/util.js'
let store = app.store
let pageConfig = {
  data: {
    addType: '', // friend group
    tip: '',
    inputVal: '',
    myUserId: wx.getStorageSync('userId')
  },
  onLoad: function (options) {
    console.log(options);
    // 作登录处理
    new IMController({
      token: wx.getStorageSync('userToken'),
      account: wx.getStorageSync('account')
    })
    this.setData({
      userId: options.userId
    })
    this.Userarticle(options.userId) //查询帖子
    this.getUserIndex()
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

  return () {
    console.log('????');
    wx.navigateBack({
      delta: 1,
    })
  },

  getUserIndex() {
    getUserIndex({
      followId: this.data.userId,
      userId: wx.getStorageSync('userId')
    }).then(res => {
      this.setData({
        userList: res
      })
      console.log('获取用户主页面', res);
    }).catch(error => {
      console.log(error);
    })
  },

  followPeople(e) {
    const that = this
    wx.request({
      url: `${baseUrl}/follow/followPeople`, //仅为示例，并非真实的接口地址
      data: {
        followId: this.data.userId,
        userId: wx.getStorageSync('userId')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data.data === '关注成功') {
          wx.showToast({
            title: '关注成功！',
          })
        }
        that.setData({
          'userList.isFollow': !that.data.userList.isFollow
        })
      }
    })
  },

  // 查询帖子
  //我的发布
  Userarticle(data) {
    const that = this
    getUserArticle({
      myuserId: wx.getStorageSync('userId'),
      userId: this.data.userId
    }).then(res => [
      this.setData({
        list: res
      })
    ]).catch(error => {

    })
  },

  // 跳转文章详情页
  gotoDetail (e) {
    const articleId = e.currentTarget.dataset.articleid
    const artticlesign = e.currentTarget.dataset.artticlesign
    if (e.currentTarget.dataset.artticlesign === '视频'){
      wx.navigateTo({
        url: '../../recommend/videoDetail/videoDetail?id=' + articleId,
      })
    }else {
      wx.navigateTo({
        url: '../../home_page/article/article?articleId=' + articleId + '&userId=' + wx.getStorageSync('userId') + '&artticleSign=' + artticlesign,
      })
    }
    // url="{{item.artticleSign === '视频'?'../../recommend/videoDetail/videoDetail?id={{item.articleId}}':'../../pages/article/article?articleId=item.articleId&userId=userId'}}"
  },

  /**
   * 搜索
   */
  search(e) {
    console.log(this.data.userId);
    wx.showLoading({
      title: '连接中',
    })
    app.globalData.nim.getUser({
      account: this.data.userId,
      done: this.searchFriendResult
    })
  },
  /**
   * 搜索结果
   */
  searchFriendResult(err, user) {
    const that = this
    wx.hideLoading()
    if (err) {
      console.log(err)
      return
    }
    if (user) {
      if (user.account == wx.getStorageSync('account')) { //自己
        wx.showToast({
          title: '不可联系自己',
          icon: 'none'
        })
      } else { //非自己：可能好友可能陌生人
        let isFriend = false
        let accounts = Object.keys(this.data.friendCard)
        // 是否好友
        accounts.map(account => {
          if (account == user.account && this.data.friendCard[account].isFriend == true) {
            isFriend = true
            return
          }
        })
        if (isFriend) { //好友
          // 更新会话对象
          store.dispatch({
            type: 'CurrentChatTo_Change',
            payload: 'p2p-' + this.data.userId
          })
          wx.navigateTo({
            url: '../../partials/chating/chating?chatTo=' + this.data.userId + '&type=p2p',
          })
        } else { //陌生人
          console.log(this.data.friendCard, user)
          that.addFriendBtnHandler()
          // store.dispatch({
          //   type: 'FriendCard_Update_NonFriendInfoCard',
          //   payload: user
          // })
          // wx.navigateTo({
          //   url: '../strangercard/strangercard?account=' + user.account,
          // })

        }
      }
    } else {
      showToast('text', '该好友不存在')
    }
  },

  addFriendBtnHandler() {
    const that = this
    let account = this.data.userId
    app.globalData.nim.addFriend({
      account,
      ps: '',
      done: (err, obj) => {
        if (err) {
          console.log(err)
          return
        }
        // showToast('text', '添加成功')
        // 获取名片信息
        app.globalData.nim.getUser({
          account,
          done: function (err, user) {
            store.dispatch({
              type: 'FriendCard_Add_Friend',
              payload: user
            })
            // 订阅后只有在订阅账号登录状态变化后才会收到推送事件
            app.globalData.nim.subscribeEvent({
              type: 1, // 订阅用户登录状态事件
              accounts: new Array(account),
              subscribeTime: 3600 * 24 * 30,
              sync: true,
              done: function (err, obj) {
                if (err) {
                  console.log(err)
                  return
                }
                console.log(obj) // {failedAccounts: Array(0)}
              }
            })
            console.log(that.data.userId);
            // 更新会话对象
            store.dispatch({
              type: 'CurrentChatTo_Change',
              payload: 'p2p-' + that.data.userId
            })
            wx.navigateTo({
              url: '../../partials/chating/chating?chatTo=' + that.data.userId + '&type=p2p',
            })
          }
        })
      }
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
    const userId = this.data.userId
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