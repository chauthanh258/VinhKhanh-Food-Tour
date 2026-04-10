import type { Translations } from './VI';

const HI: Translations = {
  // ─── BottomNav ───────────────────────────────────────────────────────────────
  nav: {
    map: 'मानचित्र',
    explore: 'अन्वेषण करें',
    account: 'खाता',
    settings: 'सेटिंग्स',
  },

  // ─── Settings Page ───────────────────────────────────────────────────────────
  settings: {
    title: 'सेटिंग्स',
    sectionGeneral: 'सामान्य',
    sectionSupport: 'समर्थन',
    sectionPartnership: 'साझेदारी',
    language: 'भाषा',
    discoveryRadius: 'खोज दूरी',
    helpCenter: 'सहायता केंद्र',
    aboutApp: 'AudioGuide के बारे में',
    termsOfService: 'सेवा की शर्तें',
    becomeOwner: 'पार्टनर बनें',
    becomeOwnerSub: 'हमारे व्यापारी समुदाय में शामिल हों',
    logOut: 'लॉग आउट',
    chooseLanguage: 'भाषा चुनें',
    cancel: 'रद्द करें',
  },

  // ─── Place Detail ─────────────────────────────────────────────────────────────
  placeDetail: {
    specialties: 'सिग्नेचर डिशेज',
    estimatedPrice: 'अनुमानित मूल्य',
    introduction: 'के बारे में',
    listenAudio: 'ऑडियो गाइड सुनें',
    viewOnMap: 'मानचित्र पर देखें',
    distanceAway: (distance: number) => `${distance} मीटर दूर`,
    locationLabel: 'District 4 • Vinh Khanh',
  },

  // ─── Profile Page ─────────────────────────────────────────────────────────────
  profile: {
    title: 'खाता',
    subtitle: 'अपनी व्यक्तिगत जानकारी प्रबंधित करें',
    loading: 'लोड हो रहा है...',
    sectionPersonalInfo: 'व्यक्तिगत जानकारी',
    emailLabel: 'ईमेल (बदला नहीं जा सकता)',
    nameLabel: 'पूरा नाम',
    namePlaceholder: 'अपना नाम दर्ज करें',
    saveChanges: 'परिवर्तन सहेजें',
    sectionSecurity: 'सुरक्षा',
    currentPasswordLabel: 'वर्तमान पासवर्ड',
    currentPasswordPlaceholder: 'वर्तमान पासवर्ड दर्ज करें',
    newPasswordLabel: 'नया पासवर्ड',
    newPasswordPlaceholder: 'कम से कम 8 अक्षर',
    confirmPasswordLabel: 'नया पासवर्ड की पुष्टि करें',
    confirmPasswordPlaceholder: 'नया पासवर्ड दोबारा दर्ज करें',
    changePassword: 'पासवर्ड बदलें',
    nameRequired: 'नाम खाली नहीं हो सकता',
    passwordMinLength: 'नया पासवर्ड कम से कम 8 अक्षर का होना चाहिए',
    passwordMismatch: 'पासवर्ड मेल नहीं खाते',
    nameUpdated: 'नाम सफलतापूर्वक अपडेट किया गया',
    passwordUpdated: 'पासवर्ड सफलतापूर्वक बदल दिया गया',
    updateFailed: 'अपडेट विफल',
    passwordChangeFailed: 'पासवर्ड बदलने में विफल, कृपया अपना वर्तमान पासवर्ड जांचें',
    errorOccurred: 'एक त्रुटि हुई',
  },

  // ─── Place List ───────────────────────────────────────────────────────────────
  placeList: {
    title: 'अन्वेषण करें',
    subtitle: 'भोजन के विभिन्न विकल्प',
    placesCount: (count: number) => `${count} स्थान`,
    searchPlaceholder: 'रेस्तरां, व्यंजन खोजें...',
    allCategories: 'सभी श्रेणियां',
    unknownCategory: 'अज्ञात श्रेणी',
    readyToGuide: 'ऑडियो गाइड तैयार है',
    defaultSpecialties: 'स्थानीय पाक अनुभव',
    defaultPrice: 'स्ट्रीट फूड मूल्य',
    searchingNearby: 'आस-पास के रेस्तरां खोज रहे हैं...',
  },

  // ─── QR Scanner Modal ────────────────────────────────────────────────────────
  qrScanner: {
    title: 'QR कोड स्कैन करें',
    subtitle: 'ऑफर प्राप्त करने के लिए रेस्तरां में कोड स्कैन करें',
    startingCamera: 'कैमरा शुरू हो रहा है...',
    retry: 'पुनः प्रयास करें',
    chooseFromGallery: 'गैलरी से चुनें',
    orPointCamera: 'या कैमरा QR कोड पर指向 करें',
    invalidQr: 'यह QR कोड इस ऐप के लिए मान्य नहीं है।',
    cameraError: 'कैमरा एक्सेस नहीं कर सकता। कृपया अनुमति दें।',
    noQrFound: 'इस छवि में कोई QR कोड नहीं मिला।',
  },

  // ─── POI Audio Drawer ────────────────────────────────────────────────────────
  audioDrawer: {
    nowNarrating: 'अभी सुनाया जा रहा है',
    noImage: 'कोई छवि नहीं',
    descriptionLabel: 'विवरण',
    audioGuideLabel: 'ऑडियो गाइड',
  },
};

export default HI;