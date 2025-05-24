export interface Venue {
  id: string;
  name: string;
}

export interface Slot {
  booking: {
    userName: string;
  };
  id: string;
  venueId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  price: number;
}

export interface BookingFormData {
  playerName: string;
  sport: string;
  slotId: string;
  venueId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface Sport {
  id: string;
  name: string;
}

export type Day = {
  date: string;
  dayName: string;
  dayNumber: string;
}