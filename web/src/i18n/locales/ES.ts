import type { Translations } from './VI';

const ES: Translations = {
  // ─── BottomNav ───────────────────────────────────────────────────────────────
  nav: {
    map: 'Mapa',
    explore: 'Explorar',
    account: 'Cuenta',
    settings: 'Ajustes',
  },

  // ─── Settings Page ───────────────────────────────────────────────────────────
  settings: {
    title: 'Ajustes',
    sectionGeneral: 'GENERAL',
    sectionSupport: 'SOPORTE',
    sectionPartnership: 'ASOCIACIÓN',
    language: 'Idioma',
    discoveryRadius: 'Radio de descubrimiento',
    helpCenter: 'Centro de ayuda',
    aboutApp: 'Acerca de AudioGuide',
    termsOfService: 'Términos de servicio',
    becomeOwner: 'Conviértete en socio',
    becomeOwnerSub: 'Únete a nuestra comunidad de comerciantes',
    logOut: 'Cerrar sesión',
    chooseLanguage: 'Elegir idioma',
    cancel: 'Cancelar',
  },

  // ─── Place Detail ─────────────────────────────────────────────────────────────
  placeDetail: {
    specialties: 'Platos estrella',
    estimatedPrice: 'Precio estimado',
    introduction: 'Acerca de',
    listenAudio: 'Escuchar guía de audio',
    viewOnMap: 'Ver en el mapa',
    distanceAway: (distance: number) => `A ${distance}m`,
    locationLabel: 'Distrito 4 • Vinh Khanh',
  },

  // ─── Profile Page ─────────────────────────────────────────────────────────────
  profile: {
    title: 'Cuenta',
    subtitle: 'Gestiona tu información personal',
    loading: 'Cargando...',
    sectionPersonalInfo: 'Información personal',
    emailLabel: 'Correo electrónico (no se puede cambiar)',
    nameLabel: 'Nombre completo',
    namePlaceholder: 'Ingresa tu nombre',
    saveChanges: 'GUARDAR CAMBIOS',
    sectionSecurity: 'Seguridad',
    currentPasswordLabel: 'Contraseña actual',
    currentPasswordPlaceholder: 'Ingresa la contraseña actual',
    newPasswordLabel: 'Nueva contraseña',
    newPasswordPlaceholder: 'Al menos 8 caracteres',
    confirmPasswordLabel: 'Confirmar nueva contraseña',
    confirmPasswordPlaceholder: 'Reingresa la nueva contraseña',
    changePassword: 'CAMBIAR CONTRASEÑA',
    nameRequired: 'El nombre no puede estar vacío',
    passwordMinLength: 'La nueva contraseña debe tener al menos 8 caracteres',
    passwordMismatch: 'Las contraseñas no coinciden',
    nameUpdated: 'Nombre actualizado correctamente',
    passwordUpdated: 'Contraseña cambiada correctamente',
    updateFailed: 'Error al actualizar',
    passwordChangeFailed: 'Error al cambiar la contraseña, verifica tu contraseña actual',
    errorOccurred: 'Ocurrió un error',
  },

  // ─── Place List ───────────────────────────────────────────────────────────────
  placeList: {
    title: 'Explorar',
    subtitle: 'Una gran variedad de opciones gastronómicas',
    placesCount: (count: number) => `${count} lugares`,
    searchPlaceholder: 'Buscar restaurantes, platos...',
    allCategories: 'Todas las categorías',
    unknownCategory: 'Categoría desconocida',
    readyToGuide: 'Guía de audio lista',
    defaultSpecialties: 'Experiencia culinaria local',
    defaultPrice: 'Precio de comida callejera',
    searchingNearby: 'Buscando restaurantes cercanos...',
  },

  // ─── QR Scanner Modal ────────────────────────────────────────────────────────
  qrScanner: {
    title: 'Escanear código QR',
    subtitle: 'Escanea el código en el restaurante para obtener ofertas',
    startingCamera: 'Iniciando cámara...',
    retry: 'Reintentar',
    chooseFromGallery: 'Elegir de la galería',
    orPointCamera: 'O apunta la cámara a un código QR',
    invalidQr: 'Este código QR no es válido para esta aplicación.',
    cameraError: 'No se puede acceder a la cámara. Por favor, concede permiso.',
    noQrFound: 'No se encontró ningún código QR en esta imagen.',
  },

  // ─── POI Audio Drawer ────────────────────────────────────────────────────────
  audioDrawer: {
    nowNarrating: 'Reproduciendo ahora',
    noImage: 'Sin imagen',
    descriptionLabel: 'Descripción',
    audioGuideLabel: 'Guía de audio',
  },
};

export default ES;