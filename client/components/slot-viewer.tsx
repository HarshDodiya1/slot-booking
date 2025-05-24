"use client";

import { useState } from "react";
import { Slot } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "./booking-form";
import { RefreshCw, Clock, MapPin, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SlotViewerProps {
  slots: Slot[];
  isLoading: boolean;
  selectedVenue: string;
  selectedDate: string;
  venueId: string;
  onRefresh: () => void;
  isPolling: boolean;
  onModalStateChange: (isOpen: boolean) => void;
}

export function SlotViewer({
  slots,
  isLoading,
  selectedVenue,
  selectedDate,
  venueId,
  onRefresh,
  isPolling,
  onModalStateChange,
}: SlotViewerProps) {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${suffix}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSlotSelect = (slot: Slot) => {
    if (!slot.isBooked) {
      setSelectedSlot(slot);
      setIsModalOpen(true);
      onModalStateChange(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
    onModalStateChange(false);
  };

  const handleBookingSuccess = () => {
    handleModalClose();
    onRefresh();
  };

  const availableSlots = slots.filter(slot => !slot.isBooked);
  const bookedSlots = slots.filter(slot => slot.isBooked);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Loading Slots...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="h-16 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="space-y-2">
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {selectedVenue}
                </CardTitle>
                <p className="flex items-center text-muted-foreground text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(selectedDate)}
                </p>
              </div>
              
              <Button
                onClick={onRefresh}
                variant="outline"
                size="sm"
                disabled={isPolling}
                className="flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isPolling ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Available Slots Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Available Slots
              </div>
              <Badge variant="secondary">
                {availableSlots.length} available, {bookedSlots.length} booked
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {slots.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Slots Available</h3>
                <p className="text-muted-foreground">
                  There are no slots available for the selected venue and date.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {slots.map((slot) => (
                  <Button
                    key={slot.id}
                    onClick={() => handleSlotSelect(slot)}
                    variant={slot.isBooked ? "secondary" : "outline"}
                    disabled={slot.isBooked}
                    className="h-auto p-4 flex flex-col items-center space-y-1"
                  >
                    <span className="font-medium">
                      {formatTime(slot.startTime)}
                    </span>
                    {slot.isBooked ? (
                      <Badge variant="secondary" className="text-xs">
                        Booked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Available
                      </Badge>
                    )}
                    {slot.isBooked && slot.booking && (
                      <span className="text-xs text-muted-foreground truncate w-full">
                        {slot.booking.userName}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Slot</DialogTitle>
          </DialogHeader>
          {selectedSlot && (
            <BookingForm
              slot={selectedSlot}
              venueId={venueId}
              date={selectedDate}
              onSuccess={handleBookingSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
