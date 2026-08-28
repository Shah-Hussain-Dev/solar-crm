import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'sales' | 'technician';
  active: boolean;
  avatar: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string;
}

export interface Activity {
  id: string;
  type: 'stage_change' | 'note' | 'call' | 'whatsapp' | 'email' | 'survey' | 'quote' | 'payment' | 'ticket';
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  stageId: string;
  value: number;
  notes: Note[];
  activities: Activity[];
  source: string;
  assigneeId: string;
  createdAt: string;
  lostReason?: string;
  industryData: {
    monthlyBill?: number;
    roofType?: string;
    solarCapacityKwNeeded?: number;
    notes?: string;
    [key: string]: any; // custom fields support
  };
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  position: number;
}

export interface PipelineDefinition {
  id: string;
  name: string;
  stages: PipelineStage[];
}

export interface Survey {
  id: string;
  leadId: string;
  technicianId: string;
  status: 'pending' | 'completed';
  scheduledDate: string;
  address: string;
  gps?: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  answers: {
    shading: string;
    connectionType: string;
    roofType: string;
    monthlyBill: number;
    structureRequired: string;
    estimatedCapacityKw: number;
    [key: string]: any; // custom fields support
  };
  photos: string[]; // base64 or urls
  summary?: string;
  synced?: boolean;
}

export interface QuotationItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  total: number;
}

export interface Quotation {
  id: string;
  leadId: string;
  title: string;
  version: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  subsidy: number;
  gst: number;
  grandTotal: number;
  createdAt: string;
  sentAt?: string;
}

export interface Milestone {
  name: string;
  status: 'pending' | 'completed';
  completedAt?: string;
  completedBy?: string;
  proofPhoto?: string;
}

export interface Project {
  id: string;
  leadId: string;
  customerId: string;
  name: string;
  status: 'planning' | 'installing' | 'inspection' | 'subsidy-pending' | 'completed';
  systemSizeKw: number;
  milestones: Milestone[];
  assignedTeam: string[]; // user IDs
  value: number;
  outstandingAmount: number;
  subsidyId?: string;
}

export interface DocumentChecklistItem {
  name: string;
  uploaded: boolean;
  fileUrl?: string;
}

export interface SubsidyTracker {
  id: string;
  projectId: string;
  leadId: string;
  status: 'not-applied' | 'applied' | 'documents-uploaded' | 'approved' | 'disbursed';
  statusHistory: {
    status: string;
    updatedAt: string;
    updatedBy: string;
  }[];
  documentChecklist: DocumentChecklistItem[];
  approvedAmount: number;
  reminderDate?: string;
}

export interface PaymentInstallment {
  id: string;
  projectId: string;
  customerId?: string;
  title?: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  paidDate?: string;
  paymentMode?: 'cash' | 'bank_transfer' | 'cheque' | 'upi';
  referenceNo?: string;
  method?: string;
}

export interface Ticket {
  id: string;
  projectId: string;
  customerId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'assigned' | 'resolved' | 'closed';
  assigneeId: string;
  resolutionNotes?: string;
  createdAt: string;
  dueDate: string;
}

export interface AMCRecord {
  id: string;
  customerId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring-soon' | 'expired';
  value: number;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  activeProjects: string[];
  totalPaid: number;
  totalOutstanding: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: 'lead_won' | 'milestone_complete' | 'payment_overdue';
  action: 'create_task' | 'send_notification' | 'generate_invoice' | 'reassign_owner';
  active: boolean;
  target?: string;
}

export interface CustomField {
  id: string;
  module: 'lead' | 'survey' | 'project';
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  required: boolean;
  options?: string[];
}

export interface BrandingSettings {
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderRadius: string;
  logoUrl: string;
  activeTemplate?: 'solar' | 'hvac' | 'construction';
  language?: 'en' | 'hi';
}

export interface RolePermissions {
  leads: string[]; // 'read' | 'write' | 'delete'
  quotes: string[];
  surveys: string[];
  subsidy: string[];
  payments: string[];
  tickets: string[];
  settings: string[];
}

export interface PermissionMatrix {
  admin: RolePermissions;
  manager: RolePermissions;
  sales: RolePermissions;
  technician: RolePermissions;
}

// Initial Seed Data
const defaultUsers: User[] = [
  { id: 'usr-1', name: 'Amit Sharma', email: 'amit@solarflow.com', role: 'admin', active: true, avatar: 'AS' },
  { id: 'usr-2', name: 'Vikram Singh', email: 'vikram@solarflow.com', role: 'manager', active: true, avatar: 'VS' },
  { id: 'usr-3', name: 'Rajesh Kumar', email: 'rajesh@solarflow.com', role: 'sales', active: true, avatar: 'RK' },
  { id: 'usr-4', name: 'Sanjay Dutt', email: 'sanjay@solarflow.com', role: 'technician', active: true, avatar: 'SD' },
  { id: 'usr-5', name: 'Priya Patel', email: 'priya@solarflow.com', role: 'sales', active: true, avatar: 'PP' },
];

