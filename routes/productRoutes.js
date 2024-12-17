const express = require('express');
const router = express.Router();

// Controllers
const {
  createOne,
  getAll,
  getOne,
  deleteAll,
  deleteOne,
  updateOne,
  uploadPhoto,
  resizePhotoProject,
  payProduct
} = require('../controllers/productController');

const {protect}=require("../controllers/authController")
// Routes for products
// Create a new product (with image upload and resize)
router.post('/create', uploadPhoto, resizePhotoProject, createOne);

// Get all products
router.get('/getall', getAll);

// Get a single product by id
router.get('/getone/:id', getOne);

// Update a product by id (with image upload and resize)
router.patch('/update/:id', uploadPhoto, resizePhotoProject, updateOne);

router.patch('/pay/:id',protect,payProduct);

// Delete all products
router.delete('/deleteall/', deleteAll);

// Delete a product by id
router.delete('/deleteone/:id', deleteOne);

module.exports = router;
