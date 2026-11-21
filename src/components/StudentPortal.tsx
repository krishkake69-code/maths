import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  LogOut,
  User,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  X,
  CalendarCheck2,
  BookOpenCheck,
  CalendarDays,
  GraduationCap,
  Clock,
  Calendar,
} from 'lucide-react';
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

  const validateToken = async (_token: string) => {
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
      const res = await studentApi.login({ username: username.trim().toLowerCase(), password });
      if (res.success && res.token) {
        setStudentToken(res.token);
        setIsAuthenticated(true);
        setPassword('');
        setUsername('');
        fetchStudentData();
      } else {
        setAuthError(res.error || 'Incorrect Student ID or password.');
      }
    } catch (err) {
      setAuthError('Server connection failed. Please try again.');
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

  // Attendance analytics
  const totalAttendanceDays = studentData?.attendance.length || 0;
  const presentDays = studentData?.attendance.filter((a) => a.status === 'present').length || 0;
  const lateDays = studentData?.attendance.filter((a) => a.status === 'late').length || 0;
  const attendanceRate = totalAttendanceDays > 0 ? Math.round(((presentDays + lateDays * 0.5) / totalAttendanceDays) * 100) : 100;

  // Marks analytics
  const totalTests = studentData?.marks.length || 0;
  const avgMarksPct = totalTests > 0
    ? Math.round(
        studentData!.marks.reduce((sum, m) => sum + (m.maxMarks ? (m.marksObtained / m.maxMarks) * 100 : 0), 0) / totalTests
      )
    : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-chalk-950/80 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-chalk-900 w-full max-w-lg h-[88vh] max-h-[720px] rounded-3xl flex flex-col shadow-2xl border border-chalk-200 dark:border-chalk-800 overflow-hidden text-chalk-800 dark:text-chalk-100"
      >
        {/* Modal Header */}
        <header className="h-16 border-b border-chalk-200 dark:border-chalk-800 flex items-center justify-between px-5 sm:px-6 bg-chalk-50 dark:bg-chalk-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-base shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-chalk-950 dark:text-chalk-50 font-extrabold text-base sm:text-lg uppercase tracking-tight">
                Student <span className="text-emerald-600 dark:text-emerald-400">Corner</span>
              </span>
            </div>
            {isAuthenticated && (
              <span className="hidden sm:inline-flex bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Logged In
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-chalk-400 hover:text-chalk-600 dark:hover:text-chalk-200 hover:bg-chalk-100 dark:hover:bg-chalk-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {!isAuthenticated ? (
            /* LOGIN CARD */
            <div className="flex-1 flex items-center justify-center bg-chalk-50/50 dark:bg-chalk-950/40 p-4 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-sm bg-white dark:bg-chalk-900 p-6 sm:p-8 rounded-2xl shadow-xl border border-chalk-200/80 dark:border-chalk-800 flex flex-col"
              >
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4 mx-auto border border-emerald-200 dark:border-emerald-800/60">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-center text-xl font-black text-chalk-950 dark:text-chalk-50 uppercase mb-1">
                  Student <span className="text-emerald-600 dark:text-emerald-400">Sign In</span>
                </h2>
                <p className="text-center text-xs text-chalk-500 dark:text-chalk-400 mb-5 leading-relaxed">
                  Enter your Student ID and Password provided by Rehman Sir / Admin to view your attendance, test marks, and batch schedule.
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-chalk-600 dark:text-chalk-400 mb-1.5">
                      Student ID / Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. aarav12"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-chalk-200 dark:border-chalk-700 bg-transparent text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
                      required
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-chalk-600 dark:text-chalk-400 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-chalk-200 dark:border-chalk-700 bg-transparent text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-chalk-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingAuth ? 'Signing In…' : 'Access Student Corner'}
                  </button>
                </form>
              </motion.div>
            </div>
          ) : (
            /* STUDENT DASHBOARD */
            <>
              {/* Student header bar */}
              <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border-b border-emerald-200/50 dark:border-emerald-800/40 px-5 py-3.5 shrink-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                      {studentData?.student.name?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-chalk-950 dark:text-chalk-50 text-sm truncate">
                        {studentData?.student.name}
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 truncate font-medium">
                        @{studentData?.student.username} • {studentData?.student.courseName || studentData?.student.batchId}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    title="Log out of Student Corner"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-chalk-200 dark:border-chalk-800 px-3 bg-chalk-50/40 dark:bg-chalk-950/30 shrink-0">
                {[
                  { id: 'profile', label: 'My Course', icon: User },
                  { id: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
                  { id: 'marks', label: 'Marks', icon: BookOpenCheck },
                  { id: 'calendar', label: 'Schedule', icon: CalendarDays },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as typeof activeTab)}
                    className={`flex-1 py-3 px-1 text-center text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative flex items-center justify-center gap-1.5 ${
                      activeTab === id
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-chalk-500 dark:text-chalk-400 hover:text-chalk-700 dark:hover:text-chalk-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                    {activeTab === id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {activeTab === 'profile' && studentData && (
                  <div className="space-y-4">
                    {/* Course Card */}
                    <div className="bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 p-4 sm:p-5 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          Enrolled Batch
                        </span>
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Active Student
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-chalk-950 dark:text-chalk-50">
                        {studentData.student.courseName || studentData.student.batchId}
                      </h4>
                      <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                        {studentData.student.courseDays && (
                          <div className="flex items-center gap-1.5 text-chalk-600 dark:text-chalk-300">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{studentData.student.courseDays}</span>
                          </div>
                        )}
                        {studentData.student.courseTiming && (
                          <div className="flex items-center gap-1.5 text-chalk-600 dark:text-chalk-300">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{studentData.student.courseTiming}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Profile Information */}
                    <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200 dark:border-chalk-800 p-5 shadow-xs">
                      <h3 className="text-xs font-bold text-chalk-950 dark:text-chalk-50 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-600" /> Student Profile
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-chalk-400 text-xs uppercase tracking-wide">Full Name</p>
                          <p className="font-semibold text-chalk-950 dark:text-chalk-50">{studentData.student.name}</p>
                        </div>
                        <div>
                          <p className="text-chalk-400 text-xs uppercase tracking-wide">Student ID</p>
                          <p className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">@{studentData.student.username}</p>
                        </div>
                        <div>
                          <p className="text-chalk-400 text-xs uppercase tracking-wide">Class</p>
                          <p className="font-semibold text-chalk-950 dark:text-chalk-50">{studentData.student.class}</p>
                        </div>
                        <div>
                          <p className="text-chalk-400 text-xs uppercase tracking-wide">Contact</p>
                          <p className="font-semibold text-chalk-950 dark:text-chalk-50">{studentData.student.phone || '—'}</p>
                        </div>
                        <div>
                          <p className="text-chalk-400 text-xs uppercase tracking-wide">Email</p>
                          <p className="font-semibold text-chalk-950 dark:text-chalk-50 truncate">{studentData.student.email || '—'}</p>
                        </div>
                        <div>
                          <p className="text-chalk-400 text-xs uppercase tracking-wide">Enrolled Since</p>
                          <p className="font-semibold text-chalk-950 dark:text-chalk-50">
                            {studentData.student.createdAt ? new Date(studentData.student.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'attendance' && studentData && (
                  <div className="space-y-4">
                    {/* Summary statistics */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-3">
                        <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase">Rate</p>
                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{attendanceRate}%</p>
                      </div>
                      <div className="bg-chalk-50 dark:bg-chalk-950 border border-chalk-200 dark:border-chalk-800 rounded-2xl p-3">
                        <p className="text-[11px] font-semibold text-chalk-500 uppercase">Present</p>
                        <p className="text-xl font-bold text-chalk-900 dark:text-chalk-100 mt-0.5">{presentDays}</p>
                      </div>
                      <div className="bg-chalk-50 dark:bg-chalk-950 border border-chalk-200 dark:border-chalk-800 rounded-2xl p-3">
                        <p className="text-[11px] font-semibold text-chalk-500 uppercase">Total Classes</p>
                        <p className="text-xl font-bold text-chalk-900 dark:text-chalk-100 mt-0.5">{totalAttendanceDays}</p>
                      </div>
                    </div>

                    {studentData.attendance.length === 0 ? (
                      <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-dashed border-chalk-200 dark:border-chalk-800 p-10 text-center">
                        <CalendarCheck2 className="mx-auto h-8 w-8 text-chalk-400" />
                        <p className="mt-2 text-chalk-800 dark:text-chalk-200 font-medium">No attendance recorded yet</p>
                        <p className="text-xs text-chalk-400 mt-1">Rehman Sir will mark your attendance after each batch class.</p>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200 dark:border-chalk-800 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-chalk-200 dark:border-chalk-800 bg-chalk-50 dark:bg-chalk-950 text-left uppercase tracking-wider text-chalk-500">
                                <th className="px-4 py-2.5 font-semibold">Date</th>
                                <th className="px-4 py-2.5 font-semibold">Status</th>
                                <th className="px-4 py-2.5 font-semibold text-right">Recorded</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-chalk-100 dark:divide-chalk-800">
                              {studentData.attendance.map((a) => (
                                <tr key={a.id} className="hover:bg-chalk-50/50 dark:hover:bg-chalk-950/50">
                                  <td className="px-4 py-2.5 font-medium text-chalk-800 dark:text-chalk-200">
                                    {new Date(a.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                      a.status === 'present'
                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                        : a.status === 'late'
                                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                    }`}>
                                      {a.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2.5 text-right text-chalk-400">
                                    {new Date(a.markedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                  </td>
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
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-3">
                        <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase">Average Score</p>
                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{avgMarksPct}%</p>
                      </div>
                      <div className="bg-chalk-50 dark:bg-chalk-950 border border-chalk-200 dark:border-chalk-800 rounded-2xl p-3">
                        <p className="text-[11px] font-semibold text-chalk-500 uppercase">Tests Evaluated</p>
                        <p className="text-xl font-bold text-chalk-900 dark:text-chalk-100 mt-0.5">{totalTests}</p>
                      </div>
                    </div>

                    {studentData.marks.length === 0 ? (
                      <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-dashed border-chalk-200 dark:border-chalk-800 p-10 text-center">
                        <BookOpenCheck className="mx-auto h-8 w-8 text-chalk-400" />
                        <p className="mt-2 text-chalk-800 dark:text-chalk-200 font-medium">No test scores published yet</p>
                        <p className="text-xs text-chalk-400 mt-1">Your chapter-wise test and DPP scores will appear here after evaluation.</p>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200 dark:border-chalk-800 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-chalk-200 dark:border-chalk-800 bg-chalk-50 dark:bg-chalk-950 text-left uppercase tracking-wider text-chalk-500">
                                <th className="px-4 py-2.5 font-semibold">Test Name</th>
                                <th className="px-4 py-2.5 font-semibold">Date</th>
                                <th className="px-4 py-2.5 font-semibold text-right">Score</th>
                                <th className="px-4 py-2.5 font-semibold text-right">%</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-chalk-100 dark:divide-chalk-800">
                              {studentData.marks.map((m) => {
                                const pct = m.maxMarks ? Math.round((m.marksObtained / m.maxMarks) * 100) : 0;
                                return (
                                  <tr key={m.id} className="hover:bg-chalk-50/50 dark:hover:bg-chalk-950/50">
                                    <td className="px-4 py-2.5">
                                      <p className="font-semibold text-chalk-900 dark:text-chalk-100">{m.testName}</p>
                                      {m.subject && <p className="text-[10px] text-chalk-400">{m.subject}</p>}
                                    </td>
                                    <td className="px-4 py-2.5 text-chalk-500">
                                      {new Date(m.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                    </td>
                                    <td className="px-4 py-2.5 text-right font-medium text-chalk-800 dark:text-chalk-200">
                                      {m.marksObtained} / {m.maxMarks}
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                        pct >= 75
                                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                          : pct >= 40
                                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
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
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-chalk-950 dark:text-chalk-50 uppercase tracking-wider mb-2">
                      Batch Notices & Upcoming Tests
                    </h4>
                    {studentData.calendar.length === 0 ? (
                      <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-dashed border-chalk-200 dark:border-chalk-800 p-10 text-center">
                        <CalendarDays className="mx-auto h-8 w-8 text-chalk-400" />
                        <p className="mt-2 text-chalk-800 dark:text-chalk-200 font-medium">No upcoming events or tests</p>
                        <p className="text-xs text-chalk-400 mt-1">Check back later for test schedules and announcements.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {studentData.calendar.map((e) => (
                          <div
                            key={e.id}
                            className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200 dark:border-chalk-800 p-3.5 flex items-start gap-3 shadow-xs"
                          >
                            <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                              <span className="font-bold text-sm leading-none">{e.date?.slice(8, 10)}</span>
                              <span className="text-[9px] uppercase font-bold mt-0.5 leading-none">{e.date?.slice(5, 7)}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-xs sm:text-sm text-chalk-950 dark:text-chalk-50">{e.title}</p>
                              {e.description && (
                                <p className="text-xs text-chalk-500 dark:text-chalk-400 mt-0.5 leading-relaxed">
                                  {e.description}
                                </p>
                              )}
                              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                                {new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                {e.endDate && e.endDate !== e.date ? ` – ${new Date(e.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}` : ''}
                              </p>
                            </div>
                          </div>
                        ))}
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
