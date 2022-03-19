Component({
  properties: {

  },
  data: {
    searchText: ''
  },
  methods: {
    input(e) {
      let searchText = e.detail.value
      this.triggerEvent('searchText', searchText)
    },
    search (e) {
      let search = true
      this.triggerEvent('search', search)
    }
  }
})