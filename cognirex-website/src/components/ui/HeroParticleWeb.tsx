"use client";

import React, { useEffect, useRef } from "react";

interface HeroParticleWebProps {
  className?: string;
}

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  pulseSpeed: number;
  pulsePhase: number;
  connections: number[];
  color: string;
}

interface PulsePacket {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
}

export default function HeroParticleWeb({ className = "" }: HeroParticleWebProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = canvas.width = Math.max(rect.width, 500);
      height = canvas.height = Math.max(rect.height, 500);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => updateSize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    window.addEventListener("resize", updateSize);

    // Generate constellation nodes around the container
    const nodeCount = 28;
    const nodes: NodePoint[] = [];

    const colors = ["#7C3AED", "#9B6BFA", "#C4B5FD", "#FACC15"];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        baseRadius: Math.random() * 2.5 + 2,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        pulsePhase: Math.random() * Math.PI * 2,
        connections: [],
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const packets: PulsePacket[] = [];
    let lastPacketTime = 0;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const maxDistance = Math.min(width, height) * 0.42;

      // Update positions & draw connection lines
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        node.x += node.vx;
        node.y += node.vy;

        // Bounce at boundaries
        if (node.x < 15) {
          node.x = 15;
          node.vx *= -1;
        } else if (node.x > width - 15) {
          node.x = width - 15;
          node.vx *= -1;
        }

        if (node.y < 15) {
          node.y = 15;
          node.vy *= -1;
        } else if (node.y > height - 15) {
          node.y = height - 15;
          node.vy *= -1;
        }

        node.pulsePhase += node.pulseSpeed;
        node.connections = [];

        // Connect with nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            node.connections.push(j);

            const distRatio = 1 - dist / maxDistance;
            const alpha = distRatio * 0.65;

            const grad = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
            grad.addColorStop(0, `rgba(124, 58, 237, ${alpha})`);
            grad.addColorStop(0.5, `rgba(250, 204, 21, ${alpha * 0.85})`);
            grad.addColorStop(1, `rgba(155, 107, 250, ${alpha})`);

            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = distRatio * 2 + 0.8;
            ctx.stroke();
          }
        }
      }

      // Periodically spawn energetic signal packets traveling through the web
      if (time - lastPacketTime > 450 && nodes.length > 2) {
        lastPacketTime = time;
        const validNodes = nodes
          .map((n, idx) => ({ idx, count: n.connections.length }))
          .filter((item) => item.count > 0);

        if (validNodes.length > 0) {
          const randomNode = validNodes[Math.floor(Math.random() * validNodes.length)];
          const targetIndex =
            nodes[randomNode.idx].connections[
              Math.floor(Math.random() * nodes[randomNode.idx].connections.length)
            ];

          packets.push({
            fromIndex: randomNode.idx,
            toIndex: targetIndex,
            progress: 0,
            speed: Math.random() * 0.02 + 0.018,
            color: Math.random() > 0.4 ? "#FACC15" : "#7C3AED",
          });
        }
      }

      // Draw pulse packets
      for (let p = packets.length - 1; p >= 0; p--) {
        const packet = packets[p];
        packet.progress += packet.speed;

        if (packet.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const from = nodes[packet.fromIndex];
        const to = nodes[packet.toIndex];
        if (!from || !to) {
          packets.splice(p, 1);
          continue;
        }

        const px = from.x + (to.x - from.x) * packet.progress;
        const py = from.y + (to.y - from.y) * packet.progress;

        // Packet outer glow
        const glow = ctx.createRadialGradient(px, py, 0, px, py, 8);
        glow.addColorStop(0, packet.color);
        glow.addColorStop(0.6, packet.color === "#FACC15" ? "rgba(250, 204, 21, 0.7)" : "rgba(124, 58, 237, 0.7)");
        glow.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Packet white-hot core
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }

      // Draw node particles
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const pulse = Math.sin(node.pulsePhase) * 0.4 + 1;
        const r = node.baseRadius * pulse;

        // Outer halo
        const halo = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 3.5);
        halo.addColorStop(0, node.color === "#FACC15" ? "rgba(250, 204, 21, 0.7)" : "rgba(124, 58, 237, 0.65)");
        halo.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Sparkling center
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", updateSize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`absolute pointer-events-none select-none overflow-visible ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

