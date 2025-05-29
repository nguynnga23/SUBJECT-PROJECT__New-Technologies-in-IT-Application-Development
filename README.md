# 💬 Chat App Project – New Technologies in IT Application Development

Dự án này được phát triển trong khuôn khổ môn học **Công nghệ mới trong phát triển ứng dụng CNTT**. Ứng dụng chat đa nền tảng hỗ trợ realtime, quản lý người dùng, xác thực OTP và đồng bộ dữ liệu giữa thiết bị di động và trình duyệt.

## 🗂️ Cấu trúc dự án

```
SUBJECT-PROJECT\_\_New-Technologies-in-IT-Application-Development/
│
├── hnnt-chat-mobile/ # Ứng dụng di động React Native (Expo)
├── hnnt-chat-web/ # Ứng dụng Web ReactJS
├── hnnt-chat-server/ # Backend API server (Node.js + Express + Prisma)
└── README.md # File hướng dẫn này

```

## 🚀 Công nghệ sử dụng

### Frontend

- **Mobile App**: React Native (Expo), React Navigation, Axios, Socket.io-client
- **Web App**: ReactJS, React Router, Axios, Socket.io-client

### Backend

- **Node.js**, **Express**
- **Prisma ORM** với **PostgreSQL** hoặc **MySQL**
- **JWT** cho xác thực
- **Redis** cho pub/sub socket
- **AWS S3** cho lưu trữ media
- **Socket.io** cho realtime communication

---

## 🧰 Yêu cầu hệ thống

- Node.js ≥ 18.x
- PostgreSQL / MySQL
- Redis (nếu dùng session hoặc Socket Pub/Sub)
- AWS S3 Bucket (tùy chọn, nếu có upload media)
- Expo Go (ứng dụng trên điện thoại để test mobile)

---

## ⚙️ Hướng dẫn cài đặt

### 1. Cài đặt Backend

```bash
cd hnnt-chat-server
npm install
```

#### Thiết lập biến môi trường

Tạo file `.env` trong `hnnt-chat-server/` dựa theo `.env.sample`. Cập nhật thông tin kết nối DB, JWT secret, Redis, AWS, v.v.

#### Thực thi migration

```bash
npx prisma migrate deploy
```

> ✅ Lệnh này sẽ áp dụng toàn bộ migration SQL đã được tạo sẵn lên cơ sở dữ liệu.

#### Seed dữ liệu mẫu

```bash
npm run seed
```

#### Chạy server

```bash
npm start
```

---

### 2. Cài đặt ứng dụng Mobile (Expo)

```bash
cd hnnt-chat-mobile
npm install
npx expo start
```

> Mở camera quét mã QR để test trên điện thoại với Expo Go.

---

### 3. Cài đặt ứng dụng Web

```bash
cd hnnt-chat-web
npm install
npm start
```

> Truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🌟 Tính năng nổi bật

### 🧑‍💻 Người dùng

- Đăng ký, đăng nhập, xác thực OTP
- Quản lý tài khoản, avatar, trạng thái hoạt động

### 💬 Chat & Tin nhắn

- Chat cá nhân, nhóm
- Gửi/nhận tin nhắn đa phương tiện (ảnh, video, file, audio)
- Ghim, xoá, thu hồi tin nhắn
- Phản ứng tin nhắn (emoji)
- Tìm kiếm tin nhắn theo từ khoá

### 📲 Đồng bộ & Thông báo

- Realtime với Socket.io
- Đồng bộ nhiều thiết bị
- Thông báo đẩy (push notification – nếu triển khai)

---

## 📜 Các lệnh hữu ích

| Lệnh                | Mô tả                                |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Khởi động server backend với Nodemon |
| `npm run migrate`   | Chạy migration cập nhật DB           |
| `npm run seed`      | Thêm dữ liệu mẫu vào DB              |
| `npx prisma studio` | Mở giao diện web quản lý DB          |

---

## 🤝 Đóng góp

Mọi đóng góp, báo lỗi hoặc đề xuất cải tiến đều được hoan nghênh thông qua **Issues** hoặc **Pull Requests**.

---
