// pages/goods_detail/goods_detail.js
import request from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    goodsObj: {},
    isCollect: false
  },
  goods_id: 0,
  goodsInfo: {},
  // onLoad: function(options) {
  //   this.goods_id = options.goods_id
  //   this.getGoodsDetail(this.goods_id)
  // },
  onShow: function() { // onshow里拿不到参数,到页面栈里拿
    let pages = getCurrentPages()
    let currentPage = pages[pages.length-1]
    let options = currentPage.options
    const { goods_id } = options
    this.getGoodsDetail(goods_id)
    // 缓存中的商品收藏
    let collect = wx.getStorageSync('collect') || []
    let isCollect = collect.some(v => v.goods_id == goods_id)
    this.setData({
      isCollect
    })
  },
  async getGoodsDetail(goods_id) {
    const { data: res } = await request({
      url: '/goods/detail',
      data: { goods_id }
    }).catch(e => e)
    if (!res) return console.log('商品详情获取出错')
    if (res.meta.status !== 200) {
      console.log('商品详情获取失败:' + res.meta.msg)
      return
    }
    console.log(res)
    const goodsObj = res.message
    this.goodsInfo = goodsObj
    this.setData({
      // goodsObj: res.message
      // 优化页面数据大小
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_introduce: goodsObj.goods_introduce,
        pics: goodsObj.pics
      }
    })
  },
  handlePrevewImage(e) {
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current: current,
      urls: urls
    });
  },
  handleCartAdd() {
    let cart = wx.getStorageSync('cart') || []
    let index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id)
    if(index === -1) {
      let cartItem = {
        // goods_id: this.goodsInfo.goods_id,
        ...this.goodsInfo,
        num: 1,
        checked: true
      }
      cart.push(cartItem)
      wx.setStorageSync('cart', cart);
    } else {
      cart[index].num += 1
      wx.setStorageSync('cart', cart)
    }
    // console.log(cart)
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    })
  },
  handleCollect() {
    let isCollect = this.data.isCollect
    let collect = wx.getStorageSync('collect') || []
    isCollect = !isCollect
    if (isCollect) {
      collect.push(this.goodsInfo)
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    } else {
      collect.some((item, i) => {
        if (item.goods_id === this.goodsInfo.goods_id) {
          collect.splice(i, 1)
          return true
        }
      })
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      })
    }
    wx.setStorageSync('collect', collect)
    this.setData({
      isCollect
    })
  }
})