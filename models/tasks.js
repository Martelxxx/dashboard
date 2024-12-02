import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: false },
    priority: { type: String, default: 'Low' },
    completed: { type: Boolean, default: false },
    completionDate: { type: Date, default: null },
    timeToComplete: { type: Number, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);