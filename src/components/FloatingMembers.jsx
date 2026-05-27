import { members, formatCount } from '../data/members';
import Magnet from './Magnet';

// Positions dispersees, plus hautes qu'avant + 2 slots en bas
const SLOTS = [
  { side: 'left', x: '6%', y: '14%' },
  { side: 'left', x: '14%', y: '30%' },
  { side: 'left', x: '4%', y: '48%' },
  { side: 'left', x: '16%', y: '64%' },
  { side: 'right', x: '6%', y: '12%' },
  { side: 'right', x: '14%', y: '32%' },
  { side: 'right', x: '4%', y: '50%' },
  { side: 'right', x: '16%', y: '66%' },
];

function MemberBubble({ m, side }) {
  return (
    <Magnet padding={120} magnetStrength={3} wrapperClassName="pointer-events-auto">
      <a
        href={`https://www.youtube.com/channel/${m.channelId}`}
        target="_blank"
        rel="noreferrer"
        className={`group flex items-center gap-3 ${side === 'right' ? 'flex-row-reverse text-right' : ''}`}
      >
        <img
          src={m.pfp}
          alt={m.name}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-white/20 group-hover:ring-bone shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all"
        />
        <div>
          <p className="font-display font-bold text-sm md:text-base leading-tight whitespace-nowrap">{m.name}</p>
          <p className="font-mono text-[10px] md:text-xs text-white/60 tabular-nums leading-tight">
            {formatCount(m.subs)} abonnés
          </p>
        </div>
      </a>
    </Magnet>
  );
}

export default function FloatingMembers() {
  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      {SLOTS.map((s, i) => {
        const m = members[i];
        if (!m) return null;
        const posStyle =
          s.side === 'left'
            ? { left: s.x, top: s.y }
            : { right: s.x, top: s.y };
        return (
          <div key={m.channelId} className="absolute" style={posStyle}>
            <div className="float-anim" style={{ animationDelay: `${(i * 0.6) % 6}s`, animationDuration: `${5 + (i % 3)}s` }}>
              <MemberBubble m={m} side={s.side} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
