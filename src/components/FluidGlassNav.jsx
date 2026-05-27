/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useEffect, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useFBO, useGLTF, MeshTransmissionMaterial } from '@react-three/drei';
import { easing } from 'maath';

const Lens = memo(function Lens({ glb = '/assets/3d/lens.glb', followPointer = true, modeProps = {} }) {
  const ref = useRef();
  const { nodes } = useGLTF(glb);
  const buffer = useFBO();
  const { viewport: vp, scene: mainScene, camera } = useThree();
  const sceneRef = useRef(new THREE.Scene());
  const geoWidthRef = useRef(1);

  useEffect(() => {
    const geo = nodes.Cylinder?.geometry;
    if (geo) {
      geo.computeBoundingBox();
      geoWidthRef.current = (geo.boundingBox.max.x - geo.boundingBox.min.x) || 1;
    }
  }, [nodes]);

  useFrame((state, delta) => {
    const { gl, viewport, pointer } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = followPointer ? (pointer.y * v.height) / 2 : 0;
    if (ref.current) {
      easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);
      if (modeProps.scale == null) {
        const maxWorld = v.width * 0.9;
        const desired = maxWorld / geoWidthRef.current;
        ref.current.scale.setScalar(Math.min(0.15, desired));
      }
    }

    gl.setRenderTarget(buffer);
    gl.render(mainScene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(0x000000, 0);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

  return (
    <mesh
      ref={ref}
      scale={scale ?? 0.15}
      rotation-x={Math.PI / 2}
      geometry={nodes.Cylinder?.geometry}
    >
      <MeshTransmissionMaterial
        buffer={buffer.texture}
        ior={ior ?? 1.15}
        thickness={thickness ?? 5}
        anisotropy={anisotropy ?? 0.01}
        chromaticAberration={chromaticAberration ?? 0.1}
        {...extraMat}
      />
    </mesh>
  );
});

export default function FluidGlassNav({ lensProps = {}, className = '', style = {} }) {
  return (
    <div className={className} style={{ position: 'absolute', inset: 0, ...style }}>
      <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }} style={{ background: 'transparent' }}>
        <Lens modeProps={lensProps} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/assets/3d/lens.glb');
