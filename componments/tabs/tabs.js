// componments/tabs/tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsList: Array,
    tabs: {
      type: Array,
      value: [
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
      ]
    }/* ,
    bindtabsItemChange: {
      type: String,
      value: ''
    } */
    // 不能这么用阿..这样绑定的事件好像没了.触发不了了
  },
  /**
   * 组件的初始数据
   */
  data: {
    // tabsDefault:,
    sortFlag: 0, // 0 未排序,1 升序, 2.降序
    listASCE: []
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tabClick(e) {
      const id = e.currentTarget.dataset.id
      this.triggerEvent('tabsItemChange', { id })
      let tabs = this.data.tabs
      tabs.forEach(item => {
        if (item.id === id) {
          item.isActive = true
        } else {
          item.isActive = false
        }
      })
      this.setData({
        tabs
      })
      // if (this.data.bindtabsItemChange !== '') {
      //   this.triggerEvent('tabsItemChange', { id })
      //   return
      // } // 上面这个IF 行不通..艹
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
      // if (id === 2) {
      //   if (this.data.listASCE.length === 0){ // 还没有升序数组
      //     let list = JSON.parse(JSON.stringify(this.data.goodsList))
      //     list.sort((x, y) => x.goods_price - y.goods_price)
      //     console.log(list)
      //     this.setData({
      //       listASCE: list,
      //       goodsList: list
      //     })
      //   } else {
      //     this.data.listASCE.reverse()
      //     this.setData({
      //       goodsList: this.data.listASCE
      //     })
      //   }
      // }
    }
  }
})
