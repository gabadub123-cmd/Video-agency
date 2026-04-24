import React from 'react';
import type { CompanyOutreach, OutreachStatus } from '../types/database';
import { Trash2, Building2, User, Edit2 } from 'lucide-react';

interface OutreachRowProps {
  lead: CompanyOutreach;
  onUpdateStatus: (id: string, status: OutreachStatus) => void;
  onEdit: (lead: CompanyOutreach) => void;
  onDelete: () => void;
}

const statusThemes: Record<OutreachStatus, string> = {
  'Lead': 'bg-gray-100 text-gray-600',
  'Contacted': 'bg-blue-50 text-blue-600',
  'In Talks': 'bg-orange-50 text-orange-600',
  'Signed': 'bg-green-50 text-green-600',
};

const OutreachRow: React.FC<OutreachRowProps> = ({ lead, onUpdateStatus, onEdit, onDelete }) => {
  return (
    <tr className="group hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
      <td className="py-5 pl-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-apple-gray flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm transition-all">
            <Building2 size={20} />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{lead.company_name}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">{lead.industry || 'Unknown Industry'}</div>
          </div>
        </div>
      </td>
      <td className="py-5">
        <div className="flex items-center gap-2 text-gray-600">
          <User size={14} className="text-gray-300" />
          <span className="text-sm">{lead.contact_name || '—'}</span>
        </div>
      </td>
      <td className="py-5">
        <select 
          value={lead.status}
          onChange={(e) => onUpdateStatus(lead.id, e.target.value as OutreachStatus)}
          className={`text-[12px] font-bold px-3 py-1 rounded-full border-none focus:ring-2 focus:ring-apple-blue/20 cursor-pointer appearance-none ${statusThemes[lead.status]}`}
        >
          {['Lead', 'Contacted', 'In Talks', 'Signed'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
      <td className="py-5 pr-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button 
            onClick={() => onEdit(lead)}
            className="p-2 text-gray-400 hover:text-apple-blue hover:bg-blue-50 rounded-lg transition-all"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default OutreachRow;
