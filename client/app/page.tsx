"use client";

import { VenueSelectorSkeleton } from "@/components/loading-skeleton";
import { SlotViewer } from "@/components/slot-viewer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VenueSelector } from "@/components/venue-selector";
import { getNext7Days, getSlots, getVenues } from "@/lib/api";
import { Day, Slot, Venue } from "@/types";
import { CalendarDays } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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

  // Load venues when the component mounts
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const venuesData = await getVenues();
        setVenues(venuesData);
        if (venuesData.length > 0) {
          setSelectedVenue(venuesData[0].id);
        }

        const daysData = getNext7Days();
        setDays(daysData);
        setSelectedDate(daysData[0].date);
      } catch (error) {
        console.error("Failed to fetch venues:", error);
      } finally {
        setIsLoadingVenues(false);
      }
    };

    fetchVenues();
  }, []);

  // Load slots when the selected venue or date changes
  const fetchSlots = useCallback(async () => {
    if (selectedVenue && selectedDate) {
      setIsLoadingSlots(true);
      try {
        const slotsData = await getSlots(selectedVenue, selectedDate);
        setSlots(slotsData);
      } catch (error) {
        console.error("Failed to fetch slots:", error);
      } finally {
        setIsLoadingSlots(false);
      }
    }
  }, [selectedVenue, selectedDate]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Set up polling logic
  useEffect(() => {
    if (!selectedVenue || !selectedDate || isBookingModalOpen) return;

    setIsPolling(true);
    const pollInterval = setInterval(() => {
      fetchSlots();
    }, 8000);

    return () => {
      clearInterval(pollInterval);
      setIsPolling(false);
    };
  }, [selectedVenue, selectedDate, fetchSlots, isBookingModalOpen]);

  // Handle venue change
  const handleVenueChange = (venueId: string) => {
    setSelectedVenue(venueId);
  };

  // Handle date change
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  // Get venue name from ID
  const getVenueName = (venueId: string) => {
    const venue = venues.find((v) => v.id === venueId);
    return venue ? venue.name : "";
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center">
              <CalendarDays className="h-6 w-6 mr-2 text-primary" />
              <CardTitle>Slot Booking</CardTitle>
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
          />
        )}
      </div>
    </main>
  );
}
