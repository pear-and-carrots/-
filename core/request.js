const request = (options) => {
  return new Promise((resolve, reject) => {
    const {
      url,
      data,
      method
    } = options 
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      ...options, 
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        let result = res.data
        if (result.code === 200) {
          resolve(result.data)
        } else {
          reject(result.data)
        }
        wx.hideLoading()
      },
      fail: function (error) {
        reject(error)
        wx.hideLoading()
        wx.showToast({
          icon:'none',
          title: '您的网络不佳！',
        })
      }
    })
  })
}
export default request