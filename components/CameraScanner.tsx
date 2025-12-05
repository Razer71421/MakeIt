import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Zap } from 'lucide-react';
import { analyzeImage } from '../services/geminiService';
import { triggerHaptic } from '../services/hapticService';
import { ScanResult } from '../types';

interface CameraScannerProps {
  onScanComplete: (result: ScanResult) => void;
  onCancel: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onScanComplete, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      setError("Could not access camera. Please allow camera permissions.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    triggerHaptic('light'); // Initial feedback for button press
    setIsProcessing(true);

    // Draw video frame to canvas
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get base64 string
    const base64Image = canvas.toDataURL('image/jpeg', 0.7);

    try {
      // Pause video to show "captured" state
      video.pause();
      
      const result = await analyzeImage(base64Image);
      
      triggerHaptic('success'); // Success feedback
      onScanComplete(result);
    } catch (err: any) {
      triggerHaptic('error'); // Error feedback
      setError(err.message || "Failed to analyze object.");
      setIsProcessing(false);
      video.play(); // Resume if failed
    }
  };

  const handleCancel = () => {
    triggerHaptic('medium');
    onCancel();
  };

  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col">
      {/* Camera View */}
      <div className="relative flex-1 bg-gray-900 overflow-hidden">
        {!isStreaming && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
             <p className="mb-4">{error}</p>
             <button onClick={handleCancel} className="px-4 py-2 bg-gray-800 rounded-lg">Close</button>
          </div>
        ) : (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            className={`w-full h-full object-cover transition-opacity duration-500 ${isProcessing ? 'opacity-50' : 'opacity-100'}`}
          />
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pt-8 bg-gradient-to-b from-black/50 to-transparent">
             <button onClick={handleCancel} className="pointer-events-auto p-2 rounded-full bg-black/20 text-white backdrop-blur-md active:bg-black/40 transition-colors">
               <X size={24} />
             </button>
             <div className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-xs font-medium text-white/80 border border-white/10">
               Auto Mode
             </div>
          </div>

          {/* Scanner Box Animation */}
          {!isProcessing && isStreaming && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/30 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 border-[3px] border-primary/60 rounded-3xl"></div>
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
              
              {/* Scanning laser line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary shadow-[0_0_15px_rgba(74,144,226,0.8)] animate-pulse-slow w-full" 
                   style={{ animation: 'scan 2s linear infinite' }}>
              </div>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 relative">
                 <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-white font-medium text-lg tracking-wide animate-pulse">Analyzing...</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="h-32 bg-black flex items-center justify-center relative">
         <button 
           onClick={captureAndAnalyze}
           disabled={isProcessing || !isStreaming}
           className="w-20 h-20 rounded-full border-4 border-white/20 p-1 flex items-center justify-center group active:scale-95 transition-all"
         >
           <div className="w-full h-full bg-white rounded-full group-hover:scale-90 transition-transform duration-200"></div>
         </button>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(250px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};