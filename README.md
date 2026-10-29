# CV. Amrita Jayasri 🏢✨
### Sistem Informasi Manajemen Pengadaan Barang (SIMPB) & Company Profile

<p align="center">
  <img src="frontend/simpb/src/assets/Logo%20Amrita.png" alt="Logo CV. Amrita Jayasri" width="220" />
</p>

<p align="center">
  <strong>Solusi Layanan Pengadaan Barang Terpadu, Profesional & Terpercaya di Purwokerto, Jawa Tengah</strong>
</p>

<p align="center">
  <!-- Badges -->
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 11" />
  <img src="https://img.shields.io/badge/PHP-8.2-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP 8.2" />
  <img src="https://img.shields.io/badge/PostgreSQL-Render-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 📌 Tentang Projek

**CV. Amrita Jayasri** bergerak di bidang penyediaan barang dan jasa terpadu—meliputi Alat Tulis Kantor (ATK), perlengkapan kebersihan (*cleaning equipment*), katering, kendaraan dinas, serta sarana pertanian di wilayah Banyumas / Purwokerto dan sekitarnya (termasuk kemitraan dengan instansi seperti RSUD Prof. Dr. Margono Soekarjo).

Repositori ini merupakan aplikasi fullstack yang menggabungkan:
1. **Company Profile Landing Page**: Representasi digital profil bisnis perusahaan, portofolio kerja sama, katalog layanan, dan tautan langsung ke WhatsApp.
2. **SIMPB (Sistem Informasi Manajemen Pengadaan Barang)**: Sistem informasi inventaris internal berbasis Single Page Application (SPA) untuk mengelola data stok, vendor/supplier, konsumen, riwayat transaksi barang masuk/keluar, peringatan stok kritis, dan laporan transaksi yang dapat diekspor.

---

## 🚀 Fitur Utama

### 🌐 1. Company Profile Landing Page
* Tampilan modern, responsif, dan interaktif (Tailwind CSS).
* Bagian Hero, Tentang Kami, Cakupan Layanan, dan Portofolio Mitra.
* Integrasi cepat ke *Direct Contact* via WhatsApp.

### 📊 2. Executive Dashboard (SIMPB)
* Kartu metrik ringkas: Total Barang, Total Pemasok, Total Konsumen, Akumulasi Nilai Stok, dan Peringatan Stok Kritis.
* Grafik tren transaksi barang masuk vs barang keluar yang dinamis.
* Filter rentang tanggal fleksibel (*Date Range Picker Modal*).

### 📦 3. Manajemen Inventaris & Data Barang
* Katalog barang lengkap dengan kode referensi unik, kategori, dan satuan.
* Pencarian instan dan penyaringan berdasarkan kategori atau batas stok.
* Unggah foto barang terintegrasi dengan Cloud Storage (**ImgBB API**).
* Status stok otomatis: Aman, Menipis, dan Kritis (*Out of Stock*).

### 🔄 4. Transaksi Barang Masuk & Keluar
* **Barang Masuk**: Pencatatan pengadaan dari pemasok, otomatis mengalkulasi penambahan stok barang.
* **Barang Keluar**: Pencatatan distribusi barang ke konsumen/instansi, validasi stok minimum agar tidak terjadi *minus stock*.
* Riwayat transaksi terperinci dengan dukungan pembatalan/penghapusan data (*rollback* stok otomatis).

### 👥 5. Manajemen Mitra (Pemasok & Konsumen)
* Manajemen data mitra vendor/supplier pengadaan.
* Manajemen data konsumen / dinas / instansi pemesan.

### 🔔 6. Monitoring & Notifikasi Stok Kritis
* Komponen *Notification Bell* yang memantau barang dengan jumlah stok $\le$ stok minimum secara *real-time*.

### 📑 7. Pelaporan & Ekspor Berkas
* Filter laporan transaksi masuk, keluar, dan ringkasan mutasi stok.
* Unduh laporan dalam format **PDF** (berbasis `jsPDF` + `jspdf-autotable`) dan **Excel Spreadsheet** (`xlsx`).

---

## 🛠️ Arsitektur & Teknologi

| Bagian | Teknologi / Library | Keterangan |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Lucide React | SPA Cepat & Ringan, di-deploy di **Vercel** |
| **Backend** | Laravel 11, PHP 8.2, Laravel Sanctum | RESTful API, Stateful Token Auth, di-deploy di **Render** |
| **Database** | PostgreSQL / MySQL | Relasional, auto-migration & seeder |
| **Cloud Media** | ImgBB Cloud API | Penyimpanan foto barang eksternal |
| **DevOps** | Docker, Apache, Nixpacks | Containerized ready untuk deployment PaaS |

---

## 📁 Struktur Direktori

