"use client";

import React, { useEffect, useRef } from "react";

interface WebOfConnectionsProps {
  side: "left" | "right";
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
}

interface PulsePacket {
  fromIndex: number;
  toIndex: number;
  progress: number; // 0 to 1
  speed: number;
  color: string;
}

export default function WebOfConnections({ side, className = "" }: WebOfConnectionsProps) {
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
      width = canvas.width = Math.max(rect.width, 360);
      height = canvas.height = Math.max(rect.height, 280);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    window.addEventListener("resize", updateSize);

    // Number of nodes based on width
    const nodeCount = Math.max(12, Math.min(22, Math.floor((width * height) / 4500)));
    const nodes: NodePoint[] = [];

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      // Bias node positions toward outer edge depending on side
      const xBias =
        side === "left"
          ? Math.pow(Math.random(), 1.4) * (width * 0.85)
          : width - Math.pow(Math.random(), 1.4) * (width * 0.85);

      nodes.push({
        x: xBias,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        baseRadius: Math.random() * 2 + 2,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        pulsePhase: Math.random() * Math.PI * 2,
        connections: [],
      });
    }

    const packets: PulsePacket[] = [];
    const maxDistance = Math.min(width, height) * 0.45;

    let lastPacketTime = 0;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw node connections
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Move
        node.x += node.vx;
        node.y += node.vy;

        // Bounce boundaries
        if (node.x < 10) {
          node.x = 10;
          node.vx *= -1;
        } else if (node.x > width - 10) {
          node.x = width - 10;
          node.vx *= -1;
        }

        if (node.y < 10) {
          node.y = 10;
          node.vy *= -1;
        } else if (node.y > height - 10) {
          node.y = height - 10;
          node.vy *= -1;
        }

        node.pulsePhase += node.pulseSpeed;
        node.connections = [];

        // Find connections with other nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            node.connections.push(j);

            // Opacity based on distance and proximity to edge
            const distRatio = 1 - dist / maxDistance;
            const alpha = Math.max(0.2, distRatio * 0.7);

            // Gradient line
            const grad = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
            grad.addColorStop(0, `rgba(167, 139, 250, ${alpha * 1.3})`);
            grad.addColorStop(0.5, `rgba(250, 204, 21, ${alpha * 0.9})`);
            grad.addColorStop(1, `rgba(139, 92, 246, ${alpha * 1.3})`);

            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = distRatio * 2 + 0.8;
            ctx.stroke();
          }
        }
      }

      // Periodically spawn signal pulse packets traveling between connected nodes
      if (time - lastPacketTime > 600 && nodes.length > 2) {
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
            speed: Math.random() * 0.015 + 0.015,
            color: Math.random() > 0.4 ? "#FACC15" : "#C4B5FD",
          });
        }
      }

      // Render traveling pulse packets
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

        // Draw packet glow
        const glow = ctx.createRadialGradient(px, py, 0, px, py, 6);
        glow.addColorStop(0, packet.color);
        glow.addColorStop(0.5, packet.color === "#FACC15" ? "rgba(250, 204, 21, 0.6)" : "rgba(196, 181, 253, 0.6)");
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const pulse = Math.sin(node.pulsePhase) * 0.4 + 1;
        const r = node.baseRadius * pulse;

        // Outer glow
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 4);
        glow.addColorStop(0, "rgba(196, 181, 253, 0.9)");
        glow.addColorStop(0.4, "rgba(124, 58, 237, 0.5)");
        glow.addColorStop(1, "rgba(31, 27, 46, 0)");

        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Node core
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
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
  }, [side]);

  return (
    <div
      className={`absolute inset-y-0 pointer-events-none select-none overflow-hidden ${
        side === "left" ? "left-0" : "right-0"
      } ${className}`}
      style={{
        maskImage:
          side === "left"
            ? "linear-gradient(to right, black 75%, transparent 100%)"
            : "linear-gradient(to left, black 75%, transparent 100%)",
        WebkitMaskImage:
          side === "left"
            ? "linear-gradient(to right, black 75%, transparent 100%)"
            : "linear-gradient(to left, black 75%, transparent 100%)",
      }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
