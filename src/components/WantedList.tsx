/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WantedPerson, RiskLevel } from '../types';
import { KNOWN_GANG_NAMES } from '../data';
import { Search, ShieldAlert, FileText, User, MapPin, Eye, Filter, Calendar, Award, CheckCircle, Trash2 } from 'lucide-react';

interface WantedListProps {
  people: WantedPerson[];
  onUpdateStatus: (id: string, newStatus: 'ACTIVE' | 'CAPTURED' | 'WANTED') => void;
  onDeletePerson?: (id: string) => void;
  selectedPersonFromExternal: WantedPerson | null;
  onClearExternalSelection: () => void;
}

export default function WantedList({
  people,
  onUpdateStatus,
  onDeletePerson,
  selectedPersonFromExternal,
  onClearExternalSelection
}: WantedListProps) {
  
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [gangFilter, setGangFilter] = useState<string>('ALL');
  
  // Selected single dossier
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  // If a selection came from the Gangs page, activate the dossier modal
  React.useEffect(() => {
    if (selectedPersonFromExternal) {
      setSelectedPersonId(selectedPersonFromExternal.id);
    }
  }, [selectedPersonFromExternal]);

  const handleCloseDossier = () => {
    setSelectedPersonId(null);
    onClearExternalSelection();
  };

  // Filter computation
  const filteredPeople = people.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.crimeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.gangName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.nationalId && p.nationalId.includes(searchTerm));

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesRisk = riskFilter === 'ALL' || p.riskLevel === riskFilter;
    const matchesGang = gangFilter === 'ALL' || 
      (gangFilter === 'INDEPENDENT' && !KNOWN_GANG_NAMES.some(g => g.toLowerCase() === p.gangName.toLowerCase())) ||
      (gangFilter !== 'INDEPENDENT' && p.gangName.toLowerCase() === gangFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesRisk && matchesGang;
  });

  const activeDossier = people.find(p => p.id === selectedPersonId);

  return (
    <div id="wanted-section" className="space-y-6 text-right font-sans">
      
      {/* Filters Hub */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 space-y-4">
        
        {/* Quick Search Core Input */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="البحث بالاسم، اللقب الشائع، اسم العصابة، أو تفاصيل الجريمة..."
            className="w-full bg-slate-950 text-slate-100 border border-slate-800 rounded-xl py-3.5 pl-12 pr-11 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-bold"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
            <Search className="w-5 h-5" />
          </div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-mono hidden sm:block">
            {filteredPeople.length} مطابقة مرصودة
          </div>
        </div>

        {/* Detailed Filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="space-y-1">
            <label className="text-right block text-xs text-slate-500 font-bold">الحالة الميدانية</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 text-slate-300 font-medium text-xs border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-red-600"
            >
              <option value="ALL">الكل (نشط ومطهر)</option>
              <option value="ACTIVE">نشط ومطلوب ملاحقته 🚨</option>
              <option value="CAPTURED">تم إلقاء القبض عليه ومحجوز 🔒</option>
              <option value="WANTED">مطلوب للتحقيق الفوري 🔍</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-right block text-xs text-slate-500 font-bold">تقييم الخطورة والتهديد</label>
            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
              className="w-full bg-slate-950 text-slate-300 font-medium text-xs border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-red-600"
            >
              <option value="ALL">جميع مستويات الخطورة</option>
              <option value="CRITICAL">خطورة حرجة جداً (أحمر) 🔴</option>
              <option value="HIGH">خطورة مرتفعة (برتقالي) 🟠</option>
              <option value="MEDIUM">خطورة متوسطة / رصد (أصفر) 🟡</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-right block text-xs text-slate-500 font-bold">تصنيف الارتباط بالفئة</label>
            <select
              value={gangFilter}
              onChange={e => setGangFilter(e.target.value)}
              className="w-full bg-slate-950 text-slate-300 font-medium text-xs border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-red-600"
            >
              <option value="ALL">جميع الفئات والعصابات</option>
              {KNOWN_GANG_NAMES.map(gName => (
                <option key={gName} value={gName}>عصابة {gName}</option>
              ))}
              <option value="INDEPENDENT">مسلحون مستقلون / خارج التنظيمات</option>
            </select>
          </div>

        </div>

      </div>

      {/* Grid Wanted Listing */}
      {filteredPeople.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPeople.map((person) => {
            
            const isCritical = person.riskLevel === 'CRITICAL';
            const isHigh = person.riskLevel === 'HIGH';
            const isCaptured = person.status === 'CAPTURED';

            return (
              <div
                key={person.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between hover:border-slate-750 transition-all shadow-md active:scale-[0.99]"
              >
                
                {/* Danger Level Border indicator */}
                <span className={`absolute top-0 right-0 left-0 h-[3px] ${
                  isCritical ? 'bg-red-600' : isHigh ? 'bg-orange-500' : 'bg-yellow-400'
                }`} />

                <div className="space-y-3">
                  {/* Card Header Badge info */}
                  <div className="flex justify-between items-center text-xs">
                    
                    {/* Security status */}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isCaptured
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/40'
                        : isCritical
                        ? 'bg-red-950/60 text-red-400 border border-red-900/40 animate-pulse'
                        : 'bg-orange-950/60 text-orange-400 border border-orange-900/40'
                    }`}>
                      {isCaptured ? 'موقوف ومحجوز 🔒' : 'نشط هارب 🚨'}
                    </span>

                    {/* Reg ID */}
                    <span className="text-slate-500 font-mono tracking-wider font-semibold">
                      {person.id}
                    </span>

                  </div>

                  {/* Identity Box */}
                  <div>
                    <h3 className="text-lg font-black text-slate-100 hover:text-red-400 cursor-pointer block truncate" onClick={() => setSelectedPersonId(person.id)}>
                      {person.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      اللقب: <strong className="text-slate-200 mt-0.5">{person.alias}</strong>
                    </p>
                  </div>

                  {/* Quick info specs */}
                  <div className="bg-slate-950 rounded-xl p-3 space-y-2 text-xs border border-slate-900">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-slate-300 font-bold">{person.gangName}</span>
                      <span className="text-slate-500">الفصيل المستبب:</span>
                    </div>
                    <div className="flex justify-between items-center pt-1.5 border-t border-slate-900/80">
                      <span className="text-slate-300">{person.nationality}</span>
                      <span className="text-slate-500">الجنسية:</span>
                    </div>
                    <div className="flex justify-between items-center pt-1.5 border-t border-slate-900/80">
                      <span className="text-slate-300 truncate max-w-[150px]">{person.lastSeen}</span>
                      <span className="text-slate-500">آخر موقع مرصود:</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    <strong className="text-slate-300 font-medium">التهمة:</strong> {person.crimeType}
                  </p>

                </div>

                {/* Card Button triggers */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  {onDeletePerson && (
                    <button
                      onClick={() => onDeletePerson(person.id)}
                      title="شطب البطاقة نهائياً"
                      className="text-slate-500 hover:text-red-500 cursor-pointer p-1.5 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedPersonId(person.id)}
                    className="bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-red-400 border border-slate-800 hover:border-slate-705 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>الملف الاستخباراتي</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-4">
          <div className="w-12 h-12 bg-slate-950 rounded-full flex items-center justify-center text-red-500 font-mono text-xl font-bold mx-auto border border-slate-850">
            !
          </div>
          <div>
            <h3 className="text-base font-bold text-white">لم يتم العثور على مطلوبين تتلاءم مع فلاتر البحث</h3>
            <p className="text-xs text-slate-500 mt-1">تأكد من صياغة الاسم بالطريقة الصحيحة أو جرب البحث عن كلمات حرة أخرى.</p>
          </div>
        </div>
      )}

      {/* CLASSIFIED DOSSIER MODAL DIALOG */}
      {/* Renders when activeDossier is chosen */}
      {activeDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-6 relative text-right font-sans my-8">
            
            {/* Header stamps */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs bg-red-950/85 text-red-400 border border-red-900/40 px-3 py-1 rounded font-bold">
                  سري للغاية وبحيازة مقيدة
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-bold">
                  {activeDossier.id}
                </span>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-black text-white">الملف الأمني المصنف والتحليلي</h3>
                <p className="text-[11px] text-slate-400">قطاع المخابرات العامة - دائرة مكافحة الإرهاب والمنظمات</p>
              </div>
            </div>

            {/* Core dossier identity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Photo placeholder / security symbol */}
              <div className="md:col-span-1 border border-slate-800 bg-slate-950 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group">
                {/* Fingerprint decoration */}
                <div className="w-24 h-24 rounded-full border border-dashed border-red-900/60 flex items-center justify-center mb-3 relative">
                  <User className="w-12 h-12 text-red-500/85" />
                  <div className="absolute inset-0 bg-red-600/5 rounded-full animate-pulse" />
                </div>
                
                <span className="text-[10px] font-mono text-red-500 font-bold border border-red-950/60 rounded px-1.5 py-0.5 bg-red-950/30">
                  {activeDossier.status === 'ACTIVE' ? 'نشط وهارب' : activeDossier.status === 'CAPTURED' ? 'محتجز مؤيد' : 'أمر مراقبة'}
                </span>

                <div className="mt-4 text-center space-y-1">
                  <div className="text-xs text-slate-400">تاريخ الربط الرقمي:</div>
                  <div className="text-[11px] font-mono text-slate-300 font-medium">{activeDossier.addedAt}</div>
                </div>
              </div>

              {/* Identity listing */}
              <div className="md:col-span-2 space-y-3">
                
                <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-850">
                  <span className="text-[10px] text-slate-500 block">الاسم المعتمد في السجلات الجنائية:</span>
                  <span className="text-base font-bold text-white">{activeDossier.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-[10px] text-slate-500 block">الكنية والاسم التجاري الحركي:</span>
                    <span className="text-sm font-bold text-red-400">{activeDossier.alias}</span>
                  </div>
                  <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-[10px] text-slate-500 block">العرق والجنسية:</span>
                    <span className="text-sm font-bold text-slate-200">{activeDossier.nationality}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-[10px] text-slate-500 block">العمر المعتمد:</span>
                    <span className="text-sm font-bold text-slate-200">{activeDossier.gender === 'MALE' ? 'ذكر' : 'أنثى'} / {activeDossier.age} عاماً</span>
                  </div>
                  <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-[10px] text-slate-500 block">الرقم الوطني الموحد:</span>
                    <span className="text-xs font-mono font-bold text-slate-300 tracking-wider">
                      {activeDossier.nationalId || 'مجهول أو غير موثق'}
                    </span>
                  </div>
                </div>

                {/* Automation Mapping Badge */}
                <div className="bg-red-950/20 p-3 rounded-lg border border-red-900/30 flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-900/40">
                    {activeDossier.gangName}
                  </span>
                  <span className="text-xs text-slate-300">الانتساب للمنظمات الإجرامية الـ 10:</span>
                </div>

              </div>

            </div>

            {/* Crime types & details */}
            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1">
                <span className="text-[11px] text-slate-500 font-bold block">مذكرة التهم الرئيسية والملاحقة القضائية:</span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">{activeDossier.crimeType}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1">
                <span className="text-[11px] text-slate-500 font-bold block">موقع رصد الإشهار ومحل الملاذ الأخير:</span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">{activeDossier.lastSeen}</p>
              </div>

              {activeDossier.notes && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1">
                  <span className="text-[11px] text-slate-500 font-bold block">الملاحظات التكتيكية لفرق الاقتحام والمداهمة والتمويه:</span>
                  <p className="text-xs text-slate-400 leading-relaxed">{activeDossier.notes}</p>
                </div>
              )}
            </div>

            {/* Controls inside Dossier */}
            <div className="pt-4 border-t border-slate-850 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              
              {/* Change status actions */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 ml-1">تعديل الإشهار:</span>
                <button
                  onClick={() => onUpdateStatus(activeDossier.id, 'ACTIVE')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    activeDossier.status === 'ACTIVE'
                      ? 'bg-red-950 text-red-400 border-red-700'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  صياغة نشط هارب 🚨
                </button>
                <button
                  onClick={() => onUpdateStatus(activeDossier.id, 'CAPTURED')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    activeDossier.status === 'CAPTURED'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  تأكيد إلقاء القبض 🔒
                </button>
              </div>

              {/* Close buttons */}
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => {
                    const printContent = `
                      ====================================
                      ملف استخباراتي رسمي - سري للغاية
                      بوابة المخابرات العامة - رصد المطلوبين
                      ====================================
                      المعرف الرقمي: ${activeDossier.id}
                      الاسم الكامل: ${activeDossier.name}
                      اللقب: ${activeDossier.alias}
                      الجنسية: ${activeDossier.nationality}
                      الانتساب للعصابة: ${activeDossier.gangName}
                      العمر والجنس: ${activeDossier.age} / ${activeDossier.gender}
                      الخطورة: ${activeDossier.riskLevel}
                      تفاصيل الجريمة: ${activeDossier.crimeType}
                      آخر موقع رصد فيه: ${activeDossier.lastSeen}
                      ملاحظات: ${activeDossier.notes || 'لا يوجد'}
                      الحالة: ${activeDossier.status}
                      ------------------------------------
                      طباعة النظام المركزي: ${new Date().toLocaleString('ar-AE')}
                    `;
                    
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`<pre style="font-family: monospace; padding: 20px; background: #0f172a; color: #10b981; direction: rtl;">${printContent}</pre>`);
                      printWindow.document.title = `ملف_{activeDossier.name}`;
                      printWindow.document.close();
                    } else {
                      alert('برجاء السماح بالنوافذ المنبثقة للطباعة أو نسخ النص أمنياً!');
                    }
                  }}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition-all"
                >
                  طباعة وإشهار الملف
                </button>

                <button
                  onClick={handleCloseDossier}
                  className="bg-red-600 hover:bg-red-500 font-bold text-white px-4 py-2 rounded-lg text-xs cursor-pointer transition-all"
                >
                  إغلاق الملف
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
