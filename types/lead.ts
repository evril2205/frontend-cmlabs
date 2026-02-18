// Enum untuk Lead Status (sesuai Prisma schema)
export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  DEMO_SCHEDULED = 'DEMO_SCHEDULED',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CONTRACT_SENT = 'CONTRACT_SENT',
  WON = 'WON',
  LOST = 'LOST',
}

// Interface untuk Lead (sesuai dengan Prisma schema)
export interface Lead {
  teamMembers: never[];
  pipelineStatus: string;
  pic: any;
  id?: number;
  
  // ==========================================
  // SUMMARY SECTION
  // ==========================================
  title?: string;             // Nullable di Prisma
  dealValue?: number;         // Nullable di Prisma (Decimal di DB)
  currency?: string;          // Default: "IDR"
  status?: LeadStatus;        // Default: NEW
  companyName?: string;
  contactPerson?: string;
  
  // ✅ TAMBAHAN FRONTEND
  label?: string;             // Hot, Warm, Cold
  priority?: string;          // High Priority, Medium, Low
  clientType?: string;        // New Client, Existing Client
  dueDate?: string | Date;    
  description?: string;
  
  // ==========================================
  // SOURCE SECTION
  // ==========================================
  sourceOrigin?: string;
  sourceChannel?: string;
  sourceChannelId?: string;
  
  // ==========================================
  // PERSON SECTION
  // ==========================================
  personName?: string;
  personPhone?: string;
  personEmail?: string;
  personLabel?: string;       // ✅ Decision Maker, Influencer, etc
  
  // ==========================================
  // COMPANY DETAIL SECTION
  // ==========================================
  companyEmail?: string;      // ✅ TAMBAHAN
  companyStreet?: string;     // ✅ TAMBAHAN
  companyCity?: string;       // ✅ TAMBAHAN
  companyState?: string;      // ✅ TAMBAHAN
  companyPostalCode?: string; // ✅ TAMBAHAN
  companyCountry?: string;    // ✅ TAMBAHAN
  
  // Relations
  picId?: number;             
  
  // Timestamps (dari backend)
  isArchived?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Interface untuk Create Lead Request (yang dikirim ke backend)
export interface CreateLeadRequest {
  // Summary
  title?: string;
  dealValue?: number;
  currency?: string;
  status?: LeadStatus | string;
  companyName?: string;
  contactPerson?: string;
  
  // Frontend fields
  label?: string;
  priority?: string;       
  clientType?: string;       
  dueDate?: string;
  description?: string;
  
  // Source
  sourceOrigin?: string;
  sourceChannel?: string;
  sourceChannelId?: string;
  
  // Person
  personName?: string;
  personPhone?: string;
  personEmail?: string;
  personLabel?: string;       // ✅ TAMBAHAN
  
  // Company Detail
  companyEmail?: string;      // ✅ TAMBAHAN
  companyStreet?: string;     // ✅ TAMBAHAN
  companyCity?: string;       // ✅ TAMBAHAN
  companyState?: string;      // ✅ TAMBAHAN
  companyPostalCode?: string; // ✅ TAMBAHAN
  companyCountry?: string;    // ✅ TAMBAHAN
  
  // Relations
  picId?: number;
  isArchived?: boolean;
  pipelineStatus?: string; 

}

// Interface untuk Response dari Backend
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Interface untuk List Response (dengan pagination)
export interface LeadListResponse {
  success: boolean;
  data: Lead[];
  total?: number;
  page?: number;
  limit?: number;
}