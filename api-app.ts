import express from 'express';
import helmet from 'helmet';
import crypto from 'crypto';
import {
  readDataStore,
  writeDataStore,
  createSessionToken,
  createStudentSessionToken,
  verifySessionToken,
  verifyStudentSessionToken,
  bearerToken,
  safeEqual,
  getAdminPassword,
  hashPassword,
  verifyPassword,
} from './server-utils.js';

const BATCH_IDS = ['MON_TUE_WED_11', 'MON_TUE_WED_12', 'FRI_SAT_SUN_11', 'FRI_SAT_SUN_12'] as const;
type BatchId = (typeof BATCH_IDS)[number];
const BATCH_CLASS: Record<string, '11th' | '12th'> = {
  MON_TUE_WED_11: '11th',
  MON_TUE_WED_12: '12th',
  FRI_SAT_SUN_11: '11th',
  FRI_SAT_SUN_12: '12th',
};

function isValidBatch(v: unknown): v is BatchId {
  return typeof v === 'string' && (BATCH_IDS as readonly string[]).includes(v);
}

/* ------------------------------------------------------------------ */
/* Rate limiting                                                       */
/* ------------------------------------------------------------------ */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimitCache = new Map<string, RateLimitRecord>();

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitCache) {
    if (now > record.resetTime) rateLimitCache.delete(key);
  }
}, 5 * 60 * 1000).unref?.();

export function createRateLimiter(maxRequests: number, windowMs: number, errorMessage: string) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const key = `${req.baseUrl || req.path}:${ip}`;
    const now = Date.now();

    let record = rateLimitCache.get(key);
    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + windowMs };
    }

    record.count++;
    rateLimitCache.set(key, record);

    if (record.count > maxRequests) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.set('Retry-After', String(retryAfterSeconds));
      return res.status(429).json({
        success: false,
        error: `${errorMessage} Please try again in ${retryAfterSeconds} seconds.`,
      });
    }

    next();
  };
}

const loginLimiter = createRateLimiter(
  5,
  15 * 60 * 1000,
  'Too many login attempts from this IP.'
);

const saveLimiter = createRateLimiter(
  15,
  1 * 60 * 1000,
  'Too many content saving requests.'
);

const inquiryLimiter = createRateLimiter(
  5,
  10 * 60 * 1000,
  'Too many submissions from this IP.'
);

const newsletterLimiter = createRateLimiter(
  3,
  10 * 60 * 1000,
  'Too many subscription attempts from this IP.'
);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (verifySessionToken(bearerToken(req.headers.authorization))) {
    return next();
  }
  return res.status(401).json({ success: false, error: 'Unauthorized' });
}

function publicView(data: any) {
  const clean = { ...(data || {}) };
  delete clean.inquiries;
  delete clean.newsletter;

  // Normalize stats: legacy object {studentsCount, successRate, experience}
  if (clean.stats && typeof clean.stats === 'object' && !Array.isArray(clean.stats)) {
    const s = clean.stats as Record<string, any>;
    const mapped: Array<{ label: string; value: string; note: string }> = [];
    if (s.studentsCount !== undefined && s.studentsCount !== null) {
      mapped.push({ label: 'Students Mentored', value: String(s.studentsCount), note: 'Across NEET & JEE' });
    }
    if (s.successRate !== undefined && s.successRate !== null) {
      mapped.push({ label: 'Success Rate', value: String(s.successRate), note: 'Cleared Cutoff' });
    }
    if (s.experience !== undefined && s.experience !== null) {
      mapped.push({ label: 'Years of Experience', value: String(s.experience), note: 'Expert curriculum-focused mentorship' });
    }
    if (mapped.length === 0) {
      mapped.push({ label: 'Students Mentored', value: '1000+', note: 'Across NEET & JEE' });
    }
    clean.stats = mapped;
  } else if (!Array.isArray(clean.stats)) {
    clean.stats = [];
  }

  return clean;
}

