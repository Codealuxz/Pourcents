export default function Marquee({ items, speed = 40, accent = false }) {
  const list = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/10 py-4">
      <div
        className="flex shrink-0 gap-12 whitespace-nowrap animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        {list.map((it, i) => (
          <span
            key={i}
            className={`flex items-center gap-4 font-display font-bold text-3xl md:text-5xl uppercase tracking-tight ${
              accent ? 'text-blood' : 'text-bone/80'
            }`}
          >
            {it}
            <span className="text-blood text-2xl md:text-3xl">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
