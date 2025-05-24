"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slot } from "@/types";
import { BookingForm } from "./booking-form";
import { Check, Clock, X } from "lucide-react";
import { SlotSkeleton } from "./loading-skeleton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface SlotViewerProps {
  slots: Slot[];
  isLoading: boolean;
  selectedVenue: string;
  selectedDate: string;
  venueId: string;
  onRefresh: () => void;
  isPolling: boolean;
}

export function SlotViewer({
  slots,
  isLoading,
  selectedVenue,
  selectedDate,
  venueId,
  onRefresh,
  isPolling,
}: SlotViewerProps) {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Group slots by hour
  const groupedSlots: Record<string, Slot[]> = {};
  
  slots.forEach(slot => {
    const hour = slot.startTime.split(':')[0];
    if (!groupedSlots[hour]) {
      groupedSlots[hour] = [];
    }
    groupedSlots[hour].push(slot);
  });

  // Create an array of hours from 8 AM to 8 PM
  const hours = Array.from({ length: 12 }, (_, i) => (i + 8).toString().padStart(2, '0'));

  // Format time
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${suffix}`;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Available Slots</CardTitle>
            <CardDescription>
              Select a time slot to book
            </CardDescription>
          </div>
          {isPolling && (
            <Badge variant="outline" className="gap-1 animate-pulse">
              <Clock className="h-3 w-3" />
              Refreshing
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SlotSkeleton />
        ) : (
          <div className="space-y-6">
            {hours.map((hour) => (
              <div key={hour} className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {formatTime(`${hour}:00`)}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {groupedSlots[hour]?.map((slot) => (
                    <Dialog key={slot.id} open={isDialogOpen && selectedSlot?.id === slot.id} onOpenChange={(open) => {
                      setIsDialogOpen(open);
                      if (!open) setSelectedSlot(null);
                    }}>
                      <DialogTrigger asChild>
                        <button
                          disabled={slot.isBooked}
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            "p-3 rounded-md text-sm font-medium transition-all",
                            "border border-input hover:border-primary",
                            slot.isBooked 
                              ? "bg-muted text-muted-foreground cursor-not-allowed" 
                              : "bg-card hover:scale-105 hover:shadow-md",
                            "flex justify-between items-center"
                          )}
                        >
                          <span>
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </span>
                          {slot.isBooked ? (
                            <X className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        {selectedSlot && (
                          <BookingForm 
                            slot={selectedSlot}
                            venueId={venueId}
                            date={selectedDate}
                            onSuccess={() => {
                              setIsDialogOpen(false);
                              onRefresh();
                            }}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}