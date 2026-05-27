import { useEffect, useRef, useState } from 'react';

export default function SplitReveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const words = String(children).split(' ');
  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block align-bottom mr-[0.25em]"
          style={{ clipPath: 'inset(-0.15em -0.4em 0 -0.4em)' }}
        >
          <span
            className="inline-block transition-transform duration-700"
            style={{
              transform: visible ? 'translateY(0)' : 'translateY(110%)',
              transitionDelay: `${delay + i * 60}ms`,
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {w}
          </span>
        </span>
      ))}
    </span>
  );
}
