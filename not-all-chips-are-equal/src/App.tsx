/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState, useEffect, ReactNode } from "react";
import { 
  Cpu, 
  Zap, 
  Lock, 
  ChevronLeft,
  ChevronRight, 
  Globe, 
  Database,
  Layers,
  Activity
} from "lucide-react";

// --- Components ---

const SectionHeading = ({ children, className = "" }: { children: ReactNode, className?: string }) => (
  <motion.h2 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`font-display text-4xl md:text-6xl text-teal uppercase tracking-tight mb-12 ${className}`}
  >
    {children}
  </motion.h2>
);

const StatCard = ({ value, label, delay = 0 }: { value: string, label: string, delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const target = parseFloat(value.replace(/[^0-9.]/g, ''));
      if (isNaN(target)) return;
      
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  const displayValue = value.replace(/[0-9.]+/, Math.floor(count).toString());

  return (
    <div ref={ref} className="flex flex-col items-center text-center p-8 bg-surface border border-border rounded-sm">
      <div className="font-mono text-4xl md:text-5xl text-teal mb-2">{displayValue}</div>
      <div className="text-muted text-sm uppercase tracking-widest">{label}</div>
    </div>
  );
};

const ChipCard = ({ type, icon: Icon, points, accent, delay }: { type: string, icon: any, points: string[], accent: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -10, boxShadow: `0 0 25px ${accent}44` }}
    className="bg-surface border border-border p-8 flex flex-col gap-6 relative overflow-hidden group"
    style={{ borderColor: accent }}
  >
    <div className="font-mono text-2xl font-bold tracking-tighter" style={{ color: accent }}>{type}</div>
    <div className="w-16 h-16 flex items-center justify-center text-muted group-hover:text-text transition-colors">
      <Icon size={48} strokeWidth={1} />
    </div>
    <ul className="space-y-3">
      {points.map((p, i) => (
        <li key={i} className="text-sm text-text/80 flex gap-2">
          <ChevronRight size={14} className="shrink-0 mt-1" style={{ color: accent }} />
          {p}
        </li>
      ))}
    </ul>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const slides = [
    {
      id: "hero",
      label: "Hero",
      content: (
        <section 
          ref={heroRef}
          className="relative min-h-full flex flex-col items-center justify-center overflow-hidden px-6 py-20"
        >
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00C9A711_1px,transparent_1px),linear-gradient(to_bottom,#00C9A711_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            <motion.div 
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-teal/5" 
            />
          </div>

          <div 
            className="absolute pointer-events-none w-[600px] h-[600px] rounded-full blur-[120px] bg-teal/5 z-0 transition-transform duration-300 ease-out"
            style={{ 
              transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)` 
            }}
          />

          <div className="relative z-10 text-center max-w-5xl">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-display text-[60px] md:text-[120px] leading-[0.9] text-white mb-6 tracking-wide"
            >
              NOT ALL CHIPS <br /> ARE EQUAL
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="font-body text-lg md:text-xl text-teal/80 mb-8 tracking-widest uppercase"
            >
              The Energy and Access Politics of AI Hardware
            </motion.p>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="max-w-2xl mx-auto text-muted text-lg leading-relaxed"
            >
              The hardware running artificial intelligence isn&apos;t neutral — it shapes who gets to build AI, how much energy it burns, and who pays the price.
            </motion.p>
          </div>
        </section>
      ),
    },
    {
      id: "intro",
      label: "Intro",
      content: (
        <section className="bg-surface py-24 px-6 border-y border-border min-h-full flex items-center">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="border-l-4 border-teal pl-8">
              <blockquote className="text-3xl md:text-4xl font-editorial italic leading-tight text-text">
                "The chip you use determines the cost you pay — in watts, in dollars, and in access."
              </blockquote>
            </div>
            <div className="space-y-6">
              <div className="flex gap-3">
                <span className="bg-amber/10 text-amber text-[10px] font-mono px-3 py-1 border border-amber/20 rounded-full">RQ1</span>
                <span className="bg-amber/10 text-amber text-[10px] font-mono px-3 py-1 border border-amber/20 rounded-full">RQ2</span>
              </div>
              <p className="text-muted leading-relaxed">
                Our research investigates how hardware architecture choices impact the carbon footprint of AI models. We ask: Does the centralization of efficient hardware create a new digital divide?
              </p>
              <p className="text-muted leading-relaxed">
                By comparing the three dominant paradigms of AI compute, we reveal the hidden trade-offs between performance, efficiency, and democratic access to technology.
              </p>
            </div>
          </div>
        </section>
      ),
    },
    {
      id: "body",
      label: "Research",
      content: (
        <div className="overflow-y-auto h-full">
          <section className="py-24 px-6 max-w-7xl mx-auto">
            <SectionHeading>Under The Hood</SectionHeading>
            <div className="grid md:grid-cols-3 gap-8">
              <ChipCard 
                type="GPU"
                icon={Layers}
                accent="#00C9A7"
                delay={0.1}
                points={[
                  "Graphics Processing Unit: The versatile workhorse of modern AI.",
                  "Highly parallel architecture with thousands of small cores.",
                  "Easy to program but power-hungry and expensive to scale.",
                  "Dominant in both training and inference across the industry."
                ]}
              />
              <ChipCard 
                type="TPU"
                icon={Cpu}
                accent="#F59E0B"
                delay={0.2}
                points={[
                  "Tensor Processing Unit: Custom-built for matrix operations.",
                  "Designed by Google specifically for neural network workloads.",
                  "Extreme efficiency for massive-scale training tasks.",
                  "Restricted access: Only available via Google Cloud or partnerships."
                ]}
              />
              <ChipCard 
                type="FPGA"
                icon={Activity}
                accent="#A78BFA"
                delay={0.3}
                points={[
                  "Field Programmable Gate Array: Hardware that can be rewired.",
                  "Offers low latency and high efficiency for specific tasks.",
                  "Steep learning curve: Requires hardware-level programming.",
                  "Ideal for edge computing and specialized research labs."
                ]}
              />
            </div>
          </section>

          <section className="py-24 px-6 bg-bg relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <SectionHeading>The Efficiency Gap</SectionHeading>
              
              <div className="space-y-12 mb-16">
                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-mono text-sm uppercase tracking-widest">GPU (Standard)</span>
                    <span className="font-mono text-teal">1.0x</span>
                  </div>
                  <div className="h-4 bg-surface rounded-full overflow-hidden border border-border">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "20%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-teal"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-mono text-sm uppercase tracking-widest">FPGA (Specialized)</span>
                    <span className="font-mono text-[#A78BFA]">4.2x</span>
                  </div>
                  <div className="h-4 bg-surface rounded-full overflow-hidden border border-border">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "60%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      className="h-full bg-[#A78BFA]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-mono text-sm uppercase tracking-widest">TPU (Optimized)</span>
                    <span className="font-mono text-amber">10.0x</span>
                  </div>
                  <div className="h-4 bg-surface rounded-full overflow-hidden border border-border">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                      className="h-full bg-amber"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="bg-amber/5 border border-amber/20 p-8 rounded-sm">
                  <div className="flex items-center gap-3 text-amber mb-4">
                    <Zap size={24} />
                    <span className="font-mono text-sm uppercase font-bold">Efficiency Callout</span>
                  </div>
                  <p className="text-xl text-text leading-snug">
                    "A TPU can be up to 10x more energy efficient than a GPU for the same task — but most universities can&apos;t access one."
                  </p>
                </div>
                <div className="space-y-6">
                  <p className="text-muted leading-relaxed">
                    Efficiency is measured in <span className="text-text font-mono">TOPS/W</span> (Tera Operations Per Second per Watt). Think of it like miles per gallon for AI. A higher score means the chip can perform more calculations using the same amount of electricity.
                  </p>
                  <p className="text-muted leading-relaxed">
                    While GPUs are the industry standard due to their flexibility, specialized architectures like TPUs and FPGAs offer massive environmental benefits that remain locked behind proprietary walls.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-24 px-6 max-w-7xl mx-auto">
            <SectionHeading>Who Gets The Chip?</SectionHeading>
            
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-[#1A0F0F] border border-danger/20 p-10 rounded-sm">
                <h3 className="font-mono text-danger uppercase mb-6 flex items-center gap-2">
                  <Lock size={18} /> Cost Barriers
                </h3>
                <ul className="space-y-6">
                  <li className="flex flex-col gap-1">
                    <span className="text-2xl font-bold text-text">$40,000+</span>
                    <span className="text-muted text-sm">Cost of a single H100 GPU node</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-2xl font-bold text-text">Proprietary</span>
                    <span className="text-muted text-sm">TPU hardware cannot be purchased</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-2xl font-bold text-text">24/7 Cooling</span>
                    <span className="text-muted text-sm">Infrastructure costs exceed research budgets</span>
                  </li>
                </ul>
              </div>

              <div className="bg-surface border border-border p-10 rounded-sm flex flex-col justify-center">
                <div className="mb-8">
                  <h3 className="font-mono text-teal uppercase mb-4">The Access Ladder</h3>
                  <div className="space-y-4">
                    {[
                      { label: "Big Tech", icon: Globe },
                      { label: "Cloud Providers", icon: Database },
                      { label: "Universities", icon: Layers },
                      { label: "Startups", icon: Activity },
                      { label: "Independent Researchers", icon: Cpu, locked: true }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-sm flex items-center justify-center border ${item.locked ? 'border-danger/30 text-danger' : 'border-teal/30 text-teal'}`}>
                          <item.icon size={18} />
                        </div>
                        <div className="flex-1 h-[1px] bg-border" />
                        <span className={`font-mono text-xs uppercase ${item.locked ? 'text-danger' : 'text-muted'}`}>
                          {item.label} {item.locked && <Lock size={10} className="inline ml-1" />}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-amber/10 border-l-2 border-amber p-4">
                  <p className="text-sm text-amber/90 italic">
                    "Google&apos;s TPUs are not publicly sold. Access requires either a partnership with Google or use of Google Cloud — at a price most research institutions cannot afford."
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      ),
    },
    {
      id: "closing",
      label: "Conclusion",
      content: (
        <div className="overflow-y-auto h-full">
          <section className="py-24 px-6 bg-surface relative">
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">
              <SectionHeading>The Carbon Cost</SectionHeading>
              
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <StatCard value="284 tons" label="Training one LLM (CO₂)" />
                <StatCard value="10x" label="TPU Efficiency Advantage" />
                <StatCard value="0" label="Public FPGAs in Uni Labs" />
              </div>

              <div className="max-w-3xl mx-auto text-center">
                <p className="text-xl text-muted leading-relaxed">
                  Energy use isn&apos;t just a technical metric; it&apos;s an environmental justice issue. Data centers are often placed in regions with cheap electricity but high carbon intensity. When research institutions are forced to use less efficient hardware due to access barriers, the environmental cost is externalized to the communities living near these power plants.
                </p>
              </div>
            </div>
          </section>

          <section className="py-32 px-6 max-w-3xl mx-auto text-center">
            <SectionHeading className="text-center">It Matters Who Has The Chip</SectionHeading>
            
            <div className="space-y-8 mb-16 text-lg text-muted leading-relaxed">
              <p>
                The future of artificial intelligence is being written in silicon. As models grow larger, the efficiency gap between general-purpose and specialized hardware becomes a chasm that only the wealthiest entities can cross.
              </p>
              <p>
                If we care about the environmental impact of AI, we must care about hardware democratization. Proprietary efficiency is a form of gatekeeping that prevents independent researchers from building sustainable AI.
              </p>
              <p>
                We need a shift toward open hardware standards and public compute infrastructure that prioritizes efficiency for all, not just for profit.
              </p>
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="font-display text-7xl md:text-9xl text-white tracking-tighter">
                HARDWARE IS POLICY.
              </div>
              <p className="text-muted font-mono text-xs uppercase tracking-[0.4em]">
                The decisions made about which chips get built, sold, and shared are not technical decisions. They are political ones.
              </p>
            </motion.div>
          </section>

          <footer className="bg-[#0D0D0D] py-20 px-6 border-t border-teal/30">
            <div className="max-w-7xl mx-auto">
              <h4 className="font-mono text-teal text-xs tracking-[0.5em] mb-12 uppercase">Sources</h4>
              <div className="grid md:grid-cols-2 gap-8 text-xs text-muted font-body">
                <ul className="space-y-4">
                  <li>Patterson, David, et al. "Carbon Emissions and Large Neural Network Training." arXiv preprint arXiv:2104.10350 (2021).</li>
                  <li>Jouppi, Norman P., et al. "In-datacenter performance analysis of a tensor processing unit." Proceedings of the 44th ISCA (2017).</li>
                  <li>Strubell, Emma, et al. "Energy and Policy Considerations for Deep Learning in NLP." ACL (2019).</li>
                </ul>
                <ul className="space-y-4">
                  <li>Bender, Emily M., et al. "On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?" FAccT (2021).</li>
                  <li>Schwartz, Roy, et al. "Green AI." Communications of the ACM 63.12 (2020).</li>
                  <li>Luccioni, Alexandra Sasha, et al. "Estimating the Carbon Footprint of BLOOM, a 176B Parameter Language Model." arXiv (2022).</li>
                </ul>
              </div>
              <div className="mt-20 pt-8 border-t border-border flex justify-between items-center text-[10px] font-mono text-muted uppercase tracking-widest">
                <span>© 2026 Research Explainer</span>
                <span>Hardware Politics Series</span>
              </div>
            </div>
          </footer>
        </div>
      ),
    },
  ];

  const goToNext = () => setActiveSection((prev) => Math.min(prev + 1, slides.length - 1));
  const goToPrev = () => setActiveSection((prev) => Math.max(prev - 1, 0));

  return (
    <div className="h-screen overflow-hidden selection:bg-teal/30">
      <header className="h-16 border-b border-border bg-bg/95 backdrop-blur-sm flex items-center px-4 md:px-6">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPrev}
              disabled={activeSection === 0}
              className="h-9 w-9 border border-border rounded-sm flex items-center justify-center text-muted disabled:opacity-40 disabled:cursor-not-allowed hover:text-text transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={goToNext}
              disabled={activeSection === slides.length - 1}
              className="h-9 w-9 border border-border rounded-sm flex items-center justify-center text-muted disabled:opacity-40 disabled:cursor-not-allowed hover:text-text transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSection(index)}
                className={`text-[10px] uppercase tracking-[0.25em] px-3 py-2 border rounded-sm transition-colors ${
                  activeSection === index
                    ? "border-teal text-teal bg-teal/10"
                    : "border-border text-muted hover:text-text"
                }`}
              >
                {slide.label}
              </button>
            ))}
          </div>

          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {activeSection + 1} / {slides.length}
          </div>
        </div>
      </header>

      <main className="h-[calc(100vh-4rem)] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[activeSection].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="h-full"
          >
            {slides[activeSection].content}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
