const express = require('express');
const router = express.Router();
const { CashSale, CreditSale } = require('../models/Sale');
const { protect, restrictTo } = require('../middleware/auth');
const { cashSaleValidators, creditSaleValidators, validate } = require('../utils/validators');

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Sales management - Cash and Credit/Deferred sales (SalesAgent only)
 */

// ─── CASH SALES ──────────────────────────────────────────────────────────────

/**
 * @swagger
 * /sales/cash:
 *   post:
 *     summary: Record a new cash sale
 *     tags: [Sales]
 *     description: Only Sales Agents can record sales.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CashSale'
 *     responses:
 *       201:
 *         description: Cash sale recorded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: SalesAgent role required
 */
router.post(
  '/cash',
  protect,
  restrictTo('SalesAgent'),
  cashSaleValidators,
  validate,
  async (req, res) => {
    try {
      const sale = await CashSale.create({ ...req.body, recordedBy: req.user._id });
      res.status(201).json({
        success: true,
        message: 'Cash sale recorded successfully',
        data: sale,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

/**
 * @swagger
 * /sales/cash:
 *   get:
 *     summary: Get all cash sales
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of cash sales
 *       401:
 *         description: Not authenticated
 */
router.get('/cash', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [sales, total] = await Promise.all([
      CashSale.find()
        .populate('recordedBy', 'username role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CashSale.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: sales.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: sales,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /sales/cash/{id}:
 *   get:
 *     summary: Get a single cash sale by ID
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cash sale found
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Not found
 */
router.get('/cash/:id', protect, async (req, res) => {
  try {
    const sale = await CashSale.findById(req.params.id).populate('recordedBy', 'username role');
    if (!sale) return res.status(404).json({ success: false, message: 'Cash sale not found' });
    res.status(200).json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /sales/cash/{id}:
 *   put:
 *     summary: Update a cash sale (SalesAgent only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CashSale'
 *     responses:
 *       200:
 *         description: Updated successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: SalesAgent role required
 *       404:
 *         description: Not found
 */
router.put('/cash/:id', protect, restrictTo('SalesAgent'), cashSaleValidators, validate, async (req, res) => {
  try {
    const sale = await CashSale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!sale) return res.status(404).json({ success: false, message: 'Cash sale not found' });
    res.status(200).json({ success: true, message: 'Cash sale updated', data: sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /sales/cash/{id}:
 *   delete:
 *     summary: Delete a cash sale (Manager only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Manager role required
 *       404:
 *         description: Not found
 */
router.delete('/cash/:id', protect, restrictTo('Manager'), async (req, res) => {
  try {
    const sale = await CashSale.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(404).json({ success: false, message: 'Cash sale not found' });
    res.status(200).json({ success: true, message: 'Cash sale deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── CREDIT / DEFERRED SALES ─────────────────────────────────────────────────

/**
 * @swagger
 * /sales/credit:
 *   post:
 *     summary: Record a new credit/deferred sale
 *     tags: [Sales]
 *     description: For trusted buyers only. Only Sales Agents can record sales.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreditSale'
 *     responses:
 *       201:
 *         description: Credit sale recorded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: SalesAgent role required
 */
router.post(
  '/credit',
  protect,
  restrictTo('SalesAgent'),
  creditSaleValidators,
  validate,
  async (req, res) => {
    try {
      const sale = await CreditSale.create({ ...req.body, recordedBy: req.user._id });
      res.status(201).json({
        success: true,
        message: 'Credit/deferred sale recorded successfully',
        data: sale,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

/**
 * @swagger
 * /sales/credit:
 *   get:
 *     summary: Get all credit/deferred sales
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isPaid
 *         schema:
 *           type: boolean
 *         description: Filter by payment status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of credit sales
 *       401:
 *         description: Not authenticated
 */
router.get('/credit', protect, async (req, res) => {
  try {
    const filter = {};
    if (req.query.isPaid !== undefined) filter.isPaid = req.query.isPaid === 'true';

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [sales, total] = await Promise.all([
      CreditSale.find(filter)
        .populate('recordedBy', 'username role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CreditSale.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: sales.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: sales,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /sales/credit/{id}:
 *   get:
 *     summary: Get a single credit sale by ID
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Credit sale found
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Not found
 */
router.get('/credit/:id', protect, async (req, res) => {
  try {
    const sale = await CreditSale.findById(req.params.id).populate('recordedBy', 'username role');
    if (!sale) return res.status(404).json({ success: false, message: 'Credit sale not found' });
    res.status(200).json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /sales/credit/{id}:
 *   put:
 *     summary: Update a credit sale (SalesAgent only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreditSale'
 *     responses:
 *       200:
 *         description: Updated successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: SalesAgent role required
 *       404:
 *         description: Not found
 */
router.put('/credit/:id', protect, restrictTo('SalesAgent'), creditSaleValidators, validate, async (req, res) => {
  try {
    const sale = await CreditSale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!sale) return res.status(404).json({ success: false, message: 'Credit sale not found' });
    res.status(200).json({ success: true, message: 'Credit sale updated', data: sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /sales/credit/{id}/mark-paid:
 *   patch:
 *     summary: Mark a credit sale as paid (Manager only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Marked as paid
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Manager role required
 *       404:
 *         description: Not found
 */
router.patch('/credit/:id/mark-paid', protect, restrictTo('Manager'), async (req, res) => {
  try {
    const sale = await CreditSale.findByIdAndUpdate(
      req.params.id,
      { isPaid: true },
      { new: true }
    );
    if (!sale) return res.status(404).json({ success: false, message: 'Credit sale not found' });
    res.status(200).json({ success: true, message: 'Credit sale marked as paid', data: sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /sales/credit/{id}:
 *   delete:
 *     summary: Delete a credit sale (Manager only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Manager role required
 *       404:
 *         description: Not found
 */
router.delete('/credit/:id', protect, restrictTo('Manager'), async (req, res) => {
  try {
    const sale = await CreditSale.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(404).json({ success: false, message: 'Credit sale not found' });
    res.status(200).json({ success: true, message: 'Credit sale deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
