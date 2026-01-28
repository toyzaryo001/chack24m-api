# CHECK24M API

Node.js + Express + TypeScript API สำหรับระบบ CHECK24M

## 🚀 Quick Start

### 1. ติดตั้ง Dependencies

```bash
cd chack24m-api
npm install
```

### 2. ตั้งค่า Environment

```bash
# Copy environment file
cp .env.example .env

# แก้ไข .env ใส่ค่าจาก PHP .env
```

**สำคัญ:** ต้องแก้ไขค่าใน `.env`:
- `DATABASE_URL` - ใช้ค่าเดียวกับ PHP
- `JWT_SECRET` - สร้าง secret ใหม่ (ใช้ random string 64 ตัว)
- `JWT_REFRESH_SECRET` - สร้างอีก secret

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. รัน Development Server

```bash
npm run dev
```

Server จะรันที่ `http://localhost:3001`

## 📁 Project Structure

```
src/
├── config/         # Configuration & database
├── middleware/     # Express middleware
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
└── app.ts          # Main application
```

## 🔗 API Endpoints

### Base
- `GET /api` - API info
- `GET /api/health` - Health check

### Auth (Coming)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Admin Auth (Coming)
- `POST /api/admin/auth/login` - Admin login

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run prisma:migrate` | Run migrations |

## 📝 Notes

- API นี้ทำงานคู่กับ PHP จนกว่าจะ migrate เสร็จ
- ทั้งสองระบบใช้ database เดียวกัน
- ทุก endpoint ใหม่ต้อง test กับ PHP เดิมก่อน switch
