import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { speechService } from '../services/speechService';
import { GamePhase } from '../types/quiz';

interface ThreeSceneProps {
  gamePhase: GamePhase;
  highlightShape?: 'triangle' | 'diamond' | 'circle' | 'square' | null;
  isAudioPlaying?: boolean;
}

const _pointer = new THREE.Vector2();
const _targetRot = new THREE.Vector3();

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  gamePhase,
  highlightShape,
  isAudioPlaying,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const audioAmplitudeRef = useRef<number>(0);
  const phaseRef = useRef<GamePhase>(gamePhase);
  const highlightRef = useRef<'triangle' | 'diamond' | 'circle' | 'square' | null | undefined>(highlightShape);

  useEffect(() => {
    phaseRef.current = gamePhase;
  }, [gamePhase]);

  useEffect(() => {
    highlightRef.current = highlightShape;
  }, [highlightShape]);

  useEffect(() => {
    const unsub = speechService.subscribeAudioOrb((amp) => {
      audioAmplitudeRef.current = amp;
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Software WebGL Detection Guard per Three.js constitution
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x14052b, 0.032);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 260;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.6, 6.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-Point Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.6);
    keyLight.position.set(4.5, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Vivid Rim Lighting for Kahoot vibrant energy
    const rimLight = new THREE.DirectionalLight(0xa855f7, 2.2);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    const fillLight = new THREE.HemisphereLight(0x93c5fd, 0x1f0a3d, 1.2);
    scene.add(fillLight);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Procedural Soft Contact Ground Disc
    const groundGeo = new THREE.PlaneGeometry(18, 18);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x14052b,
      roughness: 0.9,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.5;
    ground.receiveShadow = !isSoftwareGl;
    scene.add(ground);

    // 2. High-Fidelity 3D Kahoot Polyhedra
    // Red Tetrahedron (▲)
    const redGroup = new THREE.Group();
    const tetraGeo = new THREE.TetrahedronGeometry(0.72, 0);
    const redMat = new THREE.MeshPhysicalMaterial({
      color: 0xe21b3c,
      roughness: 0.18,
      metalness: 0.35,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });
    const redMesh = new THREE.Mesh(tetraGeo, redMat);
    redMesh.castShadow = !isSoftwareGl;
    redGroup.add(redMesh);
    // Inner glowing core
    const redCoreGeo = new THREE.TetrahedronGeometry(0.4, 0);
    const redCoreMat = new THREE.MeshBasicMaterial({ color: 0xff4d6d, wireframe: true });
    redGroup.add(new THREE.Mesh(redCoreGeo, redCoreMat));
    redGroup.position.set(-3.2, 0.25, 0);

    // Blue Octahedron (◆)
    const blueGroup = new THREE.Group();
    const octGeo = new THREE.OctahedronGeometry(0.7, 0);
    const blueMat = new THREE.MeshPhysicalMaterial({
      color: 0x1368ce,
      roughness: 0.15,
      metalness: 0.45,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    });
    const blueMesh = new THREE.Mesh(octGeo, blueMat);
    blueMesh.castShadow = !isSoftwareGl;
    blueGroup.add(blueMesh);
    const blueCoreGeo = new THREE.OctahedronGeometry(0.4, 0);
    const blueCoreMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true });
    blueGroup.add(new THREE.Mesh(blueCoreGeo, blueCoreMat));
    blueGroup.position.set(-1.05, 0.25, 0);

    // Yellow Torus & Pearl (●)
    const yellowGroup = new THREE.Group();
    const torusGeo = new THREE.TorusGeometry(0.58, 0.16, 18, 36);
    const yellowMat = new THREE.MeshPhysicalMaterial({
      color: 0xffa602,
      roughness: 0.22,
      metalness: 0.65,
      clearcoat: 0.85,
    });
    const torusMesh = new THREE.Mesh(torusGeo, yellowMat);
    torusMesh.castShadow = !isSoftwareGl;
    yellowGroup.add(torusMesh);
    const pearlGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const pearlMat = new THREE.MeshPhysicalMaterial({
      color: 0xffe066,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0xd97706,
      emissiveIntensity: 0.2,
    });
    yellowGroup.add(new THREE.Mesh(pearlGeo, pearlMat));
    yellowGroup.position.set(1.05, 0.25, 0);

    // Green Rounded Cube (■)
    const greenGroup = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(0.88, 0.88, 0.88);
    const greenMat = new THREE.MeshPhysicalMaterial({
      color: 0x26890c,
      roughness: 0.2,
      metalness: 0.4,
      clearcoat: 0.8,
    });
    const boxMesh = new THREE.Mesh(boxGeo, greenMat);
    boxMesh.castShadow = !isSoftwareGl;
    greenGroup.add(boxMesh);
    const greenCoreGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
    const greenCoreMat = new THREE.MeshBasicMaterial({ color: 0x4ade80, wireframe: true });
    greenGroup.add(new THREE.Mesh(greenCoreGeo, greenCoreMat));
    greenGroup.position.set(3.2, 0.25, 0);

    rootGroup.add(redGroup);
    rootGroup.add(blueGroup);
    rootGroup.add(yellowGroup);
    rootGroup.add(greenGroup);

    // 3. Futuristic 3D Audio Visualizer Orb
    const audioOrbGroup = new THREE.Group();
    const orbIcosaGeo = new THREE.IcosahedronGeometry(0.85, 3);
    const orbWireMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
    });
    const orbMesh = new THREE.Mesh(orbIcosaGeo, orbWireMat);
    const orbInnerGeo = new THREE.SphereGeometry(0.52, 20, 20);
    const orbInnerMat = new THREE.MeshPhysicalMaterial({
      color: 0x818cf8,
      roughness: 0.1,
      metalness: 0.8,
      transmission: isSoftwareGl ? 0 : 0.65,
      transparent: true,
      opacity: 0.9,
    });
    const innerOrbMesh = new THREE.Mesh(orbInnerGeo, orbInnerMat);
    audioOrbGroup.add(orbMesh);
    audioOrbGroup.add(innerOrbMesh);
    audioOrbGroup.position.set(0, 0.35, 0.9);
    audioOrbGroup.scale.set(0.001, 0.001, 0.001);
    rootGroup.add(audioOrbGroup);

    // 4. Celebratory 3D Trophy for Podium
    const trophyGroup = new THREE.Group();
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const cupGeo = new THREE.CylinderGeometry(0.55, 0.22, 0.65, 20);
    const cupMesh = new THREE.Mesh(cupGeo, goldMat);
    cupMesh.position.y = 0.55;
    const stemGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.42, 14);
    const stemMesh = new THREE.Mesh(stemGeo, goldMat);
    stemMesh.position.y = 0.12;
    const baseGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.2, 20);
    const baseMesh = new THREE.Mesh(baseGeo, goldMat);
    baseMesh.position.y = -0.16;
    trophyGroup.add(cupMesh);
    trophyGroup.add(stemMesh);
    trophyGroup.add(baseMesh);
    trophyGroup.position.set(0, 0.25, 0);
    trophyGroup.scale.set(0.001, 0.001, 0.001);
    rootGroup.add(trophyGroup);

    // Floating Starlight Particles
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 9;
      positions[i + 1] = Math.random() * 4.5 - 1.2;
      positions[i + 2] = (Math.random() - 0.5) * 4.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.07,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // Mouse parallax
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      _pointer.set(x, y);
    };
    window.addEventListener('pointermove', handlePointerMove);

    // Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Camera parallax
      _targetRot.set(-_pointer.y * 0.14, _pointer.x * 0.22, 0);
      rootGroup.rotation.y = THREE.MathUtils.damp(rootGroup.rotation.y, _targetRot.y, 4.0, delta);
      rootGroup.rotation.x = THREE.MathUtils.damp(rootGroup.rotation.x, _targetRot.x, 4.0, delta);

      const curHighlight = highlightRef.current;
      const curPhase = phaseRef.current;

      // Red (▲)
      const redHover = curHighlight === 'triangle';
      redGroup.rotation.x += (redHover ? 3.2 : 0.85) * delta;
      redGroup.rotation.y += (redHover ? 4.2 : 1.1) * delta;
      redGroup.position.y = 0.25 + Math.sin(time * 2.2) * 0.14 + (redHover ? 0.3 : 0);
      const targetRedScale = redHover ? 1.3 : 1.0;
      redGroup.scale.lerp(new THREE.Vector3(targetRedScale, targetRedScale, targetRedScale), 0.15);

      // Blue (◆)
      const blueHover = curHighlight === 'diamond';
      blueGroup.rotation.y += (blueHover ? 4.2 : 1.0) * delta;
      blueGroup.rotation.z += (blueHover ? 3.2 : 0.7) * delta;
      blueGroup.position.y = 0.25 + Math.sin(time * 2.2 + 1.2) * 0.14 + (blueHover ? 0.3 : 0);
      const targetBlueScale = blueHover ? 1.3 : 1.0;
      blueGroup.scale.lerp(new THREE.Vector3(targetBlueScale, targetBlueScale, targetBlueScale), 0.15);

      // Yellow (●)
      const yellowHover = curHighlight === 'circle';
      yellowGroup.rotation.x += (yellowHover ? 4.2 : 0.95) * delta;
      yellowGroup.rotation.y += (yellowHover ? 3.2 : 1.3) * delta;
      yellowGroup.position.y = 0.25 + Math.sin(time * 2.2 + 2.4) * 0.14 + (yellowHover ? 0.3 : 0);
      const targetYellowScale = yellowHover ? 1.3 : 1.0;
      yellowGroup.scale.lerp(new THREE.Vector3(targetYellowScale, targetYellowScale, targetYellowScale), 0.15);

      // Green (■)
      const greenHover = curHighlight === 'square';
      greenGroup.rotation.y += (greenHover ? 3.8 : 0.75) * delta;
      greenGroup.rotation.x += (greenHover ? 3.2 : 1.15) * delta;
      greenGroup.position.y = 0.25 + Math.sin(time * 2.2 + 3.6) * 0.14 + (greenHover ? 0.3 : 0);
      const targetGreenScale = greenHover ? 1.3 : 1.0;
      greenGroup.scale.lerp(new THREE.Vector3(targetGreenScale, targetGreenScale, targetGreenScale), 0.15);

      // Audio Orb Visualizer
      const isAudioActive = isAudioPlaying || audioAmplitudeRef.current > 0.05;
      const targetOrbScale = isAudioActive ? 1.0 + audioAmplitudeRef.current * 0.45 : 0.001;
      audioOrbGroup.scale.lerp(new THREE.Vector3(targetOrbScale, targetOrbScale, targetOrbScale), 0.18);
      if (isAudioActive) {
        audioOrbGroup.rotation.y += (1.8 + audioAmplitudeRef.current * 3.5) * delta;
        audioOrbGroup.rotation.x += 1.2 * delta;
      }

      // Podium mode vs Normal mode positions
      const isPodium = curPhase === 'podium' || curPhase === 'leaderboard';
      const targetTrophyScale = curPhase === 'podium' ? 1.35 : 0.001;
      trophyGroup.scale.lerp(new THREE.Vector3(targetTrophyScale, targetTrophyScale, targetTrophyScale), 0.12);
      trophyGroup.rotation.y += 1.3 * delta;

      if (isPodium) {
        redGroup.position.x = THREE.MathUtils.damp(redGroup.position.x, -2.4, 3, delta);
        blueGroup.position.x = THREE.MathUtils.damp(blueGroup.position.x, -1.2, 3, delta);
        yellowGroup.position.x = THREE.MathUtils.damp(yellowGroup.position.x, 1.2, 3, delta);
        greenGroup.position.x = THREE.MathUtils.damp(greenGroup.position.x, 2.4, 3, delta);
      } else {
        redGroup.position.x = THREE.MathUtils.damp(redGroup.position.x, -3.2, 3, delta);
        blueGroup.position.x = THREE.MathUtils.damp(blueGroup.position.x, -1.05, 3, delta);
        yellowGroup.position.x = THREE.MathUtils.damp(yellowGroup.position.x, 1.05, 3, delta);
        greenGroup.position.x = THREE.MathUtils.damp(greenGroup.position.x, 3.2, 3, delta);
      }

      particles.rotation.y += 0.08 * delta;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 260;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (isSoftwareGl) {
        clearTimeout(frameId);
      } else {
        cancelAnimationFrame(frameId);
      }

      [tetraGeo, redCoreGeo, octGeo, blueCoreGeo, torusGeo, pearlGeo, boxGeo, greenCoreGeo, orbIcosaGeo, orbInnerGeo, cupGeo, stemGeo, baseGeo, particleGeo, groundGeo].forEach(g => g.dispose());
      [redMat, redCoreMat, blueMat, blueCoreMat, yellowMat, pearlMat, greenMat, greenCoreMat, orbWireMat, orbInnerMat, goldMat, particleMat, groundMat].forEach(m => m.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-full relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl bg-gradient-to-b from-[#25094d]/70 via-[#1b0638]/80 to-[#120326]/90 group">
      <div
        ref={mountRef}
        className="w-full h-44 sm:h-64 relative overflow-hidden pointer-events-auto select-none"
      />
      {/* Subtle Bottom Ambient Tag */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] sm:text-[11px] text-purple-200/90 whitespace-nowrap overflow-x-auto max-w-[95%]">
        <span className="flex items-center gap-1 font-medium">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500 inline-block" /> ▲ Triangle
        </span>
        <span className="flex items-center gap-1 font-medium">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 inline-block" /> ◆ Diamond
        </span>
        <span className="flex items-center gap-1 font-medium">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 inline-block" /> ● Circle
        </span>
        <span className="flex items-center gap-1 font-medium">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 inline-block" /> ■ Square
        </span>
      </div>
    </div>
  );
};
