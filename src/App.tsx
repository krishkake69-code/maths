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

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [dynamicData, setDynamicData] = useState<any>(initialData);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    fetch('/api/content', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || `Content API returned ${response.status}`);
        setDynamicData(data);
      })
      .catch((error) => console.error('Failed to load live content:', error));
  }, []);

  async function handleSaveContent(updatedData: any) {
    const token = localStorage.getItem('attri_admin_token');
    if (!token) return false;
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) return false;
      const refreshed = await fetch('/api/content', { cache: 'no-store' });
      if (!refreshed.ok) return false;
      setDynamicData(await refreshed.json());
      return true;
    } catch (error) {
      console.error('Failed to save live content:', error);
      return false;
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
