import type { BatchId, Course } from '../types';

export const BATCH_IDS: BatchId[] = [
  'MON_TUE_WED_11',
  'MON_TUE_WED_12',
  'FRI_SAT_SUN_11',
  'FRI_SAT_SUN_12',
];

export const BATCH_INFO: Record<string, { name: string; days: string; className: string }> = {
  MON_TUE_WED_11: { name: 'Mon-Tue-Wed | 11th', days: 'Mon, Tue, Wed', className: '11th' },
  MON_TUE_WED_12: { name: 'Mon-Tue-Wed | 12th', days: 'Mon, Tue, Wed', className: '12th' },
  FRI_SAT_SUN_11: { name: 'Fri-Sat-Sun | 11th', days: 'Fri, Sat, Sun', className: '11th' },
  FRI_SAT_SUN_12: { name: 'Fri-Sat-Sun | 12th', days: 'Fri, Sat, Sun', className: '12th' },
};

export interface ResolvedBatch {
  id: string;
  name: string;
  days: string;
  timing?: string;
  className: string;
  subjects?: string;
}

export function getBatchesFromCourses(courses?: Course[]): ResolvedBatch[] {
  if (Array.isArray(courses) && courses.length > 0) {
    return courses.map((c) => ({
      id: c.id,
      name: c.name,
      days: c.days || 'Flexible',
      timing: c.timing || '',
      className: c.targetClass || c.category || 'General',
      subjects: c.subjects || '',
    }));
  }
  return BATCH_IDS.map((id) => ({
    id,
    name: BATCH_INFO[id]?.name || id,
    days: BATCH_INFO[id]?.days || '',
    className: BATCH_INFO[id]?.className || '11th',
  }));
}

export function batchLabel(id?: string, courses?: Course[]) {
  if (!id) return 'Not assigned';
  if (Array.isArray(courses)) {
    const found = courses.find((c) => c.id === id);
    if (found) return found.name;
  }
  if (BATCH_INFO[id]) return BATCH_INFO[id].name;
  return id;
}

export function formatDate(iso?: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
