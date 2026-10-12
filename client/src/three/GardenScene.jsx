import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Pet from './Pet.jsx';
import Plant from './Plant.jsx';

const GRID = 3; // khu vườn 3 x 3 ô (khớp gamification.config.js)
const SPACING = 0.95;

// Đổi toạ độ ô (slot_x, slot_y) trong CSDL sang vị trí 3D
export function slotToPosition(x, y) {
  const offset = ((GRID - 1) * SPACING) / 2;
  return [x * SPACING - offset, 0, y * SPACING - offset - 0.45];
}

function Island() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.15, 0]}>
        <cylinderGeometry args={[3.2, 3.2, 0.3, 14]} />
        <meshStandardMaterial color="#8cc56f" flatShading />
      </mesh>
      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[3.15, 2.2, 0.9, 14]} />
        <meshStandardMaterial color="#8a6646" flatShading />
      </mesh>
      {[
        [2.3, 0.05, -1.4, 0.28],
        [-2.4, 0.05, 0.9, 0.2],
        [1.9, 0.03, 1.8, 0.16],
      ].map(([x, y, z, r]) => (
        <mesh key={`${x}${z}`} castShadow position={[x, y, z]}>
          <dodecahedronGeometry args={[r, 0]} />
          <meshStandardMaterial color="#b9b2a6" flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Plot({ position }) {
  return (
    <mesh receiveShadow position={[position[0], 0.04, position[2]]}>
      <cylinderGeometry args={[0.38, 0.42, 0.08, 8]} />
      <meshStandardMaterial color="#7a5a3c" flatShading />
    </mesh>
  );
}

export default function GardenScene({ pet, plants = [] }) {
  const slots = Array.from({ length: GRID * GRID }, (_, i) => slotToPosition(i % GRID, Math.floor(i / GRID)));

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [4.2, 4, 5.4], fov: 42 }}>
      <color attach="background" args={['#e3f1d8']} />
      <hemisphereLight args={['#fff7e0', '#6f8f52', 0.7]} />
      <directionalLight
        castShadow
        position={[4, 7, 3]}
        intensity={1.8}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />

      <Island />
      {slots.map((p) => (
        <Plot key={p.join()} position={p} />
      ))}
      {plants.map((p) => (
        <Plant key={p.id} kind={p.kind} stage={p.stage} withered={p.withered} position={slotToPosition(p.x, p.y)} />
      ))}
      <Pet stage={pet.stage} mood={pet.mood} position={[0, 0, 1.75]} />

      <OrbitControls
        enablePan={false}
        target={[0, 0.4, 0]}
        minDistance={4}
        maxDistance={10}
        minPolarAngle={0.35}
        maxPolarAngle={1.25}
      />
    </Canvas>
  );
}
