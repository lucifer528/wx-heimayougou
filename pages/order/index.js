// pages/order/order.js
import request from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false
      }
    ],
    orders: [],
    goodsList: []
  },
  // onLoad(options) {
  //   console.log(options)
  // },
  onShow(options) {
    // console.log(options) // 这么拿拿不到
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return
    }
    // 1 获取当前的小程序的页面栈- 数组 长度最大是10页面
    // 2 数组中 索引最大的页面就是当前的页面
    let pages = getCurrentPages()
    let currentPage = pages[pages.length-1]
    // console.log(currentPage.options)
    const { type } = currentPage.options
    this.changeTitleByIndex(type-1)
    // type 原先好像不是数值类型..单独用的话要转一下
    this.getOrders(type)
  },
  async getOrders(type) {
    const {data: res} = await request({
      url: '/my/orders/all',
      data: {
        type
      }
    })
    console.log(res)
    if (!res) return console.log('获取订单列表网络错误')
    if (res.meta.status !== 200) {
      console.log('获取订单失败')
      return
    }
    const orders = res.message.orders
    let goodsList = []
    orders.forEach((item) => {
      goodsList.push(item.goods[0])
    })
    this.setData({
      goodsList
    })
    this.setData({
      orders: res.message.orders.map(v => {
        return {
          ...v,
          create_time_cn: (new Date(v.create_time*1000).toLocaleString())
        }
      })
    })
  },
  handleTabsItemChange(e) {
    // console.log(e.detail.id)
    const index = e.detail.id
    // this.changeTitleByIndex(index) // 变下划线我组件里写过一次了不写了
    // 重新发送请求 type=1 index=0
    this.getOrders(index + 1)
  },
  changeTitleByIndex(index) {
    let tabs = this.data.tabs
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  }
})