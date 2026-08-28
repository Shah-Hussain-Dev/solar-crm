'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, FolderCheck, CreditCard, Wrench, Calendar, 
  Search, ArrowRight, UserPlus, Info, CheckCircle2,
  Plus, Edit, Trash2, ArrowLeft
} from 'lucide-react';
import { useCRMStore } from '@/shared/stores/mockDbStore';
import { useAlertStore } from '@/shared/stores/alertStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/shared/components/ui/dialog';
import { formatCurrency } from '@/shared/utils/cn';

export default function CustomersPage() {
  const customers = useCRMStore((state) => state.customers);
  const projects = useCRMStore((state) => state.projects);
  const payments = useCRMStore((state) => state.payments);
  const tickets = useCRMStore((state) => state.tickets);
  const amc = useCRMStore((state) => state.amc);

  // CRUD actions from store
  const addCustomer = useCRMStore((state) => state.addCustomer);
  const updateCustomer = useCRMStore((state) => state.updateCustomer);
  const deleteCustomer = useCRMStore((state) => state.deleteCustomer);

  // States
  const [selectedCustId, setSelectedCustId] = useState<string | null>(customers[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCustId, setEditCustId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formError, setFormError] = useState('');

  const selectedCustomer = customers.find(c => c.id === selectedCustId);
  
  // Aggregate data for selected customer
  const custProjects = selectedCustomer ? projects.filter(p => selectedCustomer.activeProjects.includes(p.id)) : [];
  const custPayments = selectedCustomer ? payments.filter(p => p.customerId === selectedCustomer.id) : [];
  const custTickets = selectedCustomer ? tickets.filter(t => t.customerId === selectedCustomer.id) : [];
  const custAmc = selectedCustomer ? amc.filter(a => a.customerId === selectedCustomer.id) : [];

  // Filter list
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  // Reset selected Customer if it gets deleted
  useEffect(() => {
    if (selectedCustId && !customers.some(c => c.id === selectedCustId)) {
      setSelectedCustId(customers[0]?.id || null);
      setShowMobileDetail(false);
    }
  }, [customers, selectedCustId]);

  // Open Dialog for Create
  const handleOpenCreate = () => {
    setEditCustId(null);
    setFormName('');
    setFormCompany('');
    setFormEmail('');
    setFormPhone('');
    setFormAddress('');
    setFormError('');
    setDialogOpen(true);
  };

  // Open Dialog for Edit
  const handleOpenEdit = (cust: typeof customers[0]) => {
    setEditCustId(cust.id);
    setFormName(cust.name);
    setFormCompany(cust.company);
    setFormEmail(cust.email);
    setFormPhone(cust.phone);
    setFormAddress(cust.address);
    setFormError('');
    setDialogOpen(true);
  };

  // Save Customer (Create or Edit)
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCompany.trim() || !formEmail.trim() || !formPhone.trim() || !formAddress.trim()) {
      setFormError('All fields are required.');
      return;
    }

    if (editCustId) {
      // Edit
      updateCustomer(editCustId, {
        name: formName.trim(),
        company: formCompany.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        address: formAddress.trim(),
      });
      useAlertStore.getState().showAlert('Customer account updated successfully.', 'success');
    } else {
      // Create
      const newCust = addCustomer({
        name: formName.trim(),
        company: formCompany.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        address: formAddress.trim(),
      });
      setSelectedCustId(newCust.id);
      setShowMobileDetail(true);
      useAlertStore.getState().showAlert('Customer account created successfully.', 'success');
    }

    setDialogOpen(false);
  };

  // Delete Customer
  const handleDeleteCustomer = (cust: typeof customers[0]) => {
    useAlertStore.getState().showConfirm(
      'Delete Customer Account',
      `Are you sure you want to delete the account for "${cust.name}"? This action cannot be undone and will detach operational metrics.`,
      () => {
        deleteCustomer(cust.id);
        useAlertStore.getState().showAlert('Customer account deleted successfully.', 'success');
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Accounts Directory</h1>
          <p className="text-sm text-foreground/60">
            Audit aggregated customer accounts: active installations, payment ledger schedules, and SLA maintenance agreements.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="sm:self-start bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm flex items-center gap-1.5 self-end">
          <Plus className="h-4 w-4" />
          <span>Add Customer</span>
        </Button>
      </div>

      {/* Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: directory list */}
        <div className={`lg:col-span-1 space-y-4 ${showMobileDetail ? 'hidden lg:block' : 'block'}`}>
          {/* Toolbar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground/45" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredCustomers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCustId(c.id);
                      setShowMobileDetail(true);
                    }}
                    className={`w-full p-4 hover:bg-muted/40 transition-colors text-left flex justify-between items-center ${
                      selectedCustId === c.id ? 'bg-primary/5 border-l-4 border-primary' : ''
                    }`}
                  >
                    <div className="space-y-1 max-w-[80%]">
                      <div className="font-semibold text-sm truncate">{c.name}</div>
                      <div className="text-xs text-foreground/60 truncate">{c.company}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {c.activeProjects?.length || 0} Projects
                    </Badge>
                  </button>
                ))}
                {filteredCustomers.length === 0 && (
                  <div className="p-8 text-center text-sm text-foreground/50">No clients match search criteria.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: aggregates panel */}
        <div className={`lg:col-span-2 ${showMobileDetail ? 'block' : 'hidden lg:block'}`}>
          {selectedCustomer ? (
            <div className="space-y-6">
              {/* Mobile back navigation bar */}
              <div className="lg:hidden flex items-center justify-between pb-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowMobileDetail(false)}
                  className="flex items-center gap-1 -ml-2 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Directory</span>
                </Button>
              </div>

              {/* Account profile card */}
              <Card className="border-primary/20 relative overflow-hidden">
                <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>{selectedCustomer.name}</span>
                    </CardTitle>
                    <CardDescription>{selectedCustomer.company} · {selectedCustomer.address}</CardDescription>
                  </div>
                  {/* Action group */}
                  <div className="flex gap-2 shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleOpenEdit(selectedCustomer)}
                      className="h-8 text-xs flex items-center gap-1 px-2.5"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteCustomer(selectedCustomer)}
                      className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50/50 border-red-200 flex items-center gap-1 px-2.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pt-4 border-t border-border/50 bg-muted/10">
                  <div>
                    <span className="text-foreground/50 text-xs">Total Payments Paid:</span>
                    <div className="text-base font-bold text-green-600 tabular-nums mt-0.5">
                      {formatCurrency(selectedCustomer.totalPaid || 0)}
                    </div>
                  </div>
                  <div>
                    <span className="text-foreground/50 text-xs">Ledger Outstanding:</span>
                    <div className="text-base font-bold text-red-500 tabular-nums mt-0.5">
                      {formatCurrency(selectedCustomer.totalOutstanding || 0)}
                    </div>
                  </div>
                  <div>
                    <span className="text-foreground/50 text-xs">Contact phone / email:</span>
                    <div className="mt-0.5 text-foreground/80 font-medium">
                      <div className="text-sm font-bold text-foreground/85">{selectedCustomer.phone}</div>
                      <div className="text-xs text-foreground/55 truncate">{selectedCustomer.email}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Projects list */}
              <Card>
                <CardHeader className="pb-3 border-b border-border/50">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FolderCheck className="h-4.5 w-4.5 text-primary" />
                    <span>Installation Projects</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {custProjects.map((p) => {
                    const doneM = p.milestones.filter(m => m.status === 'completed').length;
                    return (
                      <div key={p.id} className="flex justify-between items-center p-3 rounded-lg border border-border bg-card">
                        <div>
                          <div className="font-semibold text-sm">{p.name}</div>
                          <div className="text-xs text-foreground/50">{p.systemSizeKw}kW capacity · {doneM}/{p.milestones.length} milestones complete</div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {p.status}
                        </Badge>
                      </div>
                    );
                  })}
                  {custProjects.length === 0 && (
                    <div className="text-center py-8 text-sm text-foreground/45">No projects currently assigned to this account.</div>
                  )}
                </CardContent>
              </Card>

              {/* Billing list */}
              <Card>
                <CardHeader className="pb-3 border-b border-border/50">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CreditCard className="h-4.5 w-4.5 text-emerald-600" />
                    <span>Invoicing Ledger</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {custPayments.map((pmt) => (
                    <div key={pmt.id} className="flex justify-between items-center rounded-lg border border-border p-2.5 text-xs bg-card">
                      <div>
                        <div className="font-semibold">{pmt.title}</div>
                        <div className="text-[10px] text-foreground/50">Due: {pmt.dueDate}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold tabular-nums">{formatCurrency(pmt.amount)}</div>
                        <Badge variant={pmt.status === 'paid' ? 'success' : 'outline'} className="text-[9px] mt-0.5">
                          {pmt.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {custPayments.length === 0 && (
                    <div className="text-center py-8 text-sm text-foreground/45">No billing records found.</div>
                  )}
                </CardContent>
              </Card>

              {/* Support logs and AMC */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3 border-b border-border/50">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Wrench className="h-4.5 w-4.5 text-orange-500" />
                      <span>Support Tickets</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {custTickets.map((tkt) => (
                      <div key={tkt.id} className="p-2.5 rounded-lg border border-border text-xs">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold truncate max-w-[150px]">{tkt.title}</span>
                          <Badge variant={tkt.status === 'resolved' ? 'success' : 'outline'} className="text-[9px]">
                            {tkt.status}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-foreground/60 leading-tight truncate">{tkt.description}</p>
                      </div>
                    ))}
                    {custTickets.length === 0 && (
                      <div className="text-center py-8 text-xs text-foreground/45">No support tickets found.</div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 border-b border-border/50">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calendar className="h-4.5 w-4.5 text-primary" />
                      <span>AMC Maintenance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {custAmc.map((item) => (
                      <div key={item.id} className="p-2.5 rounded-lg border border-border text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="font-semibold">AMC Agreement</span>
                          <Badge variant="success" className="text-[9px]">Active</Badge>
                        </div>
                        <div className="text-[10px] text-foreground/50">Valid to: {item.endDate}</div>
                        <div className="text-[10px] text-foreground/50">Value: {formatCurrency(item.value)}</div>
                      </div>
                    ))}
                    {custAmc.length === 0 && (
                      <div className="text-center py-8 text-xs text-foreground/45">No active AMC agreements.</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center p-12 text-center border-dashed">
              <div className="max-w-xs space-y-3">
                <Users className="h-12 w-12 text-primary/45 mx-auto" />
                <h3 className="font-bold text-base text-foreground">Select Customer Account</h3>
                <p className="text-sm text-foreground/60">
                  Select a customer account to inspect aggregated operational summaries.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* CRUD Dialog Form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogHeader>
          <DialogTitle>{editCustId ? 'Edit Customer Details' : 'Add New Customer Account'}</DialogTitle>
          <DialogDescription>
            {editCustId ? 'Modify profile fields for this client account.' : 'Create a fresh customer record to link projects, billing schedules, and support contracts.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSaveCustomer} className="space-y-4 mt-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground/70" htmlFor="name">Client Name *</label>
            <input
              id="name"
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full text-sm p-2 bg-card rounded-lg border border-border outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground/70" htmlFor="company">Company / Establishment *</label>
            <input
              id="company"
              type="text"
              required
              value={formCompany}
              onChange={(e) => setFormCompany(e.target.value)}
              placeholder="e.g. Kumar Solar Farms or Residential"
              className="w-full text-sm p-2 bg-card rounded-lg border border-border outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground/70" htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                required
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="ramesh@gmail.com"
                className="w-full text-sm p-2 bg-card rounded-lg border border-border outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground/70" htmlFor="phone">Contact Number *</label>
              <input
                id="phone"
                type="tel"
                required
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full text-sm p-2 bg-card rounded-lg border border-border outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground/70" htmlFor="address">Installation / Billing Address *</label>
            <textarea
              id="address"
              required
              rows={3}
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
              placeholder="Full address of site installation..."
              className="w-full text-sm p-2 bg-card rounded-lg border border-border outline-none focus:border-primary resize-none"
            />
          </div>

          {formError && (
            <p className="text-xs font-medium text-red-500">{formError}</p>
          )}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/95 text-primary-foreground">
              {editCustId ? 'Save Changes' : 'Create Account'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
