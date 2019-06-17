const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  'productId': { type: String },
  'productName': String,
  'salePrice': Number,
  'checked': String,
  'productNum': Number,
  'productImage': String
})

module.exports = mongoose('Good', productSchema)