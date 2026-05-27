import { useState } from 'react';

const tierStyles = {
  LEGEND: {
    ring: 'ring-blood',
    badge: 'bg-blood text-bone',
    label: 'LÉGENDE',
  },
  ELITE: {
    ring: 'ring-bone',
    badge: 'bg-bone text-ink',
    label: 'ÉLITE',
  },
  CORE: {
    ring: 'ring-white/30',
    badge: 'bg-smoke text-bone',
    label: 'CORE',
  },
};

export default function MemberCard({ member, index }) {
  const [hover, setHover] = useState(false);
  const t = tierStyles[member.tier];

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative border border-white/10 bg-ash overflow-hidden cursor-default transition-all duration-500 hover:border-blood"
    >
      {/* Numero */}
      <div className="absolute top-3 left-3 z-10 font-mono text-xs text-white/40 tabular-nums">
        N° {String(index + 1).padStart(2, '0')}
      </div>

      {/* Tier badge */}
      <div className={`absolute top-3 right-3 z-10 px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest ${t.badge}`}>
        {t.label}
      </div>

      {/* Avatar */}
      <div className="aspect-square relative overflow-hidden bg-ink">
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            loading="lazy"
            className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl font-display text-white/20">
            ?
          </div>
        )}
        {/* Overlay tagline */}
        <div
          className={`absolute inset-0 bg-ink/85 flex items-end p-4 transition-opacity duration-500 ${
            hover ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-bone text-sm font-medium leading-snug">
            {member.tagline}
          </p>
        </div>
        {/* Diagonal slash on hover */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${hover ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-0 right-0 w-32 h-px bg-blood origin-right rotate-45 translate-x-8 -translate-y-2" />
        </div>
      </div>

      {/* Info */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display font-bold text-lg truncate">{member.name}</h3>
          <span className="font-mono text-[10px] text-blood tracking-widest">{member.rank}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {member.grades.slice(0, 3).map((g) => (
            <span
              key={g}
              className="font-mono text-[10px] uppercase tracking-wider text-white/50 border border-white/10 px-1.5 py-0.5"
            >
              {g}
            </span>
          ))}
          {member.grades.length > 3 && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/30 px-1.5 py-0.5">
              +{member.grades.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
