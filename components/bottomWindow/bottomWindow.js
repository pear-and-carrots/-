import {
  insertComplaint, //上传投诉到管理端
} from '../../core/api.js'
Component({
  properties: {
    authorUserId: String,
    author: String,
    authorTitle: String,
    showModalStatus: Boolean
  },
  data: {
    messageList: [
      {
        id:0,
        name: '不喜欢该类内容',
        src: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634729656406.png'
      }, {
        id:1,
        name: '不看该作者：',
        src: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634729690311.png'
      }, {
        id:2,
        name: '举报',
        src: 'https://haiqian.obs.cn-south-1.myhuaweicloud.com:443/desgin%2F1634729725003.png'
      },
    ]
  },
  methods: {
    //显示对话框
    showModal: function () {
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    },
    //隐藏对话框
    hideModal: function () {
      // 隐藏遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: false
        })
      }.bind(this), 200)
    },

    message (e) {
      const id = e.currentTarget.dataset.id
      insertComplaint({
        "articleId": this.data.authorUserId,
        "describe": this.data.messageList[id].name,
        "reason": id,
        "userId": wx.getStorageSync('userId')
      }).then(res => {
        console.log('投诉结果', res)
        wx.showToast({
          title: '感谢您的反馈！'
        })
        this.setData({
          commentList: res,
          showModalStatus: false
        })
      }).catch(error => {
        console.log(error)
      })
    },
  }
})