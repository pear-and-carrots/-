import {
  updateUser, //修改用户信息
} from '../../core/api.js'
import {
  connect
} from '../../redux/index.js'
import {
  showToast,
  firstLetterUpper
} from '../../utils/util.js'
import {
  iconRightArrow
} from '../../utils/imageBase64.js'
import {
  validStringType
} from '../../utils/util.js'
const baseUrl = getApp().globalData.baseUrl
let app = getApp()
let store = app.store
let loginUser = app.globalData.loginUser
import IMController from '../../controller/im.js'
const navigationBarTitle = {
  'nick': '昵称',
  'gender': '性别',
  'birth': '我的',
  'tel': '手机',
  'email': '邮箱',
  'sign': '签名'
}
const userId = wx.getStorageSync('userId')
let pageConfig = {
  // Page({
  data: {
    userName: 'lgx',
    userData: {
      'photo': '',
      'name': '',
      'gender': '',
      'school': '',
      'major': '',
      'birth': '',
      'area': '',
      'selfSign': '',
      'qq': '',
      'wechat': '',
      'phone': '',
      'email': ''
    },
    nick: '',
    date: ''
  },
  onLoad: function (options) {
    this.findUser()
    this.setData({
      type: 'nick',
    })
    // 登录处理
    new IMController({
      token: wx.getStorageSync('token'),
      account: wx.getStorageSync('account')
    })
  },

  // 查看用户信息
  findUser() {
    const that = this
    const userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo.avatarUrl);
    wx.request({
      url: `${baseUrl}/user/` + wx.getStorageSync('userId'),
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('查看用户信息', res.data.data);
        that.setData({
          userData: res.data.data,
          date: res.data.data.birth,
          'userData.photo': userInfo.avatarUrl,
          'userData.userId': wx.getStorageSync('userId')
        })
      }
    })
    // findUser({
    //   userId: userId
    // }).then(res => {
    //   console.log('查看用户信息', res);
    //   this.setData({
    //     userData: res,
    //     date: res.birth,
    //     'userData.photo': userInfo.avatarUrl,
    //     'userData.userId': wx.getStorageSync('userId')
    //   })
    // }).catch(error => {
    //   console.log('error', error);
    // })
  },

  // 更新或修改头像
  reUserImg(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorageSync('userInfo', res.userInfo)
        this.setData({
          'userData.photo': res.userInfo.avatarUrl
        })
      }
    })
  },

  // 时间选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    setTimeout(res => {
      this.setData({
        currentId: 2
      })
    }, 600)
  },

  // 修改用户信息
  formSubmit(e) {
    const that = this
    const userForm = e.detail.value
    const userInfo = wx.getStorageSync('userInfo')
    userForm['userId'] = wx.getStorageSync('userId')
    console.log(userForm);
    updateUser({
      "area": userForm.area,
      "birth": this.data.date,
      "email": userForm.email,
      "gender": userForm.gender,
      "selfSign": userForm.selfSign,
      "major": userForm.major,
      "name": userForm.name,
      "phone": userForm.phone,
      "photo": userInfo.avatarUrl,
      "qq": userForm.qq,
      "school": userForm.school,
      "userId": wx.getStorageSync('userId'),
      "wechat": userForm.wechat
    }).then(res => {
      console.log('修改用户信息', res);
      this.setData({
        nike: userForm.name
      })
      that.submit(userForm.name)
      wx.showToast({
        title: '修改成功',
        icon: 'success'
      })
      setTimeout(res => {
        wx.reLaunch({
          url: '../../pages/about/about',
        })
      }, 1000)
    }).catch(error => {
      wx.showToast({
        title: '请输入有效信息',
        icon: 'none'
      })
      console.log('error', error);
    })
  },

  submit(data) {
    let self = this
    let paraObj = {}
    // 组装更新服务器请求参数
    paraObj[self.data.type] = data
    console.log(paraObj[self.data.type]);
    paraObj['done'] = () => {
      // 更新本地数据
      store.dispatch({
        type: 'UserInfo_Update_' + firstLetterUpper(self.data.type),
        payload: self.data[self.data.type]
      })
    }
    // 更新服务端数据(姓名)
    app.globalData.nim.updateMyInfo(paraObj)
    console.log('paraObj', paraObj);
    // 更新服务器数据(头像)
    app.globalData.nim.updateMyInfo({
      avatar: self.data.userData.photo
    })
    // 更新本地数据
    store.dispatch({
      type: 'UserInfo_Update_Avatar',
      payload: self.data.userData.photo
    })
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
  // })
}
let mapStateToData = (state) => {
  return {
    userInfo: state.userInfo
  }
}
let connectedPageConfig = connect(mapStateToData)(pageConfig)

Page(connectedPageConfig)