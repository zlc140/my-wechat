//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('product')
      .where({
        // price: _.gt(10)
      })
      .limit(10)
      .get({
        success: function (res) {
          // 输出 [{ "title": "The Catcher in the Rye", ... }]
          console.log(res)
        },
        complete: function(res) {
          console.log(res, 'complete')
        },
        fail: function(res) {
          console.log(res, 'fail')
        }
      }) 
    console.log(db)
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  uploadImg() {
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        // 上传到云服务器
        wx.cloud.uploadFile({
          cloudPath: 'example.png',
          filePath: tempFilePaths[0], // 文件路径
          success: res => {
            // get resource ID
            console.log(res.fileID)
          },
          fail: err => {
            console.log(err,'err')
            // handle error
          }
        })
      }
    })
  }
})
