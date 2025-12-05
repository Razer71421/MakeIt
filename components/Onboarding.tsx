import React, { useState } from 'react';
import { ChevronRight, Camera, Hammer, BookOpen } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <Camera size={48} className="text-primary" />,
      title: "Scan Anything",
      description: "Point your camera at any object to instantly identify it and see what it's made of."
    },
    {
      icon: <BookOpen size={48} className="text-secondary" />,
      title: "Learn How It's Made",
      description: "Get a detailed breakdown of the industrial manufacturing process behind everyday items."
    },
    {
      icon: <Hammer size={48} className="text-primary" />,
      title: "Create It Yourself",
      description: "Follow simple, step-by-step DIY guides to build your own version using basic tools."
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="h-screen bg-light dark:bg-black flex flex-col items-center justify-between p-8 animate-fade-in relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-20%] w-80 h-80 bg-secondary/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8 w-full max-w-sm z-10">
        <div className="w-32 h-32 rounded-3xl bg-white dark:bg-white/5 flex items-center justify-center mb-4 shadow-xl dark:shadow-2xl dark:shadow-primary/10 border border-gray-100 dark:border-white/10 backdrop-blur-xl">
          {steps[step].icon}
        </div>
        
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{steps[step].title}</h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{steps[step].description}</p>
        </div>

        <div className="flex space-x-2 mt-8">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-primary' : 'w-2 bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full max-w-sm bg-primary text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center space-x-2 active:scale-95 transition-transform z-10"
      >
        <span>{step === steps.length - 1 ? "Get Started" : "Next"}</span>
        <ChevronRight size={20} />
      </button>
    </div>
  );
};