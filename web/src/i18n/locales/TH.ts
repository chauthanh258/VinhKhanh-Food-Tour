import type { Translations } from './VI';

const TH: Translations = {
  // ─── BottomNav ───────────────────────────────────────────────────────────────
  nav: {
    map: 'แผนที่',
    explore: 'สำรวจ',
    account: 'บัญชี',
    settings: 'การตั้งค่า',
  },

  // ─── Settings Page ───────────────────────────────────────────────────────────
  settings: {
    title: 'การตั้งค่า',
    sectionGeneral: 'ทั่วไป',
    sectionSupport: 'ช่วยเหลือ',
    sectionPartnership: 'พันธมิตร',
    language: 'ภาษา',
    discoveryRadius: 'รัศมีค้นพบ',
    helpCenter: 'ศูนย์ช่วยเหลือ',
    aboutApp: 'เกี่ยวกับ AudioGuide',
    termsOfService: 'ข้อกำหนดการให้บริการ',
    becomeOwner: 'เป็นพันธมิตร',
    becomeOwnerSub: 'เข้าร่วมชุมชนร้านค้าของเรา',
    logOut: 'ออกจากระบบ',
    chooseLanguage: 'เลือกภาษา',
    cancel: 'ยกเลิก',
  },

  // ─── Place Detail ─────────────────────────────────────────────────────────────
  placeDetail: {
    specialties: 'เมนูเด่น',
    estimatedPrice: 'ราคาประมาณ',
    introduction: 'เกี่ยวกับ',
    listenAudio: 'ฟังไกด์เสียง',
    viewOnMap: 'ดูบนแผนที่',
    distanceAway: (distance: number) => `ห่างออกไป ${distance} เมตร`,
    locationLabel: 'District 4 • Vinh Khanh',
  },

  // ─── Profile Page ─────────────────────────────────────────────────────────────
  profile: {
    title: 'บัญชี',
    subtitle: 'จัดการข้อมูลส่วนบุคคลของคุณ',
    loading: 'กำลังโหลด...',
    sectionPersonalInfo: 'ข้อมูลส่วนบุคคล',
    emailLabel: 'อีเมล (ไม่สามารถเปลี่ยนได้)',
    nameLabel: 'ชื่อ-นามสกุล',
    namePlaceholder: 'กรอกชื่อของคุณ',
    saveChanges: 'บันทึกการเปลี่ยนแปลง',
    sectionSecurity: 'ความปลอดภัย',
    currentPasswordLabel: 'รหัสผ่านปัจจุบัน',
    currentPasswordPlaceholder: 'กรอกรหัสผ่านปัจจุบัน',
    newPasswordLabel: 'รหัสผ่านใหม่',
    newPasswordPlaceholder: 'อย่างน้อย 8 ตัวอักษร',
    confirmPasswordLabel: 'ยืนยันรหัสผ่านใหม่',
    confirmPasswordPlaceholder: 'กรอกรหัสผ่านใหม่อีกครั้ง',
    changePassword: 'เปลี่ยนรหัสผ่าน',
    nameRequired: 'ชื่อไม่สามารถเว้นว่างได้',
    passwordMinLength: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร',
    passwordMismatch: 'รหัสผ่านไม่ตรงกัน',
    nameUpdated: 'อัปเดตชื่อสำเร็จ',
    passwordUpdated: 'เปลี่ยนรหัสผ่านสำเร็จ',
    updateFailed: 'อัปเดตไม่สำเร็จ',
    passwordChangeFailed: 'เปลี่ยนรหัสผ่านไม่สำเร็จ โปรดตรวจสอบรหัสผ่านปัจจุบัน',
    errorOccurred: 'เกิดข้อผิดพลาด',
  },

  // ─── Place List ───────────────────────────────────────────────────────────────
  placeList: {
    title: 'สำรวจ',
    subtitle: 'ตัวเลือกอาหารหลากหลาย',
    placesCount: (count: number) => `${count} แห่ง`,
    searchPlaceholder: 'ค้นหาร้านอาหาร เมนูอาหาร...',
    allCategories: 'ทุกหมวดหมู่',
    unknownCategory: 'หมวดหมู่ไม่ทราบ',
    readyToGuide: 'ไกด์เสียงพร้อมใช้งาน',
    defaultSpecialties: 'ประสบการณ์อาหารท้องถิ่น',
    defaultPrice: 'ราคาอาหารข้างทาง',
    searchingNearby: 'กำลังค้นหาร้านอาหารใกล้เคียง...',
  },

  // ─── QR Scanner Modal ────────────────────────────────────────────────────────
  qrScanner: {
    title: 'สแกน QR Code',
    subtitle: 'สแกนโค้ดที่ร้านอาหารเพื่อรับข้อเสนอ',
    startingCamera: 'กำลังเปิดกล้อง...',
    retry: 'ลองใหม่',
    chooseFromGallery: 'เลือกจากแกลเลอรี',
    orPointCamera: 'หรือเล็งกล้องไปที่ QR Code',
    invalidQr: 'QR Code นี้ไม่ถูกต้องสำหรับแอปนี้',
    cameraError: 'ไม่สามารถเข้าถึงกล้องได้ โปรดอนุญาตสิทธิ์',
    noQrFound: 'ไม่พบ QR Code ในภาพนี้',
  },

  // ─── POI Audio Drawer ────────────────────────────────────────────────────────
  audioDrawer: {
    nowNarrating: 'กำลังบรรยาย',
    noImage: 'ไม่มีรูปภาพ',
    descriptionLabel: 'คำอธิบาย',
    audioGuideLabel: 'ไกด์เสียง',
  },
};

export default TH;