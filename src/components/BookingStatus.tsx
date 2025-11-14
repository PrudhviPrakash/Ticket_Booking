import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { bookingApi } from '@/lib/api';
import { bookingStorage } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingStatusProps {
  requestId: string | null;
  queuePosition: number;
  numSeats: number;
  onReset: () => void;
  onHistoryUpdate: () => void;
}

export const BookingStatus = ({ requestId, queuePosition, numSeats, onReset, onHistoryUpdate }: BookingStatusProps) => {
  const [waitTime, setWaitTime] = useState(0);
  const [hasSaved, setHasSaved] = useState(false);

  const { data: status, isLoading } = useQuery({
    queryKey: ['booking-status', requestId],
    queryFn: () => bookingApi.getBookingStatus(requestId!),
    enabled: !!requestId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'confirmed' || data?.status === 'failed') {
        return false;
      }
      return 2000;
    },
  });

  // Track wait time
  useEffect(() => {
    const interval = setInterval(() => {
      setWaitTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save to history when booking completes
  useEffect(() => {
    if (status && !hasSaved && (status.status === 'confirmed' || status.status === 'failed')) {
      bookingStorage.saveBooking({
        requestId: requestId!,
        numSeats,
        status: status.status,
        allocatedSeats: status.allocatedSeats,
        message: status.message,
        timestamp: Date.now(),
        queuePosition,
      });
      setHasSaved(true);
      onHistoryUpdate();
    }
  }, [status, hasSaved, requestId, numSeats, queuePosition, onHistoryUpdate]);

  if (!requestId) return null;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPending = status?.status === 'pending' || status?.status === 'processing';
  const isConfirmed = status?.status === 'confirmed';
  const isFailed = status?.status === 'failed';

  const formatWaitTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <Card className={cn(
      'transition-all duration-300',
      isConfirmed && 'border-green-500',
      isFailed && 'border-red-500'
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isPending && <Clock className="w-5 h-5 text-amber-500 animate-pulse" />}
          {isConfirmed && <CheckCircle className="w-5 h-5 text-green-500" />}
          {isFailed && <XCircle className="w-5 h-5 text-red-500" />}
          Booking Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Request ID: <span className="font-mono">{requestId}</span>
          </p>
          
          {isPending && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing your request... Please wait.</span>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/20 dark:border-blue-900">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Queue Position</p>
                    <div className="flex items-center gap-1 font-semibold text-primary">
                      <Users className="w-4 h-4" />
                      <span>#{queuePosition}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Wait Time</p>
                    <div className="flex items-center gap-1 font-semibold text-primary">
                      <Clock className="w-4 h-4" />
                      <span>{formatWaitTime(waitTime)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Seats Requested</p>
                    <p className="font-semibold">{numSeats}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Status</p>
                    <p className="font-semibold capitalize">{status?.status || 'Pending'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isConfirmed && status.allocatedSeats && (
            <div className="space-y-2">
              <p className="text-green-600 font-semibold">✓ Booking Confirmed!</p>
              <div className="flex flex-wrap gap-2">
                {status.allocatedSeats.map((seat) => (
                  <div
                    key={seat}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-lg font-semibold"
                  >
                    {seat}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isFailed && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 font-semibold">✗ Booking Failed</p>
              <p className="text-sm text-red-700 mt-1">
                {status.message || 'Unable to allocate seats'}
              </p>
            </div>
          )}
        </div>

        {(isConfirmed || isFailed) && (
          <Button onClick={onReset} className="w-full">
            Book Another Ticket
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
