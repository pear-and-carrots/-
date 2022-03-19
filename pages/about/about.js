const app = getApp()
const baseUrl = getApp().globalData.baseUrl
const stars = []
const G = 0.01
const stime = 60
const SPEED_LIMIT_X = 1
const SPEED_LIMIT_Y = 1
const W = wx.getSystemInfoSync().windowWidth
const H = wx.getSystemInfoSync().windowHeight
const starImage = '../../images/小花.png' //小花素材

import {
  myself, //我的用户信息以及数据锦集
  readSupport, //我的界面：今日数据
} from '../../core/api.js'
Page({
  data: {
    navList1: [{
      id: 0,
      name: '我的发布',
      imgUrl: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634728898765.png',
      url: '../../about/articleList/articleList?articleId=1'
    }, {
      id: 1,
      name: '我的收藏',
      imgUrl: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634728932696.png',
      url: '../../about/articleList/articleList?articleId=2'
    }, {
      id: 2,
      name: '我的足迹',
      imgUrl: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634728947465.png',
      url: '../../about/articleList/articleList?articleId=4'
    }, {
      id: 3,
      name: '我的关注',
      imgUrl: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634728965527.png',
      url: '../../about/userList/userList?userListId=3'
    }, ],
    navList2: [{
      id: 0,
      name: '意见反馈',
      imgUrl: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634728986751.png',
      url: '../../about/message/message'
    }, {
      id: 1,
      name: '答疑解惑',
      imgUrl: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634728998918.png',
      url: '../../about/question/question'
    }, {
      id: 2,
      name: '关于我们',
      imgUrl: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634729017035.png',
      url: '../../about/about/about'
    }, {
      id: 3,
      name: '退出登录',
      imgUrl: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634729032986.png',
      url: '../../about/FocusList/FocusList'
    }, ],
    todyData: {},
    drawflower: false,
  },

  onLoad: function (options) {
    console.log(wx.getStorageSync('userId'))
    this.myself()
    this.readSupport()
    this.check()
  },

  check () {
    wx.request({
      url: `${baseUrl}/user/` + wx.getStorageSync('userId'),
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('???????????', res);
        if (res.data.code == 200) {
          console.log(res.data.data);
          if (res.data.data.name.length === 0 || res.data.data.photo === 0) {
            wx.showModal({
              title: '温馨提示',
              content: '请尽快完善您的个人信息',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/about/Modify/Modify',
                  })
                }
              }
            })
          }
        }
      }
    })
  },

  onShow() {
    if (this.data.drawflower === false) {
      setTimeout(res => {
        this.createStar()
      }, 300)
    }
    this.setData({
      drawflower: true
    })
    this.myself()
    this.readSupport()
  },

  onHide () {
    this.myself()
    this.readSupport()
  },

  // 我的用户信息以及数据锦集
  myself() {
    const that = this
    wx.request({
      url: `${baseUrl}/user/myself/` + wx.getStorageSync('userId'),
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('我的用户信息以及数据锦集', res);
        const userData = []
        userData.push({
          name: '获赞数',
          num: res.data.data.supports,
          id: 0
        }, {
          name: '获收藏',
          num: res.data.data.collections,
          id: 0
        }, {
          name: '粉丝数',
          num: res.data.data.fans,
          url: '../../about/userList/userList?userListId=1',
          id: 0
        }, {
          name: '排行榜',
          num: res.data.data.ranking,
          url: '../../about/userList/userList?userListId=2',
          id: 0
        }, )
        that.setData({
          user: res.data.data,
          userData: userData
        })
      }
    })
    // myself({
    //   userId: userId
    // }).then(res => {
    //   console.log('我的用户信息以及数据锦集', res);
    //   const userData = []
    //   userData.push({
    //     name: '点赞量',
    //     num: res.supports,
    //     id: 0
    //   }, {
    //     name: '收藏量',
    //     num: res.followers,
    //     id: 0
    //   }, {
    //     name: '粉丝量',
    //     num: res.fans,
    //     url: '../../about/userList/userList?userListId=1',
    //     id: 0
    //   }, {
    //     name: '排行榜',
    //     num: res.ranking,
    //     url: '../../about/userList/userList?userListId=2',
    //     id: 0
    //   }, )
    //   this.setData({
    //     user: res,
    //     userData: userData
    //   })
    // }).catch(error => {
    //   console.log('error', error);
    // })
  },

  // 我的界面：今日数据
  readSupport() {
    const that = this
    wx.request({
      url: `${baseUrl}/Data/readSupport`,
      data: {
        userId: wx.getStorageSync('userId')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('我的界面：今日数据', res.data.data);
        const todyData = {
          readNum: res.data.data.readNum,
          supports: res.data.data.supports,
          yesterdayReads: res.data.data.yesterdayReads,
          yesterdaySupports: res.data.data.yesterdaySupports
        }
        that.setData({
          todyData
        })
      }
    })
    // readSupport({
    //   userId: wx.getStorageSync('userId')
    // }).then(res => {
    //   const todyData = {
    //     readNum: res.readNum,
    //     supports: res.supports,
    //     yesterdayReads: res.yesterdayReads,
    //     yesterdaySupports: res.yesterdaySupports
    //   }
    //   this.setData({
    //     todyData
    //   })
    //   console.log('我的界面：今日数据', res);
    // }).catch(error => {
    //   console.log('error', error);
    // })
  },

  // 跳转设置中心
  gotoModify(e) {
    if (wx.getStorageSync('userInfo').length === 0) {
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          wx.setStorageSync('userInfo', res.userInfo)
          wx.navigateTo({
            url: '../../about/Modify/Modify',
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../../about/Modify/Modify',
      })
    }
  },

  return () {
    wx.showModal({
      title: '温馨提示',
      content: '您确认退出登录？本地缓存会跟着清除噢！',
      success(res) {
        if (res.confirm) {
          // wx.clearStorageSync()
          wx.clearStorageSync()
          wx.reLaunch({
            url: '../../home_page/login/login',
          })
        } else if (res.cancel) {}
      }
    })
  },

  createStar() {
    let starCount = 500 //总的数量
    let starNum = 0 //当前生成数
    let deltaTime = 0
    let ctx = wx.createCanvasContext('myCanvas')
    let requestAnimationFrame = (() => {
      return (callback) => {
        setTimeout(callback, 1000 / stime)
      }
    })()
    starLoop()

    function starLoop() {
      requestAnimationFrame(starLoop)
      ctx.clearRect(0, 0, W, H)
      deltaTime = 4
      starNum += deltaTime
      if (starNum > starCount) {
        stars.push(
          new Star(Math.random() * W, 0, Math.random() * 5 + 5)
        );
        starNum %= starCount
      }
      stars.map((s, i) => { //重复绘制
        s.update()
        s.draw()
        if (s.y >= H) { //大于屏幕高度的就从数组里去掉
          stars.splice(i, 1)
        }
      })
      ctx.draw()
    }

    function Star(x, y, radius) {
      this.x = x
      this.y = y
      this.sx = 0
      this.sy = 0
      this.deg = 0
      this.radius = radius
      this.ax = Math.random() < 0.5 ? 0.005 : -0.005
    }

    Star.prototype.update = function () {
      const deltaDeg = Math.random() * 0.6 + 0.2

      this.sx += this.ax
      if (this.sx >= SPEED_LIMIT_X || this.sx <= -SPEED_LIMIT_X) {
        this.ax *= -1
      }

      if (this.sy < SPEED_LIMIT_Y) {
        this.sy += G
      }

      this.deg += deltaDeg
      this.x += this.sx
      this.y += this.sy
    }

    Star.prototype.draw = function () {
      const radius = this.radius
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(this.deg * Math.PI / 180)
      ctx.drawImage(starImage, -radius, -radius * 2.8, radius * 2, radius * 2)
      ctx.restore()
    }
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})