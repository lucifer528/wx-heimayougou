// pages/feedback/feedback.js
Page({
  data:{
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品,商家投诉',
        isActive: false
      }
    ],
    ImgsList: [],
    chooseImgs: [],
    textVal: ''
  },
  UploadImgs: [], // 外网的图片的路径数组
  handleChooseImage() {
    console.log('111')
    // 调用小程序内程的选择图片 API
    wx.chooseImage({
      // 同时选中的图片数量
      count: 9,
      // 图片的格式, 原图 压缩
      sizeType: ['original','compressed'],
      // 图片的来源 相册 照相机
      sourceType: ['album','camera'],
      success: (result)=>{
        console.log(result)
        this.setData({
          chooseImgs: [...result.tempFilePaths],
          // 下面这句(我自已写的)没用.因为就算是同一张图的值也是不一样的,
          // 所以去不了重.但是不会报错,可以这么写..不改了
          ImgsList: Array.from(new Set([...this.data.ImgsList, ...result.tempFilePaths]))
        })
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  handleRemoveImg(e) {
    // console.log(e)
    const { index } = e.currentTarget.dataset
    let ImgsList = this.data.ImgsList
    ImgsList.splice(index, 1)
    this.setData({
      ImgsList
    })
  },
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  handleFormSubmit() {
    const {textVal, ImgsList} = this.data
    if (!textVal.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });
      return
    }
    // 准备上传图片 到专门的图片服务器
    // 这里用内置的API
    // 这个API 不支持 多个文件同时上传, 遍历数组 挨个上传
    wx.showLoading({
      title: '正在上传中',
      mask: true,
    });
    
    // 判断有没有需要上传的图片数组
    if (ImgsList.length !== 0) {
      ImgsList.forEach(async (v, i) => {
        let res
        console.log(v)
        await new Promise((resolve, reject)=> {
          wx.uploadFile({
            // 图片要上传到哪里
            url: 'https://img.coolcr.cn/api/upload',
            // 传个屁阿.视频里的网站不能用了,我写这个不知道怎么调API
            // 现在这个用的评论区给的..下面name 改成 image
            // 好像他自已搭的..不能用来生产环境
            // http://img.coolcr.cn/index/api.html

            // 被上传的文件的路径
            filePath: v,
            // 上传的文件的名称,后台来获取文件 file
            // 原名是 file
            name: 'image',
            // 顺带的文本信息
            formData: {},
            success: (result)=>{
              console.log(result)
              console.log(result.data)
              res = JSON.parse(result.data)
              resolve()
            },
            fail: ()=>{},
            complete: ()=>{}
          });
        }) 
        // 后面这段本来是写在 success里面的,也更好理解,还不用 async await
        console.log(res.data.url)
        this.UploadImgs.push(res.data.url)
        if(i === ImgsList.length-1) {
          wx.hideLoading()
          console.log('把文本的内容和外网的图片数组提交到后台中')
          this.setData({
            textVal: '',
            ImgsList: []
          })
          // 返回上个页面
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } else {
      console.log('只是提交了文本')
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
    }
  }
})