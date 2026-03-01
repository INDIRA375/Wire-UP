const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
