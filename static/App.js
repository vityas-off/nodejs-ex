new Vue ({
  el: '#app',
  data() {
    return {
      input: '',
      mongoAnswer: 'хуй'
    }
  },
  methods: {
    getMovies() {
      if (this.input.length < 1) {
        this.mongoAnswer = 'хуй'
        return
      }
      this.$http.get(`/q?name=${this.input}`)//
        .then(res => {
          this.mongoAnswer = res.body
        })
    }
  }
})
