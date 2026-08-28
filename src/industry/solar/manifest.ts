import { ClipboardList, Award } from 'lucide-react';

export interface RouteConfig {
  path: string;
  label: string;
  componentName: string;
}

export interface NavItemConfig {
  path: string;
  label: string;
  iconName: 'ClipboardList' | 'Award';
  roles: string[];
}

export interface DashboardWidgetConfig {
  id: string;
  type: 'stat' | 'list' | 'chart';
  title: string;
}

export interface LeadExtensionField {
  name: string;
  label: string;
  type: 'number' | 'text' | 'select';
  options?: string[];
  required: boolean;
}

export interface TemplateManifest {
  id: string;
  terminology: {
    surveyLabel: string;
    subsidyLabel: string;
  };
  routes: RouteConfig[];
  navItems: NavItemConfig[];
  dashboardWidgets: DashboardWidgetConfig[];
  leadExtensions: LeadExtensionField[];
  projectExtensions: {
    milestones: string[];
  };
}

export const solarManifest: TemplateManifest = {
  id: 'solar',
  terminology: {
    surveyLabel: 'Site Survey',
    subsidyLabel: 'Subsidy Tracker',
  },
  routes: [
    { path: '/surveys', label: 'Site Surveys', componentName: 'SurveysView' },
    { path: '/subsidy', label: 'Subsidy Tracker', componentName: 'SubsidyView' },
  ],
  navItems: [
    {
      path: '/surveys',
      label: 'Site Surveys',
      iconName: 'ClipboardList',
      roles: ['admin', 'manager', 'technician'],
    },
    {
      path: '/subsidy',
      label: 'Subsidy Tracker',
      iconName: 'Award',
      roles: ['admin', 'manager'],
    },
  ],
  dashboardWidgets: [
    { id: 'widget-surveys-pending', type: 'stat', title: 'Surveys Pending' },
    { id: 'widget-subsidy-status', type: 'list', title: 'Subsidy Status' },
  ],
  leadExtensions: [
    { name: 'monthlyBill', label: 'Monthly Electricity Bill (₹)', type: 'number', required: true },
    {
      name: 'roofType',
      label: 'Roof Type',
      type: 'select',
      options: ['Concrete Flat Roof', 'Tin Shed Pitch Roof', 'Industrial Tin Roof', 'Ground Mount'],
      required: true,
    },
    { name: 'solarCapacityKwNeeded', label: 'Recommended Capacity (kW)', type: 'number', required: false },
  ],
  projectExtensions: {
    milestones: [
      'Site Survey & Approval',
      'Structure Installation',
      'Module Placement & Wiring',
      'Inverter Commissioning',
      'Net Metering Approval',
    ],
  },
};
