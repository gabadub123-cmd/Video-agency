import React from 'react';
import type { SpecShoot } from '../types/database';
import { Calendar, Trash2, Edit3 } from 'lucide-react';

interface ProjectCardProps {
  shoot: SpecShoot;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const statusColors: Record<SpecShoot['status'], string> = {
  'Concept': 'bg-blue-50 text-blue-600',
  'Pre-Prod': 'bg-purple-50 text-purple-600',
  'Filming': 'bg-orange-50 text-orange-600',
  'Editing': 'bg-indigo-50 text-indigo-600',
  'Done': 'bg-green-50 text-green-600',
};

const ProjectCard: React.FC<ProjectCardProps> = ({ shoot, onClick, onEdit, onDelete }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-3xl overflow-hidden card-shadow hover:translate-y-[-4px] transition-all duration-300 cursor-pointer border border-gray-100/50"
    >
      <div className="aspect-video w-full bg-apple-offwhite relative overflow-hidden">
        {shoot.thumbnail_url ? (
          <img 
            src={shoot.thumbnail_url} 
            alt={shoot.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Calendar size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">No Thumbnail</span>
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[shoot.status]}`}>
            {shoot.status}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 leading-snug group-hover:text-apple-blue transition-colors">{shoot.title}</h3>
          <div className="flex gap-1 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-apple-blue hover:bg-blue-50 rounded-lg transition-all"
              title="Edit Project"
            >
              <Edit3 size={16} />
            </button>
            <button 
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Delete Project"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-medium uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-gray-300" />
            <span>{shoot.shoot_date ? new Date(shoot.shoot_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Date'}</span>
          </div>
          <span className="text-apple-blue/40 font-bold group-hover:text-apple-blue transition-colors">View Details →</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
