// pages/cart/cart.js
/*
1. 微信支付
 - 哪些人哪些帐号可以实现微信支付
   + 企业帐号
   + 企业帐号的小程序后台中 必须 给开发者 添加上白名单
     - 一个 appid 可以同时绑定多个开发者
     - 这些开发者就可以公用这个 appid 和 它的开发权限
*/
import { requestPayment, getSetting, chooseAddress, openSetting, showModal, showToast, test } from '../../utils/asyncWx'
import regeneratorRuntime from '../../lib/runtime/runtime'
import request from '../../request/index'
Page({
  data:{
    address: {},
    cartList: [],
    totalPrice: 0,
    totalNum: 0
  },
  onLoad() {

  },
  onShow() {
    const address = wx.getStorageSync('address')
    const cartList = wx.getStorageSync('cart') || []
    let checkedCart = cartList.filter(v => v.checked)
    this.setData({address})
    this.countTotal(checkedCart)
  },
  countTotal(cartList) {
    let totalPrice = 0
    let totalNum = 0

    cartList.map(item => {
      totalPrice += item.goods_price * item.num
      totalNum += item.num
    })
    this.setData({
      cartList, totalNum, totalPrice
    })
    wx.setStorageSync('cart', cartList)
  },

  async handleOrderPay() {
    try {
      const token = wx.getStorageSync('token')
      if(!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        })
        return
      } 
      // 拿到token,创建订单
      // const header = { Authorization: token }
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.address
      const cartList = this.data.cartList
      let goods = []
      cartList.forEach(v => {
        goods.push({
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.goods_price
        })
      })
      const orderParams = { order_price, consignee_addr, goods }
      // 4.发送请求 创建订单, 获取订单编号
      const res = await request({
        url: '/my/orders/create',
        methods: 'POST',
        data: orderParams
      })
      console.log('前面没加请求头')
      // 用评论的 token 没用艹 ,返回 null
      // 本来要返回一个订单的.,里面有订单编号
      // console.log(res)
      // 5. 发起预支付接口
      const { pay } = await request({
        url: '/my/orders/req_unifiedorder',
        methods: 'POST',
        data: {order_number: 'HMDD20190802000000000422'}
      })
      // console.log(pay) 拿不到拿不到..
      // 6.发起微信支付
      const payRes = await requestPayment(pay);
      // 看这个的结果也能看到支付的一些情况,但是也不太准?.
      // 自已再查后台.所以视频里没赋值,直接 await
      // 7.查询后出风口 订单状态
      const orderStatusRes = await request({
        url: '/my/orders/chkOrder',
        methods: 'POST',
        data: {order_number: 'HMDD20190802000000000422'}
      })
      await showToast({title: '支付成功'})
      // 然后 1. 手动删除缓存中已经被选中了的商品
      // 2. 删除后的购物车数据填充回缓存
      // 3. 再跳转页面
      let newCart = wx.getStorageSync('cart')
      newCart = newCart.filter(v => !v.checked)
      wx.setStorageSync('cart', newCart);

      // 8. 支付成功,跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      })
      
    } catch(error) {
      await showToast({title: '支付失败'})
      console.log(error)
    }
  }

})
// 微信支付
// wx.requestPayment({
//   timeStamp: '',
//   nonceStr: '',
//   package: '',
//   signType: '',
//   paySign: '',
//   success: (result)=>{
    
//   },
//   fail: ()=>{},
//   complete: ()=>{}
// });