const defaultProducts: Product[] = [
  { id: 'prod-1', name: 'Solar Panels Mono 500W', category: 'Panels', price: 18000, unit: 'pcs', description: 'High efficiency monocrystalline solar panels.' },
  { id: 'prod-2', name: 'Grid-Tie Inverter 5kW', category: 'Inverters', price: 45000, unit: 'pcs', description: 'Smart grid tie inverter with wifi logging.' },
  { id: 'prod-3', name: 'Hybrid Inverter 3kW', category: 'Inverters', price: 65000, unit: 'pcs', description: 'Supports battery backup and grid-tie features.' },
  { id: 'prod-4', name: 'Mounting Structure (per kW)', category: 'Structure', price: 5000, unit: 'kW', description: 'Aluminum anodized roof mounts.' },
  { id: 'prod-5', name: 'DC/AC Cable Set (per kW)', category: 'Cables', price: 2500, unit: 'kW', description: 'Double insulated solar cables + conduits.' },
  { id: 'prod-6', name: 'Installation & Liasoning', category: 'Service', price: 15000, unit: 'system', description: 'Labor and net-metering approvals fee.' },
];

const defaultPipeline: PipelineDefinition = {
  id: 'pip-1',
  name: 'Standard Solar Pipeline',
  stages: [
    { id: 'stg-incoming', name: 'Incoming', color: '#64748b', position: 1 },
    { id: 'stg-contacted', name: 'Contacted', color: '#0284c7', position: 2 },
    { id: 'stg-survey', name: 'Site Survey', color: '#f59e0b', position: 3 },
    { id: 'stg-quote', name: 'Quote Sent', color: '#4f46e5', position: 4 },
    { id: 'stg-negotiation', name: 'Negotiation', color: '#8b5cf6', position: 5 },
    { id: 'stg-won', name: 'Won', color: '#16a34a', position: 6 },
    { id: 'stg-lost', name: 'Lost', color: '#dc2626', position: 7 },
  ],
};

const defaultLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Amit Verma',
    company: 'Verma Residence',
    email: 'vermarahul@gmail.com',
    phone: '9012345678',
    stageId: 'stg-quote',
    value: 168000,
    notes: [
      { id: 'n-1', content: 'Customer requested quotation for 5kW system for residence in Dharampeth, Nagpur.', createdBy: 'usr-3', createdAt: '2026-05-01T10:00:00Z' }
    ],
    activities: [
      { id: 'a-1', type: 'stage_change', content: 'Lead moved to Stage: Quote Sent', createdBy: 'usr-3', createdAt: '2026-05-01T10:00:00Z' }
    ],
    source: 'Walk-in',
    assigneeId: 'usr-3',
    createdAt: '2026-05-01T10:00:00Z',
    industryData: { monthlyBill: 5000, roofType: 'Owned', state: 'Maharashtra', city: 'Nagpur', address: 'Flat 302, Shanti Residency, MG Road, Dharampeth, Nagpur, Maharashtra' }
  },
  {
    id: 'lead-2',
    name: 'Akash Patil',
    company: 'Patil Enterprise',
    email: 'akash.patil@gmail.com',
    phone: '9999888874',
    stageId: 'stg-quote',
    value: 221350,
    notes: [
      { id: 'n-2', content: 'Site survey completed. 3.5kW system recommended.', createdBy: 'usr-2', createdAt: '2026-05-02T11:30:00Z' }
    ],
    activities: [
      { id: 'a-2', type: 'stage_change', content: 'Lead moved to Stage: Quote Sent', createdBy: 'usr-2', createdAt: '2026-05-02T11:30:00Z' }
    ],
    source: 'Google Ads',
    assigneeId: 'usr-2',
    createdAt: '2026-05-02T09:15:00Z',
    industryData: { monthlyBill: 3500, roofType: 'Concrete Flat Roof', state: 'Maharashtra', city: 'Mumbai', address: 'Mumbai, Maharashtra', followUpDate: '2026-05-07' }
  },
  {
    id: 'lead-3',
    name: 'Maya Sexton',
    company: 'Sexton House',
    email: 'maya.sexton@gmail.com',
    phone: '9888877777',
    stageId: 'stg-quote',
    value: 218400,
    notes: [
      { id: 'n-3', content: 'Quote sent. Waiting for subsidy documentation approval.', createdBy: 'usr-5', createdAt: '2026-05-03T14:20:00Z' }
    ],
    activities: [
      { id: 'a-3', type: 'stage_change', content: 'Quotation QT-202605061124 sent to customer', createdBy: 'usr-5', createdAt: '2026-05-03T14:20:00Z' }
    ],
    source: 'Website Lead',
    assigneeId: 'usr-5',
    createdAt: '2026-05-03T16:40:00Z',
    industryData: { monthlyBill: 43, roofType: 'Tiles Pitch Roof', state: 'Other', city: 'Dicta aut non omnis', address: 'Dicta aut non omnis, Other', followUpDate: '2026-10-06' }
  },
  {
    id: 'lead-4',
    name: 'Robert Pierce',
    company: 'Pierce Villa',
    email: 'robert.pierce@gmail.com',
    phone: '9999988888',
    stageId: 'stg-quote',
    value: 254950,
    notes: [
      { id: 'n-4', content: 'Quotation sent. Customer requested financing details.', createdBy: 'usr-3', createdAt: '2026-05-04T12:00:00Z' }
    ],
    activities: [
      { id: 'a-4', type: 'stage_change', content: 'Lead moved to Stage: Quote Sent', createdBy: 'usr-3', createdAt: '2026-05-04T12:00:00Z' }
    ],
    source: 'Referral',
    assigneeId: 'usr-3',
    createdAt: '2026-05-04T10:00:00Z',
    industryData: { monthlyBill: 49, roofType: 'Concrete Flat Roof', state: 'Maharashtra', city: 'Aut ut molestiae cup', address: 'Aut ut molestiae cup, Maharashtra', followUpDate: '2026-08-27' }
  },
  {
    id: 'lead-5',
    name: 'Suresh Gupta',
    company: 'Gupta Traders',
    email: 'suresh.gupta@gmail.com',
    phone: '9777777777',
    stageId: 'stg-survey',
    value: 180000,
    notes: [
      { id: 'n-5', content: 'Site survey scheduled for Friday.', createdBy: 'usr-5', createdAt: '2026-05-05T17:00:00Z' }
    ],
    activities: [
      { id: 'a-5', type: 'stage_change', content: 'Lead moved to Stage: Survey Scheduled', createdBy: 'usr-5', createdAt: '2026-05-05T17:00:00Z' }
    ],
    source: 'Facebook Lead',
    assigneeId: 'usr-5',
    createdAt: '2026-05-05T11:00:00Z',
    industryData: { monthlyBill: 6000, roofType: 'Tin Shed Pitch Roof', state: 'Delhi', city: 'Delhi', address: 'Delhi', followUpDate: '2026-05-07' }
  },
  {
    id: 'lead-6',
    name: 'Sneha Kulkarni',
    company: 'Kulkarni Residence',
    email: 'sneha.k@gmail.com',
    phone: '9666655555',
    stageId: 'stg-won',
    value: 168000,
    notes: [
      { id: 'n-6', content: '28kW system project commissioned successfully.', createdBy: 'usr-1', createdAt: '2026-05-06T10:00:00Z' }
    ],
    activities: [
      { id: 'a-6', type: 'stage_change', content: 'Lead marked WON', createdBy: 'usr-1', createdAt: '2026-05-06T10:00:00Z' }
    ],
    source: 'Direct Walkin',
    assigneeId: 'usr-1',
    createdAt: '2026-05-01T10:00:00Z',
    industryData: { monthlyBill: 5000, roofType: 'Concrete Flat Roof', state: 'Maharashtra', city: 'Pune', address: 'Pune, Maharashtra' }
  }
];

const defaultSurveys: Survey[] = [
  {
    id: 'srv-1',
    leadId: 'lead-2',
    technicianId: 'usr-4',
    status: 'pending',
    scheduledDate: '2026-06-14',
    address: 'Plot 42, Green Farms Lane, Najafgarh, New Delhi',
    answers: {
      shading: 'None',
      connectionType: 'Three Phase',
      roofType: 'Tin Shed Pitch Roof',
      monthlyBill: 25000,
      structureRequired: 'Standard High Raise Structure',
      estimatedCapacityKw: 10
    },
    photos: [],
    synced: true
  }
];

const defaultQuotes: Quotation[] = [
  {
    id: 'qte-1',
    leadId: 'lead-3',
    title: '3kW Residential Solar Setup',
    version: 1,
    status: 'sent',
    items: [
      { productId: 'prod-1', name: 'Solar Panels Mono 500W', qty: 6, price: 18000, total: 108000 },
      { productId: 'prod-3', name: 'Hybrid Inverter 3kW', qty: 1, price: 65000, total: 65000 },
      { productId: 'prod-4', name: 'Mounting Structure (per kW)', qty: 3, price: 5000, total: 15000 },
      { productId: 'prod-5', name: 'DC/AC Cable Set (per kW)', qty: 3, price: 2500, total: 7500 },
      { productId: 'prod-6', name: 'Installation & Liasoning', qty: 1, price: 15000, total: 15000 }
    ],
    subtotal: 210500,
    discount: 10500,
    subsidy: 43200, // Government subsidy
    gst: 10000,
    grandTotal: 166800,
    createdAt: '2026-06-09T14:10:00Z',
    sentAt: '2026-06-09T14:20:00Z'
  }
];

