// pages/search/search.js
import request from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    searchList: [],
    isFocus: false,
    inpValue: ''
  },
  TimeId: -1,
  handleInput(e) {
    // console.log(e)
    const { value } = e.detail
    clearTimeout(this.TimeId) // 防抖
    if(!value.trim()){
      this.setData({
        isFocus: false,
        searchList: []
      })
      return
    } 
    this.setData({
      isFocus: true
    })
    // clearTimeout(this.TimeId) // 防抖
    this.TimeId = setTimeout(() => {
      this.qsearch(value)
    }, 1000);
  },
  async qsearch(query) {
    const { data: res } =await request({
      url: '/goods/qsearch',
      data: {query}
    })
    console.log(res)
    if (!res) return console.log('搜索网络出错')
    if (res.meta.status !== 200) {
      console.log("搜索请求出错")
    }
    this.setData({
      searchList: res.message
    })
  },
  handleCancel() {
    this.setData({
      isFocus: false,
      searchList: [],
      inpValue: ''
    })
  }

})