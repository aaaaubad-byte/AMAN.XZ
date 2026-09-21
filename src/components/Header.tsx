import React from 'react';
import {
  Smartphone,
  Shield,
  Palette,
  Code2,
  Database,
  Layers,
  Sparkles
} from 'lucide-react';
import { AmanLogo } from './AmanLogo';

export type MainTab =
  | 'customer_app'
  | 'admin_portal'
  | 'design_system'
  | 'android_code'
  | 'sql_schema';

interface HeaderProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  pendingRequestsCount: number;
  openTasksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pendingRequestsCount,
  openTasksCount
}) => {
  const tabs = [
    {
      id: 'customer_app' as MainTab,
      label: 'تطبيق العميل (Android)',
      icon: Smartphone
    },
    {
      id: 'admin_portal' as MainTab,
      label: 'بوابة الإدارة (Admin)',
      icon: Shield,
      badge: pendingRequestsCount + openTasksCount
    },
    {
      id: 'design_system' as MainTab,
      label: 'الهوية البصرية (Design Tokens)',
      icon: Palette
    },
    {
      id: 'android_code' as MainTab,
      label: 'أكواد أندرويد (Kotlin)',
      icon: Code2
    },
    {
      id: 'sql_schema' as MainTab,
      label: 'مخطط Supabase SQL',
      icon: Database
    }
  ];

  return (
    <header className="bg-white border-b border-[#DCE9E6] sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between py-3 gap-3">
          {/* Official Brand Logo */}
          <div className="flex items-center gap-4">
            <AmanLogo size="md" />
            <div className="hidden sm:block border-r border-[#DCE9E6] pr-4 text-right">
              <span className="text-[11px] font-bold text-[#087F6E] bg-[#E9F8F5] px-2 py-0.5 rounded-full">
                V2 Production Master
              </span>
              <p className="text-[11px] text-[#6E7A77] mt-0.5">
                تطبيق أندرويد موحد بتجربتين (عميل + إدارة) مع قاعدة بيانات Supabase
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#087F6E] text-white shadow-xs'
                      : 'text-[#183B2D] hover:bg-[#E9F8F5] hover:text-[#087F6E]'
                  }`}
                >
                  <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#087F6E]'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? 'bg-white text-[#087F6E]' : 'bg-[#FEF3C7] text-[#D97706]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
