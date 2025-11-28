"use client";

import React, { useRef, useEffect } from "react";

// MagnetizeButton: a button that gently moves toward the cursor when nearby
// Props: children, className, style, onClick, strength (px), maxDistance (px)
export default function MagnetizeButton({
  children,
  className = "",
  style = {},
  onClick,
  strength = 0.25,
  maxDistance = 120,
}) {
  const ref = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const anim = useRef({ tx: 0, ty: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onPointerMove(e) {
      const x = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const y = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (x == null || y == null) return;
      mouse.current.x = x;
      mouse.current.y = y;
    }

    function update() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mouse.current.x - cx;
      const dy = mouse.current.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetX = 0;
      let targetY = 0;

      if (dist < maxDistance) {
        // normalized direction times influence
        const influence = (1 - dist / maxDistance) * strength * rect.width;
        targetX = dx * influence / (dist || 1);
        targetY = dy * influence / (dist || 1);
      }

      // simple lerp for smooth motion
      anim.current.tx += (targetX - anim.current.tx) * 0.15;
      anim.current.ty += (targetY - anim.current.ty) * 0.15;

      const tx = anim.current.tx.toFixed(3);
      const ty = anim.current.ty.toFixed(3);

      // apply transform and subtle scale
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${1 + Math.min(0.06, Math.hypot(anim.current.tx, anim.current.ty) / 500)})`;
      raf.current = requestAnimationFrame(update);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    raf.current = requestAnimationFrame(update);

    function reset() {
      anim.current.tx = 0;
      anim.current.ty = 0;
      if (el) el.style.transform = "translate3d(0,0,0) scale(1)";
    }

    window.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
    };
  }, [strength, maxDistance]);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={className}
      style={{ willChange: "transform", touchAction: "none", ...style }}
    >
      {children}
    </button>
  );
}
