import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, FileText, CheckCircle2, PlayCircle, Video, Edit2, PencilLine } from 'lucide-react';
import type { SpecShoot } from '../types/database';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  shoot: SpecShoot | null;
  onEdit: () => void;
}

const statusThemes: Record<SpecShoot['status'], { color: string, icon: any, bg: string }> = {
  'Concept': { color: 'text-blue-600', icon: Clock, bg: 'bg-blue-50' },
  'Pre-Prod': { color: 'text-purple-600', icon: PencilLine, bg: 'bg-purple-50' },
  'Filming': { color: 'text-orange-600', icon: Video, bg: 'bg-orange-50' },
  'Editing': { color: 'text-indigo-600', icon: PlayCircle, bg: 'bg-indigo-50' },
  'Done': { color: 'text-green-600', icon: CheckCircle2, bg: 'bg-green-50' },
};

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ isOpen, onClose, shoot, onEdit }) => {
  if (!shoot) return null;

  const theme = statusThemes[shoot.status];
  const StatusIcon = theme.icon;

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
            className="relative bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Thumbnail Sidebar (Mobile Top) */}
            <div className="w-full md:w-2/5 h-48 md:h-auto bg-apple-offwhite relative">
              {shoot.thumbnail_url ? (
                <img src={shoot.thumbnail_url} alt={shoot.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                   <Video size={48} strokeWidth={1} />
                </div>
              )}
              <div className="absolute top-4 left-4">
                 <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${theme.bg} ${theme.color} backdrop-blur-md bg-white/80 shadow-sm`}>
                    <StatusIcon size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">{shoot.status}</span>
                 </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 md:p-10 overflow-y-auto">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight leading-tight">{shoot.title}</h2>
                  <div className="flex items-center gap-2 text-gray-400 mt-2">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">
                      {shoot.shoot_date ? new Date(shoot.shoot_date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'Date not set'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 text-gray-900 mb-3">
                    <FileText size={18} className="text-apple-blue" />
                    <h3 className="font-bold text-lg">Project Notes</h3>
                  </div>
                  <div className="bg-apple-offwhite/50 rounded-2xl p-6 border border-gray-100">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {shoot.notes || 'No project notes available for this spec shoot.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100 flex gap-4">
                <button 
                  onClick={() => {
                    onClose();
                    onEdit();
                  }}
                  className="flex-1 bg-apple-blue text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-[0.98]"
                >
                  <Edit2 size={18} />
                  Edit Project
                </button>
                <button 
                  onClick={onClose}
                  className="px-8 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailModal;
