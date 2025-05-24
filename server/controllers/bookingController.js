const prisma = require("../database/db.js");

// GET /api/getVenues
// Returns a list of all venues
exports.getVenues = async (req, res) => {
  try {
    const venues = await prisma.venue.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: venues,
    });
  } catch (error) {
    console.error("Error fetching venues:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch venues",
    });
  }
};

// GET /api/sports
// Returns a list of all sports available for booking
exports.getSports = async (req, res) => {
  try {
    // For now, return static sports data
    // You can create a Sports table in the future if needed
    const sports = [
      { id: "sport-1", name: "Tennis" },
      { id: "sport-2", name: "Badminton" },
      { id: "sport-3", name: "Basketball" },
      { id: "sport-4", name: "Football" },
      { id: "sport-5", name: "Cricket" },
      { id: "sport-6", name: "Volleyball" },
    ];

    res.status(200).json({
      success: true,
      data: sports,
    });
  } catch (error) {
    console.error("Error fetching sports:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch sports",
    });
  }
};

// GET /api/dates
// Returns a list of dates
exports.getDates = async (req, res) => {
  try {
    const dates = await prisma.slot.findMany({
      select: {
        date: true,
      },
      distinct: ["date"],
      orderBy: {
        date: "asc",
      },
    });

    const formattedDates = dates.map((slot) => {
      const date = new Date(slot.date);
      return {
        date: date.toISOString().split("T")[0], // Format to YYYY-MM-DD
        day: date.toLocaleString("default", { weekday: "long" }), // Get the day of the week
      };
    });
    res.status(200).json({
      success: true,
      data: formattedDates,
    });
  } catch (error) {
    console.error("Error fetching dates:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch dates",
    });
  }
};

// GET /api/slots?venue=VenueID&date=YYYY-MM-DD
// Returns a list of slots for a specific venue and date
exports.getSlots = async (req, res) => {
  try {
    const { venue, date } = req.query;

    // Validating required parameters
    if (!venue || !date) {
      return res.status(400).json({
        error: "Missing required parameters",
        message: "Both 'venue' and 'date' query parameters are required",
      });
    }

    // Validating the date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        error: "Invalid date format",
        message: "Date must be in YYYY-MM-DD format",
      });
    }

    // Checking if venue exists
    const venueExists = await prisma.venue.findUnique({
      where: { id: venue },
    });

    // If venue does not exist, returning Error
    if (!venueExists) {
      return res.status(404).json({
        error: "Venue not found",
        message: `Venue with ID '${venue}' does not exist`,
      });
    }

    // Geting slots for the specified venue and date
    const slots = await prisma.slot.findMany({
      where: {
        venueId: venue,
        date: new Date(date),
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
          },
        },
        bookings: {
          select: {
            id: true,
            userName: true,
            sport: true,
            timestamp: true,
          },
        },
      },
      orderBy: {
        time: "asc",
      },
    });

    // Transforming the data
    const transformedSlots = slots.map((slot) => ({
      id: slot.id,
      time: slot.time,
      booked: slot.booked,
      date: slot.date,
      venue: slot.venue,
      booking:
        slot.booked && slot.bookings.length > 0 ? slot.bookings[0] : null,
    }));

    res.status(200).json({
      success: true,
      data: {
        venue: venueExists,
        date: date,
        slots: transformedSlots,
        totalSlots: transformedSlots.length,
        availableSlots: transformedSlots.filter((slot) => !slot.booked).length,
        bookedSlots: transformedSlots.filter((slot) => slot.booked).length,
      },
    });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch slots",
    });
  }
};

// POST /api/book
// Body: { "user_name": "John Doe", "sport": "Tennis", "slot_id": "SlotID" }
exports.bookSlot = async (req, res) => {
  try {
    const { user_name, sport, slot_id } = req.body;

    // Validate required fields
    if (!user_name || !sport || !slot_id) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "user_name, sport, and slot_id are required",
      });
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Check if slot exists and is not already booked
      const slot = await tx.slot.findUnique({
        where: { id: slot_id },
        include: {
          venue: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!slot) {
        throw new Error("SLOT_NOT_FOUND");
      }

      if (slot.booked) {
        throw new Error("SLOT_ALREADY_BOOKED");
      }

      // Mark the slot as booked
      const updatedSlot = await tx.slot.update({
        where: { id: slot_id },
        data: { booked: true },
      });

      // Create booking record
      const booking = await tx.booking.create({
        data: {
          userName: user_name.trim(),
          sport: sport.trim(),
          slotId: slot_id,
        },
      });

      return {
        booking,
        slot: {
          ...updatedSlot,
          venue: slot.venue,
        },
      };
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating booking:", error);

    if (error.message === "SLOT_NOT_FOUND") {
      return res.status(404).json({
        error: "Slot not found",
        message: "The specified slot does not exist",
      });
    }

    if (error.message === "SLOT_ALREADY_BOOKED") {
      return res.status(409).json({
        error: "Slot already booked",
        message: "This slot has already been booked by someone else",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create booking",
    });
  }
};
