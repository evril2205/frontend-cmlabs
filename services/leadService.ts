import api from './api';
import { Lead, CreateLeadRequest, ApiResponse, LeadListResponse } from '@/types/lead';

/**
 * CREATE LEAD
 * Endpoint: POST /api/leads
 */
export const createLead = async (leadData: CreateLeadRequest): Promise<ApiResponse<Lead>> => {
  try {
    const response = await api.post('/leads', leadData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating lead:', error);
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to create lead',
      error: error.response?.data?.error || error.message,
    };
  }
};


export const addNote = async (leadId: number, noteData: { title: string; content: string }) => {
  try {
    // Validasi sederhana sebelum kirim
    if (!leadId) throw new Error("Lead ID is required");

    const response = await api.post(`/leads/${leadId}/notes`, {
      title: noteData.title || "Untitled Note",
      content: noteData.content,
    });
    return response.data;
  } catch (error: any) {
    // Biar ketahuan errornya kenapa di console
    console.error("Detail Error Backend:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Mengambil semua catatan berdasarkan leadId
 */
export const getNotesByLead = async (leadId: number) => {
  try {
    const response = await api.get(`/leads/${leadId}/notes`);
    return response.data; // Biasanya ini berisi array of notes
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * GET ALL LEADS
 * Endpoint: GET /api/leads
 */
export const getAllLeads = async (): Promise<LeadListResponse> => {
  try {
    const response = await api.get('/leads');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch leads',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * GET LEADS (ALIAS untuk getAllLeads)
 * Untuk kompatibilitas dengan komponen yang pakai nama getLeads
 */
export const getLeads = getAllLeads;

/**
 * GET LEAD BY ID
 * Endpoint: GET /api/leads/:id
 */
export const getLeadById = async (id: number): Promise<ApiResponse<Lead>> => {
  try {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching lead:', error);
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch lead',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * UPDATE LEAD STATUS (untuk Drag & Drop)
 * Endpoint: PATCH /api/leads/:id/status
 */
export const updateLeadStatus = async (
  id: number,
  data: { status: string }
): Promise<ApiResponse<Lead>> => {
  try {
    const response = await api.patch(`/leads/${id}/status`, data);  
    return response.data;
  } catch (error: any) {
    console.error('Error updating lead status:', error);
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to update lead status',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * UPDATE LEAD (Full Update including isArchived)
 * Endpoint: PUT /api/leads/:id
 */
export const updateLead = async (
  id: number,
  leadData: Partial<CreateLeadRequest> & { isArchived?: boolean }
): Promise<ApiResponse<Lead>> => {
  try {
    const response = await api.put(`/leads/${id}`, leadData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating lead:', error);
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to update lead',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * DELETE LEAD
 * Endpoint: DELETE /api/leads/:id
 */
export const deleteLead = async (id: number): Promise<ApiResponse<null>> => {
  try {
    // Gunakan template literal untuk memastikan URL benar
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  } catch (error: any) {
    // Log error lebih detail untuk debugging
    console.error('API Delete Error:', error.response?.data || error.message);
    throw error; // Lempar balik agar ditangkap oleh catch di component
  }
};
 

// ============================================
// MEETINGS SERVICES
// ============================================

export const addMeeting = async (leadId: number, meetingData: any) => {
  try {
    const response = await api.post(`/leads/${leadId}/meetings`, meetingData);
    return response.data;
  } catch (error: any) {
    console.error('Error adding meeting:', error);
    throw error.response?.data || error.message;
  }
};

export const getMeetingsByLead = async (leadId: number) => {
  try {
    const response = await api.get(`/leads/${leadId}/meetings`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching meetings:', error);
    throw error.response?.data || error.message;
  }
};

// ============================================
// CALLS SERVICES
// ============================================

export const addCallLog = async (leadId: number, callData: any) => {
  try {
    const response = await api.post(`/leads/${leadId}/calls`, callData);
    return response.data;
  } catch (error: any) {
    console.error('Error adding call log:', error);
    throw error.response?.data || error.message;
  }
};

export const getCallsByLead = async (leadId: number) => {
  try {
    const response = await api.get(`/leads/${leadId}/calls`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching calls:', error);
    throw error.response?.data || error.message;
  }
};

// ============================================
// TIMELINE SERVICE
// ============================================

export const getLeadTimeline = async (leadId: number) => {
  try {
    const response = await api.get(`/leads/${leadId}/timeline`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching timeline:', error);
    throw error.response?.data || error.message;
  }
};

// ============================================
// SOURCE SERVICES
// ============================================

export const getSourceOrigins = async () => {
  try {
    const response = await api.get('/leads/sources/origins');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching origins:', error);
    throw error.response?.data || error.message;
  }
};

export const getChannelsByOrigin = async (origin: string) => {
  try {
    const response = await api.get(`/leads/sources/channels/${origin}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching channels:', error);
    throw error.response?.data || error.message;
  }
};

export const generateChannelId = async (origin: string, channel: string) => {
  try {
    const response = await api.post('/leads/sources/generate-id', { origin, channel });
    return response.data;
  } catch (error: any) {
    console.error('Error generating channel ID:', error);
    throw error.response?.data || error.message;
  }
};
// ============================================
// FOLLOWING SERVICES
// ============================================

export const followLead = async (leadId: number) => {
  try {
    const response = await api.post(`/leads/${leadId}/follow`);
    return response.data;
  } catch (error: any) {
    console.error('Error following lead:', error);
    throw error.response?.data || error.message;
  }
};

export const unfollowLead = async (leadId: number) => {
  try {
    const response = await api.delete(`/leads/${leadId}/unfollow`);
    return response.data;
  } catch (error: any) {
    console.error('Error unfollowing lead:', error);
    throw error.response?.data || error.message;
  }
};

export const checkFollowing = async (leadId: number) => {
  try {
    const response = await api.get(`/leads/${leadId}/following`);
    return response.data;
  } catch (error: any) {
    console.error('Error checking following:', error);
    throw error.response?.data || error.message;
  }
};
export const updateLeadStatusSequential = async (
  id: number,
  data: { status: string }
): Promise<ApiResponse<Lead>> => {
  try {
    const response = await api.patch(`/leads/${id}/status-sequential`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating lead status sequential:', error);
    // JANGAN buat objek baru di sini jika ingin menangkap err.response di komponen
    // Cukup throw error aslinya agar AxiosError object tetap utuh
    throw error; 
  }
};