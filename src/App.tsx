import { useState } from 'react';
import Layout from './components/Layout';
import TabSwitcher from './components/TabSwitcher';
import GalleryView from './components/GalleryView';
import OutreachView from './components/OutreachView';
import EntryModal from './components/EntryModal';
import { useSpecShoots } from './hooks/useSpecShoots';
import { useOutreach } from './hooks/useOutreach';
import { isConfigured } from './lib/supabase';
import type { SpecShoot, CompanyOutreach } from './types/database';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'Gallery' | 'Outreach'>('Gallery');
  const { shoots, loading: shootsLoading, addShoot, updateShoot } = useSpecShoots();
  const { leads, loading: leadsLoading, addLead, updateLead } = useOutreach();

  // Modal states
  const [isShootModalOpen, setIsShootModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingShoot, setEditingShoot] = useState<SpecShoot | null>(null);
  const [editingLead, setEditingLead] = useState<CompanyOutreach | null>(null);

  // Form states (simplified)
  const [shootTitle, setShootTitle] = useState('');
  const [leadCompany, setLeadCompany] = useState('');

  const handleAddShoot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shootTitle) return;
    
    if (!isConfigured) {
      alert('Please configure your Supabase credentials in .env or Netlify settings first.');
      return;
    }
    
    if (editingShoot) {
      await updateShoot(editingShoot.id, { title: shootTitle });
    } else {
      await addShoot({ 
        title: shootTitle, 
        status: 'Concept',
        notes: '',
        shoot_date: new Date().toISOString().split('T')[0],
        thumbnail_url: null 
      });
    }
    
    setIsShootModalOpen(false);
    setEditingShoot(null);
    setShootTitle('');
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadCompany) return;

    if (!isConfigured) {
      alert('Please configure your Supabase credentials in .env or Netlify settings first.');
      return;
    }

    if (editingLead) {
      await updateLead(editingLead.id, { company_name: leadCompany });
    } else {
      await addLead({ 
        company_name: leadCompany, 
        contact_name: '', 
        status: 'Lead', 
        notes: '', 
        industry: '' 
      });
    }
    
    setIsLeadModalOpen(false);
    setEditingLead(null);
    setLeadCompany('');
  };

  const openEditShoot = (shoot: SpecShoot) => {
    setEditingShoot(shoot);
    setShootTitle(shoot.title);
    setIsShootModalOpen(true);
  };

  const openEditLead = (lead: CompanyOutreach) => {
    setEditingLead(lead);
    setLeadCompany(lead.company_name);
    setIsLeadModalOpen(true);
  };

  return (
    <Layout 
      header={<TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />}
    >
      {!isConfigured && (
        <div className="mb-8 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-4 text-orange-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-orange-500 shadow-sm">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">Database Setup Required</p>
            <p className="text-xs opacity-80 mt-0.5">Please add your Supabase credentials to .env (local) or Netlify environment variables to start saving data.</p>
          </div>
          <a 
            href="https://github.com/gabadub123-cmd/Video-agency#setup" 
            target="_blank" 
            className="text-xs font-bold bg-orange-100 hover:bg-orange-200 px-4 py-2 rounded-full transition-all"
          >
            Setup Guide
          </a>
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'Gallery' ? (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
          >
            <GalleryView 
              shoots={shoots} 
              loading={shootsLoading} 
              onAdd={() => { setEditingShoot(null); setShootTitle(''); setIsShootModalOpen(true); }}
              onEdit={openEditShoot}
            />
          </motion.div>
        ) : (
          <motion.div
            key="outreach"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            <OutreachView 
              leads={leads} 
              loading={leadsLoading} 
              onAdd={() => { setEditingLead(null); setLeadCompany(''); setIsLeadModalOpen(true); }}
              onEdit={openEditLead}
              onUpdateStatus={(id, status) => updateLead(id, { status })}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <EntryModal 
        isOpen={isShootModalOpen} 
        onClose={() => setIsShootModalOpen(false)} 
        title={editingShoot ? 'Edit Spec Shoot' : 'New Spec Shoot'}
      >
        <form onSubmit={handleAddShoot} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Project Title</label>
            <input 
              autoFocus
              type="text" 
              value={shootTitle}
              onChange={(e) => setShootTitle(e.target.value)}
              placeholder="e.g. Summer Lifestyle Reel"
              className="w-full px-5 py-3 bg-apple-offwhite border-none rounded-2xl focus:ring-2 focus:ring-apple-blue/20 transition-all text-lg"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-apple-blue text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/10 hover:bg-blue-600 transition-all active:scale-[0.98]"
          >
            {editingShoot ? 'Save Changes' : 'Create Project'}
          </button>
        </form>
      </EntryModal>

      <EntryModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
        title={editingLead ? 'Edit Lead' : 'New Company Lead'}
      >
        <form onSubmit={handleAddLead} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Company Name</label>
            <input 
              autoFocus
              type="text" 
              value={leadCompany}
              onChange={(e) => setLeadCompany(e.target.value)}
              placeholder="e.g. Apple Inc."
              className="w-full px-5 py-3 bg-apple-offwhite border-none rounded-2xl focus:ring-2 focus:ring-apple-blue/20 transition-all text-lg"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-apple-blue text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/10 hover:bg-blue-600 transition-all active:scale-[0.98]"
          >
            {editingLead ? 'Save Changes' : 'Add Company'}
          </button>
        </form>
      </EntryModal>
    </Layout>
  );
}

export default App;
