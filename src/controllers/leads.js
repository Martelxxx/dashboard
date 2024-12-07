import express from 'express';
import mongoose from 'mongoose';
import Lead from '../../models/leads.js';

const router = express.Router();

// Middleware to get lead by ID
async function getLead(req, res, next) {
    let lead;
    try {
        lead = await Lead.findById(req.params.id);
        if (lead == null) {
            return res.status(404).json({ message: 'Cannot find lead' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.lead = lead;
    next();
}

// Get all leads
router.get('/', async (req, res) => {
    try {
        const leads = await Lead.find();
        res.json(leads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get lead by ID
router.get('/:id', getLead, (req, res) => {
    res.json(res.lead);
});

// Create lead
router.post('/', async (req, res) => {
    const lead = new Lead({
        companyName: req.body.companyName,
        website: req.body.website,
        industry: req.body.industry,
        companySize: req.body.companySize,
        revenue: req.body.revenue,
        pointOfContact: req.body.pointOfContact,
        role: req.body.role,
        email: req.body.email,
        icpMatch: req.body.icpMatch,
        workshop: req.body.workshop,
        accelerator: req.body.accelerator,
        internship: req.body.internship,
});

    try {
        const newLead = await lead.save();
        res.status(201).json(newLead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update lead
router.patch('/:id', getLead, async (req, res) => {
    if (req.body.companyName != null) {
        res.lead.companyName = req.body.companyName;
    }
    if (req.body.website != null) {
        res.lead.website = req.body.website;
    }
    if (req.body.industry != null) {
        res.lead.industry = req.body.industry;
    }
    if (req.body.companySize != null) {
        res.lead.companySize = req.body.companySize;
    }
    if (req.body.revenue != null) {
        res.lead.revenue = req.body.revenue;
    }
    if (req.body.pointOfContact != null) {
        res.lead.pointOfContact = req.body.pointOfContact;
    }
    if (req.body.role != null) {
        res.lead.role = req.body.role;
    }
    if (req.body.email != null) {
        res.lead.email = req.body.email;
    }
    if (req.body.icpMatch != null) {
        res.lead.icpMatch = req.body.icpMatch;
    }
    if (req.body.workshop != null) {
        res.lead.workshop = req.body.workshop;
    }
    if (req.body.accelerator != null) {
        res.lead.accelerator = req.body.accelerator;
    }
    if (req.body.internship != null) {
        res.lead.internship = req.body.internship;
    }
    try {
        const updatedLead = await res.lead.save();
        res.json(updatedLead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete /api/leads/:id
router.delete('/:id', async (req, res) => {
    try {
        console.log(`Deleting lead with ID: ${req.params.id}`);

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid lead ID' });
    }
    
    //Find and delete the lead
    const deletedLead = await Lead.findById(req.params.id);
    if (!deletedLead) {
        return res.status(404).json({ message: 'Cannot find lead' });
    }

    console.log(`Deleting lead with ID: ${req.params.id}`);
    res.status(200).json({ message: 'Lead deleted' });
} catch (err) {
    console.log(`Error deleting lead with ID: ${req.params.id}`);
    res.status(500).json({ message: err.message });
}
});

export default router;

