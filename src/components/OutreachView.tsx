import React from 'react';
import OutreachRow from './OutreachRow';
import type { CompanyOutreach, OutreachStatus } from '../types/database';
import { Plus, Search } from 'lucide-react';

interface OutreachViewProps {
  leads: CompanyOutreach[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (lead: CompanyOutreach) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: OutreachStatus) => void;
}

const OutreachView: React.FC<OutreachViewProps> = ({ leads, loading, onAdd, onEdit, onDelete, onUpdateStatus }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Lead Outreach</h1>
          <p className="text-gray-500 mt-1">Manage company contacts and sales pipeline</p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 bg-apple-blue text-white px-5 py-2.5 rounded-full font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
        >
          <Plus size={18} />
          <span>New Lead</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden card-shadow">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search companies..." 
              className="w-full pl-10 pr-4 py-2 bg-apple-offwhite border-none rounded-xl text-sm focus:ring-2 focus:ring-apple-blue/20 transition-all"
            />
          </div>
          <div className="text-sm text-gray-400 font-medium">
            {leads.length} Companies
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-apple-offwhite/50 text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100">
                <th className="py-4 pl-6">Company</th>
                <th className="py-4">Contact</th>
                <th className="py-4">Status</th>
                <th className="py-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <OutreachRow 
                  key={lead.id} 
                  lead={lead} 
                  onUpdateStatus={onUpdateStatus} 
                  onEdit={onEdit} 
                  onDelete={() => onDelete(lead.id)}
                />
              ))}
              
              {!loading && leads.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-gray-400">
                    No leads found. Start by adding a new company.
                  </td>
                </tr>
              )}
              
              {loading && (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse border-b border-gray-100">
                    <td className="py-6 pl-6"><div className="h-4 w-32 bg-gray-100 rounded" /></td>
                    <td className="py-6"><div className="h-4 w-24 bg-gray-100 rounded" /></td>
                    <td className="py-6"><div className="h-4 w-20 bg-gray-100 rounded" /></td>
                    <td className="py-6 pr-6"><div className="h-4 w-10 bg-gray-100 rounded ml-auto" /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OutreachView;
