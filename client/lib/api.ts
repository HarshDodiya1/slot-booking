import { Venue, Slot, Sport, Day } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Get all venues from backend
export const getVenues = async (): Promise<Venue[]> => {
  try {
    const response = await apiCall('/api/getVenues');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch venues:', error);
    throw new Error('Failed to load venues. Please try again.');
  }
};

// Get all sports from backend
export const getSports = async (): Promise<Sport[]> => {
  try {
    const response = await apiCall('/api/sports');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch sports:', error);
    return [
      { id: "sport-1", name: "Tennis" },
      { id: "sport-2", name: "Badminton" },
      { id: "sport-3", name: "Basketball" },
      { id: "sport-4", name: "Football" },
    ];
  }
};

// Get dates from backend
export const getDates = async (): Promise<Day[]> => {
  try {
    const response = await apiCall('/api/dates');
    if (response.success && response.data) {
      return response.data.map((item: any) => ({
        date: item.date,
        dayName: item.day || new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: new Date(item.date).getDate().toString(),
      }));
    }
    return getNext7Days();
  } catch (error) {
    console.error('Failed to fetch dates:', error);
    return getNext7Days();
  }
};

// Get slots for a specific venue and date
export const getSlots = async (venueId: string, date: string): Promise<Slot[]> => {
  try {
    const response = await apiCall(`/api/slots?venue=${venueId}&date=${date}`);
    
    if (response.success && response.data && response.data.slots) {
      return response.data.slots.map((slot: any) => ({
        id: slot.id,
        venueId: slot.venue?.id || venueId,
        startTime: slot.time,
        endTime: calculateEndTime(slot.time),
        isBooked: slot.booked,
        date: slot.date,
        venue: slot.venue,
        booking: slot.booking,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch slots:', error);
    throw new Error('Failed to load slots. Please try again.');
  }
};

// Book a slot
export const bookSlot = async (
  slotId: string,
  playerName: string,
  sport: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiCall('/api/book', {
      method: 'POST',
      body: JSON.stringify({
        user_name: playerName,
        sport: sport,
        slot_id: slotId
      })
    });

    return {
      success: response.success || false,
      message: response.message || 'Booking completed successfully!'
    };
  } catch (error) {
    console.error('Failed to book slot:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to book slot. Please try again.'
    };
  }
};

// Helper function to calculate end time (1 hour after start time)
const calculateEndTime = (startTime: string): string => {
  try {
    let [hours, minutes] = startTime.split(':').map(Number);
    hours += 1;
    if (hours >= 24) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Error calculating end time:', error);
    return startTime;
  }
};

// Helper to generate the next 7 days
export const getNext7Days = (): Day[] => {
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
