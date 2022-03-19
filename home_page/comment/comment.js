import {
  FgetComment, //获取某一大评论的详情页
  publishSecondComment, //发布二级评论
  supportComment, //评论点赞
} from '../../core/api.js'
Page({
  data: {
    commentList: [],
    commentText: '',
    isShowBottomInput: true
  },

  onLoad: function (options) {
    console.log(options);
    const datas = JSON.parse(options.datas)
    this.setData({
      author: datas
    })
    this.FgetComment()
  },

  // 获取某一大评论的详情页
  FgetComment() {
    const author = this.data.author
    FgetComment({
      firstCommentId: this.data.author.fistid,
      userId: wx.getStorageSync('userId')
    }).then(res => {
      console.log('获取某一大评论的详情页', res)
      author['commentname'] = res.firstComment
      author['photo'] = res.photo
      author['commenttext'] = res.firstComment
      author['createtime'] = res.createTime
      author['isSupport'] = res.isSupport
      this.setData({
        commentList: res,
        author: author,
        name: res.name,
        data: res
      })
    }).catch(error => {
      console.log(error)
    })
  },

  input(e) {
    this.setData({
      commentText: e.detail.value
    })
  },

  bindInput(e) {
    console.log(e.currentTarget.dataset.data)
    let name = ''
    if (e.currentTarget.dataset.data.secondComDescs == null) {
      name = e.currentTarget.dataset.data.commentName
    } else {
      name = e.currentTarget.dataset.data.name
    }
    this.setData({
      isShowBottomInput: true,
      data: e.currentTarget.dataset.data,
      name: name,
    })
  },

  publishSecondComment1() {
    this.setData({
      isShowBottomInput: false
    })
  },

  // 发布二级评论
  publishSecondComment(e) {
    const that = this
    if (this.data.commentText.length === 0) {
      wx.showToast({
        title: '内容不能为空！',
        icon: 'none'
      })
    } else {
      const data = this.data.data
      var firstId = ''
      // console.log(author.fistid);
      // console.log(this.data.commentText);
      // console.log(wx.getStorageSync('userId'));
      // console.log(author.userid);
      // console.log(author.fistid);
      if (data.secondComDescs == null) {
        firstId = data.secondId
      } else {
        firstId = data.firstId
      }
      publishSecondComment({
        bigCommentId: that.data.author.fistid, //一级评论的评论ID
        comment: this.data.commentText, //内容
        commentId: wx.getStorageSync('userId'), //评论者
        commentedId: data.userId, //被评论者ID
        firstId: firstId //末级评论内容的ID
      }).then(res => {
        console.log('发布二级评论', res)
        this.setData({
          commentText: '',
          isShowBottomInput: false
        })
        this.FgetComment()
      }).catch(error => {
        console.log(error)
      })
    }
  },

  // 评论点赞
  supportComment(e) {
    console.log(e);
    supportComment({
      articleCommentId: e.currentTarget.dataset.articlecommentid,
      supportId: wx.getStorageSync('userId'),
      userId: this.data.commentList.userId,
    }).then(res => {
      console.log('点赞评论', res)
      this.FgetComment()
    }).catch(error => {
      console.log(error)
    })
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})