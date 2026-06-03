import api from './api';
import { 
  Appointment, 
  CreateAppointmentDto, 
  UpdateAppointmentDto 
} from '../types/appointment.types';
import { PaginatedResponse } from '../types/api.types';

export const appointmentService = {
  getMyAppointments: async (
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Appointment>> => {
    const { data } = await api.get<PaginatedResponse<Appointment>>('/appointments/me', { params });
    return data;
  },

  getArtistAppointments: async (
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Appointment>> => {
    const { data } = await api.get<PaginatedResponse<Appointment>>('/appointments/artist/me', { params });
    return data;
  },

  createAppointment: async (dto: CreateAppointmentDto): Promise<Appointment> => {
    const { data } = await api.post<{data: Appointment}>('/appointments', dto);
    return data.data;
  },

  updateStatus: async (id: string, dto: UpdateAppointmentDto): Promise<Appointment> => {
    const { data } = await api.patch<{data: Appointment}>(`/appointments/${id}/status`, dto);
    return data.data;
  },

  cancelAppointment: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  }
};