const defaultProjects: Project[] = [
  {
    id: 'prj-1',
    leadId: 'lead-4',
    customerId: 'cust-1',
    name: 'Devender Yadav 30kW Cold Storage Solar',
    status: 'installing',
    systemSizeKw: 30,
    milestones: [
      { name: 'Site Survey & Approval', status: 'completed', completedAt: '2026-06-02T11:00:00Z', completedBy: 'usr-4' },
      { name: 'Structure Installation', status: 'completed', completedAt: '2026-06-08T15:30:00Z', completedBy: 'usr-4' },
      { name: 'Module Placement & Wiring', status: 'pending' },
      { name: 'Inverter Commissioning', status: 'pending' },
      { name: 'Net Metering Approval', status: 'pending' }
    ],
    assignedTeam: ['usr-4', 'usr-2'],
    value: 1200000,
    outstandingAmount: 400000,
    subsidyId: 'sub-1'
  }
];

const defaultCustomers = [
  {
    id: 'cust-1',
    name: 'Devender Yadav',
    company: 'Yadav Cold Storage',
    email: 'devender@yadavcold.com',
    phone: '9999988888',
    address: 'Sector 5, Industrial Area, Bawana, Delhi',
    activeProjects: ['prj-1'],
    totalPaid: 800000,
    totalOutstanding: 400000
  }
];

const defaultSubsidies: SubsidyTracker[] = [
  {
    id: 'sub-1',
    projectId: 'prj-1',
    leadId: 'lead-4',
    status: 'applied',
    statusHistory: [
      { status: 'applied', updatedAt: '2026-06-05T14:00:00Z', updatedBy: 'usr-2' }
    ],
    documentChecklist: [
      { name: 'Electricity Bill', uploaded: true, fileUrl: 'bill.pdf' },
      { name: 'Aadhaar Card / Pan Card', uploaded: true, fileUrl: 'id_proof.pdf' },
      { name: 'Roof Photos (Before)', uploaded: true, fileUrl: 'roof.jpg' },
      { name: 'NOC from Electricity Board', uploaded: false }
    ],
    approvedAmount: 148000,
    reminderDate: '2026-06-20'
  }
];

const defaultPayments: PaymentInstallment[] = [
  {
    id: 'pmt-1',
    projectId: 'prj-1',
    customerId: 'cust-1',
    title: 'Booking Advance (10%)',
    amount: 120000,
    status: 'paid',
    dueDate: '2026-06-01',
    paidDate: '2026-06-01',
    paymentMode: 'bank_transfer',
    referenceNo: 'TXN878932789237'
  },
  {
    id: 'pmt-2',
    projectId: 'prj-1',
    customerId: 'cust-1',
    title: 'Material Delivery (60%)',
    amount: 680000,
    status: 'paid',
    dueDate: '2026-06-05',
    paidDate: '2026-06-05',
    paymentMode: 'bank_transfer',
    referenceNo: 'TXN87893902348'
  },
  {
    id: 'pmt-3',
    projectId: 'prj-1',
    customerId: 'cust-1',
    title: 'Commissioning & Handover (30%)',
    amount: 400000,
    status: 'pending',
    dueDate: '2026-06-25'
  }
];

const defaultTickets: Ticket[] = [
  {
    id: 'tkt-1',
    projectId: 'prj-1',
    customerId: 'cust-1',
    title: 'Inverter communication error (Wifi module)',
    description: 'The grid inverter is producing power, but the mobile app data logger shows offline. Need technician to check signal strength and reconnect.',
    priority: 'medium',
    status: 'open',
    assigneeId: 'usr-4',
    createdAt: '2026-06-11T09:00:00Z',
    dueDate: '2026-06-15'
  }
];

const defaultAmc: AMCRecord[] = [
  {
    id: 'amc-1',
    customerId: 'cust-1',
    startDate: '2026-06-01',
    endDate: '2027-05-31',
    status: 'active',
    value: 25000
  }
];

const defaultCustomFields: CustomField[] = [
  { id: 'cf-1', module: 'lead', name: 'monthlyBill', label: 'Monthly Electricity Bill (₹)', type: 'number', required: true },
  { id: 'cf-2', module: 'lead', name: 'roofType', label: 'Roof Type', type: 'select', required: true, options: ['Concrete Flat Roof', 'Tin Shed Pitch Roof', 'Industrial Tin Roof', 'Ground Mount'] },
  { id: 'cf-3', module: 'lead', name: 'solarCapacityKwNeeded', label: 'Recommended Capacity (kW)', type: 'number', required: false },
];

