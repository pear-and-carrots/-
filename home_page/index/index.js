const app = getApp()
import {
  getAllSign,
  putLikeSign,
  updateUser
} from '../../core/api.js'
Page({
  data: {
    currentId: 0,
    genderList: [{
      id: 0,
      img: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634729923516.png',
      name: '男'
    }, {
      id: 1,
      img: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634729933338.png',
      name: '女'
    }],
    genderId: -1,
    constellationId: -1,
    constellationList: [{
      id: 0,
      img: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634729971305.png',
      name: '白羊座',
      day: '3.21~4.19'
    }, {
      id: 1,
      img: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634729987522.png',
      name: '金牛座',
      day: '4.20～5.20'
    }, {
      id: 2,
      img: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634730001216.png',
      name: '双子座',
      day: '5.21～6.21'
    }, {
      id: 3,
      img: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634730020974.png',
      name: '巨蟹座',
      day: '6.22～7.22'
    }, {
      id: 4,
      img: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634730037234.png',
      name: '狮子座',
      day: '7.23～8.22'
    }, {
      id: 5,
      img: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634730050211.png',
      name: '处女座',
      day: '8.23～9.22'
    }, {
      id: 6,
      img: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634730064698.png',
      name: '天秤座',
      day: '9.23～10.23'
    }, {
      id: 7,
      img: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634730089093.png',
      name: '天蝎座',
      day: '10.24～11.22'
    }, {
      id: 8,
      img: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634730105603.png',
      name: '射手座',
      day: '11.23～12.21'
    }, {
      id: 9,
      img: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634730120924.png',
      name: '摩羯座',
      day: '12.22～1.19'
    }, {
      id: 10,
      img: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634730134845.png',
      name: '水瓶座',
      day: '1.20～2.18'
    }, {
      id: 11,
      img: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634730152423.png',
      name: '双鱼座',
      day: '2.19～3.20'
    }, ],
    InterestList: [{
      id: 0,
      name: "UI"
    }, {
      id: 1,
      name: "网页设计"
    }, {
      id: 2,
      name: "工业设计",
      isShow: false
    }, {
      id: 3,
      name: "动漫设计",
      isShow: false
    }, {
      id: 4,
      name: "海报设计",
      isShow: false
    }, {
      id: 5,
      name: "插画设计",
      isShow: false
    }, {
      id: 6,
      name: "插画设计",
      isShow: false
    }, {
      id: 7,
      name: "插画设计",
      isShow: false
    }, {
      id: 8,
      name: "插画设计",
      isShow: false
    }, {
      id: 9,
      name: "插画设计",
      isShow: false
    }, {
      id: 10,
      name: "插画设计",
      isShow: false
    }, {
      id: 11,
      name: "插画设计",
      isShow: false
    }],
    gender: '',
    constellation: '',
    Interest: [],
    signId: [],
    date: ''
  },
  onLoad() {
    this.getAllSign() //获取所有标签
  },

  // 绑定轮播
  bindSwiper(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },

  // 选择性别
  getGender(e) {
    this.setData({
      genderId: e.currentTarget.dataset.id,
      gender: e.currentTarget.dataset.name
    })
    setTimeout(res => {
      this.setData({
        currentId: 1
      })
    }, 300)
  },

  // 选择星座
  constellation(e) {
    this.setData({
      constellationId: e.currentTarget.dataset.id,
      constellation: e.currentTarget.dataset.name,
    })
    setTimeout(res => {
      this.setData({
        currentId: 2
      })
    }, 300)
  },

  // 时间选择
  bindDateChange: function(e) {
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
  
  // 获取所有标签
  getAllSign(e) {
    getAllSign({}).then(res => {
      console.log('获取所有标签', res)
      res.forEach(item => {
        item['isShow'] = false
      })
      this.setData({
        InterestList: res
      })
    }).catch(error => {
      console.log(error)
    })
  },

  // 选择方向
  Interest(e) {
    const id = e.currentTarget.dataset.id
    const InterestList = this.data.InterestList
    InterestList.forEach((item, index) => {
      if (id === item.id) {
        item.isShow = !item.isShow
      }
    })
    this.setData({
      InterestList,
    })

  },

  sumbit() {
    const Interest = this.data.Interest
    const InterestList = this.data.InterestList
    InterestList.forEach(item => {
      if (item.isShow === true) {
        Interest.push(item.signId)
      }
    })
    this.setData({
      Interest,
    })
    console.log(this.data.constellation);
    console.log(this.data.gender);
    console.log(Interest);
    if (this.data.gender.length === 0) {
      wx.showToast({
        title: '性别不能为空',
        icon: 'none'
      })
      this.setData({
        currentId: 0
      })
    } else if (this.data.date.length === 0) {
      wx.showToast({
        title: '未填写生日',
        icon: 'none'
      })
      this.setData({
        currentId: 1
      })
    } else if (this.data.Interest.length < 3) {
      wx.showToast({
        title: '请继续选择',
        icon: 'none'
      })
      this.setData({
        currentId: 2
      })
    } else {
      this.putLikeSign()
      this.repairUser()
      wx.showToast({
        title: '欢迎您的加入',
        icon: 'none'
      })
      setTimeout(res => {
        wx.reLaunch({
          url: '../../pages/home_page/home_page',
        })
      }, 1000)
    }
  },

  // 插入用户喜欢的标签
  putLikeSign(e) {
    const that = this
    // const likeId = JSON.stringify(this.data.Interest)
    putLikeSign({
      likeId: this.data.Interest,
      userId: wx.getStorageSync('userId'),
      "birthday": this.data.date,
      "gender": that.data.gender,
    }).then(res => {
      console.log('插入用户喜欢的标签', res)
    }).catch(error => {
      console.log(error)
    })
  },

  // 修改用户信息
  repairUser() {
    const that = this
    updateUser({
      gender: that.data.gender, //性别
      selfSign: that.data.constellation, //星座
      userId: wx.getStorageSync('userId')
    }).then(res => {
      console.log('修改用户信息', res)
    }).catch(error => {
      console.log(error)
    })
  }
})