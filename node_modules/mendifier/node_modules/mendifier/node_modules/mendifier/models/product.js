
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    userId: {type:mongoose.Schema.Types.ObjectId,ref: 'Vendor', required: true},
    title: {type:String, required:true},
    description: String,
    category: {type:String},
    price: {type:Number, required:true},
    stock:{type:Number,required:true},
    images:{ type:[String],requred:true},
    createdAt: { type: Date, default: Date.now },
  });
  const Product = mongoose.model('Product', productSchema);