import { useState, useEffect } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { Header } from '@/components/Header';
import { BookingForm } from '@/components/BookingForm';
import { BookingStatus } from '@/components/BookingStatus';
import { CoachLayout } from '@/components/CoachLayout';
import { authService } from '@/lib/auth';

const Index = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  if (!user) {
    return <AuthForm onAuthSuccess={() => setUser(authService.getCurrentUser())} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Header user={user} onLogout={() => setUser(null)} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            {!currentRequestId && (
              <BookingForm onBookingStarted={setCurrentRequestId} />
            )}
            {currentRequestId && (
              <BookingStatus
                requestId={currentRequestId}
                onReset={() => setCurrentRequestId(null)}
              />
            )}
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
