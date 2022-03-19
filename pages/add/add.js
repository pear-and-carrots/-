const baseUrl = getApp().globalData.baseUrl
const app = getApp()
import {
  getAllSign, //查询所有标签
  putArticle, //发布文章
  insertArticleVideo, //发布视频
  home, //创建群聊
  insertArticle,
  putVideo, //视频上传接口
} from '../../core/api.js'
Page({
  data: {
    navList: [{
      id: 0,
      name: '发布帖子'
    }, {
      id: 1,
      name: '分享视频'
    }, {
      id: 2,
      name: '发起话题'
    }, ],
    topNavId: 0,
    vDetail: '',
    VedioUrl: '',
    articleCover: '', //封面
    editorData: '', //富文本的值
    sign: [],
    context: '',
    title: '',
    src: '', // 上传视频
    signList: [],
    articleSign: '富文本',
    array: ['富文本', '普通九图'],
    items: [{
        value: '原创',
        name: '原创'
      },
      {
        value: '转载',
        name: '转载'
      }
    ],
    original: '', //文章类型
    arrayIndex: 0,
    // 九宫格拖拽
    images: [],
    imageList: [],
    imageWitdh: 0,
    x: 0, // movable-view的坐标
    y: 0,
    areaHeight: 0, // movable-area的高度
    hidden: true, // movable-view是否隐藏
    currentImg: '', // movable-view的图片地址
    currentIndex: 0, // 要改变顺序的图片的下标
    pointsArr: [], // 每张图片的坐标
    flag: true, // 是否是长按
    scrollTop: 0, // 滚动条距离顶部的距离
  },
  onLoad: function (options) {
    this.check() //检查
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f9fafc',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    this.getAllSign()

    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({
      isIOS
    })
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },

  // 获取所有标签
  getAllSign(e) {
    getAllSign({}).then(res => {
      console.log('获取所有标签', res)
      res.forEach(item => {
        item['active'] = false
      })
      this.setData({
        signList: res
      })
    }).catch(error => {
      console.log(error)
    })
  },

  nav(e) {
    this.setData({
      topNavId: e.currentTarget.dataset.id
    })
  },

  // 绑定选择器
  bindPicker(e) {
    if (e.detail.value == 0) {
      this.setData({
        articleSign: '富文本',
        arrayIndex: e.detail.value
      })
    } else if (e.detail.value == 1) {
      this.setData({
        articleSign: '图片',
        arrayIndex: e.detail.value
      })
    }
  },

  // 获取文章类型
  radioChange(e) {
    this.setData({
      original: e.detail.value
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
          tempFilePaths: res.tempFilePaths,
          imgType: 1
        })
        that.insertFile(res.tempFilePaths)
      }
    })
  },

  // 上传文件
  insertFile(data) {
    const imgType = this.data.imgType
    const topNavId = this.data.topNavId
    const that = this
    wx.showLoading()
    console.log(data)
    wx.uploadFile({
      url: `${baseUrl}/article/insertFile`,
      name: 'multipartFile',
      filePath: data[0],
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: function (res) {
        var obj = JSON.parse(res.data)
        // console.log("后端返回图片的地址:", obj.data)
        if (imgType === 1) {
          that.setData({
            articleCover: obj.data
          })
        } else if (imgType === 2) {
          that.setData({
            imgUrl: obj.data
          })
          that.editorCtx.insertImage({
            src: obj.data,
            data: {
              id: 'abcd',
              role: 'god'
            },
            width: '80%',
            success: function () {
              console.log('insert image success')
            }
          })
        } else if (topNavId === 1) {
          that.setData({
            VedioUrl: obj.data
          })
        } else if (imgType === 3) {
          const imageList = that.data.imageList
          imageList.push(obj.data)
          console.log(imageList);
          that.setData({
            imageList: imageList
          })
        }
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
    console.log(this.data.articleCover);
    const arr = []
    arr.push(this.data.articleCover)
    wx.previewImage({
      current: this.data.articleCover, //当前图片地址
      urls: arr
    })
  },

  // 标签
  viewCases() {
    this.setData({
      signShow: !this.data.signShow,
    })
  },

  actionActive(e) {
    let signList = this.data.signList
    let arr = [...signList];
    arr.forEach((item, index) => {
      if (e.target.dataset.id == item.id) {
        item.active = !item.active;
      }
    })
    this.setData({
      signList,
    })
    this.makesignlist()
  },

  makesignlist(e) {
    let signList = this.data.signList
    let sign = []
    signList.forEach((item, index) => {
      if (item.active == true) {
        sign.push(item.signId)
      }
    })
    console.log(sign)
    this.setData({
      sign: sign
    })
  },

  bindSign: function (e) {
    this.setData({
      mySign: e.detail.value
    })
  },

  sureSign: function (e) {
    if (this.data.mySign.length == 0) {
      wx.showToast({
        icon: "error",
        title: '内容不能为空！',
      })
    } else {
      let signList = this.data.signList
      let id = signList.length + 10
      let sign = this.data.sign
      sign.push(this.data.mySign)
      let obj = {
        id: id,
        signName: this.data.mySign,
        active: true
      }
      console.log(obj);
      signList.push(obj)
      this.setData({
        signList: signList,
        sign: sign,
        placeholder: '输入文本内容',
        mySign: ''
      })
    }
  },

  // 标题的值
  bindTitle(e) {
    console.log(e);
    this.setData({
      title: e.detail.value
    })
  },

  //  描述文本域
  bindArea(e) {
    if (this.data.topNavId === 0) {
      this.setData({
        articleDescption: e.detail.value
      })
    } else if (this.data.topNavId === 1) {
      this.setData({
        vDetail: e.detail.value
      })
    } else if (this.data.topNavId === 2) {
      this.setData({
        tDetail: e.detail.value
      })
    }
  },

  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },

  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const {
      windowHeight,
      platform
    } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({
      editorHeight,
      keyboardHeight
    })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const {
      statusBarHeight,
      platform
    } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({
      formats
    })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.setData({
          imgType: 2
        })
        that.insertFile(res.tempFilePaths)
        // that.editorCtx.insertImage({
        //   src: res.tempFilePaths[0],
        //   data: {
        //     id: 'abcd',
        //     role: 'god'
        //   },
        //   width: '80%',
        //   success: function () {
        //     console.log('insert image success')
        //   }
        // })
      }
    })
  },
  input(e) {
    console.log(e.detail.html);
    this.setData({
      editorData: e.detail.html
    })
  },

  check() {
    const that = this
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
          } else {}
        }
      }
    })
  },

  // 发布内容
  sumbit() {
    if (this.data.topNavId === 0) {
      this.putArticle()
    } else if (this.data.topNavId === 1) {
      this.putVideo()
    } else if (this.data.topNavId === 2) {
      this.putTopic()
    }

  },

  // 发布普通文章
  putArticle() {
    const articleSign = this.data.articleSign
    const that = this
    if (this.data.articleCover.length === 0 || this.data.sign.length === 0 || this.data.title.length === 0 || this.data.original.length === 0) {
      wx.showToast({
        title: '内容未填写完整！',
        icon: 'error'
      })
    } else {
      if (articleSign === '图片') {
        wx.showLoading({
          title: '上传中',
        })
        this.putImageArr()
        setTimeout(res => {
          insertArticle({
            articleCover: that.data.articleCover, //封面
            signIdList: that.data.sign, //标签
            articleDescption: that.data.articleDescption,
            original: that.data.original, //图片描述
            picture: that.data.imageList,
            title: that.data.title,
            userId: wx.getStorageSync('userId'),
            articleSign: '图片'
          }).then(res => {
            console.log(res);
            wx.showToast({
              title: '投稿成功',
              icon: 'success'
            })
            setTimeout(res => {
              wx.reLaunch({
                url: '../add/add',
              })
            }, 1500)
          }).catch(error => {
            console.log('error', error);
          })
        }, 500)
      } else if (articleSign === '富文本') {
        console.log(that.data.articleCover);
        console.log(that.data.title);
        console.log(that.data.editorData);
        console.log(that.data.sign);
        putArticle({
          articleCover: that.data.articleCover,
          signIdList: that.data.sign,
          context: that.data.editorData,
          title: that.data.title,
          userId: wx.getStorageSync('userId'),
          articleSign: '富文本'
        }).then(res => {
          console.log(res);
          wx.showToast({
            title: '投稿成功',
            icon: 'success'
          })
          setTimeout(res => {
            wx.reLaunch({
              url: '../add/add',
            })
          }, 1500)
        }).catch(error => {
          console.log('error', error);
        })
      }
    }
  },

  // 上传图片组
  putImageArr() {
    this.setData({
      imgType: 3
    })
    console.log(this.data.images);
    const images = this.data.images
    images.forEach(item => {
      const arr = []
      arr.push(item)
      this.insertFile(arr)
    })
  },

  // 发布视频
  putVideo() {
    if (this.data.vDetail.length === 0 || this.data.title.length === 0 || this.data.videoUrl === null) {
      wx.showToast({
        title: '内容未填写完整！',
        icon: 'error'
      })
    } else {
      insertArticleVideo({
        "articleSign": "视频",
        "description": this.data.vDetail,
        "original": this.data.original,
        "title": this.data.title,
        "userId": wx.getStorageSync('userId'),
        "videoUrl": this.data.VedioUrl
      }).then(res => {
        wx.showToast({
          title: '投稿成功',
          icon: 'success'
        })
        setTimeout(res => {
          wx.reLaunch({
            url: '../add/add',
          })
        }, 1500)
      }).catch(error => {
        console.log(error);
      })
    }
  },

  // 发布话题
  putTopic() {
    if (this.data.articleCover.length === 0 || this.data.tDetail.length === 0 || this.data.title.length === 0) {
      wx.showToast({
        title: '内容未填写完整！',
        icon: 'error'
      })
    } else {
      home({
        desciption: this.data.tDetail,
        icon: this.data.articleCover,
        name: this.data.title,
        ownerId: wx.getStorageSync('userId'),
      }).then(res => {
        wx.showToast({
          title: '投稿成功',
          icon: 'success'
        })
        setTimeout(res => {
          wx.reLaunch({
            url: '../add/add',
          })
        }, 1500)
      }).catch(error => {
        console.log(error);
      })
    }
  },

  // 选择视频
  chooseVideo: function () {
    var _this = this;
    wx.chooseVideo({
      success: function (res) {
        // _this.setData({
        //   src: res.tempFilePath,
        // })
        // const arr = []
        // arr.push(res.tempFilePath)
        // _this.putVideoUrl(res.tempFilePath)
        _this.uploadvideo(res.tempFilePath)
      }
    })
  },

  // 视频上传网易云接口
  putVideoUrl(data) {
    console.log(data);
    putVideo({
      FilePath: data
    }).then(res => {
      console.log(res);
    }).catch(error => {
      console.log(error)
    })
  },

  //  上传视频 目前后台限制最大100M, 以后如果视频太大可以选择视频的时候进行压缩
  uploadvideo: function (data) {
    // var src = this.data.src;
    const that = this
    wx.showLoading({
      title: '上传中',
    })
    wx.uploadFile({
      url: `${baseUrl}/video`,
      name: 'FilePath',
      filePath: data,
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: function (res) {
        var obj = JSON.parse(res.data)
        console.log(obj)
        that.setData({
          VedioUrl: obj.origUrl,
          src: data,
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

  // 长按删除视频
  deleteVideo() {
    var that = this;
    var src = that.data.src;
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          src = ''
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          src: src
        });
      }
    })
  },

  // 九宫格拖拽
  // 计算图片宽度
  _handleComputedImage: function (e) {
    const windowWidth = app.globalData.systemInfo.windowWidth;
    const width = windowWidth - 16;
    const imageWitdh = (width - 16) / 3;
    this.setData({
      imageWitdh
    })
  },

  // 选择图片
  handleChooseImage: function (e) {
    let length = this.data.images.length;
    if (length == 9) {
      wx.showToast({
        title: "您最多只能选择九张图哦！",
        icon: "none",
        duration: 2000
      })
      return false;
    }
    var that = this;
    wx.chooseImage({
      count: 9 - this.data.images.length,
      sizeType: ['compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        let images = that.data.images;
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          images.push(res.tempFilePaths[i]);
        }
        that.setData({
          images
        }, function () {
          //上传完之后更新面积
          that._handleComputedArea();
        });

      },
      fail: err => console.log(err)
    })
  },

  // 预览图片
  handlePreview: function (e) {
    let index = e.target.dataset.index;
    let images = this.data.images;
    wx.previewImage({
      current: images[index], //当前预览的图片
      urls: images, //所有要预览的图片数组
    })
  },

  // 删除图片
  handleDelete: function (e) {
    let index = e.target.dataset.index;
    let images = this.data.images;
    images.splice(index, 1);
    this.setData({
      images
    }, function () {
      this._handleComputedArea();
    });
  },

  // 计算movable-area的高度
  _handleComputedArea: function (e) {
    let that = this;
    wx.createSelectorQuery().selectAll('.image-choose-container').boundingClientRect(function (rect) {
      that.setData({
        areaHeight: rect[0].height
      })
    }).exec()
  },

  // 计算每张图片的坐标
  _handleComputedPoints(e) {
    let that = this;
    var query = wx.createSelectorQuery();
    var nodesRef = query.selectAll(".image-item");
    nodesRef.fields({
      dataset: true,
      rect: true
    }, (result) => {
      that.setData({
        pointsArr: result
      })
    }).exec()
  },

  // 长按图片
  handleLongTap: function (e) {
    // 计算每张图片的坐标
    this._handleComputedPoints();
    this.setData({
      currentImg: e.currentTarget.dataset.url,
      currentIndex: e.currentTarget.dataset.index,
      hidden: false,
      flag: true,
      x: e.currentTarget.offsetLeft,
      y: e.currentTarget.offsetTop
    })
  },

  // 移动的过程中
  handleTouchMove: function (e) {
    let x = e.touches[0].pageX;
    let y = e.touches[0].pageY;
    // 首先先获得当前image-choose-container距离顶部的距离
    let that = this;
    wx.createSelectorQuery().selectAll('.image-choose-container').boundingClientRect(function (rect) {
      let top = rect[0].top;
      y = y - that.data.scrollTop - top;
      that.setData({
        // x: x - that.data.imageWitdh / 2 > 0 ? x - that.data.imageWitdh / 2:0,
        // y: y - that.data.imageWitdh / 2 > 0 ? y - that.data.imageWitdh / 2:0,
        x: x,
        y: y,
      })

    }).exec()
  },

  // 移动结束的时候
  handleTouchEnd: function (e) {
    if (!this.data.flag) {
      // 非长按情况下
      return;
    }
    let x = e.changedTouches[0].pageX;
    let y = e.changedTouches[0].pageY - this.data.scrollTop;
    const pointsArr = this.data.pointsArr;
    let data = this.data.images;
    for (var j = 0; j < pointsArr.length; j++) {
      const item = pointsArr[j];
      console.log(item);
      if (x > item.left - 105 && x < item.right + 95 && y > item.top && y < item.bottom) {
        const endIndex = item.dataset.index;
        const beginIndex = this.data.currentIndex;
        //临时保存移动的目标数据
        let temp = data[beginIndex];
        //将移动目标的下标值替换为被移动目标的下标值
        data[beginIndex] = data[endIndex];
        //将被移动目标的下标值替换为beginIndex
        data[endIndex] = temp;
      }
    }
    this.setData({
      images: data,
      hidden: true,
      flag: false,
      currentImg: ''
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 计算图片
    this._handleComputedImage();
  },

  // 监听滚动
  onPageScroll: function (e) {
    this.data.scrollTop = e.scrollTop;
  }
})