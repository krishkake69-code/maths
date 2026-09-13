import React, { useState, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COURSES } from '../data';
import { Course } from '../types';
import { Clock, CheckCircle2, Bookmark, Flame, Sparkles, BookOpen, UserCheck, X, Check, ArrowRight, Zap, Target, Phone, Calendar, MessageSquare, MapPin } from 'lucide-react';
import Button3D from './Button3D';
import Card3D from './Card3D';
import { getAcademicSessionInfo } from '../utils/academicSession';

interface CoursesProps {
  courses?: Course[];
}

export default function Courses({ courses }: CoursesProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'JEE' | 'Boards' | 'Foundation'>('All');
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<Course | null>(null);
  const [enrollFormSubmitted, setEnrollFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', grade: '12th Class', mode: 'Offline' });

  const sessionInfo = useMemo(() => getAcademicSessionInfo(), []);

  const rawCourses = courses || COURSES;
  const coursesToDisplay = useMemo(() => {
    return rawCourses.map(course => ({
      ...course,
      duration: course.duration?.includes('Session') ? `Session ${sessionInfo.currentSession}` : course.duration,
      session: course.session || sessionInfo.currentSession
    }));
  }, [rawCourses, sessionInfo]);

  // Filter courses based on tab
  const filteredCourses = activeTab === 'All' 
    ? coursesToDisplay 
    : coursesToDisplay.filter(course => course.category === activeTab);

  const handleEnrollClick = (course: Course) => {
    setSelectedCourseForEnroll(course);
    setEnrollFormSubmitted(false);
    setSubmitError(null);
  };

  const handleEnrollSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !selectedCourseForEnroll) return;
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          course: selectedCourseForEnroll.name,
          message: `Class Preference: ${formData.grade} | Mode of Class: ${formData.mode}`,
          type: 'enroll'
        })
      });

      if (res.ok) {
        setEnrollFormSubmitted(true);
      } else {
        const errData = await res.json();
        setSubmitError(errData.error || 'Failed to register your booking. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedCourseForEnroll(null);
    setFormData({ name: '', phone: '', grade: '12th Class', mode: 'Offline' });
    setSubmitError(null);
  };

  return (
    <section
      id="courses"
      className="py-20 md:py-28 bg-slate-50/70 dark:bg-[#07090e] math-grid transition-colors duration-300 relative border-t border-slate-200/50 dark:border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
            // SESSION {sessionInfo.currentSession} BATCHES
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight mt-1">
            Official Batches & Class Timings
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Structured batches for Class 9th, 10th, 11th, 12th & IIT-JEE with Rehman Sir for Session {sessionInfo.currentSession}. Reserve seats early for optimal student-teacher interaction.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Highlighted Official Schedule Matrix from Pamphlet */}
        <div className="mb-14 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-indigo-500/20">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>BATCH FOR SESSION {sessionInfo.currentSession}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  REHMAN CLASSES • GHAZIABAD
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>D-48 Mahendra Enclave (Near Silver Shine School) Ghaziabad</span>
                </p>
              </div>

              {/* Direct Call & WhatsApp CTA for Rehman Sir */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="tel:9911667462"
                  className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 fill-slate-950" />
                  <span>Call: 9911667462</span>
                </a>
                <a
                  href={`https://wa.me/919911667462?text=${encodeURIComponent(`Hello Rehman Sir, I want to inquire about the Session ${sessionInfo.currentSession} Batches (Class IX-XII / IIT-JEE).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Rehman Sir</span>
                </a>
              </div>
            </div>

            {/* 4 Official Batch Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              {/* Class IX */}
              <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4.5 hover:border-amber-400/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-mono font-bold">
                      Class IX
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Maths & Science</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white">Class IX Batch</h4>
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Batch Timing</p>
                    <p className="text-sm font-black text-amber-300 mt-0.5">4.00 PM TO 5.00 PM</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3">Subjects: Mathematics & Science</p>
              </div>

              {/* Class X */}
              <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4.5 hover:border-amber-400/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-orange-500/20 text-orange-300 text-[11px] font-mono font-bold">
                      Class X
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Maths & Science</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white">Class X Batch</h4>
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Batch Timing</p>
                    <p className="text-sm font-black text-orange-300 mt-0.5">5.00 PM TO 6.00 PM</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3">Subjects: Mathematics & Science</p>
              </div>

              {/* Class XI */}
              <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4.5 hover:border-indigo-400/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[11px] font-mono font-bold">
                      Class XI
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Mon, Tue & Wed</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white">Class XI Batch</h4>
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Batch Timing</p>
                    <p className="text-sm font-black text-indigo-300 mt-0.5">7.00 PM TO 8.30 PM</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3">Days: MON, TUE & WED • Maths</p>
              </div>

              {/* Class XII */}
              <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4.5 hover:border-emerald-400/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold">
                      Class XII
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Thu, Fri & Sat</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white">Class XII Batch</h4>
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Batch Timing</p>
                    <p className="text-sm font-black text-emerald-300 mt-0.5">7.00 PM TO 8.30 PM</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3">Days: THU, FRI & SAT • Maths</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Tab Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-lg mx-auto bg-white dark:bg-slate-900/80 p-1.5 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
          {[
            { id: 'All', label: 'All Batches' },
            { id: 'Boards', label: 'CBSE / ISC / Boards' },
            { id: 'JEE', label: 'JEE Mains & Adv' },
            { id: 'Foundation', label: 'Class 9-10th' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => {
              const isJEE = course.category === 'JEE';
              const isBoards = course.category === 'Boards';

              return (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <Card3D intensity={5} className="h-full">
                    <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-indigo-400/50 p-6 sm:p-7 flex flex-col justify-between transition-all group relative overflow-hidden backdrop-blur-sm h-full">
                      {/* Subtle top indicator bar */}
                      <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                        isJEE ? 'bg-gradient-to-r from-indigo-600 to-violet-600' :
                        isBoards ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                        'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`} />

                      <div>
                        {/* Top Tag & Indicator */}
                        <div className="flex items-center justify-between mb-3 pt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                            isJEE ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60' :
                            isBoards ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60' :
                            'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                          }`}>
                            {course.tag}
                          </span>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            <span>{course.duration}</span>
                          </div>
                        </div>

                        {/* Timing badge if available */}
                        {course.timing && (
                          <div className="mb-3 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                              ⏰ {course.timing}
                            </span>
                            {course.days && (
                              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                {course.days}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Course Title */}
                        <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2.5">
                          {course.name}
                        </h3>

                        {/* Course Description */}
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                          {course.description}
                        </p>

                        {/* Feature Bullets */}
                        <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800/80 pt-5 mb-7">
                          {course.features.map((feat, index) => (
                            <div key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                              <span className="leading-snug">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tactile 3D Enroll CTA Button */}
                      <Button3D
                        variant={isJEE ? 'primary' : isBoards ? 'amber' : 'emerald'}
                        size="md"
                        onClick={() => handleEnrollClick(course)}
                        className="w-full"
                      >
                        <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                        <span>Book 3-Day Demo Free</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button3D>
                    </div>
                  </Card3D>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Quick Registration Modal */}
        <AnimatePresence>
          {selectedCourseForEnroll && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
              />

              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-indigo-100 dark:border-slate-800"
              >
                {/* Header with electric gradient */}
                <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 text-white p-6 sm:p-7 relative">
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest bg-slate-950/40 text-amber-300 px-2.5 py-1 rounded-md border border-white/20">
                    Free 3-Day Trial Pass
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black mt-2 leading-tight">
                    {selectedCourseForEnroll.name}
                  </h4>
                  <p className="text-indigo-100 text-xs mt-1">
                    Reserve your desk at Rehman Mathematics Classes, Shastri Nagar, Ghaziabad.
                  </p>
                </div>

                {/* Form or Success */}
                <div className="p-6 sm:p-8">
                  {!enrollFormSubmitted ? (
                    <form onSubmit={handleEnrollSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          Student Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Aryan Sharma"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          WhatsApp / Mobile Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                            Current Class
                          </label>
                          <select
                            value={formData.grade}
                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                            className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none"
                          >
                            <option>Class 9th</option>
                            <option>Class 10th</option>
                            <option>Class 11th</option>
                            <option>Class 12th</option>
                            <option>Class 12th Pass / Dropper</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                            Preferred Mode
                          </label>
                          <select
                            value={formData.mode}
                            onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                            className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none"
                          >
                            <option>Offline Center (Shastri Nagar)</option>
                            <option>Online Live Batch</option>
                            <option>Hybrid Model</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 py-1 text-slate-500 dark:text-slate-400 text-xs">
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                        <span>100% Free Demo. No admission fee during trial period.</span>
                      </div>

                      {submitError && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-medium">
                          {submitError}
                        </div>
                      )}

                      <Button3D
                        type="submit"
                        variant="primary"
                        size="md"
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        <span>{isSubmitting ? 'Reserving...' : 'Confirm Demo Seat with Rehman Sir'}</span>
                      </Button3D>
                    </form>
                  ) : (
                    <div className="text-center py-6 space-y-4">
                      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                        <Check className="w-8 h-8 stroke-[3]" />
                      </div>
                      <h5 className="text-xl font-bold text-slate-900 dark:text-white">
                        Demo Class Confirmed!
                      </h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                        Welcome <span className="font-extrabold text-slate-900 dark:text-white">{formData.name}</span>! Your slot for <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedCourseForEnroll.name}</span> has been confirmed. Rehman Sir will reach out to <span className="font-bold text-slate-900 dark:text-white">{formData.phone}</span> with batch timings and directions.
                      </p>
                      <Button3D
                        variant="secondary"
                        size="sm"
                        onClick={handleCloseModal}
                      >
                        <span>Done</span>
                      </Button3D>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
