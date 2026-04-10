import type { Translations } from './VI';

const EN: Translations = {
  // ─── BottomNav ───────────────────────────────────────────────────────────────
  nav: {
    map: 'Map',
    explore: 'Explore',
    account: 'Account',
    settings: 'Settings',
  },

  // ─── Settings Page ───────────────────────────────────────────────────────────
  settings: {
    title: 'Settings',
    sectionGeneral: 'GENERAL',
    sectionSupport: 'SUPPORT',
    sectionPartnership: 'PARTNERSHIP',
    language: 'Language',
    discoveryRadius: 'Discovery Radius',
    helpCenter: 'Help Center',
    aboutApp: 'About AudioGuide',
    termsOfService: 'Terms of Service',
    becomeOwner: 'Become a Partner',
    becomeOwnerSub: 'Join our merchant community',
    logOut: 'Log Out',
    chooseLanguage: 'Choose Language',
    cancel: 'Cancel',
  },

  // ─── Place Detail ─────────────────────────────────────────────────────────────
  placeDetail: {
    specialties: 'Signature Dishes',
    estimatedPrice: 'Estimated Price',
    introduction: 'About',
    listenAudio: 'Listen to Audio Guide',
    viewOnMap: 'View on Map',
    distanceAway: (distance: number) => `${distance}m away`,
    locationLabel: 'District 4 • Vinh Khanh',
  },

  // ─── Profile Page ─────────────────────────────────────────────────────────────
  profile: {
    title: 'Account',
    subtitle: 'Manage your personal information',
    loading: 'Loading...',
    sectionPersonalInfo: 'Personal Information',
    emailLabel: 'Email (Cannot be changed)',
    nameLabel: 'Full Name',
    namePlaceholder: 'Enter your name',
    saveChanges: 'SAVE CHANGES',
    sectionSecurity: 'Security',
    currentPasswordLabel: 'Current Password',
    currentPasswordPlaceholder: 'Enter current password',
    newPasswordLabel: 'New Password',
    newPasswordPlaceholder: 'At least 8 characters',
    confirmPasswordLabel: 'Confirm New Password',
    confirmPasswordPlaceholder: 'Re-enter new password',
    changePassword: 'CHANGE PASSWORD',
    nameRequired: 'Name cannot be empty',
    passwordMinLength: 'New password must be at least 8 characters',
    passwordMismatch: 'Passwords do not match',
    nameUpdated: 'Name updated successfully',
    passwordUpdated: 'Password changed successfully',
    updateFailed: 'Update failed',
    passwordChangeFailed: 'Password change failed, please check your current password',
    errorOccurred: 'An error occurred',
  },

  // ─── Place List ───────────────────────────────────────────────────────────────
  placeList: {
    title: 'Explore',
    subtitle: 'A wide variety of food options',
    placesCount: (count: number) => `${count} places`,
    searchPlaceholder: 'Search restaurants, dishes...',
    allCategories: 'All Categories',
    unknownCategory: 'Unknown category',
    readyToGuide: 'Audio guide ready',
    defaultSpecialties: 'Local culinary experience',
    defaultPrice: 'Street food price',
    searchingNearby: 'Searching nearby restaurants...',
  },

  // ─── QR Scanner Modal ────────────────────────────────────────────────────────
  qrScanner: {
    title: 'Scan QR Code',
    subtitle: 'Scan the code at the restaurant to get offers',
    startingCamera: 'Starting camera...',
    retry: 'Retry',
    chooseFromGallery: 'Choose from Gallery',
    orPointCamera: 'Or point camera at a QR code',
    invalidQr: 'This QR code is not valid for this app.',
    cameraError: 'Cannot access camera. Please grant permission.',
    noQrFound: 'No QR code found in this image.',
  },

  // ─── POI Audio Drawer ────────────────────────────────────────────────────────
  audioDrawer: {
    nowNarrating: 'Now Narrating',
    noImage: 'No image',
    descriptionLabel: 'Description',
    audioGuideLabel: 'Audio Guide',
  },
};

export default EN;
