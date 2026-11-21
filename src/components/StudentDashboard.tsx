import { useState, useEffect, FormEvent, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  LogOut,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  Home,
  LayoutDashboard,
  BookOpen,
  CalendarCheck2,
  ClipboardList,
  CalendarDays,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Calendar,
  GraduationCap,
  BarChart3,
  Users,
  CheckCircle2,
  XCircle,
  Menu,
  X,
  FileText,
  HelpCircle,
  Send,
  Sparkles,
} from 'lucide-react';
import { studentApi, setStudentToken, getStudentToken, clearStudentToken } from '../lib/api';
import type { StudentMe } from '../types';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

type NavTab = 'dashboard' | 'course' | 'attendance' | 'scores' | 'schedule' | 'announcements' | 'resources' | 'doubts';

const NAV_ITEMS: { id: NavTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'course', label: 'My Course', icon: BookOpen },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
  { id: 'scores', label: 'Test Scores', icon: ClipboardList },
  { id: 'schedule', label: 'Schedule', icon: CalendarDays },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'resources', label: 'Study Resources', icon: FileText },
  { id: 'doubts', label: 'Doubt Desk', icon: HelpCircle },
];

function formatDate(dateStr: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(dateStr).toLocaleDateString('en-IN', opts ?? { day: '2-digit', month: 'short', year: 'numeric' });
}

function statusColor(status: string) {
  if (status === 'present')
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
  if (status === 'late')
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300';
  return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300';
}

