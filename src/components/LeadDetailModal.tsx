import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, User, Mail, Phone, Tag, FileText, Edit2, ExternalLink } from 'lucide-react';
import type { CompanyOutreach } from '../types/database';

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: CompanyOutreach | null;
  onEdit: () => void;
}

const statusThemes: Record<CompanyOutreach['status'], { color: string, bg: string }> = {
  'Lead': { color: 'text-blue-600', bg: 'bg-blue-50' },
  'Contacted': { color: 'text-orange-600', bg: 'bg-orange-50' },
  'In Talks': { color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'Signed': { color: 'text-green-600', bg: 'bg-green-50' },
};

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ isOpen, onClose, lead, onEdit }) => {
  if (!lead) return null;

  const theme = statusThemes[lead.status];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl p-8 md:p-10"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-apple-offwhite rounded-2xl flex items-center justify-center text-apple-blue">
                  <Building2 size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{lead.company_name}</h2>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${theme.bg} ${theme.color} text-[10px] font-bold uppercase tracking-wider mt-1`}>
                    {lead.status}
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Contact Info Section */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4 p-4 bg-apple-offwhite/50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Person</p>
                    <p className="text-sm font-semibold text-gray-900">{lead.contact_name || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-apple-offwhite/50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                      <p className="text-sm font-semibold text-gray-900">{lead.email || 'No email'}</p>
                    </div>
                  </div>
                  {lead.email && (
                    <a href={`mailto:${lead.email}`} className="p-2 text-apple-blue hover:bg-blue-50 rounded-lg transition-colors">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-apple-offwhite/50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-900">{lead.phone || 'No phone'}</p>
                    </div>
                  </div>
                  {lead.phone && (
                    <a href={`tel:${lead.phone}`} className="p-2 text-apple-blue hover:bg-blue-50 rounded-lg transition-colors">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>

              {/* Industry & Notes */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Tag size={16} className="text-gray-400" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Industry:</span>
                  <span className="text-sm font-semibold text-gray-900">{lead.industry || 'General'}</span>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-gray-900 mb-2">
                    <FileText size={16} className="text-apple-blue" />
                    <h3 className="font-bold text-sm">Notes</h3>
                  </div>
                  <div className="bg-apple-offwhite/50 rounded-2xl p-5 border border-gray-100 min-h-[100px]">
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {lead.notes || 'No notes available for this lead.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-3">
              <button 
                onClick={() => {
                  onClose();
                  onEdit();
                }}
                className="flex-1 bg-apple-blue text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:bg-blue-600 transition-all active:scale-[0.98]"
              >
                <Edit2 size={18} />
                Edit Lead
              </button>
              <button 
                onClick={onClose}
                className="flex-1 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeadDetailModal;
