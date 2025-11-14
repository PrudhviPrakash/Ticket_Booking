// API client for the booking server
const API_BASE_URL = 'http://localhost:3000';

export interface BookingRequest {
  numSeats: number;
}

export interface BookingResponse {
  requestId: string;
  status: 'pending';
  message: string;
  totalInQueue: number;
}

export interface BookingStatusResponse {
  requestId: string;
  status: 'pending' | 'processing' | 'confirmed' | 'failed';
  allocatedSeats?: string[];
  message?: string;
}

export interface CoachLayoutResponse {
  [seatId: string]: {
    status: 'available' | 'locked' | 'booked';
    bookingId: string | null;
  };
}

export const bookingApi = {
  requestBooking: async (data: BookingRequest): Promise<BookingResponse> => {
    const response = await fetch(`${API_BASE_URL}/request-booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to request booking');
    return response.json();
  },

  getBookingStatus: async (requestId: string): Promise<BookingStatusResponse> => {
    const response = await fetch(`${API_BASE_URL}/booking-status/${requestId}`);
    if (!response.ok) throw new Error('Failed to get booking status');
    return response.json();
  },

  getCoachLayout: async (): Promise<CoachLayoutResponse> => {
    const response = await fetch(`${API_BASE_URL}/coach-layout`);
    if (!response.ok) throw new Error('Failed to get coach layout');
    return response.json();
  },
};
