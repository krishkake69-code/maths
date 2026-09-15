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
    const validCandidate = Array.isArray(candidate)
      ? candidate.filter((item) => item && typeof item === 'object' && !Array.isArray(item))
      : [];
    return validCandidate.length > 0 ? validCandidate : fallback;
  };
  const courses = objectArray('courses').map((course: RecordValue, index: number) => {
    const fallback = asRecord(Array.isArray(defaults.courses) ? defaults.courses[index] : undefined);
    return {
      ...fallback,
      ...course,
      id: asString(course.id, asString(fallback.id, `course-${index + 1}`)),
      name: asString(course.name, asString(fallback.name, 'Course')),
      features: Array.isArray(course.features)
        ? course.features.filter((feature): feature is string => typeof feature === 'string')
        : Array.isArray(fallback.features) ? fallback.features : [],
    };
  });
  const gallery = objectArray('gallery').map((item: RecordValue, index: number) => {
    const fallback = asRecord(Array.isArray(defaults.gallery) ? defaults.gallery[index] : undefined);
    const category = item.category === 'Workshops' ? 'Lab' : item.category;
    return {
      ...fallback,
      ...item,
      id: asString(item.id, asString(fallback.id, `gallery-${index + 1}`)),
      category: ['Classroom', 'Lab', 'Events'].includes(category) ? category : 'Classroom',
      title: asString(item.title, asString(fallback.title, 'Gallery image')),
      desc: asString(item.desc, asString(fallback.desc)),
      imgUrl: asString(item.imgUrl, asString(fallback.imgUrl)),
    };
  });

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
      <ErrorBoundary
        fallback={
          <main id="main-content" className="min-h-[60vh] px-4 py-24 text-center">
            <h1 className="text-2xl font-bold text-white">Content is temporarily unavailable</h1>
            <p className="mx-auto mt-2 max-w-lg text-slate-400">
              The saved content could not be displayed. Please refresh and try again.
            </p>
          </main>
        }
      >
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
      </ErrorBoundary>
      <Footer onAdminClick={() => setIsAdminOpen(true)} contactInfo={dynamicData?.contactInfo} />
      <FloatingWhatsApp phone={dynamicData?.contactInfo?.phone} />
      <ErrorBoundary>
        <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} data={dynamicData} onSave={handleSaveContent} />
      </ErrorBoundary>
    </div>
  );
}
