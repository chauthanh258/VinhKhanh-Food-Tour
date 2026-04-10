import type { Translations } from './VI';

const FR: Translations = {
  // ─── BottomNav ───────────────────────────────────────────────────────────────
  nav: {
    map: 'Carte',
    explore: 'Explorer',
    account: 'Compte',
    settings: 'Paramètres',
  },

  // ─── Settings Page ───────────────────────────────────────────────────────────
  settings: {
    title: 'Paramètres',
    sectionGeneral: 'GÉNÉRAL',
    sectionSupport: 'SUPPORT',
    sectionPartnership: 'PARTENARIAT',
    language: 'Langue',
    discoveryRadius: 'Rayon de découverte',
    helpCenter: 'Centre d\'aide',
    aboutApp: 'À propos d\'AudioGuide',
    termsOfService: 'Conditions d\'utilisation',
    becomeOwner: 'Devenir partenaire',
    becomeOwnerSub: 'Rejoignez notre communauté de commerçants',
    logOut: 'Se déconnecter',
    chooseLanguage: 'Choisir la langue',
    cancel: 'Annuler',
  },

  // ─── Place Detail ─────────────────────────────────────────────────────────────
  placeDetail: {
    specialties: 'Plats signatures',
    estimatedPrice: 'Prix estimé',
    introduction: 'À propos',
    listenAudio: 'Écouter le guide audio',
    viewOnMap: 'Voir sur la carte',
    distanceAway: (distance: number) => `À ${distance}m`,
    locationLabel: 'District 4 • Vinh Khanh',
  },

  // ─── Profile Page ─────────────────────────────────────────────────────────────
  profile: {
    title: 'Compte',
    subtitle: 'Gérez vos informations personnelles',
    loading: 'Chargement...',
    sectionPersonalInfo: 'Informations personnelles',
    emailLabel: 'Email (ne peut pas être modifié)',
    nameLabel: 'Nom complet',
    namePlaceholder: 'Entrez votre nom',
    saveChanges: 'ENREGISTRER LES MODIFICATIONS',
    sectionSecurity: 'Sécurité',
    currentPasswordLabel: 'Mot de passe actuel',
    currentPasswordPlaceholder: 'Entrez le mot de passe actuel',
    newPasswordLabel: 'Nouveau mot de passe',
    newPasswordPlaceholder: 'Au moins 8 caractères',
    confirmPasswordLabel: 'Confirmer le nouveau mot de passe',
    confirmPasswordPlaceholder: 'Ré-entrez le nouveau mot de passe',
    changePassword: 'CHANGER LE MOT DE PASSE',
    nameRequired: 'Le nom ne peut pas être vide',
    passwordMinLength: 'Le nouveau mot de passe doit contenir au moins 8 caractères',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    nameUpdated: 'Nom mis à jour avec succès',
    passwordUpdated: 'Mot de passe changé avec succès',
    updateFailed: 'Échec de la mise à jour',
    passwordChangeFailed: 'Échec du changement de mot de passe, vérifiez votre mot de passe actuel',
    errorOccurred: 'Une erreur est survenue',
  },

  // ─── Place List ───────────────────────────────────────────────────────────────
  placeList: {
    title: 'Explorer',
    subtitle: 'Une grande variété d\'options culinaires',
    placesCount: (count: number) => `${count} endroits`,
    searchPlaceholder: 'Rechercher restaurants, plats...',
    allCategories: 'Toutes les catégories',
    unknownCategory: 'Catégorie inconnue',
    readyToGuide: 'Guide audio prêt',
    defaultSpecialties: 'Expérience culinaire locale',
    defaultPrice: 'Prix de la street food',
    searchingNearby: 'Recherche de restaurants à proximité...',
  },

  // ─── QR Scanner Modal ────────────────────────────────────────────────────────
  qrScanner: {
    title: 'Scanner le code QR',
    subtitle: 'Scannez le code au restaurant pour obtenir des offres',
    startingCamera: 'Démarrage de la caméra...',
    retry: 'Réessayer',
    chooseFromGallery: 'Choisir depuis la galerie',
    orPointCamera: 'Ou pointez la caméra sur un code QR',
    invalidQr: 'Ce code QR n\'est pas valide pour cette application.',
    cameraError: 'Impossible d\'accéder à la caméra. Veuillez accorder l\'autorisation.',
    noQrFound: 'Aucun code QR trouvé dans cette image.',
  },

  // ─── POI Audio Drawer ────────────────────────────────────────────────────────
  audioDrawer: {
    nowNarrating: 'Narration en cours',
    noImage: 'Aucune image',
    descriptionLabel: 'Description',
    audioGuideLabel: 'Guide audio',
  },
};

export default FR;