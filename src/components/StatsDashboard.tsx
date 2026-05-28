/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WantedPerson, Gang } from '../types';
import { KNOWN_GANG_NAMES } from '../data';
import { Shield, ShieldAlert, Users, TrendingUp, CheckCircle, Award, Activity, Heart, Bell } from 'lucide-react';

interface StatsDashboardProps {
  people: WantedPerson[];
  gangs: Gang[];
  activityLogs: string[];
}

export default function StatsDashboard({ people, gangs, activityLogs }: StatsDashboardProps) {
  
  // Stats calculations
  const totalWanted = people.length;
  const activeCount = people.filter(p => p.status === 'ACTIVE').length;
  const capturedCount = people.filter(p => p.status === 'CAPTURED').length;
  const pendingCount = people.filter(p => p.status === 'WANTED').length;

  const criticalDangerCount = people.filter(p => p.riskLevel === 'CRITICAL').length;
  const highDangerCount = people.filter(p => p.riskLevel === 'HIGH').length;
  const mediumDangerCount = people.filter(p => p.riskLevel === 'MEDIUM').length;

  // Sizing of each gang for rankings
  const gangMembersMap = KNOWN_GANG_NAMES.map(gName => {
    const count = people.filter(p => p.gangName.trim().toLowerCase() === gName.trim().toLowerCase()).length;
    const gangDetail = gangs.find(g => g.name === gName);
    return {
      name: gName,
      arabicName: gangDetail?.arabicName || gName,
      count,
      dangerLevel: gangDetail?.dangerLevel || 'HIGH'
    };
  }).sort((a, b) => b.count - a.count);

  const captureRate = totalWanted > 0 ? Math.round((capturedCount / totalWanted) * 100) : 0;

  return (
    <div id="stats-dashboard" className="space-y-6 text-right font-sans">
      
      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Listed */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-28 relative overflow-hidden">
          <div className="absolute top-2 left-2 text-slate-800">
            <Users className="w-10 h-10" />
          </div>
          <div className="text-xs text-slate-400 font-bold">إجمالي المطالب والملفات المعرفة</div>
          <div className="text-3xl font-mono font-black text-white mt-2">{totalWanted}</div>
          <div className="text-[10px] text-slate-500 font-mono">AUTOMAPPED IN SYSTEM</div>
        </div>

        {/* Active Wanted */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-28 relative overflow-hidden">
          <div className="absolute top-2 left-2 text-red-950/40">
            <ShieldAlert className="w-10 h-10 text-red-500/25" />
          </div>
          <div className="text-xs text-red-400 font-bold">نشط تحت الملاحقة لفرق الاقتحام</div>
          <div className="text-3xl font-mono font-black text-red-500 mt-2">{activeCount}</div>
          <div className="text-[10px] text-red-600 animate-pulse">فوري التنفيذ والدورية النشطة</div>
        </div>

        {/* Captured */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-28 relative overflow-hidden">
          <div className="absolute top-2 left-2 text-emerald-950/40">
            <CheckCircle className="w-10 h-10 text-emerald-500/20" />
          </div>
          <div className="text-xs text-emerald-400 font-bold">تم إلقاء القبض والاحتراز الأمني</div>
          <div className="text-3xl font-mono font-black text-emerald-500 mt-2">{capturedCount}</div>
          <div className="text-[10px] text-emerald-500 font-bold">ملفات منجزة ومحمية</div>
        </div>

        {/* Capture Success Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-28 relative overflow-hidden">
          <div className="absolute top-2 left-2 text-blue-950/40">
            <TrendingUp className="w-10 h-10 text-blue-500/20" />
          </div>
          <div className="text-xs text-slate-400 font-bold">نسبة تطهير الخلايا وتقييد الخطر</div>
          <div className="text-3xl font-mono font-black text-emerald-400 mt-2">{captureRate}%</div>
          <div className="w-full bg-slate-950 h-1 rounded-full mt-1 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${captureRate}%` }} />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gang Sizing distribution and rankings */}
        {/* Directly answers "عند وضع مطلوب اسم عصابته يتناسق مع اسم من العصابات يتم وضعه تلقائيا" */}
        {/* This displays how many members belong to each gang */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <span className="text-[10px] text-slate-500 font-mono">AUTOMATED ALLOCATION SIZE INDICATOR</span>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>توزيع القوى العددية وحصص العصابات الـ 10</span>
              <Shield className="w-4 h-4 text-slate-400" />
            </h3>
          </div>

          <div className="space-y-3">
            {gangMembersMap.slice(0, 5).map((gang, index) => {
              const percentage = totalWanted > 0 ? (gang.count / totalWanted) * 100 : 0;
              return (
                <div key={gang.name} className="space-y-1.5 font-mono">
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span className="text-slate-400 text-[10px]">
                      {gang.count} مطلوبين ({Math.round(percentage)}%)
                    </span>
                    <span className="font-sans font-bold text-slate-200">
                      #{index + 1} عصابة {gang.name} <span className="text-slate-500">({gang.arabicName})</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        gang.dangerLevel === 'CRITICAL'
                          ? 'bg-red-600'
                          : gang.dangerLevel === 'HIGH'
                          ? 'bg-orange-500'
                          : 'bg-yellow-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-850">
            تتم تعبئة المخططات وتعديل حصة الفصائل الإجرامية تلقائياً ودون تدخل من فرقة السجلات عند مطابقة حقل "اسم العصابة" للمطلوب الجديد بالملف المعني.
          </div>
        </div>

        {/* Danger Metric Indicators */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white text-right">مستوى التهديد الأمني النشط</h3>
            </div>

            <div className="space-y-4 py-4">
              
              {/* Critical */}
              <div className="flex justify-between items-center">
                <div className="font-mono text-sm text-red-400 font-black">{criticalDangerCount} مطلوبين</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-300 font-bold">تهديد حرج جداً 🔴</span>
                </div>
              </div>

              {/* High */}
              <div className="flex justify-between items-center">
                <div className="font-mono text-sm text-orange-400 font-black">{highDangerCount} مطلوبين</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-300 font-bold">تهديد مرتفع جداً 🟠</span>
                </div>
              </div>

              {/* Medium */}
              <div className="flex justify-between items-center">
                <div className="font-mono text-sm text-yellow-400 font-black">{mediumDangerCount} مطلوبين</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-300 font-bold">تحت المتابعة الدورية 🟡</span>
                </div>
              </div>

            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 text-right text-[11px] text-slate-400 space-y-1">
            <span className="text-slate-500 font-bold block">مؤشر الجنايات العام للقطاع:</span>
            <span className="text-xs font-bold text-red-500 font-mono tracking-widest block">SEC-LEVEL: CRITICAL_STATUS_RED</span>
          </div>
        </div>

      </div>

      {/* Activity logs & operations audit trail */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-end gap-2 border-b border-slate-800 pb-2.5">
          <span>سجل العمليات والتدقيق الأمني الفوري</span>
          <Activity className="w-4 h-4 text-emerald-500" />
        </h3>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {activityLogs.map((log, idx) => (
            <div
              key={idx}
              className="p-2.5 bg-slate-950 border border-slate-900 rounded-lg text-xs flex justify-between items-center gap-4 text-right"
            >
              <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                {new Date().toISOString().split('T')[0]} // SEC-LOG
              </span>
              <span className="text-slate-300 font-semibold">{log}</span>
            </div>
          ))}
          {activityLogs.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-600">
              لم تصل إشارات أو إشعارات عملياتية جديدة حتى اللحظة.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
