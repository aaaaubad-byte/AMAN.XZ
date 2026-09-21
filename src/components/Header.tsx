import React from 'react';
import { ShieldCheck, Database, Layers, Smartphone, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'sql' | 'architecture' | 'android';
  setActiveTab: (tab: 'sql' | 'architecture' | 'android') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">أمان | AMAN</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  V2 Master
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                منظومة حماية أرقام الهواتف — منصة ترحيل قاعدة البيانات ومحرك التطبيق
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('sql')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'sql'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>أمر ترحيل SQL</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-900/40 text-emerald-100">
                Supabase
              </span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>هندسة المنظومة والشجرة</span>
            </button>

            <button
              onClick={() => setActiveTab('android')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'android'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>جاهزية كود Android</span>
              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                <Sparkles className="w-2.5 h-2.5" />
                بانتظار الهوية
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
