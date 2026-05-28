/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM';

export interface WantedPerson {
  id: string;
  name: string;
  alias: string; // اللقب / الاسم الحركي
  age: number;
  nationality: string;
  gangName: string; // اسم العصابة
  riskLevel: RiskLevel; // مستوى الخطورة
  crimeType: string; // نوع الجريمة والنشاط الإجرامي
  lastSeen: string; // آخر موقع تم رصده فيه
  status: 'ACTIVE' | 'CAPTURED' | 'WANTED'; // الحالة الأمنية
  gender: 'MALE' | 'FEMALE';
  notes: string;
  addedAt: string;
  nationalId?: string; // الرقم الوطني
}

export interface Gang {
  name: string;
  arabicName: string;
  description: string;
  dangerLevel: RiskLevel;
  leader: string; // القائد الحالي المزعوم
  headquarters: string; // منطقة النفوذ الرئيسية أو المقر
  establishedYear: string; // سنة التأسيس المرصودة
  specialization: string; // التخصص الإجرامي الرئيسي
}
