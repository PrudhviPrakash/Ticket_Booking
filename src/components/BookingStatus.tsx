import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingStatusProps {
  requestId: string | null;
  onReset: () => void;
}

export const BookingStatus = ({ requestId, onReset }: BookingStatusProps) => {
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
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Request ID: <span className="font-mono">{requestId}</span>
          </p>
          
          {isPending && (
            <div className="flex items-center gap-2 text-amber-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing your request... Please wait.</span>
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
