"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bookSlot, getSports } from "@/lib/api";
import { Slot } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Confetti } from "./confetti";

const formSchema = z.object({
  playerName: z.string().min(2, {
    message: "Player name must be at least 2 characters.",
  }),
  sport: z.string().min(1, {
    message: "Please select a sport.",
  }),
});

interface BookingFormProps {
  slot: Slot;
  venueId: string;
  date: string;
  onSuccess: () => void;
}

export function BookingForm({ slot, venueId, date, onSuccess }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sports, setSports] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${suffix}`;
  };

  useEffect(() => {
    const loadSports = async () => {
      try {
        const sportsData = await getSports();
        setSports(sportsData);
      } catch (error) {
        toast.error("Failed to load sports");
      } finally {
        setIsLoading(false);
      }
    };

    loadSports();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerName: "",
      sport: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await bookSlot(slot.id, values.playerName, values.sport);
      
      if (result.success) {
        setShowConfetti(true);
        toast.success(result.message);
        
        // Hide confetti after 3 seconds and then call onSuccess
        setTimeout(() => {
          setShowConfetti(false);
          setTimeout(() => {
            onSuccess();
          }, 500);
        }, 3000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while booking the slot");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 relative">
      {/* Confetti positioned absolutely to cover the modal */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti />
        </div>
      )}
      
      {/* Slot Time Display */}
      <div className="text-center p-3 bg-muted rounded-lg">
        <div className="flex items-center justify-center space-x-2">
          <Clock className="h-4 w-4" />
          <span className="font-medium">
            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
          </span>
        </div>
      </div>

      {/* Booking Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="playerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Player Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your name" 
                    {...field} 
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sport</FormLabel>
                <Select
                  disabled={isLoading || isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sport" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sports.map((sport) => (
                      <SelectItem key={sport.id} value={sport.name}>
                        {sport.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Booking...
              </>
            ) : (
              "Book Slot"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
