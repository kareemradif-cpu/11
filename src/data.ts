/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Gang, WantedPerson } from './types';

export const KNOWN_GANG_NAMES = [
  'Black Market',
  'Blacklist',
  'The Shadow',
  'Old School',
  'No Mercy',
  'La Casa',
  'Mafia',
  'Black Dragon',
  'Bloodlist',
  'Blackside'
];

export const OFFICIAL_GANGS: Gang[] = [
  {
    name: 'Black Market',
    arabicName: 'السوق السوداء',
    description: 'تحالف دولي لإدارة صفقات سلاح غير مشروعة، وتهريب تكنولوجيا محظورة عبر الحدود البحرية والموانئ.',
    dangerLevel: 'CRITICAL',
    leader: 'ثابت الساهر (الملقب بـ التاجر)',
    headquarters: 'المنطقة الحرة والحدود البحرية الشرقية',
    establishedYear: '2011',
    specialization: 'تهريب الأسلحة المتقدمة وغسيل الأموال العابر للحدود'
  },
  {
    name: 'Blacklist',
    arabicName: 'القائمة السوداء',
    description: 'منظمة اغتيالات وابتزاز عالي المستوى يستهدف الشخصيات العامة والشركات لابتزاز أسرار حساسة.',
    dangerLevel: 'CRITICAL',
    leader: 'شاهين الجارحي (الملقب بـ الصقر)',
    headquarters: 'الأنفاق الشمالية السرية والمنطقة المهجورة',
    establishedYear: '2016',
    specialization: 'الابتزاز الإلكتروني، الاغتيالات الممنهجة، وسرقة الهويات'
  },
  {
    name: 'The Shadow',
    arabicName: 'منظمة الظل',
    description: 'شبكة تجسس إلكتروني واختراق للمعلومات الحكومية والخاصة فائقة السرية تعمل بالخفاء المطلق.',
    dangerLevel: 'CRITICAL',
    leader: 'كارلوس هيريرا (الاسم الرمزي: شادو-1)',
    headquarters: 'خوادم لا مركزية ونقاط اتصال مخفية',
    establishedYear: '2018',
    specialization: 'الهجمات السيبرانية والتجسس الرقمي وتخريب البنية التحتية'
  },
  {
    name: 'Old School',
    arabicName: 'المدرسة القديمة',
    description: 'عصابات كلاسيكية عريقة تعمل في السطو المسلح على البنوك ومركبات الأموال وتجارة التحف المزيفة.',
    dangerLevel: 'HIGH',
    leader: 'الجنرال سليم الحديدي',
    headquarters: 'البلدة القديمة وجنوب المحافظة الوسطى',
    establishedYear: '1998',
    specialization: 'السطو الممنهج على المنشآت المالية والتهريب الكلاسيكي'
  },
  {
    name: 'No Mercy',
    arabicName: 'بلا رحمة',
    description: 'مجموعة مسلحة عنيفة تشتهر بفرض الإتاوات على خطوط التجارة البرية وتنفيذ أعمال تخريبية واسعة.',
    dangerLevel: 'CRITICAL',
    leader: 'عمران الجلاد (الملقب بـ الكاسر)',
    headquarters: 'الجبال الوعرة والطرق الصحراوية السريعة',
    establishedYear: '2014',
    specialization: 'قطع الطرق، خطف الرهائن والمطالبة بالفديات، والتخريب المسلح'
  },
  {
    name: 'La Casa',
    arabicName: 'لا كاسا',
    description: 'عصابة متخصصة في تزييف العملات الصعبة والذهب والمعادن الثمينة بنسب تطابق تامة للعيارات الرسمية.',
    dangerLevel: 'HIGH',
    leader: 'ألبرتو فاسكيز (البروفيسور)',
    headquarters: 'المطبعة والمخابئ السرية في الضاحية الغربية',
    establishedYear: '2017',
    specialization: 'تزوير العملات والسندات البنكية واختراق الأنظمة المالية المنفصلة'
  },
  {
    name: 'Mafia',
    arabicName: 'المافيا المنظمة',
    description: 'كارتل جرمي عائلي ضخم يسيطر على الأنشطة غير القانونية داخل المدن الكبرى كالقمار وتصدير المحظورات.',
    dangerLevel: 'HIGH',
    leader: 'دوناتو كابوني (العراب)',
    headquarters: 'حي المال والأعمال ونوادي النخبة الخاصة',
    establishedYear: '1985',
    specialization: 'الاحتيال المالي، الاحتكارات الإجرامية المسلحة، وفرض الحماية القسرية'
  },
  {
    name: 'Black Dragon',
    arabicName: 'التنين الأسود',
    description: 'عصابات منظمة تمتد جذورها دولياً، متخصصة في التهريب الفاخر وتزييف وتوزيع المستحضرات الكيميائية المحظورة.',
    dangerLevel: 'HIGH',
    leader: 'وو شينغ (الملقب بـ الإمبراطور)',
    headquarters: 'المناطق الصناعية والأنفاق الشرقية من الميناء',
    establishedYear: '2005',
    specialization: 'توزيع المحظورات الكيميائية والتهريب الصناعي وغسيل الأموال بالتجارة مرابحة'
  },
  {
    name: 'Bloodlist',
    arabicName: 'قائمة الدماء',
    description: 'جماعة متطرفة من المسلحين المتعصبين لتصفية الحسابات الإجرامية وتجارة الأعضاء البشرية والتهريب عبر القارات.',
    dangerLevel: 'CRITICAL',
    leader: 'الدكتور مروان القاضي',
    headquarters: 'المعامل والعيادات السرية الحدودية المشبوهة',
    establishedYear: '2012',
    specialization: 'الاتجار بالبشر وتصفية الخارجين عن القانون الدولي'
  },
  {
    name: 'Blackside',
    arabicName: 'الجانب الأسود',
    description: 'منظمة مظلّية تنشط في الجرائم الاقتصادية الكبرى، تدمير الشركات، التهرب الجمركي الكارثي، والسيطرة على شركات الطاقة.',
    dangerLevel: 'MEDIUM',
    leader: 'وليد الألفي (رجل الأعمال الأوراسي)',
    headquarters: 'أبراج المال العالمية والشركات الوهمية الخارجية',
    establishedYear: '2020',
    specialization: 'التهرب الضريبي الهائل، الرشاوى السيادية وتدمير الأسهم المفتوحة'
  }
];

export const INITIAL_WANTED_PEOPLE: WantedPerson[] = [];
