import React, { useState, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, MapPin, Check, Send, Sparkles, ExternalLink, Compass, Zap, ArrowRight, MessageSquare } from 'lucide-react';
import Button3D from './Button3D';
import { getAcademicSessionInfo } from '../utils/academicSession';

interface ContactProps {
  contactInfo?: {
    phone: string;
    email: string;
    instagram: string;
    facebook: string;
    whatsapp: string;
    mapUrl?: string;
  };
  centers?: {
    id: string;
    name: string;
    address: string;
    details: string;
    mapUrl?: string;
  }[];
}

export default function Contact({ contactInfo, centers }: ContactProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', course: 'JEE Mains & Advanced', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedCenterIdx, setSelectedCenterIdx] = useState(0);

  const cleanPhone = contactInfo?.phone ? contactInfo.phone.replace(/[^0-9]/g, '') : '919911667462';
  const googleMapsUrl = 'https://maps.app.goo.gl/LvyJGmogmsHMHJov9';

  const sessionInfo = useMemo(() => getAcademicSessionInfo(), []);

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hi Rehman Sir, I want to book a free 3-Day Mathematics Demo Class for Session ${sessionInfo.currentSession} at REHMAN CLASSES (D-48 Mahendra Enclave, Near Silver Shine School, Shastri Nagar, Ghaziabad). My name is [Student Name].`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
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
          email: formData.email,
          course: formData.course,
          message: formData.message,
          type: 'contact'
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', course: 'JEE Mains & Advanced', message: '' });
      } else {
        const errData = await res.json();
        setSubmitError(errData.error || 'Failed to submit registration. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultCenters = [
    {
      id: 'center-1',
      name: "Main Campus (Shastri Nagar)",
      address: "D-48 Mahendra Enclave (Near Silver Shine School), Shastri Nagar, Ghaziabad, Uttar Pradesh 201002",
      details: "D-48 Mahendra Enclave (Near Silver Shine School) Ghaziabad",
      mapUrl: "https://maps.app.goo.gl/LvyJGmogmsHMHJov9"
    }
  ];

  const centersToDisplay = (centers && centers.length > 0) ? centers : defaultCenters;
  const activeCenter = centersToDisplay[selectedCenterIdx] || centersToDisplay[0] || defaultCenters[0];

  return (
    <section
      id="contact"
      className="py-20 md:py-28 bg-white dark:bg-[#07090e] transition-colors duration-300 relative border-t border-slate-200/60 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
            // ADMISSIONS 2026-27 OPEN
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight mt-1">
            Claim Your Free 3-Day Demo Pass
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Attend 3 live classroom lectures with Rehman Sir in Shastri Nagar, Ghaziabad before taking admission.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Details & Map */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-slate-950 dark:text-white">
                  Classroom Center Information
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                  Located right beside Silver Shine School in Shastri Nagar. Parents and students are welcome for in-person counseling and study material review.
                </p>
              </div>

              {/* Detail Items */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800">
                  <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-200/50 dark:border-indigo-800/50">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Helpline & Admissions</h4>
                    <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {contactInfo?.phone || '+91 99116 67462'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">9:00 AM - 8:30 PM (All 7 Days)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800">
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 shrink-0 border border-amber-200/50 dark:border-amber-800/50">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Official Email</h4>
                    <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {contactInfo?.email || 'rehmanmathsclasses@gmail.com'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Academic updates & parent queries</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800">
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-200/50 dark:border-emerald-800/50">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                      Center Address
                    </h4>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5 leading-snug">
                      {activeCenter.address}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{activeCenter.details}</p>
                    
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in Google Maps</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp button */}
              <Button3D
                variant="emerald"
                size="md"
                onClick={handleWhatsAppInquiry}
                className="w-full"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Chat Directly with Rehman Sir on WhatsApp</span>
              </Button3D>
            </div>

            {/* Embedded Google Map Preview Card */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-950 mt-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>Google Maps • Shastri Nagar, Ghaziabad</span>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  Directions <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <iframe
                title="Rehman Mathematics Classes Location"
                src="https://www.google.com/maps?q=D+48+near+SILVER+SHINE+SCHOOL+Mahendra+Enclave+Shastri+Nagar+Ghaziabad&output=embed"
                className="w-full h-44 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Contact Lead Generation Form */}
          <div className="lg:col-span-7 bg-slate-50/90 dark:bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between shadow-xl shadow-indigo-950/5 relative backdrop-blur-xs">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleFormSubmit}
                  className="space-y-5 flex-1 flex flex-col justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-500 text-slate-950 font-mono font-black text-[10px] uppercase px-2 py-0.5 rounded">
                        Quick Registration
                      </span>
                      <span className="text-xs text-slate-400">Takes under 30 seconds</span>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                      Book Your 3-Day Free Demo Class
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-normal">
                      Receive personal batch timings and a free curated PDF booklet of previous 10-year JEE Calculus shortcuts.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          Student Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Priyanshu Gupta"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="student@gmail.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                          Target Math Course
                        </label>
                        <select
                          value={formData.course}
                          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                          className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        >
                          <option value="JEE Mains & Advanced">JEE Mains & Advanced (Class 11 & 12)</option>
                          <option value="Class 12th Boards + JEE">Class 12th Boards (CBSE 100/100 Track)</option>
                          <option value="Class 11th Foundation">Class 11th Foundation Mathematics</option>
                          <option value="Class 10th Boards Target 100">Class 10th CBSE Boards Target 100</option>
                          <option value="Junior Olympiad & 9th">Class 9th Foundation & Olympiad</option>
                          <option value="Dropper Super Batch">Dropper & Repeaters Speed Batch</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Any specific topic you struggle with?
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="e.g. Scored 85% in Class 10th. Finding Class 11 Trigonometry & Limits challenging."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-medium">
                      {submitError}
                    </div>
                  )}

                  <div className="pt-2">
                    <Button3D
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <span>Securing demo seat...</span>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                          <span>Reserve My Free 3-Day Demo Class</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button3D>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12 space-y-6 flex flex-col items-center justify-center h-full"
                >
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
                    <Check className="w-10 h-10 stroke-[3]" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                      Demo Class Pass Reserved!
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      We have received your registration. <span className="font-bold text-slate-900 dark:text-white">Rehman Sir</span> or our academic counselor will call you within <span className="font-semibold text-indigo-600 dark:text-indigo-400">2 hours</span> with batch timings and classroom seat confirmation.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black cursor-pointer"
                  >
                    Register Another Student
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
