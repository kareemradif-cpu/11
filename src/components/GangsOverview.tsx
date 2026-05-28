/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gang, WantedPerson } from '../types';
import { Users, ShieldAlert, Key, MapPin, Target, Eye, User, FileText, Calendar, Swords, Info } from 'lucide-react';

interface GangsOverviewProps {
  gangs: Gang[];
  wantedPeople: WantedPerson[];
  onSelectPerson: (person: WantedPerson) => void;
}

export default function GangsOverview({ gangs, wantedPeople, onSelectPerson }: GangsOverviewProps) {
  const [selectedGangName, setSelectedGangName] = useState<string | null>(null);

  // Helper to get members of a particular gang
  const getGangMembers = (gName: string) => {
    return wantedPeople.filter(
      p => p.gangName.trim().toLowerCase() === gName.trim().toLowerCase()
    );
  };

  const selectedGang = gangs.find(g => g.name === selectedGangName);
  const selectedGangMembers = selectedGang ? getGangMembers(selectedGang.name) : [];

  return (
    <div id="gangs-page" className="space-y-6 text-right font-sans">
      
      {/* Intro Bannner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-6 -translate-y-1/2 opacity-10 pointer-events-none hidden md:block">
          <Swords className="w-32 h-32 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2 flex items-center justify-end gap-2">
          <span>ملفات المنظمات والعصابات النشطة</span>
          <ShieldAlert className="w-5 h-5 text-red-500" />
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mr-auto">
          توضح هذه الصفحة النفوذ الأمني والمقرات الافتراضية للفصائل الـ 10 المعرّفة تحت التهديد الوطني الأمني. يتم تصنيف أي مطلوب جديد يضاف لمصلحة هذه المنظمات تزامناً وتلقائياً تحت ملف المنظمة فور مطابقة الاسم.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sidebar Gangs Listing Selection */}
        <div className="lg:col-span-1 space-y-3 order-last lg:order-first">
          <div className="text-sm font-bold text-slate-400 mb-2 px-1">قائمة الفصائل المرصودة ({gangs.length})</div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {gangs.map((gang) => {
              const members = getGangMembers(gang.name);
              const isActive = selectedGangName === gang.name;
              
              return (
                <button
                  key={gang.name}
                  onClick={() => setSelectedGangName(gang.name)}
                  className={`w-full p-4 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 duration-200 outline-none ${
                    isActive
                      ? 'bg-slate-800/90 border-red-600 shadow-md shadow-red-950/20'
                      : 'bg-slate-900 hover:bg-slate-850 border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    {/* Badge */}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      gang.dangerLevel === 'CRITICAL'
                        ? 'bg-red-950/60 text-red-400 border border-red-850'
                        : gang.dangerLevel === 'HIGH'
                        ? 'bg-orange-950/60 text-orange-400 border border-orange-850'
                        : 'bg-yellow-950/60 text-yellow-500 border border-yellow-850'
                    }`}>
                      {gang.dangerLevel === 'CRITICAL' ? 'تهديد حرج 🔴' : gang.dangerLevel === 'HIGH' ? 'تهديد مرتفع 🟠' : 'تهديد متوسط 🟡'}
                    </span>
                    
                    <div className="text-left">
                      <h3 className="text-white font-bold text-base tracking-wide font-mono">{gang.name}</h3>
                      <p className="text-slate-400 text-xs mt-0.5 font-bold">{gang.arabicName}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center w-full pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <span className={`w-2 h-2 rounded-full ${members.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
                      <strong className="text-slate-200">{members.length}</strong> مطلوب مسجل
                    </span>
                    <span className="flex items-center gap-1 text-[11px] truncate max-w-[150px]">
                      <span className="text-slate-500">القائد:</span>
                      <span className="text-slate-300 font-medium truncate">{gang.leader.split(' ')[0]}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Central Intelligence Detail Panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedGang ? (
              <motion.div
                key={selectedGang.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6"
              >
                {/* Gang Identification Title */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 gap-4">
                  
                  {/* Danger status and counts */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="bg-slate-950 text-slate-300 border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-2 font-mono text-sm">
                      <Users className="w-4 h-4 text-emerald-500" />
                      <span>قيد الملاحقة والربط التلقائي: </span>
                      <span className="text-red-500 font-bold text-base">{selectedGangMembers.length}</span>
                    </div>
                  </div>

                  {/* Name and titles */}
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <h3 className="text-2xl font-black text-white tracking-widest font-mono">{selectedGang.name}</h3>
                    </div>
                    <p className="text-sm text-red-500 font-medium mt-1">الاسم والكنية المسجلة: {selectedGang.arabicName}</p>
                  </div>
                </div>

                {/* Primary Data Sheet */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-1">
                    <div className="text-xs text-slate-500">القائد العملياتي المزعوم</div>
                    <div className="text-slate-200 font-bold flex items-center justify-end gap-1.5 py-1">
                      <span>{selectedGang.leader}</span>
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-1">
                    <div className="text-xs text-slate-500">المقر الإقليمي / مناطق السيطرة الجغرافية</div>
                    <div className="text-slate-200 font-bold flex items-center justify-end gap-1.5 py-1">
                      <span>{selectedGang.headquarters}</span>
                      <MapPin className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-1">
                    <div className="text-xs text-slate-500">سنة رصد النشاط الأولي</div>
                    <div className="text-slate-200 font-bold flex items-center justify-end gap-1.5 py-1">
                      <span className="font-mono">{selectedGang.establishedYear} م</span>
                      <Calendar className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-1">
                    <div className="text-xs text-slate-500">مجال التخصص الإجرامي الرئيسي</div>
                    <div className="text-slate-200 font-bold flex items-center justify-end gap-1.5 py-1">
                      <span>{selectedGang.specialization}</span>
                      <Target className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Narrative Overview Description */}
                <div className="bg-red-950/10 border border-red-900/20 rounded-xl p-4 text-slate-300 space-y-2">
                  <h4 className="text-xs font-bold text-red-400 flex items-center gap-1.5 justify-end">
                    <span>مذكرة التحليل الاستخباراتي للمنظمة</span>
                    <Info className="w-3.5 h-3.5" />
                  </h4>
                  <p className="text-xs leading-relaxed">{selectedGang.description}</p>
                </div>

                {/* Nesting candidates linked - THIS IS EXACTLY THE CORE REQUIREMENT REQUESTED BY THE USER */}
                {/* "عند وضع مطلوب اسم عصابته يتناسق مع اسم من العصابات في الصفحة الاخرى يتم وضعه تلقائيا" */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-slate-500 font-mono">AUTOMAPPED INTELLIGENCE MEMBERS</span>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>أعضاء العصابة النشطين المدرجين بالنظام</span>
                      <Users className="w-4 h-4 text-slate-400" />
                    </h4>
                  </div>

                  {selectedGangMembers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedGangMembers.map((person) => (
                        <div
                          key={person.id}
                          className="bg-slate-950 hover:bg-slate-900/60 border border-slate-850 rounded-xl p-3 flex flex-col justify-between transition-colors text-right relative group"
                        >
                          <div className="flex justify-between items-start gap-2">
                            {/* Status badge */}
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono leading-none ${
                              person.status === 'ACTIVE'
                                ? 'bg-red-500/20 text-red-400 border border-red-800/30'
                                : person.status === 'CAPTURED'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-800/30'
                                : 'bg-slate-500/20 text-slate-400 border border-slate-800/30'
                            }`}>
                              {person.status === 'ACTIVE' ? 'نشط ومطارد 🚨' : person.status === 'CAPTURED' ? 'محتجز 🔒' : 'مطلوب رصد 🔍'}
                            </span>

                            <div>
                              <div className="font-bold text-slate-100 text-sm hover:text-red-400 cursor-pointer" onClick={() => onSelectPerson(person)}>
                                {person.name}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">الملقب بـ: <span className="text-slate-300 font-medium">{person.alias}</span></div>
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-800/50 flex justify-between items-center text-[11px]">
                            <button
                              onClick={() => onSelectPerson(person)}
                              className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>الملف الكامل</span>
                            </button>

                            <span className="text-slate-400 truncate max-w-[170px]">
                              الجرم: {person.crimeType.slice(0, 30)}...
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-950 border border-dashed border-slate-850 rounded-xl text-slate-500 text-sm">
                      لا يوجد حالياً مطلوبين مضافين تطابق عقيدتهم الجرمية أو اسم عصابتهم مع <span className="text-red-500 font-mono font-bold">"{selectedGang.name}"</span>.
                      <br />
                      <span className="text-xs text-slate-600 mt-1 block">عند إضافة مطلوب جديد وإدخال اسم هذه العصابة، سيظهر هنا فوراً وتلقائياً.</span>
                    </div>
                  )}
                </div>

              </motion.div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
                <div className="w-16 h-16 bg-slate-950 rounded-full border border-slate-800 flex items-center justify-center mb-4 text-red-500 shadow-md">
                  <ShieldAlert className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">الرجاء اختيار عصابة من القائمة الجانبية</h3>
                <p className="text-sm text-slate-400 max-w-sm">
                  اختر أحد الفصائل الـ 10 لاستعراض التحليل الجغرافي والجنائي والاطلاع على الأعضاء المطلوبين المنتمين لها بشكل آلي.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
