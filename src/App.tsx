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
import initialData from './data-store.json';

function normalizeContentData(value: unknown) {
  const incoming = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  const defaults = initialData as Record<string, any>;

  return {
    ...defaults,
    ...incoming,
    hero: { ...defaults.hero, ...(incoming.hero && typeof incoming.hero === 'object' ? incoming.hero : {}) },
    stats: { ...defaults.stats, ...(incoming.stats && typeof incoming.stats === 'object' ? incoming.stats : {}) },
    contactInfo: { ...defaults.contactInfo, ...(incoming.contactInfo && typeof incoming.contactInfo === 'object' ? incoming.contactInfo : {}) },
    centers: Array.isArray(incoming.centers) ? incoming.centers : defaults.centers,
    courses: Array.isArray(incoming.courses) ? incoming.courses : defaults.courses,
    results: Array.isArray(incoming.results) ? incoming.results : defaults.results,
    testimonials: Array.isArray(incoming.testimonials) ? incoming.testimonials : defaults.testimonials,
    gallery: Array.isArray(incoming.gallery) ? incoming.gallery : defaults.gallery,
  };
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
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
      })
      .catch((error) => console.error('Failed to load live content:', error));
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
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network request failed';
      console.error('Failed to save live content:', error);
      return { success: false, error: `Could not reach the content server: ${message}` };
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
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
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} data={dynamicData} onSave={handleSaveContent} />
    </div>
  );
}
