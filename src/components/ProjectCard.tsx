import React from 'react';
import type { SpecShoot } from '../types/database';
import { Calendar, MoreVertical } from 'lucide-react';

interface ProjectCardProps {
  shoot: SpecShoot;
  onClick: () => void;
}

const statusColors: Record<SpecShoot['status'], string> = {
  'Concept': 'bg-blue-50 text-blue-600',
  'Pre-Prod': 'bg-purple-50 text-purple-600',
  'Filming': 'bg-orange-50 text-orange-600',
  'Editing': 'bg-indigo-50 text-indigo-600',
  'Done': 'bg-green-50 text-green-600',
};

const ProjectCard: React.FC<ProjectCardProps> = ({ shoot, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-2xl overflow-hidden card-shadow hover:translate-y-[-2px] transition-all cursor-pointer"
    >
      <div className="aspect-video w-full bg-apple-gray relative overflow-hidden">
        {shoot.thumbnail_url ? (
          <img 
            src={shoot.thumbnail_url} 
            alt={shoot.title} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            No Preview
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full ${statusColors[shoot.status]}`}>
            {shoot.status}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 leading-snug">{shoot.title}</h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
        
        {shoot.shoot_date && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={14} />
            <span>{new Date(shoot.shoot_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
