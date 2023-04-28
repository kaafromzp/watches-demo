import { ContactShadows, Environment, PresentationControls } from '@react-three/drei';
import { Canvas as FiberCanvas } from '@react-three/fiber'
import { Watches } from '../Watches';
import { NoToneMapping } from 'three';
import { Suspense } from 'react';
import Loader from '../Loader';

const Canvas = () => {
  return (
    <FiberCanvas
      gl={{
        antialias: true,
        toneMapping: NoToneMapping,
        useLegacyLights: false
      }}
      style={{
        height: '100vh',
        background: `radial-gradient(circle at bottom center, #C0C0C0 0%, #303030 80%)`,
      }}
      camera={{ fov: 20, position: [0, 0, 1.0] }}
    >
      <Suspense fallback={<Loader />}>
        <ambientLight intensity={0.1} />
        <directionalLight intensity={0.1} />
        <spotLight intensity={0.1} position={[0, -1, 3]} angle={1} penumbra={1} shadow-mapSize={2048} castShadow />
        <PresentationControls
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 3, tension: 1500 }}
          rotation={[0, -0.55, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <Watches position={[0, 0, 0]} />
        </PresentationControls>
        <ContactShadows position={[0, -0.15, 0]} opacity={0.75} scale={0.5} blur={4} far={4} />
        <Environment files="warehouse.hdr" />
      </Suspense>
    </FiberCanvas>
  )
}

export default Canvas;