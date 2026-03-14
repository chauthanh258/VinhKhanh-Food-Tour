# Dự Án Seminar Chuyên Đề - Tour Map

Ứng dụng bản đồ du lịch hỗ trợ đa ngôn ngữ, cho phép người dùng tìm kiếm và xem chi tiết các địa điểm du lịch (POI) xung quanh vị trí hiện tại.

## 🚀 Công Nghệ Sử Dụng

### Backend (API)
- **Framework:** Express.js (TypeScript)
- **Database ORM:** Prisma
- **Database:** SQLite
- **Security:** Helmet, CORS, JWT
- **Tools:** Nodemon, ts-node

### Frontend (Web)
- **Framework:** Next.js (React 19)
- **Styling:** Tailwind CSS v4
- **Maps:** Leaflet & React-Leaflet
- **Icons:** Lucide React

---

## 📁 Cấu Trúc Thư Mục

```text
/
├── api/                # Backend source code
│   ├── prisma/         # Prisma schema and migrations
│   │   ├── schema.prisma
│   │   └── dev.db      # SQLite database file
│   ├── src/
│   │   └── index.ts    # Entry point (API routes & server)
│   ├── package.json
│   └── tsconfig.json
├── web/                # Frontend source code
│   ├── public/         # Static assets
│   ├── src/
│   │   ├── app/        # Next.js App Router (Layouts & Pages)
│   │   └── components/ # React components (UI & Map logic)
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## 🛠️ Cài Đặt

### Tiền đề (Prerequisites)
- [Node.js](https://nodejs.org/) (phiên bản LTS)
- [npm](https://www.npmjs.com/)

### Các bước cài đặt

1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Cài đặt dependencies cho Backend:**
   ```bash
   cd api
   npm install
   ```

3. **Thiết lập Database (Prisma):**
   ```bash
   npx prisma generate
   npx prisma db push
   # (Tùy chọn) Chạy seed data nếu có
   npm run seed
   ```

4. **Cài đặt dependencies cho Frontend:**
   ```bash
   cd ../web
   npm install
   ```

---

## 💻 Cách Sử Dụng

Bạn cần chạy đồng thời cả Backend và Frontend để ứng dụng hoạt động đầy đủ.

### Chạy Backend
Trong thư mục `api`:
```bash
npm run dev
```
Server sẽ chạy tại: `http://localhost:3001`

### Chạy Frontend
Trong thư mục `web`:
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: `http://localhost:3000`

---

## 📝 Ghi Chú
- Backend cung cấp các API như `/api/health` và `/api/pois/nearby`.
- Frontend sử dụng Leaflet để hiển thị bản đồ và lấy vị trí GPS của người dùng.
