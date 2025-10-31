# Book Library App

## Nama dan NIM  
- Elfa Noviana Sari
- 123140066 (PAW RB)

---

## Deskripsi Singkat
Book Library App adalah aplikasi berbasis ReactJS yang memungkinkan pengguna mencari, menelusuri, dan mengelola daftar bacaan buku. Aplikasi ini terintegrasi dengan Open Library API sehingga pengguna dapat mencari buku berdasarkan judul, penulis, tahun terbit, atau ISBN. Selain itu, pengguna dapat memfilter buku berdasarkan kategori/subject, melihat detail buku, serta menambah/menghapus buku ke daftar bacaan pribadi yang tersimpan di localStorage. Tampilan aplikasi responsif, modern, dan menggunakan tema warna pink/magenta yang menarik dan mudah digunakan.

---

## Fitur yang Tersedia  
- Form pencarian dengan minimal 4 input berbeda (judul, penulis, tahun, ISBN)
- Tabel data dinamis dengan minimal 5 kolom (cover, judul, penulis, tahun, aksi) yang menampilkan data dari API.  
- Filter dropdown kategori (subject) dengan data yang diambil dari hasil pencarian.  
- Detail buku lengkap dengan cover, deskripsi, dan daftar subject.  
- Reading list yang dapat ditambah dan dihapus, disimpan di localStorage browser.  
- Loading state dan error handling saat fetch data dari API.  

---

## Framework dan Teknologi yang Digunakan  
- ReactJS (Functional Components, Hooks: useState, useEffect)  
- Modern JavaScript (arrow functions, destructuring, template literals, async/await, array methods)  
- CSS Grid dan Flexbox untuk layout responsif  
- Open Library API untuk data buku  
- LocalStorage untuk penyimpanan reading list  
   
---

## Link Deployment
link : https://uts-pemweb-123140066.vercel.app/

---

## Screenshot Aplikasi
![Gambar WhatsApp 2025-10-31 pukul 08 16 24_3b3a7e80](https://github.com/user-attachments/assets/f93c1955-c50b-45fe-9df0-c20863e6fdff) 
keterangan : melakukan pencarian buku berdasarkan judul

![Gambar WhatsApp 2025-10-31 pukul 08 17 42_fbae8797](https://github.com/user-attachments/assets/99798c3f-0b34-423b-84ef-c2204bbda940)
keterangan : fitur dropdown untuk mencari kategori buku lebih spesifik

![Gambar WhatsApp 2025-10-31 pukul 08 17 55_bd500ee0](https://github.com/user-attachments/assets/319208a3-a8e6-4362-992d-64f2c575f313)
keterangan : tampilan setelah mencari buku berdasarkan kategori yang tersedia

![Gambar WhatsApp 2025-10-31 pukul 08 18 10_101586eb](https://github.com/user-attachments/assets/eb08c147-f41f-4780-b794-1c2856ddd3e7)
keterangan : menambah reading list pada buku yang diinginkan dan ada fitur remove buku

![Gambar WhatsApp 2025-10-31 pukul 08 18 30_178bed5e](https://github.com/user-attachments/assets/d619f2e1-5e9c-40f3-a034-4b063aed1de7)
keterangan : detail ketika deskripsi buku di buka

---

## Cara Nenjalankan Aplikasi
1. Dengan link github
   - Unduh seluruh file proyek React ini, termasuk folder src, public, dan file konfigurasi seperti package.json, README.md, dsb dalam ZIP.
   - Buka terminal di folder proyek.
   - Jalankan perintah berikut untuk menginstal semua dependensi:
     ```bash
     cd nama-folder
   - Instal semua dependensi
     ```bash
     npm install
   - Jalankan Aplikasi
     ```bash
     npm start
   - Buka di browser
     ```bash
     http://localhost:3000

