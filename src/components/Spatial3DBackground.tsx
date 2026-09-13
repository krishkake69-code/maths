import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Spatial3DBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 700;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for floating 3D mathematical shapes
    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);

    // 3D Polyhedra & Geometric Shapes drifting in 3D space
    const geometries = [
      new THREE.IcosahedronGeometry(1.6, 0),
      new THREE.OctahedronGeometry(1.4, 0),
      new THREE.TetrahedronGeometry(1.5, 0),
      new THREE.DodecahedronGeometry(1.5, 0),
      new THREE.TorusGeometry(1.3, 0.35, 12, 24),
      new THREE.IcosahedronGeometry(2.0, 1),
    ];

    const shapes: {
      mesh: THREE.Mesh;
      line: THREE.LineSegments;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      floatSpeed: number;
      initialY: number;
    }[] = [];

    const colors = [0x6366f1, 0x8b5cf6, 0xf59e0b, 0x10b981, 0x38bdf8];

    // Create floating wireframe & translucent 3D solids
    for (let i = 0; i < 9; i++) {
      const geom = geometries[i % geometries.length];
      const color = colors[i % colors.length];

      // Translucent inner solid
      const mat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.04,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geom, mat);

      // Crisp glowing wireframe edge
      const wireframeGeom = new THREE.WireframeGeometry(geom);
      const wireMat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.28,
        linewidth: 1
      });
      const wireframe = new THREE.LineSegments(wireframeGeom, wireMat);
      mesh.add(wireframe);

      // Random 3D spatial positioning
      const spreadX = 36;
      const spreadY = 18;
      const spreadZ = 16;

      mesh.position.set(
        (Math.random() - 0.5) * spreadX,
        (Math.random() - 0.5) * spreadY,
        (Math.random() - 0.5) * spreadZ - 4
      );

      const scale = Math.random() * 0.7 + 0.6;
      mesh.scale.set(scale, scale, scale);

      floatingGroup.add(mesh);

      shapes.push({
        mesh,
        line: wireframe,
        rotSpeedX: (Math.random() - 0.5) * 0.008,
        rotSpeedY: (Math.random() - 0.5) * 0.008,
        rotSpeedZ: (Math.random() - 0.5) * 0.006,
        floatSpeed: Math.random() * 0.001 + 0.0008,
        initialY: mesh.position.y
      });
    }

    // Floating 3D Star/Coordinate Point Cloud
    const particleCount = 70;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 45;
      positions[i + 1] = (Math.random() - 0.5) * 30;
      positions[i + 2] = (Math.random() - 0.5) * 25;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.14,
      transparent: true,
      opacity: 0.45
    });
    const pointCloud = new THREE.Points(particleGeom, particleMat);
    scene.add(pointCloud);

    // Mouse movement parallax in 3D
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotY = mouseX * 0.25;
      targetRotX = -mouseY * 0.18;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animId: number;
    let time = 0;

    const animate = () => {
      time += 0.015;

      // Smooth camera sway with mouse
      floatingGroup.rotation.y += (targetRotY - floatingGroup.rotation.y) * 0.04;
      floatingGroup.rotation.x += (targetRotX - floatingGroup.rotation.x) * 0.04;

      pointCloud.rotation.y = time * 0.02;

      // Rotate and float each 3D shape
      shapes.forEach((item, idx) => {
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
        item.mesh.rotation.z += item.rotSpeedZ;
        item.mesh.position.y = item.initialY + Math.sin(time + idx) * 0.6;
      });

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    />
  );
}
