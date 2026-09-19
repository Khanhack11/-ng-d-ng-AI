const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');
const ProductController = require('../controllers/ProductController');
const CategoryController = require('../controllers/CategoryController');
const OrderController = require('../controllers/OrderController');
const PaymentController = require('../controllers/PaymentController');
const CartController = require('../controllers/CartController');
const AuthController = require('../controllers/AuthController');
const ChatController = require('../controllers/ChatController');

// Chat & AI Skills
router.post('/chat', ChatController.handleChat);
router.get('/ai/skills', ChatController.getSkillsList);

// Auth
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);
router.post('/auth/forgot-password', AuthController.forgotPassword);
router.post('/auth/social-login', AuthController.socialLogin);

// Users
router.get('/users', UserController.getAllUsers);

// Products
router.post('/products', ProductController.createProduct);
router.get('/products', ProductController.getAllProducts);
router.put('/products/:id', ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);
router.put('/products/:id/review', ProductController.reviewProduct);

// Categories
router.get('/categories', CategoryController.getAllCategories);

// Orders
router.post('/orders', OrderController.createOrder);
router.get('/orders', OrderController.getOrders);
router.put('/orders/:id/status', OrderController.updateStatus);

// Payments
router.post('/payments', PaymentController.createPayment);

// Carts
router.get('/carts', CartController.getCart);
router.post('/carts/add', CartController.addItem);
router.post('/carts/remove', CartController.removeItem);

module.exports = router;
