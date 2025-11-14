import { Button } from '@/components/ui/button';
import { authService } from '@/lib/auth';
import { Train, LogOut } from 'lucide-react';

interface HeaderProps {
  user: { email: string; name: string };
  onLogout: () => void;
}

export const Header = ({ user, onLogout }: HeaderProps) => {
  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Train className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Ticket Booking</h1>
            <p className="text-xs text-muted-foreground">Priority + Aging Queue System</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
