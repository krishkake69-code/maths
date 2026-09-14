import { useState, useEffect } from 'react';
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
import { AnimatePresence } from 'motion/react';
import initialData from './data-store.json';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [dynamicData, setDynamicData] = useState<any>(initialData);
  const [contentError, setContentError] = useState<string | null>(null);

  // Apply dark mode styling to root document
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Load backend content on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content');
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || `Content API returned ${res.status}`);
        }

        if (data && Object.keys(data).length > 0 && (data.admissionMessage || data.hero || data.courses)) {
          setDynamicData(data);
          setContentError(null);
        } else {
          throw new Error('Content API returned an invalid payload.');
        }
      } catch (err) {
        console.error('Failed to load dynamic data from backend:', err);
        setContentError('Live content is unavailable. Showing the built-in preview data.');
      }
    };
    fetchContent();
  }, []);

  const handleSaveContent = async (updatedData: any) => {
    try {
      const token = localStorage.getItem('attri_admin_token');
      if (!token) {
        console.error('No admin token found');
        return false;
      }
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        if (res.status === 401) {
          localStorage.removeItem('attri_admin_token');
        }
        console.error('Save failed:', result.error || `HTTP ${res.status}`);
        return false;
      }

      const refreshedRes = await fetch('/api/content', { cache: 'no-store' });
      if (!refreshedRes.ok) {
        const refreshError = await refreshedRes.json().catch(() => ({}));
        console.error('Save succeeded but refreshed content could not be loaded:', refreshError.error);
        return false;
      }
      const refreshedData = await refreshedRes.json();
      setDynamicData(refreshedData);
      return true;
    } catch (err) {
      console.error('Error saving dynamic content to backend:', err);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans transition-colors duration-300">
      {/* Top Admission Alert Bar */}
      <AdmissionBanner message={dynamicData?.admissionMessage} />

      {/* Main Navigation */}
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        onAdminClick={() => setIsAdminOpen(true)}
      />

      {contentError && (
        <div role="status" className="border-b border-amber-400/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-200">
          {contentError}
        </div>
      )}

      <main id="main-content" tabIndex={-1} className="outline-none">
        {/* Hero Section */}
        <Hero data={dynamicData?.hero} />

        {/* Interactive Math 3D Laboratory (Key Differentiator) */}
        <Math3DLab />

        {/* About Rehman Sir */}
        <About />

        {/* Performance Statistics */}
        <Stats data={dynamicData?.stats} />

        {/* Academic Courses & Batches */}
        <Courses courses={dynamicData?.courses} />

        {/* Why Choose Us Features */}
        <WhyChooseUs />

        {/* Hall of Fame & Results */}
        <Results results={dynamicData?.results} />

        {/* Testimonials */}
        <Testimonials testimonials={dynamicData?.testimonials} />

        {/* Campus Gallery */}
        <Gallery gallery={dynamicData?.gallery} />

        {/* Contact & Registration Form */}
        <Contact 
          contactInfo={dynamicData?.contactInfo} 
          centers={dynamicData?.centers} 
        />
      </main>

      {/* Footer */}
      <Footer 
        onAdminClick={() => setIsAdminOpen(true)}
        contactInfo={dynamicData?.contactInfo} 
        centers={dynamicData?.centers} 
      />

      {/* Floating Action Button */}
      <FloatingWhatsApp />

      {/* Admin Panel Modal Overlay */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel 
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            data={dynamicData}
            onSave={handleSaveContent}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
