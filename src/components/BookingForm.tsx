import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { bookingApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Ticket } from 'lucide-react';

interface BookingFormProps {
  onBookingStarted: (requestId: string) => void;
}

export const BookingForm = ({ onBookingStarted }: BookingFormProps) => {
  const [numSeats, setNumSeats] = useState(1);
  const { toast } = useToast();

  const bookingMutation = useMutation({
    mutationFn: bookingApi.requestBooking,
    onSuccess: (data) => {
      toast({
        title: 'Booking request submitted',
        description: `Request ID: ${data.requestId}`,
      });
      onBookingStarted(data.requestId);
    },
    onError: () => {
      toast({
        title: 'Booking failed',
        description: 'Unable to submit booking request',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numSeats < 1 || numSeats > 4) {
      toast({
        title: 'Invalid input',
        description: 'Please select between 1 and 4 seats',
        variant: 'destructive',
      });
      return;
    }
    bookingMutation.mutate({ numSeats });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="w-5 h-5" />
          Book Tickets
        </CardTitle>
        <CardDescription>
          Select the number of seats you want to book (1-4 seats)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numSeats">Number of Seats</Label>
            <Input
              id="numSeats"
              type="number"
              min={1}
              max={4}
              value={numSeats}
              onChange={(e) => setNumSeats(parseInt(e.target.value) || 1)}
              disabled={bookingMutation.isPending}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={bookingMutation.isPending}
          >
            {bookingMutation.isPending ? 'Submitting...' : 'Book Now'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
