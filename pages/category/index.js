// pages/category/category.js
import request from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [],
    rightContent: [],
    currentIndex: 0,
    scrollTop: 0,
  },
  catesList: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const Cates = wx.getStorageSync('cates')
    if (!Cates) {
      // 不存在旧数据
      this.getCates()
    } else {
      // 有旧数据 定义过期时间 这里,20s
      if (Date.now() - Cates.time > 1000 * 20) {
        this.getCates()
      } else {
        console.log('使用旧数据')
        this.catesList = Cates.data
        const leftMenuList = this.catesList.map(item => item.cat_name)
        const rightContent = this.catesList[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  getCates() {
    console.log('发送请求')
    request({
      url: '/categories'
    }).then(res => {
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.catesList = res.data.message
        // 微信本地存储
        wx.setStorageSync('cates', {
          time: Date.now(),
          data: this.catesList
        })
        const leftMenuList = this.catesList.map(item => item.cat_name)
        const rightContent = this.catesList[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    })
  },
  menuChange(e) {
    // console.log(e)
    const index = e.currentTarget.dataset.index
    this.setData({
      currentIndex: index,
      rightContent: this.catesList[index].children,
      // 重新设置 scrollTop 右侧内容 scroll-view 距离顶部的距离
      scrollTop: 0
    })

  }
})