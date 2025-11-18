import React from 'react';

interface BrandHeaderProps {
  action?: React.ReactNode;
  subdued?: boolean;
  className?: string;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({ action, subdued = false, className }) => {
  return (
    <header
      className={[
        'w-full',
        subdued ? 'bg-white/70 backdrop-blur border-b border-slate-200/70' : 'bg-white border-b border-slate-200',
        className
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 via-teal-500 to-indigo-500 text-lg font-semibold text-white shadow-md shadow-cyan-500/30">
            F
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-500">Follio</p>
            <p className="text-base font-semibold text-slate-900">Portfolio Experience Platform</p>
          </div>
        </div>
        {action && <div className="flex items-center gap-3 text-sm text-slate-600">{action}</div>}
      </div>
    </header>
  );
};

export default BrandHeader;
