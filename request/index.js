// 发送ajax的次数,好像还是个闭包引用
let ajaxTimes = 0
const request = (params) => {
  // 判断 url 中是否带有 /my/ 请求的是私有的路径, 带上header token
  // console.log(params.url)
  /* if (params.url.match(/\/my\//)) {
    const token = wx.getStorageSync('token');
    params.header = {
      Authorization: token 
    }
    // console.log('加上请求头')
    // console.log(token)
  } */ // 我感觉我上面自已写的也行
  let header = {...params.header}
  if (params.url.includes('/my/')) {
    header['Authorization'] = wx.getStorageSync('token')
  }

  ajaxTimes ++
  wx.showLoading({
    title: '加载中',
    mask: true,
  })
  return new Promise((resolve, reject) => {
    const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
    wx.request({
      ...params,
      header: header,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        ajaxTimes --
        if (ajaxTimes === 0) {
          wx.hideLoading();
        }
      }
    })
  })
}

export default request 