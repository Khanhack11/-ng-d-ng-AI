import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type ModelType = 'core' | 'torus' | 'sphere' | 'lattice';

interface ThreeSceneProps {
  modelType?: ModelType;
  isWireframe?: boolean;
  speedMultiplier?: number;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({
  modelType = 'core',
  isWireframe = false,
  speedMultiplier = 1,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const activeMeshGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x030308, 0.0018);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 24);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 3. Ambient & Dynamic Colored Lights
    const ambientLight = new THREE.AmbientLight(0x0d1117, 1.8);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 45, 100);
    cyanPointLight.position.set(12, 10, 15);
    scene.add(cyanPointLight);

    const magentaPointLight = new THREE.PointLight(0xec4899, 40, 100);
    magentaPointLight.position.set(-14, -8, 12);
    scene.add(magentaPointLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 35, 80);
    blueLight.position.set(0, 14, -6);
    scene.add(blueLight);

    // 4. Background Particle Nebula Field
    const particleCount = 1600;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorA = new THREE.Color(0x06b6d4); // Cyan
    const colorB = new THREE.Color(0x3b82f6); // Electric Blue
    const colorC = new THREE.Color(0xa855f7); // Purple

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 80;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 80;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 60 - 10;

      const pickColor = Math.random() < 0.4 ? colorA : Math.random() < 0.7 ? colorB : colorC;
      particleColors[i3] = pickColor.r;
      particleColors[i3 + 1] = pickColor.g;
      particleColors[i3 + 2] = pickColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 5. Build Initial 3D Model Group
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);
    activeMeshGroupRef.current = meshGroup;

    // 6. Mouse Parallax Handler
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normX * 3.5;
      mouseRef.current.targetY = normY * 2.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Window Resize
    const handleResize = () => {
      if (!container || !renderer) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Mouse camera smoothing (lerp)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      camera.position.x = mouseRef.current.x;
      camera.position.y = mouseRef.current.y;
      camera.lookAt(0, 0, 0);

      // Light rotation
      cyanPointLight.position.x = Math.sin(elapsedTime * 0.7) * 16;
      cyanPointLight.position.z = Math.cos(elapsedTime * 0.7) * 16 + 4;

      magentaPointLight.position.x = -Math.sin(elapsedTime * 0.6) * 18;
      magentaPointLight.position.y = Math.cos(elapsedTime * 0.8) * 10;

      // Rotate particles subtly
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.02;
        particlesRef.current.rotation.x = Math.sin(elapsedTime * 0.015) * 0.08;
      }

      // Rotate central 3D mesh
      if (activeMeshGroupRef.current) {
        activeMeshGroupRef.current.rotation.y += 0.008 * speedMultiplier;
        activeMeshGroupRef.current.rotation.x += 0.004 * speedMultiplier;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  // Update Geometry when modelType or isWireframe changes
  useEffect(() => {
    const group = activeMeshGroupRef.current;
    if (!group) return;

    // Clear old children
    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh;
      if (child.geometry) child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach(m => m.dispose());
      } else if (child.material) {
        child.material.dispose();
      }
      group.remove(child);
    }

    if (modelType === 'core') {
      // Quantum Icosahedron Core with Inner Crystal and Orbiting Rings
      const outerGeo = new THREE.IcosahedronGeometry(4.8, 1);
      const outerMat = new THREE.MeshPhysicalMaterial({
        color: 0x06b6d4,
        emissive: 0x083344,
        roughness: 0.15,
        metalness: 0.85,
        wireframe: isWireframe,
        transparent: true,
        opacity: isWireframe ? 0.9 : 0.45,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      });
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      group.add(outerMesh);

      // Inner dense octahedron
      const innerGeo = new THREE.OctahedronGeometry(2.4, 0);
      const innerMat = new THREE.MeshStandardMaterial({
        color: 0xec4899,
        emissive: 0x831843,
        roughness: 0.3,
        metalness: 0.9,
        wireframe: isWireframe,
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      group.add(innerMesh);

      // Orbiting Quantum Ring 1
      const ringGeo1 = new THREE.TorusGeometry(6.6, 0.08, 16, 100);
      const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true });
      const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
      ring1.rotation.x = Math.PI / 3;
      group.add(ring1);

      // Orbiting Quantum Ring 2
      const ringGeo2 = new THREE.TorusGeometry(7.6, 0.06, 16, 100);
      const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true });
      const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      ring2.rotation.y = Math.PI / 2.5;
      group.add(ring2);

    } else if (modelType === 'torus') {
      // Cyber Torus Knot
      const torusGeo = new THREE.TorusKnotGeometry(3.6, 1.1, 140, 24, 2, 3);
      const torusMat = new THREE.MeshPhysicalMaterial({
        color: 0x3b82f6,
        emissive: 0x1e3a8a,
        roughness: 0.2,
        metalness: 0.9,
        wireframe: isWireframe,
        transparent: true,
        opacity: 0.8,
        clearcoat: 0.9,
      });
      const torusMesh = new THREE.Mesh(torusGeo, torusMat);
      group.add(torusMesh);

      // Surrounding halo
      const haloGeo = new THREE.RingGeometry(6.5, 7.0, 64);
      const haloMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = Math.PI / 2;
      group.add(halo);

    } else if (modelType === 'sphere') {
      // Holographic Geodesic Sphere Grid
      const sphereGeo = new THREE.SphereGeometry(4.6, 36, 36);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        emissive: 0x4c1d95,
        wireframe: true,
        roughness: 0.1,
        metalness: 0.9,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphereMesh);

      // Core glow sphere
      const coreGeo = new THREE.SphereGeometry(2.8, 20, 20);
      const coreMat = new THREE.MeshPhysicalMaterial({
        color: 0xec4899,
        emissive: 0x9d174d,
        transparent: true,
        opacity: 0.6,
        roughness: 0.2,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      group.add(coreMesh);

    } else if (modelType === 'lattice') {
      // Quantum Lattice / Matrix Cube
      const boxGeo = new THREE.BoxGeometry(5.2, 5.2, 5.2, 4, 4, 4);
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x064e3b,
        wireframe: isWireframe || true,
        roughness: 0.2,
        metalness: 0.8,
      });
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      group.add(boxMesh);

      const centerSphere = new THREE.SphereGeometry(2.0, 16, 16);
      const centerMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
      const centerMesh = new THREE.Mesh(centerSphere, centerMat);
      group.add(centerMesh);
    }
  }, [modelType, isWireframe]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #080c1d 0%, #030308 100%)' }}
    />
  );
};

export default ThreeScene;
