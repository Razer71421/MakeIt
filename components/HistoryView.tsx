import React, { useEffect, useState } from 'react';
import { ScanResult } from '../types';
import { LiquidGlassCard } from './LiquidGlassCard';
import { SocialButton } from './SocialButton';
import { getHistory, deleteScan } from '../services/storageService';
import { Trash2, ChevronRight, Clock } from 'lucide-react';

interface HistoryViewProps {
  onSelect: (result: ScanResult) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelect }) => {
  const [history, setHistory] = useState<ScanResult[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteScan(id);
    setHistory(getHistory());
  };

  return (
    <div className="p-6 min-h-full animate-fade-in pb-24">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pl-2">History</h2>
      
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-600">
          <Clock size={48} className="mb-4 opacity-20" />
          <p>No scans yet.</p>
          <p className="text-sm">Scan an object to start building!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <LiquidGlassCard 
              key={item.id}
              onClick={() => onSelect(item)}
              className="p-3 flex items-center group"
              hoverEffect
            >
              <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-white/5 overflow-hidden flex-shrink-0 relative border border-gray-200 dark:border-white/10 shadow-inner">
                 <img src={item.imageUrl} alt={item.objectName} className="w-full h-full object-cover" />
              </div>
              
              <div className="ml-4 flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 dark:text-white truncate">{item.objectName}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{item.shortDescription}</p>
                <div className="flex items-center mt-1.5">
                   <div className="text-[10px] bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400 font-medium">
                      {new Date(item.timestamp).toLocaleDateString()}
                   </div>
                </div>
              </div>

              <button 
                onClick={(e) => handleDelete(e, item.id)}
                className="p-3 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <Trash2 size={18} />
              </button>
            </LiquidGlassCard>
          ))}
        </div>
      )}

      <div className="mt-8">
        <SocialButton username="rynthxms" />
      </div>
    </div>
  );
};