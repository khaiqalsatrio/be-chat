# Real-Time Chat Backend System

Sistem backend chat *real-time* yang tangguh, modular, dan dirancang untuk melayani skala besar. Proyek ini diimplementasikan menggunakan **Clean Architecture** untuk memastikan *codebase* yang rapi, mudah dites, dan *maintainable*.

## 🚀 Fitur Utama & Lanjutan

- **Real-Time Messaging**: Obrolan personal (1-on-1) dan grup menggunakan WebSockets (Socket.io) dengan latensi rendah.
- **Autentikasi Modern**: Mendukung pendaftaran tradisional (Email/Password via JWT) dan Single Sign-On (**Google Login OAuth 2.0**).
- **Integrasi AI Cerdas**: Memungkinkan komunikasi langsung dengan AI Agent (seperti Meta AI) untuk merangkum obrolan atau *smart replies*.
- **Manajemen Agenda & Jadwal**: Fitur pembuatan jadwal (*event/meeting*) terintegrasi dalam obrolan dengan *reminder* otomatis via *Background Jobs*.
- **Status Obrolan**: *Read receipts* (Delivered/Read), indikator pengetikan (*Typing Indicators*), dan status presensi pengguna (*Online/Offline*).
- **Arsitektur Kuat**: Mengadopsi prinsip *Clean Code* & *SOLID* dengan pemisahan *layer* (Domain, Use Cases, Interface, Infrastructure).

## 🛠️ Tech Stack

Proyek ini menggunakan *stack* standar industri modern untuk backend Node.js:

* **Bahasa**: TypeScript (Node.js)
* **Framework**: Express.js
* **Komunikasi Real-Time**: Socket.io
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Keamanan**: JSON Web Tokens (JWT), bcrypt, Google Auth Library.
* **Task Queue / Background Jobs**: BullMQ (Redis) / node-cron (untuk pengingat agenda).
* **Validasi**: Zod.

## 📂 Struktur Dokumen Perencanaan

Seluruh rencana, spesifikasi teknis, dan rancangan arsitektur didokumentasikan dengan rapi di dalam *repository* ini. Silakan baca dokumen berikut untuk memahami sistem secara mendalam:

1. **Spesifikasi Utama**:
   - [`SPEC/chat_system_spec.md`](SPEC/chat_system_spec.md): Definisi fitur lengkap, model data (entitas), alur WebSocket, dan skalabilitas.
   - [`SPEC/architecture_spec.md`](SPEC/architecture_spec.md): Konsep *Clean Architecture* dan struktur *layering* proyek ini.
2. **Rencana Implementasi (Planners)**:
   - [`planner/auth_plan.md`](planner/auth_plan.md): Alur kerja autentikasi JWT dan Integrasi Google Login.
   - [`planner/chat_plan.md`](planner/chat_plan.md): Alur event WebSocket untuk pesan dan presensi.
   - [`planner/agenda_plan.md`](planner/agenda_plan.md): Konsep dan desain REST API serta sistem *cron/job* untuk Agenda/Jadwal.

## ⚙️ Persiapan Lokal (Environment)

Proyek ini membutuhkan konfigurasi *environment variables*. Sebuah *template* `.env` dasar telah disediakan di root proyek. 
Pastikan Anda memiliki koneksi ke **PostgreSQL** dan mengonfigurasi string koneksi `DATABASE_URL` di dalam file `.env`.

---
*Proyek ini merupakan bagian dari tugas magang. Tahap saat ini adalah penyelesaian dokumentasi spesifikasi dan perencanaan arsitektur sebelum eksekusi inisialisasi kode dimulai.*
