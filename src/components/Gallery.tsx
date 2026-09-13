import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, Sparkles, LayoutGrid, Compass, Camera } from 'lucide-react';

interface GalleryItem {
  id: string;
  category: 'Classroom' | 'Workshops' | 'Events';
  title: string;
  desc: string;
  imgUrl: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    category: 'Classroom',
    title: 'Interactive Calculus & Graph Lecture',
    desc: 'Rehman Sir breaking down curve tracing, maxima-minima, and integral areas with intuitive geometric sketches.',
    imgUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: 'gal-2',
    category: 'Workshops',
    title: 'JEE Problem Solving Workshop',
    desc: 'Intensive speed-calculation and previous 10-year JEE Advanced question solving marathon.',
    imgUrl: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: 'gal-3',
    category: 'Events',
    title: 'JEE & Board Toppers Felicitation',
    desc: 'Annual award ceremony celebrating students scoring 100/100 in CBSE Maths and top engineering ranks.',
    imgUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: 'gal-4',
    category: 'Classroom',
    title: 'Dedicated 1-on-1 Doubt Counter',
    desc: 'Students clarifying step-by-step proofs and algebraic derivations directly with Rehman Sir.',
    imgUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: 'gal-5',
    category: 'Workshops',
    title: '3D Geometry & Vectors Workshop',
    desc: 'Visualizing planes, straight lines, and vector cross products for 12th Board step-marking perfection.',
    imgUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: 'gal-6',
    category: 'Events',
    title: 'Parent-Teacher Orientation Seminar',
    desc: 'Setting the academic test calendar and periodic score reporting guidelines in Ghaziabad.',
    imgUrl: 'https://images.unsplash.com/photo-1544531516-a5e340a7147d?auto=format&fit=crop&q=80&w=600&h=400'
  }
];

interface GalleryProps {
  items?: GalleryItem[];
}

export default function Gallery({ items }: GalleryProps) {
  const [filter, setFilter] = useState<'All' | 'Classroom' | 'Workshops' | 'Events'>('All');
  const [activeItemForLightBox, setActiveItemForLightBox] = useState<GalleryItem | null>(null);

  const galleryItemsToDisplay = items || GALLERY_ITEMS;

  const filteredItems = filter === 'All'
    ? galleryItemsToDisplay
    : galleryItemsToDisplay.filter(item => item.category === filter);

  return (
    <section
      id="gallery"
      className="py-20 md:py-28 bg-slate-50/70 dark:bg-[#07090e] math-grid transition-colors duration-300 relative border-t border-slate-200/50 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
            // CLASSROOM ENVIRONMENT
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight mt-1">
            Life Inside Rehman Maths Classes
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Take a visual tour of our problem-solving sessions, formula marathons, and doubt counters in Shastri Nagar, Ghaziabad.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Categories Tab */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-md mx-auto bg-white dark:bg-slate-900/80 p-1.5 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
          {[
            { id: 'All', label: 'All Photos' },
            { id: 'Classroom', label: 'Classrooms' },
            { id: 'Workshops', label: 'PYQ Drills' },
            { id: 'Events', label: 'Toppers' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white/90 dark:bg-slate-900/90 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-400/50 group cursor-pointer relative backdrop-blur-xs transition-all"
                onClick={() => setActiveItemForLightBox(item)}
              >
                {/* Photo box with overlay */}
                <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <img
                    src={item.imgUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Hover dark cover */}
                  <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                    <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="absolute top-3.5 right-3.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur text-amber-300 px-2.5 py-1 rounded-lg border border-white/15">
                    {item.category}
                  </span>
                </div>

                {/* Details caption */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Modal Lightbox */}
        <AnimatePresence>
          {activeItemForLightBox && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
                onClick={() => setActiveItemForLightBox(null)}
              />

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-900 max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-slate-200 dark:border-slate-800"
              >
                <div className="relative aspect-video bg-black">
                  <img
                    src={activeItemForLightBox.imgUrl}
                    alt={activeItemForLightBox.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => setActiveItemForLightBox(null)}
                    className="absolute top-4 right-4 bg-slate-950/70 text-white p-2 rounded-full hover:bg-slate-900 transition-colors cursor-pointer border border-white/20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full">
                      {activeItemForLightBox.category}
                    </span>
                    <span className="text-xs text-slate-400">Rehman Mathematics Classes • Ghaziabad</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {activeItemForLightBox.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {activeItemForLightBox.desc}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
