const express = require("express");
const {
  getVenues,
  getDates,
  bookSlot,
  getSlots,
  getSports,
} = require("../controllers/bookingController.js");

const router = express.Router();

// GET /api/getVenues
router.get("/getVenues", getVenues);

// GET /api/sports
router.get("/sports", getSports);

// GET /api/dates
router.get("/dates", getDates);

// GET /api/slots
router.get("/slots", getSlots);

// POST /api/book
router.post("/book", bookSlot);

module.exports = router;
