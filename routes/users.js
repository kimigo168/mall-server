const express = require('express')
const router = express.Router()
const Users = require('../models/users')
require('../utils/util')

// get users list
router.get('/', (req, res, next) => {
  res.send('respond with a resource')
})

router.get('/test', (req, res, next) => {
  res.send('test')
})

// login
router.post('/login', (req, res, next) => {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  Users.findOne(param, (err, doc) => {
    if (err) {
      res.json({ status: '1', msg: err.message })
    } else {
      if (doc) {
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })

        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      }
    }
  })
})

// logout
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.json({ status: '0', msg: '退出登录', result: ''})
})

// 校验登录
router.get('/checkLogin', (req, res, next) => {
  if (req.cookie.userId) {
    res.json({ status: '0', msg: '', result: req.cookies.userName || ''})
  } else {
    res.json({ status: '1', msg: '未登录', result: ''})
  }
})

// 查询购物车数据
router.get('/cartList', (req, res, next) => {
  let userId = req.cookies.userId
  Users.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({ status: '1', msg: err.message, result: '' })
    } else {
      if (doc) {
        res.json({ status: '0', msg: '', result: doc.cartList })
      }
    }
  })
})

// 删除购物车
router.post('/cartDelete', (req, res, next) => {
  let userId = req.cookies.userId
  let productId = req.body.productId
  Users.update({ userId: userId }, {
    $pull: {
      cartList: {
        productId: productId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({ status: '1', msg: err.message, result: '' })
    } else {
      res.json({ status: '0', msg: '', result: 'success'})
    }
  })
})

// 修改购物车商品数量
router.post('cartEdit', (req, res, next) => {
  let userId = req.cookies.userId
  let productId = req.body.productId
  let productNum = req.body.productNum
  let checked = req.body.checked

  Users.update({ 'userId': userId, 'cartList.productId': productId }, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, (err, doc) => {
    if (err) {
      res.json({ status: '1', msg: err.message, result: ''})
    } else {
      res.json({ status: '0', msg: '', result: 'suc'})
    }
  })
})

// 编辑全部选中与否
router.post('/editCheckAll', (req, res, next) => {
  let userId = req.cookies.userId
  let checkAll = req.body.checkAll ? '1' : '0'

  Users.findOne({ userId: userId }, (err, user) => {
    if (err) {
      res.json({ status: '1', msg: err.message, result: ''})
    } else {
      if (user) {
        user.cartList.map((item) => {
          item.checked = checkAll
        })
        user.save((err1, doc) => {
          if (err1) {
            res.json({ status: '1', msg: err1.message, result: ''})
          } else {
            res.json({ status: '0', msg: 'suc', result: ''})
          }
        })
      }
    }
  })
})

// 查询用户地址
router.get('/addressList', (req, res, next) => {
  let userId = req.cookies.userId
  Users.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({ status: '1', msg: err.message, result: ''})
    } else {
      res.json({ status: '0', msg: '', result: doc.addressList })
    }
  })
})

// 设置默认地址
router.get('setDefault', (req, res, next) => {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  if (!addressId) {
    res.json({ status: '1003', msg: 'address is null', result: ''})
  } else {
    Users.findOne({ userId: userId}, (err, doc) => {
      if (err) {
        res.json({ status: '1', msg: err.message, result: ''})
      } else {
        let addressList = doc.addressList
        addressList.map((item) => {
          if (item.addressId === addressId) {
            item.isDefault = true
          } else {
            item.isDefault = false
          }
        })

        doc.save((err1, doc1) => {
          if (err1) {
            res.json({ status: '1', msg: err1.message, result: ''})
          } else {
            res.json({ status: '0', msg: '设置成功', result: ''})
          }
        })
      }
    })
  }
})

// 删除地址
router.post('/delAddress', (req, res, next) => {
  let userId = req.cookies.userId
  let addressId = req.body.addressId

  Users.update({ userId: userId }, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({ status: '1', msg: err.message, result: ''})
    } else {
      res.json({ status: '0', msg: 'success', result: ''})
    }
  })
})

// 结算
router.post('/payMent', (req, res, next) => {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  let orderTotal = req.body.orderTotal

  Users.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({ status: '1', msg: err.message, result: ''})
    } else {
      let address = ''
      let goodsList = []
      // 获取当前用户地址信息
      doc.addressList.forEach((item) => {
        if (addressId == item.id) {
          address = item
        }
      })
      // 获取用户购物车的购买商品
      doc.cartList.filter((item) => {
        if (item.checked === '1') {
          goodsList.push(item)
        }
      })

      let platform = '622'
      let r1 = Math.floor(Math.random() * 10)
      let r2 = Math.floor(Math.random() * 10)

      let sysDate = new Date().format('yyyyMMddhhmmss')
      let createDate = new Date().format('yyyy-MM-dd hh:mm:ss')
      let orderId = platform + r1 + sysDate + r2
      let order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        createDate: createDate
      }
      doc.orderList.push(order)

      doc.save((err1, doc1) => {
        if (err1) {
          res.json({ status: '1', msg: err.message, result: ''})
        } else {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: orderTotal
            }
          })
        }
      })
    }
  })
})

// 获取订单信息
router.get('/orderDetail', (req, res, next) => {
  let userId = req.cookies.userId
  let orderId = req.param('orderId')
  
  Users.findOne({ userId: userId }, (err, userInfo) => {
    if (err) {
      res.json({ status: '1', msg: err.message, result: ''})
    } else {
      let orderList = userInfo.orderList
      if (orderList.length > 0) {
        let orderTotal = 0
        orderList.forEach((item) => {
          if (item.orderId == orderId) {
            orderTotal = item.orderTotal
          }
        })

        if (orderTotal > 0) {
          res.json({
            status: '1',
            msg: '',
            result: {
              orderId: orderId,
              orderTotal: orderTotal
            }
          })
        } else {
          res.json({ status: '120002', msg: '无此订单', result: ''})
        }

      } else {
        res.json({
          status: '120001',
          msg: '当前用户未创建订单',
          result: ''
        })
      }
    }
  })
})

module.exports = router