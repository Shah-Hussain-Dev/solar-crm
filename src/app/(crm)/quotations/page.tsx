'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, Plus, Search, Filter, Edit, Printer, Wrench, Trash2, Sparkles, Share2, Eye
} from 'lucide-react';
import { useCRMStore, Quotation } from '@/shared/stores/mockDbStore';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { QuotePdfModal } from '@/shared/components/ui/QuotePdfModal';

export default function QuotationsPage() {
  const router = useRouter();
  const quotes = useCRMStore((state) => state.quotes);
  const leads = useCRMStore((state) => state.leads);

  const [statusFilter, setStatusFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');

  const [activePdfQuote, setActivePdfQuote] = useState<any | null>(null);

  const filteredQuotes = quotes.filter((q) => {
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesStatus;
  });

  const handleOpenPdf = (quote: Quotation) => {
    const lead = leads.find((l) => l.id === quote.leadId);
    setActivePdfQuote({
      id: quote.id,
      refNo: quote.id,
      customerName: lead?.name || quote.title.split('-')[0] || 'Customer',
      customerAddress: lead?.industryData?.address || 'Pune, Maharashtra',
      date: new Date(quote.createdAt).toLocaleDateString(),
      validUntil: '2026-05-20',
      systemSizeKw: 28,
      items: quote.items.map(i => ({ description: i.name, qty: i.qty, rate: i.price, amount: i.total })),
      subtotal: quote.subtotal || 150000,
      gst: quote.gst || 18000,
      grandTotal: quote.grandTotal || 168000,
      centralSubsidy: 78000,
      stateSubsidy: 30000,
      netCost: (quote.grandTotal || 168000) - 108000
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      
      {/* Header matching quotations.png */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Quotations</h1>
        </div>
      </div>

      {/* Filter Row matching quotations.png 1:1 */}
      <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md text-xs font-medium px-4 py-2 outline-none focus:border-blue-500 shadow-sm"
        >
          <option value="all">All Statuses (Quick Filter)</option>
          <option value="accepted">Accepted</option>
          <option value="sent">Sent</option>
          <option value="draft">Draft</option>
        </select>

        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md text-xs font-medium px-4 py-2 outline-none focus:border-blue-500 shadow-sm"
        >
          <option value="all">All System Sizes</option>
          <option value="3kw">3 kW</option>
          <option value="5kw">5 kW</option>
          <option value="28kw">28 kW</option>
        </select>
      </div>

      {/* Table matching quotations.png 1:1 */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-4">QUOTE NO</th>
                <th className="p-4">CUSTOMER</th>
                <th className="p-4">TOTAL (RS)</th>
                <th className="p-4">NET COST (RS)</th>
                <th className="p-4">VALIDITY</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredQuotes.map((q) => {
                const lead = leads.find((l) => l.id === q.leadId);
                const isAccepted = q.status === 'accepted';
                return (
                  <tr key={q.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono font-semibold text-slate-900 dark:text-white">
                      {q.id}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                        {lead?.name || q.title.split('-')[0]}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        📍 {lead?.industryData?.address || 'Pune, Maharashtra'}
                      </p>
                    </td>
                    <td className="p-4 font-mono font-medium text-slate-900 dark:text-white">
                      {q.grandTotal.toFixed(2)}
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                      {(q.grandTotal - (q.subsidy || 108000)).toFixed(2)}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">
                      2026-05-20
                    </td>
                    <td className="p-4">
                      {isAccepted ? (
                        <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-0 font-medium px-3 py-1 rounded-full">Accepted</Badge>
                      ) : (
                        <Badge className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-0 font-medium px-3 py-1 rounded-full">Draft</Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-blue-600 dark:text-blue-400">
                        <button
                          onClick={() => alert('Edit quotation')}
                          className="hover:text-blue-800 dark:hover:text-blue-300 p-1"
                          title="Edit Quote"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenPdf(q)}
                          className="hover:text-blue-800 dark:hover:text-blue-300 p-1"
                          title="Print / Save PDF Preview"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => alert('Tools')}
                          className="hover:text-blue-800 dark:hover:text-blue-300 p-1"
                          title="Tools"
                        >
                          <Wrench className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {activePdfQuote && (
        <QuotePdfModal
          isOpen={!!activePdfQuote}
          onClose={() => setActivePdfQuote(null)}
          quotation={activePdfQuote}
        />
      )}

    </div>
  );
}
