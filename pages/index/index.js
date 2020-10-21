//index.js
//获取应用实例
import request from '../../request/index'

Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    floorList: []
  },
  onLoad: function() {
    this.getSwiperList()
    this.getCatesList()
    this.getFloorList()
  },
  async getSwiperList() {
  //  wx.request({
  //    url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
  //    methods: 'GET', // 默认就是,可以不写
  //    dataType: 'json', // 也是默认
  //    success: res => {
  //      console.log(res)
  //     if (res.data.meta.status !== 200) {
  //       console.log('获取轮播图失败')
  //       return
  //     }
  //     this.setData({
  //       swiperList: res.data.message
  //     })
  //    }
  //  }) 
    const params = {
      url: '/home/swiperdata'
    }
    const { data: res } = await request(params).catch(err => {
      console.log(err)
      return err
    })
    // console.log(res)
    if (!res) return console.log('连接错误1')
    if (res.meta.status !== 200) {
      return console.log('获取轮播图数据失败')
    }
    res.message.forEach(v=>v.navigator_url=v.navigator_url.replace('main','index'))
    
    this.setData({
      swiperList: res.message
    })
  // console.log(res)
  },
  getCatesList() {
    const params = {
      url: '/home/catitems'
    }
    request(params).then(res => {
      if (res.data.meta.status === 200) {
        res.data.message.some(item => {
          if (item.name === '分类') {
            item.navigator_url = '/pages/category/index'
            return true
          }
        })
        this.setData({
          catesList: res.data.message
        })
      }
    }).catch(e => e)
  },
  getFloorList() {
    const params = {
      url: '/home/floordata'
    }
    request(params).then(res => {
      if(res.data.meta.status === 200) {
        res.data.message.forEach(v =>{
          v.product_list.forEach(item => {
            item.navigator_url = item.navigator_url.replace('goods_list','goods_list/index')
          })
        })
        this.setData({
          floorList: res.data.message
        })
      }
    })
  }
})
