const prisma = require("../database/db.js");

async function verifySetup() {
  try {
    console.log("Verifying Prisma setup...");

    const venueCount = await prisma.venue.count();
    const slotCount = await prisma.slot.count();
    const bookingCount = await prisma.booking.count();

    console.log("📊 Database Statistics:");
    console.log(`Venues: ${venueCount}`);
    console.log(`Slots: ${slotCount}`);
    console.log(`Bookings: ${bookingCount}`);

    // Test a complex query
    const availableSlots = await prisma.slot.findMany({
      where: { booked: false },
      include: {
        venue: true,
      },
      take: 5,
    });

    console.log("Sample available slots:");
    availableSlots.forEach((slot) => {
      console.log(
        `  ${slot.venue.name} - ${slot.date.toDateString()} at ${slot.time}`,
      );
    });

    console.log("✅ Prisma setup verified successfully!");
  } catch (error) {
    console.error("❌ Verification failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verifySetup();
