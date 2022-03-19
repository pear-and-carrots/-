import {
  help
} from '../../core/api.js'
Page({
  data: {
    list: []
  },

  onLoad() {
    this.help()
  },

  help() {
    help({}).then(res => {
      res.push({
        id: 9,
        question: '用户协议书在哪里查看？',
        answer: '点击查看'
      })
      this.setData({
        list: res
      })
    }).catch(error => {

    })
  },

  goto (e) {
    console.log(e.currentTarget.dataset.id);
    if (e.currentTarget.dataset.answer === '点击查看'){
      wx.navigateTo({
        url: '../licence/licence',
      })
    }
  }
})