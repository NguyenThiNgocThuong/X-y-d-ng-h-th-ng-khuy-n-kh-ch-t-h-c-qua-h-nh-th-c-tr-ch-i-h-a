import { Link, Outlet } from 'react-router';

export default function Layout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-soil-100 bg-white/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-leaf-900">
            <img src="/favicon.svg" alt="" className="h-8 w-8" />
            Study Garden
          </Link>
          <span className="text-sm text-soil-500">Tự học mỗi ngày, vườn xanh mỗi ngày</span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
