'use client';

import React from 'react';
import { X, Printer, Share2, Sun } from 'lucide-react';
import { Button } from './button';
import { useCRMStore } from '@/shared/stores/mockDbStore';

interface QuotePdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotation: {
    id: string;
    refNo?: string;
    customerName: string;
    customerAddress?: string;
    date: string;
    validUntil: string;
    systemSizeKw: number;
    items?: Array<{ description: string; qty: number; rate: number; amount: number }>;
    subtotal: number;
    gst: number;
    grandTotal: number;
    centralSubsidy: number;
    stateSubsidy: number;
    netCost: number;
    terms?: string;
  };
}

export function QuotePdfModal({ isOpen, onClose, quotation }: QuotePdfModalProps) {
  const branding = useCRMStore((state) => state.branding);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200 print:p-0 print:bg-white">
      {/* Modal Box */}
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-xl bg-white shadow-2xl overflow-hidden print:max-h-none print:shadow-none print:w-full print:rounded-none">
        
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between border-b bg-slate-900 px-6 py-4 text-white print:hidden">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Quotation Preview & Print</h3>
              <p className="text-xs text-slate-400">Ref: {quotation.refNo || quotation.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-md"
              size="sm"
            >
              <Printer className="h-4 w-4" /> Print / Save PDF
            </Button>
            <Button
              onClick={() => {
                const text = `Hi ${quotation.customerName}, here is your Solar Quotation (${quotation.refNo || quotation.id}) for ${quotation.systemSizeKw}kW system. Net Cost: ${formatCurrency(quotation.netCost)}. Contact us to proceed!`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
              }}
              variant="outline"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 gap-1"
            >
              <Share2 className="h-4 w-4" /> Share WhatsApp
            </Button>
            <button
              onClick={onClose}
              className="ml-2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 print:bg-white print:overflow-visible print:p-0">
          <div className="mx-auto max-w-3xl bg-white p-8 shadow-sm border border-slate-200 rounded-lg print:border-none print:shadow-none print:p-4">
            
            {/* Document Header matching generate quotations.png */}
            <div className="flex justify-between items-start border-b pb-6 mb-6">
              <div className="flex items-center gap-3">
                {branding.logoUrl ? (
                  <img src={branding.logoUrl} alt="Logo" className="h-12 w-auto object-contain" />
                ) : (
                  <div className="flex items-center gap-2">
                    <Sun className="h-8 w-8 text-amber-500 fill-amber-400" />
                    <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      {branding.companyName || 'Solar CRM'}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right text-xs text-slate-500 leading-relaxed">
                <p className="font-bold text-slate-800 text-sm">{branding.companyName || 'Solar CRM'}</p>
                <p>Mumbai, Maharashtra</p>
                <p>GST: 27ABCDE1234F1Z5</p>
                <p>Email: contact@solarcrm.com</p>
              </div>
            </div>

            {/* Prepared For & Details */}
            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-150 mb-6 text-sm">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Prepared For</span>
                <p className="font-bold text-slate-900 text-base mt-1">{quotation.customerName}</p>
                {quotation.customerAddress && <p className="text-slate-600 text-xs mt-0.5">{quotation.customerAddress}</p>}
                <p className="text-blue-600 font-semibold text-xs mt-2">
                  System Size: <span className="font-bold text-slate-900">{quotation.systemSizeKw} kW</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Quotation Details</span>
                <p className="font-bold text-slate-800 text-sm mt-1">Ref: {quotation.refNo || quotation.id}</p>
                <p className="text-slate-600 text-xs mt-1">Date: {quotation.date}</p>
                <p className="text-slate-600 text-xs">Valid Until: {quotation.validUntil}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mb-6 overflow-hidden rounded-md border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 uppercase font-semibold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Rate (Rs)</th>
                    <th className="p-3 text-right">Amount (Rs)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {quotation.items && quotation.items.length > 0 ? (
                    quotation.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-medium text-slate-900">{item.description}</td>
                        <td className="p-3 text-center font-mono">{item.qty}</td>
                        <td className="p-3 text-right font-mono">{item.rate.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-mono font-medium">{item.amount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-3 font-medium text-slate-900" colSpan={4}>
                        <div className="flex justify-between items-center py-1">
                          <span>Complete {quotation.systemSizeKw}kW Solar Rooftop Installation (Panels, Inverter, Structure, Cables & Net Metering)</span>
                          <span className="font-mono font-semibold">{quotation.subtotal.toLocaleString('en-IN')}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals & Subsidy Calculation matching generate quotations.png */}
            <div className="flex justify-end mb-8">
              <div className="w-80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 py-1 border-b border-dashed border-slate-200">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold text-slate-800">Rs {quotation.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600 py-1 border-b border-dashed border-slate-200">
                  <span>GST (18%):</span>
                  <span className="font-mono font-semibold text-slate-800">Rs {quotation.gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm py-1.5 border-b-2 border-slate-800">
                  <span>Grand Total:</span>
                  <span className="font-mono text-slate-900">Rs {quotation.grandTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium py-1">
                  <span>Central Subsidy (-):</span>
                  <span className="font-mono font-semibold">Rs {quotation.centralSubsidy.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium py-1 border-b border-slate-200">
                  <span>State Subsidy (-):</span>
                  <span className="font-mono font-semibold">Rs {quotation.stateSubsidy.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center bg-blue-50 text-blue-900 p-3 rounded-lg border border-blue-200 text-sm font-bold mt-2">
                  <span>Net Cost:</span>
                  <span className="font-mono text-base text-blue-700">Rs {quotation.netCost.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="border-t border-slate-200 pt-4 text-xs text-slate-500">
              <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Terms & Conditions</p>
              <p className="leading-relaxed">
                {quotation.terms || '30% advance, 40% on delivery of materials, 30% on commissioning and grid connectivity.'}
              </p>
              <div className="mt-8 flex justify-between items-end pt-6">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Customer Acceptance Signature</p>
                  <div className="h-10 border-b border-slate-300 w-48 mt-1" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase">Authorized Signatory</p>
                  <p className="font-bold text-slate-800 text-xs mt-4">{branding.companyName || 'Solar CRM'}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
