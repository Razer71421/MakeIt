import React, { useState, useEffect } from 'react';
import { Camera, History as HistoryIcon, ArrowLeft, Settings, Info, Hammer, Sparkles, BookOpen, Moon, Sun } from 'lucide-react';
import { Onboarding } from './components/Onboarding';
import { CameraScanner } from './components/CameraScanner';
import { ResultView } from './components/ResultView';
import { HistoryView } from './components/HistoryView';
import { SettingsModal } from './components/SettingsModal';
import { LiquidGlassCard } from './components/LiquidGlassCard';
import { SocialButton } from './components/SocialButton';
import { ScanResult, AppScreen } from './types';
import { saveScan, getHistory } from './services/storageService';
import { triggerHaptic } from './services/hapticService';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('onboarding');
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const onboarded = localStorage.getItem('makeit_onboarded');
    if (onboarded === 'true') {
      setHasCompletedOnboarding(true);
      setCurrentScreen('home');
    }

    // Theme initialization
    const savedTheme = localStorage.getItem('makeit_theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    triggerHaptic('medium');
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('makeit_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('makeit_theme', 'light');
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('makeit_onboarded', 'true');
    setHasCompletedOnboarding(true);
    setCurrentScreen('home');
  };

  const handleScanComplete = (result: ScanResult) => {
    saveScan(result);
    setCurrentResult(result);
    setCurrentScreen('result');
  };

  const handleHistorySelect = (result: ScanResult) => {
    setCurrentResult(result);
    setCurrentScreen('result');
  };

  const navigateHome = () => {
    triggerHaptic('light');
    setCurrentScreen('home');
  };

  const openSettings = () => {
    triggerHaptic('light');
    setIsSettingsOpen(true);
  };
  
  const openHistory = () => {
    triggerHaptic('light');
    setCurrentScreen('history');
  };

  const openCamera = () => {
    // Already handled by LiquidGlassCard, but if called directly:
    setCurrentScreen('camera');
  };

  if (currentScreen === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="max-w-md mx-auto h-[100dvh] bg-[#F2F2F7] dark:bg-black transition-colors duration-500 relative overflow-hidden flex flex-col shadow-2xl dark:shadow-primary/20">
      
      {/* Background Gradient Orbs for Liquid Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-blue-500/30 rounded-full blur-[80px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-purple-500/30 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute top-[40%] left-[30%] w-64 h-64 bg-cyan-400/20 rounded-full blur-[90px] mix-blend-screen"></div>
      </div>

      {/* Header - Glassmorphic */}
      <header className="h-16 px-6 flex items-center justify-between sticky top-0 z-30 transition-all duration-300 bg-white/60 dark:bg-black/40 backdrop-blur-xl border-b border-white/20 dark:border-white/5">
        {currentScreen !== 'home' ? (
          <button 
            onClick={navigateHome}
            className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-white" />
          </button>
        ) : (
          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Camera size={18} />
             </div>
             <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">MakeIt</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
           <button 
             onClick={toggleTheme}
             className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
           >
             {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>
           
           {currentScreen === 'home' && (
             <button 
               onClick={openHistory}
               className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
             >
               <HistoryIcon className="w-5 h-5" />
             </button>
           )}
           <button 
             onClick={openSettings}
             className="p-2 -mr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
           >
             <Settings className="w-5 h-5" />
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative no-scrollbar z-10 scroll-smooth">
        {currentScreen === 'home' && (
          <div className="min-h-full flex flex-col items-center justify-center p-6 space-y-10 animate-fade-in py-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-light text-gray-900 dark:text-white leading-tight">
                Scan it.<br/>
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 drop-shadow-sm">
                  Create it.
                </span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                Discover the secrets of everyday objects and learn how to build them.
              </p>
            </div>

            <div className="relative group cursor-pointer" onClick={openCamera}>
              <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-3xl group-hover:blur-3xl transition-all duration-500 opacity-70"></div>
              
              <LiquidGlassCard className="w-24 h-24 rounded-full flex items-center justify-center !border-white/50 dark:!border-white/20 group-hover:scale-105 active:scale-95 !shadow-2xl shadow-blue-500/20">
                <Camera className="w-10 h-10 text-blue-600 dark:text-white" />
              </LiquidGlassCard>
              
              <p className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-sm font-medium text-blue-600 dark:text-blue-300">
                Tap to Scan
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full max-w-xs text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
              <LiquidGlassCard className="flex flex-col items-center justify-center p-4 !rounded-2xl" hoverEffect>
                  <Sparkles size={20} className="text-yellow-500 mb-2" />
                  <span>Identify</span>
              </LiquidGlassCard>
              
              <LiquidGlassCard className="flex flex-col items-center justify-center p-4 !rounded-2xl" hoverEffect>
                  <BookOpen size={20} className="text-blue-500 mb-2" />
                  <span>Learn</span>
              </LiquidGlassCard>
              
              <LiquidGlassCard className="flex flex-col items-center justify-center p-4 !rounded-2xl" hoverEffect>
                  <Hammer size={20} className="text-green-500 mb-2" />
                  <span>Build</span>
              </LiquidGlassCard>
            </div>

            <div className="w-full max-w-xs pt-4">
              <SocialButton username="rynthxms" />
            </div>
          </div>
        )}

        {currentScreen === 'camera' && (
          <CameraScanner onScanComplete={handleScanComplete} onCancel={navigateHome} />
        )}

        {currentScreen === 'result' && currentResult && (
          <ResultView result={currentResult} />
        )}

        {currentScreen === 'history' && (
          <HistoryView onSelect={handleHistorySelect} />
        )}
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
};

export default App;