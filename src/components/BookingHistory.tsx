import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { bookingStorage, BookingRecord } from '@/lib/storage';
import { History, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BookingHistory = () => {
  const [history, setHistory] = useState<BookingRecord[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setHistory(bookingStorage.getHistory());
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all booking history?')) {
      bookingStorage.clearHistory();
      setHistory([]);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Booking History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No booking history yet. Make your first booking!
          </p>
        </CardContent>
      </Card>
    );
  }

  const successRate = bookingStorage.getSuccessRate();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Booking History
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearHistory}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
        <div className="flex gap-4 text-sm mt-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-semibold">{history.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Success Rate:</span>
            <span className={cn(
              "font-semibold",
              successRate >= 70 ? "text-green-600" : successRate >= 40 ? "text-amber-600" : "text-red-600"
            )}>
              {successRate}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {history.map((record) => (
              <div
                key={record.requestId}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-200",
                  record.status === 'confirmed' 
                    ? "bg-green-50 border-green-200 dark:bg-green-950/20" 
                    : "bg-red-50 border-red-200 dark:bg-red-950/20"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {record.status === 'confirmed' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className={cn(
                        "font-semibold text-sm",
                        record.status === 'confirmed' ? "text-green-700" : "text-red-700"
                      )}>
                        {record.status === 'confirmed' ? 'Confirmed' : 'Failed'}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {formatDate(record.timestamp)}
                    </p>
                    
                    <p className="text-sm">
                      <span className="text-muted-foreground">Seats requested:</span>{' '}
                      <span className="font-semibold">{record.numSeats}</span>
                    </p>

                    {record.allocatedSeats && record.allocatedSeats.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {record.allocatedSeats.map((seat) => (
                          <span
                            key={seat}
                            className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded dark:bg-green-900/30 dark:text-green-300"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    )}

                    {record.message && (
                      <p className="text-xs text-red-600 mt-1">{record.message}</p>
                    )}

                    {record.queuePosition !== undefined && (
                      <p className="text-xs text-muted-foreground">
                        Queue position at booking: #{record.queuePosition}
                      </p>
                    )}
                  </div>

                  <span className="text-xs font-mono text-muted-foreground">
                    {record.requestId.slice(0, 8)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
