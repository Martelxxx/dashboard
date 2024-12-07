import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    website: { type: String, required: true },
    industry: { type: String, required: true },
    companySize: { type: String },
    revenue: { type: String },
    pointOfContact: { type: String },
    role: { type: String },
    email: { type: String },
    icpMatch: { type: String },
    workshop: { type: Boolean, default: false },
    accelerator: { type: Boolean, default: false },
    internship: { type: Boolean, default: false },
    });

export default mongoose.model("Lead", leadSchema);