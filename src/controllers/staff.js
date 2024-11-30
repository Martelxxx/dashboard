import express from 'express';
import Staff from '../../models/staff.js'; // Ensure the correct path and extension
import mongoose from 'mongoose';

const router = express.Router();

// Middleware to get staff by ID
async function getStaff(req, res, next) {
    let staff;
    try {
        staff = await Staff.findById(req.params.id);
        if (staff == null) {
            return res.status(404).json({ message: 'Cannot find staff' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.staff = staff;
    next();
}

// Get all staff
router.get('/', async (req, res) => {
    try {
        const staff = await Staff.find();
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get staff by ID
router.get('/:id', getStaff, (req, res) => {
    res.json(res.staff);
});

// Create staff
router.post('/', async (req, res) => {
    const staff = new Staff({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        collegeCampus: req.body.collegeCampus,
        major: req.body.major,
        role: req.body.role,
        employeeAgreement: req.body.employeeAgreement,
        weeklyOrientation: req.body.weeklyOrientation,
        onboardingDocs: req.body.onboardingDocs,
        duty: req.body.duty,
        notes: req.body.notes,
    });

    try {
        const newStaff = await staff.save();
        res.status(201).json(newStaff);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update staff
router.patch('/:id', getStaff, async (req, res) => {
    if (req.body.firstName != null) {
        res.staff.firstName = req.body.firstName;
    }
    if (req.body.lastName != null) {
        res.staff.lastName = req.body.lastName;
    }
    if (req.body.email != null) {
        res.staff.email = req.body.email;
    }
    if (req.body.phone != null) {
        res.staff.phone = req.body.phone;
    }
    if (req.body.collegeCampus != null) {
        res.staff.collegeCampus = req.body.collegeCampus;
    }
    if (req.body.major != null) {
        res.staff.major = req.body.major;
    }
    if (req.body.role != null) {
        res.staff.role = req.body.role;
    }
    if (req.body.employeeAgreement != null) {
        res.staff.employeeAgreement = req.body.employeeAgreement;
    }
    if (req.body.weeklyOrientation != null) {
        res.staff.weeklyOrientation = req.body.weeklyOrientation;
    }
    if (req.body.onboardingDocs != null) {
        res.staff.onboardingDocs = req.body.onboardingDocs;
    }
    if (req.body.duty != null) {
        res.staff.duty = req.body.duty;
    }
    if (req.body.notes != null) {
        res.staff.notes = req.body.notes;
    }

    try {
        const updatedStaff = await res.staff.save();
        res.json(updatedStaff);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/staff/:id
router.delete('/:id', async (req, res) => {
    try {
        console.log(`Attempting to delete staff with ID: ${req.params.id}`);
        
        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid staff ID' });
        }

        // Find and delete the staff member
        const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
        if (!deletedStaff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        console.log(`Staff with ID ${req.params.id} deleted successfully.`);
        res.status(200).json({ message: 'Staff deleted successfully' });
    } catch (error) {
        console.error('Error deleting staff:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;