function pctColor(pct: number) {
  if (pct >= 75) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
  if (pct >= 40) return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300';
  return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300';
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function StudentDashboard() {
  /* Auth state */
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Dashboard state */
  const [studentData, setStudentData] = useState<StudentMe | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ---- Session bootstrap ---- */
  useEffect(() => {
    const token = getStudentToken();
    if (!token) {
      setIsCheckingSession(false);
      return;
    }
    studentApi
      .session()
      .then((res: any) => {
        if (res.authenticated && res.studentId) {
          setIsAuthenticated(true);
          return studentApi.me().then((data: any) => {
            if (data.student) setStudentData(data as StudentMe);
          });
        } else {
          clearStudentToken();
        }
      })
      .catch(() => clearStudentToken())
      .finally(() => setIsCheckingSession(false));
  }, []);

  /* ---- Login handler ---- */
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setIsSubmitting(true);
    setAuthError('');
    try {
      const res: any = await studentApi.login({ username: username.trim().toLowerCase(), password });
      if (res.success && res.token) {
        setStudentToken(res.token);
        setIsAuthenticated(true);
        setPassword('');
        setUsername('');
        const meData: any = await studentApi.me();
        if (meData.student) setStudentData(meData as StudentMe);
      } else {
        setAuthError(res.error || 'Incorrect Student ID or password.');
      }
    } catch {
      setAuthError('Server connection failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    clearStudentToken();
    setIsAuthenticated(false);
    setStudentData(null);
    setAuthError('');
    setActiveTab('dashboard');
  };

  /* ---- Computed analytics ---- */
  const totalClasses = studentData?.attendance.length ?? 0;
  const presentDays = studentData?.attendance.filter((a) => a.status === 'present').length ?? 0;
  const lateDays = studentData?.attendance.filter((a) => a.status === 'late').length ?? 0;
  const attendancePct = totalClasses > 0 ? Math.round(((presentDays + lateDays * 0.5) / totalClasses) * 100) : 100;

  const totalTests = studentData?.marks.length ?? 0;
  const avgScore =
    totalTests > 0
      ? Math.round(
          studentData!.marks.reduce((s, m) => s + (m.maxMarks ? (m.marksObtained / m.maxMarks) * 100 : 0), 0) /
            totalTests,
        )
      : 0;

  const announcements = useMemo(
    () =>
      (studentData?.calendar ?? []).filter(
        (ev) => !ev.batchId && (!ev.class || ev.class === 'all'),
      ),
    [studentData],
  );

  const upcomingEvents = useMemo(() => {
    const now = new Date().toISOString().slice(0, 10);
    return (studentData?.calendar ?? [])
      .filter((ev) => ev.date >= now)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [studentData]);

  const nextEvent = upcomingEvents[0] ?? null;

  /* ---- Splash while checking token ---- */
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-paper dark:bg-chalk-950 flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-4">
            R
          </div>
          <p className="text-sm text-chalk-500 dark:text-chalk-400 animate-pulse">Loading student portal…</p>
        </motion.div>
      </div>
    );
  }

  /* ================================================================ */
  /*  LOGIN SCREEN                                                     */
  /* ================================================================ */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-paper dark:bg-chalk-950 font-sans flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-paper/80 dark:bg-chalk-950/80 backdrop-blur-xl border-b border-chalk-200/70 dark:border-chalk-800/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-chalk-600 dark:text-chalk-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-chalk-950 dark:bg-chalk-100 flex items-center justify-center text-white dark:text-chalk-950 font-mono font-bold text-sm">
                R
              </div>
              <span className="text-sm font-bold tracking-tight text-chalk-950 dark:text-chalk-50 hidden sm:inline">
                REHMAN <span className="text-emerald-600 dark:text-emerald-400">MATHS</span>
              </span>
            </div>
          </div>
        </header>

        {/* Login body */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 sm:py-20">
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="w-full max-w-md"
          >
            {/* Brand hero */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-5">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-chalk-950 dark:text-chalk-50 uppercase tracking-tight">
                Student <span className="text-emerald-600 dark:text-emerald-400">Portal</span>
              </h1>
              <p className="mt-2 text-sm text-chalk-500 dark:text-chalk-400 max-w-sm mx-auto leading-relaxed">
                Sign in with your Student ID and Password to view attendance, test marks and schedule.
              </p>
            </div>

            {/* Card */}
            <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200 dark:border-chalk-800 p-6 sm:p-8 shadow-xl">
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Username */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-chalk-600 dark:text-chalk-400 mb-1.5">
                    Student ID / Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. aarav12"
                    className="w-full px-4 py-3 rounded-xl border border-chalk-200 dark:border-chalk-700 bg-transparent text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors text-chalk-900 dark:text-chalk-100"
                    required
                    autoFocus
                  />
                </div>

                {/* Password */}
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
                      className="w-full px-4 py-3 rounded-xl border border-chalk-200 dark:border-chalk-700 bg-transparent text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors pr-11 text-chalk-900 dark:text-chalk-100"
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

                {/* Error */}
                <AnimatePresence>
                  {authError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-medium bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg border border-rose-200/50 dark:border-rose-800/50"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  {isSubmitting ? 'Signing In…' : 'Sign In to Portal'}
                </button>
              </form>
            </div>

            <p className="text-center mt-5 text-xs text-chalk-400 dark:text-chalk-500">
              Credentials are provided by Rehman Sir or the Admin.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  DASHBOARD (authenticated)                                        */
  /* ================================================================ */

  const student = studentData?.student;
  const avatarInitial = student?.name?.charAt(0).toUpperCase() || 'S';

  /* ---- Tab content renderer ---- */
  const renderTabContent = () => {
    switch (activeTab) {
      /* ---------- DASHBOARD OVERVIEW ---------- */
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Welcome */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="text-xl sm:text-2xl font-black text-chalk-950 dark:text-chalk-50">
                Welcome back, <span className="text-emerald-600 dark:text-emerald-400">{student?.name?.split(' ')[0] ?? 'Student'}</span>!
              </h2>
              <p className="text-sm text-chalk-500 dark:text-chalk-400 mt-1">
                Here&apos;s a quick overview of your academic progress.
              </p>
            </motion.div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Attendance', value: `${attendancePct}%`, icon: CalendarCheck2, accent: 'emerald' },
                { label: 'Average Score', value: `${avgScore}%`, icon: TrendingUp, accent: 'blue' },
                { label: 'Total Classes', value: `${totalClasses}`, icon: Users, accent: 'violet' },
                { label: 'Tests Taken', value: `${totalTests}`, icon: ClipboardList, accent: 'amber' },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 * idx }}
                  className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200 dark:border-chalk-800 p-4 sm:p-5 shadow-xs"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                    stat.accent === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' :
                    stat.accent === 'blue' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400' :
                    stat.accent === 'violet' ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400' :
                    'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                  }`}>
                    <stat.icon className="w-4.5 h-4.5" />
                  </div>
                  <p className="text-2xl font-bold text-chalk-950 dark:text-chalk-50">{stat.value}</p>
                  <p className="text-xs text-chalk-500 dark:text-chalk-400 font-medium mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Next event */}
            {nextEvent && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 p-5 shadow-xs"
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">
                  Next Upcoming Event
                </p>
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <span className="font-bold text-sm leading-none">{nextEvent.date?.slice(8, 10)}</span>
                    <span className="text-[9px] uppercase font-bold mt-0.5 leading-none">
                      {new Date(nextEvent.date).toLocaleDateString('en-IN', { month: 'short' })}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-chalk-950 dark:text-chalk-50">{nextEvent.title}</p>
                    {nextEvent.description && (
                      <p className="text-xs text-chalk-500 dark:text-chalk-400 mt-0.5">{nextEvent.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recent panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Recent attendance */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200 dark:border-chalk-800 shadow-xs overflow-hidden"
              >
                <div className="px-5 py-3.5 border-b border-chalk-200 dark:border-chalk-800 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-chalk-950 dark:text-chalk-50 flex items-center gap-2">
                    <CalendarCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Recent Attendance
                  </h3>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                <div className="divide-y divide-chalk-100 dark:divide-chalk-800">
                  {(studentData?.attendance ?? []).slice(-5).reverse().length === 0 ? (
                    <p className="px-5 py-6 text-xs text-chalk-400 text-center">No attendance records yet.</p>
                  ) : (
                    (studentData?.attendance ?? []).slice(-5).reverse().map((a) => (
                      <div key={a.id} className="px-5 py-3 flex items-center justify-between text-xs">
                        <span className="text-chalk-700 dark:text-chalk-200 font-medium">
                          {formatDate(a.date, { day: '2-digit', month: 'short' })}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusColor(a.status)}`}>
                          {a.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Recent scores */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200 dark:border-chalk-800 shadow-xs overflow-hidden"
              >
                <div className="px-5 py-3.5 border-b border-chalk-200 dark:border-chalk-800 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-chalk-950 dark:text-chalk-50 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Recent Test Scores
                  </h3>
                  <button
                    onClick={() => setActiveTab('scores')}
                    className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                <div className="divide-y divide-chalk-100 dark:divide-chalk-800">
                  {(studentData?.marks ?? []).slice(-3).reverse().length === 0 ? (
                    <p className="px-5 py-6 text-xs text-chalk-400 text-center">No test scores yet.</p>
                  ) : (
                    (studentData?.marks ?? []).slice(-3).reverse().map((m) => {
                      const pct = m.maxMarks ? Math.round((m.marksObtained / m.maxMarks) * 100) : 0;
                      return (
                        <div key={m.id} className="px-5 py-3 flex items-center justify-between text-xs">
                          <div className="min-w-0">
                            <p className="font-semibold text-chalk-900 dark:text-chalk-100 truncate">{m.testName}</p>
                            <p className="text-[10px] text-chalk-400">{m.subject} · {formatDate(m.date, { day: '2-digit', month: 'short' })}</p>
                          </div>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${pctColor(pct)}`}>
                            {m.marksObtained}/{m.maxMarks} ({pct}%)
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        );

      /* ---------- MY COURSE ---------- */
      case 'course':
        return (
          <div className="space-y-5">
            <h2 className="text-lg sm:text-xl font-black text-chalk-950 dark:text-chalk-50 uppercase tracking-tight">
              My <span className="text-emerald-600 dark:text-emerald-400">Course</span>
            </h2>

            {/* Course card */}
            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Enrolled Batch
                </span>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Active Student
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-chalk-950 dark:text-chalk-50">
                {student?.courseName || student?.batchId || '—'}
              </h3>
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                {student?.courseDays && (
                  <div className="flex items-center gap-2 text-chalk-600 dark:text-chalk-300">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{student.courseDays}</span>
                  </div>
                )}
                {student?.courseTiming && (
                  <div className="flex items-center gap-2 text-chalk-600 dark:text-chalk-300">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{student.courseTiming}</span>
                  </div>
                )}
                {student?.courseSubjects && (
                  <div className="flex items-center gap-2 text-chalk-600 dark:text-chalk-300 col-span-2">
                    <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{student.courseSubjects}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile info */}
            <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200 dark:border-chalk-800 p-5 sm:p-6 shadow-xs">
              <h3 className="text-xs font-bold text-chalk-950 dark:text-chalk-50 uppercase tracking-wider mb-5 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" /> Student Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                {[
                  { label: 'Full Name', value: student?.name },
                  { label: 'Student ID', value: `@${student?.username}`, mono: true },
                  { label: 'Class', value: student?.class },
                  { label: 'Phone', value: student?.phone || '—' },
                  { label: 'Email', value: student?.email || '—' },
                  { label: 'Enrolled Since', value: student?.createdAt ? formatDate(student.createdAt) : 'N/A' },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-chalk-400 dark:text-chalk-500 text-xs uppercase tracking-wide mb-0.5">{f.label}</p>
                    <p className={`font-semibold text-chalk-950 dark:text-chalk-50 ${f.mono ? 'font-mono text-emerald-600 dark:text-emerald-400' : ''}`}>
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      /* ---------- ATTENDANCE ---------- */
      case 'attendance':
        return (
          <div className="space-y-5">
            <h2 className="text-lg sm:text-xl font-black text-chalk-950 dark:text-chalk-50 uppercase tracking-tight">
              <span className="text-emerald-600 dark:text-emerald-400">Attendance</span> Records
            </h2>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-4 text-center">
                <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase">Rate</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{attendancePct}%</p>
              </div>
              <div className="bg-chalk-50 dark:bg-chalk-950 border border-chalk-200 dark:border-chalk-800 rounded-2xl p-4 text-center">
                <p className="text-[11px] font-semibold text-chalk-500 dark:text-chalk-400 uppercase">Present</p>
                <p className="text-2xl font-bold text-chalk-900 dark:text-chalk-100 mt-1">{presentDays}</p>
              </div>
              <div className="bg-chalk-50 dark:bg-chalk-950 border border-chalk-200 dark:border-chalk-800 rounded-2xl p-4 text-center">
                <p className="text-[11px] font-semibold text-chalk-500 dark:text-chalk-400 uppercase">Total</p>
                <p className="text-2xl font-bold text-chalk-900 dark:text-chalk-100 mt-1">{totalClasses}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200 dark:border-chalk-800 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-chalk-700 dark:text-chalk-200">Attendance Progress</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{attendancePct}%</span>
              </div>
              <div className="w-full h-3 bg-chalk-100 dark:bg-chalk-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${attendancePct}%` }}
                  transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                  className={`h-full rounded-full ${
                    attendancePct >= 75 ? 'bg-emerald-500' : attendancePct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                />
              </div>
              <div className="flex items-center gap-4 mt-3 text-[10px] text-chalk-500 dark:text-chalk-400">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Present: {presentDays}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-500" /> Late: {lateDays}</span>
                <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-rose-500" /> Absent: {totalClasses - presentDays - lateDays}</span>
              </div>
            </div>

            {/* Table */}
            {(studentData?.attendance ?? []).length === 0 ? (
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
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold text-right">Recorded At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-chalk-100 dark:divide-chalk-800">
                      {[...(studentData?.attendance ?? [])].reverse().map((a) => (
                        <tr key={a.id} className="hover:bg-chalk-50/50 dark:hover:bg-chalk-950/50">
                          <td className="px-4 py-3 font-medium text-chalk-800 dark:text-chalk-200">
                            {formatDate(a.date, { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusColor(a.status)}`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-chalk-400">
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
        );

      /* ---------- TEST SCORES ---------- */
      case 'scores':
        return (
          <div className="space-y-5">
            <h2 className="text-lg sm:text-xl font-black text-chalk-950 dark:text-chalk-50 uppercase tracking-tight">
              Test <span className="text-emerald-600 dark:text-emerald-400">Scores</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-4 text-center">
                <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase">Average</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{avgScore}%</p>
              </div>
              <div className="bg-chalk-50 dark:bg-chalk-950 border border-chalk-200 dark:border-chalk-800 rounded-2xl p-4 text-center">
                <p className="text-[11px] font-semibold text-chalk-500 dark:text-chalk-400 uppercase">Tests Taken</p>
                <p className="text-2xl font-bold text-chalk-900 dark:text-chalk-100 mt-1">{totalTests}</p>
              </div>
            </div>

            {(studentData?.marks ?? []).length === 0 ? (
              <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-dashed border-chalk-200 dark:border-chalk-800 p-10 text-center">
                <ClipboardList className="mx-auto h-8 w-8 text-chalk-400" />
                <p className="mt-2 text-chalk-800 dark:text-chalk-200 font-medium">No test scores published yet</p>
                <p className="text-xs text-chalk-400 mt-1">Chapter-wise test and DPP scores will appear here after evaluation.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200 dark:border-chalk-800 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-chalk-200 dark:border-chalk-800 bg-chalk-50 dark:bg-chalk-950 text-left uppercase tracking-wider text-chalk-500">
                        <th className="px-4 py-3 font-semibold">Test</th>
                        <th className="px-4 py-3 font-semibold">Subject</th>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold text-right">Score</th>
                        <th className="px-4 py-3 font-semibold text-right">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-chalk-100 dark:divide-chalk-800">
                      {[...(studentData?.marks ?? [])].reverse().map((m) => {
                        const pct = m.maxMarks ? Math.round((m.marksObtained / m.maxMarks) * 100) : 0;
                        return (
                          <tr key={m.id} className="hover:bg-chalk-50/50 dark:hover:bg-chalk-950/50">
                            <td className="px-4 py-3">
                              <p className="font-semibold text-chalk-900 dark:text-chalk-100">{m.testName}</p>
                              {m.remarks && <p className="text-[10px] text-chalk-400 mt-0.5">{m.remarks}</p>}
                            </td>
                            <td className="px-4 py-3 text-chalk-600 dark:text-chalk-300">{m.subject}</td>
                            <td className="px-4 py-3 text-chalk-500">
                              {formatDate(m.date, { day: '2-digit', month: 'short' })}
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-chalk-800 dark:text-chalk-200">
                              {m.marksObtained}/{m.maxMarks}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${pctColor(pct)}`}>
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
        );

      /* ---------- SCHEDULE ---------- */
      case 'schedule':
        return (
          <div className="space-y-5">
            <h2 className="text-lg sm:text-xl font-black text-chalk-950 dark:text-chalk-50 uppercase tracking-tight">
              <span className="text-emerald-600 dark:text-emerald-400">Schedule</span> & Events
            </h2>

            {(studentData?.calendar ?? []).length === 0 ? (
              <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-dashed border-chalk-200 dark:border-chalk-800 p-10 text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-chalk-400" />
                <p className="mt-2 text-chalk-800 dark:text-chalk-200 font-medium">No upcoming events or tests</p>
                <p className="text-xs text-chalk-400 mt-1">Check back later for test schedules and announcements.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...(studentData?.calendar ?? [])].sort((a, b) => b.date.localeCompare(a.date)).map((ev) => {
                  const isPast = ev.date < new Date().toISOString().slice(0, 10);
                  return (
                    <motion.div
                      key={ev.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200 dark:border-chalk-800 p-4 flex items-start gap-3 shadow-xs ${isPast ? 'opacity-60' : ''}`}
                    >
                      <div className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border ${
                        isPast
                          ? 'bg-chalk-100 dark:bg-chalk-800 text-chalk-500 dark:text-chalk-400 border-chalk-200 dark:border-chalk-700'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
                      }`}>
                        <span className="font-bold text-sm leading-none">{ev.date?.slice(8, 10)}</span>
                        <span className="text-[9px] uppercase font-bold mt-0.5 leading-none">
                          {new Date(ev.date).toLocaleDateString('en-IN', { month: 'short' })}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-chalk-950 dark:text-chalk-50">{ev.title}</p>
                        {ev.description && (
                          <p className="text-xs text-chalk-500 dark:text-chalk-400 mt-0.5 leading-relaxed">{ev.description}</p>
                        )}
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                          {formatDate(ev.date)}
                          {ev.endDate && ev.endDate !== ev.date ? ` – ${formatDate(ev.endDate, { day: '2-digit', month: 'short' })}` : ''}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        );

      /* ---------- ANNOUNCEMENTS ---------- */
      case 'announcements':
        return (
          <div className="space-y-5">
            <h2 className="text-lg sm:text-xl font-black text-chalk-950 dark:text-chalk-50 uppercase tracking-tight">
              <span className="text-emerald-600 dark:text-emerald-400">Announcements</span>
            </h2>

            {announcements.length === 0 ? (
              <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-dashed border-chalk-200 dark:border-chalk-800 p-10 text-center">
                <Megaphone className="mx-auto h-8 w-8 text-chalk-400" />
                <p className="mt-2 text-chalk-800 dark:text-chalk-200 font-medium">No announcements yet</p>
                <p className="text-xs text-chalk-400 mt-1">General notices from admin will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...announcements].sort((a, b) => b.date.localeCompare(a.date)).map((ev) => (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200 dark:border-chalk-800 p-4 shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                        <Megaphone className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-chalk-950 dark:text-chalk-50">{ev.title}</p>
                        {ev.description && (
                          <p className="text-xs text-chalk-500 dark:text-chalk-400 mt-1 leading-relaxed">{ev.description}</p>
                        )}
                        <p className="text-[10px] text-chalk-400 font-semibold mt-2">
                          {formatDate(ev.date)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );
      /* ---------- STUDY RESOURCES ---------- */
      case 'resources':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-chalk-950 dark:text-chalk-50 uppercase tracking-tight">
                Study <span className="text-emerald-600 dark:text-emerald-400">Resources</span> & DPPs
              </h2>
              <p className="text-xs text-chalk-500 dark:text-chalk-400 mt-1">
                Handpicked study materials, formula compendiums, and practice modules for your batch.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Complete Mathematics Formula Cheatsheet',
                  category: 'High-Yield Revision',
                  desc: 'All essential formulas for Calculus, Coordinate Geometry, Trigonometry, Vectors, and Probability compiled by Rehman Sir.',
                  badge: 'Essential',
                },
                {
                  title: 'NCERT & Exemplar Must-Solve Problems',
                  category: 'Board 100/100 Target',
                  desc: 'Shortlisted crucial theorems, tricky miscellaneous exercises, and step-by-step presentation patterns for CBSE/ISC.',
                  badge: 'Boards',
                },
                {
                  title: 'IIT-JEE Mains & Advanced Shortcuts',
                  category: 'Competitive Edge',
                  desc: 'Graphical analysis, transformation techniques, and time-saving calculation methods for 99+ percentile math.',
                  badge: 'JEE Special',
                },
                {
                  title: 'Daily Practice Problems (DPP) Guidelines',
                  category: 'Classwork Protocol',
                  desc: 'Solve every DPP on unruled A4 sheets. Present steps clearly and submit for evaluation every week.',
                  badge: 'Weekly DPP',
                },
              ].map((res) => (
                <div
                  key={res.title}
                  className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200 dark:border-chalk-800 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {res.category}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                        {res.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-chalk-950 dark:text-chalk-50 mb-1.5">{res.title}</h3>
                    <p className="text-xs text-chalk-500 dark:text-chalk-400 leading-relaxed">{res.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-chalk-100 dark:border-chalk-800 flex items-center justify-between text-xs">
                    <span className="text-chalk-400 font-medium">Available in Batch</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Provided in Class
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Preparation tips banner */}
            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 p-5">
              <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Rehman Sir&apos;s 3 Golden Rules for Mathematics
              </h4>
              <ul className="text-xs text-chalk-600 dark:text-chalk-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li><strong>Never read math like history:</strong> Always solve derivations and theorem proofs with pen on paper.</li>
                <li><strong>Analyze test mistakes:</strong> Maintain a dedicated &ldquo;Error Notebook&rdquo; for questions you missed in chapter tests.</li>
                <li><strong>Ask doubts immediately:</strong> Never carry an unresolved conceptual doubt to the next lecture.</li>
              </ul>
            </div>
          </div>
        );

      /* ---------- DOUBT DESK ---------- */
      case 'doubts':
        const doubtMsg = encodeURIComponent(
          `Hello Rehman Sir,\n\nI am ${student?.name || 'Student'} (@${student?.username || ''}) enrolled in ${student?.courseName || student?.class || 'Mathematics'}.\n\nI have a doubt regarding our current chapter in class. Could you please guide me?`
        );
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-chalk-950 dark:text-chalk-50 uppercase tracking-tight">
                1-on-1 <span className="text-emerald-600 dark:text-emerald-400">Doubt Desk</span>
              </h2>
              <p className="text-xs text-chalk-500 dark:text-chalk-400 mt-1">
                Direct access to Rehman Sir for homework, DPP, and test doubt clearance.
              </p>
            </div>

            {/* WhatsApp connect card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-lg">
              <div className="max-w-xl">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
                  Instant Doubt Helpline
                </span>
                <h3 className="text-xl font-black mt-3 mb-2">Ask Rehman Sir on WhatsApp</h3>
                <p className="text-xs text-emerald-50/90 leading-relaxed mb-5">
                  Click below to open a direct WhatsApp chat with Rehman Sir. You can take a clear photo of your question and the step where you are stuck.
                </p>
                <a
                  href={`https://api.whatsapp.com/send?phone=919818816812&text=${doubtMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-emerald-800 font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-50 transition-all shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Message Rehman Sir Directly
                </a>
              </div>
            </div>

            {/* Offline timings */}
            <div className="bg-white dark:bg-chalk-900 rounded-2xl border border-chalk-200 dark:border-chalk-800 p-5 shadow-xs">
              <h3 className="font-bold text-sm text-chalk-950 dark:text-chalk-50 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> In-Person Doubt Sessions at Center
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-chalk-50 dark:bg-chalk-950/60 border border-chalk-200/70 dark:border-chalk-800/70">
                  <p className="font-bold text-chalk-900 dark:text-chalk-100">After Class Doubt Window</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">8:30 PM &ndash; 9:00 PM</p>
                  <p className="text-chalk-500 dark:text-chalk-400 mt-1">Available immediately after every regular batch lecture for individual problem clearing.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-chalk-50 dark:bg-chalk-950/60 border border-chalk-200/70 dark:border-chalk-800/70">
                  <p className="font-bold text-chalk-900 dark:text-chalk-100">Sunday Doubt Clinic</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">10:00 AM &ndash; 1:00 PM</p>
                  <p className="text-chalk-500 dark:text-chalk-400 mt-1">Special weekend clinic dedicated to backlog clearing and advanced problem sets.</p>
                </div>
              </div>
              <p className="text-[11px] text-chalk-400 mt-3">
                Location: D-48 Mahendra Enclave, near Silver Shine School, Shastri Nagar, Ghaziabad.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-paper dark:bg-chalk-950 font-sans flex flex-col">
      {/* ---- Header ---- */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-chalk-900/80 backdrop-blur-xl border-b border-chalk-200/70 dark:border-chalk-800/70 h-16 shrink-0">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-chalk-600 dark:text-chalk-300 hover:bg-chalk-100 dark:hover:bg-chalk-800 transition-colors cursor-pointer"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-chalk-500 dark:text-chalk-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-chalk-300 dark:text-chalk-600 hidden sm:block" />
            <span className="text-xs font-bold text-chalk-950 dark:text-chalk-50 uppercase tracking-wider hidden sm:inline">
              Student Portal
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                {avatarInitial}
              </div>
              <div className="hidden sm:block min-w-0">
                <p className="text-sm font-bold text-chalk-950 dark:text-chalk-50 truncate leading-tight">
                  {student?.name}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate font-medium leading-tight">
                  @{student?.username}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ---- Sidebar (desktop) ---- */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-chalk-200/70 dark:border-chalk-800/70 bg-white/50 dark:bg-chalk-900/50">
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                      : 'text-chalk-600 dark:text-chalk-300 hover:bg-chalk-100 dark:hover:bg-chalk-800 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
          <div className="p-4 border-t border-chalk-200/70 dark:border-chalk-800/70">
            <Link
              to="/"
              className="flex items-center gap-2 text-xs font-semibold text-chalk-500 dark:text-chalk-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back to Website
            </Link>
          </div>
        </aside>

        {/* ---- Sidebar overlay (mobile) ---- */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-chalk-950/40 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-chalk-900 border-r border-chalk-200 dark:border-chalk-800 flex flex-col lg:hidden shadow-2xl"
              >
                <div className="h-16 px-4 flex items-center justify-between border-b border-chalk-200/70 dark:border-chalk-800/70">
                  <span className="text-sm font-bold text-chalk-950 dark:text-chalk-50 uppercase tracking-wider flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                    Student Portal
                  </span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1.5 rounded-lg text-chalk-400 hover:text-chalk-600 dark:hover:text-chalk-200 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                  {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                    const isActive = activeTab === id;
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          setActiveTab(id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                            : 'text-chalk-600 dark:text-chalk-300 hover:bg-chalk-100 dark:hover:bg-chalk-800 border border-transparent'
                        }`}
                      >
                        <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </nav>
                <div className="p-4 border-t border-chalk-200/70 dark:border-chalk-800/70">
                  <Link
                    to="/"
                    className="flex items-center gap-2 text-xs font-semibold text-chalk-500 dark:text-chalk-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Back to Website
                  </Link>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ---- Main content ---- */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 lg:pb-8">
            {renderTabContent()}
          </div>
        </main>
      </div>

      {/* ---- Bottom nav (mobile) ---- */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/90 dark:bg-chalk-900/90 backdrop-blur-xl border-t border-chalk-200/70 dark:border-chalk-800/70 safe-area-pb">
        <div className="flex items-center justify-around h-16 px-1">
          {[
            { id: 'dashboard' as NavTab, label: 'Home', icon: LayoutDashboard },
            { id: 'attendance' as NavTab, label: 'Attendance', icon: CalendarCheck2 },
            { id: 'scores' as NavTab, label: 'Scores', icon: ClipboardList },
            { id: 'resources' as NavTab, label: 'Study', icon: FileText },
            { id: 'doubts' as NavTab, label: 'Doubts', icon: HelpCircle },
          ].map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition-colors cursor-pointer min-w-0 ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-chalk-400 dark:text-chalk-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-[56px]">
                  {label}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition-colors cursor-pointer min-w-0 text-chalk-400 dark:text-chalk-500 hover:text-chalk-700"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">All</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
