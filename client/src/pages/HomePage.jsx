import { useEffect, useState } from 'react';
import GardenScene from '../three/GardenScene.jsx';
import { getHealth } from '../api/health.api.js';

// Dữ liệu mẫu để xem trước cảnh 3D. Từ Đợt 3 lấy từ API /garden và /pet.
const SAMPLE_PLANTS = [
  { id: 1, kind: 'seed_sunflower', x: 0, y: 0, stage: 'bloom' },
  { id: 2, kind: 'seed_tulip', x: 1, y: 0, stage: 'mature' },
  { id: 3, kind: 'seed_cactus', x: 2, y: 0, stage: 'young' },
  { id: 4, kind: 'seed_tulip', x: 0, y: 1, stage: 'sprout' },
  { id: 5, kind: 'seed_sunflower', x: 2, y: 1, stage: 'seed' },
  { id: 6, kind: 'seed_tulip', x: 1, y: 2, stage: 'mature', withered: true },
];

const STAGES = [
  { value: 'egg', label: 'Trứng' },
  { value: 'baby', label: 'Con non' },
  { value: 'teen', label: 'Thiếu niên' },
  { value: 'adult', label: 'Trưởng thành' },
];

const MOODS = [
  { value: 'happy', label: 'Vui vẻ' },
  { value: 'normal', label: 'Bình thường' },
  { value: 'hungry', label: 'Đói' },
  { value: 'sad', label: 'Buồn' },
];

function StatusDot({ ok, loading }) {
  const color = loading ? 'bg-soil-100' : ok ? 'bg-leaf-500' : 'bg-berry-500';
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />;
}

function Segmented({ label, options, value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-soil-700">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-full px-3 py-1.5 text-sm transition ${
              value === o.value
                ? 'bg-leaf-600 text-white'
                : 'bg-white text-soil-700 ring-1 ring-soil-100 hover:bg-leaf-50'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [health, setHealth] = useState({ loading: true });
  const [pet, setPet] = useState({ stage: 'baby', mood: 'happy' });

  useEffect(() => {
    getHealth()
      .then((data) => setHealth({ loading: false, api: true, db: data.database }))
      .catch(() => setHealth({ loading: false, api: false, db: { connected: false } }));
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold leading-tight text-leaf-900">
            Mỗi phiên học là một lần tưới cây
          </h1>
          <p className="mt-3 text-soil-700">
            Đặt mục tiêu, học theo Pomodoro và nhìn thú cưng lớn lên cùng khu vườn của bạn.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 ring-1 ring-soil-100">
          <p className="mb-3 text-sm font-semibold text-soil-900">Trạng thái hệ thống</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <StatusDot ok={health.api} loading={health.loading} />
              API server {health.loading ? 'đang kiểm tra…' : health.api ? 'đang chạy' : 'chưa chạy'}
            </li>
            <li className="flex items-center gap-2">
              <StatusDot ok={health.db?.connected} loading={health.loading} />
              {health.loading
                ? 'CSDL đang kiểm tra…'
                : health.db?.connected
                  ? `CSDL đã kết nối (${health.db.version})`
                  : `CSDL chưa kết nối${health.db?.error ? `: ${health.db.error}` : ''}`}
            </li>
          </ul>
        </div>

        <div className="space-y-4 rounded-2xl bg-white p-5 ring-1 ring-soil-100">
          <p className="text-sm font-semibold text-soil-900">Xem trước thú cưng (dữ liệu mẫu)</p>
          <Segmented
            label="Giai đoạn phát triển"
            options={STAGES}
            value={pet.stage}
            onChange={(stage) => setPet((p) => ({ ...p, stage }))}
          />
          <Segmented
            label="Cảm xúc"
            options={MOODS}
            value={pet.mood}
            onChange={(mood) => setPet((p) => ({ ...p, mood }))}
          />
        </div>
      </section>

      <section className="h-[420px] overflow-hidden rounded-2xl ring-1 ring-soil-100 md:h-[560px]">
        <GardenScene pet={pet} plants={SAMPLE_PLANTS} />
      </section>
    </div>
  );
}
