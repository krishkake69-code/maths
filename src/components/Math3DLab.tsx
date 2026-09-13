import { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles, Box, ArrowRight, Zap } from 'lucide-react';
import Math3DViewer, { Math3DMode } from './Math3DViewer';
import Button3D from './Button3D';
import Card3D from './Card3D';

export default function Math3DLab() {
  const [activePreset] = useState<Math3DMode>('vectors');

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const targetRect = el.getBoundingClientRect().top;
      const targetPosition = targetRect - bodyRect;
      const offsetPosition = targetPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="math-3d-lab"
      className="py-20 md:py-28 bg-slate-900 text-white math-dense-grid relative overflow-hidden border-t border-slate-800"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-indigo-600/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 rounded-full bg-amber-500/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-bold uppercase mb-3 shadow-lg shadow-indigo-950/50">
            <Box className="w-4 h-4 text-amber-400" />
            <span>IMMERSIVE 3D GEOMETRY & CALCULUS LAB</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Visualize in 3D Before You Calculate
          </h2>

          <p className="text-slate-300 mt-2 text-sm sm:text-base leading-relaxed">
            In JEE Advanced and Class 12 Boards, questions from 3D Geometry and Vectors carry over <strong className="text-amber-400">20% of the paper</strong>. Rehman Sir teaches through interactive spatial geometry so you never have to guess angles in your head.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* 3D Viewer Main Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Main 3D Canvas Container */}
          <div className="lg:col-span-8">
            <Math3DViewer
              key={activePreset}
              initialMode={activePreset}
              height="480px"
              showControls={true}
              className="shadow-2xl shadow-indigo-950/60"
            />
          </div>

          {/* Side 3D Graph Description Panel with 3D Tilt Effect */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Interactive 3D Card explaining the 3D Vector Graph */}
            <Card3D
              id="math-3d-graph-description-card"
              className="p-5 rounded-3xl bg-slate-950/90 border border-indigo-500/40 shadow-xl shadow-indigo-950/50 backdrop-blur-md space-y-4"
              intensity={6}
            >
              {/* Header Badge & Title */}
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live 3D Graph Analysis
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                    3D Cartesian XYZ
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Vector Cross-Product (a × b)</span>
                </h3>
              </div>

              {/* Graphical Elements Breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 mt-1 shrink-0 shadow-xs shadow-cyan-400" />
                  <div>
                    <strong className="text-cyan-300 font-bold">Vector a (Cyan Base):</strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                      Ground reference vector along Cartesian X-axis with magnitude |a|.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 shrink-0 shadow-xs shadow-amber-400" />
                  <div>
                    <strong className="text-amber-300 font-bold">Vector b (Amber Arm):</strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                      Rotates through angle θ relative to vector a across 3D space.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-indigo-950/60 bg-indigo-950/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 mt-1 shrink-0 shadow-xs shadow-indigo-400" />
                  <div>
                    <strong className="text-indigo-300 font-bold">Normal a × b (Perpendicular):</strong>
                    <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                      Magnitude = |a||b| sin(θ), directed perpendicularly via the Right-Hand Rule.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <span className="w-2.5 h-2.5 rounded-sm bg-violet-500/50 border border-violet-400 mt-1 shrink-0" />
                  <div>
                    <strong className="text-violet-300 font-bold">Shaded Plane Area:</strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                      Geometric area of parallelogram = |a × b|. Collapses to zero when vectors are parallel.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Tip */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-800/40 text-[11px] text-slate-300">
                <span className="font-bold text-amber-400 flex items-center gap-1 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" /> Interactive Hint
                </span>
                Drag to orbit 360°, scroll to zoom, and adjust the angle slider to see the normal vector grow or shrink live.
              </div>
            </Card3D>

            {/* Tactile 3D Action Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-950 border border-indigo-800/50 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">Experience 3D Classroom Lectures</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Attend 3 days of live vector and calculus sessions with Rehman Sir in Shastri Nagar, Ghaziabad.
              </p>
              
              {/* Tactile 3D Push Button */}
              <Button3D
                variant="amber"
                size="md"
                onClick={() => handleScrollToSection('contact')}
                className="w-full"
              >
                <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>Reserve Free 3-Day Demo Pass</span>
                <ArrowRight className="w-4 h-4" />
              </Button3D>
            </div>

          </div>

        </div>

        {/* 3 Core Spatial Pillars with 3D Tilt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {[
            {
              title: "Zero Angle Guesswork",
              desc: "Never struggle with cross products or direction cosines. See vectors interact in Cartesian space with right-hand rules.",
              badge: "Vector Intuition"
            },
            {
              title: "Step-Marking Visual Proofs",
              desc: "Learn how to write Board-standard solutions for 3D lines, skew distance, and plane equations to secure 100/100.",
              badge: "Class 12 Boards"
            },
            {
              title: "Fast JEE Coordinate Elimination",
              desc: "Quickly spot parallel planes, normal collinearity, and orthogonal dot products to solve JEE problems in under 60 seconds.",
              badge: "JEE Speed"
            }
          ].map((pillar, i) => (
            <Card3D
              key={i}
              className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 transition-colors shadow-lg"
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-full">
                {pillar.badge}
              </span>
              <h3 className="text-lg font-bold text-white mt-3">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                {pillar.desc}
              </p>
            </Card3D>
          ))}
        </div>

      </div>
    </section>
  );
}
