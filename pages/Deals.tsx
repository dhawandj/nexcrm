import React, { useState } from 'react';
import { Plus, MoreHorizontal, X, Save, Trash2, Edit2, DollarSign, Calendar } from 'lucide-react';
import { storage } from '../services/storage';
import { Deal, DealStage } from '../types';

const STAGES = Object.values(DealStage);

export const Deals: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(() => storage.getDeals());
  const [draggedDealId, setDraggedDealId] = useState<number | null>(null);

  const saveToStorage = (newDeals: Deal[]) => {
    setDeals(newDeals);
    storage.saveDeals(newDeals);
  };

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    value: 0,
    stage: DealStage.NEW,
    expected_close: '',
    contact_id: 1, // Default mock
    owner_id: 101 // Default mock
  });

  const resetForm = () => {
    setFormData({
      title: '',
      value: 0,
      stage: DealStage.NEW,
      expected_close: '',
      contact_id: 1,
      owner_id: 101
    });
    setEditingId(null);
  };

  const handleOpenModal = (deal?: Deal) => {
    if (deal) {
      setEditingId(deal.id);
      setFormData({
        title: deal.title,
        value: deal.value,
        stage: deal.stage,
        expected_close: deal.expected_close,
        contact_id: deal.contact_id,
        owner_id: deal.owner_id
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing
      const updated = deals.map(d => 
        d.id === editingId ? { ...d, ...formData } : d
      );
      saveToStorage(updated);
    } else {
      // Create new
      const newDeal: Deal = {
        id: Date.now(),
        ...formData
      };
      saveToStorage([...deals, newDeal]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this deal?')||true) {
      const updated = deals.filter(d => d.id !== id);
      saveToStorage(updated);
    }
  };

  // Drag and Drop Logic
  const handleDragStart = (id: number) => {
    setDraggedDealId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stage: DealStage) => {
    if (draggedDealId === null) return;
    
    const updated = deals.map(deal => 
        deal.id === draggedDealId ? { ...deal, stage } : deal
    );
    saveToStorage(updated);
    setDraggedDealId(null);
  };

  const getStageColor = (stage: DealStage) => {
    switch(stage) {
      case DealStage.NEW: return 'bg-blue-50 border-blue-200 text-blue-700';
      case DealStage.QUALIFIED: return 'bg-purple-50 border-purple-200 text-purple-700';
      case DealStage.PROPOSAL: return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      case DealStage.NEGOTIATION: return 'bg-orange-50 border-orange-200 text-orange-700';
      case DealStage.WON: return 'bg-green-50 border-green-200 text-green-700';
      case DealStage.LOST: return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals Pipeline</h1>
          <p className="text-gray-500">Track your opportunities by stage.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          New Deal
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-4 h-full min-w-[1200px]">
          {STAGES.map((stage) => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div 
                key={stage} 
                className="flex-1 min-w-[280px] flex flex-col bg-gray-100 rounded-xl"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage)}
              >
                <div className="p-3 border-b border-gray-200/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 text-sm">{stage}</span>
                    <span className="bg-white text-gray-500 text-xs px-2 py-0.5 rounded-full border border-gray-200 shadow-sm">
                      {stageDeals.length}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    ${stageTotal.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 flex-1 overflow-y-auto custom-scroll space-y-3">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => handleDragStart(deal.id)}
                      className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-move hover:shadow-md transition-shadow group relative"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{deal.title}</h4>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleOpenModal(deal); }}
                            className="p-1 hover:bg-indigo-50 hover:text-indigo-600 rounded"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(deal.id); }}
                            className="p-1 hover:bg-red-50 hover:text-red-600 rounded"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-gray-900 mb-2">
                        ${deal.value.toLocaleString()}
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                         <span className={`px-2 py-0.5 rounded border ${getStageColor(stage)}`}>
                            {deal.expected_close}
                         </span>
                         <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[10px]">
                            JD
                         </div>
                      </div>
                    </div>
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                      Drop deals here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Deal' : 'New Deal'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deal Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                  placeholder="e.g. Website Redesign"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.value}
                    onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                   <select
                      value={formData.stage}
                      onChange={e => setFormData({...formData, stage: e.target.value as DealStage})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                   >
                      {STAGES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                   </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close</label>
                  <div className="relative">
                     <input 
                        type="date" 
                        required
                        value={formData.expected_close}
                        onChange={e => setFormData({...formData, expected_close: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                     />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};