function cleanString(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u0008\u000B-\u001F]/g, '').trim().slice(0, maxLength);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{8,16}$/;

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export function createApiApp() {
  const app = express();

  if (process.env.VERCEL) {
    app.set('trust proxy', 1);
  }

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ limit: '15mb', extended: true }));

  app.disable('x-powered-by');
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Public: get website content (inquiries + newsletter stripped)
  app.get('/api/content', async (req, res) => {
    try {
      const fileData = await readDataStore();
      res.json(publicView(fileData));
    } catch (err) {
      console.error('Content read failed:', err);
      res.status(500).json({ error: 'Could not load content' });
    }
  });

  // Admin login (disabled entirely when ADMIN_PASSWORD is unset)
  app.post('/api/auth/login', loginLimiter, (req, res) => {
    const targetPassword = getAdminPassword();
    if (!targetPassword) {
      return res.status(503).json({
        success: false,
        error: 'Admin login is not configured on this server.',
      });
    }

    const { password } = req.body || {};
    if (typeof password === 'string' && safeEqual(password, targetPassword)) {
      const token = createSessionToken();
      if (!token) {
        return res.status(503).json({ success: false, error: 'Could not create session.' });
      }
      return res.json({ success: true, token });
    }
    return res.status(401).json({ success: false, error: 'Incorrect password' });
  });

  // Validate admin session (signed + expiring token)
  app.get('/api/auth/session', (req, res) => {
    const authenticated = verifySessionToken(bearerToken(req.headers.authorization));
    return res.status(authenticated ? 200 : 401).json({ authenticated });
  });

  // Public: submit inquiry (enroll / contact)
  app.post('/api/inquiries', inquiryLimiter, async (req, res) => {
    const body = req.body || {};

    // Honeypot: real users never fill this hidden field.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return res.json({ success: true, message: 'Your booking has been registered successfully!' });
    }

    const name = cleanString(body.name, 120);
    const phone = cleanString(body.phone, 20);
    const email = cleanString(body.email, 120);
    const course = cleanString(body.course, 160);
    const message = cleanString(body.message, 2000);

    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Name and Phone are required.' });
    }
    if (!PHONE_RE.test(phone)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid phone number.' });
    }
    if (email && !EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
    }

    const fileData = (await readDataStore()) || {};
    const inquiries = Array.isArray(fileData.inquiries) ? fileData.inquiries : [];

    const newInquiry = {
      id: 'inq_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex'),
      name,
      phone,
      email,
      course: course || 'General Inquiry',
      message,
      type: body.type === 'enroll' ? 'enroll' : 'contact',
      timestamp: new Date().toISOString(),
      read: false,
    };

    inquiries.unshift(newInquiry);
    if (inquiries.length > 500) inquiries.length = 500;

    fileData.inquiries = inquiries;
    await writeDataStore(fileData);

    res.json({ success: true, message: 'Your booking has been registered successfully!' });
  });

  // Public: subscribe to the practice bulletin
  app.post('/api/newsletter', newsletterLimiter, async (req, res) => {
    const body = req.body || {};

    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return res.json({ success: true, message: 'Subscribed.' });
    }

    const email = cleanString(body.email, 120).toLowerCase();
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    const fileData = (await readDataStore()) || {};
    const newsletter: string[] = Array.isArray(fileData.newsletter) ? fileData.newsletter : [];

    if (!newsletter.includes(email)) {
      newsletter.unshift(email);
      if (newsletter.length > 2000) newsletter.length = 2000;
      fileData.newsletter = newsletter;
      await writeDataStore(fileData);
    }

    res.json({ success: true, message: 'Subscribed. The first bulletin arrives on Monday morning.' });
  });

  // Admin: list newsletter subscribers
  app.get('/api/newsletter', requireAdmin, async (req, res) => {
    const fileData = (await readDataStore()) || {};
    res.json(Array.isArray(fileData.newsletter) ? fileData.newsletter : []);
  });

  // Admin: get all inquiries
  app.get('/api/inquiries', requireAdmin, async (req, res) => {
    const fileData = (await readDataStore()) || {};
    res.json(Array.isArray(fileData.inquiries) ? fileData.inquiries : []);
  });

  // Admin: mark an inquiry as read
  app.put('/api/inquiries/:id/read', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const fileData = (await readDataStore()) || {};
    const inquiries = Array.isArray(fileData.inquiries) ? fileData.inquiries : [];

    const inquiry = inquiries.find((inq: any) => inq.id === id);
    if (inquiry) {
      inquiry.read = !inquiry.read;
      fileData.inquiries = inquiries;
      await writeDataStore(fileData);
      return res.json({ success: true, inquiries });
    }

    res.status(404).json({ success: false, error: 'Inquiry not found' });
  });

  // Admin: delete an inquiry
  app.delete('/api/inquiries/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const fileData = (await readDataStore()) || {};
    const inquiries = Array.isArray(fileData.inquiries) ? fileData.inquiries : [];

    const filtered = inquiries.filter((inq: any) => inq.id !== id);
    fileData.inquiries = filtered;
    await writeDataStore(fileData);

    res.json({ success: true, inquiries: filtered });
  });

  // Admin: save/update website content (preserves inquiries + newsletter)
  app.put('/api/content', saveLimiter, requireAdmin, async (req, res) => {
    const newData = req.body;
    if (!newData || typeof newData !== 'object' || Array.isArray(newData)) {
      return res.status(400).json({ success: false, error: 'Empty body' });
    }

    const existing = (await readDataStore()) || {};
    newData.inquiries = Array.isArray(existing.inquiries) ? existing.inquiries : [];
    newData.newsletter = Array.isArray(existing.newsletter) ? existing.newsletter : [];

    const success = await writeDataStore(newData);

    res.json({
      success,
      message: success ? 'Saved successfully' : 'Saved in-memory (persistent file error)',
    });
  });

  /* ---------------------------------------------------------------- */
  /* Admin: student management                                         */
  /* ---------------------------------------------------------------- */

  app.get('/api/admin/students', requireAdmin, async (req, res) => {
    const store = (await readDataStore()) || {};
    const students: any[] = Array.isArray(store.students) ? store.students : [];
    const safe = students.map((s) => ({
      id: s.id,
      username: s.username,
      name: s.name,
      class: s.class,
      batchId: s.batchId,
      phone: s.phone || '',
      email: s.email || '',
      subjects: s.subjects || [],
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
    res.json({ success: true, students: safe, batches: BATCH_IDS.map((id) => ({ id, class: BATCH_CLASS[id] })) });
  });

  app.post('/api/admin/students', requireAdmin, async (req, res) => {
    const body = req.body || {};
    const username = cleanString(body.username, 40).toLowerCase();
    const name = cleanString(body.name, 120);
    const password = typeof body.password === 'string' ? body.password : '';
    const cls = body.class === '12th' ? '12th' : body.class === '11th' ? '11th' : null;
    const batchId = body.batchId;

    if (!username || !name || !password || !cls) {
      return res.status(400).json({ success: false, error: 'Username, name, password and class are required.' });
    }
    if (!/^[a-z0-9_.-]{3,40}$/.test(username)) {
      return res.status(400).json({ success: false, error: 'Username must be 3-40 chars: letters, numbers, _ . -' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters.' });
    }
    if (!isValidBatch(batchId)) {
      return res.status(400).json({ success: false, error: 'Choose one of the 4 batches.' });
    }
    if (BATCH_CLASS[batchId] !== cls) {
      return res.status(400).json({ success: false, error: 'Batch does not match the selected class.' });
    }

    const store = (await readDataStore()) || {};
    const students: any[] = Array.isArray(store.students) ? store.students : [];
    if (students.some((s) => typeof s.username === 'string' && s.username.trim().toLowerCase() === username)) {
      return res.status(409).json({ success: false, error: 'That username is already taken.' });
    }

    const now = new Date().toISOString();
    const newStudent = {
      id: 'stu_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex'),
      username,
      passwordHash: await hashPassword(password),
      name,
      class: cls,
      batchId,
      phone: cleanString(body.phone, 20),
      email: cleanString(body.email, 120),
      subjects: Array.isArray(body.subjects) ? body.subjects.slice(0, 20).map((s: any) => cleanString(s, 40)) : [],
      createdAt: now,
      updatedAt: now,
    };

    students.push(newStudent);
    store.students = students;
    await writeDataStore(store);

    res.json({ success: true, id: newStudent.id });
  });

  app.put('/api/admin/students/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const body = req.body || {};
    const store = (await readDataStore()) || {};
    const students: any[] = Array.isArray(store.students) ? store.students : [];
    const student = students.find((s) => s.id === id);
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' });

    if (typeof body.name === 'string' && body.name.trim()) student.name = cleanString(body.name, 120);
    if (body.class === '11th' || body.class === '12th') student.class = body.class;
    if (isValidBatch(body.batchId)) {
      if (BATCH_CLASS[body.batchId] !== student.class) {
        return res.status(400).json({ success: false, error: 'Batch does not match the student class.' });
      }
      student.batchId = body.batchId;
    }
    if (typeof body.phone === 'string') student.phone = cleanString(body.phone, 20);
    if (typeof body.email === 'string') student.email = cleanString(body.email, 120);
    if (Array.isArray(body.subjects)) {
      student.subjects = body.subjects.slice(0, 20).map((s: any) => cleanString(s, 40));
    }
    if (typeof body.password === 'string' && body.password.length >= 8) {
      student.passwordHash = await hashPassword(body.password);
    }
    student.updatedAt = new Date().toISOString();

    store.students = students;
    await writeDataStore(store);
    res.json({ success: true });
  });

  app.delete('/api/admin/students/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const store = (await readDataStore()) || {};
    const students: any[] = Array.isArray(store.students) ? store.students : [];
    const next = students.filter((s) => s.id !== id);
    if (next.length === students.length) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    store.students = next;
    await writeDataStore(store);
    res.json({ success: true });
  });

  /* ---------------------------------------------------------------- */
  /* Admin: attendance                                                 */
  /* ---------------------------------------------------------------- */

  app.get('/api/admin/attendance', requireAdmin, async (req, res) => {
    const date = cleanString(req.query.date, 10);
    const batchId = req.query.batchId;
    const store = (await readDataStore()) || {};
    const students: any[] = Array.isArray(store.students) ? store.students : [];
    const attendance: any[] = Array.isArray(store.attendance) ? store.attendance : [];
    const filtered =
      batchId && isValidBatch(batchId) ? students.filter((s) => s.batchId === batchId) : students;

    const out: any[] = [];
    filtered.forEach((s) => {
      const rec = attendance.find((a: any) => a.studentId === s.id && a.date === date);
      out.push({
        studentId: s.id,
        name: s.name,
        username: s.username,
        batchId: s.batchId,
        status: rec ? rec.status : null,
      });
    });
    res.json({ success: true, date, records: out });
  });

  app.put('/api/admin/attendance', requireAdmin, async (req, res) => {
    const body = req.body || {};
    const date = cleanString(body.date, 10);
    const entries = Array.isArray(body.entries) ? body.entries : null;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !entries) {
      return res.status(400).json({ success: false, error: 'date (YYYY-MM-DD) and entries[] required.' });
    }
    if (entries.length > 500) {
      return res.status(400).json({ success: false, error: 'Too many entries in one request.' });
    }

    const store = (await readDataStore()) || {};
    const students: any[] = Array.isArray(store.students) ? store.students : [];
    const studentIds = new Set(students.map((s) => s.id));

    const results: string[] = [];
    for (const e of entries) {
      const sid = e?.studentId;
      const status = e?.status;
      if (!studentIds.has(sid)) continue;
      if (status !== 'present' && status !== 'absent' && status !== 'late') continue;

      const attendance: any[] = Array.isArray(store.attendance) ? store.attendance : [];
      const existingIdx = attendance.findIndex((a) => a.studentId === sid && a.date === date);
      const rec = {
        id: existingIdx >= 0 ? attendance[existingIdx].id : 'att_' + date + '_' + sid,
        studentId: sid,
        batchId: students.find((s) => s.id === sid)?.batchId || '',
        date,
        status,
        markedBy: 'admin' as const,
        markedAt: new Date().toISOString(),
      };
      if (existingIdx >= 0) attendance[existingIdx] = rec;
      else attendance.unshift(rec);
      if (attendance.length > 400) attendance.length = 400;
      store.attendance = attendance;
      results.push(sid);
    }

    await writeDataStore(store);
    res.json({ success: true, updated: results.length });
  });

  /* ---------------------------------------------------------------- */
  /* Admin: marks                                                      */
  /* ---------------------------------------------------------------- */

  app.get('/api/admin/marks', requireAdmin, async (req, res) => {
    const studentId = cleanString(req.query.studentId, 60);
    if (!studentId) return res.status(400).json({ success: false, error: 'studentId required' });
    const store = (await readDataStore()) || {};
    const marks: any[] = Array.isArray(store.marks) ? store.marks : [];
    const studentMarks = marks.filter((m) => m.studentId === studentId);
    res.json({ success: true, marks: studentMarks });
  });

  app.post('/api/admin/marks', requireAdmin, async (req, res) => {
    const body = req.body || {};
    const studentId = cleanString(body.studentId, 60);
    const testName = cleanString(body.testName, 120);
    const subject = cleanString(body.subject, 60);
    const date = cleanString(body.date, 10);
    const maxMarks = Number(body.maxMarks);
    const marksObtained = Number(body.marksObtained);

    if (!studentId || !testName || !subject || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ success: false, error: 'studentId, testName, subject, date required.' });
    }
    if (!Number.isFinite(maxMarks) || maxMarks <= 0 || maxMarks > 1000) {
      return res.status(400).json({ success: false, error: 'maxMarks must be between 1 and 1000.' });
    }
    if (!Number.isFinite(marksObtained) || marksObtained < 0 || marksObtained > maxMarks) {
      return res.status(400).json({ success: false, error: 'marksObtained must be between 0 and maxMarks.' });
    }

    const store = (await readDataStore()) || {};
    const students: any[] = Array.isArray(store.students) ? store.students : [];
    const student = students.find((s) => s.id === studentId);
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' });

    const marks: any[] = Array.isArray(store.marks) ? store.marks : [];
    const now = new Date().toISOString();
    const rec = {
      id: 'mk_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex'),
      studentId,
      batchId: student.batchId,
      testName,
      subject,
      maxMarks,
      marksObtained,
      date,
      remarks: cleanString(body.remarks, 300),
      createdAt: now,
      updatedAt: now,
    };
    marks.unshift(rec);
    if (marks.length > 500) marks.length = 500;
    store.marks = marks;
    await writeDataStore(store);
    res.json({ success: true, mark: rec });
  });

  app.put('/api/admin/marks/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const body = req.body || {};
    const studentId = cleanString(body.studentId, 60);
    if (!studentId) return res.status(400).json({ success: false, error: 'studentId required' });

    const store = (await readDataStore()) || {};
    const marks: any[] = Array.isArray(store.marks) ? store.marks : [];
    const rec = marks.find((m) => m.id === id);
    if (!rec) return res.status(404).json({ success: false, error: 'Mark not found' });

    if (typeof body.testName === 'string' && body.testName.trim()) rec.testName = cleanString(body.testName, 120);
    if (typeof body.subject === 'string' && body.subject.trim()) rec.subject = cleanString(body.subject, 60);
    if (typeof body.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date)) rec.date = body.date;
    if (body.maxMarks !== undefined) {
      const mm = Number(body.maxMarks);
      if (!Number.isFinite(mm) || mm <= 0 || mm > 1000) {
        return res.status(400).json({ success: false, error: 'Invalid maxMarks' });
      }
      rec.maxMarks = mm;
    }
    if (body.marksObtained !== undefined) {
      const mo = Number(body.marksObtained);
      if (!Number.isFinite(mo) || mo < 0 || mo > rec.maxMarks) {
        return res.status(400).json({ success: false, error: 'marksObtained out of range' });
      }
      rec.marksObtained = mo;
    }
    if (typeof body.remarks === 'string') rec.remarks = cleanString(body.remarks, 300);
    rec.updatedAt = new Date().toISOString();

    store.marks = marks;
    await writeDataStore(store);
    res.json({ success: true, mark: rec });
  });

  app.delete('/api/admin/marks/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const studentId = cleanString(req.query.studentId, 60);
    if (!studentId) return res.status(400).json({ success: false, error: 'studentId required' });
    const store = (await readDataStore()) || {};
    const marks: any[] = Array.isArray(store.marks) ? store.marks : [];
    const next = marks.filter((m) => m.id !== id);
    store.marks = next;
    await writeDataStore(store);
    res.json({ success: true });
  });

  /* ---------------------------------------------------------------- */
  /* Calendar (admin manage, student/public read)                      */
  /* ---------------------------------------------------------------- */

  app.get('/api/admin/calendar', requireAdmin, async (req, res) => {
    const store = (await readDataStore()) || {};
    res.json({ success: true, calendar: Array.isArray(store.calendar) ? store.calendar : [] });
  });

  app.post('/api/admin/calendar', requireAdmin, async (req, res) => {
    const body = req.body || {};
    const title = cleanString(body.title, 160);
    const date = cleanString(body.date, 10);
    if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ success: false, error: 'title and date (YYYY-MM-DD) required.' });
    }

    const store = (await readDataStore()) || {};
    const calendar: any[] = Array.isArray(store.calendar) ? store.calendar : [];
    const now = new Date().toISOString();
    const ev = {
      id: 'ev_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex'),
      title,
      description: cleanString(body.description, 600),
      date,
      endDate: typeof body.endDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.endDate) ? body.endDate : '',
      batchId: isValidBatch(body.batchId) ? body.batchId : '',
      class: body.class === '11th' || body.class === '12th' || body.class === 'all' ? body.class : 'all',
      createdAt: now,
      updatedAt: now,
    };
    calendar.push(ev);
    calendar.sort((a, b) => (a.date < b.date ? -1 : 1));
    if (calendar.length > 1000) calendar.length = 1000;
    store.calendar = calendar;
    await writeDataStore(store);
    res.json({ success: true, event: ev });
  });

  app.put('/api/admin/calendar/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const body = req.body || {};
    const store = (await readDataStore()) || {};
    const calendar: any[] = Array.isArray(store.calendar) ? store.calendar : [];
    const ev = calendar.find((e) => e.id === id);
    if (!ev) return res.status(404).json({ success: false, error: 'Event not found' });

    if (typeof body.title === 'string' && body.title.trim()) ev.title = cleanString(body.title, 160);
    if (typeof body.description === 'string') ev.description = cleanString(body.description, 600);
    if (typeof body.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date)) ev.date = body.date;
    if (typeof body.endDate === 'string') {
      ev.endDate = /^\d{4}-\d{2}-\d{2}$/.test(body.endDate) ? body.endDate : '';
    }
    if (isValidBatch(body.batchId)) ev.batchId = body.batchId;
    if (body.class === '11th' || body.class === '12th' || body.class === 'all') ev.class = body.class;
    ev.updatedAt = new Date().toISOString();

    calendar.sort((a, b) => (a.date < b.date ? -1 : 1));
    store.calendar = calendar;
    await writeDataStore(store);
    res.json({ success: true, event: ev });
  });

  app.delete('/api/admin/calendar/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const store = (await readDataStore()) || {};
    const calendar: any[] = Array.isArray(store.calendar) ? store.calendar : [];
    const next = calendar.filter((e) => e.id !== id);
    store.calendar = next;
    await writeDataStore(store);
    res.json({ success: true });
  });

  // Public/student: calendar for current year (auto-updates by date on client)
  app.get('/api/calendar', async (req, res) => {
    const store = (await readDataStore()) || {};
    const year = req.query.year ? String(req.query.year) : null;
    let calendar: any[] = Array.isArray(store.calendar) ? store.calendar : [];
    if (year && /^\d{4}$/.test(year)) {
      calendar = calendar.filter((e) => typeof e.date === 'string' && e.date.startsWith(year));
    }
    res.json({ success: true, calendar });
  });

  /* ---------------------------------------------------------------- */
  /* Student authentication & self-service                             */
  /* ---------------------------------------------------------------- */

  function requireStudent(req: express.Request, res: express.Response, next: express.NextFunction) {
    const studentId = verifyStudentSessionToken(bearerToken(req.headers.authorization));
    if (studentId) {
      (req as any).studentId = studentId;
      return next();
    }
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  app.post('/api/student/login', async (req, res) => {
    const { username, password } = req.body || {};
    if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required.' });
    }

    const store = (await readDataStore()) || {};
    const students: any[] = Array.isArray(store.students) ? store.students : [];
    const uname = username.trim().toLowerCase();

    const student = students.find(
      (s) => typeof s.username === 'string' && s.username.trim().toLowerCase() === uname
    );

    if (!student || !student.passwordHash || !(await verifyPassword(password, student.passwordHash))) {
      return res.status(401).json({ success: false, error: 'Incorrect username or password' });
    }

    const token = createStudentSessionToken(student.id);
    if (!token) {
      return res.status(503).json({ success: false, error: 'Could not create session.' });
    }
    return res.json({
      success: true,
      token,
      student: { id: student.id, username: student.username, name: student.name },
    });
  });

  app.get('/api/student/session', (req, res) => {
    const studentId = verifyStudentSessionToken(bearerToken(req.headers.authorization));
    return res.status(studentId ? 200 : 401).json({ authenticated: !!studentId, studentId: studentId || null });
  });

  app.get('/api/student/me', requireStudent, async (req, res) => {
    const studentId = (req as any).studentId;
    const store = (await readDataStore()) || {};
    const students: any[] = Array.isArray(store.students) ? store.students : [];
    const student = students.find((s) => s.id === studentId);

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const attendance: any[] = Array.isArray(store.attendance) ? store.attendance : [];
    const marks: any[] = Array.isArray(store.marks) ? store.marks : [];
    const calendar: any[] = Array.isArray(store.calendar) ? store.calendar : [];

    const studentAttendance = attendance.filter((a) => a.studentId === studentId);
    const studentMarks = marks.filter((m) => m.studentId === studentId);

    const safeStudent = {
      id: student.id,
      username: student.username,
      name: student.name,
      class: student.class,
      batchId: student.batchId,
      phone: student.phone || '',
      email: student.email || '',
      subjects: student.subjects || [],
      createdAt: student.createdAt,
    };

    res.json({
      success: true,
      student: safeStudent,
      attendance: studentAttendance,
      marks: studentMarks,
      calendar,
    });
  });

  return app;
}