import React, { useState, useEffect } from 'react';
import { tipsService } from '../services/safetyService';
import { SafetyTip, SafetyTipCategory } from '../types';
import {
  BookOpen,
  Search,
  Languages,
  Clock,
  Shield,
  Compass,
  Bus,
  School,
  Lock,
  LifeBuoy,
  ChevronRight,
} from 'lucide-react';

const CATEGORIES: ('All' | SafetyTipCategory)[] = [
  'All',
  'Travel Safety',
  'University & Hostel',
  'Public Transport',
  'Online Safety',
  'Emergency Preparedness',
  'First Response',
];

export const SafetyTipsPage: React.FC = () => {
  const [tips, setTips] = useState<SafetyTip[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showUrdu, setShowUrdu] = useState<boolean>(true);

  useEffect(() => {
    const loadTips = async () => {
      const data = await tipsService.getPublishedTips(selectedCategory, searchQuery);
      setTips(data);
    };
    loadTips();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[#0F766E] text-xs font-bold mb-3 border border-teal-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Essential Knowledge Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#173B6C] tracking-tight">
            Safety Guidance & Protocols
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Practical, respectful, and actionable safety measures for students, working women, and travelers.
          </p>
          <p className="text-sm text-teal-800 font-urdu mt-1">
            خواتین اور طالبات کے لیے روزمرہ سفر اور ایمرجنسی میں حفاظت کے بنیادی اصول
          </p>
        </div>

        {/* Search & Bilingual Language Toggle */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search safety topics, travel tips, keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>

            {/* Urdu Toggle Button */}
            <button
              onClick={() => setShowUrdu(!showUrdu)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition shrink-0 min-h-[44px] ${
                showUrdu
                  ? 'bg-teal-50 border-teal-300 text-[#0F766E]'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Languages className="w-4 h-4" />
              <span>{showUrdu ? 'Urdu Shown (اردو فعال)' : 'Show Urdu (اردو دیکھیں)'}</span>
            </button>
          </div>

          {/* Category Tabs (Functional interactive tabs) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-3 border-t border-slate-100 scrollbar-none pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#173B6C] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tips Feed */}
        {tips.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-sm font-bold text-slate-700">No safety tips found for this criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing your search keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-bold text-[#0F766E] uppercase tracking-wider text-[11px]">
                      {tip.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{tip.read_time_minutes} min read</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {tip.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tip.content}
                  </p>

                  {/* Urdu Translation Card */}
                  {showUrdu && tip.urdu_title && (
                    <div className="mt-4 pt-4 border-t border-slate-100 bg-[#F4F1FF]/50 p-3.5 rounded-2xl">
                      <h4 className="text-sm font-bold text-[#173B6C] font-urdu text-right mb-1">
                        {tip.urdu_title}
                      </h4>
                      <p className="text-xs text-slate-700 font-urdu text-right leading-relaxed">
                        {tip.urdu_content}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Aman Safar Verification Standard</span>
                  <span className="text-[#0F766E] font-semibold">Verified Safety Guideline</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
