import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Home, Compass } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
          <Car className="w-8 h-8" />
        </div>

        <div>
          <span className="text-4xl font-black text-brand-600 tracking-tight">404</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Off The Beaten Track
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            The page or vehicle you are searching for doesn't exist or has moved. Let's steer you back in the right direction.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Back to Home
          </Link>
          <Link
            to="/vehicles"
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 flex items-center justify-center gap-1.5 shadow-sm shadow-brand-500/20 transition-all"
          >
            <Compass className="w-3.5 h-3.5" />
            Browse Fleet
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
