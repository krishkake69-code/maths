import React, { useState, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, MapPin, Check, ExternalLink, Zap, ArrowRight, MessageSquare } from 'lucide-react';
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

  const inputClass = "w-full px-4 py-3 rounded-xl border border-chalk-300 dark:border-chalk-700 bg-paper dark:bg-chalk-950 text-chalk-900 dark:text-chalk-50 placeholder-chalk-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all";
  const labelClass = "block text-xs font-semibold text-chalk-600 dark:text-chalk-300 mb-1.5";

  return (
    <section
      id="contact"
      className="py-20 md:py-28 bg-paper dark:bg-chalk-950 transition-colors duration-300 relative border-t border-chalk-200/60 dark:border-chalk-800/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="max-w-2xl mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] font-bold text-chalk-950 dark:text-chalk-50 tracking-tight">
            Claim your free 3-day demo pass
          </h2>
          <p className="text-chalk-600 dark:text-chalk-300 mt-4 text-sm sm:text-base leading-relaxed max-w-[60ch]">
            Attend 3 live classroom lectures with Rehman Sir in Shastri Nagar, Ghaziabad before taking admission.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">

          {/* Left: center information */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-5 flex flex-col"
          >
            <div>
              <h3 className="text-2xl font-bold text-chalk-950 dark:text-chalk-50 tracking-tight">
                Classroom center information
              </h3>
              <p className="text-chalk-500 dark:text-chalk-400 text-xs sm:text-sm mt-2 leading-relaxed max-w-[50ch]">
                Located right beside Silver Shine School in Shastri Nagar. Parents and students are welcome for in-person counseling and study material review.
              </p>
            </div>

            {/* Detail rows */}
            <div className="divide-y divide-chalk-200/80 dark:divide-chalk-800 border-y border-chalk-200/80 dark:border-chalk-800 mt-8">
              <div className="py-5 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-chalk-100 dark:bg-chalk-900 text-emerald-700 dark:text-emerald-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-chalk-400">Helpline & admissions</h4>
                  <p className="text-base sm:text-lg font-bold text-chalk-950 dark:text-chalk-50 mt-1 tnum">
                    {contactInfo?.phone || '+91 99116 67462'}
                  </p>
                  <p className="text-xs text-chalk-500 dark:text-chalk-400 mt-0.5">9:00 AM - 8:30 PM (All 7 Days)</p>
                </div>
              </div>

              <div className="py-5 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-chalk-100 dark:bg-chalk-900 text-emerald-700 dark:text-emerald-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-chalk-400">Official email</h4>
                  <p className="text-sm sm:text-base font-bold text-chalk-950 dark:text-chalk-50 mt-1 break-all">
                    {contactInfo?.email || 'rehmanmathsclasses@gmail.com'}
                  </p>
                  <p className="text-xs text-chalk-500 dark:text-chalk-400 mt-0.5">Academic updates & parent queries</p>
                </div>
              </div>

              <div className="py-5 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-chalk-100 dark:bg-chalk-900 text-emerald-700 dark:text-emerald-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-chalk-400">Center address</h4>
                  <p className="text-xs sm:text-sm font-bold text-chalk-950 dark:text-chalk-50 mt-1 leading-snug">
                    {activeCenter.address}
                  </p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-1.5 rounded-full border border-chalk-300 dark:border-chalk-700 hover:border-emerald-600 dark:hover:border-emerald-500 text-chalk-600 dark:text-chalk-300 hover:text-emerald-700 dark:hover:text-emerald-400 text-xs font-semibold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-8">
              <Button3D
                variant="emerald"
                size="md"
                onClick={handleWhatsAppInquiry}
                className="w-full"
              >
                <MessageSquare className="w-4.5 h-4.5" />
                <span>Chat Directly with Rehman Sir on WhatsApp</span>
              </Button3D>
            </div>

            {/* Embedded map */}
            <div className="rounded-[1.5rem] overflow-hidden border border-chalk-200/80 dark:border-chalk-800 bg-chalk-100 dark:bg-chalk-900 mt-6">
              <div className="p-3 border-b border-chalk-200/80 dark:border-chalk-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-chalk-700 dark:text-chalk-200">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Shastri Nagar, Ghaziabad</span>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
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
          </motion.div>

          {/* Right: lead form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-7 p-1.5 sm:p-2 rounded-[2rem] bg-chalk-100/70 dark:bg-chalk-900/60 ring-1 ring-chalk-200/80 dark:ring-chalk-800 shadow-[0_30px_70px_-40px_rgba(10,15,12,0.35)] dark:shadow-[0_30px_70px_-40px_rgba(0,0,0,0.9)]"
          >
            <div className="rounded-[calc(2rem-0.5rem)] bg-white dark:bg-chalk-950 p-6 sm:p-10 h-full flex flex-col justify-between">
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
                      <div className="flex items-center gap-2.5">
                        <span className="bg-chalk-950 dark:bg-chalk-100 text-chalk-50 dark:text-chalk-950 font-mono font-semibold text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-full">
                          Quick Registration
                        </span>
                        <span className="text-xs text-chalk-400">Takes under 30 seconds</span>
                      </div>

                      <h4 className="text-xl sm:text-2xl font-bold text-chalk-950 dark:text-chalk-50 tracking-tight">
                        Book Your 3-Day Free Demo Class
                      </h4>
                      <p className="text-xs sm:text-sm text-chalk-500 dark:text-chalk-400 leading-relaxed max-w-[55ch]">
                        Receive personal batch timings and a free curated PDF booklet of previous 10-year JEE Calculus shortcuts.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div>
                          <label htmlFor="contact-name" className={labelClass}>
                            Student full name
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Priyanshu Gupta"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label htmlFor="contact-phone" className={labelClass}>
                            WhatsApp number
                          </label>
                          <input
                            id="contact-phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="e.g. 98765 43210"
                            className={`${inputClass} tnum`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="contact-email" className={labelClass}>
                            Email (optional)
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="student@gmail.com"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label htmlFor="contact-course" className={labelClass}>
                            Target math course
                          </label>
                          <select
                            id="contact-course"
                            value={formData.course}
                            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                            className={`${inputClass} cursor-pointer`}
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
                        <label htmlFor="contact-message" className={labelClass}>
                          Any specific topic you struggle with?
                        </label>
                        <textarea
                          id="contact-message"
                          rows={3}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="e.g. Scored 85% in Class 10th. Finding Class 11 Trigonometry & Limits challenging."
                          className={`${inputClass} resize-none`}
                        />
                      </div>
                    </div>

                    {submitError && (
                      <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-medium mt-4" role="alert">
                        {submitError}
                      </div>
                    )}

                    <div className="pt-4">
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
                            <Zap className="w-4 h-4 text-emerald-300 dark:text-emerald-500 fill-emerald-300 dark:fill-emerald-500" />
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
                    initial={{ scale: 0.97, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    className="text-center py-12 space-y-6 flex flex-col items-center justify-center h-full"
                  >
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Check className="w-10 h-10 stroke-[3]" />
                    </div>
                    <div className="space-y-2 max-w-md mx-auto">
                      <h4 className="text-2xl font-bold text-chalk-950 dark:text-chalk-50 tracking-tight">
                        Demo class pass reserved
                      </h4>
                      <p className="text-chalk-500 dark:text-chalk-400 text-sm sm:text-base leading-relaxed">
                        We have received your registration. <span className="font-bold text-chalk-950 dark:text-chalk-50">Rehman Sir</span> or our academic counselor will call you within <span className="font-semibold text-emerald-700 dark:text-emerald-400">2 hours</span> with batch timings and classroom seat confirmation.
                      </p>
                    </div>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-full border border-chalk-300 dark:border-chalk-700 hover:border-chalk-500 dark:hover:border-chalk-500 text-chalk-700 dark:text-chalk-100 text-xs font-bold cursor-pointer transition-colors"
                    >
                      Register Another Student
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
