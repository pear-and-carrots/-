import {
  userLogin, //用户登录
  userRegister, //用户注册
} from '../../core/api.js'
import IMController from '../../controller/im.js'
import {
  post,
  validStringType,
  showToast
} from '../../utils/util.js'
import {
  iconLogo
} from '../../utils/imageBase64.js'
import MD5 from '../../vendors/md5.js'
import {
  connect
} from '../../redux/index.js'
let app = getApp()
Page({
  data: {
    navList: [{
      id: 0,
      name: '登录',
      lradius: '15',
      rradius: '0'
    }, {
      id: 1,
      name: '注册',
      lradius: '0',
      rradius: '15'
    }, ],
    navId: 0,
    loginRight: false,
    registered: false,
    isPassword: true, //是否查看密码
    password: '',
    phoneNumber: '',
    userPhone: '',
    showCodeNum: false,
    num: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  nav(e) {
    this.setData({
      navId: e.currentTarget.dataset.id,
      isPassword: true,
    })
  },

  // 用户输入手机号码
  phoneNumber(e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },

  // 用户输入密码
  password(e) {
    this.setData({
      password: e.detail.value
    })
  },

  showPassword() {
    let isPassword = this.data.isPassword
    this.setData({
      isPassword: !isPassword
    })
  },

  // 检查登录
  checkLogin() {
    let password = this.data.password
    let phoneNumber = this.data.phoneNumber
    userLogin({
      password,
      phoneNumber
    }).then(res => {
      setTimeout(res => {
        wx.reLaunch({
          url: '/pages/home_page/home_page'
        })
      }, 1300)
      console.log('用户登录', res)
      wx.setStorageSync('userToken', res.token)
      this.setData({
        loginRight: true
      })
      new IMController({
        token: res.token,
        account: res.userId
      })
      wx.setStorageSync('userId', res.userId)
      wx.setStorageSync('token', password)
      wx.setStorageSync('account', res.userId)
    }).catch(error => {
      console.log("error", error)
      wx.showToast({
        title: '登录失败！',
        icon: 'error'
      })
    })
  },

  // 用户注册输入手机号
  newPhone(e) {
    this.setData({
      newPhone: e.detail.value
    })
  },

  // 获取验证码
  getCheckCode(e) {
    this.setData({
      showCodeNum: true
    })
    this.countdown()
  },

  countdown(e) {
    var num = this.data.num
    this.setData({
      num: num - 1
    })
    if (num > 50) {
      setTimeout(res => {
        this.countdown()
      }, 1000)
    } else if (num === 50) {
      this.setData({
        showCodeNum: false
      })
    }
  },

  // 输入验证码
  checkCode(e) {
    this.setData({
      checkCode: e.detail.value
    })
  },

  // 设置新密码
  newPassword(e) {
    this.setData({
      newPassword: e.detail.value
    })
  },

  // 发送注册请求
  register() {
    console.log(this.data.newPhone);
    console.log(this.data.newPassword);
    userRegister({
      password: this.data.newPassword,
      phoneNumber: this.data.newPhone,
    }).then(res => {
      console.log(res);
      wx.setStorageSync('userId', res.userId)
      wx.setStorageSync('userToken', res.token)
      wx.setStorageSync('token', this.data.newPassword)
      wx.setStorageSync('account', res.userId)
      this.setData({
        registered: true
      })
      wx.showToast({
        title: '注册成功！',
        icon: 'success'
      })
      setTimeout(res => {
        wx.reLaunch({
          url: '../../home_page/index/index'
        })
      }, 1300)
      // this.registered()
    }).catch(error => {
      console.log('error', error);
      wx.showToast({
        title: '该手机号已经注册',
        icon: 'error'
      })
    })
  },


  // 检查注册
  registered() {
    const that = this
    const userId = wx.getStorageSync('userId')
    // 发送请求
    wx.request({
      url: app.globalData.ENVIRONMENT_CONFIG.url + '/api/createDemoUser',
      method: 'POST',
      data: {
        username: userId,
        password: MD5(that.data.newPassword),
        nickname: userId
      },
      header: {
        'appkey': app.globalData.ENVIRONMENT_CONFIG.appkey,
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log(res);
        if (res.data.res == 414) {
          wx.showToast({
            title: '该账号已注册',
            icon: 'error'
          })
        } else if (res.data.res == 200) {
          // 注册成功
          wx.setStorageSync('token', that.data.newPassword)
          wx.setStorageSync('account', userId)
          that.setData({
            registered: true
          })
          wx.showToast({
            title: '注册成功！',
            icon: 'success'
          })
          setTimeout(res => {
            wx.reLaunch({
              url: '../../home_page/index/index'
            })
          }, 1300)
        }
      }
    })
  },

  // 找回密码（按钮）
  findPassword() {
    this.setData({
      navId: -1
    })
  },

  // 找回密码（输入手机号)
  getnewPhone(e) {
    this.setData({
      getnewPhone: e.detail.value
    })
  },

  code(e) {
    this.setData({
      code: e.detail.value,
      codeNum: true
    })
  },

  // 输入新密码
  getNewPassword(e) {
    this.setData({
      getNewPassword: e.detail.value
    })
  },

  // 找回密码(验证验证码)
  check() {
    if (this.data.code === '123') {
      this.setData({
        isCode: true
      })
    } else {
      wx.showToast({
        title: '验证码错误！',
        icon: 'error'
      })
    }
  },

  // 找回密码(保存新密码，返回登录页面)
  returnlogin() {
    this.setData({
      navId: 0,
      showCodeNum: false,
      isPassword: true,
      codeNum: false,
      isCode: false
    })
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})