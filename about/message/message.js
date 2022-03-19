import {
  userSuggest, // 用户意见返回接口
} from '../../core/api.js'
const baseUrl = getApp().globalData.baseUrl

Page({
  data: {
    array: ['布局', '内容', '费用', '体验'],
    photo: ''
  },

  onLoad: function (options) {

  },

  // 意见类型
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      type: this.data.array[e.detail.value]
    })
  },

  // 意见内容
  areaText(e) {
    console.log(e.detail.value);
    this.setData({
      context: e.detail.value
    })
  },

  // 上传封面
  addImg(e) {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        that.setData({
          tempFilePaths: res.tempFilePaths
        })
        that.insertFile(res.tempFilePaths)
      }
    })
  },

  // 上传文件
  insertFile(data) {
    const that = this
    wx.showLoading()
    wx.uploadFile({
      url: `${baseUrl}/article/insertFile`,
      name: 'multipartFile',
      filePath: data[0],
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: function (res) {
        var obj = JSON.parse(res.data)
        console.log(obj);
        that.setData({
          photo: obj.data
        })
        wx.hideLoading()
      },
      fail: function (res) {
        wx.showModal({
          showCancel: false,
          title: '',
          content: '图片上传失败,请重试',
          duration: '2000'
        })
        console.log("失败原因", res)
      }
    })
  },

  // 点击查看图片
  previewImg: function (e) {
    const arr = []
    arr.push(this.data.photo)
    wx.previewImage({
      current: this.data.photo, //当前图片地址
      urls: arr
    })
  },

  //长按删除图片
  deleImg() {
    const that = this
    wx.showModal({
      title: '温馨提示',
      content: '是否删除当前图片？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.setData({
            photo: ''
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 联系方式
  contact(e) {
    console.log(e.detail.value);
    this.setData({
      contact: e.detail.value
    })
  },

  // 邮件
  email(e) {
    console.log(e.detail.value);
    this.setData({
      email: e.detail.value
    })
  },

  // 用户反馈意见
  userSuggest() {
    const that = this
    userSuggest({
      "contact": this.data.contact,
      "context": this.data.contact,
      "email": this.data.email,
      "photo": this.data.photo,
      "type": this.data.type,
      "userId": wx.getStorageSync('userId')
    }).then(res => {
      console.log('用户反馈意见', res);
      wx.showModal({
        title: '',
        content: '感谢您的反馈，我们工作人员会认真采纳您的意见，谢谢合作',
        showCancel: false,
        context: '好的'
      })
      that.setData({
        "contact": '',
        "context": '',
        "email": '',
        "photo": '',
        "index": -1
      })
    }).catch(error => {
      wx.showToast({
        title: '请求失败',
        icon: 'error'
      })
    })
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})