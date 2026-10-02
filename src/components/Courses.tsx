import React, { useState, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COURSES } from '../data';
import { Course } from '../types';
import { Clock, CheckCircle2, Sparkles, UserCheck, X, Check, ArrowRight, Zap, Phone, MessageSquare, MapPin, CalendarDays } from 'lucide-react';
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

  const scheduleBatches = [
    { cls: 'Class IX', days: 'Maths & Science', timing: '4.00 PM TO 5.00 PM' },
    { cls: 'Class X', days: 'Maths & Science', timing: '5.00 PM TO 6.00 PM' },
    { cls: 'Class XI', days: 'MON, TUE & WED • Maths', timing: '7.00 PM TO 8.30 PM' },
    { cls: 'Class XII', days: 'THU, FRI & SAT • Maths', timing: '7.00 PM TO 8.30 PM' }
  ];

  return (
    <section
      id="courses"
      className="py-20 md:py-28 bg-paper dark:bg-chalk-950 math-grid transition-colors duration-300 relative border-t border-chalk-200/60 dark:border-chalk-800/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="max-w-2xl mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] font-bold text-chalk-950 dark:text-chalk-50 tracking-tight">
            Batches and class timings
          </h2>
          <p className="text-chalk-600 dark:text-chalk-300 mt-4 text-sm sm:text-base leading-relaxed max-w-[60ch]">
            Structured batches for Class 9th, 10th, 11th, 12th & IIT-JEE with Rehman Sir for Session {sessionInfo.currentSession}. Reserve seats early for optimal student-teacher interaction.
          </p>
        </motion.div>

        {/* Official schedule board */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="mb-16 p-1.5 sm:p-2 rounded-[2rem] bg-chalk-100/70 dark:bg-chalk-900/60 ring-1 ring-chalk-200/80 dark:ring-chalk-800 shadow-[0_30px_70px_-40px_rgba(10,15,12,0.4)] dark:shadow-[0_30px_70px_-40px_rgba(0,0,0,0.9)]"
        >
          <div className="rounded-[calc(2rem-0.5rem)] bg-white dark:bg-chalk-950 p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-chalk-200/80 dark:border-chalk-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/70 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-[11px] font-mono font-semibold mb-2.5 tnum">
                  <CalendarDays className="w-3 h-3" />
                  <span>BATCH FOR SESSION {sessionInfo.currentSession}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-chalk-950 dark:text-chalk-50">
                  REHMAN CLASSES <span className="text-emerald-600 dark:text-emerald-400">•</span> GHAZIABAD
                </h3>
                <p className="text-xs sm:text-sm text-chalk-500 dark:text-chalk-400 mt-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>D-48 Mahendra Enclave (Near Silver Shine School) Ghaziabad</span>
                </p>
              </div>

              {/* Direct call & WhatsApp CTAs */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href="tel:9911667462"
                  className="px-5 py-2.5 rounded-full bg-chalk-950 dark:bg-chalk-100 hover:bg-chalk-800 dark:hover:bg-white text-white dark:text-chalk-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call: 9911667462</span>
                </a>
                <a
                  href={`https://wa.me/919911667462?text=${encodeURIComponent(`Hello Rehman Sir, I want to inquire about the Session ${sessionInfo.currentSession} Batches (Class IX-XII / IIT-JEE).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Rehman Sir</span>
                </a>
              </div>
            </div>

            {/* 4 official batch timings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 pt-6">
              {scheduleBatches.map((batch, idx) => (
                <div key={idx} className="group">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-chalk-100 dark:bg-chalk-900 text-chalk-700 dark:text-chalk-200 text-[11px] font-mono font-semibold">
                      {batch.cls}
                    </span>
                    <Clock className="w-3.5 h-3.5 text-chalk-300 dark:text-chalk-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <p className="text-lg sm:text-xl font-display font-bold text-chalk-950 dark:text-chalk-50 tnum mt-3 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {batch.timing}
                  </p>
                  <p className="text-[11px] text-chalk-500 dark:text-chalk-400 mt-1 font-medium">
                    {batch.days}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tab filters */}
        <div className="flex flex-wrap justify-start gap-2 mb-10 max-w-xl p-1.5 rounded-full bg-white dark:bg-chalk-900/80 border border-chalk-200/80 dark:border-chalk-800 shadow-[0_10px_30px_-20px_rgba(10,15,12,0.3)]">
          {[
            { id: 'All', label: 'All Batches' },
            { id: 'Boards', label: 'CBSE / ISC / Boards' },
            { id: 'JEE', label: 'JEE Mains & Adv' },
            { id: 'Foundation', label: 'Class 9-10th' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-chalk-950 dark:bg-chalk-100 text-white dark:text-chalk-950'
                  : 'text-chalk-600 dark:text-chalk-300 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Courses grid */}
        <motion.div
          layout
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => {
              return (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="h-full"
                >
                  <Card3D intensity={4} className="h-full">
                    <div className="bg-white dark:bg-chalk-900/80 rounded-[1.75rem] border border-chalk-200/80 dark:border-chalk-800 shadow-[0_20px_50px_-30px_rgba(10,15,12,0.3)] dark:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.8)] p-6 sm:p-7 flex flex-col justify-between transition-all group relative overflow-hidden h-full">
                      <div>
                        {/* Tag & duration */}
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="px-3 py-1 rounded-full bg-chalk-100 dark:bg-chalk-800 text-chalk-700 dark:text-chalk-200 text-[11px] font-mono font-semibold uppercase tracking-wide">
                            {course.tag}
                          </span>
                          <div className="flex items-center gap-1.5 text-chalk-400 text-xs font-mono tnum shrink-0">
                            <Clock className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{course.duration}</span>
                          </div>
                        </div>

                        {/* Timing strip */}
                        {course.timing && (
                          <div className="mb-4 px-3.5 py-2 rounded-xl bg-chalk-50 dark:bg-chalk-950/70 border border-chalk-200/70 dark:border-chalk-800 flex items-center justify-between gap-2 text-xs">
                            <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 tnum">
                              {course.timing}
                            </span>
                            {course.days && (
                              <span className="text-[10px] font-semibold text-chalk-500 dark:text-chalk-400">
                                {course.days}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Title & description */}
                        <h3 className="text-xl sm:text-2xl font-bold text-chalk-950 dark:text-chalk-50 tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                          {course.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-chalk-500 dark:text-chalk-400 mt-2 leading-relaxed">
                          {course.description}
                        </p>

                        {/* Features */}
                        <div className="space-y-2.5 mt-5 mb-6">
                          {course.features.map((feat, index) => (
                            <div key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-chalk-700 dark:text-chalk-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                              <span className="leading-snug">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Enroll CTA */}
                      <Button3D
                        variant="primary"
                        size="md"
                        onClick={() => handleEnrollClick(course)}
                        className="w-full"
                      >
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

        {/* Quick registration modal */}
        <AnimatePresence>
          {selectedCourseForEnroll && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
                className="absolute inset-0 bg-chalk-950/70 backdrop-blur-sm"
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 12 }}
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                className="bg-white dark:bg-chalk-900 w-full max-w-lg rounded-[1.75rem] overflow-hidden shadow-2xl relative z-10 border border-chalk-200/70 dark:border-chalk-800"
              >
                {/* Modal header */}
                <div className="p-6 sm:p-7 relative border-b border-chalk-200/70 dark:border-chalk-800">
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 text-chalk-400 hover:text-chalk-900 dark:hover:text-chalk-100 p-1.5 rounded-full hover:bg-chalk-100 dark:hover:bg-chalk-800 transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
                    Free 3-Day Trial Pass
                  </span>
                  <h4 className="text-xl sm:text-2xl font-bold text-chalk-950 dark:text-chalk-50 mt-2 leading-snug tracking-tight pr-8">
                    {selectedCourseForEnroll.name}
                  </h4>
                  <p className="text-chalk-500 dark:text-chalk-400 text-xs mt-1.5">
                    Reserve your desk at Rehman Mathematics Classes, Shastri Nagar, Ghaziabad.
                  </p>
                </div>

                {/* Form or success */}
                <div className="p-6 sm:p-8">
                  {!enrollFormSubmitted ? (
                    <form onSubmit={handleEnrollSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="enroll-name" className="block text-xs font-semibold text-chalk-600 dark:text-chalk-300 mb-1.5">
                          Student name
                        </label>
                        <input
                          id="enroll-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Aryan Sharma"
                          className="w-full px-4 py-3 rounded-xl border border-chalk-300 dark:border-chalk-700 bg-paper dark:bg-chalk-950 text-chalk-900 dark:text-chalk-50 placeholder-chalk-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="enroll-phone" className="block text-xs font-semibold text-chalk-600 dark:text-chalk-300 mb-1.5">
                          WhatsApp / mobile number
                        </label>
                        <input
                          id="enroll-phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-chalk-300 dark:border-chalk-700 bg-paper dark:bg-chalk-950 text-chalk-900 dark:text-chalk-50 placeholder-chalk-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all tnum"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="enroll-grade" className="block text-xs font-semibold text-chalk-600 dark:text-chalk-300 mb-1.5">
                            Current class
                          </label>
                          <select
                            id="enroll-grade"
                            value={formData.grade}
                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                            className="w-full px-3.5 py-3 rounded-xl border border-chalk-300 dark:border-chalk-700 bg-paper dark:bg-chalk-950 text-chalk-900 dark:text-chalk-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer"
                          >
                            <option>Class 9th</option>
                            <option>Class 10th</option>
                            <option>Class 11th</option>
                            <option>Class 12th</option>
                            <option>Class 12th Pass / Dropper</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="enroll-mode" className="block text-xs font-semibold text-chalk-600 dark:text-chalk-300 mb-1.5">
                            Preferred mode
                          </label>
                          <select
                            id="enroll-mode"
                            value={formData.mode}
                            onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                            className="w-full px-3.5 py-3 rounded-xl border border-chalk-300 dark:border-chalk-700 bg-paper dark:bg-chalk-950 text-chalk-900 dark:text-chalk-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer"
                          >
                            <option>Offline Center (Shastri Nagar)</option>
                            <option>Online Live Batch</option>
                            <option>Hybrid Model</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 py-1 text-chalk-500 dark:text-chalk-400 text-xs">
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                        <span>100% Free Demo. No admission fee during trial period.</span>
                      </div>

                      {submitError && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-medium" role="alert">
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
                      <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                        <Check className="w-8 h-8 stroke-[3]" />
                      </div>
                      <h5 className="text-xl font-bold text-chalk-950 dark:text-chalk-50">
                        Demo class confirmed
                      </h5>
                      <p className="text-sm text-chalk-500 dark:text-chalk-400 leading-relaxed max-w-sm mx-auto">
                        Welcome <span className="font-bold text-chalk-950 dark:text-chalk-50">{formData.name}</span>! Your slot for <span className="font-semibold text-emerald-700 dark:text-emerald-400">{selectedCourseForEnroll.name}</span> has been confirmed. Rehman Sir will reach out to <span className="font-bold text-chalk-950 dark:text-chalk-50">{formData.phone}</span> with batch timings and directions.
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
