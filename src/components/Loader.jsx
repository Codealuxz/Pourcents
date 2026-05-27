import { useEffect, useState } from 'react';
import { members } from '../data/members';

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let loaded = 0;
    const total = members.length;
    const onOne = () => {
      loaded += 1;
      setProgress(Math.round((loaded / total) * 100));
      if (loaded >= total) {
        setTimeout(() => setDone(true), 300);
      }
    };

    members.forEach((m) => {
      const img = new Image();
      img.onload = onOne;
      img.onerror = onOne;
      img.src = m.pfp;
    });

    // Safety : si rien charge sous 3.5s, on continue
    const safety = setTimeout(() => setDone(true), 3500);
    return () => clearTimeout(safety);
  }, []);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => setHidden(true), 700);
      return () => clearTimeout(t);
    }
  }, [done]);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ink transition-opacity duration-700"
      style={{ opacity: done ? 0 : 1, pointerEvents: done ? 'none' : 'auto' }}
    >
      <div className="font-display text-[20vw] md:text-[14rem] font-black leading-none tracking-tighter">%</div>
      <div className="mt-12 w-64 md:w-80 h-px bg-white/10 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-bone transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 font-mono text-xs uppercase tracking-widest text-white/40 tabular-nums">
        {String(progress).padStart(3, '0')}%
      </div>
    </div>
  );
}
