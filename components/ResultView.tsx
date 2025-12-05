import React, { useState } from 'react';
import { ScanResult } from '../types';
import { LiquidGlassCard } from './LiquidGlassCard';
import { SocialButton } from './SocialButton';
import { Clock, AlertTriangle, PenTool, Layers, CheckCircle, Share2, Download, Lock, ChevronDown } from 'lucide-react';
import { triggerHaptic } from '../services/hapticService';

interface ResultViewProps {
  result: ScanResult;
}

export const ResultView: React.FC<ResultViewProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'make'>('overview');
  const [showPremium, setShowPremium] = useState(false);

  const handleTabChange = (tab: 'overview' | 'make') => {
    triggerHaptic('light');
    setActiveTab(tab);
  };

  const handlePremiumOpen = () => {
    triggerHaptic('medium');
    setShowPremium(true);
  };

  const handlePremiumClose = () => {
    triggerHaptic('light');
    setShowPremium(false);
  };

  return (
    <div className="pb-20 min-h-full animate-slide-up">
      {/* Hero Image */}
      <div className="relative h-80 w-full group">
        <img 
          src={result.imageUrl} 
          alt={result.objectName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
           <div className="inline-block px-3 py-1 mb-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-[10px] font-bold tracking-wider text-white uppercase">
             {Math.round(result.confidence)}% Confidence
           </div>
           <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{result.objectName}</h1>
           <p className="text-white/80 text-sm line-clamp-2">{result.shortDescription}</p>
        </div>
      </div>

      {/* Floating Animated Tabs */}
      <div className="px-6 -mt-8 relative z-20">
        <LiquidGlassCard className="p-1.5 flex relative !rounded-2xl !bg-white/80 dark:!bg-black/60 !border-white/40 dark:!border-white/10 shadow-xl backdrop-blur-xl">
          {/* Sliding Background Indicator */}
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl bg-white dark:bg-white/20 shadow-md shadow-black/5 transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${
                activeTab === 'overview' ? 'left-1.5 translate-x-0' : 'left-1.5 translate-x-[100%] ml-1.5'
            }`}
          />
          
          <button
            onClick={() => handleTabChange('overview')}
            className={`flex-1 relative z-10 py-3 text-sm font-bold text-center transition-colors duration-300 ${
              activeTab === 'overview' 
                ? 'text-black dark:text-white' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleTabChange('make')}
            className={`flex-1 relative z-10 py-3 text-sm font-bold text-center transition-colors duration-300 ${
              activeTab === 'make' 
                ? 'text-black dark:text-white' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            DIY Guide
          </button>
        </LiquidGlassCard>
      </div>

      {/* Content */}
      <div className="px-6 mt-6 space-y-6">
        
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Materials Section */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center opacity-80">
                <Layers className="w-5 h-5 mr-2" />
                Composition
              </h3>
              <LiquidGlassCard className="p-5">
                <ul className="space-y-4">
                  {result.materials.map((mat, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-white">{mat.name}</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{mat.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </LiquidGlassCard>
            </section>

            {/* Industrial Process */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 opacity-80">Industrial Process</h3>
              <div className="space-y-4">
                {result.manufacturingProcess.map((step, idx) => (
                  <LiquidGlassCard key={idx} className="p-5" hoverEffect>
                    <div className="absolute top-0 right-0 px-3 py-1 bg-gray-100/50 dark:bg-white/5 rounded-bl-2xl text-[10px] font-bold text-gray-500 dark:text-gray-400 border-b border-l border-white/50 dark:border-white/5 backdrop-blur-sm">
                      STEP {step.stepNumber}
                    </div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2 pr-12">{step.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>
                  </LiquidGlassCard>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'make' && (
          <div className="space-y-6 animate-fade-in">
             {/* Stats */}
             <div className="grid grid-cols-2 gap-4">
                <LiquidGlassCard className="p-4 text-center">
                  <span className="block text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1 font-bold">Difficulty</span>
                  <span className={`font-bold text-lg ${
                    result.diyGuide.difficulty === 'Easy' ? 'text-green-500' :
                    result.diyGuide.difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                  }`}>{result.diyGuide.difficulty}</span>
                </LiquidGlassCard>
                <LiquidGlassCard className="p-4 text-center">
                  <span className="block text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1 font-bold">Time</span>
                  <span className="font-bold text-lg text-gray-800 dark:text-white">{result.diyGuide.estimatedTime}</span>
                </LiquidGlassCard>
             </div>

             {/* Tools & Materials */}
             <LiquidGlassCard className="p-6">
                <div className="mb-6">
                   <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center text-sm uppercase tracking-wide opacity-70">
                     <PenTool className="w-4 h-4 mr-2" /> Tools Needed
                   </h4>
                   <div className="flex flex-wrap gap-2">
                      {result.diyGuide.toolsRequired.map((tool, i) => (
                        <span key={i} className="px-3 py-1 bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium border border-black/5 dark:border-white/5">
                          {tool}
                        </span>
                      ))}
                   </div>
                </div>
                <div>
                   <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center text-sm uppercase tracking-wide opacity-70">
                     <Layers className="w-4 h-4 mr-2" /> Materials Needed
                   </h4>
                   <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      {result.diyGuide.materialsNeeded.map((mat, i) => (
                        <li key={i} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mr-3"></div>
                          {mat}
                        </li>
                      ))}
                   </ul>
                </div>
             </LiquidGlassCard>

             {/* Steps */}
             <section>
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 opacity-80">Instructions</h3>
               <div className="space-y-4">
                  {result.diyGuide.steps.map((step, idx) => (
                    <LiquidGlassCard key={idx} className="p-5">
                       <div className="flex items-center mb-3">
                         <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-blue-500/30">
                           {step.stepNumber}
                         </div>
                         <h4 className="text-md font-bold text-gray-800 dark:text-white ml-3">Step {step.stepNumber}</h4>
                       </div>
                       
                       <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">{step.instruction}</p>
                       
                       {step.tip && (
                         <div className="mt-3 bg-blue-50/50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-3 rounded-xl text-xs text-blue-700 dark:text-blue-300 flex items-start">
                           <Clock className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                           <span className="font-medium">{step.tip}</span>
                         </div>
                       )}
                    </LiquidGlassCard>
                  ))}
               </div>
             </section>

             {/* Safety */}
             <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-2xl p-5 backdrop-blur-sm">
               <h3 className="text-red-700 dark:text-red-400 font-bold mb-3 flex items-center">
                 <AlertTriangle className="w-5 h-5 mr-2" /> Safety First
               </h3>
               <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-300 space-y-1 opacity-80">
                 {result.diyGuide.safetyNotes.map((note, i) => (
                   <li key={i}>{note}</li>
                 ))}
               </ul>
             </div>
        </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
           <LiquidGlassCard className="flex-1 p-3 flex items-center justify-center space-x-2" hoverEffect>
             <Share2 size={18} className="text-gray-700 dark:text-white" />
             <span className="font-medium text-gray-700 dark:text-white">Share</span>
           </LiquidGlassCard>
           
           <button 
             onClick={handlePremiumOpen}
             className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 active:opacity-90 relative overflow-hidden shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
           >
             <Download size={18} />
             <span>PDF Guide</span>
             <div className="absolute top-2 right-2 bg-white/20 rounded-full p-1 backdrop-blur-sm">
               <Lock size={10} />
             </div>
           </button>
        </div>

        <div className="pt-6 pb-4">
           <SocialButton username="rynthxms" />
        </div>
      </div>

      {/* Premium Modal (Mock) */}
      {showPremium && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-6 animate-fade-in">
           <LiquidGlassCard className="w-full max-w-sm !bg-white/90 dark:!bg-[#1A1A1A]/90 p-0">
             <div className="relative p-6 text-center overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[200px] bg-gradient-to-b from-blue-500/20 to-transparent rounded-[100%] pointer-events-none"></div>

                <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 transform -rotate-6">
                    <Lock size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unlock Pro</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                    Get downloadable PDF guides, unlimited history, and exclusive premium DIY projects.
                    </p>
                    <div className="space-y-3 mb-8 text-left bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Export High-Res PDFs
                    </div>
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Ad-Free Experience
                    </div>
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Cloud Sync
                    </div>
                    </div>
                    <button onClick={handlePremiumOpen} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 mb-3 hover:scale-[1.02] transition-transform">
                    Upgrade for $2.99
                    </button>
                    <button onClick={handlePremiumClose} className="text-gray-400 dark:text-gray-500 text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    Maybe Later
                    </button>
                </div>
             </div>
           </LiquidGlassCard>
        </div>
      )}
    </div>
  );
};