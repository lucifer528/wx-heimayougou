// pages/cart/cart.js
import { getSetting, chooseAddress, openSetting, showModal, showToast, test } from '../../utils/asyncWx'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data:{
    address: {},
    cartList: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onLoad() {
    // const cartList = wx.getStorageSync('cart') || []
    // this.setData({
    //   cartList
    // })
  },
  onShow() {
    const address = wx.getStorageSync('address')
    // const cartList = wx.getStorageSync('cart') || []
    // const allChecked = cartList.every(v=> v.checked === true)
    // 空数组调用 every 也是返回 true..some空数组会返回 false??
    // 效果都 一样..
    const cartList = wx.getStorageSync('cart') || []
    this.setData({address})
    // console.log(Object.keys(this.data.address).length===0)
    this.countTotal(cartList)
  },
  countTotal(cartList) {
    let totalPrice = 0
    let totalNum = 0
    // const cartList = wx.getStorageSync('cart') || []
    // const allChecked = cartList.length ? !cartList.some(v=> v.checked === false) : false 
    // 上面换到 map 里// 还是不换了
    let allChecked = true
    // this.setData({
    //   address, cartList, allChecked
    // })    
    cartList.map(item => {
      if (item.checked) {
        totalPrice += item.goods_price * item.num
        totalNum += item.num
       } else {
        allChecked = false
      }
    })
    if(cartList.length === 0) allChecked= false
    this.setData({
      cartList, allChecked,totalNum, totalPrice
    })
    wx.setStorageSync('cart', cartList)
  },
  handleCheck(e) {
    // console.log(e)
    // const cartList = wx.getStorageSync('cart') || []
    const cartList = this.data.cartList
    // const goods_id = e.detail.value[0]
    // MD 从这拿 id是真靠不住.还是要自定义个数据
    // 不然没选就没用打不到改哪个
    const goods_id = e.currentTarget.dataset.goods_id
    let checked = true
    if (!e.detail.value[0]){
      checked = false
    }
    // console.log(goods_id)
    cartList.some(item => {
      if(item.goods_id === goods_id) {
        item.checked = checked
        // console.log(item.checked)
        return true
      }
    })
    // console.log(cartList)
    this.setData({
      cartList
    })
    // wx.setStorageSync('cart', cartList)
    this.countTotal(cartList)
  },
  async handleItemNumEdit(e) {
    const {goods_id, operation} = e.currentTarget.dataset
    let {cartList} = this.data
    const index = cartList.findIndex(v=>v.goods_id === goods_id)
    if (cartList[index].num === 1 && operation === -1) {
      const res = await showModal({content:'你是否要删除'})
      if(res.confirm) cartList.splice(index, 1)
    } else {
      cartList[index].num += operation
    }
    // some 里传的回调用不了异步阿.用了就没反应..换个写法
    // this.data.cartList.some(async(item, i, arr) => {
    //   if (item.goods_id === goods_id){
    //     if (item.num === 1 && operation === -1){
    //       // wx.showModal({
    //       //   title: '提示',
    //       //   content: '你是否要删除',
    //       //   showCancel: true,
    //       //   cancelText: '取消',
    //       //   cancelColor: '#000000',
    //       //   confirmText: '确定',
    //       //   confirmColor: '#3CC51F',
    //       //   success: (result) => {
    //       //     if(result.confirm){
    //       //       arr.splice(i, 1)
    //       //       this.countTotal(arr) 
    //       //       // 这TM是个异步操作.本来不想加这句,直接不行.
    //       //       // 直接就执行外面的把没删的又存进去了
    //       //     } else if (result.cancel) {

    //       //     }
    //       //   }
    //       // })
    //       const res = await showModal({content:'你是否要删除'})
    //       if(res.confirm) arr.splice(i, 1)
    //     } else {
    //       item.num += operation
    //     }
    //     return true
    //   }
    // })
    // console.log(this.data.cartList)
    // wx.setStorageSync('cart', this.data.cartList)
    this.countTotal(cartList)
  },
  switchChange(e){
    const allChecked = e.detail.value
    const cartList = this.data.cartList
    cartList.forEach(item => {
      // if(allChecked) {
      //   item.checked = true
      // } else {
      //   item.checked = false
      // }
      item.checked = allChecked
    })
    this.countTotal(cartList)
  },
  handleInput(e,d) {
    // console.log(e)
    // console.log(d)// MD,根本没有前一个值,不搞了,直接不让输
  },
  // 调用小程序内置 API 获取用户收货地址
  // 直接写,如果用户点错了没有授予权限的话.第二次再点也没用了
  async handleChooseAddress () {
    // const res = await test(2).catch(e => new Error('222'))
    // // catch(e => e) 原样返回..我返回的是数字就不是错误..
    // console.log(res instanceof Error)
    try {
      const { authSetting: {'scope.address': scopeAddress}} = await getSetting()
      if (scopeAddress === false) {
        await openSetting() 
      }
      let address = await chooseAddress()
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo
      // console.log(address)
      wx.setStorageSync('address', address)
    } catch (error) {
      console.log(error)
    }
    
    // wx.getSetting({
    //   success: (result)=>{
    //     const scopeAddress = result.authSetting['scope.address']
    //     if (scopeAddress === true || scopeAddress === undefined) {
    //       wx.chooseAddress({
    //         success: (result1)=>{
    //           console.log(result1)
    //         }
    //       });
    //     } else {
    //       // 用户以前拒观象台过授予权限
    //       wx.openSetting({
    //         success: (result2)=>{
    //           wx.chooseAddress({
    //             success: (result3) => {
    //               console.log(result3)
    //             }
    //           })
    //         }
    //       });
    //     }
    //   }
    // });
    // 获取用户权限状态 scope
    // 1. 假设用户点击 确定 authSetting scope.address= true
    //    scope 值为true
    // 2. 取消为 false
    // 3. 如果用户从未调用过收货地址的API ,值为 undefined
    // 1 和 3 都可以直接调用 获取收货地址
    // 2 的话要诱导用户自已打开 授权设置页面 ,让用户重新给予权限
    // 再调用API 获取收货地址

  },
  async handlePay() {
    const { address, totalNum } = this.data
    if(Object.keys(address).length === 0){
      await showToast({title: '您还没有选择收货地址'})
      return
    } else if(totalNum === 0) {
      await showToast({title: '您还没有选购商品'})
      return
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
})