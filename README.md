Tugas Pertemuan 12 - CRUD Mahasiswa, Prodi, Upload Foto, Search, Filter, Pagination
Struktur
tugas-pertemuan-12/
├── backend-express-crud/
└── frontend-next-express-crud/
1. Setup Database
mysql -u root -p < backend-express-crud/sql/schema.sql
2. Setup Backend
cd backend-express-crud
npm install
cp .env.example .env
Edit .env sesuai kredensial MySQL lokal kalian.

npm run dev
Backend berjalan di http://localhost:3000.

3. Setup Frontend
cd frontend-next-express-crud
npm install
cp .env.local.example .env.local
npm run dev
Frontend berjalan di http://localhost:3001.

4. Akses Aplikasi
Buka http://localhost:3001/mahasiswa di browser.

Endpoint Backend
Method	Endpoint	Keterangan
GET	/api/prodi	Daftar prodi
GET	/api/mahasiswa?search=&prodi_id=&page=&limit=	Daftar mahasiswa dengan search/filter/pagination
GET	/api/mahasiswa/:id	Detail mahasiswa
POST	/api/mahasiswa	Tambah mahasiswa (multipart/form-data, field foto opsional)
PUT	/api/mahasiswa/:id	Update mahasiswa (multipart/form-data, field foto opsional)
DELETE	/api/mahasiswa/:id	Hapus mahasiswa
