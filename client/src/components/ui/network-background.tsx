import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface NetworkBackgroundProps {
  mouseX: number;
  mouseY: number;
}

export function NetworkBackground({ mouseX, mouseY }: NetworkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<Point[]>([]);
  const requestRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize points - make them more sparse
    const initPoints = () => {
      const numPoints = Math.floor((canvas.width * canvas.height) / 40000); // Reduced density
      points.current = Array.from({ length: numPoints }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, // Slower movement
        vy: (Math.random() - 0.5) * 0.3,
      }));
    };
    initPoints();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update points with subtle movement
      points.current.forEach(point => {
        // Add mouse influence - more subtle
        const dx = mouseX - point.x;
        const dy = mouseY - point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) { // Reduced influence radius
          point.vx -= (dx / dist) * 0.01;
          point.vy -= (dy / dist) * 0.01;
        }

        // Update position
        point.x += point.vx;
        point.y += point.vy;

        // Bounce off edges
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

        // Apply stronger friction for slower movement
        point.vx *= 0.98;
        point.vy *= 0.98;
      });

      // Draw connections - thinner and more subtle
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'; // More transparent
      ctx.lineWidth = 0.5; // Thinner lines

      points.current.forEach((point, i) => {
        points.current.slice(i + 1).forEach(otherPoint => {
          const dx = point.x - otherPoint.x;
          const dy = point.y - otherPoint.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) { // Shorter connection distance
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(otherPoint.x, otherPoint.y);
            ctx.stroke();
          }
        });
      });

      // Draw points - smaller and more subtle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      points.current.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2); // Smaller points
        ctx.fill();
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [mouseX, mouseY]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 bg-gradient-to-br from-[#6B46C1] to-[#9F7AEA]" // Updated purple gradient
    />
  );
}