import type { Translations } from './VI';

const ID: Translations = {
  // ─── BottomNav ───────────────────────────────────────────────────────────────
  nav: {
    map: 'Peta',
    explore: 'Jelajahi',
    account: 'Akun',
    settings: 'Pengaturan',
  },

  // ─── Settings Page ───────────────────────────────────────────────────────────
  settings: {
    title: 'Pengaturan',
    sectionGeneral: 'UMUM',
    sectionSupport: 'BANTUAN',
    sectionPartnership: 'KEMITRAAN',
    language: 'Bahasa',
    discoveryRadius: 'Radius Penemuan',
    helpCenter: 'Pusat Bantuan',
    aboutApp: 'Tentang AudioGuide',
    termsOfService: 'Syarat dan Ketentuan',
    becomeOwner: 'Menjadi Mitra',
    becomeOwnerSub: 'Bergabung dengan komunitas merchant kami',
    logOut: 'Keluar',
    chooseLanguage: 'Pilih Bahasa',
    cancel: 'Batal',
  },

  // ─── Place Detail ─────────────────────────────────────────────────────────────
  placeDetail: {
    specialties: 'Hidangan Spesial',
    estimatedPrice: 'Perkiraan Harga',
    introduction: 'Tentang',
    listenAudio: 'Dengarkan Panduan Audio',
    viewOnMap: 'Lihat di Peta',
    distanceAway: (distance: number) => `${distance}m dari sini`,
    locationLabel: 'District 4 • Vinh Khanh',
  },

  // ─── Profile Page ─────────────────────────────────────────────────────────────
  profile: {
    title: 'Akun',
    subtitle: 'Kelola informasi pribadi Anda',
    loading: 'Memuat...',
    sectionPersonalInfo: 'Informasi Pribadi',
    emailLabel: 'Email (tidak dapat diubah)',
    nameLabel: 'Nama Lengkap',
    namePlaceholder: 'Masukkan nama Anda',
    saveChanges: 'SIMPAN PERUBAHAN',
    sectionSecurity: 'Keamanan',
    currentPasswordLabel: 'Kata Sandi Saat Ini',
    currentPasswordPlaceholder: 'Masukkan kata sandi saat ini',
    newPasswordLabel: 'Kata Sandi Baru',
    newPasswordPlaceholder: 'Minimal 8 karakter',
    confirmPasswordLabel: 'Konfirmasi Kata Sandi Baru',
    confirmPasswordPlaceholder: 'Masukkan kembali kata sandi baru',
    changePassword: 'UBAH KATA SANDI',
    nameRequired: 'Nama tidak boleh kosong',
    passwordMinLength: 'Kata sandi baru minimal 8 karakter',
    passwordMismatch: 'Kata sandi tidak cocok',
    nameUpdated: 'Nama berhasil diperbarui',
    passwordUpdated: 'Kata sandi berhasil diubah',
    updateFailed: 'Gagal memperbarui',
    passwordChangeFailed: 'Gagal mengubah kata sandi, periksa kata sandi saat ini',
    errorOccurred: 'Terjadi kesalahan',
  },

  // ─── Place List ───────────────────────────────────────────────────────────────
  placeList: {
    title: 'Jelajahi',
    subtitle: 'Berbagai pilihan makanan',
    placesCount: (count: number) => `${count} tempat`,
    searchPlaceholder: 'Cari restoran, hidangan...',
    allCategories: 'Semua Kategori',
    unknownCategory: 'Kategori tidak diketahui',
    readyToGuide: 'Panduan audio siap',
    defaultSpecialties: 'Pengalaman kuliner lokal',
    defaultPrice: 'Harga makanan jalanan',
    searchingNearby: 'Mencari restoran terdekat...',
  },

  // ─── QR Scanner Modal ────────────────────────────────────────────────────────
  qrScanner: {
    title: 'Pindai Kode QR',
    subtitle: 'Pindai kode di restoran untuk mendapatkan penawaran',
    startingCamera: 'Memulai kamera...',
    retry: 'Coba lagi',
    chooseFromGallery: 'Pilih dari Galeri',
    orPointCamera: 'Atau arahkan kamera ke kode QR',
    invalidQr: 'Kode QR ini tidak valid untuk aplikasi ini.',
    cameraError: 'Tidak dapat mengakses kamera. Berikan izin.',
    noQrFound: 'Tidak ditemukan kode QR di gambar ini.',
  },

  // ─── POI Audio Drawer ────────────────────────────────────────────────────────
  audioDrawer: {
    nowNarrating: 'Sedang dibacakan',
    noImage: 'Tidak ada gambar',
    descriptionLabel: 'Deskripsi',
    audioGuideLabel: 'Panduan Audio',
  },
};

export default ID;