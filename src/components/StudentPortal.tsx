import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, LogOut, User, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { studentApi, setStudentToken, getStudentToken, clearStudentToken } from '../lib/api';
import type { StudentMe } from '../types';

interface StudentPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentPortal({ isOpen, onClose }: StudentPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [studentData, setStudentData] = useState<StudentMe | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'attendance' | 'marks' | 'calendar'>('profile');

  // Check if token already exists in localStorage
  useEffect(() => {
    const token = getStudentToken();
    if (token) {
      validateToken(token);
    }
  }, [isOpen]);

  const validateToken = async (token: string) => {
    try {
      const res = await studentApi.session();
      if (res.authenticated && res.studentId) {
        setIsAuthenticated(true);
        fetchStudentData();
      } else {
        clearStudentToken();
      }
    } catch (e) {
      console.error('Session validation error:', e);
      clearStudentToken();
    }
  };

  const fetchStudentData = async () => {
    try {
      const res = await studentApi.me();
      if (res.success && res.student) {
        setStudentData(res);
      }
    } catch (err) {
      console.error('Failed to fetch student data:', err);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setIsSubmittingAuth(true);
    setAuthError('');

    try {
      const res = await studentApi.login({ username, password });
      if (res.success && res.token) {
        setStudentToken(res.token);
        setIsAuthenticated(true);
        setPassword('');
        setUsername('');
        fetchStudentData();
      } else {
        setAuthError(res.error || 'Invalid username or password.');
      }
    } catch (err) {
      setAuthError('Server connection failed. Is the backend running?');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = () => {
    clearStudentToken();
    setIsAuthenticated(false);
    setStudentData(null);
    setAuthError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-chalk-900/80 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-chalk-900 w-full max-w-md h-[85vh] rounded-[2rem] flex flex-col shadow-2xl border border-chalk-300 dark:border-chalk-700 overflow-hidden text-chalk-800 dark:text-chalk-100"
      >
        {/* Modal Header */}
        <header className="h-16 border-b border-chalk-200 dark:border-chalk-800 flex items-center justify-between px-6 bg-chalk-50 dark:bg-chalk-950/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-base">
              <User className="w-5 h-5" />
            </div>
            <span className="text-chalk-950 dark:text-chalk-50 font-extrabold text-lg uppercase tracking-tight">
              Student <span className="text-emerald-600 dark:text-emerald-400">Portal</span>
            </span>
            {isAuthenticated && (
              <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active Session
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-chalk-400 hover:text-chalk-600 dark:hover:text-chalk-200 hover:bg-chalk-100 dark:hover:bg-chalk-800 transition-colors"
          >
            <Lock className="w-5 h-5" />
          </button>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {!isAuthenticated ? (
            /* LOGIN CARD */
            <div className="flex-1 flex items-center justify-center bg-chalk-50 dark:bg-chalk-950 p-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-md bg-white dark:bg-chalk-900 p-8 rounded-2xl shadow-xl border border-chalk-200/60 dark:border-chalk-800 flex flex-col"
              >
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-5 mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-center text-2xl font-black text-chalk-950 dark:text-chalk-50 uppercase mb-2">
                  Student <span className="text-emerald-600 dark:text-emerald-400">Login</span>
                </h2>
                <p className="text-center text-xs text-chalk-500 dark:text-chalk-400 mb-6">
                  Enter your credentials to access your attendance, marks, and calendar.
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-chalk-500 mb-1.5">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="your_username"
                      className="w-full px-4 py-3 rounded-xl border-2 border-chalk-200 dark:border-chalk-800 bg-transparent text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
                      required
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-chalk-500 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border-2 border-chalk-200 dark:border-chalk-800 bg-transparent text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-chalk-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {authError && (
                    <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-medium bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg border border-rose-200/50">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingAuth}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingAuth ? 'Signing in...' : 'Access Portal'}
                    <Lock className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            </div>
          ) : (
            /* STUDENT DASHBOARD */
            <>
              {/* Top bar with student info */}
              <div className="bg-emerald-600/10 dark:bg-emerald-950/20 border-b border-emerald-200/50 dark:border-emerald-800/50 px-6 py-4 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-lg">
                      {studentData?.student.name?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <div>
                      <p className="font-bold text-chalk-950 dark:text-chalk-50 text-sm">{studentData?.student.name}</p>
                      <p className="text-xs text-chalk-500 dark:text-chalk-400">
                        @{studentData?.student.username} · {studentData?.student.class} · {studentData?.student.batchId}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                    title="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-chalk-200 dark:border-chalk-800 px-4 shrink-0">
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'attendance', label: 'Attendance', icon: Lock },
                  { id: 'marks', label: 'Marks', icon: Lock },
                  { id: 'calendar', label: 'Calendar', icon: Lock },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as typeof activeTab)}
                    className={`flex-1 py-3 px-2 text-center text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer relative ${
                      activeTab === id
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-chalk-500 dark:text-chalk-400 hover:text-chalk-700 dark:hover:text-chalk-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    {label}
                    {activeTab === id && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeTab === 'profile' && studentData && (
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200/60 dark:border-chalk-800/60 p-5 shadow-sm">
                      <h3 className="text-sm font-bold text-chalk-950 dark:text-chalk-50 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-600" /> Profile Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-chalk-500 dark:text-chalk-400 text-xs uppercase tracking-wide">Full Name</p>
                          <p className="font-semibold text-chalk-950 dark:text-chalk-50">{studentData.student.name}</p>
                        </div>
                        <div>
                          <p className="text-chalk-500 dark:text-chalk-400 text-xs uppercase tracking-wide">Username</p>
                          <p className="font-semibold text-chalk-950 dark:text-chalk-50">@{studentData.student.username}</p>
                        </div>
                        <div>
                          <p className="text-chalk-500 dark:text-chalk-400 text-xs uppercase tracking-wide">Class</p>
                          <p className="font-semibold text-chalk-950 dark:text-chalk-50">{studentData.student.class}</p>
                        </div>
                        <div>
                          <p className="text-chalk-500 dark:text-chalk-400 text-xs uppercase tracking-wide">Batch</p>
                          <p className="font-semibold text-chalk-950 dark:text-chalk-50">{studentData.student.batchId}</p>
                        </div>
                        <div>
                          <p className="text-chalk-500 dark:text-chalk-400 text-xs uppercase tracking-wide">Phone</p>
                          <p className="font-semibold text-chalk-950 dark:text-chalk-50">{studentData.student.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-chalk-500 dark:text-chalk-400 text-xs uppercase tracking-wide">Email</p>
                          <p className="font-semibold text-chalk-950 dark:text-chalk-50">{studentData.student.email || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-chalk-500 dark:text-chalk-400 text-xs uppercase tracking-wide">Subjects</p>
                          <p className="font-semibold text-chalk-950 dark:text-chalk-50">{studentData.student.subjects?.join(', ') || 'None'}</p>
                        </div>
                        <div>
                          <p className="text-chalk-500 dark:text-chalk-400 text-xs uppercase tracking-wide">Joined</p>
                          <p className="font-semibold text-chalk-950 dark:text-chalk-50">{studentData.student.createdAt ? new Date(studentData.student.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'attendance' && studentData && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-chalk-950 dark:text-chalk-50 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-600" /> Attendance Records
                    </h3>
                    {studentData.attendance.length === 0 ? (
                      <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200/60 dark:border-chalk-800/60 p-12 text-center shadow-sm">
                        <Lock className="mx-auto h-10 w-10 text-chalk-400" strokeWidth={1.5} />
                        <p className="mt-3 text-ink font-medium">No attendance records yet</p>
                        <p className="text-sm text-chalk-400 mt-1">Your teacher will mark attendance after each class.</p>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200/60 dark:border-chalk-800/60 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-chalk-200 dark:border-chalk-800 bg-chalk-50 dark:bg-chalk-950 text-left text-xs uppercase tracking-wider text-chalk-500">
                                <th className="px-4 py-3 font-semibold">Date</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Marked</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-chalk-200 dark:divide-chalk-800">
                              {studentData.attendance.map((a) => (
                                <tr key={a.id} className="hover:bg-chalk-50/50 dark:hover:bg-chalk-950/50">
                                  <td className="px-4 py-3 text-chalk-700 dark:text-chalk-300">{new Date(a.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                      a.status === 'present' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' :
                                      a.status === 'late' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' :
                                      'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                                    }`}>
                                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-chalk-500 dark:text-chalk-400 text-xs">{new Date(a.markedAt).toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'marks' && studentData && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-chalk-950 dark:text-chalk-50 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-600" /> Test Marks
                    </h3>
                    {studentData.marks.length === 0 ? (
                      <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200/60 dark:border-chalk-800/60 p-12 text-center shadow-sm">
                        <Lock className="mx-auto h-10 w-10 text-chalk-400" strokeWidth={1.5} />
                        <p className="mt-3 text-ink font-medium">No marks recorded yet</p>
                        <p className="text-sm text-chalk-400 mt-1">Your teacher will add test scores after evaluations.</p>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200/60 dark:border-chalk-800/60 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-chalk-200 dark:border-chalk-800 bg-chalk-50 dark:bg-chalk-950 text-left text-xs uppercase tracking-wider text-chalk-500">
                                <th className="px-4 py-3 font-semibold">Test</th>
                                <th className="px-4 py-3 font-semibold">Subject</th>
                                <th className="px-4 py-3 font-semibold">Date</th>
                                <th className="px-4 py-3 font-semibold text-right">Score</th>
                                <th className="px-4 py-3 font-semibold text-right">%</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-chalk-200 dark:divide-chalk-800">
                              {studentData.marks.map((m) => {
                                const pct = m.maxMarks ? Math.round((m.marksObtained / m.maxMarks) * 100) : 0;
                                return (
                                  <tr key={m.id} className="hover:bg-chalk-50/50 dark:hover:bg-chalk-950/50">
                                    <td className="px-4 py-3 text-chalk-700 dark:text-chalk-300 font-medium">{m.testName}</td>
                                    <td className="px-4 py-3 text-chalk-500 dark:text-chalk-400">{m.subject}</td>
                                    <td className="px-4 py-3 text-chalk-500 dark:text-chalk-400">{new Date(m.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    <td className="px-4 py-3 text-right text-chalk-700 dark:text-chalk-300">{m.marksObtained} / {m.maxMarks}</td>
                                    <td className="px-4 py-3 text-right">
                                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                        pct >= 75 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' :
                                        pct >= 40 ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' :
                                        'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                                      }`}>
                                        {pct}%
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'calendar' && studentData && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-chalk-950 dark:text-chalk-50 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-600" /> Calendar Events
                    </h3>
                    {studentData.calendar.length === 0 ? (
                      <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200/60 dark:border-chalk-800/60 p-12 text-center shadow-sm">
                        <Lock className="mx-auto h-10 w-10 text-chalk-400" strokeWidth={1.5} />
                        <p className="mt-3 text-ink font-medium">No upcoming events</p>
                        <p className="text-sm text-chalk-400 mt-1">Events will appear here when your teacher adds them.</p>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200/60 dark:border-chalk-800/60 shadow-sm overflow-hidden">
                        <ul className="divide-y divide-chalk-200 dark:divide-chalk-800">
                          {studentData.calendar.map((e) => (
                            <li key={e.id} className="flex flex-wrap items-start gap-4 px-5 py-4">
                              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 leading-none">
                                <span className="font-display text-base font-semibold">{e.date?.slice(8, 10)}</span>
                                <span className="text-[10px] uppercase">{e.date?.slice(5, 7)}</span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-chalk-950 dark:text-chalk-50 font-medium">{e.title}</p>
                                {e.description && <p className="text-sm text-chalk-500 dark:text-chalk-400 mt-0.5">{e.description}</p>}
                                <p className="text-xs text-chalk-400 mt-1">
                                  {new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                  {e.endDate && e.endDate !== e.date ? ` – ${new Date(e.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}` : ''}
                                  {' · '}
                                  {e.batchId ? `Batch: ${e.batchId}` : e.class === 'all' ? 'All classes' : `Class ${e.class}`}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}