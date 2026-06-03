import { useState, useCallback } from 'react';
import { Appointment, CreateAppointmentDto, UpdateAppointmentDto } from '../types/appointment.types';
import { appointmentService } from '../services/appointmentService';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyAppointments = useCallback(async (params?: { page?: number; limit?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await appointmentService.getMyAppointments(params);
      setAppointments(response.data);
      setMeta(response.meta);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string }, message?: string } }; message?: string };
      setError(error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Error fetching appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchArtistAppointments = useCallback(async (params?: { page?: number; limit?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await appointmentService.getArtistAppointments(params);
      setAppointments(response.data);
      setMeta(response.meta);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string }, message?: string } }; message?: string };
      setError(error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Error fetching appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAppointment = useCallback(async (dto: CreateAppointmentDto) => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.createAppointment(dto);
      return data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Error creating appointment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (id: string, dto: UpdateAppointmentDto) => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.updateStatus(id, dto);
      setAppointments(prev => prev.map(a => a.id === id ? data : a));
      return data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Error updating appointment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelAppointment = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await appointmentService.cancelAppointment(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Error cancelling appointment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    appointments, 
    meta, 
    loading, 
    error, 
    fetchMyAppointments, 
    fetchArtistAppointments, 
    createAppointment, 
    updateStatus, 
    cancelAppointment 
  };
};
