/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PasscodeLock from './components/PasscodeLock';
import WantedList from './components/WantedList';
import GangsOverview from './components/GangsOverview';
import StatsDashboard from './components/StatsDashboard';
import { WantedPerson } from './types';
import { OFFICIAL_GANGS, INITIAL_WANTED_PEOPLE, KNOWN_GANG_NAMES } from './data';
import { Shield, Radio, Key, Users, BarChart3, LogOut, CheckCircle2, ShieldAlert, Award } from 'lucide-react';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'gangs' | 'stats'>('search');
  
  // Loaded list of wanted people synced with localStorage
  const [wantedPeople, setWantedPeople] = useState<WantedPerson[]>([]);
  
  // Live session activity logs for the security auditor
  const [activityLogs, setActivityLogs] = useState<string[]>([]);
  
  // Notification toast helper
  const [notification, setNotification] = useState<string | null>(null);

  // Link clicked wanted person from another tab to directly view dossier
  const [selectedPersonFromExternal, setSelectedPersonFromExternal] = useState<WantedPerson | null>(null);

  // Initialize and Sync from LocalStorage
  useEffect(() => {
    const savedPeople = localStorage.getItem('Gid_WantedPeople_v2');
    if (savedPeople) {
      try {
        setWantedPeople(JSON.parse(savedPeople));
      } catch (e) {
        setWantedPeople(INITIAL_WANTED_PEOPLE);
      }
    } else {
      setWantedPeople(INITIAL_WANTED_PEOPLE);
      localStorage.setItem('Gid_WantedPeople_v2', JSON.stringify(INITIAL_WANTED_PEOPLE));
    }

    // Default starting logs
    setActivityLogs([
      'تم تأمين الاتصال بنجاح مع خوادم تشفير المخابرات العامة GID-SEC',
      'تحديث القوائم الدولية لتبادل معلومات المطلوبين والمشتبه بهم',
      'فحص كود الولوج الآمن - مسموح بالصلاحيات الكاملة للضابط المناوب'
    ]);
  }, []);

  // Save changes helper
  const savePeopleToLocalStorage = (list: WantedPerson[]) => {
    setWantedPeople(list);
    localStorage.setItem('Gid_WantedPeople_v2', JSON.stringify(list));
  };

  // Add Wanted Person trigger
  const handleAddPerson = (newPerson: WantedPerson) => {
    const updated = [newPerson, ...wantedPeople];
    savePeopleToLocalStorage(updated);

    // Logging & notification
    const matchedGang = KNOWN_GANG_NAMES.find(
      gName => gName.trim().toLowerCase() === newPerson.gangName.trim().toLowerCase()
    );

    let logMsg = `إدراج المطلوب "${newPerson.name}" (${newPerson.id})`;
    if (matchedGang) {
      logMsg += ` وتم ربطه تلقائياً بعصابة "${matchedGang}"`;
    } else {
      logMsg += ` كمسلح مستمر مستقل`;
    }

    setActivityLogs(prev => [logMsg, ...prev]);
    showToast(`تم إدراج وتسجيل مذكرات المطلوب "${newPerson.name}" بنجاح!`);
  };

  // Update Status inside dossier
  const handleUpdateStatus = (id: string, newStatus: 'ACTIVE' | 'CAPTURED' | 'WANTED') => {
    const updated = wantedPeople.map(p => {
      if (p.id === id) {
        const statusArabic = newStatus === 'ACTIVE' ? 'نشط ومطارد' : newStatus === 'CAPTURED' ? 'تم القبض عليه وحجزه' : 'أمر مراقبة وبحث';
        // Add log
        setActivityLogs(prev => [`تعديل الحالة الأمنية للمطلوب "${p.name}" إلى [${statusArabic}]`, ...prev]);
        return { ...p, status: newStatus };
      }
      return p;
    });
    savePeopleToLocalStorage(updated);
    showToast('تمت أرشفة وتحديث الحالة الاستخباراتية بنجاح.');
  };

  // Delete/Archive Wanted Person
  const handleDeletePerson = (id: string) => {
    const person = wantedPeople.find(p => p.id === id);
    if (person && confirm(`هل أنت متأكد من شطب وأرشفة ملف المطلوب "${person.name}" نهائياً من الشبكة النشطة؟`)) {
      const updated = wantedPeople.filter(p => p.id !== id);
      savePeopleToLocalStorage(updated);
      setActivityLogs(prev => [`شطب وأرشفة سجل الملاحقة لـ "${person.name}" (${id}) من الواجهة النشطة`, ...prev]);
      showToast('تم شطب ملف المطلوب وتدوين الأرشيف التاريخي.');
    }
  };

  // Switch to wanted dossier view when clicking an member from another page
  const handleSelectPersonFromExternal = (person: WantedPerson) => {
    setSelectedPersonFromExternal(person);
    setActiveTab('search');
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Unlocked login handler
  const handleUnlock = () => {
    setIsUnlocked(true);
    // Add login log
    setActivityLogs(prev => [`نجاح تصريح الولوج لضابط الارتباط المناوب. رمز التوثيق: SEC-2432`, ...prev]);
    showToast('مرحباً بك في النظام المركزي لرصد وتتبع المطلوبين');
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    setActiveTab('search');
  };

  // Handle Loading screen if unlocked is false
  if (!isUnlocked) {
    return <PasscodeLock onUnlock={handleUnlock} />;
  }

  return (
    <div id="main-app" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none relative pb-12">
      
      {/* Network background decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />

      {/* Primary Global Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 py-4 px-6 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo / GID info */}
          <div className="flex items-center gap-3 order-last md:order-first">
            
            {/* Status indicators */}
            <div className="text-right">
              <span className="text-[10px] text-red-500 font-bold block tracking-wider font-mono">GID CENTRAL CONSOLE</span>
              <h1 className="text-lg font-black text-white tracking-tight">نظام رصد المطلوبين والعصابات</h1>
            </div>

            <div className="w-10 h-10 bg-slate-950 rounded-full border border-slate-700/80 flex items-center justify-center text-red-500 shadow-md">
              <Shield className="w-5 h-5 animate-pulse" />
            </div>

          </div>

          {/* Connected officer profile & logout */}
          <div className="flex items-center gap-4">
            
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-right py-1 text-xs">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-emerald-400 font-bold">متصل - تصريح مأمون</span>
              </div>
              <div className="text-slate-400 font-semibold mt-0.5">ضابط الارتباط: المناوب الرئيسي</div>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-950/45 hover:bg-red-900 border border-red-900/40 text-red-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer font-sans"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج آمن</span>
            </button>

          </div>

        </div>
      </header>

      {/* Navigation Rails and Controls */}
      <div className="bg-slate-900/40 border-b border-slate-800/60 sticky top-16 z-30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex justify-end">
          
          <nav className="flex flex-wrap md:flex-row-reverse gap-2 w-full md:w-auto">
            
            <button
              onClick={() => {
                setActiveTab('search');
                setSelectedPersonFromExternal(null);
              }}
              className={`flex-1 md:flex-initial py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-slate-800 text-white shadow-inner border border-slate-755'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span>البحث وقائمة المطلوبين</span>
              <Users className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('gangs')}
              className={`flex-1 md:flex-initial py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'gangs'
                  ? 'bg-slate-800 text-white shadow-inner border border-slate-755'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span>ملفات الفصائل والعصابات الـ 10</span>
              <ShieldAlert className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 md:flex-initial py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-slate-800 text-white shadow-inner border border-slate-755'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span>مؤشرات التحليل الجنائي</span>
              <BarChart3 className="w-4 h-4" />
            </button>

          </nav>

        </div>
      </div>

      {/* Main Body container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8 relative z-10">
        
        {/* Dynamic Warning Notice */}
        <div className="mb-6 bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-center justify-between flex-row-reverse text-right text-xs">
          <div className="flex items-center gap-1.5 flex-row-reverse">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-slate-400">حالة الاتصال المركزي:</span>
            <span className="text-emerald-500 font-bold font-mono">ONLINE</span>
          </div>
          <div className="text-slate-500 font-mono text-[10px] hidden sm:block">
            SECURITY KEY: AES-256 // INTEGRITY APPROVED
          </div>
        </div>

        {/* Tab content switching with animations */}
        <div className="space-y-6">
          {activeTab === 'search' && (
            <WantedList
              people={wantedPeople}
              onUpdateStatus={handleUpdateStatus}
              onDeletePerson={handleDeletePerson}
              selectedPersonFromExternal={selectedPersonFromExternal}
              onClearExternalSelection={() => setSelectedPersonFromExternal(null)}
            />
          )}

          {activeTab === 'gangs' && (
            <GangsOverview
              gangs={OFFICIAL_GANGS}
              wantedPeople={wantedPeople}
              onSelectPerson={handleSelectPersonFromExternal}
            />
          )}

          {activeTab === 'stats' && (
            <StatsDashboard
              people={wantedPeople}
              gangs={OFFICIAL_GANGS}
              activityLogs={activityLogs}
            />
          )}
        </div>

      </main>

      {/* Floating System-wide Notifications toaster */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-emerald-500 shadow-2xl text-slate-100 py-3 px-6 rounded-xl flex items-center gap-3 space-x-reverse text-right"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span className="text-xs font-bold font-sans">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Small Legal Disclaimer */}
      <footer className="mt-auto pt-8 border-t border-slate-900/60 text-center text-xs text-slate-600 space-y-1">
        <div>النظام الرقمي لـ قطاع المخابرات العامة. جميع الحقوق المدنية والعسكرية محفوظة © 2026.</div>
        <div className="font-mono text-[10px]">CLASSIFIED DIRECTORY // PROTOTYPE INTERFACE FOR SECURE CONSOLE</div>
      </footer>

    </div>
  );
}
