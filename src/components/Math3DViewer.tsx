import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Compass, Sparkles, Sliders, Play, Pause, Layers, Eye } from 'lucide-react';
import Button3D from './Button3D';

export type Math3DMode = 'vectors' | 'saddle' | 'plane' | 'polyhedron';

interface Math3DViewerProps {
  initialMode?: Math3DMode;
  height?: string;
  showControls?: boolean;
  compact?: boolean;
  className?: string;
  autoRotateSpeed?: number;
}

export default function Math3DViewer({
  initialMode = 'vectors',
  height = '400px',
  showControls = true,
  compact = false,
  className = '',
  autoRotateSpeed = 0.008
}: Math3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mode, setMode] = useState<Math3DMode>(initialMode);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [vectorAngle, setVectorAngle] = useState<number>(60); // Angle in degrees
  const [vectorALen, setVectorALen] = useState<number>(3.2);
  const [vectorBLen, setVectorBLen] = useState<number>(2.8);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const activeObjectsGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationEulerRef = useRef<THREE.Euler>(new THREE.Euler(0.35, 0.45, 0, 'YXZ'));
  const targetEulerRef = useRef<THREE.Euler>(new THREE.Euler(0.35, 0.45, 0, 'YXZ'));
  const zoomLevelRef = useRef<number>(9);

  // Re-build 3D objects whenever mode or parameters change
  const buildSceneObjects = useCallback((selectedMode: Math3DMode, angleDeg: number, aLen: number, bLen: number, isWire: boolean) => {
    if (!sceneRef.current) return;

    // Remove previous objects group
    if (activeObjectsGroupRef.current) {
      sceneRef.current.remove(activeObjectsGroupRef.current);
      // Clean up geometry & materials
      activeObjectsGroupRef.current.traverse((child) => {
        if ((child as any).geometry) (child as any).geometry.dispose();
        if ((child as any).material) {
          if (Array.isArray((child as any).material)) {
            (child as any).material.forEach((m: any) => m.dispose());
          } else {
            (child as any).material.dispose();
          }
        }
      });
    }

    const group = new THREE.Group();
    activeObjectsGroupRef.current = group;

    // 1. Common 3D Coordinate Grid & XYZ Axes
    const grid = new THREE.GridHelper(10, 20, 0x6366f1, 0x334155);
    (grid.material as THREE.Material).opacity = 0.25;
    (grid.material as THREE.Material).transparent = true;
    grid.position.y = -0.01;
    group.add(grid);

    // Coordinate Axes lines with labels
    const axisRadius = 0.03;
    // X-Axis (Red / Coral)
    const xGeom = new THREE.CylinderGeometry(axisRadius, axisRadius, 8, 16);
    const xMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const xAxis = new THREE.Mesh(xGeom, xMat);
    xAxis.rotation.z = -Math.PI / 2;
    xAxis.position.x = 2;
    group.add(xAxis);

    // Y-Axis (Green / Emerald - Up in Three.js)
    const yGeom = new THREE.CylinderGeometry(axisRadius, axisRadius, 7, 16);
    const yMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const yAxis = new THREE.Mesh(yGeom, yMat);
    yAxis.position.y = 2.5;
    group.add(yAxis);

    // Z-Axis (Blue / Indigo)
    const zGeom = new THREE.CylinderGeometry(axisRadius, axisRadius, 8, 16);
    const zMat = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
    const zAxis = new THREE.Mesh(zGeom, zMat);
    zAxis.rotation.x = Math.PI / 2;
    zAxis.position.z = 2;
    group.add(zAxis);

    // Build specific mode shapes
    if (selectedMode === 'vectors') {
      // Vector A: lies along X-axis
      const dirA = new THREE.Vector3(1, 0, 0);
      const origin = new THREE.Vector3(0, 0, 0);
      const arrowA = new THREE.ArrowHelper(dirA, origin, aLen, 0x06b6d4, 0.45, 0.25);
      group.add(arrowA);

      // Vector B: rotated by angleDeg in X-Z plane or slightly tilted into Y
      const rad = (angleDeg * Math.PI) / 180;
      const dirB = new THREE.Vector3(Math.cos(rad), 0.3 * Math.sin(rad), Math.sin(rad)).normalize();
      const arrowB = new THREE.ArrowHelper(dirB, origin, bLen, 0xf59e0b, 0.45, 0.25);
      group.add(arrowB);

      // Vector C = A x B (Cross product)
      const vecA = dirA.clone().multiplyScalar(aLen);
      const vecB = dirB.clone().multiplyScalar(bLen);
      const crossVec = new THREE.Vector3().crossVectors(vecA, vecB);
      const crossLen = crossVec.length();
      const dirCross = crossVec.clone().normalize();
      const arrowCross = new THREE.ArrowHelper(dirCross, origin, Math.min(crossLen * 0.5, 4.5), 0xa855f7, 0.5, 0.3);
      group.add(arrowCross);

      // Translucent Parallelogram Area Mesh
      const planeGeom = new THREE.BufferGeometry();
      const p0 = origin;
      const p1 = vecA;
      const p2 = vecA.clone().add(vecB);
      const p3 = vecB;

      const vertices = new Float32Array([
        p0.x, p0.y, p0.z,  p1.x, p1.y, p1.z,  p2.x, p2.y, p2.z,
        p0.x, p0.y, p0.z,  p2.x, p2.y, p2.z,  p3.x, p3.y, p3.z
      ]);
      planeGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      planeGeom.computeVertexNormals();

      const planeMat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
        roughness: 0.3,
        metalness: 0.2
      });
      const paraMesh = new THREE.Mesh(planeGeom, planeMat);
      group.add(paraMesh);

      // Dashed parallelogram borders
      const lineGeom = new THREE.BufferGeometry().setFromPoints([p0, p1, p2, p3, p0]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xc4b5fd, linewidth: 2 });
      const borderLine = new THREE.Line(lineGeom, lineMat);
      group.add(borderLine);

    } else if (selectedMode === 'saddle') {
      // Hyperbolic Paraboloid Saddle Surface: z = (x^2 - y^2) / 2.5
      const segments = 40;
      const size = 3.6;
      const geom = new THREE.PlaneGeometry(size * 2, size * 2, segments, segments);
      const pos = geom.attributes.position;
      const colors = [];

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        // compute z height
        const z = (x * x - y * y) / 3.2;
        pos.setZ(i, z);

        // Color gradient based on elevation
        const t = (z + 2.5) / 5.0; // 0 to 1
        const col = new THREE.Color();
        if (t > 0.5) {
          col.lerpColors(new THREE.Color(0x6366f1), new THREE.Color(0xf59e0b), (t - 0.5) * 2);
        } else {
          col.lerpColors(new THREE.Color(0x06b6d4), new THREE.Color(0x6366f1), t * 2);
        }
        colors.push(col.r, col.g, col.b);
      }
      geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geom.computeVertexNormals();

      // Rotate so Z is vertical in Three.js coordinates
      geom.rotateX(-Math.PI / 2);

      const mat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        wireframe: isWire,
        side: THREE.DoubleSide,
        roughness: 0.25,
        metalness: 0.4
      });
      const saddleMesh = new THREE.Mesh(geom, mat);
      saddleMesh.position.y = 1.0;
      group.add(saddleMesh);

      // Tangent Plane at Origin (0,0,0) - Horizontal Plane
      const tangentGeom = new THREE.PlaneGeometry(4, 4);
      tangentGeom.rotateX(-Math.PI / 2);
      const tangentMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        wireframe: true
      });
      const tangentPlane = new THREE.Mesh(tangentGeom, tangentMat);
      tangentPlane.position.y = 1.0;
      group.add(tangentPlane);

      // Critical Point Marker (0,0) - Gold Sphere
      const ptGeom = new THREE.SphereGeometry(0.12, 16, 16);
      const ptMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706 });
      const critPt = new THREE.Mesh(ptGeom, ptMat);
      critPt.position.set(0, 1.0, 0);
      group.add(critPt);

    } else if (selectedMode === 'plane') {
      // 3D Plane: 2x + 3y + z = 6
      const planeSize = 6;
      const planeGeom = new THREE.PlaneGeometry(planeSize, planeSize, 12, 12);
      const planeMat = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.45,
        wireframe: isWire,
        side: THREE.DoubleSide,
        roughness: 0.3
      });
      const planeMesh = new THREE.Mesh(planeGeom, planeMat);
      planeMesh.rotation.x = Math.PI / 4;
      planeMesh.rotation.y = Math.PI / 6;
      planeMesh.position.set(0, 1.2, 0);
      group.add(planeMesh);

      // Normal Vector Arrow
      const normalDir = new THREE.Vector3(0, 1, 1).normalize();
      const normalArrow = new THREE.ArrowHelper(normalDir, new THREE.Vector3(0, 1.2, 0), 2.8, 0xf59e0b, 0.4, 0.2);
      group.add(normalArrow);

      // Arbitrary Point P in space
      const ptP = new THREE.Vector3(1.8, 3.2, 1.2);
      const pGeom = new THREE.SphereGeometry(0.12, 16, 16);
      const pMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669 });
      const sphereP = new THREE.Mesh(pGeom, pMat);
      sphereP.position.copy(ptP);
      group.add(sphereP);

      // Drop perpendicular line to plane
      const projPt = new THREE.Vector3(1.0, 1.8, 0.4);
      const lineGeom = new THREE.BufferGeometry().setFromPoints([ptP, projPt]);
      const lineMat = new THREE.LineDashedMaterial({ color: 0x34d399, dashSize: 0.2, gapSize: 0.1 });
      const distLine = new THREE.Line(lineGeom, lineMat);
      distLine.computeLineDistances();
      group.add(distLine);

    } else if (selectedMode === 'polyhedron') {
      // Truncated Icosahedron / Geodesic Polyhedron
      const geom = new THREE.IcosahedronGeometry(2.2, 1);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x4f46e5,
        wireframe: isWire,
        roughness: 0.2,
        metalness: 0.6,
        transparent: true,
        opacity: 0.85
      });
      const polyMesh = new THREE.Mesh(geom, mat);
      polyMesh.position.y = 1.6;
      group.add(polyMesh);

      // Inner glowing core
      const innerGeom = new THREE.SphereGeometry(1.2, 32, 32);
      const innerMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.7,
        roughness: 0.4
      });
      const core = new THREE.Mesh(innerGeom, innerMat);
      core.position.y = 1.6;
      group.add(core);

      // Orbiting torus ring
      const torusGeom = new THREE.TorusGeometry(3.0, 0.04, 16, 100);
      const torusMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
      const torus = new THREE.Mesh(torusGeom, torusMat);
      torus.position.y = 1.6;
      torus.rotation.x = Math.PI / 3;
      group.add(torus);
    }

    sceneRef.current.add(group);
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(0, 3, zoomLevelRef.current);
    camera.lookAt(0, 1.2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x6366f1, 0.9);
    dirLight2.position.set(-5, -3, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xf59e0b, 1.5, 12);
    pointLight.position.set(0, 4, 3);
    scene.add(pointLight);

    // Initial build
    buildSceneObjects(mode, vectorAngle, vectorALen, vectorBLen, wireframe);

    // Resize handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Render loop
    let lastTime = performance.now();
    const animate = (time: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (isAutoRotate && !isDraggingRef.current) {
        targetEulerRef.current.y += autoRotateSpeed;
      }

      // Smooth camera orbit interpolation
      rotationEulerRef.current.x += (targetEulerRef.current.x - rotationEulerRef.current.x) * 0.1;
      rotationEulerRef.current.y += (targetEulerRef.current.y - rotationEulerRef.current.y) * 0.1;

      // Update camera position on sphere
      const dist = zoomLevelRef.current;
      const ex = rotationEulerRef.current.x;
      const ey = rotationEulerRef.current.y;

      const cx = dist * Math.sin(ey) * Math.cos(ex);
      const cy = 1.2 + dist * Math.sin(ex);
      const cz = dist * Math.cos(ey) * Math.cos(ex);

      camera.position.set(cx, cy, cz);
      camera.lookAt(0, 1.2, 0);

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
    };
  }, [autoRotateSpeed]);

  // Update objects when mode, wireframe, or vector parameters change
  useEffect(() => {
    buildSceneObjects(mode, vectorAngle, vectorALen, vectorBLen, wireframe);
  }, [mode, vectorAngle, vectorALen, vectorBLen, wireframe, buildSceneObjects]);

  // Mouse & Touch interaction handlers for 3D Orbiting
  const handlePointerDown = (clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    const deltaX = clientX - previousMousePositionRef.current.x;
    const deltaY = clientY - previousMousePositionRef.current.y;

    targetEulerRef.current.y += deltaX * 0.008;
    targetEulerRef.current.x += deltaY * 0.008;

    // Clamp vertical tilt to avoid camera flipping
    targetEulerRef.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetEulerRef.current.x));

    previousMousePositionRef.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleZoom = (delta: number) => {
    zoomLevelRef.current = Math.max(4.5, Math.min(16, zoomLevelRef.current + delta));
  };

  const handleResetCamera = () => {
    targetEulerRef.current.set(0.35, 0.45, 0);
    zoomLevelRef.current = 9;
  };

  // Math HUD Calculations for Vectors
  const rad = (vectorAngle * Math.PI) / 180;
  const crossMagnitude = (vectorALen * vectorBLen * Math.sin(rad)).toFixed(2);
  const dotProduct = (vectorALen * vectorBLen * Math.cos(rad)).toFixed(2);

  return (
    <div className={`relative flex flex-col rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/80 border border-indigo-500/20 backdrop-blur-xl shadow-2xl shadow-indigo-950/40 ${className}`}>
      
      {/* Top Floating Interactive Mode Header - seamlessly blended */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-20 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="px-3 py-1.5 rounded-2xl text-xs font-bold bg-slate-950/75 border border-indigo-500/30 text-white backdrop-blur-md shadow-lg shadow-indigo-950/40 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold">Vector Cross-Product (a × b)</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-indigo-950/90 text-amber-300 border border-indigo-800/50">
                JEE 3D Space
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto ml-auto">
            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              title={isAutoRotate ? "Pause 3D rotation" : "Auto-rotate 3D scene"}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold border backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
                isAutoRotate
                  ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-200 shadow-indigo-950/50'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isAutoRotate ? <Pause className="w-3.5 h-3.5 text-indigo-400" /> : <Play className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{isAutoRotate ? 'Orbiting' : 'Paused'}</span>
            </button>

            <button
              onClick={() => setWireframe(!wireframe)}
              title="Toggle wireframe rendering"
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold border backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
                wireframe
                  ? 'bg-amber-950/80 border-amber-500/50 text-amber-200 shadow-amber-950/50'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px]">Wireframe</span>
            </button>
          </div>
        </div>
      )}

      {/* 3D Canvas Stage - Transparent & merged with background */}
      <div
        ref={containerRef}
        style={{ height }}
        className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => {
          if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={handlePointerUp}
        onWheel={(e) => {
          e.preventDefault();
          handleZoom(e.deltaY * 0.005);
        }}
      >
        {/* Subtle holographic radial glow behind the 3D model */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.12),transparent_70%)] pointer-events-none" />

        <canvas ref={canvasRef} className="w-full h-full block relative z-10" />

        {/* Floating Camera Controls Widget */}
        <div className="absolute top-14 right-3 flex flex-col gap-1.5 bg-slate-950/75 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800/80 shadow-xl z-20">
          <button
            onClick={() => handleZoom(-1.2)}
            title="Zoom In"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(1.2)}
            title="Zoom Out"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetCamera}
            title="Reset Camera Angle"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-amber-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Mathematical Formulas & Realtime HUD Overlay */}
        <div className="absolute bottom-20 left-3 max-w-[280px] sm:max-w-xs bg-slate-950/80 backdrop-blur-md p-3 rounded-2xl border border-slate-800/80 text-xs text-slate-300 shadow-xl z-20 pointer-events-auto">
          {mode === 'vectors' && (
            <div className="space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-cyan-400">|a| = {vectorALen}</span>
                <span className="text-amber-400">|b| = {vectorBLen}</span>
                <span className="text-indigo-400">θ = {vectorAngle}°</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <p className="text-[11px] text-purple-300 font-bold flex items-center justify-between">
                  <span>|a × b| =</span>
                  <span className="text-purple-400">{crossMagnitude} u²</span>
                </p>
                <p className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>a · b =</span>
                  <span className="text-emerald-400 font-semibold">{dotProduct}</span>
                </p>
              </div>
              <p className="text-[9px] text-slate-400 leading-tight">
                Direction follows the Right-Hand Rule along normal axis.
              </p>
            </div>
          )}

          {mode === 'saddle' && (
            <div className="space-y-1.5 font-mono">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Hyperbolic Paraboloid</span>
              </div>
              <p className="text-[11px] text-white font-bold bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
                z = (x² - y²) / 2.5
              </p>
              <p className="text-[10px] text-slate-400">
                Origin (0,0,0) is a true Saddle Point!
              </p>
            </div>
          )}

          {mode === 'plane' && (
            <div className="space-y-1.5 font-mono">
              <span className="text-[11px] text-indigo-400 font-bold">3D Plane & Normal Vector</span>
              <p className="text-[11px] text-white font-bold bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
                2x + 3y + z = 6
              </p>
              <p className="text-[10px] text-emerald-400">
                Normal n̂ = (2, 3, 1) / √14
              </p>
            </div>
          )}

          {mode === 'polyhedron' && (
            <div className="space-y-1 font-mono">
              <span className="text-[11px] text-indigo-400 font-bold">3D Spatial Symmetry</span>
              <p className="text-[10px] text-slate-400">
                Euler's Formula: V - E + F = 2. Visualizing rotational symmetry planes.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Floating Parameter Adjuster Bar - Seamlessly integrated */}
        {showControls && mode === 'vectors' && (
          <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-950/85 backdrop-blur-md rounded-2xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs z-20 shadow-xl">
            <div className="flex items-center gap-2.5 flex-1 min-w-[170px]">
              <span className="font-mono font-bold text-slate-400 text-[10px] shrink-0">Angle θ ({vectorAngle}°):</span>
              <input
                type="range"
                min="10"
                max="170"
                value={vectorAngle}
                onChange={(e) => setVectorAngle(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2.5 min-w-[140px]">
              <span className="font-mono font-bold text-slate-400 text-[10px] shrink-0">Vector b ({vectorBLen}):</span>
              <input
                type="range"
                min="1.5"
                max="4.5"
                step="0.1"
                value={vectorBLen}
                onChange={(e) => setVectorBLen(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <button
              onClick={() => {
                setVectorAngle(90);
                setVectorBLen(3.0);
                setVectorALen(3.0);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-700 text-slate-300 hover:text-white text-[10px] font-mono transition-colors cursor-pointer shrink-0"
            >
              Set 90°
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
