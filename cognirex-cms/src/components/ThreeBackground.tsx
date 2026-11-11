import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId = 0;
    let renderer: THREE.WebGLRenderer | null = null;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 900;
      const posArray = new Float32Array(particlesCount * 3);
      const colorsArray = new Float32Array(particlesCount * 3);

      const colorViolet = new THREE.Color(0x7c3aed);
      const colorLavender = new THREE.Color(0xa78bfa);
      const colorYellow = new THREE.Color(0xfacc15);

      for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 18;
        posArray[i + 1] = (Math.random() - 0.5) * 14;
        posArray[i + 2] = (Math.random() - 0.5) * 10 - 2;

        const r = Math.random();
        const picked = r > 0.85 ? colorYellow : r > 0.45 ? colorViolet : colorLavender;
        colorsArray[i] = picked.r;
        colorsArray[i + 1] = picked.g;
        colorsArray[i + 2] = picked.b;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
      });

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);

      const handleResize = () => {
        if (!container || !renderer) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      let mouseX = 0;
      let mouseY = 0;
      const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
      };
      window.addEventListener('mousemove', handleMouseMove);

      const clock = new THREE.Clock();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();
        particlesMesh.rotation.y = elapsed * 0.03 + mouseX * 0.4;
        particlesMesh.rotation.x = elapsed * 0.02 - mouseY * 0.4;
        renderer?.render(scene, camera);
      };
      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationFrameId);
        if (renderer && renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
        particlesGeometry.dispose();
        particlesMaterial.dispose();
        renderer?.dispose();
      };
    } catch {
      return undefined;
    }
  }, []);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
};
