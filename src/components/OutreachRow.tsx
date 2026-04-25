import React from 'react';
import type { CompanyOutreach, OutreachStatus } from '../types/database';
import { Trash2, Building2, User, Edit2 } from 'lucide-react';

interface OutreachRowProps {
  lead: CompanyOutreach;
  onUpdateStatus: (id: string, status: OutreachStatus) => void;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const statusThemes: Record<OutreachStatus, string> = {
  'Lead': 'bg-gray-100 text-gray-600',
  'Contacted': 'bg-blue-50 text-blue-600',
  'In Talks': 'bg-orange-50 text-orange-600',
  'Signed': 'bg-green-50 text-green-600',
};

const OutreachRow: React.FC<OutreachRowProps> = ({ lead, onUpdateStatus, onClick, onEdit, onDelete }) => {
  return (
    <tr 
      onClick={onClick}
      className="group hover:bg-apple-offwhite/80 transition-all border-b border-gray-100 last:border-0 cursor-pointer"
    >
      <td className="py-5 pl-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-400 shadow-sm border border-gray-100 transition-all group-hover:scale-105">
            <Building2 size={20} />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">{lead.company_name}</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">{lead.industry || 'General'}</div>
          </div>
        </div>
      </td>
      <td className="py-5">
        <div className="flex items-center gap-2.5 text-gray-600">
          <div className="w-6 h-6 rounded-full bg-apple-offwhite flex items-center justify-center text-gray-300">
            <User size={12} />
          </div>
          <span className="text-sm font-medium">{lead.contact_name || '—'}</span>
        </div>
      </td>
      <td className="py-5">
        <select 
          value={lead.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onUpdateStatus(lead.id, e.target.value as OutreachStatus)}
          className={`text-[11px] font-bold px-4 py-1.5 rounded-xl border-none focus:ring-4 focus:ring-apple-blue/10 cursor-pointer appearance-none shadow-sm ${statusThemes[lead.status]}`}
        >
          {['Lead', 'Contacted', 'In Talks', 'Signed'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
      <td className="py-5 pr-6 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-2.5 text-gray-400 hover:text-apple-blue hover:bg-white hover:shadow-sm rounded-xl transition-all"
            title="Edit Lead"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
            title="Delete Lead"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default OutreachRow;
