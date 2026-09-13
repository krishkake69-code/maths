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
        if (res.ok) {
          const data = await res.json();
          // Verify that we received valid data objects
          if (data && Object.keys(data).length > 0 && (data.admissionMessage || data.hero || data.courses)) {
            setDynamicData(data);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic data from backend:', err);
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
      const result = await res.json();
      if (res.ok && result.success) {
        setDynamicData(updatedData);
        return true;
      } else {
        console.error('Save failed:', result.error || 'Unknown error');
        return false;
      }
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
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

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
