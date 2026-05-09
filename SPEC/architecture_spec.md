# Spesifikasi Arsitektur & Clean Code

Untuk memastikan sistem backend chat real-time ini mudah di-*maintain*, fleksibel terhadap perubahan teknologi, dan minim *bugs*, kita akan menerapkan prinsip **Clean Architecture** dan **Clean Code**.

## 1. Konsep Clean Architecture
Struktur proyek akan memisahkan *business logic* dari detail implementasi (seperti database, framework, atau UI/API). Kita membaginya menjadi beberapa *layer* (lapisan) dengan aturan dependensi: **layer dalam tidak boleh bergantung pada layer luar**.

### Layering Sistem (Dari dalam ke luar):
1. **Domain (Entities)**
   * Berisi struktur data murni dan aturan bisnis inti (misal: entitas `User`, `Message`, `Room`).
   * *Tidak bergantung pada apapun (termasuk Prisma, Express, dll).*
2. **Use Cases (Services / Application Layer)**
   * Berisi aturan bisnis spesifik aplikasi (misal: *flow* registrasi user, *flow* mengirim pesan, memanggil AI).
   * Berinteraksi dengan *Repository Interfaces*.
3. **Interface Adapters (Controllers & Gateways)**
   * Mengubah data dari format yang dipahami *Use Cases* ke format yang cocok untuk layer eksternal (misal: Express Request/Response, Socket.io Events).
   * Tempat beradanya *Controllers*, *Middlewares*, dan *Data Transfer Objects (DTO)*.
4. **Infrastructure (Frameworks & Drivers)**
   * Lapisan terluar yang berisi alat eksternal: Express.js Server, Socket.io Server, Prisma Client (Database), dan layanan pihak ketiga (OpenAI, Google Auth).

## 2. Gambaran Struktur Folder (Directory Tree)
Penerapan *layer* di atas akan direpresentasikan dalam folder `src/` sebagai berikut:

```text
src/
├── config/             # Konfigurasi environment (ENV, Constants)
├── core/               # Layer Domain & Use Cases
│   ├── entities/       # Model data dasar (interfaces/types TS murni)
│   ├── exceptions/     # Custom error classes (AppError, ValidationError)
│   └── usecases/       # Business logic murni (AuthService, ChatService)
├── infrastructure/     # Layer Infrastruktur (Database, External API)
│   ├── database/       # Konfigurasi Prisma Client & Schema
│   ├── repositories/   # Implementasi akses database (UserRepository, ChatRepository)
│   └── services/       # Implementasi layanan luar (GoogleOAuthService, AIService)
├── presentation/       # Layer Interface Adapters
│   ├── controllers/    # Express REST Controllers & Socket Handlers
│   ├── middlewares/    # Auth middleware, Error Handler
│   └── routes/         # Definisi routing Express.js
├── app.ts              # Setup awal Express dan middleware global
└── server.ts           # Entry point utama (HTTP & Socket.io Server listen)
```

## 3. Prinsip Clean Code yang Diterapkan

1. **SOLID Principles**:
   * **S**ingle Responsibility: Satu *class/function* hanya memiliki satu alasan untuk berubah (misal: Controller hanya menangani request HTTP, validasi, dan memanggil Service; tidak melakukan query DB langsung).
   * **D**ependency Inversion: *Service* bergantung pada *interface repository*, bukan implementasi database langsung.
2. **Penamaan yang Deskriptif**:
   * Menghindari singkatan membingungkan (gunakan `getUserById` daripada `getUsr`).
   * Penamaan variabel boolean menggunakan *prefix* `is`, `has`, `should` (misal: `isAiGenerated`, `hasPermission`).
3. **Penanganan Error (Error Handling) Terpusat**:
   * Tidak melempar error string polos, melainkan menggunakan `Custom Error Classes` (seperti `NotFoundError`, `UnauthorizedError`).
   * Menggunakan *Global Error Handler Middleware* di Express agar format response error selalu seragam dan rapi.
4. **Validasi Kuat (Strong Typing & Validation)**:
   * Memanfaatkan **TypeScript** secara maksimal (hindari tipe `any`).
   * Semua input dari User (Body, Query, Params) wajib divalidasi ketat di level Controller menggunakan *library* seperti **Zod** sebelum diproses lebih lanjut oleh Use Cases.
5. **Linting & Formatting**:
   * Menggunakan **ESLint** dan **Prettier** untuk standar format kode otomatis.

---
*Struktur dan prinsip ini akan menjadi fondasi kokoh untuk fitur Real-Time Chat, Google Auth, dan Integrasi AI kita.*
