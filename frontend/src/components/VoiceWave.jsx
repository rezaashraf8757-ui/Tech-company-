import { useEffect, useRef } from 'react';

export default function VoiceWave({ active, color = 'cyan' }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener('resize', resize);

    const bars = 40;
    const barWidth = canvas.offsetWidth / bars;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const gradient = ctx.createLinearGradient(0, canvas.offsetHeight, 0, 0);
      if (color === 'cyan') {
        gradient.addColorStop(0, 'rgba(14, 165, 233, 0.8)');
        gradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.5)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.3)');
      } else if (color === 'purple') {
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
        gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.5)');
        gradient.addColorStop(1, 'rgba(236, 72, 153, 0.3)');
      } else {
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.8)');
        gradient.addColorStop(0.5, 'rgba(74, 222, 128, 0.5)');
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0.3)');
      }

      ctx.fillStyle = gradient;

      for (let i = 0; i < bars; i++) {
        let height;
        if (active) {
          const base = Math.sin(time * 0.05 + i * 0.3) * 0.5 + 0.5;
          const noise = Math.random() * 0.3;
          height = (base + noise) * canvas.offsetHeight * 0.9;
        } else {
          height = 3 + Math.sin(time * 0.02 + i * 0.5) * 2;
        }

        const x = i * barWidth + barWidth * 0.2;
        const y = canvas.offsetHeight - height;
        const w = barWidth * 0.6;

        ctx.beginPath();
        ctx.roundRect(x, y, w, height, 4);
        ctx.fill();
      }

      time++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [active, color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-24 rounded-lg"
      style={{ display: 'block' }}
    />
  );
}
