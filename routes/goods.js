const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', {title: 'hello express'})
})

module.exports = router