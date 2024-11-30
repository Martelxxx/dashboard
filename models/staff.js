import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    college: { type: String, required: true },
    major: { type: String, required: true },
    postion: { type: String, required: true }
});

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;