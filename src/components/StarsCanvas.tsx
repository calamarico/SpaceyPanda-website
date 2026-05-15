import { useEffect, useRef } from "react";

type Hue = "white" | "cyan" | "magenta";

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  hue: Hue;
  drift: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export function StarsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let stars: Star[] = [];
    const shootingStars: ShootingStar[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let t = 0;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedMotionQuery.matches;

    const pickHue = (): Hue => {
      const r = Math.random();
      if (r > 0.85) return "cyan";
      if (r > 0.7) return "magenta";
      return "white";
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const count = Math.floor((w * h) / 4500);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.2,
        baseAlpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        hue: pickHue(),
        drift: (Math.random() - 0.5) * 0.04,
      }));

      if (reduced) drawStatic();
    };

    const spawnShooting = () => {
      shootingStars.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.5,
        vx: 3 + Math.random() * 3,
        vy: 1 + Math.random() * 2,
        life: 0,
        maxLife: 80 + Math.random() * 40,
      });
    };

    const fillForHue = (hue: Hue, alpha: number) => {
      if (hue === "cyan") return `rgba(103, 232, 249, ${alpha})`;
      if (hue === "magenta") return `rgba(244, 114, 208, ${alpha})`;
      return `rgba(246, 245, 255, ${alpha})`;
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.fillStyle = fillForHue(s.hue, s.baseAlpha);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 1;

      for (const s of stars) {
        s.x += s.drift;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        const a = s.baseAlpha * (0.6 + 0.4 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset));
        ctx.fillStyle = fillForHue(s.hue, a);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.r > 1.1 && a > 0.5) {
          ctx.fillStyle = fillForHue(s.hue, a * 0.2);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (Math.random() < 0.003 && shootingStars.length < 2) spawnShooting();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life += 1;
        const alpha = Math.sin((ss.life / ss.maxLife) * Math.PI) * 0.85;
        const grad = ctx.createLinearGradient(
          ss.x,
          ss.y,
          ss.x - ss.vx * 12,
          ss.y - ss.vy * 12,
        );
        grad.addColorStop(0, `rgba(246, 245, 255, ${alpha})`);
        grad.addColorStop(0.4, `rgba(244, 114, 208, ${alpha * 0.6})`);
        grad.addColorStop(1, "rgba(246, 245, 255, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 12, ss.y - ss.vy * 12);
        ctx.stroke();
        if (ss.life > ss.maxLife) shootingStars.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduced) {
        drawStatic();
      } else {
        raf = requestAnimationFrame(draw);
      }
    };

    const onMotionChange = (e: MediaQueryListEvent) => {
      reduced = e.matches;
      start();
    };

    resize();
    start();
    window.addEventListener("resize", resize);
    reducedMotionQuery.addEventListener("change", onMotionChange);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      reducedMotionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="sp-stars" aria-hidden />;
}
