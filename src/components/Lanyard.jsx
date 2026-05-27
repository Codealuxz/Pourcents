/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

const CARD_GLB = '/assets/3d/card.glb';
const LANYARD_PNG = '/assets/3d/lanyard.png';

function makeLanyardTexture() {
  // Canvas tres allonge : ratio 8:1 avec 8 zones carrees,
  // chaque % occupe une cellule 256x256 (pas d'etirement).
  const cells = 8;
  const cellSize = 256;
  const c = document.createElement('canvas');
  c.width = cellSize * cells;
  c.height = cellSize;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 180px "Bricolage Grotesque", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const m = ctx.measureText('%');
  const glyphH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  const baselineY = cellSize / 2 + glyphH / 2 - m.actualBoundingBoxDescent;

  for (let i = 0; i < cells; i++) {
    ctx.fillText('%', i * cellSize + cellSize / 2, baselineY);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function makeCardTexture() {
  // Dimensions exactes de la texture originale du GLB (1678x1677)
  const c = document.createElement('canvas');
  c.width = 1678;
  c.height = 1677;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, c.width, c.height);

  const halfW = c.width / 2;

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 800px "Bricolage Grotesque", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const m = ctx.measureText('%');
  const glyphH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  const baselineY = c.height / 2 - 180 + glyphH / 2 - m.actualBoundingBoxDescent;

  // Compresse horizontalement le % pour compenser l'etirement du UV
  const xSquish = 0.85;

  // FACE AVANT (moitie gauche)
  ctx.save();
  ctx.translate(halfW / 2, 0);
  ctx.scale(xSquish, 1);
  ctx.fillText('%', 0, baselineY);
  ctx.restore();

  // FACE ARRIERE (moitie droite)
  ctx.save();
  ctx.translate(halfW + halfW / 2, 0);
  ctx.scale(xSquish, 1);
  ctx.fillText('%', 0, baselineY);
  ctx.restore();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  tex.flipY = false;
  return tex;
}

export default function Lanyard({ position = [0, 0, 30], gravity = [0, -40, 0], fov = 20, transparent = true, scrollProgress = 0 }) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const canvasContainerRef = useRef(null);
  const cardScreenPosRef = useRef({ x: -9999, y: -9999, w: 0, h: 0 });
  const hoverPushRef = useRef({ active: false, dx: 0, dy: 0 });
  const isScrolled = scrollProgress > 0.05;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Au scroll : pas de drag, juste un push physique quand la souris survole la card
  useEffect(() => {
    if (!isScrolled) {
      hoverPushRef.current.active = false;
      return;
    }
    const onMove = (e) => {
      const { x, y, w, h } = cardScreenPosRef.current;
      const dx = e.clientX - x;
      const dy = e.clientY - y;
      const inCard =
        Math.abs(dx) <= w / 2 + 30 &&
        Math.abs(dy) <= h / 2 + 30;
      hoverPushRef.current.active = inCard;
      hoverPushRef.current.dx = dx;
      hoverPushRef.current.dy = dy;
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      hoverPushRef.current.active = false;
    };
  }, [isScrolled]);

  return (
    <div className="lanyard-wrapper" ref={canvasContainerRef}>
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        style={{ pointerEvents: isScrolled ? 'none' : 'auto' }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} scrollProgress={scrollProgress} cardScreenPosRef={cardScreenPosRef} hoverPushRef={hoverPushRef} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false, scrollProgress = 0, cardScreenPosRef, hoverPushRef }) {
  const band = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef();
  const cardGroup = useRef();
  const smoothT = useRef(0);
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 8, linearDamping: 8 };
  const { nodes, materials } = useGLTF(CARD_GLB);
  const bandTexture = useMemo(() => makeLanyardTexture(), []);
  const cardTexture = useMemo(() => makeCardTexture(), []);
  const [curve] = useState(() =>
    new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.5, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    // clamp delta pour eviter les sauts (onglet inactif/refocus)
    delta = Math.min(delta, 1 / 30);

    // Switch binaire avec smoothing : au-dela d'un seuil de scroll, l'ancrage glisse vers
    // le coin haut-gauche ET monte plus haut hors ecran pour raccourcir la ficelle visible.
    // La card garde sa taille originale.
    if (fixed.current) {
      const { viewport, camera } = state;
      const v = viewport.getCurrentViewport(camera, [0, 0, 0]);
      const target = scrollProgress > 0.08 ? 1 : 0;
      smoothT.current += (target - smoothT.current) * Math.min(1, delta * 5);
      const t = smoothT.current;

      // Centre top -> coin top-gauche, et plus haut hors ecran quand scrolle (ficelle raccourcie visuellement)
      const startX = 0;
      const startY = v.height / 2 + 1;
      const endX = -v.width / 2 + 1.5;
      const endY = v.height / 2 + 2.8;
      const tx = startX + (endX - startX) * t;
      const ty = startY + (endY - startY) * t;

      [fixed, j1, j2, j3, card].forEach((ref) => ref.current?.wakeUp());
      fixed.current.setNextKinematicTranslation({ x: tx, y: ty, z: 0 });

      // Card plus petite quand on scrolle + ajuste l'offset pour que le top du mesh reste colle au joint de la ficelle
      if (cardGroup.current) {
        const s = 2.25 + (0.9 - 2.25) * t;
        cardGroup.current.scale.setScalar(s);
        cardGroup.current.position.y = 1.33 - 1.125 * s;
      }

      // Update la position ecran de la card (pour detection hover au scroll)
      if (card.current && cardGroup.current && cardScreenPosRef) {
        const pos = card.current.translation();
        const offsetY = cardGroup.current.position.y;
        const worldPos = new THREE.Vector3(pos.x, pos.y + offsetY, pos.z);
        worldPos.project(state.camera);
        const screenX = ((worldPos.x + 1) / 2) * state.size.width;
        const screenY = ((1 - worldPos.y) / 2) * state.size.height;
        const s = cardGroup.current.scale.x;
        const ratio = s / 2.25;
        const screenW = 160 * ratio + 30;
        const screenH = 220 * ratio + 30;
        cardScreenPosRef.current = { x: screenX, y: screenY, w: screenW, h: screenH };
      }

      // Au scroll : la card "evite" la souris quand elle approche (repulsion douce)
      if (hoverPushRef?.current?.active && card.current) {
        const { dx, dy } = hoverPushRef.current;
        const dist = Math.hypot(dx, dy);
        const range = 180;
        if (dist > 0 && dist < range) {
          const strength = Math.pow(1 - dist / range, 2) * 6;
          // direction opposee au pointer (la card s'eloigne) ; y inverse car ecran -> 3D
          const ux = -dx / dist;
          const uy = dy / dist;
          card.current.wakeUp();
          card.current.applyImpulse(
            { x: ux * strength * delta, y: uy * strength * delta, z: 0 },
            true
          );
        }
      }
    }

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());

      // filtrer NaN avant setPoints (sinon mesh disparait)
      const safe = curve.points.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.z));
      if (safe) {
        band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      }

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="kinematicPosition" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            ref={cardGroup}
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (
              e.target.setPointerCapture(e.pointerId),
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            )}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardTexture}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.7}
                metalness={0.4}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={bandTexture}
          repeat={[-1, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(CARD_GLB);
