import type { Translations } from './VI';

const IT: Translations = {
  // ─── BottomNav ───────────────────────────────────────────────────────────────
  nav: {
    map: 'Mappa',
    explore: 'Esplora',
    account: 'Account',
    settings: 'Impostazioni',
  },

  // ─── Settings Page ───────────────────────────────────────────────────────────
  settings: {
    title: 'Impostazioni',
    sectionGeneral: 'GENERALE',
    sectionSupport: 'SUPPORTO',
    sectionPartnership: 'PARTNERSHIP',
    language: 'Lingua',
    discoveryRadius: 'Raggio di scoperta',
    helpCenter: 'Centro assistenza',
    aboutApp: 'Informazioni su AudioGuide',
    termsOfService: 'Termini di servizio',
    becomeOwner: 'Diventa partner',
    becomeOwnerSub: 'Unisciti alla nostra community di esercenti',
    logOut: 'Esci',
    chooseLanguage: 'Scegli lingua',
    cancel: 'Annulla',
  },

  // ─── Place Detail ─────────────────────────────────────────────────────────────
  placeDetail: {
    specialties: 'Piatti signature',
    estimatedPrice: 'Prezzo stimato',
    introduction: 'Informazioni',
    listenAudio: 'Ascolta la guida audio',
    viewOnMap: 'Visualizza sulla mappa',
    distanceAway: (distance: number) => `${distance}m di distanza`,
    locationLabel: 'District 4 • Vinh Khanh',
  },

  // ─── Profile Page ─────────────────────────────────────────────────────────────
  profile: {
    title: 'Account',
    subtitle: 'Gestisci le tue informazioni personali',
    loading: 'Caricamento...',
    sectionPersonalInfo: 'Informazioni personali',
    emailLabel: 'Email (non modificabile)',
    nameLabel: 'Nome completo',
    namePlaceholder: 'Inserisci il tuo nome',
    saveChanges: 'SALVA MODIFICHE',
    sectionSecurity: 'Sicurezza',
    currentPasswordLabel: 'Password attuale',
    currentPasswordPlaceholder: 'Inserisci password attuale',
    newPasswordLabel: 'Nuova password',
    newPasswordPlaceholder: 'Almeno 8 caratteri',
    confirmPasswordLabel: 'Conferma nuova password',
    confirmPasswordPlaceholder: 'Reinserisci nuova password',
    changePassword: 'CAMBI A PASSWORD',
    nameRequired: 'Il nome non può essere vuoto',
    passwordMinLength: 'La nuova password deve avere almeno 8 caratteri',
    passwordMismatch: 'Le password non coincidono',
    nameUpdated: 'Nome aggiornato con successo',
    passwordUpdated: 'Password modificata con successo',
    updateFailed: 'Aggiornamento fallito',
    passwordChangeFailed: 'Cambio password fallito, controlla la password attuale',
    errorOccurred: 'Si è verificato un errore',
  },

  // ─── Place List ───────────────────────────────────────────────────────────────
  placeList: {
    title: 'Esplora',
    subtitle: 'Una vasta gamma di opzioni culinarie',
    placesCount: (count: number) => `${count} locali`,
    searchPlaceholder: 'Cerca ristoranti, piatti...',
    allCategories: 'Tutte le categorie',
    unknownCategory: 'Categoria sconosciuta',
    readyToGuide: 'Guida audio pronta',
    defaultSpecialties: 'Esperienza culinaria locale',
    defaultPrice: 'Prezzo street food',
    searchingNearby: 'Ricerca ristoranti nelle vicinanze...',
  },

  // ─── QR Scanner Modal ────────────────────────────────────────────────────────
  qrScanner: {
    title: 'Scansiona codice QR',
    subtitle: 'Scansiona il codice al ristorante per ricevere offerte',
    startingCamera: 'Avvio fotocamera...',
    retry: 'Riprova',
    chooseFromGallery: 'Scegli dalla galleria',
    orPointCamera: 'O inquadra un codice QR con la fotocamera',
    invalidQr: 'Questo codice QR non è valido per questa app.',
    cameraError: 'Impossibile accedere alla fotocamera. Concedi i permessi.',
    noQrFound: 'Nessun codice QR trovato in questa immagine.',
  },

  // ─── POI Audio Drawer ────────────────────────────────────────────────────────
  audioDrawer: {
    nowNarrating: 'Riproduzione in corso',
    noImage: 'Nessuna immagine',
    descriptionLabel: 'Descrizione',
    audioGuideLabel: 'Guida audio',
  },
};

export default IT;