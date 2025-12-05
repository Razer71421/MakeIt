import React from 'react';
import { Instagram } from 'lucide-react';
import { triggerHaptic } from '../services/hapticService';

interface SocialButtonProps {
  username: string;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ username }) => {
  return (
    <a
      href={`https://instagram.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => triggerHaptic('light')}
      className="group relative flex items-center gap-3 p-3 rounded-xl
                 bg-white/50 dark:bg-white/5 
                 border border-gray-200/50 dark:border-white/10
                 hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-pink-500/10
                 hover:border-pink-500/30 dark:hover:border-pink-500/30
                 transition-all duration-300 active:scale-95 text-decoration-none"
    >
      <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform duration-300">
        <Instagram size={20} />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Follow on Instagram</span>
        <span className="text-sm font-bold text-gray-800 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">@{username}</span>
      </div>
      
      {/* External link arrow hint */}
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300 text-gray-400">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
         </svg>
      </div>
    </a>
  );
};