const defaultBranding: BrandingSettings = {
  companyName: 'SolarFlow CRM',
  primaryColor: '#1d4ed8', // Deep Blue
  secondaryColor: '#4f46e5', // Indigo
  accentColor: '#f59e0b', // Solar Amber
  borderRadius: '8px',
  logoUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=60&auto=format&fit=crop&q=80',
  activeTemplate: 'solar',
  language: 'en',
};

const defaultAutomations: AutomationRule[] = [
  { id: 'auto-1', name: 'Auto-create survey task when lead moves to Qualified', trigger: 'lead_won', action: 'create_task', active: true, target: 'Site Survey Feasibility Check' },
  { id: 'auto-2', name: 'Alert account owner when installment payment is overdue', trigger: 'payment_overdue', action: 'send_notification', active: true, target: 'Payment Reminder Notification' },
];

const defaultPermissions: PermissionMatrix = {
  admin: {
    leads: ['read', 'write', 'delete'],
    quotes: ['read', 'write', 'delete'],
    surveys: ['read', 'write', 'delete'],
    subsidy: ['read', 'write', 'delete'],
    payments: ['read', 'write', 'delete'],
    tickets: ['read', 'write', 'delete'],
    settings: ['read', 'write', 'delete'],
  },
  manager: {
    leads: ['read', 'write'],
    quotes: ['read', 'write'],
    surveys: ['read', 'write'],
    subsidy: ['read', 'write'],
    payments: ['read'],
    tickets: ['read', 'write'],
    settings: ['read'],
  },
  sales: {
    leads: ['read', 'write'],
    quotes: ['read', 'write'],
    surveys: ['read'],
    subsidy: [],
    payments: [],
    tickets: ['read'],
    settings: [],
  },
  technician: {
    leads: [],
    quotes: [],
    surveys: ['read', 'write'],
    subsidy: [],
    payments: [],
    tickets: ['read', 'write'],
    settings: [],
  },
};

// Zustand interface
interface CRMState {
  users: User[];
  products: Product[];
  leads: Lead[];
  pipeline: PipelineDefinition;
  surveys: Survey[];
  quotes: Quotation[];
  projects: Project[];
  customers: Customer[];
  subsidies: SubsidyTracker[];
  payments: PaymentInstallment[];
  tickets: Ticket[];
  amc: AMCRecord[];
  customFields: CustomField[];
  branding: BrandingSettings;
  permissions: PermissionMatrix;
  automations: AutomationRule[];
  offlineQueue: { id: string; type: string; payload: any; timestamp: number }[];

  // Mutators/Actions
  setBranding: (branding: Partial<BrandingSettings>) => void;
  updateBranding: (branding: Partial<BrandingSettings>) => void;
  updateRolePermissions: (role: keyof PermissionMatrix, module: keyof RolePermissions, perms: string[]) => void;
  
  // Custom Fields
  addCustomField: (field: Omit<CustomField, 'id'>) => void;
  deleteCustomField: (id: string) => void;
  
  // Products
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Pipeline stages
  addPipelineStage: (name: string, color: string) => void;
  deletePipelineStage: (id: string) => void;
  updatePipelineStageName: (id: string, name: string) => void;

