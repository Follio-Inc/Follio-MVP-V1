import React from 'react';
import { Sparkles } from 'lucide-react';

interface BrandHeaderProps {
  action?: React.ReactNode;
  subdued?: boolean;
  className?: string;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({ action, subdued = false, className }) => {
  return (
    <header
      className={[
        'w-full transition-all duration-300 z-50',
        subdued ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0' : 'bg-transparent absolute top-0 left-0',
        className
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Follio.</span>
          </div>
        </div>
        {action && <div className="flex items-center gap-4 text-sm font-medium text-slate-600">{action}</div>}
      </div>
    </header>
  );
};

export default BrandHeader;
