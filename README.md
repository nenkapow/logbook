# ⛽ Agen Gas Pro

Aplikasi kasir & antrian LPG 3kg berbasis web untuk agen gas. Dibangun sebagai **Progressive Web App (PWA)** — bisa diinstall di HP dan laptop, tanpa perlu App Store maupun Play Store.

---

## Fitur

- **Kasir & Antrian** — tambah pelanggan ke antrian, proses setor satu per satu
- **Copy NIK otomatis** — sekali tap, NIK langsung tercopy ke clipboard untuk paste ke aplikasi GAS
- **Favorit / Bintang** — tandai pelanggan prioritas agar selalu muncul di atas, tanpa sentuh kode
- **Database pelanggan** — tambah, edit, hapus data pelanggan langsung dari app
- **Kuota tracker** — pantau sisa kuota bulanan tiap pelanggan (maks 4x/bulan)
- **Reset mingguan & bulanan** — sesuai jadwal setor Selasa/Sabtu
- **Realtime sync** — antrian langsung terupdate di semua perangkat lewat Firebase
- **Bisa offline** — tetap bisa dibuka meski sinyal jelek
- **Install ke HP/Laptop** — tampil seperti app native, tanpa browser bar

---

## Screenshot

| Kasir | Setor | Database |
|---|---|---|
| Daftar pelanggan + antrian realtime | Copy NIK & konfirmasi setor | Kelola data + tandai favorit |

---

## Cara Deploy ke GitHub Pages

### 1. Buat Repo di GitHub
```
Nama repo bebas, contoh: agen-gas-pro
Visibility: Public (wajib untuk GitHub Pages gratis)
```

### 2. Upload File
Upload **seluruh folder ini** ke repo. Struktur yang dibutuhkan:
```
repo/
├── README.md
├── generatelisensi.html
└── logbook/
    └── index.html   ← aplikasi utama
```

### 3. Aktifkan GitHub Pages
```
Settings → Pages → Source: Deploy from branch
Branch: main → Folder: / (root) → Save
```

### 4. Akses Aplikasi
```
https://username.github.io/nama-repo/logbook/
```

Ganti `username` dengan username GitHub kamu dan `nama-repo` dengan nama repo yang dibuat.

> Install prompt akan muncul otomatis setelah beberapa detik di Chrome/Edge (Android & Desktop). Di iOS Safari: tap tombol Share → "Add to Home Screen".

---

## Cara Generate Kode Lisensi (untuk agen baru)

1. Buka file `generatelisensi.html` di browser
2. Paste Firebase config dari Firebase Console
3. Klik **Generate** → kode lisensi (Base64) otomatis dibuat
4. Kirim kode itu ke pelanggan/agen
5. Pelanggan paste kode di halaman aktivasi app → langsung konek ke database mereka sendiri

---

## Setup Firebase (untuk agen baru)

Tiap agen butuh Firebase project sendiri agar datanya terpisah:

1. Buka [console.firebase.google.com](https://console.firebase.google.com)
2. Buat project baru → aktifkan **Firestore Database**
3. Mode: **Test mode** (atau atur rules sesuai kebutuhan)
4. Aktifkan **Authentication → Anonymous**
5. Salin Firebase config dari Project Settings
6. Gunakan `generatelisensi.html` untuk buat kode lisensi dari config tersebut

### Firestore Rules yang disarankan
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Struktur Data Firestore

**Collection: `pelanggan_gas`**
| Field | Tipe | Keterangan |
|---|---|---|
| `name` | string | Nama pelanggan (uppercase) |
| `nik` | string | Nomor NIK |
| `quota` | number | Jumlah pembelian bulan ini (0–4) |
| `weeklyDone` | boolean | Sudah belanja minggu ini |
| `favorit` | boolean | Ditandai sebagai prioritas |
| `lastTx` | string | Tanggal transaksi terakhir |

**Document: `system/antrian_live`**
| Field | Tipe | Keterangan |
|---|---|---|
| `ids` | array | Daftar ID pelanggan yang sedang antri |

---

## Tech Stack

- **React 18** (via CDN, no build step)
- **Tailwind CSS** (via CDN)
- **Firebase Firestore** (realtime database)
- **Firebase Auth** (anonymous login)
- **PWA** — Web App Manifest + Service Worker

Tidak ada Node.js, tidak ada bundler — cukup 1 file HTML.

---

## Lisensi

Aplikasi ini dikembangkan untuk keperluan komersial. Dilarang mendistribusikan ulang tanpa izin.

© 2025 Agen Gas Pro
