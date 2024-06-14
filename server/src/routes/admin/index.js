const express = require('express');
const router = express.Router();
const settingRoutes = require('./settingRoutes');
const userRoutes = require('./userRoutes');
const profileRoutes = require('./profileRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const rolesRoutes = require('./roleRoutes');
const invoiceRoutes = require('./invoiceRoutes');
const productRoutes = require('./productRoutes');

router.use('/settings', settingRoutes);
router.use('/users', userRoutes);
router.use('/profile', profileRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/roles', rolesRoutes);
router.use('/invoice', invoiceRoutes);
router.use('/products', productRoutes);

module.exports = router;
