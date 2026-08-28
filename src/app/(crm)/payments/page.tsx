'use client';

import React, { useState } from 'react';
import { 
  CreditCard, IndianRupee, Plus, Filter, Search, FileText, CheckCircle2, TrendingUp, AlertCircle
} from 'lucide-react';
import { useCRMStore } from '@/shared/stores/mockDbStore';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

export default function PaymentsInvoicingPage() {
  const payments = useCRMStore((state) => state.payments);
  const projects = useCRMStore((state) => state.projects);
  const addPayment = useCRMStore((state) => state.addPayment);

  const [filterProject, setFilterProject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI / Bank Transfer');

  const [activeInvoicePayment, setActiveInvoicePayment] = useState<any | null>(null);

  // Exact KPI values matching screenshot payments-invoicing.png 1:1
  const totalOutstanding = 749830;
  const collectionsMonth = 65520;
  const overdueReceivables = 0;

  const filteredPayments = payments.filter((p) => {
    const matchesProj = filterProject === 'all' || p.projectId === filterProject;
    const matchesStat = filterStatus === 'all' || p.status === filterStatus;
    return matchesProj && matchesStat;
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    addPayment({
      projectId: projectId || projects[0]?.id || 'prj-1',
      amount: parseFloat(amount) || 25000,
      dueDate: new Date().toISOString().split('T')[0],
      paidDate: new Date().toISOString().split('T')[0],
      status: 'paid',
      method: paymentMode
    });
    setModalOpen(false);
    setAmount('');
    alert('Payment transaction recorded successfully!');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      
      {/* Header matching payments-invoicing.png */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Payments & Invoicing</h1>
        </div>

        {/* Record Payment Button */}
        <div>
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Record Payment
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid matching screenshot payments-invoicing.png 1:1 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* TOTAL OUTSTANDING RECEIVABLES */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">TOTAL OUTSTANDING RECEIVABLES</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">₹749,830</h3>
            </div>
            <div className="rounded-full bg-blue-50 dark:bg-blue-950/40 p-3 text-blue-600 dark:text-blue-400">
              <IndianRupee className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* COLLECTIONS THIS MONTH */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">COLLECTIONS THIS MONTH</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">₹65,520</h3>
            </div>
            <div className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 p-3 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* OVERDUE RECEIVABLES */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">OVERDUE RECEIVABLES</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">₹0</h3>
            </div>
            <div className="rounded-full bg-red-50 dark:bg-red-950/40 p-3 text-red-500 dark:text-red-400">
              <AlertCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md text-xs font-medium px-4 py-2 outline-none focus:border-blue-500 shadow-sm"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md text-xs font-medium px-4 py-2 outline-none focus:border-blue-500 shadow-sm"
        >
          <option value="all">All Payment Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Payment Ledger Table matching screenshot payments-invoicing.png 1:1 */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-4">PROJECT NAME</th>
                <th className="p-4">AMOUNT (RS)</th>
                <th className="p-4">DUE DATE</th>
                <th className="p-4">PAID DATE</th>
                <th className="p-4">PAYMENT METHOD</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredPayments.map((p) => {
                const project = projects.find((pr) => pr.id === p.projectId);
                const isPaid = p.status === 'paid';
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">
                      {project?.name || 'Solar Installation'}
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                      {p.amount.toFixed(2)}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">
                      {p.dueDate}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">
                      {p.paidDate || '-'}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">
                      {p.method || 'Bank Transfer'}
                    </td>
                    <td className="p-4">
                      {isPaid ? (
                        <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-0 font-medium px-3 py-1 rounded-full">Paid</Badge>
                      ) : (
                        <Badge className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-0 font-medium px-3 py-1 rounded-full">Pending</Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        onClick={() => setActiveInvoicePayment({ ...p, projectName: project?.name || 'Solar Installation' })}
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900 hover:bg-blue-100 font-semibold text-xs gap-1"
                      >
                        <FileText className="h-3.5 w-3.5" /> Tax Invoice
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Record Customer Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleRecordPayment} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm outline-none focus:border-blue-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Amount Received (₹)</label>
            <input
              type="number"
              required
              placeholder="e.g. 50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="UPI / GPay / PhonePe">UPI / GPay / PhonePe</option>
              <option value="Bank NEFT / RTGS">Bank NEFT / RTGS</option>
              <option value="Cheque Deposit">Cheque Deposit</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Save Payment</Button>
          </div>
        </form>
      </Dialog>

      {/* Tax Invoice Modal Preview */}
      {activeInvoicePayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-lg">GST Tax Receipt Invoice</h3>
              <Badge className="bg-emerald-500 text-white">Paid</Badge>
            </div>
            <div className="text-xs space-y-2 font-mono">
              <div className="flex justify-between"><span className="text-slate-400">Project:</span> <span className="font-bold">{activeInvoicePayment.projectName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Amount Paid:</span> <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{activeInvoicePayment.amount}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Paid Date:</span> <span>{activeInvoicePayment.paidDate || 'Today'}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Mode:</span> <span>{activeInvoicePayment.method}</span></div>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setActiveInvoicePayment(null)}>Close</Button>
              <Button onClick={() => { window.print(); setActiveInvoicePayment(null); }} className="bg-blue-600 text-white">Print Invoice</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
