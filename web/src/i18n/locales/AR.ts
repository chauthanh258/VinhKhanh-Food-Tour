import type { Translations } from './VI';

const AR: Translations = {
  // ─── BottomNav ───────────────────────────────────────────────────────────────
  nav: {
    map: 'الخريطة',
    explore: 'استكشاف',
    account: 'الحساب',
    settings: 'الإعدادات',
  },

  // ─── Settings Page ───────────────────────────────────────────────────────────
  settings: {
    title: 'الإعدادات',
    sectionGeneral: 'عام',
    sectionSupport: 'الدعم',
    sectionPartnership: 'الشراكة',
    language: 'اللغة',
    discoveryRadius: 'نطاق الاكتشاف',
    helpCenter: 'مركز المساعدة',
    aboutApp: 'حول AudioGuide',
    termsOfService: 'شروط الخدمة',
    becomeOwner: 'كن شريكًا',
    becomeOwnerSub: 'انضم إلى مجتمع التجار لدينا',
    logOut: 'تسجيل الخروج',
    chooseLanguage: 'اختر اللغة',
    cancel: 'إلغاء',
  },

  // ─── Place Detail ─────────────────────────────────────────────────────────────
  placeDetail: {
    specialties: 'الأطباق المميزة',
    estimatedPrice: 'السعر التقريبي',
    introduction: 'عن المكان',
    listenAudio: 'استمع إلى الدليل الصوتي',
    viewOnMap: 'عرض على الخريطة',
    distanceAway: (distance: number) => `على بعد ${distance} متر`,
    locationLabel: 'المنطقة 4 • Vinh Khanh',
  },

  // ─── Profile Page ─────────────────────────────────────────────────────────────
  profile: {
    title: 'الحساب',
    subtitle: 'إدارة معلوماتك الشخصية',
    loading: 'جاري التحميل...',
    sectionPersonalInfo: 'المعلومات الشخصية',
    emailLabel: 'البريد الإلكتروني (لا يمكن تغييره)',
    nameLabel: 'الاسم الكامل',
    namePlaceholder: 'أدخل اسمك',
    saveChanges: 'حفظ التغييرات',
    sectionSecurity: 'الأمان',
    currentPasswordLabel: 'كلمة المرور الحالية',
    currentPasswordPlaceholder: 'أدخل كلمة المرور الحالية',
    newPasswordLabel: 'كلمة المرور الجديدة',
    newPasswordPlaceholder: '8 أحرف على الأقل',
    confirmPasswordLabel: 'تأكيد كلمة المرور الجديدة',
    confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور الجديدة',
    changePassword: 'تغيير كلمة المرور',
    nameRequired: 'لا يمكن أن يكون الاسم فارغًا',
    passwordMinLength: 'يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل',
    passwordMismatch: 'كلمات المرور غير متطابقة',
    nameUpdated: 'تم تحديث الاسم بنجاح',
    passwordUpdated: 'تم تغيير كلمة المرور بنجاح',
    updateFailed: 'فشل التحديث',
    passwordChangeFailed: 'فشل تغيير كلمة المرور، يرجى التحقق من كلمة المرور الحالية',
    errorOccurred: 'حدث خطأ',
  },

  // ─── Place List ───────────────────────────────────────────────────────────────
  placeList: {
    title: 'استكشاف',
    subtitle: 'مجموعة واسعة من خيارات الطعام',
    placesCount: (count: number) => `${count} مكان`,
    searchPlaceholder: 'ابحث عن مطاعم، أطباق...',
    allCategories: 'جميع الفئات',
    unknownCategory: 'فئة غير معروفة',
    readyToGuide: 'دليل الصوت جاهز',
    defaultSpecialties: 'تجربة الطهي المحلية',
    defaultPrice: 'سعر طعام الشارع',
    searchingNearby: 'جاري البحث عن مطاعم قريبة...',
  },

  // ─── QR Scanner Modal ────────────────────────────────────────────────────────
  qrScanner: {
    title: 'مسح رمز QR',
    subtitle: 'امسح الرمز في المطعم للحصول على العروض',
    startingCamera: 'جاري تشغيل الكاميرا...',
    retry: 'إعادة المحاولة',
    chooseFromGallery: 'اختر من المعرض',
    orPointCamera: 'أو وجه الكاميرا نحو رمز QR',
    invalidQr: 'رمز QR هذا غير صالح لهذا التطبيق.',
    cameraError: 'لا يمكن الوصول إلى الكاميرا. يرجى منح الإذن.',
    noQrFound: 'لم يتم العثور على رمز QR في هذه الصورة.',
  },

  // ─── POI Audio Drawer ────────────────────────────────────────────────────────
  audioDrawer: {
    nowNarrating: 'جاري السرد الآن',
    noImage: 'لا توجد صورة',
    descriptionLabel: 'الوصف',
    audioGuideLabel: 'الدليل الصوتي',
  },
};

export default AR;