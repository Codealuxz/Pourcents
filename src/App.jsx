import { useEffect, useState } from 'react';
import LightRays from './components/LightRays';
import ClickSpark from './components/ClickSpark';
import GradualBlur from './components/GradualBlur';
import GooeyNav from './components/GooeyNav';
import Lanyard from './components/Lanyard';
import CurvedLoop from './components/CurvedLoop';
import ScrollReveal from './components/ScrollReveal';
import Counter from './components/Counter';
import FloatingMembers from './components/FloatingMembers';
import Loader from './components/Loader';
import { members, formatCount } from './data/members';

const navItems = [
  { label: 'Accueil', href: '#hero' },
  { label: 'Membres', href: '#roster' },
  { label: 'Chiffres', href: '#palmares' },
];

const TOTAL_SUBS = 1349618;

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [subsValue, setSubsValue] = useState(0);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const onScroll = () => {
      const max = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      setScrollProgress(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Trigger l'animation du compteur quand la section devient visible
  useEffect(() => {
    const handle = () => {
      const el = document.getElementById('subs-counter');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85 && subsValue === 0) {
        setSubsValue(TOTAL_SUBS);
      }
    };
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, [subsValue]);

  return (
    <ClickSpark sparkColor="#ffffff" sparkSize={10} sparkRadius={20} sparkCount={10} duration={500}>
      <Loader />
      <div className="min-h-screen bg-ink text-bone relative">
        {/* NAVBAR pill flottante */}
        <header className="fixed top-6 left-0 right-0 z-[200] flex justify-center pointer-events-none">
          <div className="pointer-events-auto rounded-[14px] border border-white/15 bg-black p-2 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <GooeyNav
              items={navItems}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              initialActiveIndex={0}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 4]}
            />
          </div>
        </header>

        {/* HERO : ColorBends en fond + Lanyard au centre */}
        <section id="hero" className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0">
            <LightRays
              raysOrigin="top-center"
              raysColor="#ffffff"
              raysSpeed={1.2}
              lightSpread={0.8}
              rayLength={1.4}
              followMouse
              mouseInfluence={0.15}
              noiseAmount={0.08}
              distortion={0.05}
              saturation={1}
            />
          </div>

          {/* CurvedLoop en bas du hero (remonte sur mobile) */}
          <div className="absolute bottom-24 md:bottom-0 left-0 right-0 z-20 pointer-events-auto">
            <CurvedLoop
              marqueeText="LES POURCENTS ✦ ON EST LES MEILLEURS ✦ MS CREATORS ✦ "
              speed={1.2}
              curveAmount={120}
              direction="right"
              interactive
            />
          </div>

          {/* Colonnes membres aimantes a la souris : 4 a gauche, 4 a droite */}
          <FloatingMembers />
        </section>

        {/* Texte explicatif anime au scroll */}
        <section className="relative px-6 md:px-10 pt-12 pb-32 max-w-5xl mx-auto">
          <ScrollReveal
            baseOpacity={0.05}
            enableBlur
            baseRotation={4}
            blurStrength={6}
            textClassName="font-display !font-black tracking-tight"
            wordAnimationStart="top 40%"
            wordAnimationEnd="bottom 50%"
          >
            Les Pourcents sont nés d'une obsession simple : prouver qu'on peut être le clan le plus actif, le plus régulier et le plus haut de MS Creators. On donne les meilleurs feedbacks. On remplit les podiums. On fait la GDC. Pas un clan, un standard.
          </ScrollReveal>
        </section>

        {/* Compteur abonnes cumules */}
        <section id="subs-counter" className="relative px-6 md:px-10 py-32 max-w-5xl mx-auto text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-8">Abonnés cumulés des plus gros</p>
          <div className="flex items-center justify-center gap-2 font-display" style={{ height: isMobile ? 80 : 120 }}>
            <Counter
              value={subsValue}
              places={[1000000, 100000, 10000, 1000, 100, 10, 1]}
              fontSize={isMobile ? 64 : 110}
              padding={8}
              gap={4}
              horizontalPadding={0}
              textColor="#f3f1ec"
              fontWeight={900}
              gradientFrom="#050505"
              gradientTo="transparent"
              gradientHeight={20}
            />
            <span
              className="font-display font-black text-bone leading-none flex items-center"
              style={{ fontSize: isMobile ? 64 : 110, height: isMobile ? 80 : 120 }}
            >+</span>
          </div>
        </section>

        {/* Lanyard fixed : sur mobile -> disparait au scroll, sur desktop -> glisse a gauche */}
        <div
          className="fixed inset-0 z-[100]"
          style={{
            opacity: isMobile && scrollProgress > 0.05 ? 0 : 1,
            pointerEvents: isMobile && scrollProgress > 0.05 ? 'none' : 'auto',
            transition: 'opacity 0.4s ease-out',
          }}
        >
          <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} fov={20} transparent scrollProgress={scrollProgress} />
        </div>

        {/* Les membres du clan, triés par audience YouTube */}
        <section id="roster" className="relative px-6 md:px-10 py-32 max-w-6xl mx-auto">
          <h2 className="font-display text-4xl md:text-6xl font-black leading-none mb-3">Nos meilleurs membres</h2>
          <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-8">Sur YouTube seulement</p>

          <div className="mt-16 border-t border-white/10">
            {members.map((m, i) => (
              <a
                key={m.channelId}
                href={`https://www.youtube.com/channel/${m.channelId}`}
                target="_blank"
                rel="noreferrer"
                className="group grid grid-cols-12 items-center gap-4 md:gap-8 px-2 md:px-4 py-5 border-b border-white/10 hover:bg-white/[0.02] transition-colors"
              >
                <span className="col-span-1 font-mono text-xs text-white/40 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="col-span-7 md:col-span-5 flex items-center gap-4 min-w-0">
                  <img
                    src={m.pfp}
                    alt={m.name}
                    loading="lazy"
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="min-w-0">
                    <p className="font-display font-black text-lg md:text-2xl truncate">{m.name}</p>
                    <p className="font-mono text-[10px] md:text-xs text-white/40 truncate">@{m.handle}</p>
                  </div>
                </div>
                <div className="col-span-2 md:col-span-3 text-right md:text-left">
                  <p className="font-display font-bold text-base md:text-xl tabular-nums">{formatCount(m.subs)}</p>
                  <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-white/40">abonnés</p>
                </div>
                <div className="col-span-2 md:col-span-2 text-right">
                  <p className="font-display font-bold text-base md:text-xl tabular-nums">{formatCount(m.views)}</p>
                  <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-white/40">vues</p>
                </div>
                <span className="hidden md:flex col-span-1 justify-end items-center text-white/30 group-hover:text-bone group-hover:translate-x-1 transition-all">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </section>

        <section id="palmares" className="relative px-6 md:px-10 py-32 max-w-6xl mx-auto">
          <h2 className="font-display text-4xl md:text-6xl font-black leading-none mb-8">Les chiffres.</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-white/10">
            {[
              { v: 27, l: 'Membres' },
              { v: 11, l: 'Pros' },
              { v: 4, l: 'Intervenants' },
              { v: 3, l: 'Chefs de clan' },
            ].map((s) => (
              <div key={s.l} className="border-r border-b border-white/10 p-8">
                <div className="font-display text-6xl md:text-8xl font-black leading-none">{s.v}</div>
                <p className="mt-4 font-mono text-xs uppercase tracking-widest text-white/60">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative px-6 md:px-10 py-40 max-w-6xl mx-auto">
          <h2 className="font-display text-4xl md:text-6xl font-black leading-[0.95] tracking-tighter">
            On gagne pas <br />
            <span className="text-bone">parce qu'on veut.</span>
          </h2>
        </section>

        <footer className="border-t border-white/10 px-6 md:px-10 py-8">
          <div className="max-w-6xl mx-auto flex justify-between items-center font-mono text-xs uppercase tracking-widest text-white/40">
            <span>% · Les Pourcents</span>
            <a
              href="https://discord.gg/codealuxz"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 hover:text-bone transition-colors"
            >
              <span>by Codealuxz</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="opacity-60 group-hover:opacity-100 transition-opacity">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
          </div>
        </footer>

      </div>
    </ClickSpark>
  );
}
