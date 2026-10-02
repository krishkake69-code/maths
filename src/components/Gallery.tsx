import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X } from 'lucide-react';

interface GalleryItem {
  id: string;
  category: 'Classroom' | 'Lab' | 'Events';
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
    category: 'Lab',
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
    category: 'Lab',
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
  const [filter, setFilter] = useState<'All' | 'Classroom' | 'Lab' | 'Events'>('All');
  const [activeItemForLightBox, setActiveItemForLightBox] = useState<GalleryItem | null>(null);

  const galleryItemsToDisplay = items || GALLERY_ITEMS;

  const filteredItems = filter === 'All'
    ? galleryItemsToDisplay
    : galleryItemsToDisplay.filter(item => item.category === filter);

  return (
    <section
      id="gallery"
      className="py-20 md:py-28 bg-paper dark:bg-chalk-950 math-grid transition-colors duration-300 relative border-t border-chalk-200/60 dark:border-chalk-800/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="max-w-2xl mb-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] font-bold text-chalk-950 dark:text-chalk-50 tracking-tight">
            Life inside Rehman Maths Classes
          </h2>
          <p className="text-chalk-600 dark:text-chalk-300 mt-4 text-sm sm:text-base leading-relaxed max-w-[60ch]">
            Take a visual tour of our problem-solving sessions, formula marathons, and doubt counters in Shastri Nagar, Ghaziabad.
          </p>
        </motion.div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-start gap-2 mb-10 max-w-md p-1.5 rounded-full bg-white dark:bg-chalk-900/80 border border-chalk-200/80 dark:border-chalk-800 shadow-[0_10px_30px_-20px_rgba(10,15,12,0.3)]">
          {[
            { id: 'All', label: 'All Photos' },
            { id: 'Classroom', label: 'Classrooms' },
            { id: 'Lab', label: 'Labs' },
            { id: 'Events', label: 'Toppers' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                filter === tab.id
                  ? 'bg-chalk-950 dark:bg-chalk-100 text-white dark:text-chalk-950'
                  : 'text-chalk-600 dark:text-chalk-300 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Photo grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.figure
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className="group cursor-pointer"
                onClick={() => setActiveItemForLightBox(item)}
              >
                <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-chalk-100 dark:bg-chalk-900 ring-1 ring-chalk-200/80 dark:ring-chalk-800 group-hover:ring-emerald-500/50 transition-all duration-500">
                  <img
                    src={item.imgUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]"
                  />

                  <div className="absolute inset-0 bg-chalk-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Caption below the image */}
                <figcaption className="px-1 mt-4">
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
                    {item.category}
                  </p>
                  <h3 className="text-base font-bold text-chalk-950 dark:text-chalk-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-chalk-500 dark:text-chalk-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {activeItemForLightBox && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-chalk-950/85 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
                onClick={() => setActiveItemForLightBox(null)}
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 12 }}
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                className="bg-white dark:bg-chalk-900 max-w-3xl w-full rounded-[1.75rem] overflow-hidden shadow-2xl relative z-10 border border-chalk-200/70 dark:border-chalk-800"
              >
                <div className="relative aspect-video bg-chalk-950">
                  <img
                    src={activeItemForLightBox.imgUrl}
                    alt={activeItemForLightBox.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => setActiveItemForLightBox(null)}
                    className="absolute top-4 right-4 bg-chalk-950/70 text-white p-2 rounded-full hover:bg-chalk-900 transition-colors cursor-pointer border border-white/20"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
                      {activeItemForLightBox.category}
                    </span>
                    <span className="text-xs text-chalk-400">Rehman Mathematics Classes • Ghaziabad</span>
                  </div>
                  <h4 className="text-xl font-bold text-chalk-950 dark:text-chalk-50 tracking-tight">
                    {activeItemForLightBox.title}
                  </h4>
                  <p className="text-sm text-chalk-500 dark:text-chalk-300 mt-2 leading-relaxed">
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
