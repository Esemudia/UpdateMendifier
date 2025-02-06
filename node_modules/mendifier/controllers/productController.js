const Product = require("../models/product");
const Escrow = require('../models/escrowModel');

exports.addprodct= async (req, res) => {
    const { title, description, category, price, images } = req.body;
    try {
      const product = new Product({
        userId: req.user.id,
        title,
        description,
        category,
        price,
        images,
      });
  
      await product.save();
      res.status(201).send(product);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  };

  exports.getProduct = async (req, res) => {
    try {

        const Product = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(Product);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transaction history' });
    }
};

  exports.getProductById = async (req, res) => {
    try {
        const { productId } = req.body;

        const Product = await Transaction.find({ productId }).sort({ createdAt: -1 });
        res.status(200).json(Product);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transaction history' });
    }
};

exports.getProductByUserId = async (req, res) => {
    try {
        const { userId } = req.body;

        const Product = await Transaction.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(Product);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transaction history' });
    }
};


exports.pushProduct = async (req, res) => {
  const { sellerId, productName, price } = req.body;

  try {
    const product = new Product({ name: productName, price, vendor: sellerId, status: 'requested' });
    await product.save();

    res.status(200).json({ message: 'Product request added', product });
  } catch (error) {
    res.status(500).json({ message: 'Error pushing product' });
  }
};

// Purchase Product with Escrow
exports.purchaseProduct = async (req, res) => {
  const { buyerId, sellerId, productId, amount } = req.body;

  try {
    const escrow = new Escrow({ buyer: buyerId, seller: sellerId, product: productId, amount });
    await escrow.save();

    res.status(200).json({ message: 'Product purchased. Payment in escrow.', escrow });
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing product' });
  }
};

// Complete Order and Release Payment
exports.completeOrder = async (req, res) => {
  const { escrowId } = req.body;

  try {
    const escrow = await Escrow.findById(escrowId).populate('product');
    if (!escrow) {
      return res.status(404).json({ message: 'Escrow transaction not found' });
    }

    escrow.status = 'released';
    await escrow.save();

    // Move product to buyer's list
    escrow.product.vendor = escrow.buyer;
    escrow.product.status = 'available';
    await escrow.product.save();

    res.status(200).json({ message: 'Payment released, product transferred' });
  } catch (error) {
    res.status(500).json({ message: 'Error completing order' });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { productId, vendorId } = req.body;

    await Product.findByIdAndDelete(productId);
    await Vendor.findByIdAndUpdate(vendorId, { $pull: { products: productId } });

    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};
