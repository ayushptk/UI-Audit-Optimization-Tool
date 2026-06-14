// @ts-nocheck
'use client';
import React, { useEffect, useRef } from 'react';

const UiGridParticles = ({
  gridGap = 24,
  gridAlpha = 0.12,
  lineColor = '#111827',
  markerColor = '#4F46E5',
  linkDist = 110,
  markerCount = 26,
  markerSize = 1.6,
  drift = 0.15,
}) => {
  const canvasRef = useRef(null);
  const rafRef = useRef();
  const markersRef = useRef([]);
  const parallaxRef = useRef({ x: 0, y: 0, t: 0 });

  const init = (canvas) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(
        14,
        Math.min(
          markerCount,
          Math.floor((rect.width * rect.height) / 30000) + 16
        )
      );

      markersRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() * 2 - 1) * drift,
        vy: (Math.random() * 2 - 1) * drift,
      }));
    };

    const onMouseMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      parallaxRef.current.x += (nx - parallaxRef.current.x) * 0.08;
      parallaxRef.current.y += (ny - parallaxRef.current.y) * 0.08;
    };

    const drawGrid = (width, height) => {
      if (gridGap <= 0) return;

      ctx.save();
      ctx.strokeStyle = `rgba(17, 24, 39, ${gridAlpha})`;
      ctx.lineWidth = 1;

      const px = parallaxRef.current.x * 8;
      const py = parallaxRef.current.y * 8;

      for (let x = px % gridGap; x < width; x += gridGap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = py % gridGap; y < height; y += gridGap) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.restore();
    };

    const step = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      drawGrid(width, height);

      for (const m of markersRef.current) {
        m.x += m.vx;
        m.y += m.vy;

        if (m.x < -20) m.x = width + 20;
        if (m.x > width + 20) m.x = -20;
        if (m.y < -20) m.y = height + 20;
        if (m.y > height + 20) m.y = -20;

        m.vx += (Math.random() - 0.5) * 0.002;
        m.vy += (Math.random() - 0.5) * 0.002;

        const sp = Math.hypot(m.vx, m.vy);
        const max = drift;
        if (sp > max) {
          m.vx = (m.vx / sp) * max;
          m.vy = (m.vy / sp) * max;
        }
      }

      ctx.save();
      ctx.lineWidth = 1;
      for (let i = 0; i < markersRef.current.length; i++) {
        for (let j = i + 1; j < markersRef.current.length; j++) {
          const a = markersRef.current[i];
          const b = markersRef.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);

          if (d < linkDist) {
            const alpha = Math.min(0.35, (1 - d / linkDist) * 0.35);
            ctx.strokeStyle = `rgba(79, 70, 229, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      ctx.save();
      ctx.fillStyle = markerColor;
      ctx.globalAlpha = 0.8;
      for (const m of markersRef.current) {
        ctx.beginPath();
        ctx.arc(m.x, m.y, markerSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      rafRef.current = requestAnimationFrame(step);
    };

    resize();
    step();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    canvas.addEventListener('mousemove', onMouseMove);

    return () => {
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return init(canvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default UiGridParticles;
