import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  collegeCampus: { type: String },
  major: { type: String },
  role: { type: String },
  employeeAgreement: { type: Boolean, default: false },
  weeklyOrientation: { type: Boolean, default: false },
  onboardingDocs: { type: Boolean, default: false },
  duty: { type: String, default: 'None' },
  notes: { type: String },
});

export default mongoose.model('Staff', staffSchema);