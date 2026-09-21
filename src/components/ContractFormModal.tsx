import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Building2, ShieldCheck, DollarSign } from 'lucide-react';
import { Contract, ContractType, Department, PaymentFrequency, ContractStatus } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import { calculateDaysRemaining, classifyRisk } from '../utils/contractUtils';

interface ContractFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contractData: Partial<Contract>) => void;
  contractToEdit: Contract | null;
  departments: Department[];
  t: TranslationDictionary;
}

export const ContractFormModal: React.FC<ContractFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  contractToEdit,
  departments,
  t,
}) => {
  const [formData, setFormData] = useState<Partial<Contract>>({
    name: '',
    contractNumber: '',
    type: 'Vendor Agreement',
    description: '',
    companyName: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    departmentId: departments[0]?.id || '',
    departmentName: departments[0]?.name || '',
    ownerName: 'Vikram Malhotra',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    renewalDate: '',
    noticePeriodDays: 30,
    autoRenewal: false,
    contractValue: 500000,
    currency: 'INR',
    paymentFrequency: 'Annual',
    status: 'Active',
    notes: '',
    customFields: [],
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (contractToEdit) {
      setFormData(contractToEdit);
    } else {
      const today = new Date();
      const oneYearLater = new Date();
      oneYearLater.setFullYear(today.getFullYear() + 1);

      setFormData({
        name: '',
        contractNumber: `CNT-${Date.now().toString().slice(-5)}`,
        type: 'Vendor Agreement',
        description: '',
        companyName: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        departmentId: departments[0]?.id || '',
        departmentName: departments[0]?.name || '',
        ownerName: 'Anuj Raja',
        startDate: today.toISOString().split('T')[0],
        endDate: oneYearLater.toISOString().split('T')[0],
        renewalDate: oneYearLater.toISOString().split('T')[0],
        noticePeriodDays: 30,
        autoRenewal: false,
        contractValue: 1200000,
        currency: 'INR',
        paymentFrequency: 'Annual',
        status: 'Active',
        notes: '',
        customFields: [{ id: 'cf-new', label: 'Purchase Order No.', value: 'PO-98214' }],
      });
    }
    setValidationError('');
  }, [contractToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setValidationError('Contract name is required.');
      return;
    }
    if (!formData.companyName?.trim()) {
      setValidationError('Company/Vendor name is required.');
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setValidationError('Start date and End date are required.');
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setValidationError('End Date cannot be earlier than Start Date.');
      return;
    }

    const dept = departments.find((d) => d.id === formData.departmentId);
    const renewalDate = formData.renewalDate || formData.endDate;
    const days = calculateDaysRemaining(renewalDate);
    const risk = classifyRisk(days);

    onSave({
      ...formData,
      departmentName: dept ? dept.name : formData.departmentName,
      renewalDate,
      riskLevel: risk.level,
      riskScore: risk.score,
    });
    onClose();
  };

  const addCustomField = () => {
    setFormData((prev) => ({
      ...prev,
      customFields: [
        ...(prev.customFields || []),
        { id: `cf-${Date.now()}`, label: 'Custom Field', value: '' },
      ],
    }));
  };

  const removeCustomField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customFields: (prev.customFields || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-white border-b border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">
              {contractToEdit ? 'Edit Agreement' : 'New Agreement'}
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
              {contractToEdit ? 'Modify Contract Details' : 'Add Contract to ContractGuard'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {validationError && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200 font-medium">
              {validationError}
            </div>
          )}

          {/* Section 1: Basic Identifiers */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 pb-1 border-b border-stone-200">
              1. Basic Identification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contract Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Cloud Infrastructure MSA"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contract Number / ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AGT-AWS-2025-01"
                  value={formData.contractNumber || ''}
                  onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contract Type
                </label>
                <select
                  value={formData.type || 'Vendor Agreement'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] cursor-pointer"
                >
                  <option value="Vendor Agreement">Vendor Agreement</option>
                  <option value="Customer Agreement">Customer Agreement</option>
                  <option value="Employment Contract">Employment Contract</option>
                  <option value="Lease/Rental Agreement">Lease/Rental Agreement</option>
                  <option value="Service Agreement">Service Agreement</option>
                  <option value="Maintenance Agreement">Maintenance Agreement</option>
                  <option value="Software License">Software License</option>
                  <option value="Insurance Agreement">Insurance Agreement</option>
                  <option value="Partnership Agreement">Partnership Agreement</option>
                  <option value="Non-Disclosure Agreement (NDA)">Non-Disclosure Agreement (NDA)</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Department
                </label>
                <select
                  value={formData.departmentId || ''}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] cursor-pointer"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Scope of work, deliverables, and service levels..."
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
              ></textarea>
            </div>
          </div>

          {/* Section 2: Counterparty & Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 pb-1 border-b border-stone-200">
              2. Counterparty &amp; Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Company / Vendor Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Consultancy Services Ltd"
                  value={formData.companyName || ''}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  placeholder="e.g. Deepak Saxena"
                  value={formData.contactPerson || ''}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  placeholder="vendor@company.com"
                  value={formData.contactEmail || ''}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={formData.contactPhone || ''}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Dates & Renewal Rules */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 pb-1 border-b border-stone-200">
              3. Critical Dates &amp; Notice Period
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">End Date *</label>
                <input
                  type="date"
                  required
                  value={formData.endDate || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endDate: e.target.value,
                      renewalDate: formData.renewalDate || e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Renewal Date
                </label>
                <input
                  type="date"
                  value={formData.renewalDate || ''}
                  onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Notice Period (Days)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.noticePeriodDays ?? 30}
                  onChange={(e) =>
                    setFormData({ ...formData, noticePeriodDays: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="autoRenewal"
                  checked={formData.autoRenewal || false}
                  onChange={(e) => setFormData({ ...formData, autoRenewal: e.target.checked })}
                  className="w-4 h-4 rounded text-[#243029] focus:ring-[#243029]"
                />
                <label htmlFor="autoRenewal" className="text-xs font-semibold text-stone-800 cursor-pointer">
                  Auto-Renewal Clause Enabled
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
                <select
                  value={formData.status || 'Active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] cursor-pointer"
                >
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Renewed">Renewed</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Financial Terms */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 pb-1 border-b border-stone-200">
              4. Financial Terms &amp; Currency
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contract Value
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.contractValue || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, contractValue: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Currency</label>
                <select
                  value={formData.currency || 'INR'}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] cursor-pointer"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Payment Frequency
                </label>
                <select
                  value={formData.paymentFrequency || 'Annual'}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentFrequency: e.target.value as any })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#243029] cursor-pointer"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Half-yearly">Half-yearly</option>
                  <option value="Annual">Annual</option>
                  <option value="One-time">One-time</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Custom Metadata Fields */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-stone-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                5. Custom Metadata Fields
              </h3>
              <button
                type="button"
                onClick={addCustomField}
                className="text-xs text-emerald-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Field</span>
              </button>
            </div>

            {formData.customFields?.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Label (e.g. Account Manager)"
                  value={field.label}
                  onChange={(e) => {
                    const next = [...(formData.customFields || [])];
                    next[idx].label = e.target.value;
                    setFormData({ ...formData, customFields: next });
                  }}
                  className="w-1/3 px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={field.value}
                  onChange={(e) => {
                    const next = [...(formData.customFields || [])];
                    next[idx].value = e.target.value;
                    setFormData({ ...formData, customFields: next });
                  }}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                />
                <button
                  type="button"
                  onClick={() => removeCustomField(idx)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Footer Save Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#243029] hover:bg-[#1A231E] text-white rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              {contractToEdit ? 'Save Changes' : 'Create Contract'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
