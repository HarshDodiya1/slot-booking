"use client";

import { VenueSelectorSkeleton } from "@/components/loading-skeleton";
import { SlotViewer } from "@/components/slot-viewer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VenueSelector } from "@/components/venue-selector";
import { getDates, getSlots, getVenues } from "@/lib/api";
import { Day, Slot, Venue } from "@/types";
import { CalendarDays } from "lucide-react";
import { useCallback, useEffect, useState, useRef } from "react";

export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [days, setDays] = useState<Day[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // Use ref to track modal state for polling
  const isBookingModalOpenRef = useRef(false);

  // Update ref when modal state changes
  useEffect(() => {
    isBookingModalOpenRef.current = isBookingModalOpen;
  }, [isBookingModalOpen]);

  // Loading venues and dates when the component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoadingVenues(true);
        
        const [venuesData, daysData] = await Promise.all([
          getVenues(),
          getDates()
        ]);
        
        setVenues(venuesData);
        setDays(daysData);
        
        if (venuesData.length > 0) {
          setSelectedVenue(venuesData[0].id);
        }
        
        if (daysData.length > 0) {
          setSelectedDate(daysData[0].date);
        }
        
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setIsLoadingVenues(false);
      }
    };

    fetchInitialData();
  }, []);

  // Loading slots when the selected venue or date changes
  const fetchSlots = useCallback(async () => {
    if (selectedVenue && selectedDate) {
      setIsLoadingSlots(true);
      try {
        const slotsData = await getSlots(selectedVenue, selectedDate);
        setSlots(slotsData);
      } catch (error) {
        console.error("Failed to fetch slots:", error);
        setSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    }
  }, [selectedVenue, selectedDate]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Setting up polling logic that runs every 10 seconds but respects modal state
  useEffect(() => {
    if (!selectedVenue || !selectedDate) return;

    setIsPolling(true);
    const pollInterval = setInterval(() => {
      // Only poll if modal is not open
      if (!isBookingModalOpenRef.current) {
        fetchSlots();
      }
    }, 10000);

    return () => {
      clearInterval(pollInterval);
      setIsPolling(false);
    };
  }, [selectedVenue, selectedDate, fetchSlots]);

  const handleVenueChange = (venueId: string) => {
    setSelectedVenue(venueId);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const getVenueName = (venueId: string) => {
    const venue = venues.find((v) => v.id === venueId);
    return venue ? venue.name : "";
  };

  const handleModalStateChange = (isOpen: boolean) => {
    setIsBookingModalOpen(isOpen);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center">
              <CalendarDays className="h-6 w-6 mr-2 text-primary" />
              <CardTitle>Slot Booking System</CardTitle>
            </div>
            <ThemeToggle />
          </CardHeader>
          <CardContent>
            {isLoadingVenues ? (
              <VenueSelectorSkeleton />
            ) : (
              <VenueSelector
                venues={venues}
                isLoading={isLoadingVenues}
                selectedVenue={selectedVenue}
                onVenueChange={handleVenueChange}
                days={days}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
              />
            )}
          </CardContent>
        </Card>

        {selectedVenue && selectedDate && (
          <SlotViewer
            slots={slots}
            isLoading={isLoadingSlots}
            selectedVenue={getVenueName(selectedVenue)}
            selectedDate={selectedDate}
            venueId={selectedVenue}
            onRefresh={fetchSlots}
            isPolling={isPolling}
            onModalStateChange={handleModalStateChange}
          />
        )}
      </div>
    </main>
  );
}
