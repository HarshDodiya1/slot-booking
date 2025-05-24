"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Day, Venue } from "@/types";

interface VenueSelectorProps {
  venues: Venue[];
  isLoading: boolean;
  selectedVenue: string;
  onVenueChange: (venueId: string) => void;
  days: Day[];
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function VenueSelector({
  venues,
  isLoading,
  selectedVenue,
  onVenueChange,
  days,
  selectedDate,
  onDateChange,
}: VenueSelectorProps) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="p-4 md:p-6 grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="venue">Select Venue</Label>
              <Select
                value={selectedVenue}
                onValueChange={onVenueChange}
                disabled={isLoading || venues.length === 0}
              >
                <SelectTrigger id="venue" className="w-full">
                  <SelectValue placeholder="Select venue" />
                </SelectTrigger>
                <SelectContent>
                  {venues.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id}>
                      {venue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Tabs value={selectedDate} onValueChange={onDateChange} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap rounded-md h-auto p-1">
              {days.map((day) => (
                <TabsTrigger
                  key={day.date}
                  value={day.date}
                  className={cn(
                    "py-2 px-4 flex flex-col items-center min-w-[80px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  )}
                >
                  <span className="font-medium">{day.dayName}</span>
                  <span className="text-lg font-bold">{day.dayNumber}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}