```text
CV.Amrita-Jayasri/
├── backend/                              # Laravel 11 RESTful API
│   ├── app/
│   │   ├── Http/Controllers/             # Controller (Auth, Barang, Transaksi, Laporan, dsb.)
│   │   └── Models/                       # Eloquent Models
│   ├── config/                           # Konfigurasi Laravel (CORS, Sanctum, Database)
│   ├── database/
│   │   ├── migrations/                   # Skema tabel database
│   │   └── seeders/                      # Seeder data pengguna default (AdminSeeder)
│   ├── routes/
│   │   └── api.php                       # Endpoint rute API
│   ├── Dockerfile                        # Konfigurasi container PHP 8.2 + Apache
│   ├── docker-entrypoint.sh              # Skrip inisialisasi container & migrasi otomatis
│   └── nixpacks.toml                     # Konfigurasi builder Nixpacks (opsional)
│
├── frontend/
│   └── simpb/                            # React + Vite Frontend
│       ├── src/
│       │   ├── assets/                   # Aset gambar & logo perusahaan
│       │   ├── components/               # Komponen reusable
│       │   │   ├── modals/               # Modal interaktif (Tambah/Edit, Konfirmasi, Ekspor)
│       │   │   └── NotificationBell.jsx  # Peringatan stok kritis
│       │   ├── pages/                    # Halaman aplikasi (Landing, Dashboard, CRUD, Laporan)
│       │   ├── utils/                    # Helper fungsi utilitas
│       │   ├── App.jsx                   # Root Component & Route Navigator
│       │   └── main.jsx                  # Entrypoint Vite
│       ├── package.json
│       └── vite.config.js
│
├── render.yaml                           # Render Blueprint Infrastructure-as-Code
└── README.md
```

---

## 💻 Panduan Instalasi Lokal (Local Setup)

### 1. Klon Repositori
```bash
git clone https://github.com/mfathirafa/CV.Amrita-Jayasri.git
cd CV.Amrita-Jayasri
```

### 2. Jalankan Backend (Laravel)
```bash
cd backend

# 1. Pasang dependensi PHP
composer install

# 2. Siapkan environment file
cp .env.example .env

# 3. Generate APP_KEY
php artisan key:generate

# 4. Atur kredensial DB pada file .env, lalu jalankan migrasi & seeder
php artisan migrate --seed

# 5. Jalankan server lokal
php artisan serve
# Backend aktif di: http://127.0.0.1:8000
```

### 3. Jalankan Frontend (React Vite)
```bash
cd ../frontend/simpb

# 1. Pasang dependensi NodeJS
npm install

# 2. Siapkan environment file (.env)
# Isi: VITE_API_URL=http://127.0.0.1:8000/api

# 3. Jalankan server development
npm run dev
# Frontend aktif di: http://localhost:5173
```

---

## 🔐 Akun Demo Bawaan (Default Credentials)

Saat database pertama kali di-seed (`AdminSeeder`), akun pengguna default berikut siap digunakan:

| Email | Password | Role / Jabatan |
| :--- | :--- | :--- |
| `admin@amrita.com` | `password123` | **Admin Utama** |
| `backend@amrita.com` | `password123` | Pengembang / Backend |
| `frontend@amrita.com` | `password123` | Staff Gudang |
| `tester@amrita.com` | `password123` | Manager Amrita |

---

## 🌐 Panduan Deployment

### Frontend $\rightarrow$ [Vercel](https://vercel.com)
1. Hubungkan repositori GitHub ke Vercel.
2. Set **Root Directory** ke: `frontend/simpb`.
3. Set **Framework Preset** ke: `Vite`.
4. Tambahkan Environment Variable:
   * `VITE_API_URL` = `https://<URL_BACKEND_RENDER>/api`
5. Klik **Deploy**.

### Backend $\rightarrow$ [Render](https://render.com)
1. Buat **PostgreSQL Database** di Render (catat host, username, database, dan password).
2. Buat **Web Service** baru dari repositori yang sama:
   * **Root Directory**: `backend`
   * **Environment**: `Docker`
   * **Dockerfile Path**: `Dockerfile`
3. Masukkan Environment Variables di Render:
   * `APP_NAME`: `Amrita_Backend`
   * `APP_ENV`: `production`
   * `APP_DEBUG`: `false`
   * `APP_KEY`: `base64:EduUNyHosgmSZ1qEkX9z0+I1yqu8sya091imaAx/rxs=`
   * `APP_URL`: `https://<nama-service-render>.onrender.com`
   * `DB_CONNECTION`: `pgsql`
   * `DB_HOST`: `<Internal-Hostname-Postgres-Render>`
   * `DB_PORT`: `5432`
   * `DB_DATABASE`: `amrita_db`
   * `DB_USERNAME`: `amrita_user`
   * `DB_PASSWORD`: `<Password-Postgres-Render>`
   * `IMGBB_API_KEY`: `71507bd19ac55d50ea2a23beef1fb9b9`
4. Deploy akan otomatis mengeksekusi container, melakukan caching rute, dan menjalankan migrasi database beserta seeder akun.

---

## 👨‍💻 Kontributor & Lisensi

Dikembangkan oleh tim pengembang **CV. Amrita Jayasri**:
* **Muhammad Fathi Rafa** ([@mfathirafa](https://github.com/mfathirafa))
* **Bagus Eduardo** ([@eduardobagus](https://github.com/eduardobagus))

Projek ini berlisensi di bawah [MIT License](backend/LICENSE).
