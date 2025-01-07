const Product = require("../models/product");
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