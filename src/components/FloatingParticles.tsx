import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  type: 'heart' | 'star' | 'circle' | 'petal' | 'butterfly';
  opacity: number;
  bounceMultiplier: number;
  wiggleSpeed: number;
  wiggleWidth: number;
  time: number;
}

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let isTabVisible = true;

    // Detect if client prefers reduced motion or is mobile
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
    
    // Performance budgeting
    const maxParticles = prefersReducedMotion ? 0 : (isMobile ? 12 : 35);
    const enableShadows = !isMobile && !prefersReducedMotion;

    // Resize handling
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    } else {
      window.addEventListener('resize', resizeCanvas);
    }
    
    resizeCanvas();

    const colors = [
      'rgba(255, 182, 193, ', // pastel pink
      'rgba(216, 191, 216, ', // lavender
      'rgba(255, 218, 233, ', // soft pink cream
      'rgba(255, 239, 213, ', // papaya whip cream
      'rgba(230, 230, 250, ', // lavender blue
    ];

    const types: ('heart' | 'star' | 'circle' | 'petal' | 'butterfly')[] = [
      'heart', 'star', 'circle', 'petal', 'butterfly'
    ];

    const createParticle = (initBottom = false): Particle => {
      const type = types[Math.floor(Math.random() * types.length)];
      const size = Math.random() * 12 + 6;
      return {
        x: Math.random() * canvas.width,
        y: initBottom ? canvas.height + 20 : Math.random() * canvas.height,
        size,
        speedY: -(Math.random() * 0.6 + 0.3),
        speedX: (Math.random() - 0.5) * 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        color: colors[Math.floor(Math.random() * colors.length)],
        type,
        opacity: Math.random() * 0.35 + 0.25,
        bounceMultiplier: Math.random() * 0.15 + 0.05,
        wiggleSpeed: Math.random() * 0.015 + 0.005,
        wiggleWidth: Math.random() * 8 + 4,
        time: Math.random() * 100,
      };
    };

    // Initialize particles
    if (!prefersReducedMotion) {
      for (let i = 0; i < maxParticles; i++) {
        particles.push(createParticle(false));
      }
    }

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.beginPath();
      c.moveTo(x, y + size / 4);
      c.quadraticCurveTo(x, y, x + size / 2, y);
      c.quadraticCurveTo(x + size, y, x + size, y + size / 3);
      c.quadraticCurveTo(x + size, y + size * 0.7, x, y + size);
      c.quadraticCurveTo(x - size, y + size * 0.7, x - size, y + size / 3);
      c.quadraticCurveTo(x - size, y, x - size / 2, y);
      c.quadraticCurveTo(x, y, x, y + size / 4);
      c.closePath();
      c.fill();
    };

    const drawStar = (c: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      c.beginPath();
      c.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        c.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        c.lineTo(x, y);
        rot += step;
      }
      c.lineTo(cx, cy - outerRadius);
      c.closePath();
      c.fill();
    };

    const drawPetal = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.beginPath();
      c.ellipse(x, y, size * 0.6, size * 0.3, 0, 0, Math.PI * 2);
      c.closePath();
      c.fill();
    };

    const drawButterfly = (c: CanvasRenderingContext2D, x: number, y: number, size: number, time: number) => {
      const wingWiggle = Math.abs(Math.sin(time * 0.08));
      c.beginPath();
      // Left wings
      c.ellipse(x - size * 0.4, y - size * 0.2, size * wingWiggle * 0.5, size * 0.4, -0.2, 0, Math.PI * 2);
      c.ellipse(x - size * 0.35, y + size * 0.2, size * wingWiggle * 0.4, size * 0.3, 0.2, 0, Math.PI * 2);
      // Right wings
      c.ellipse(x + size * 0.4, y - size * 0.2, size * wingWiggle * 0.5, size * 0.4, 0.2, 0, Math.PI * 2);
      c.ellipse(x + size * 0.35, y + size * 0.2, size * wingWiggle * 0.4, size * 0.3, -0.2, 0, Math.PI * 2);
      c.fill();
      
      // Butterfly body
      c.fillStyle = 'rgba(255, 255, 255, 0.6)';
      c.beginPath();
      c.ellipse(x, y, size * 0.08, size * 0.45, 0, 0, Math.PI * 2);
      c.fill();
    };

    // Tab visibility handling
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Animation loop
    const animate = () => {
      if (!isTabVisible || prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        p.time += 1;
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.time * p.wiggleSpeed) * p.bounceMultiplier;
        p.rotation += p.rotationSpeed;

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = `${p.color}${p.opacity})`;

        switch (p.type) {
          case 'heart':
            drawHeart(ctx, 0, 0, p.size);
            break;
          case 'star':
            drawStar(ctx, 0, 0, 5, p.size * 0.7, p.size * 0.3);
            break;
          case 'petal':
            drawPetal(ctx, 0, 0, p.size);
            break;
          case 'butterfly':
            drawButterfly(ctx, 0, 0, p.size, p.time);
            break;
          case 'circle':
          default:
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
            break;
        }

        ctx.restore();

        // Regenerate offscreen particles
        if (p.y < -20 || p.x < -20 || p.x > canvas.width + 20) {
          particles[idx] = createParticle(true);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      id="floating-canvas"
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 opacity-70"
    />
  );
}
