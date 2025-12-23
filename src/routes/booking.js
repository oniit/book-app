const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');

router.get('/', bookingController.getAllBookings);
router.get('/by-code/:code', bookingController.getBookingByCode);
router.post('/', bookingController.createBooking);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
