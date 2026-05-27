import { useEffect, useRef, useState } from 'react';
import { members } from '../data/members';

const MIN_DISPLAY_DELAY = 200; // ms : si tout est chargé avant, on n'affiche jamais le loader

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    let loaded = 0;
    const total = members.length;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      // Si on n'a pas eu le temps d'afficher le contenu (< 200ms), on cache direct
      if (!showContent) {
        setHidden(true);
      } else {
        setFading(true);
        setTimeout(() => setHidden(true), 500);
      }
    };

    const onOne = () => {
      loaded += 1;
      setProgress(Math.round((loaded / total) * 100));
      if (loaded >= total) finish();
    };

    members.forEach((m) => {
      const img = new Image();
      img.onload = onOne;
      img.onerror = onOne;
      img.src = m.pfp;
    });

    const safety = setTimeout(finish, 3500);
    const showTimer = setTimeout(() => {
      if (!doneRef.current) setShowContent(true);
    }, MIN_DISPLAY_DELAY);

    return () => {
      clearTimeout(safety);
      clearTimeout(showTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-check si done est arrive apres que showContent est devenu true
  useEffect(() => {
    if (showContent && doneRef.current && !fading) {
      setFading(true);
      const t = setTimeout(() => setHidden(true), 500);
      return () => clearTimeout(t);
    }
  }, [showContent, fading]);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink transition-opacity duration-500"
      style={{ opacity: fading ? 0 : 1, pointerEvents: fading ? 'none' : 'auto' }}
    >
      {showContent && (
        <div className="flex flex-col items-center leading-none">
          <span className="font-display text-2xl md:text-3xl tabular-nums text-bone mb-4">
            {progress}
          </span>
          <span className="font-display text-[40vw] md:text-[22rem] text-bone">%</span>
        </div>
      )}
    </div>
  );
}
