import React from 'react';
import { useStore } from '../store/useStore';

const GlobalProgress: React.FC = () => {
    const isGlobalLoading = useStore((state) => state.isGlobalLoading);

    if (!isGlobalLoading) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[1000] h-1 overflow-hidden bg-primary/20">
        <div className="h-full bg-primary shadow-[0_0_10px_#00E5FF] animate-progress-loop"></div>
            <style>{`
        @keyframes progress-loop {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(-10%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress-loop {
          width: 50%;
          animation: progress-loop 1.5s infinite linear;
        }
      `}</style>
    </div>
);
};

export default GlobalProgress;