/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, Eye, EyeOff, AlertTriangle, Key } from 'lucide-react';

interface PasscodeLockProps {
  onUnlock: () => void;
}

export default function PasscodeLock({ onUnlock }: PasscodeLockProps) {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleNumberClick = (num: string) => {
    if (passcode.length < 4) {
      setError(false);
      setPasscode(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setError(false);
    setPasscode(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setError(false);
    setPasscode('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passcode === '2432') {
      onUnlock();
    } else {
      setError(true);
      setAttempts(prev => prev + 1);
      setPasscode('');
      // Vibrate if supported by browser
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(200);
      }
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumberClick(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handleSubmit();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [passcode]);

  return (
    <div id="passcode-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* Decorative Grid Network Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      {/* Glowing scanning line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600/30 shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-bounce pointer-events-none" />

      {/* Main Lock Module */}
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md relative z-10 text-right font-sans">
        
        {/* Header Indicator */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-2 space-x-reverse text-red-500">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span className="text-[10px] font-mono tracking-wider">سري للغاية // CLASSIFIED</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-mono font-bold">G.I.D SECURE NETWORK</span>
          </div>
        </div>

        {/* Emblem Illustration */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-b from-slate-800 to-slate-950 rounded-full border border-slate-700/80 flex items-center justify-center mb-3 shadow-inner shadow-black relative group">
            <Lock className="w-7 h-7 text-red-500 animate-pulse" />
            <div className="absolute -inset-1.5 bg-red-600/10 rounded-full blur pointer-events-none" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">المخابرات العامة</h1>
          <p className="text-xs text-slate-400">منظومة رصد وتتبع المطلوبين والمنظمات الخارجة عن القانون</p>
        </div>

        {/* Input & Instructions */}
        <div className="mb-6">
          <label className="block text-right text-xs font-medium text-slate-400 mb-2">رقم الفتح الآمن لضابط الارتباط:</label>
          <form onSubmit={handleSubmit} className="relative">
            <input
              type={showPasscode ? 'text' : 'password'}
              readOnly
              value={passcode}
              placeholder="••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-12 text-center text-xl tracking-widest font-mono text-emerald-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-semibold"
            />
            <button
              type="button"
              onClick={() => setShowPasscode(!showPasscode)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
            >
              {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              <Key className="w-5 h-5 text-slate-600" />
            </div>
          </form>

          {/* Indicator Light Dots */}
          <div className="flex justify-center space-x-2 space-x-reverse mt-3">
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className={`w-3 h-3 rounded-full border border-slate-800 transition-all duration-200 ${
                  passcode.length > i ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-950'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Feedback Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mb-4 p-2.5 bg-red-950/40 border border-red-900/50 rounded-lg flex items-center justify-between text-right text-xs"
            >
              <span className="text-red-400 font-medium">رمز الدخول خاطئ، يرجى المحاولة مجدداً</span>
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mr-1" />
            </motion.div>
          )}
          {!error && attempts > 0 && (
            <div className="mb-4 text-slate-400 text-center text-[11px] font-mono leading-none">
              محاولات فاشلة: <span className="text-red-500 font-bold">{attempts}</span>
            </div>
          )}
        </AnimatePresence>

        {/* Virtual Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => handleNumberClick(num)}
              className="bg-slate-950 hover:bg-slate-800/80 text-white font-mono text-lg font-bold py-2.5 rounded-lg border border-slate-800 hover:border-slate-700 active:scale-95 transition-all outline-none"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg border border-transparent transition-all outline-none"
          >
            مسح
          </button>
          <button
            type="button"
            onClick={() => handleNumberClick('0')}
            className="bg-slate-950 hover:bg-slate-800/80 text-white font-mono text-lg font-bold py-2.5 rounded-lg border border-slate-800 hover:border-slate-700 active:scale-95 transition-all outline-none"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg border border-transparent transition-all outline-none"
          >
            مسح خطوة
          </button>
        </div>

        {/* Entry Trigger Button */}
        <button
          onClick={() => handleSubmit()}
          disabled={passcode.length === 0}
          className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm tracking-wider transition-all shadow-md ${
            passcode.length > 0
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black shadow-emerald-950/50 cursor-pointer active:scale-[0.98]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>تخويل الدعم الأمني والولوج</span>
          <Shield className="w-4 h-4" />
        </button>

        {/* Footer info lock hint */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[10px] text-slate-500">
          هذا النظام خاضع للمراقبة الفيدرالية والمحلية الصارمة. يسجل بروتوكول الإنترنت لكل طلب.
          <br />
          <span className="font-mono mt-1 block">USER IP: 10.240.32.25 // PORT: 3000</span>
        </div>

      </div>
    </div>
  );
}
