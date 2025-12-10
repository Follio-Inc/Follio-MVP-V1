import React from 'react';

export const AppFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-sm text-slate-500 sm:flex-row">
        <div className="font-medium text-slate-400">© {new Date().getFullYear()} Follio. All rights reserved.</div>
        <div className="flex items-center gap-8 font-semibold">
          <button className="transition hover:text-blue-600 hover:underline hover:underline-offset-4">Terms</button>
          <button className="transition hover:text-blue-600 hover:underline hover:underline-offset-4">Privacy</button>
          <button className="transition hover:text-blue-600 hover:underline hover:underline-offset-4">Support</button>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
