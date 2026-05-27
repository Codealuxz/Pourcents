import { useEffect, useRef } from 'react';

export default function Squares({ size = 48, color = 'rgba(255,255,255,0.045)', hover = 'rgba(234,41,41,0.35)', direction = 'diagonal', speed = 0.4 }) {
  const ref = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let offsetX = 0;
    let offsetY = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouse.current = { x: -1000, y: -1000 }; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      if (direction === 'diagonal') {
        offsetX = (offsetX + speed) % size;
        offsetY = (offsetY + speed) % size;
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;

      const cols = Math.ceil(w / size) + 2;
      const rows = Math.ceil(h / size) + 2;

      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          const x = i * size - offsetX;
          const y = j * size - offsetY;
          const cx = x + size / 2;
          const cy = y + size / 2;
          const dx = mouse.current.x - cx;
          const dy = mouse.current.y - cy;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            const a = 1 - dist / 140;
            ctx.fillStyle = hover.replace(/[\d.]+\)$/, (a * 0.6).toFixed(3) + ')');
            ctx.fillRect(x, y, size, size);
          }
          ctx.strokeRect(x, y, size, size);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [size, color, hover, direction, speed]);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}
