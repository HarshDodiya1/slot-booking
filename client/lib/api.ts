import { Slot, Venue, Sport } from "@/types";

// Simulated delay for API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock venues data
const venues: Venue[] = [
  { id: "venue-1", name: "Venue A" },
  { id: "venue-2", name: "Venue B" },
];

// Mock sports data
const sports: Sport[] = [
  { id: "sport-1", name: "Tennis" },
  { id: "sport-2", name: "Badminton" },
  { id: "sport-3", name: "Basketball" },
  { id: "sport-4", name: "Football" },
];

// Generate time slots from 8 AM to 8 PM
const generateTimeSlots = (
  venueId: string,
  date: string,
  isBooked = false
): Slot[] => {
  const slots: Slot[] = [];
  const startHour = 8; // 8 AM
  const endHour = 20; // 8 PM

  for (let hour = startHour; hour < endHour; hour++) {
    // Create two 30-minute slots per hour
    for (let minutes = 0; minutes < 60; minutes += 30) {
      const startTime = `${hour.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      const endMinutes = minutes + 30;
      const endHourAdjusted = endMinutes === 60 ? hour + 1 : hour;
      const endMinutesAdjusted = endMinutes === 60 ? 0 : endMinutes;
      const endTime = `${endHourAdjusted
        .toString()
        .padStart(2, "0")}:${endMinutesAdjusted.toString().padStart(2, "0")}`;

      // Randomly mark some slots as booked for demonstration
      const randomBooked = Math.random() < 0.3;
      const slotIsBooked = isBooked || randomBooked;

      slots.push({
        id: `${venueId}-${date}-${startTime}`,
        venueId,
        startTime,
        endTime,
        isBooked: slotIsBooked,
        price: Math.floor(Math.random() * 20) + 30, // Random price between 30 and 50
      });
    }
  }

  return slots;
};

// Mock API functions
export const getVenues = async (): Promise<Venue[]> => {
  await delay(800); // Simulate network delay
  return venues;
};

export const getSports = async (): Promise<Sport[]> => {
  await delay(600);
  return sports;
};

export const getSlots = async (
  venueId: string,
  date: string
): Promise<Slot[]> => {
  await delay(1000);
  return generateTimeSlots(venueId, date);
};

export const bookSlot = async (
  slotId: string,
  playerName: string,
  sport: string
): Promise<{ success: boolean; message: string }> => {
  await delay(1500); // Simulate booking process

  // Simulate success with 90% probability
  const isSuccess = Math.random() < 0.9;

  if (isSuccess) {
    return {
      success: true,
      message: "Slot booked successfully!",
    };
  } else {
    return {
      success: false,
      message: "This slot was just booked by someone else. Please try another.",
    };
  }
};

// Helper to generate the next 7 days
export const getNext7Days = () => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    days.push({
      date: date.toISOString().split("T")[0],
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.getDate().toString(),
    });
  }

  return days;
};
