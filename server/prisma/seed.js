const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create venues
  const venues = await Promise.all([
    prisma.venue.create({
      data: { name: "Venue A" },
    }),
    prisma.venue.create({
      data: { name: "Venue B" },
    }),
    prisma.venue.create({
      data: { name: "Venue C" },
    }),
  ]);

  console.log(
    "✅ Created venues:",
    venues.map((v) => v.name),
  );

  // Create slots for the next 7 days
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    for (const venue of venues) {
      for (const time of timeSlots) {
        await prisma.slot.create({
          data: {
            venueId: venue.id,
            date: date,
            time: time,
            booked: Math.random() > 0.8, // 20% chance of being booked
          },
        });
      }
    }
  }

  console.log("✅ Created slots for next 7 days");

  // Create some sample bookings
  const bookedSlots = await prisma.slot.findMany({
    where: { booked: true },
    take: 5,
  });

  for (const slot of bookedSlots) {
    await prisma.booking.create({
      data: {
        userName: `User ${Math.floor(Math.random() * 100)}`,
        sport: ["Basketball", "Cricket", "Football", "Badminton"][
          Math.floor(Math.random() * 4)
        ],
        slotId: slot.id,
      },
    });
  }

  console.log("✅ Created sample bookings");
  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
