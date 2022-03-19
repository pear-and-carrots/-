import WeAppRedux from './redux/index.js';
import createStore from './redux/createStore.js';
import reducer from './store/reducer.js';
import ENVIRONMENT_CONFIG from './config/envConfig.js'
import PAGE_CONFIG from './config/pageConfig.js'

const {
  Provider
} = WeAppRedux;
const store = createStore(reducer) // redux store
App(
  Provider(store)({
    onLaunch() {
      //获取设备信息
      this.getSystemInfo();

      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        }
      })

      // 验证用户信息
      if (wx.getStorageSync('userId').length === 0) {
        wx.navigateTo({
          url: '/home_page/login/login',
        })
      } else if (wx.getStorageSync('userId').length !== 0) {
        wx.request({
          url: 'https://www.haichuang8888.com:443/desgin/user/' + wx.getStorageSync('userId'),
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log('???????????', res);
            if (res.data.code == 200) {
              console.log(res.data.data);
              if (res.data.data.gender === null || res.data.data.gender.length === 0) {
                wx.reLaunch({
                  url: '/home_page/index/index',
                })
              } else if (res.data.data.name.length === 0 || res.data.data.photo === 0) {
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
      }
      if (wx.getStorageSync('history') == 0) {
        wx.setStorageSync('history', [])
      }

      let userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        this.globalData.userInfo = userInfo
      }
      let systemInfo = wx.getSystemInfoSync()
      this.globalData.videoContainerSize = {
        width: systemInfo.windowWidth,
        height: systemInfo.windowHeight
      }
      this.globalData.isPushBeCallPage = false
    },
    onShow(e) {
      if (e.scene == 1007 || e.scene == 1008) {
        try {
          this.globalData.netcall && this.globalData.netcall.destroy()
          this.globalData.nim && this.globalData.nim.destroy({
            done: function () {}
          })
        } catch (e) {}
      }
    },
    // 获得设备信息
    getSystemInfo: function () {
      let t = this;
      wx.getSystemInfo({
        success: function (res) {
          t.globalData.systemInfo = res
        },
        fail: function (err) {
          console.log(err)
        }
      });
    },
    globalData: {
      userInfo: null,
      // baseUrl: 'http://121.37.246.0:8099',
      baseUrl: 'https://www.haichuang8888.com:443/desgin',
      ws: 'wss://haichuang8888.com/insect',
      systemInfo: null, //客户端设备信息
      emitter: null,
      netcallController: null,
      ENVIRONMENT_CONFIG,
      PAGE_CONFIG
    }
  }))