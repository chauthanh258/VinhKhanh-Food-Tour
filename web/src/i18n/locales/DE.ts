import type { Translations } from './VI';

const DE: Translations = {
  // ─── BottomNav ───────────────────────────────────────────────────────────────
  nav: {
    map: 'Karte',
    explore: 'Entdecken',
    account: 'Konto',
    settings: 'Einstellungen',
  },

  // ─── Settings Page ───────────────────────────────────────────────────────────
  settings: {
    title: 'Einstellungen',
    sectionGeneral: 'ALLGEMEIN',
    sectionSupport: 'SUPPORT',
    sectionPartnership: 'PARTNERSCHAFT',
    language: 'Sprache',
    discoveryRadius: 'Entdeckungsradius',
    helpCenter: 'Hilfezentrum',
    aboutApp: 'Über AudioGuide',
    termsOfService: 'Nutzungsbedingungen',
    becomeOwner: 'Partner werden',
    becomeOwnerSub: 'Treten Sie unserer Händler-Community bei',
    logOut: 'Abmelden',
    chooseLanguage: 'Sprache wählen',
    cancel: 'Abbrechen',
  },

  // ─── Place Detail ─────────────────────────────────────────────────────────────
  placeDetail: {
    specialties: 'Spezialitäten',
    estimatedPrice: 'Geschätzter Preis',
    introduction: 'Über',
    listenAudio: 'Audio-Guide anhören',
    viewOnMap: 'Auf der Karte ansehen',
    distanceAway: (distance: number) => `${distance}m entfernt`,
    locationLabel: 'District 4 • Vinh Khanh',
  },

  // ─── Profile Page ─────────────────────────────────────────────────────────────
  profile: {
    title: 'Konto',
    subtitle: 'Verwalten Sie Ihre persönlichen Daten',
    loading: 'Wird geladen...',
    sectionPersonalInfo: 'Persönliche Informationen',
    emailLabel: 'E-Mail (kann nicht geändert werden)',
    nameLabel: 'Vollständiger Name',
    namePlaceholder: 'Geben Sie Ihren Namen ein',
    saveChanges: 'ÄNDERUNGEN SPEICHERN',
    sectionSecurity: 'Sicherheit',
    currentPasswordLabel: 'Aktuelles Passwort',
    currentPasswordPlaceholder: 'Aktuelles Passwort eingeben',
    newPasswordLabel: 'Neues Passwort',
    newPasswordPlaceholder: 'Mindestens 8 Zeichen',
    confirmPasswordLabel: 'Neues Passwort bestätigen',
    confirmPasswordPlaceholder: 'Neues Passwort erneut eingeben',
    changePassword: 'PASSWORT ÄNDERN',
    nameRequired: 'Name darf nicht leer sein',
    passwordMinLength: 'Neues Passwort muss mindestens 8 Zeichen lang sein',
    passwordMismatch: 'Passwörter stimmen nicht überein',
    nameUpdated: 'Name erfolgreich aktualisiert',
    passwordUpdated: 'Passwort erfolgreich geändert',
    updateFailed: 'Aktualisierung fehlgeschlagen',
    passwordChangeFailed: 'Passwortänderung fehlgeschlagen, bitte prüfen Sie Ihr aktuelles Passwort',
    errorOccurred: 'Ein Fehler ist aufgetreten',
  },

  // ─── Place List ───────────────────────────────────────────────────────────────
  placeList: {
    title: 'Entdecken',
    subtitle: 'Eine große Auswahl an Speisen',
    placesCount: (count: number) => `${count} Orte`,
    searchPlaceholder: 'Restaurants, Gerichte suchen...',
    allCategories: 'Alle Kategorien',
    unknownCategory: 'Unbekannte Kategorie',
    readyToGuide: 'Audio-Guide bereit',
    defaultSpecialties: 'Lokales kulinarisches Erlebnis',
    defaultPrice: 'Street-Food-Preis',
    searchingNearby: 'Suche nach Restaurants in der Nähe...',
  },

  // ─── QR Scanner Modal ────────────────────────────────────────────────────────
  qrScanner: {
    title: 'QR-Code scannen',
    subtitle: 'Scannen Sie den Code im Restaurant, um Angebote zu erhalten',
    startingCamera: 'Kamera wird gestartet...',
    retry: 'Wiederholen',
    chooseFromGallery: 'Aus Galerie wählen',
    orPointCamera: 'Oder richten Sie die Kamera auf einen QR-Code',
    invalidQr: 'Dieser QR-Code ist für diese App ungültig.',
    cameraError: 'Zugriff auf Kamera nicht möglich. Bitte Berechtigung erteilen.',
    noQrFound: 'Kein QR-Code in diesem Bild gefunden.',
  },

  // ─── POI Audio Drawer ────────────────────────────────────────────────────────
  audioDrawer: {
    nowNarrating: 'Wird gerade vorgelesen',
    noImage: 'Kein Bild',
    descriptionLabel: 'Beschreibung',
    audioGuideLabel: 'Audio-Guide',
  },
};

export default DE;