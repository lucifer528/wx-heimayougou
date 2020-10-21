// pages/auth/auth.js
import request from '../../request/index'
import { login } from '../../utils/asyncWx'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  async handleGetUserInfo(e) {
    // console.log(e)
    const errMsg = e.detail.errMsg
    const { encryptedData, rawData, iv, signature } = e.detail
    // const { code } = await login()
    const loginRes = await login()
    const code = loginRes.code
    const loginParams = { encryptedData, rawData, iv ,signature, code}
    // 没有企业级ID 拿 不到数据token null..艹
    const res = await request({
      url: 'users/wxlogin',
      data: loginParams,
      methods: 'POST'
    })
    // 没有token...他这后端就没给发阿.艹
    // 自已瞎写一个,本来是在上面的res 里
    const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
    wx.setStorageSync('token',token)
    wx.navigateBack({
      delta: 1
    });
    console.log(res)
    console.log(loginRes)
    // console.log(errMsge)
    if (errMsg.match(/fail/)) {
      console.log('1111')
    } else {
      console.log('222')
    }
  }
})