import { useState } from 'react';
import Layout from './components/Layout';
import TabSwitcher from './components/TabSwitcher';
import GalleryView from './components/GalleryView';
import OutreachView from './components/OutreachView';
import EntryModal from './components/EntryModal';
import ConfirmModal from './components/ConfirmModal';
import ProjectDetailModal from './components/ProjectDetailModal';
import { useSpecShoots } from './hooks/useSpecShoots';
import { useOutreach } from './hooks/useOutreach';
import { isConfigured, supabase } from './lib/supabase';
import type { SpecShoot, CompanyOutreach, SpecShootStatus, OutreachStatus } from './types/database';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'Gallery' | 'Outreach'>('Gallery');
  const { shoots, loading: shootsLoading, addShoot, updateShoot, deleteShoot } = useSpecShoots();
  const { leads, loading: leadsLoading, addLead, updateLead, deleteLead } = useOutreach();

  // Modal states
  const [isShootModalOpen, setIsShootModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: string, type: 'shoot' | 'lead' } | null>(null);
  const [editingShoot, setEditingShoot] = useState<SpecShoot | null>(null);
  const [editingLead, setEditingLead] = useState<CompanyOutreach | null>(null);
  const [viewingShoot, setViewingShoot] = useState<SpecShoot | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Form states
  const [shootTitle, setShootTitle] = useState('');
  const [shootStatus, setShootStatus] = useState<SpecShootStatus>('Concept');
  const [shootDate, setShootDate] = useState('');
  const [shootNotes, setShootNotes] = useState('');
  const [shootThumbnail, setShootThumbnail] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [leadCompany, setLeadCompany] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [leadStatus, setLeadStatus] = useState<OutreachStatus>('Lead');
  const [leadIndustry, setLeadIndustry] = useState('');
  const [leadNotes, setLeadNotes] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isConfigured) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('thumbnails')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(filePath);

      setShootThumbnail(data.publicUrl);
    } catch (error: any) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddShoot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shootTitle) return;
    
    if (!isConfigured) {
      alert('Please configure your Supabase credentials in .env or Netlify settings first.');
      return;
    }
    
    const shootData = {
      title: shootTitle,
      status: shootStatus,
      shoot_date: shootDate || null,
      notes: shootNotes,
      thumbnail_url: shootThumbnail || null
    };

    if (editingShoot) {
      await updateShoot(editingShoot.id, shootData);
    } else {
      await addShoot(shootData);
    }
    
    setIsShootModalOpen(false);
    resetShootForm();
  };

  const resetShootForm = () => {
    setEditingShoot(null);
    setShootTitle('');
    setShootStatus('Concept');
    setShootDate('');
    setShootNotes('');
    setShootThumbnail('');
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadCompany) return;

    if (!isConfigured) {
      alert('Please configure your Supabase credentials in .env or Netlify settings first.');
      return;
    }

    const leadData = {
      company_name: leadCompany,
      contact_name: leadContact,
      status: leadStatus,
      industry: leadIndustry,
      notes: leadNotes
    };

    if (editingLead) {
      await updateLead(editingLead.id, leadData);
    } else {
      await addLead(leadData);
    }
    
    setIsLeadModalOpen(false);
    resetLeadForm();
  };

  const resetLeadForm = () => {
    setEditingLead(null);
    setLeadCompany('');
    setLeadContact('');
    setLeadStatus('Lead');
    setLeadIndustry('');
    setLeadNotes('');
  };

  const openEditShoot = (shoot: SpecShoot) => {
    setEditingShoot(shoot);
    setShootTitle(shoot.title);
    setShootStatus(shoot.status);
    setShootDate(shoot.shoot_date || '');
    setShootNotes(shoot.notes || '');
    setShootThumbnail(shoot.thumbnail_url || '');
    setIsShootModalOpen(true);
  };

  const openEditLead = (lead: CompanyOutreach) => {
    setEditingLead(lead);
    setLeadCompany(lead.company_name);
    setLeadContact(lead.contact_name || '');
    setLeadStatus(lead.status);
    setLeadIndustry(lead.industry || '');
    setLeadNotes(lead.notes || '');
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
              onAdd={() => { resetShootForm(); setIsShootModalOpen(true); }}
              onViewDetail={(shoot) => {
                setViewingShoot(shoot);
                setIsDetailModalOpen(true);
              }}
              onEdit={openEditShoot}
              onDelete={(id) => {
                setPendingDelete({ id, type: 'shoot' });
                setIsConfirmOpen(true);
              }}
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
              onAdd={() => { resetLeadForm(); setIsLeadModalOpen(true); }}
              onEdit={openEditLead}
              onDelete={(id) => {
                setPendingDelete({ id, type: 'lead' });
                setIsConfirmOpen(true);
              }}
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
        <form onSubmit={handleAddShoot} className="space-y-5 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Project Title</label>
              <input 
                autoFocus
                type="text" 
                value={shootTitle}
                onChange={(e) => setShootTitle(e.target.value)}
                placeholder="e.g. Summer Lifestyle Reel"
                className="w-full px-4 py-2.5 bg-apple-offwhite border-none rounded-xl focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm font-medium"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Status</label>
              <select 
                value={shootStatus}
                onChange={(e) => setShootStatus(e.target.value as SpecShootStatus)}
                className="w-full px-4 py-2.5 bg-apple-offwhite border-none rounded-xl focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm font-medium appearance-none"
              >
                {['Concept', 'Pre-Prod', 'Filming', 'Editing', 'Done'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Shoot Date</label>
              <input 
                type="date" 
                value={shootDate}
                onChange={(e) => setShootDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-apple-offwhite border-none rounded-xl focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Thumbnail</label>
            <div className="flex items-center gap-4">
              {shootThumbnail && (
                <img src={shootThumbnail} className="w-16 h-12 object-cover rounded-lg border border-gray-100" />
              )}
              <label className="flex-1 cursor-pointer">
                <div className="w-full px-4 py-2.5 bg-apple-offwhite border-2 border-dashed border-gray-200 rounded-xl text-center text-xs text-gray-500 hover:border-apple-blue hover:text-apple-blue transition-all">
                  {isUploading ? 'Uploading...' : shootThumbnail ? 'Change Image' : 'Upload Image'}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Notes</label>
            <textarea 
              rows={3}
              value={shootNotes}
              onChange={(e) => setShootNotes(e.target.value)}
              placeholder="Project details, gear needed, etc."
              className="w-full px-4 py-2.5 bg-apple-offwhite border-none rounded-xl focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm font-medium resize-none"
            />
          </div>

          <button 
            type="submit"
            disabled={isUploading}
            className="w-full bg-apple-blue text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/10 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
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
        <form onSubmit={handleAddLead} className="space-y-5 pt-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Company Name</label>
            <input 
              autoFocus
              type="text" 
              value={leadCompany}
              onChange={(e) => setLeadCompany(e.target.value)}
              placeholder="e.g. Apple Inc."
              className="w-full px-4 py-2.5 bg-apple-offwhite border-none rounded-xl focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Contact Person</label>
              <input 
                type="text" 
                value={leadContact}
                onChange={(e) => setLeadContact(e.target.value)}
                placeholder="Name"
                className="w-full px-4 py-2.5 bg-apple-offwhite border-none rounded-xl focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Industry</label>
              <input 
                type="text" 
                value={leadIndustry}
                onChange={(e) => setLeadIndustry(e.target.value)}
                placeholder="e.g. Tech"
                className="w-full px-4 py-2.5 bg-apple-offwhite border-none rounded-xl focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Pipeline Status</label>
            <select 
              value={leadStatus}
              onChange={(e) => setLeadStatus(e.target.value as OutreachStatus)}
              className="w-full px-4 py-2.5 bg-apple-offwhite border-none rounded-xl focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm font-medium appearance-none"
            >
              {['Lead', 'Contacted', 'In Talks', 'Signed'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Notes</label>
            <textarea 
              rows={3}
              value={leadNotes}
              onChange={(e) => setLeadNotes(e.target.value)}
              placeholder="Last contact date, budget, etc."
              className="w-full px-4 py-2.5 bg-apple-offwhite border-none rounded-xl focus:ring-2 focus:ring-apple-blue/20 transition-all text-sm font-medium resize-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-apple-blue text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/10 hover:bg-blue-600 transition-all active:scale-[0.98] mt-2"
          >
            {editingLead ? 'Save Changes' : 'Add Company'}
          </button>
        </form>
      </EntryModal>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          if (pendingDelete.type === 'shoot') {
            await deleteShoot(pendingDelete.id);
          } else {
            await deleteLead(pendingDelete.id);
          }
        }}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this ${pendingDelete?.type === 'shoot' ? 'project' : 'lead'}? This action cannot be undone.`}
      />

      <ProjectDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        shoot={viewingShoot}
        onEdit={() => viewingShoot && openEditShoot(viewingShoot)}
      />
    </Layout>
  );
}

export default App;