  // Core CRM
  addLead: (lead: Omit<Lead, 'id' | 'notes' | 'activities' | 'createdAt'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  moveLeadStage: (leadId: string, fromStageId: string, toStageId: string, user: string) => void;
  addLeadNote: (leadId: string, content: string, createdBy: string) => void;
  addLeadActivity: (leadId: string, type: Activity['type'], content: string, createdBy: string) => void;

  addSurvey: (survey: Omit<Survey, 'id' | 'synced'>) => void;
  updateSurvey: (id: string, updates: Partial<Survey>) => void;

  addQuote: (quote: Omit<Quotation, 'id' | 'createdAt'>) => Quotation;
  updateQuoteStatus: (id: string, status: Quotation['status']) => void;

  updateProjectMilestone: (projectId: string, milestoneName: string, status: 'pending' | 'completed', user: string, proofPhoto?: string) => void;
  updateProjectStatus: (id: string, status: Project['status']) => void;

  addPayment: (payment: Omit<PaymentInstallment, 'id'>) => void;
  recordPaymentReceipt: (id: string, amount: number, mode: PaymentInstallment['paymentMode'], ref: string, user: string) => void;

  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => void;
  resolveTicket: (id: string, resolutionNotes: string) => void;
  assignTicket: (id: string, assigneeId: string) => void;

  // Customers CRUD
  addCustomer: (customer: Omit<Customer, 'id' | 'activeProjects' | 'totalPaid' | 'totalOutstanding'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Automations CRUD
  addAutomationRule: (rule: Omit<AutomationRule, 'id' | 'active'>) => void;
  toggleAutomationRule: (id: string) => void;
  deleteAutomationRule: (id: string) => void;

  // Users CRUD
  addUser: (user: Omit<User, 'id' | 'avatar' | 'active'>) => void;
  updateUser: (id: string, updates: Partial<Omit<User, 'id' | 'avatar' | 'active'>>) => void;
  toggleUserActive: (id: string) => void;

  addOfflineMutation: (type: string, payload: any) => void;
  processOfflineQueue: () => void;
  clearOfflineQueue: () => void;
}

export const useCRMStore = create<CRMState>()(
  persist(
    (set, get) => ({
      users: defaultUsers,
      products: defaultProducts,
      leads: defaultLeads,
      pipeline: defaultPipeline,
      surveys: defaultSurveys,
      quotes: defaultQuotes,
      projects: defaultProjects,
      customers: defaultCustomers,
      subsidies: defaultSubsidies,
      payments: defaultPayments,
      tickets: defaultTickets,
      amc: defaultAmc,
      customFields: defaultCustomFields,
      branding: defaultBranding,
      permissions: defaultPermissions,
      automations: defaultAutomations,
      offlineQueue: [],

      setBranding: (branding) =>
        set((state) => ({ branding: { ...state.branding, ...branding } })),

      updateBranding: (branding) =>
        set((state) => ({ branding: { ...state.branding, ...branding } })),

      updateRolePermissions: (role, module, perms) =>
        set((state) => ({
          permissions: {
            ...state.permissions,
            [role]: {
              ...state.permissions[role],
              [module]: perms,
            },
          },
        })),

      addCustomField: (field) =>
        set((state) => ({
          customFields: [
            ...state.customFields,
            { ...field, id: `cf-${Date.now()}` },
          ],
        })),

      deleteCustomField: (id) =>
        set((state) => ({
          customFields: state.customFields.filter((cf) => cf.id !== id),
        })),

      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            { ...product, id: `prod-${Date.now()}` },
          ],
        })),

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      addPipelineStage: (name, color) =>
        set((state) => {
          const nextPos = state.pipeline.stages.length + 1;
          const newStage: PipelineStage = {
            id: `stg-${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
            name,
            color,
            position: nextPos,
          };
          return {
            pipeline: {
              ...state.pipeline,
              stages: [...state.pipeline.stages, newStage],
            },
          };
        }),

      deletePipelineStage: (id) =>
        set((state) => ({
          pipeline: {
            ...state.pipeline,
            stages: state.pipeline.stages.filter((s) => s.id !== id),
          },
        })),

      updatePipelineStageName: (id, name) =>
        set((state) => ({
          pipeline: {
            ...state.pipeline,
            stages: state.pipeline.stages.map((s) => (s.id === id ? { ...s, name } : s)),
          },
        })),

      addLead: (leadData) => {
        const id = `lead-${Date.now()}`;
        const newLead: Lead = {
          ...leadData,
          id,
          notes: [],
          activities: [
            { id: `act-${Date.now()}`, type: 'stage_change', content: 'Lead Created', createdBy: leadData.assigneeId || 'usr-1', createdAt: new Date().toISOString() }
          ],
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ leads: [newLead, ...state.leads] }));
        return newLead;
      },

      updateLead: (id, updates) =>
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        })),

      deleteLead: (id) =>
        set((state) => ({
          leads: state.leads.filter((l) => l.id !== id),
        })),

      addCustomer: (customerData) => {
        const id = `cust-${Date.now()}`;
        const newCustomer: Customer = {
          ...customerData,
          id,
          activeProjects: [],
          totalPaid: 0,
          totalOutstanding: 0,
        };
        set((state) => ({ customers: [...state.customers, newCustomer] }));
        return newCustomer;
      },

      updateCustomer: (id, updates) =>
        set((state) => ({
          customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      deleteCustomer: (id) =>
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        })),

      addAutomationRule: (ruleData) => {
        const id = `auto-${Date.now()}`;
        const newRule: AutomationRule = {
          ...ruleData,
          id,
          active: true,
        };
        set((state) => ({ automations: [...state.automations, newRule] }));
      },

      toggleAutomationRule: (id) =>
        set((state) => ({
          automations: state.automations.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
        })),

      deleteAutomationRule: (id) =>
        set((state) => ({
          automations: state.automations.filter((a) => a.id !== id),
        })),

      moveLeadStage: (leadId, fromStageId, toStageId, user) => {
        set((state) => {
          const leads = state.leads.map((l) => {
            if (l.id === leadId) {
              const updatedAct = [
                ...l.activities,
                {
                  id: `act-${Date.now()}`,
                  type: 'stage_change' as const,
                  content: `Moved stage from "${fromStageId}" to "${toStageId}"`,
                  createdBy: user,
                  createdAt: new Date().toISOString(),
                },
              ];
              
              let extraUpdates: Partial<Lead> = {};
              
              // Auto create Project when moved to Won
              if (toStageId === 'stg-won') {
                const existingCustomer = state.customers.find(c => c.phone === l.phone);
                let customerId = existingCustomer?.id;
                if (!existingCustomer) {
                  customerId = `cust-${Date.now()}`;
                  state.customers.push({
                    id: customerId,
                    name: l.name,
                    company: l.company,
                    email: l.email,
                    phone: l.phone,
                    address: l.industryData.roofType || 'Address not specified',
                    activeProjects: [],
                    totalPaid: 0,
                    totalOutstanding: l.value
                  });
                }

                const prjId = `prj-${Date.now()}`;
                const newProject: Project = {
                  id: prjId,
                  leadId: l.id,
                  customerId: customerId!,
                  name: `${l.name} ${l.industryData.solarCapacityKwNeeded || 5}kW Solar Project`,
                  status: 'planning',
                  systemSizeKw: l.industryData.solarCapacityKwNeeded || 5,
                  milestones: [
                    { name: 'Site Survey & Approval', status: 'completed', completedAt: new Date().toISOString(), completedBy: user },
                    { name: 'Structure Installation', status: 'pending' },
                    { name: 'Module Placement & Wiring', status: 'pending' },
                    { name: 'Inverter Commissioning', status: 'pending' },
                    { name: 'Net Metering Approval', status: 'pending' }
                  ],
                  assignedTeam: ['usr-4', 'usr-3'],
                  value: l.value,
                  outstandingAmount: l.value
                };

                state.projects.push(newProject);
                
                // Add default payments
                const bookingAdvance: PaymentInstallment = {
                  id: `pmt-adv-${Date.now()}`,
                  projectId: prjId,
                  customerId: customerId!,
                  title: 'Booking Advance (10%)',
                  amount: l.value * 0.1,
                  status: 'pending',
                  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                };
                const materialDelivery: PaymentInstallment = {
                  id: `pmt-mat-${Date.now()}`,
                  projectId: prjId,
                  customerId: customerId!,
                  title: 'Material Delivery (60%)',
                  amount: l.value * 0.6,
                  status: 'pending',
                  dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                };
                const commissioning: PaymentInstallment = {
                  id: `pmt-com-${Date.now()}`,
                  projectId: prjId,
                  customerId: customerId!,
                  title: 'Commissioning & Handover (30%)',
                  amount: l.value * 0.3,
                  status: 'pending',
                  dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                };
                state.payments.push(bookingAdvance, materialDelivery, commissioning);

                // Add to customer's active projects
                state.customers = state.customers.map(c => c.id === customerId ? {
                  ...c,
                  activeProjects: [...c.activeProjects, prjId]
                } : c);
              }

              return {
                ...l,
                stageId: toStageId,
                activities: updatedAct,
                ...extraUpdates
              };
            }
            return l;
          });
          return { leads, projects: [...state.projects], payments: [...state.payments], customers: [...state.customers] };
        });
      },

      addLeadNote: (leadId, content, createdBy) =>
        set((state) => ({
          leads: state.leads.map((l) => {
            if (l.id === leadId) {
              const noteId = `n-${Date.now()}`;
              return {
                ...l,
                notes: [{ id: noteId, content, createdBy, createdAt: new Date().toISOString() }, ...l.notes],
                activities: [
                  ...l.activities,
                  {
                    id: `act-${Date.now()}`,
                    type: 'note',
                    content: `Added a note: "${content.substring(0, 40)}${content.length > 40 ? '...' : ''}"`,
                    createdBy,
                    createdAt: new Date().toISOString(),
                  },
                ],
              };
            }
            return l;
          }),
        })),

      addLeadActivity: (leadId, type, content, createdBy) =>
        set((state) => ({
          leads: state.leads.map((l) => {
            if (l.id === leadId) {
              return {
                ...l,
                activities: [
                  ...l.activities,
                  {
                    id: `act-${Date.now()}`,
                    type,
                    content,
                    createdBy,
                    createdAt: new Date().toISOString(),
                  },
                ],
              };
            }
            return l;
          }),
        })),

      addSurvey: (surveyData) =>
        set((state) => {
          const id = `srv-${Date.now()}`;
          return { surveys: [{ ...surveyData, id, synced: true }, ...state.surveys] };
        }),

      updateSurvey: (id, updates) =>
        set((state) => ({
          surveys: state.surveys.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),

      addQuote: (quoteData) => {
        const id = `qte-${Date.now()}`;
        const newQuote: Quotation = {
          ...quoteData,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ quotes: [newQuote, ...state.quotes] }));
        return newQuote;
      },

      updateQuoteStatus: (id, status) =>
        set((state) => ({
          quotes: state.quotes.map((q) => (q.id === id ? { ...q, status, sentAt: status === 'sent' ? new Date().toISOString() : q.sentAt } : q)),
        })),

      updateProjectMilestone: (projectId, milestoneName, status, user, proofPhoto) =>
        set((state) => {
          const projects = state.projects.map((p) => {
            if (p.id === projectId) {
              const milestones = p.milestones.map((m) => {
                if (m.name === milestoneName) {
                  return {
                    ...m,
                    status,
                    completedAt: status === 'completed' ? new Date().toISOString() : undefined,
                    completedBy: status === 'completed' ? user : undefined,
                    proofPhoto: proofPhoto || m.proofPhoto,
                  };
                }
                return m;
              });

              // Check if completed milestone triggered stage updates
              const allDone = milestones.every((m) => m.status === 'completed');
              const newStatus = allDone ? ('completed' as const) : p.status;

              return { ...p, milestones, status: newStatus };
            }
            return p;
          });
          return { projects };
        }),

      updateProjectStatus: (id, status) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, status } : p)),
        })),

      addPayment: (payment) =>
        set((state) => ({
          payments: [{ ...payment, id: `pmt-${Date.now()}` }, ...state.payments],
        })),

      recordPaymentReceipt: (id, amount, mode, ref, user) =>
        set((state) => {
          const payments = state.payments.map((p) => {
            if (p.id === id) {
              return {
                ...p,
                status: 'paid' as const,
                paidDate: new Date().toISOString().split('T')[0],
                paymentMode: mode,
                referenceNo: ref,
              };
            }
            return p;
          });

          // Adjust outstanding in customer and project
          const payment = state.payments.find((p) => p.id === id);
          if (payment) {
            const projects = state.projects.map((prj) => {
              if (prj.id === payment.projectId) {
                return {
                  ...prj,
                  outstandingAmount: Math.max(0, prj.outstandingAmount - amount),
                };
              }
              return prj;
            });
            const customers = state.customers.map((cust) => {
              if (cust.id === payment.customerId) {
                return {
                  ...cust,
                  totalPaid: cust.totalPaid + amount,
                  totalOutstanding: Math.max(0, cust.totalOutstanding - amount),
                };
              }
              return cust;
            });
            return { payments, projects, customers };
          }

          return { payments };
        }),

      addTicket: (ticketData) =>
        set((state) => ({
          tickets: [{ ...ticketData, id: `tkt-${Date.now()}`, createdAt: new Date().toISOString() }, ...state.tickets],
        })),

      resolveTicket: (id, notes) =>
        set((state) => ({
          tickets: state.tickets.map((t) => (t.id === id ? { ...t, status: 'resolved' as const, resolutionNotes: notes } : t)),
        })),

      assignTicket: (id, assigneeId) =>
        set((state) => ({
          tickets: state.tickets.map((t) => (t.id === id ? { ...t, assigneeId, status: t.status === 'open' ? 'assigned' as const : t.status } : t)),
        })),

      addOfflineMutation: (type, payload) =>
        set((state) => ({
          offlineQueue: [
            ...state.offlineQueue,
            { id: `mut-${Date.now()}`, type, payload, timestamp: Date.now() },
          ],
        })),

      processOfflineQueue: () => {
        const { offlineQueue } = get();
        if (offlineQueue.length === 0) return;

        offlineQueue.forEach((mutation) => {
          const { type, payload } = mutation;
          if (type === 'survey_update') {
            get().updateSurvey(payload.id, payload.updates);
          } else if (type === 'lead_note') {
            get().addLeadNote(payload.leadId, payload.content, payload.createdBy);
          } else if (type === 'milestone_complete') {
            get().updateProjectMilestone(payload.projectId, payload.milestoneName, 'completed', payload.user, payload.proofPhoto);
          }
        });

        get().clearOfflineQueue();
      },

      clearOfflineQueue: () => set({ offlineQueue: [] }),

      addUser: (userData) =>
        set((state) => {
          const id = `usr-${Date.now()}`;
          const initials = userData.name
            .split(' ')
            .map((n) => n[0] || '')
            .join('')
            .toUpperCase()
            .substring(0, 2);
          const newUser: User = {
            ...userData,
            id,
            active: true,
            avatar: initials || 'US',
          };
          return { users: [...state.users, newUser] };
        }),

      updateUser: (id, updates) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
        })),

      toggleUserActive: (id) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)),
        })),
    }),
    {
      name: 'solar-crm-db',
    }
  )
);
