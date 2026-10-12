import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Thú cưng low-poly dựng từ khối cơ bản.
// stage: egg | baby | teen | adult  -  mood: happy | normal | hungry | sad
const STAGE_SCALE = { egg: 0.85, baby: 0.7, teen: 0.88, adult: 1.05 };

const MOOD_STYLE = {
  happy: { body: '#f4b183', bounce: 0.2, speed: 5 },
  normal: { body: '#eea877', bounce: 0.06, speed: 2.4 },
  hungry: { body: '#e39b68', bounce: 0.03, speed: 1.4 },
  sad: { body: '#b8aa9c', bounce: 0, speed: 1 },
};

function Mat({ color }) {
  return <meshStandardMaterial color={color} flatShading roughness={0.8} />;
}

function Egg() {
  return (
    <group>
      <mesh castShadow position={[0, 0.6, 0]} scale={[0.78, 1, 0.78]}>
        <icosahedronGeometry args={[0.6, 1]} />
        <Mat color="#fbf3e4" />
      </mesh>
      {[
        [0.25, 0.85, 0.36],
        [-0.3, 0.55, 0.32],
        [0.05, 0.35, 0.45],
      ].map((p) => (
        <mesh key={p.join()} position={p}>
          <icosahedronGeometry args={[0.08, 0]} />
          <Mat color="#9fcf86" />
        </mesh>
      ))}
    </group>
  );
}

function Creature({ stage, mood }) {
  const style = MOOD_STYLE[mood] ?? MOOD_STYLE.normal;
  const eyeY = mood === 'sad' ? 0.66 : 0.74;

  return (
    <group>
      {/* Thân */}
      <mesh castShadow position={[0, 0.58, 0]} scale={[1, mood === 'sad' ? 0.82 : 0.92, 0.95]}>
        <icosahedronGeometry args={[0.6, 1]} />
        <Mat color={style.body} />
      </mesh>
      {/* Bụng */}
      <mesh position={[0, 0.48, 0.36]} scale={[0.8, 0.75, 0.5]}>
        <icosahedronGeometry args={[0.4, 1]} />
        <Mat color="#fbe3c8" />
      </mesh>
      {/* Tai */}
      {[1, -1].map((side) => (
        <mesh
          key={side}
          castShadow
          position={[0.3 * side, mood === 'sad' ? 1.0 : 1.08, 0]}
          rotation={[0, 0, (mood === 'sad' ? 0.9 : 0.35) * -side]}
        >
          <coneGeometry args={[0.14, 0.32, 4]} />
          <Mat color={style.body} />
        </mesh>
      ))}
      {/* Mắt */}
      {[1, -1].map((side) => (
        <mesh key={side} position={[0.2 * side, eyeY, 0.5]}>
          <sphereGeometry args={[0.07, 8, 6]} />
          <meshStandardMaterial color="#2b1f16" />
        </mesh>
      ))}
      {/* Má hồng khi vui */}
      {mood === 'happy' &&
        [1, -1].map((side) => (
          <mesh key={side} position={[0.33 * side, 0.6, 0.46]} scale={[1, 0.6, 0.4]}>
            <sphereGeometry args={[0.07, 8, 6]} />
            <meshStandardMaterial color="#f08a8a" />
          </mesh>
        ))}
      {/* Miệng há khi đói */}
      {mood === 'hungry' && (
        <mesh position={[0, 0.6, 0.55]} scale={[1, 0.8, 0.4]}>
          <sphereGeometry args={[0.07, 8, 6]} />
          <meshStandardMaterial color="#5a2a22" />
        </mesh>
      )}
      {/* Chân */}
      {[1, -1].map((side) => (
        <mesh key={side} castShadow position={[0.24 * side, 0.08, 0.15]} scale={[1, 0.5, 1.2]}>
          <icosahedronGeometry args={[0.13, 0]} />
          <Mat color={style.body} />
        </mesh>
      ))}
      {/* Trưởng thành: mầm lá trên đầu, gắn với hình ảnh khu vườn */}
      {stage === 'adult' && (
        <group position={[0, 1.1, 0]}>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.02, 0.025, 0.16, 5]} />
            <Mat color="#3f7d3a" />
          </mesh>
          {[1, -1].map((side) => (
            <mesh key={side} position={[0.09 * side, 0.18, 0]} rotation={[0, 0, -0.6 * side]} scale={[1, 0.4, 0.7]}>
              <octahedronGeometry args={[0.1, 0]} />
              <Mat color="#5fa04e" />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

export default function Pet({ stage = 'baby', mood = 'normal', position = [0, 0, 0] }) {
  const ref = useRef();
  const style = MOOD_STYLE[mood] ?? MOOD_STYLE.normal;

  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    if (stage === 'egg') {
      // Trứng lắc lư nhẹ
      g.rotation.z = Math.sin(t * 2.2) * 0.08;
      g.position.y = position[1];
      return;
    }
    g.position.y = position[1] + Math.abs(Math.sin(t * style.speed)) * style.bounce;
    g.rotation.y = Math.sin(t * 0.6) * 0.35;
    g.rotation.z = mood === 'sad' ? Math.sin(t * 0.8) * 0.05 : 0;
  });

  return (
    <group ref={ref} position={position} scale={STAGE_SCALE[stage] ?? 1}>
      {stage === 'egg' ? <Egg /> : <Creature stage={stage} mood={mood} />}
    </group>
  );
}
