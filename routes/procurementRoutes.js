const express = require('express');
const router = express.Router();
const Procurement = require('../models/Procurement');
const { protect, restrictTo } = require('../middleware/auth');
const { procurementValidators, validate } = require('../utils/validators');

/**
 * @swagger
 * tags:
 *   name: Procurement
 *   description: Produce procurement management (Manager only)
 */

/**
 * @swagger
 * /procurement:
 *   post:
 *     summary: Record a new produce procurement
 *     tags: [Procurement]
 *     description: Only Managers can record procurement. All fields are required and validated.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Procurement'
 *     responses:
 *       201:
 *         description: Procurement recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Procurement'
 *       400:
 *         description: Validation error - check error details in response
 *       401:
 *         description: Not authenticated - provide a valid Bearer token
 *       403:
 *         description: Forbidden - Manager role required
 */
router.post(
  '/',
  protect,
  restrictTo('Manager'),
  procurementValidators,
  validate,
  async (req, res) => {
    try {
      const procurementData = { ...req.body, recordedBy: req.user._id };
      const procurement = await Procurement.create(procurementData);

      res.status(201).json({
        success: true,
        message: 'Procurement recorded successfully',
        data: procurement,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

/**
 * @swagger
 * /procurement:
 *   get:
 *     summary: Get all procurement records
 *     tags: [Procurement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *           enum: [Maganjo, Matugga]
 *         description: Filter by branch
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Results per page
 *     responses:
 *       200:
 *         description: List of procurement records
 *       401:
 *         description: Not authenticated
 */
router.get('/', protect, async (req, res) => {
  try {
    const filter = {};
    if (req.query.branch) filter.branch = req.query.branch;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [procurements, total] = await Promise.all([
      Procurement.find(filter)
        .populate('recordedBy', 'username role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Procurement.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: procurements.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: procurements,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /procurement/{id}:
 *   get:
 *     summary: Get a single procurement record by ID
 *     tags: [Procurement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB Procurement ID
 *     responses:
 *       200:
 *         description: Procurement record found
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Record not found
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const procurement = await Procurement.findById(req.params.id).populate(
      'recordedBy',
      'username role'
    );
    if (!procurement) {
      return res.status(404).json({ success: false, message: 'Procurement record not found' });
    }
    res.status(200).json({ success: true, data: procurement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /procurement/{id}:
 *   put:
 *     summary: Update a procurement record (Manager only)
 *     tags: [Procurement]
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
 *             $ref: '#/components/schemas/Procurement'
 *     responses:
 *       200:
 *         description: Updated successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Manager role required
 *       404:
 *         description: Record not found
 */
router.put('/:id', protect, restrictTo('Manager'), procurementValidators, validate, async (req, res) => {
  try {
    const procurement = await Procurement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!procurement) {
      return res.status(404).json({ success: false, message: 'Procurement record not found' });
    }
    res.status(200).json({ success: true, message: 'Procurement updated', data: procurement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /procurement/{id}:
 *   delete:
 *     summary: Delete a procurement record (Manager only)
 *     tags: [Procurement]
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
 *         description: Deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Manager role required
 *       404:
 *         description: Record not found
 */
router.delete('/:id', protect, restrictTo('Manager'), async (req, res) => {
  try {
    const procurement = await Procurement.findByIdAndDelete(req.params.id);
    if (!procurement) {
      return res.status(404).json({ success: false, message: 'Procurement record not found' });
    }
    res.status(200).json({ success: true, message: 'Procurement record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
