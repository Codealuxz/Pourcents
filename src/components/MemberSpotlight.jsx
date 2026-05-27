import { useEffect, useState } from 'react';
import { members, formatCount } from '../data/members';

export default function MemberSpotlight() {
  const [member, setMember] = useState(null);
  const [key, setKey] = useState(0);

  const pick = () => {
    const m = members[Math.floor(Math.random() * members.length)];
    setMember(m);
    setKey((k) => k + 1);
  };

  useEffect(() => {
    pick();
  }, []);

  if (!member) return null;

  return (
    <a
      key={key}
      href={`https://www.youtube.com/channel/${member.channelId}`}
      target="_blank"
      rel="noreferrer"
      className="group block animate-rise"
    >
      <div className="flex items-center gap-4 px-4 py-3 bg-black/60 backdrop-blur-md border border-white/15 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-white/40 transition-colors">
        <div className="relative">
          <img
            src={member.pfp}
            alt={member.name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-white/20"
          />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-bone rounded-full ring-2 ring-black animate-pulse" />
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 leading-none mb-1">
            ★ Featured
          </p>
          <p className="font-display font-black text-lg leading-tight truncate">{member.name}</p>
          <p className="font-mono text-xs text-white/60 tabular-nums">
            {formatCount(member.subs)} subs · {formatCount(member.views)} vues
          </p>
        </div>
        <div className="ml-2 flex flex-col gap-1.5">
          <span className="text-white/40 group-hover:text-bone group-hover:translate-x-1 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              pick();
            }}
            title="Tirer un autre membre"
            className="text-white/30 hover:text-bone transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
        </div>
      </div>
    </a>
  );
}
