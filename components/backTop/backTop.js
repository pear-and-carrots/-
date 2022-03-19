Component({
  properties: {

  },
  data: {

  },
  methods: {
    handleBackTop() {
      wx.pageScrollTo({
        scrollTop: 0,
      })
    }
  }
})