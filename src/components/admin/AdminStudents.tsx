import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  UserPlus,
  Search,
  Trash2,
  Pencil,
  RefreshCw,
  Users,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Copy,
  Check,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import { batchLabel, getBatchesFromCourses, ResolvedBatch } from '../../lib/batches';
import type { Course, Student } from '../../types';

interface Props {
  onAuthError: () => void;
  onStudentChange?: () => void;
  courses?: Course[];
}

const emptyForm = {
  username: '',
  name: '',
  password: '',
  class: '',
  batchId: '',
  phone: '',
  email: '',
};

export default function AdminStudents({ onAuthError, onStudentChange, courses }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [apiBatches, setApiBatches] = useState<ResolvedBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyLoginDetails = (s: Student) => {
    const courseTitle = batchLabel(s.batchId, courses);
    const portalUrl = `${window.location.origin}/student`;
    const text = `🎓 *REHMAN MATHEMATICS CLASSES*\n*Student Corner Login Credentials*\n\n👤 *Student Name:* ${s.name}\n🆔 *Student ID:* ${s.username}\n📚 *Course:* ${courseTitle}\n\n🌐 *Portal Login:* ${portalUrl}\n\n_(Use the password given by Rehman Sir / Institute to sign in to check your attendance, test marks, and batch schedule)_`;
    navigator.clipboard.writeText(text);
    setCopiedId(s.id);
    flash(`Copied login credentials for ${s.name}!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const shareOnWhatsApp = (s: Student) => {
    const courseTitle = batchLabel(s.batchId, courses);
    const portalUrl = `${window.location.origin}/student`;
    const text = encodeURIComponent(
      `🎓 *REHMAN MATHEMATICS CLASSES*\n*Student Corner Login Credentials*\n\n👤 *Student Name:* ${s.name}\n🆔 *Student ID:* ${s.username}\n📚 *Course:* ${courseTitle}\n\n🌐 *Portal Login:* ${portalUrl}\n\n_(Use the password given by Rehman Sir / Institute to sign in to check your attendance, test marks, and batch schedule)_`
    );
    const rawPhone = (s.phone || '').replace(/\D/g, '');
    const phone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const url = phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${text}` : `https://api.whatsapp.com/send?text=${text}`;
    window.open(url, '_blank');
  };

  // Compute available batches dynamically from courses passed from AdminPanel or loaded via API
  const activeBatches: ResolvedBatch[] = useMemo(() => {
    if (courses && courses.length > 0) {
      return getBatchesFromCourses(courses);
    }
    if (apiBatches.length > 0) {
      return apiBatches;
    }
    return getBatchesFromCourses();
  }, [courses, apiBatches]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.get('/api/admin/students');
      setStudents(res.students || []);
      if (Array.isArray(res.batches) && res.batches.length > 0) {
        setApiBatches(res.batches.map((b: any) => ({
          id: b.id,
          name: b.name || b.id,
          days: b.days || '',
          timing: b.timing || '',
          className: b.class || 'General',
        })));
      }
    } catch (err: any) {
      if (err?.status === 401) return onAuthError();
      setError(err?.message || 'Could not load students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3500);
  };

  const filtered = students.filter((s) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.username.toLowerCase().includes(q) ||
      (s.phone || '').includes(q);
    const matchesBatch = !batchFilter || s.batchId === batchFilter;
    return matchesQuery && matchesBatch;
  });

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    activeBatches.forEach((b) => {
      map[b.id] = students.filter((s) => s.batchId === b.id).length;
    });
    return map;
  }, [activeBatches, students]);

  const openCreate = () => {
    const defaultBatch = activeBatches[0];
    setForm({
      ...emptyForm,
      batchId: defaultBatch?.id || '',
      class: defaultBatch?.className || 'Class XII',
    });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (s: Student) => {
    setForm({
      username: s.username,
      name: s.name,
      password: '',
      class: s.class,
      batchId: s.batchId,
      phone: s.phone || '',
      email: s.email || '',
    });
    setEditing(s);
    setShowForm(true);
  };

  const onCourseSelect = (selectedBatchId: string) => {
    const selected = activeBatches.find((b) => b.id === selectedBatchId);
    setForm((f) => ({
      ...f,
      batchId: selectedBatchId,
      class: selected?.className || f.class || 'General',
    }));
  };

  const submit = async () => {
    if (!form.name.trim() || (!editing && !form.username.trim())) {
      setError('Please provide student name and username/ID.');
      return;
    }
    if (!editing && form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!form.batchId) {
      setError('Please select a course for the student.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      if (editing) {
        const body: any = {
          name: form.name.trim(),
          class: form.class.trim() || 'General',
          batchId: form.batchId,
          phone: form.phone.trim(),
          email: form.email.trim(),
        };
        if (form.password) body.password = form.password;
        await adminApi.put(`/api/admin/students/${editing.id}`, body);
        flash('Student updated successfully.');
      } else {
        await adminApi.post('/api/admin/students', {
          username: form.username.trim().toLowerCase(),
          name: form.name.trim(),
          password: form.password,
          class: form.class.trim() || 'General',
          batchId: form.batchId,
          phone: form.phone.trim(),
          email: form.email.trim(),
        });
        flash('Student added successfully.');
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditing(null);
      load();
      onStudentChange?.();
    } catch (err: any) {
      if (err?.status === 401) return onAuthError();
      setError(err?.message || 'Could not save student.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s: Student) => {
    if (!window.confirm(`Remove student ${s.name} (@${s.username})? This will delete their attendance and marks too.`)) return;
    if (deleting === s.id) return;
    setDeleting(s.id);
    setError('');
    try {
      await adminApi.del(`/api/admin/students/${s.id}`);
      flash('Student removed.');
      load();
      onStudentChange?.();
    } catch (err: any) {
      if (err?.status === 401) return onAuthError();
      setError(err?.message || 'Could not remove student.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-line">
        <div>
          <h3 className="text-base font-semibold text-ink uppercase tracking-wider flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" /> Students ({students.length})
          </h3>
          <p className="text-xs text-ink-faint">
            Add learners, assign them to active courses from the Courses section, and set their login passwords.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="bg-surface-muted text-ink font-bold text-xs uppercase tracking-wider px-3 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-line/40 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            onClick={openCreate}
            className="bg-accent text-on-accent font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-accent-strong transition-all cursor-pointer shadow-xs"
          >
            <UserPlus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {notice}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Course & Batch summary chips synced directly with Admin Courses */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-ink-faint uppercase tracking-wider">
            Active Courses ({activeBatches.length})
          </span>
          {batchFilter && (
            <button
              onClick={() => setBatchFilter('')}
              className="text-xs text-accent hover:underline cursor-pointer"
            >
              Clear course filter
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {activeBatches.map((b) => {
            const isSelected = batchFilter === b.id;
            const count = counts[b.id] || 0;
            return (
              <button
                key={b.id}
                onClick={() => setBatchFilter(isSelected ? '' : b.id)}
                className={`rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-accent bg-accent-soft shadow-xs ring-1 ring-accent'
                    : 'border-line bg-surface hover:border-line-strong hover:bg-surface-muted/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                    {b.className}
                  </span>
                  <span className="font-display text-lg font-bold text-ink">
                    {count} {count === 1 ? 'student' : 'students'}
                  </span>
                </div>
                <p className="text-sm font-bold text-ink mt-1 truncate" title={b.name}>
                  {b.name}
                </p>
                <p className="text-xs text-ink-faint mt-0.5 truncate">
                  {b.days} {b.timing ? `• ${b.timing}` : ''}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search student by name, username (@id), or phone…"
            className="w-full rounded-xl border border-line bg-canvas pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <select
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          className="rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm outline-none focus:border-accent"
        >
          <option value="">All Courses ({students.length} students)</option>
          {activeBatches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.className})
            </option>
          ))}
        </select>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="rounded-2xl border-2 border-accent/40 bg-surface p-5 space-y-4 overflow-hidden shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <h4 className="text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-accent" />
                {editing ? `Edit Student: ${editing.name}` : 'Register New Student'}
              </h4>
              <p className="text-xs text-ink-faint mt-0.5">
                The student ID and password you provide here will allow the student to sign in at the Student Corner.
              </p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-ink-faint hover:text-ink cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name *">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
                placeholder="e.g. Aarav Sharma"
                autoFocus
              />
            </Field>

            <Field label="Student ID / Username * (Used by student to log in)">
              <input
                value={form.username}
                disabled={!!editing}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, '') })}
                className={`${inputCls} ${editing ? 'bg-surface-muted cursor-not-allowed text-ink-faint' : ''}`}
                autoCapitalize="none"
                placeholder="e.g. aarav12 or roll_101"
              />
            </Field>

            <Field label={editing ? 'Change Password (leave blank to keep current)' : 'Login Password * (Min 6 chars)'}>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`${inputCls} pl-9`}
                  placeholder={editing ? 'Leave blank to keep password' : 'Give this password to student'}
                />
              </div>
            </Field>

            <Field label="Enrolled Course / Batch * (From Course Section)">
              <select
                value={form.batchId}
                onChange={(e) => onCourseSelect(e.target.value)}
                className={inputCls}
              >
                <option value="">-- Choose Course --</option>
                {activeBatches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.className}{b.days ? ` • ${b.days}` : ''})
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Class / Grade *">
              <input
                value={form.class}
                onChange={(e) => setForm({ ...form, class: e.target.value })}
                className={inputCls}
                placeholder="e.g. Class XII, Class XI, Class X"
              />
            </Field>

            <Field label="Phone / WhatsApp (optional)">
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputCls}
                placeholder="e.g. 9876543210"
              />
            </Field>

            <Field label="Student Email (optional)">
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputCls}
                placeholder="student@example.com"
              />
            </Field>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={submit}
              disabled={saving || !form.name.trim() || (!editing && !form.username.trim()) || (!editing && form.password.length < 6) || !form.batchId}
              className="bg-accent text-on-accent font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-accent-strong disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
            >
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create & Enroll Student'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-surface-muted text-ink-soft font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-line/40 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Student list */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-ink-faint text-sm">
          <RefreshCw className="h-5 w-5 animate-spin" /> Loading students…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-ink-faint" strokeWidth={1.5} />
          <p className="mt-3 text-ink font-medium">
            {students.length === 0 ? 'No students enrolled yet' : 'No students found matching your search'}
          </p>
          <p className="text-sm text-ink-faint mt-1">
            {students.length === 0
              ? 'Click "Add Student" above to enroll your first student into a course.'
              : 'Try clearing the search or course filter.'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-line bg-surface-muted text-left text-xs uppercase tracking-wider text-ink-faint">
                  <th className="px-5 py-3.5 font-semibold">Student Name & ID</th>
                  <th className="px-5 py-3.5 font-semibold">Enrolled Course</th>
                  <th className="px-5 py-3.5 font-semibold">Class</th>
                  <th className="px-5 py-3.5 font-semibold">Contact</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((s) => {
                  const courseTitle = batchLabel(s.batchId, courses);
                  return (
                    <tr key={s.id} className="hover:bg-surface-muted/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-ink font-semibold">{s.name}</p>
                        <p className="text-xs text-accent font-mono font-medium">@{s.username}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center rounded-lg bg-accent-soft border border-accent/20 px-2.5 py-1 text-xs font-semibold text-accent">
                          {courseTitle}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-ink-soft font-medium">{s.class}</td>
                      <td className="px-5 py-3.5 text-ink-faint text-xs">
                        {s.phone ? <span className="text-ink font-medium">{s.phone}</span> : '—'}
                        {s.email && <span className="block text-ink-faint">{s.email}</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => copyLoginDetails(s)}
                            className="rounded-lg p-2 text-ink-soft hover:text-accent hover:bg-accent-soft transition-colors cursor-pointer"
                            title="Copy Student Login Details (ID & URL)"
                          >
                            {copiedId === s.id ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => shareOnWhatsApp(s)}
                            className="rounded-lg p-2 text-ink-soft hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                            title="Send Login Details via WhatsApp"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEdit(s)}
                            className="rounded-lg p-2 text-ink-soft hover:text-accent hover:bg-accent-soft transition-colors cursor-pointer"
                            title="Edit student"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => remove(s)}
                            disabled={deleting === s.id}
                            className="rounded-lg p-2 text-ink-soft hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            title="Remove student"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
}

const inputCls =
  'w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm outline-none focus:border-accent text-ink';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-soft mb-1">{label}</label>
      {children}
    </div>
  );
}
