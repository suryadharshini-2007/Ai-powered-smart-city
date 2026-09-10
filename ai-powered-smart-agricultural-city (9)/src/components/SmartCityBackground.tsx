import React, { useEffect, useRef } from 'react';

export const SmartCityBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particles simulating agricultural IoT sensors & energy packets
    const particleCount = Math.min(Math.floor((width * height) / 18000), 55);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      hue: number;
      pulseSpeed: number;
      pulsePhase: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.8),
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.2 - Math.random() * 0.3, // gently drifting upwards
        radius: 1 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.5,
        hue: Math.random() > 0.4 ? 155 : 190, // emerald or cyan
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // City skyline building silhouettes (static baseline geometry, glowing tops)
    const buildings: Array<{ x: number; w: number; h: number; hasSpire: boolean; windows: Array<{ x: number; y: number; on: boolean }> }> = [];
    const buildCount = Math.ceil(width / 60) + 2;
    let currentX = 0;
    for (let i = 0; i < buildCount; i++) {
      const bWidth = 40 + Math.random() * 50;
      const bHeight = 80 + Math.random() * 180;
      const bWindows: Array<{ x: number; y: number; on: boolean }> = [];
      const cols = Math.floor(bWidth / 10);
      const rows = Math.floor(bHeight / 16);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() > 0.6) {
            bWindows.push({
              x: c * 9 + 4,
              y: r * 14 + 8,
              on: Math.random() > 0.3,
            });
          }
        }
      }
      buildings.push({
        x: currentX,
        w: bWidth,
        h: bHeight,
        hasSpire: Math.random() > 0.6,
        windows: bWindows,
      });
      currentX += bWidth + (Math.random() * 8 - 4);
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Deep atmospheric background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#03070b');
      bgGrad.addColorStop(0.5, '#051118');
      bgGrad.addColorStop(1, '#02090d');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Ambient glowing tech hazes
      const glow1 = ctx.createRadialGradient(width * 0.2, height * 0.3, 20, width * 0.2, height * 0.3, width * 0.45);
      glow1.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
      glow1.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);

      const glow2 = ctx.createRadialGradient(width * 0.8, height * 0.5, 20, width * 0.8, height * 0.5, width * 0.45);
      glow2.addColorStop(0, 'rgba(14, 165, 233, 0.07)');
      glow2.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, width, height);

      // 3. Cybernetic ground horizon & perspective digital grid
      const horizonY = height * 0.82;
      ctx.save();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.lineWidth = 1;

      // Horizon line
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();

      // Perspective grid lines
      const gridVanishX = width * 0.5;
      const numRays = 24;
      for (let i = -numRays; i <= numRays; i++) {
        const spread = (i / numRays) * (width * 1.5);
        ctx.beginPath();
        ctx.moveTo(gridVanishX, horizonY);
        ctx.lineTo(gridVanishX + spread, height);
        ctx.stroke();
      }

      // Horizontal grid lines with perspective spacing
      const horizontalStepCount = 8;
      for (let j = 1; j <= horizontalStepCount; j++) {
        const t = Math.pow(j / horizontalStepCount, 2);
        const y = horizonY + t * (height - horizonY);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // 4. City Skyline Silhouette
      ctx.save();
      buildings.forEach((b) => {
        const bx = b.x;
        const by = horizonY - b.h;

        // Building body
        ctx.fillStyle = '#06131c';
        ctx.fillRect(bx, by, b.w, b.h);

        // Building subtle border
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, b.w, b.h);

        // Spire with glowing beacon
        if (b.hasSpire) {
          const spireX = bx + b.w * 0.5;
          ctx.beginPath();
          ctx.moveTo(spireX, by);
          ctx.lineTo(spireX, by - 24);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.stroke();

          // Blinking red/cyan beacon
          const beaconAlpha = 0.4 + 0.6 * Math.sin(time * 3 + b.x);
          ctx.fillStyle = `rgba(52, 211, 153, ${beaconAlpha})`;
          ctx.beginPath();
          ctx.arc(spireX, by - 24, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Tiny window lights
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        b.windows.forEach((win) => {
          if (win.on && by + win.y < horizonY - 4) {
            ctx.fillRect(bx + win.x, by + win.y, 3, 4);
          }
        });
      });
      ctx.restore();

      // 5. Connecting sensor telemetry lines
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.18;
            ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // 6. Floating Particles (IoT Sensor Pods)
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) {
          p.y = horizonY - 10;
          p.x = Math.random() * width;
        }

        const pulse = 0.7 + 0.3 * Math.sin(time * 2 + p.pulsePhase);
        const radius = p.radius * pulse;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.alpha * pulse})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 60%, 0.6)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Subtle vignette border overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,7,11,0.65)_100%)]" />
    </div>
  );
};
