import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  layer: number; // For parallax
  vx: number; // Velocity x for floating
  vy: number; // Velocity y for floating
  maxOpacity: number;
}

interface ShootingStar {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  age: number;
  maxAge: number;
  brightness: number;
}

interface SpaceBackgroundProps {
  parallaxX?: number;
  parallaxY?: number;
}

export function SpaceBackground({ parallaxX = 0, parallaxY = 0 }: SpaceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const timeRef = useRef(0);
  const animationIdRef = useRef<number>();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();

    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Initialize stars
    const initStars = () => {
      starsRef.current = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 3500); // Very dense star field
      
      for (let i = 0; i < starCount; i++) {
        const layer = Math.random();
        const brightness = Math.random();
        
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: brightness > 0.8 ? 3.0 : brightness > 0.5 ? 2.5 : 2.0, // Very large, highly visible stars
          opacity: Math.random() * 0.5 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
          layer, // 0-1, affects parallax speed
          vx: (Math.random() - 0.5) * 0.2 * (0.5 + layer), // Slower for far stars
          vy: (Math.random() - 0.5) * 0.2 * (0.5 + layer),
          maxOpacity: brightness * 0.1 + 0.9, // Range: 0.9 to 1.0 for maximum brightness
        });
      }
    };
    initStars();

    // Draw black background
    const drawBackground = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Draw a sharp, crisp star
    const drawStar = (star: Star, time: number) => {
      // Twinkling effect using sine wave
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
      // Opacity stays at maximum brightness, ranges from 90% to 100% of maxOpacity for very subtle twinkling
      const currentOpacity = star.maxOpacity * (0.9 + 0.1 * (twinkle + 1) / 2);

      // Draw star as solid, sharp circle - NO glow or blur
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
      ctx.fill();
    };

    // Draw shooting star
    const drawShootingStar = (star: ShootingStar) => {
      const progress = star.age / star.maxAge;
      const trailOpacity = (1 - progress) * star.brightness;

      // Trail with glow effect
      const trailLength = 120;
      const gradient = ctx.createLinearGradient(
        star.x,
        star.y,
        star.x - star.velocityX * trailLength,
        star.y - star.velocityY * trailLength
      );
      
      if (isDark) {
        gradient.addColorStop(0, `rgba(255, 220, 150, ${trailOpacity * 1.2})`);
        gradient.addColorStop(0.3, `rgba(150, 200, 255, ${trailOpacity * 0.8})`);
        gradient.addColorStop(0.7, `rgba(100, 150, 255, ${trailOpacity * 0.3})`);
      } else {
        gradient.addColorStop(0, `rgba(255, 230, 180, ${trailOpacity * 1.2})`);
        gradient.addColorStop(0.3, `rgba(180, 220, 255, ${trailOpacity * 0.8})`);
        gradient.addColorStop(0.7, `rgba(150, 180, 255, ${trailOpacity * 0.3})`);
      }
      gradient.addColorStop(1, "rgba(100, 150, 255, 0)");

      // Trail with glow
      ctx.shadowColor = `rgba(150, 200, 255, ${trailOpacity * 0.6})`;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(
        star.x - star.velocityX * trailLength,
        star.y - star.velocityY * trailLength
      );
      ctx.stroke();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Bright star head with glow
      ctx.shadowColor = `rgba(255, 220, 150, ${trailOpacity * 0.8})`;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(trailOpacity * 2, 1)})`;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    };

    // Update positions
    const updateStars = () => {
      starsRef.current.forEach((star) => {
        // Floating movement
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around screen
        if (star.x < -20) star.x = canvas.width + 20;
        if (star.x > canvas.width + 20) star.x = -20;
        if (star.y < -20) star.y = canvas.height + 20;
        if (star.y > canvas.height + 20) star.y = -20;
      });
    };

    // Update shooting stars
    const updateShootingStars = () => {
      shootingStarsRef.current = shootingStarsRef.current.filter(
        (star) => star.age < star.maxAge
      );

      shootingStarsRef.current.forEach((star) => {
        star.x += star.velocityX;
        star.y += star.velocityY;
        star.age++;
      });

      // Randomly spawn new shooting stars - occasional but regular occurrences
      if (Math.random() < 0.0035 && shootingStarsRef.current.length < 2) {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * (canvas.height * 0.7); // Upper 70% of screen
        const angle = Math.random() * Math.PI / 4 + Math.PI / 8; // 22.5-67.5 degrees down-right
        const speed = Math.random() * 4 + 6; // Faster: 6-10 pixels per frame

        shootingStarsRef.current.push({
          x: startX,
          y: startY,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed,
          age: 0,
          maxAge: 120, // Slightly longer duration for visibility
          brightness: Math.random() * 0.4 + 0.8, // Brighter: 0.8-1.2
        });
      }
    };

    // Main animation loop
    const animate = (time: number) => {
      timeRef.current = time / 16; // Normalize for consistent speed

      // Draw background
      drawBackground();

      // Update and draw stars
      updateStars();
      starsRef.current.forEach((star) => {
        drawStar(star, timeRef.current);
      });

      // Update and draw shooting stars
      updateShootingStars();
      shootingStarsRef.current.forEach((star) => {
        drawShootingStar(star);
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [isDark]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        display: "block",
        transformOrigin: "center center",
      }}
      animate={{
        x: parallaxX,
        y: parallaxY,
        scale: 1.4,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 30,
        mass: 1,
      }}
    />
  );
}
