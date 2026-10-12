// Cây low-poly 5 giai đoạn: seed | sprout | young | mature | bloom, có trạng thái héo.
const STAGES = {
  seed: { height: 0, leaves: 0 },
  sprout: { height: 0.22, leaves: 2 },
  young: { height: 0.45, leaves: 4 },
  mature: { height: 0.75, leaves: 6 },
  bloom: { height: 0.85, leaves: 6, flower: true },
};

// Màu hoa theo loại hạt (model_key trong bảng items)
const FLOWER_COLOR = {
  seed_sunflower: '#f6c453',
  seed_tulip: '#e0645c',
  seed_cactus: '#f29bc0',
};

function Mat({ color }) {
  return <meshStandardMaterial color={color} flatShading roughness={0.85} />;
}

export default function Plant({ kind, stage = 'seed', withered = false, position = [0, 0, 0] }) {
  const s = STAGES[stage] ?? STAGES.seed;
  const leafColor = withered ? '#b59a62' : '#5fa04e';
  const stemColor = withered ? '#8d7a4f' : '#3f7d3a';
  const petals = 6;

  if (s.height === 0) {
    return (
      <mesh position={[position[0], position[1] + 0.12, position[2]]}>
        <icosahedronGeometry args={[0.07, 0]} />
        <Mat color="#c9a46b" />
      </mesh>
    );
  }

  return (
    // Cây héo nghiêng và rũ xuống
    <group position={position} rotation={[withered ? 0.25 : 0, 0, withered ? 0.35 : 0]}>
      <mesh castShadow position={[0, s.height / 2 + 0.08, 0]}>
        <cylinderGeometry args={[0.03, 0.045, s.height, 5]} />
        <Mat color={stemColor} />
      </mesh>

      {Array.from({ length: s.leaves }, (_, i) => {
        const angle = i * 2.4; // góc vàng giúp lá xoè đều
        const y = 0.08 + ((i + 1) / (s.leaves + 1)) * s.height;
        return (
          <mesh
            key={i}
            castShadow
            position={[Math.cos(angle) * 0.13, y, Math.sin(angle) * 0.13]}
            rotation={[0, -angle, withered ? -0.6 : 0.5]}
            scale={[1.3, 0.35, 0.7]}
          >
            <octahedronGeometry args={[0.12, 0]} />
            <Mat color={leafColor} />
          </mesh>
        );
      })}

      {s.flower && !withered && (
        <group position={[0, s.height + 0.12, 0]}>
          <mesh>
            <icosahedronGeometry args={[0.08, 0]} />
            <Mat color="#7a4e2a" />
          </mesh>
          {Array.from({ length: petals }, (_, i) => {
            const a = (i / petals) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.13, 0, Math.sin(a) * 0.13]} scale={[1, 0.5, 1]}>
                <icosahedronGeometry args={[0.07, 0]} />
                <Mat color={FLOWER_COLOR[kind] ?? '#f6c453'} />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}
