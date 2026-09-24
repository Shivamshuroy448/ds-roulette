import React, { useRef, useEffect } from 'react';

export default function MotionBackground({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Warm, delicate ambient floating motes (like dust motes in gentle lamplight)
    const motes = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -0.05 - Math.random() * 0.15, // gently drifting upwards
      size: 0.6 + Math.random() * 1.2,
      opacity: 0.15 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2
    }));

    let time = 0;

    const render = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);

      // Deep, matte background
      ctx.fillStyle = theme?.bodyBg || '#13110f';
      ctx.fillRect(0, 0, width, height);

      // 1. Soft Warm Radial Desk-Lamp Vignette at the center
      const centerX = width / 2;
      const centerY = height * 0.45;
      const maxRadius = Math.max(width, height) * 0.7;

      const lampGrad = ctx.createRadialGradient(
        centerX, centerY, 50,
        centerX, centerY, maxRadius
      );
      
      if (theme?.id === 'kyoto') {
        lampGrad.addColorStop(0, 'rgba(212, 180, 131, 0.07)');
        lampGrad.addColorStop(0.5, 'rgba(194, 155, 127, 0.03)');
        lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      } else if (theme?.id === 'matcha') {
        lampGrad.addColorStop(0, 'rgba(126, 161, 147, 0.08)');
        lampGrad.addColorStop(0.5, 'rgba(207, 181, 132, 0.02)');
        lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      } else {
        lampGrad.addColorStop(0, 'rgba(226, 232, 240, 0.05)');
        lampGrad.addColorStop(0.5, 'rgba(148, 163, 184, 0.02)');
        lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      }

      ctx.fillStyle = lampGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Whispering floating motes (calming & subtle)
      ctx.save();
      motes.forEach((mote) => {
        mote.x += mote.vx;
        mote.y += mote.vy;

        if (mote.y < -10) {
          mote.y = height + 10;
          mote.x = Math.random() * width;
        }
        if (mote.x < -10) mote.x = width + 10;
        if (mote.x > width + 10) mote.x = -10;

        const pulse = 0.5 + 0.5 * Math.sin(time * 2 + mote.phase);
        const currentOpacity = mote.opacity * (0.6 + 0.4 * pulse);

        ctx.fillStyle = theme?.id === 'kyoto' 
          ? `rgba(232, 223, 209, ${currentOpacity})`
          : `rgba(240, 245, 245, ${currentOpacity})`;

        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
}
