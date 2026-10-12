// Lỗi nghiệp vụ có mã HTTP, ví dụ: throw new ApiError(404, 'Không tìm thấy mục tiêu')
export default class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
