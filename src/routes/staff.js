const Staff = require('../models/staff');
const express = require('express');
const router = express.Router();

// Get all staff
router.get('/', async (req, res) => {
    try {
        const staff = await Staff.find();
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get staff by name
router.get('/:name', getStaff, (req, res) => {
    res.json(res.staff);
});

// Create staff
router.post('/', async (req, res) => {
    const staff = new Staff({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        college: req.body.college,
        major: req.body.major,
        position: req.body.position
    });

    try {
        const newStaff = await staff.save();
        res.status(201).json(newStaff);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update staff
router.patch('/:name', getStaff, async (req, res) => {
    if (req.body.name != null) {
        res.staff.name = req.body.name;
    }
    if (req.body.email != null) {
        res.staff.email = req.body.email;
    }
    if (req.body.phone != null) {
        res.staff.phone = req.body.phone;
    }
    if (req.body.college != null) {
        res.staff.college = req.body.college;
    }
    if (req.body.major != null) {
        res.staff.major = req.body.major;
    }
    if (req.body.position != null) {
        res.staff.position = req.body.position;
    }

    try {
        const updatedStaff = await res.staff.save();
        res.json(updatedStaff);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete staff
router.delete('/:name', getStaff, async (req, res) => {
    try {
        await res.staff.remove();
        res.json({ message: 'Deleted Staff' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getStaff(req, res, next) {
    let staff;
    try {
        staff = await Staff.findOne({ name: req.params.name });
        if (staff == null) {
            return res.status(404).json({ message: 'Cannot find staff' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.staff = staff;
    next();
}

module.exports = router;