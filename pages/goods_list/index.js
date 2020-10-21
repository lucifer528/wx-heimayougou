// pages/goods_list/goods_list.js
import request from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    goodsList: [],
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    listASCE: []
  },
  queryInfo: {
    query: '',
    cid: '',
    pagenum: 1 ,
    pagesize: 10 
  },
  // 总页数
  totalPages: 1,
  // currentPage: 1,
  onLoad: function(options) {
    const cid = options.cid
    this.queryInfo.cid = cid || ''
    this.queryInfo.query = options.query || ''
    // this.setData({ //换了写法. queryInfo.没写到data里的
    //   queryInfo: this.data.queryInfo
    // })
    this.getGoodsList()
  },
  onReachBottom: function() {
    if (this.totalPages > this.queryInfo.pagenum) {
      this.queryInfo.pagenum += 1
      this.getGoodsList()
    } else {
      // console.log('没有更多的数据了')
      wx.showToast({
        title: '没有下一页数据了',
        icon: 'none',
        image: '',
        duration: 1500,
      });
    }
  },
  async onPullDownRefresh() {
    this.queryInfo.pagenum = 1
    // this.data.goodsList = []
    this.setData({
      goodsList: []
    })
    await this.getGoodsList()
    wx.stopPullDownRefresh()
  },
  async getGoodsList() {
    const { data: res } = await request({
      url: '/goods/search',
      data: this.queryInfo
    }).catch(e => e)
    // console.log(res)
    if (!res) return console.log('商品列表获取网络错误')
    if (res.meta.status !== 200) {
      console.log(res.meta.msg)
      return
    }
    // 计算总页数
    const total = res.message.total
    this.totalPages = Math.ceil(total / this.queryInfo.pagesize)
    // let goodsList = this.data.goodsList.concat(res.message.goods)
    // MD用...扩展运算符 竟然开始没想到.艹了
    this.setData({
      goodsList: [...this.data.goodsList, ...res.message.goods]
    })
  },
  handleTabsItemChange(e) {
      const id = e.detail.id
      // let tabs = this.data.tabs
      // tabs.forEach(item => {
      //   if (item.id === id) {
      //     item.isActive = true
      //   } else {
      //     item.isActive = false
      //   }
      // })
      // this.setData({
      //   tabs
      // })
      if (id === 2) {
        if (this.data.listASCE.length === 0){ // 还没有升序数组
          let list = JSON.parse(JSON.stringify(this.data.goodsList))
          list.sort((x, y) => x.goods_price - y.goods_price)
          console.log(list)
          this.setData({
            listASCE: list,
            goodsList: list
          })
        } else {
          this.data.listASCE.reverse()
          this.setData({
            goodsList: this.data.listASCE
          })
        }
      }
  }
})