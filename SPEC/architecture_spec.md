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
   * Mengubah data dari format yang dipahami *Use Cases* ke format yang cocok untuk layer eksternal (misal: NestJS Controllers, WebSockets Gateways).
   * Tempat beradanya *Controllers*, *Gateways*, *Middlewares*, dan *Data Transfer Objects (DTO)*.
4. **Infrastructure (Frameworks & Drivers)**
   * Lapisan terluar yang berisi alat eksternal: NestJS Framework, TypeORM (Database), dan layanan pihak ketiga (OpenAI, Google Auth).

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
│   ├── database/       # Konfigurasi TypeORM DataSource & Entities
│   ├── repositories/   # Implementasi akses database (UserRepository, ChatRepository)
│   └── services/       # Implementasi layanan luar (GoogleOAuthService, AIService)
├── presentation/       # Layer Interface Adapters (NestJS Decorators)
│   ├── controllers/    # NestJS REST Controllers
│   ├── gateways/       # NestJS WebSockets Gateways
│   └── middlewares/    # Guards, Interceptors, Error Filters
├── app.module.ts       # Root Module NestJS (Wiring up layers)
└── main.ts             # Entry point utama (Bootstrap NestJS)
```

## 3. Prinsip Clean Code yang Diterapkan

1. **SOLID Principles**:
   * **S**ingle Responsibility: Satu *class/function* hanya memiliki satu alasan untuk berubah (misal: Controller hanya menangani request, validasi via DTO, dan memanggil Service).
   * **D**ependency Inversion: *Service* bergantung pada *interface repository*, memanfaatkan **Dependency Injection** bawaan NestJS.
2. **Penamaan yang Deskriptif**:
   * Menghindari singkatan membingungkan (gunakan `getUserById` daripada `getUsr`).
   * Penamaan variabel boolean menggunakan *prefix* `is`, `has`, `should` (misal: `isAiGenerated`, `hasPermission`).
3. **Penanganan Error (Error Handling) Terpusat**:
   * Menggunakan `Exceptions Filter` di NestJS agar format response error selalu seragam.
   * Menggunakan *Custom Exceptions* (seperti `NotFoundException`).
4. **Validasi Kuat (Strong Typing & Validation)**:
   * Memanfaatkan **TypeScript** secara maksimal (hindari tipe `any`).
   * Semua input dari User (Body, Query, Params) wajib divalidasi ketat di level Controller menggunakan *library* seperti **Zod** sebelum diproses lebih lanjut oleh Use Cases.
5. **Linting & Formatting**:
   * Menggunakan **ESLint** dan **Prettier** untuk standar format kode otomatis.

---
*Struktur dan prinsip ini akan menjadi fondasi kokoh untuk fitur Real-Time Chat, Google Auth, dan Integrasi AI kita.*
