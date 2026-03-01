const Booking = require('../models/Booking');

async function createBooking(req, res) {
  const { service, date, time, location } = req.body;

  if (!service || !date || !time || !location) {
    return res.status(400).json({ message: 'All booking fields are required.' });
  }

  const booking = await Booking.create({
    user: req.user.userId,
    service,
    date,
    time,
    location,
    status: 'pending'
  });

  return res.status(201).json({ booking });
}

async function getMyBookings(req, res) {
  const bookings = await Booking.find({ user: req.user.userId }).sort({ createdAt: -1 });
  return res.json({ bookings });
}

async function getAllBookings(req, res) {
  const { status, search } = req.query;
  const query = {};

  if (status) {
    query.status = status;
  }

  let bookings = await Booking.find(query).populate('user', 'name email').sort({ createdAt: -1 });

  if (search) {
    const lowerSearch = search.toLowerCase();
    bookings = bookings.filter(
      (booking) =>
        booking.service.toLowerCase().includes(lowerSearch) ||
        booking.user?.name?.toLowerCase().includes(lowerSearch) ||
        booking.user?.email?.toLowerCase().includes(lowerSearch)
    );
  }

  return res.json({ bookings });
}

async function updateBookingStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'confirmed', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  return res.json({ booking });
}

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus
};
