import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/topics';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Play, Shuffle, Sparkles } from 'lucide-react';

export default function Wheel({ topics, onTopicSelected, isSpinning, setIsSpinning, theme }) {
  const { recordSpin } = useAuth();
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const currentAngleRef = useRef(0);
  const lastSectorRef = useRef(-1);
  const lastTopicIdRef = useRef(null);
  const [needleDeflection, setNeedleDeflection] = useState(0);

  const formatLabel = (title, maxLen = 17) => {
    if (!title) return '';
    return title.length > maxLen ? title.substring(0, maxLen - 1) + '…' : title;
  };

  const drawWheel = useCallback((angle) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 22;

    ctx.clearRect(0, 0, width, height);

    if (topics.length === 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = theme?.bodyBg || '#13110f';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = theme?.textMuted || '#9e9589';
      ctx.font = '500 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Select at least 1 topic on the wheel', centerX, centerY);
      ctx.restore();
      return;
    }

    const sliceAngle = (Math.PI * 2) / topics.length;

    // 1. Soft matte drop shadow under wheel
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 12;
    ctx.stroke();
    ctx.restore();

    // 2. Draw Wheel Slices with muted, matte, organic gradients
    topics.forEach((topic, i) => {
      const cat = CATEGORIES[topic.category] || { color: '#cfb584' };
      const startA = angle + i * sliceAngle;
      const endA = startA + sliceAngle;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startA, endA);
      ctx.closePath();

      // Muted tonal gradient: from deep espresso charcoal to soft earthy pigment
      const grad = ctx.createRadialGradient(
        centerX, centerY, radius * 0.2,
        centerX, centerY, radius
      );
      
      const isEven = i % 2 === 0;
      grad.addColorStop(0, '#161412');
      grad.addColorStop(0.4, isEven ? '#1e1a16' : '#181512');
      grad.addColorStop(0.85, cat.color + (isEven ? '65' : '45'));
      grad.addColorStop(1, cat.color + (isEven ? '80' : '60'));

      ctx.fillStyle = grad;
      ctx.fill();

      // Subtle, refined hairline divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Sector Label
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startA + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      
      // Crisp warm cream typography
      ctx.fillStyle = '#f5efe6';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 3;

      const fontSize = topics.length > 14 ? 10 : topics.length > 10 ? 11 : 12;
      ctx.font = `500 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

      const label = formatLabel(topic.title, topics.length > 12 ? 15 : 19);
      ctx.fillText(label, radius - 24, 0);

      // Delicate category accent dot
      ctx.beginPath();
      ctx.arc(radius - 12, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = cat.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
      ctx.restore();
    });

    // 3. Subtle Vinyl Groove Micro-Rings
    ctx.save();
    [0.4, 0.6, 0.78, 0.88].forEach((scale) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * scale, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    ctx.restore();

    // 4. Precision Milled Outer Bezel & Brass Pegs
    ctx.save();
    // Outer Bezel Rim
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
    ctx.strokeStyle = theme?.rimColor || '#26221d';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Inner Metallic Hairline Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(212, 180, 131, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Subtle brushed brass pips at sector marks
    for (let i = 0; i < topics.length; i++) {
      const pegAngle = angle + i * sliceAngle;
      const px = centerX + (radius + 2) * Math.cos(pegAngle);
      const py = centerY + (radius + 2) * Math.sin(pegAngle);

      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = theme?.pegColor || '#d4b483';
      ctx.fill();
    }
    ctx.restore();

    // 5. Center Hub: Minimalist Audio Turntable Spindle
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#141210';
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 180, 131, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 42, 0, Math.PI * 2);
    ctx.fillStyle = '#1c1814';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 34, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }, [topics, theme]);

  useEffect(() => {
    drawWheel(currentAngleRef.current);
  }, [drawWheel]);

  const spin = useCallback(() => {
    if (isSpinning || topics.length === 0) return;

    recordSpin();
    sound.playWhoosh();
    setIsSpinning(true);

    // 1. Pick target topic - NEVER repeat the same topic twice in a row if topics.length > 1
    const eligible = (topics.length > 1 && lastTopicIdRef.current)
      ? topics.filter((t) => t.id !== lastTopicIdRef.current)
      : topics;
    const finalEligible = eligible.length > 0 ? eligible : topics;
    const targetTopic = finalEligible[Math.floor(Math.random() * finalEligible.length)];
    const targetIndex = topics.findIndex((t) => t.id === targetTopic.id);

    const sliceAngle = (Math.PI * 2) / topics.length;
    const pointerAngle = (3 * Math.PI) / 2;

    // Subtle random jitter inside the slice (stays safely away from boundary borders)
    const jitter = (Math.random() - 0.5) * 0.5 * sliceAngle;
    const finalNormalized = ((pointerAngle - (targetIndex + 0.5) * sliceAngle + jitter) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);

    const startAngle = currentAngleRef.current;
    const currentMod = ((startAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const forwardAngle = ((finalNormalized - currentMod) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const fullSpins = (5 + Math.floor(Math.random() * 3)) * Math.PI * 2;
    const totalRotation = fullSpins + forwardAngle;

    const duration = 4800;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth cubic deceleration
      const easeOut = 1 - Math.pow(1 - progress, 4.2);
      const currentAngle = startAngle + totalRotation * easeOut;
      currentAngleRef.current = currentAngle;

      let normalizedAngle = (pointerAngle - (currentAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const currentSector = Math.floor(normalizedAngle / sliceAngle) % topics.length;

      if (currentSector !== lastSectorRef.current) {
        lastSectorRef.current = currentSector;
        const velocityModifier = (1 - progress) * 0.5 + 0.75;
        sound.playTick(velocityModifier);

        setNeedleDeflection(1);
        setTimeout(() => setNeedleDeflection(0), 40);
      }

      drawWheel(currentAngle);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        sound.playChime();
        lastTopicIdRef.current = targetTopic.id;

        // Muted elegant celebration confetti
        confetti({
          particleCount: 50,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#d4b483', '#7ea193', '#c29b7f', '#be7b72', '#ede6db']
        });

        setTimeout(() => {
          onTopicSelected(targetTopic);
        }, 300);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [isSpinning, topics, setIsSpinning, onTopicSelected, drawWheel, recordSpin]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isSpinning && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        spin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spin, isSpinning]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-1">
      {/* Precision Stylus / Hand Pointer Needle */}
      <div className="relative z-20 -mb-4 flex flex-col items-center pointer-events-none">
        <div
          className="transition-transform duration-75 origin-top filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
          style={{
            transform: `rotate(${needleDeflection ? '-16deg' : '0deg'})`
          }}
        >
          <svg width="26" height="38" viewBox="0 0 26 38" fill="none">
            {/* Minimalist brass pointer */}
            <path
              d="M13 36L4 12C2.5 8 5 4 9 4H17C21 4 23.5 8 22 12L13 36Z"
              fill={theme?.primaryAccent || '#d4b483'}
              stroke="#ede6db"
              strokeWidth="1.2"
            />
            {/* Center pivot */}
            <circle cx="13" cy="12" r="3.5" fill="#141210" stroke="#ede6db" strokeWidth="1" />
            <circle cx="13" cy="12" r="1.5" fill={theme?.primaryAccent || '#d4b483'} />
          </svg>
        </div>
      </div>

      {/* Wheel Canvas Container */}
      <div className="relative group">
        {/* Soft, warm ambient backlight halo */}
        <div className="absolute -inset-4 rounded-full blur-2xl opacity-25 bg-amber-500/10 pointer-events-none transition-opacity" />

        <canvas
          ref={canvasRef}
          width={450}
          height={450}
          className="relative z-10 w-[330px] h-[330px] sm:w-[420px] sm:h-[420px] max-w-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
        />

        {/* Screen Reader Live Announcement */}
        <div className="sr-only" aria-live="polite">
          {isSpinning ? "The wheel is spinning..." : "Roulette wheel is idle and ready."}
        </div>

        {/* Minimalist Center Hub Button */}
        <button
          onClick={spin}
          disabled={isSpinning || topics.length === 0}
          aria-label="Spin the wheel of data science topics"
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-19 h-19 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-200 font-medium tracking-widest text-[10px] uppercase shadow-lg border focus-visible:ring-2 focus-visible:ring-[#d4b483] ${
            isSpinning
              ? 'bg-[#181512] border-white/10 text-stone-500 cursor-not-allowed scale-95'
              : 'bg-[#1e1a16] hover:bg-[#25201b] border-[#d4b483]/40 text-[#f5ede0] hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.5)]'
          }`}
        >
          {isSpinning ? (
            <span className="w-3.5 h-3.5 border-2 border-[#d4b483] border-t-transparent rounded-full animate-spin" />
          ) : (
            <div className="flex flex-col items-center gap-0.5">
              <Play className="w-4 h-4 fill-[#d4b483] text-[#d4b483] ml-0.5 opacity-90" />
              <span className="text-[10px] tracking-widest font-mono text-[#d4b483]">SPIN</span>
            </div>
          )}
        </button>
      </div>

      {/* Control Action Bar below the wheel */}
      <div className="flex items-center gap-3 mt-5 z-10">
        <button
          onClick={spin}
          disabled={isSpinning || topics.length === 0}
          aria-label="Spin dial to select a random interview concept"
          className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-medium text-xs tracking-wide transition-all duration-200 cursor-pointer border focus-visible:ring-2 focus-visible:ring-[#d4b483] ${
            isSpinning
              ? 'bg-[#1a1714]/60 text-stone-500 cursor-not-allowed border-white/5'
              : 'bg-[#221e1a] hover:bg-[#2a2520] text-[#f5ede0] border-[#d4b483]/30 hover:border-[#d4b483]/60 shadow-md hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d4b483]" />
          <span>{isSpinning ? "Selecting card..." : "Spin Dial"}</span>
          <kbd className="hidden sm:inline-block ml-1 text-[9px] bg-black/40 border border-white/10 px-1.5 py-0.5 rounded text-stone-400 font-mono">
            Space
          </kbd>
        </button>

        {/* Quick Instant Random Pick button */}
        <button
          onClick={() => {
            if (topics.length === 0) return;
            recordSpin();
            const eligible = (topics.length > 1 && lastTopicIdRef.current)
              ? topics.filter((t) => t.id !== lastTopicIdRef.current)
              : topics;
            const finalEligible = eligible.length > 0 ? eligible : topics;
            const chosen = finalEligible[Math.floor(Math.random() * finalEligible.length)];
            lastTopicIdRef.current = chosen.id;
            sound.playChime();
            onTopicSelected(chosen);
          }}
          disabled={isSpinning || topics.length === 0}
          aria-label="Quick draw: instantly select a random concept without waiting for spin"
          title="Instant draw without waiting for spin"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-xs bg-[#1a1714] hover:bg-[#221e1a] text-stone-300 hover:text-[#f5ede0] border border-white/10 hover:border-white/20 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#d4b483]"
        >
          <Shuffle className="w-3.5 h-3.5 text-stone-400" />
          <span>Quick Draw</span>
        </button>
      </div>
    </div>
  );
}
