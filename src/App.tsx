import React, { useState } from 'react';
import { Header } from './components/Header';
import { SqlMigrationSection } from './components/SqlMigrationSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { AndroidCodeSection } from './components/AndroidCodeSection';

export default function App() {
  const [activeTab, setActiveTab] = useState<'sql' | 'architecture' | 'android'>('sql');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Cairo',sans-serif]">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'sql' && <SqlMigrationSection />}
        {activeTab === 'architecture' && <ArchitectureSection />}
        {activeTab === 'android' && <AndroidCodeSection />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>منظومة أمان لحماية أرقام الهواتف من السحب وإعادة البيع — AMAN | أمان</p>
          <p className="font-mono text-slate-400">ONE APK • ONE Supabase Backend • Two Role-Based Experiences</p>
        </div>
      </footer>
    </div>
  );
}
