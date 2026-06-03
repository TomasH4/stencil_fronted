export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export interface Appointment {
  id: string;
  clientId: string;
  artistProfileId: string;
  date: string;
  status: AppointmentStatus;
  notes?: string | null;
  createdAt: string;
  clientName?: string; // Optional for display
  artistName?: string; // Optional for display
}

export interface CreateAppointmentDto {
  artistProfileId: string;
  date: string;
  notes?: string;
}

export interface UpdateAppointmentDto {
  status: AppointmentStatus;
  notes?: string;
}
