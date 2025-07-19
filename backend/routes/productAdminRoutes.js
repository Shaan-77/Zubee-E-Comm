const express = require('express');
const Product = require('../models/Product'); // Adjust the path as necessary
const { protect, admin } = require('../middleware/authMiddleware');


const router = express.Router();


// @route   GET /api/admin/products
// @desc    Get all products (Admin Only)
// @access  Private/Admin

router.get('/', protect, admin, async (req, res) => {

    try {

        const products = await Product.find({})
        res.json(products);
        
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
        
    }
})

module.exports = router;