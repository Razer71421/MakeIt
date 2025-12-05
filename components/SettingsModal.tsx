import React, { useState, useEffect } from 'react';
import { X, Key, Shield, Info } from 'lucide-react';
import { LiquidGlassCard } from './LiquidGlassCard';
import { SocialButton } from './SocialButton';
import { setApiKey, hasApiKey } from '../services/geminiService';
import { triggerHaptic } from '../services/hapticService';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [key, setKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (hasApiKey()) {
        setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    triggerHaptic('success');
    if (key.trim()) {
      setApiKey(key.trim());
      setIsSaved(true);
      // Visual feedback
      const btn = document.getElementById('save-btn');
      if (btn) {
          btn.innerText = "Saved!";
          setTimeout(() => btn.innerText = "Save", 2000);
      }
    } else {
        // If empty, clear it
        setApiKey('');
        setIsSaved(false);
    }
  };

  const handleClose = () => {
    triggerHaptic('light');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-6 animate-fade-in">
      <LiquidGlassCard className="w-full max-w-md !bg-white/90 dark:!bg-[#1A1A1A]/95 p-0 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-gray-200/50 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
          <h2 className="font-bold text-lg text-gray-800 dark:text-white">Settings</h2>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start space-x-3">
             <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
             <div className="text-sm text-blue-800 dark:text-blue-200">
               <p className="font-bold mb-1">Developer Mode</p>
               <p className="opacity-90">This app uses Google Gemini 2.5 Flash (Free Tier). To use the scanning feature, ensure the API key is configured in settings or environment variables.</p>
             </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
               <Key className="w-4 h-4 mr-2" /> Gemini API Key
             </label>
             <div className="flex gap-2">
               <input 
                 type="password" 
                 value={key}
                 onChange={(e) => setKey(e.target.value)}
                 placeholder={isSaved ? "Key is configured (hidden)" : "Enter API Key"}
                 className="flex-1 bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder-gray-400 shadow-inner"
               />
               <button 
                 id="save-btn"
                 onClick={handleSave}
                 className="bg-gray-900 dark:bg-white text-white dark:text-black px-5 rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-transform min-w-[80px]"
               >
                 Save
               </button>
             </div>
             <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 pl-1">
               Get a free key at <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="underline hover:text-blue-500">aistudio.google.com</a>
             </p>
          </div>

          <div className="pt-6 border-t border-gray-200/50 dark:border-white/5">
             <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">About</h3>
             <div className="text-xs text-gray-500 dark:text-gray-400 space-y-4">
               <p>Version 1.0.0 (Beta)</p>
               <p>MakeIt is a free-to-develop tool designed to democratize manufacturing knowledge.</p>
               
               <div className="pt-2">
                  <SocialButton username="rynthxms" />
               </div>
             </div>
          </div>

        </div>
      </LiquidGlassCard>
    </div>
  );
};