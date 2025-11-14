import { useState, useEffect } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { Header } from '@/components/Header';
import { BookingForm } from '@/components/BookingForm';
import { BookingStatus } from '@/components/BookingStatus';
import { CoachLayout } from '@/components/CoachLayout';
import { BookingHistory } from '@/components/BookingHistory';
import { authService } from '@/lib/auth';

const Index = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState(0);
  const [numSeats, setNumSeats] = useState(0);
  const [historyKey, setHistoryKey] = useState(0);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  if (!user) {
    return <AuthForm onAuthSuccess={() => setUser(authService.getCurrentUser())} />;
  }

  const handleBookingStarted = (requestId: string, position: number, seats: number) => {
    setCurrentRequestId(requestId);
    setQueuePosition(position);
    setNumSeats(seats);
  };

  const handleReset = () => {
    setCurrentRequestId(null);
    setQueuePosition(0);
    setNumSeats(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Header user={user} onLogout={() => setUser(null)} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            {!currentRequestId && (
              <BookingForm onBookingStarted={handleBookingStarted} />
            )}
            {currentRequestId && (
              <BookingStatus
                requestId={currentRequestId}
                queuePosition={queuePosition}
                numSeats={numSeats}
                onReset={handleReset}
                onHistoryUpdate={() => setHistoryKey(prev => prev + 1)}
              />
            )}
            <div key={historyKey}>
              <BookingHistory />
            </div>
          </div>
          
          <div>
            <CoachLayout />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
