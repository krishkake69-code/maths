import { useEffect, useState } from 'react';
import AdmissionBanner from './components/AdmissionBanner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Math3DLab from './components/Math3DLab';
import About from './components/About';
import Stats from './components/Stats';
import Courses from './components/Courses';
import WhyChooseUs from './components/WhyChooseUs';
import Results from './components/Results';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import AdminPanel from './components/AdminPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import initialData from './data-store.json';

type RecordValue = Record<string, any>;

function asRecord(value: unknown): RecordValue {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as RecordValue : {};
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function normalizeContentData(value: unknown) {
  const incoming = asRecord(value);
  const defaults = initialData as RecordValue;
  const objectArray = (key: string) => {
    const candidate = incoming[key];
    const fallback = Array.isArray(defaults[key]) ? defaults[key] : [];
    return (Array.isArray(candidate) ? candidate : fallback).filter((item) => item && typeof item === 'object' && !Array.isArray(item));
  };
  const courses = objectArray('courses').map((course: RecordValue) => ({
    ...course,
    id: asString(course.id, `course-${Math.random()}`),
    name: asString(course.name, 'Course'),
    features: Array.isArray(course.features) ? course.features.filter((feature): feature is string => typeof feature === 'string') : [],
  }));
  const gallery = objectArray('gallery').map((item: RecordValue) => ({
    ...item,
    id: asString(item.id, `gallery-${Math.random()}`),
    category: ['Classroom', 'Lab', 'Events'].includes(item.category) ? item.category : 'Classroom',
    title: asString(item.title, 'Gallery image'),
    desc: asString(item.desc),
    imgUrl: asString(item.imgUrl),
  }));

  return {
    ...defaults,
    ...incoming,
    admissionMessage: asString(incoming.admissionMessage, asString(defaults.admissionMessage)),
    hero: { ...asRecord(defaults.hero), ...asRecord(incoming.hero) },
    stats: { ...asRecord(defaults.stats), ...asRecord(incoming.stats) },
    contactInfo: { ...asRecord(defaults.contactInfo), ...asRecord(incoming.contactInfo) },
    centers: objectArray('centers'),
    courses,
    results: objectArray('results'),
    testimonials: objectArray('testimonials'),
    gallery,
  };
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [dynamicData, setDynamicData] = useState<any>(() => normalizeContentData(initialData));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    fetch('/api/content', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || `Content API returned ${response.status}`);
        setDynamicData(normalizeContentData(data));
        setSyncError('');
      })
      .catch((error) => {
        console.error('Failed to load live content:', error);
        setSyncError('Live content could not be synced. Showing the last saved content.');
      });
  }, []);

  async function handleSaveContent(updatedData: any): Promise<{ success: boolean; error?: string }> {
    const token = localStorage.getItem('attri_admin_token');
    if (!token) return { success: false, error: 'Your admin session has expired. Please sign in again.' };

    const readResponse = async (response: Response) => {
      const text = await response.text();
      try {
        return text ? JSON.parse(text) : {};
      } catch {
        return { error: text || `Server returned ${response.status}` };
      }
    };

    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedData),
      });
      const result = await readResponse(response);
      if (response.status === 401) {
        localStorage.removeItem('attri_admin_token');
        return { success: false, error: 'Your admin session expired. Please authenticate again.' };
      }
      if (!response.ok || result.success === false) {
        const error = result.error || `Content API returned ${response.status}`;
        console.error('Failed to save live content:', error);
        return { success: false, error };
      }

      const refreshed = await fetch('/api/content', { cache: 'no-store', headers: { Accept: 'application/json' } });
      const refreshedData = await readResponse(refreshed);
      if (!refreshed.ok) {
        const error = refreshedData.error || `Content reload returned ${refreshed.status}`;
        console.error('Saved content could not be reloaded:', error);
        return { success: false, error };
      }
      setDynamicData(normalizeContentData(refreshedData));
      setSyncError('');
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network request failed';
      console.error('Failed to save live content:', error);
      return { success: false, error: `Could not reach the content server: ${message}` };
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {syncError && (
        <div role="status" className="bg-amber-500/15 px-4 py-2 text-center text-sm text-amber-200">
          {syncError}
        </div>
      )}
      <AdmissionBanner message={dynamicData?.admissionMessage} />
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} onAdminClick={() => setIsAdminOpen(true)} />
      <main id="main-content">
        <Hero data={dynamicData?.hero} stats={dynamicData?.stats} />
        <Math3DLab />
        <About />
        <Stats stats={dynamicData?.stats} />
        <Courses courses={dynamicData?.courses} />
        <WhyChooseUs />
        <Results results={dynamicData?.results} />
        <Testimonials testimonials={dynamicData?.testimonials} />
        <Gallery items={dynamicData?.gallery} />
        <Contact contactInfo={dynamicData?.contactInfo} centers={dynamicData?.centers} />
      </main>
      <Footer onAdminClick={() => setIsAdminOpen(true)} contactInfo={dynamicData?.contactInfo} />
      <FloatingWhatsApp phone={dynamicData?.contactInfo?.phone} />
      <ErrorBoundary>
        <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} data={dynamicData} onSave={handleSaveContent} />
      </ErrorBoundary>
    </div>
  );
}
