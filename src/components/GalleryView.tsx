import React from 'react';
import ProjectCard from './ProjectCard';
import type { SpecShoot } from '../types/database';
import { Plus } from 'lucide-react';

interface GalleryViewProps {
  shoots: SpecShoot[];
  loading: boolean;
  onAdd: () => void;
  onViewDetail: (shoot: SpecShoot) => void;
  onEdit: (shoot: SpecShoot) => void;
  onDelete: (id: string) => void;
}

const GalleryView: React.FC<GalleryViewProps> = ({ shoots, loading, onAdd, onViewDetail, onEdit, onDelete }) => {
  if (loading && shoots.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-[4/5] bg-white rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Spec Shoots</h1>
          <p className="text-gray-500 mt-1">Track internal video production projects</p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 bg-apple-blue text-white px-5 py-2.5 rounded-full font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
        >
          <Plus size={18} />
          <span>New Shoot</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {shoots.map((shoot) => (
          <ProjectCard 
            key={shoot.id} 
            shoot={shoot} 
            onClick={() => onViewDetail(shoot)} 
            onEdit={(e) => { e.stopPropagation(); onEdit(shoot); }}
            onDelete={(e) => { e.stopPropagation(); onDelete(shoot.id); }}
          />
        ))}
        
        {shoots.length === 0 && !loading && (
          <div 
            onClick={onAdd}
            className="aspect-video border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-apple-blue hover:text-apple-blue transition-all cursor-pointer group"
          >
            <Plus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Create your first spec shoot</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryView;
