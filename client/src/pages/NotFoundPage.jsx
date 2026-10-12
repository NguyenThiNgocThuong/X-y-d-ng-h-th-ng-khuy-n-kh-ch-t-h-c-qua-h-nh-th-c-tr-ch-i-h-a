import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="py-24 text-center">
      <p className="text-6xl font-bold text-leaf-200">404</p>
      <p className="mt-4 text-soil-700">Trang này chưa được trồng.</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-leaf-600 px-4 py-2 text-white hover:bg-leaf-700">
        Về trang chủ
      </Link>
    </div>
  );
}
