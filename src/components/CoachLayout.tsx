import { useQuery } from '@tanstack/react-query';
import { bookingApi, CoachLayoutResponse } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Armchair } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CoachLayout = () => {
  const { data: layout, isLoading } = useQuery<CoachLayoutResponse>({
    queryKey: ['coach-layout'],
    queryFn: bookingApi.getCoachLayout,
    refetchInterval: 3000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Armchair className="w-5 h-5" />
            Coach Layout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading seats...</div>
        </CardContent>
      </Card>
    );
  }

  const seats = layout ? Object.entries(layout) : [];
  const rows = 10;
  const seatsPerRow = ['A', 'B', 'C', 'D'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Armchair className="w-5 h-5" />
          Coach Layout
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-500" />
              <span>Processing</span>
            </div>
          </div>

          <div className="space-y-2">
            {Array.from({ length: rows }, (_, rowIndex) => {
              const rowNum = rowIndex + 1;
              return (
                <div key={rowNum} className="flex gap-2 justify-center items-center">
                  <span className="w-8 text-xs text-muted-foreground font-mono">
                    {rowNum}
                  </span>
                  {seatsPerRow.map((seatLetter) => {
                    const seatId = `${rowNum}${seatLetter}`;
                    const seat = layout?.[seatId];
                    const status = seat?.status || 'available';

                    return (
                      <div
                        key={seatId}
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center text-xs font-semibold transition-all duration-300',
                          status === 'available' && 'bg-green-500 text-white',
                          status === 'booked' && 'bg-red-500 text-white',
                          status === 'locked' && 'bg-amber-500 text-white animate-pulse'
                        )}
                        title={`Seat ${seatId} - ${status}`}
                      >
                        {seatLetter}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
