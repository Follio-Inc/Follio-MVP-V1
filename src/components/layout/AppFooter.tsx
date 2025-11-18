import React from 'react';

export const AppFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-500 sm:flex-row">
        <div>© {new Date().getFullYear()} Follio. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <button className="transition hover:text-slate-900">Terms</button>
          <button className="transition hover:text-slate-900">Privacy</button>
          <button className="transition hover:text-slate-900">Support</button>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
