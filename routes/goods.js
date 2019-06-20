const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Goods = require('../models/goods')
const Users = require('../models/users')

// connect db
mongoose.connect('mongodb://127.0.0.1:27017/mall')

let db = mongoose.connection;
db.on('connected', () => {
  console.log('MongoDB connected success')
})
db.on('error', () => {
  console.log('MongoDB connected fail')
})
db.on('disconnected', () => {
  console.log('MongoDB disconnected')
})

// search goods list
router.get('/list', (req, res, next) => {
  let pageNum = parseInt(req.param('pageNum'))
  let pageSize = parseInt(req.param('pageSize')) || 10
  let priceLevel = req.param('priceLevel') // 价格区间
  let sort = req.param('sort') // 排序
  
  let skip = (pageNum - 1) * pageSize
  let priceGt = ''
  let priceLte = ''
  let params = {}

  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0
        priceLte = 100
        break
      case '1':
        priceGt = 100
        priceLte = 500
        break
      case '2':
        priceGt = 500
        priceLte = 1000
        break
      case '3':
        priceGt = 1000
        priceLte = 5000
        break
    }

    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }

  Goods.find(params)
    .skip(skip)
    .limit(pageSize)
    .sort({'salePrice': sort})
    .exec((err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message
        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: {
            count: doc.length,
            list: doc
          }
        })
      }
    })
})

// add cart
router.post('/addCart', (req, res, next) => {
  let userId = '100000077' // 从cookie中拿到?
  let productId = req.body.productId
  Users.findOne({userId: userId}, (err, userDoc) => {
    if (err) {
      res.json({ status: '1', msg: err.message })
    } else {
      console.log('userDoc', userDoc)
      if (userDoc) {
        let goodsItem = null
        userDoc.cartList.map((item) => {
          if (item.productId === productId) {
            goodsItem = item
            item.productNum++
          }
        })

        if (goodsItem) { // 之前已添加
          userDoc.save((err2, doc2) => {
            if (err2) {
              res.json({ status: '1', msg: err2.message })
            } else {
              res.json({ status: '0', msg: '添加成功', result: 'success'})
            }
          })
        } else { // 之前未加入
          Goods.findOne({ productId: productId}, (err1, doc) => {
            if (err1) {
              res.json({ status: '1', msg: err1.message })
            } else {
              if (doc) {
                doc.productNum = 1
                doc.checked = 1
                userDoc.save((err2, doc2) => {
                  if (err2) {
                    res.json({ status: '1', msg: err2.message })
                  } else {
                    res.json({ status: '0', msg: '添加成功', result: 'success'})
                  }
                })

              }
            }
          })
        }

      }

    }
  })
})

module.exports = router