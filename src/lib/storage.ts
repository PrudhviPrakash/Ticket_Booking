// LocalStorage management for booking history
export interface BookingRecord {
  requestId: string;
  numSeats: number;
  status: 'confirmed' | 'failed';
  allocatedSeats?: string[];
  message?: string;
  timestamp: number;
  queuePosition?: number;
}

const HISTORY_KEY = 'booking_history';
const MAX_HISTORY_ITEMS = 50;

export const bookingStorage = {
  saveBooking: (record: BookingRecord) => {
    const history = bookingStorage.getHistory();
    history.unshift(record);
    
    // Keep only the most recent items
    const trimmed = history.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  },

  getHistory: (): BookingRecord[] => {
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  clearHistory: () => {
    localStorage.removeItem(HISTORY_KEY);
  },

  getBookingCount: () => {
    return bookingStorage.getHistory().length;
  },

  getSuccessRate: () => {
    const history = bookingStorage.getHistory();
    if (history.length === 0) return 0;
    const confirmed = history.filter(b => b.status === 'confirmed').length;
    return Math.round((confirmed / history.length) * 100);
  },
};

