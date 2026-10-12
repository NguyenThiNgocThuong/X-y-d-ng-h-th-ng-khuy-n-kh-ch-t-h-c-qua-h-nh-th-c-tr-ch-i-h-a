import ApiError from '../utils/ApiError.js';

// Express 5 tự chuyển lỗi của hàm async vào đây, không cần try/catch trong controller
// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, details: err.details });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Dữ liệu JSON không hợp lệ' });
  }

  console.error(err);
  res.status(500).json({ message: 'Lỗi máy chủ' });
}
