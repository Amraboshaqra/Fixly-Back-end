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
    payService,
    MyOrders
} = require('../controllers/serviceController');

const {protect}=require("../controllers/authController")
// Routes for services
// Create a new service (with image upload and resize)
router.post('/create', protect,uploadPhoto, resizePhotoProject, createOne);

// Get all services
router.get('/getall', getAll);

router.get('/getorder', protect,MyOrders);

// Get a single service by id
router.get('/getone/:id', getOne);

// Update a service by id (with image upload and resize)
router.patch('/update/:id', uploadPhoto, resizePhotoProject, updateOne);

router.patch('/pay/:id',protect,payService);

// Delete all services
router.delete('/deleteall/', deleteAll);

// Delete a service by id
router.delete('/deleteone/:id', deleteOne);

module.exports = router;
