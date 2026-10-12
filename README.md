# Study Garden

**Đề tài:** Xây dựng hệ thống khuyến khích tự học qua hình thức trò chơi hóa
**Sinh viên:** Nguyễn Thị Ngọc Thương (110123053, DA23TTB) · **GVHD:** ThS. Phạm Thị Trúc Mai

Ứng dụng web giúp người học tự đặt mục tiêu, học theo phiên Pomodoro và theo dõi tiến độ qua thú cưng ảo và khu vườn 3D.

## Công nghệ

| Tầng | Công nghệ |
| --- | --- |
| Front-end | ReactJS (Vite), React Router, Axios, Tailwind CSS |
| Đồ họa 3D | React Three Fiber, @react-three/drei, Three.js |
| Back-end | Node.js, Express (RESTful API), JWT (từ Đợt 2) |
| CSDL | MySQL / MariaDB (XAMPP) |

## Cấu trúc thư mục

```
├── client/                 # ReactJS
│   └── src/
│       ├── api/            # axios + hàm gọi API
│       ├── components/     # UI dùng chung (Layout...)
│       ├── pages/          # các trang
│       └── three/          # GardenScene, Pet, Plant (React Three Fiber)
├── server/                 # Node.js/Express
│   ├── scripts/            # seed-demo.js: tạo tài khoản demo
│   └── src/
│       ├── config/         # env, kết nối MySQL, luật trò chơi hóa
│       ├── routes/  controllers/  middlewares/  utils/
│       └── (Đợt 2+) services/  models/
└── database/               # schema.sql, seed.sql
```

## Cài đặt và chạy (Windows + XAMPP)

Yêu cầu: **Node.js ≥ 20.12**, **XAMPP** (đã Start **MySQL**).

**1. Tạo CSDL**

Mở http://localhost/phpmyadmin → tab **SQL**:
- dán nội dung `database/schema.sql` → **Go** (tạo CSDL `study_garden`, 11 bảng)
- dán tiếp `database/seed.sql` → **Go** (danh mục vật phẩm cửa hàng)

> `schema.sql` xóa và tạo lại CSDL `study_garden` từ đầu, chỉ chạy lại khi muốn làm mới toàn bộ dữ liệu.

**2. Chạy server**

```bash
cd server
copy .env.example .env      # macOS/Linux: cp .env.example .env
npm install
npm run seed:demo           # tạo tài khoản demo (mật khẩu 123456)
npm run dev                 # http://localhost:5000/api
```

Kiểm tra: mở http://localhost:5000/api/health → thấy `"status": "ok"` là đã kết nối CSDL.

**3. Chạy client** (mở terminal thứ hai)

```bash
cd client
npm install
npm run dev                 # http://localhost:5173
```

Trang chủ hiển thị trạng thái API/CSDL và cảnh khu vườn 3D. Có thể đổi giai đoạn và cảm xúc của thú cưng để xem trước.

## Tài khoản demo

| Email | Mật khẩu | Ghi chú |
| --- | --- | --- |
| demo@studygarden.vn | 123456 | Cấp 4, chuỗi 5 ngày, 3 cây trong vườn, 1 mục tiêu |
| sinhvien@studygarden.vn | 123456 | Tài khoản mới, thú cưng còn là trứng |

## Lỗi thường gặp

| Lỗi | Cách xử lý |
| --- | --- |
| `ECONNREFUSED` | XAMPP chưa Start MySQL |
| `ER_BAD_DB_ERROR` | Chưa chạy `database/schema.sql` |
| `ER_ACCESS_DENIED_ERROR` | Sai `DB_USER` / `DB_PASSWORD` trong `server/.env` |
| Trang báo "API server chưa chạy" | Chưa `npm run dev` trong thư mục `server` |

## Tiến độ

- [x] **Đợt 1** (19–25/10/2026): khung dự án, CSDL, kết nối MySQL, cảnh 3D thử
- [ ] **Đợt 2** (09–15/11/2026): đăng ký/đăng nhập JWT, mục tiêu, nhiệm vụ, Pomodoro, XP/xu/cấp độ/chuỗi ngày
- [ ] **Đợt 3** (30/11–06/12/2026): thú cưng và khu vườn 3D theo dữ liệu thật, cửa hàng, kiểm thử lần 1
- [ ] **Đợt 4** (21–27/12/2026): thống kê, bảng xếp hạng, kiểm thử lần 2, hoàn thiện báo cáo
