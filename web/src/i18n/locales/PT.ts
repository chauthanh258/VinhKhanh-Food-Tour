import type { Translations } from './VI';

const PT: Translations = {
  // ─── BottomNav ───────────────────────────────────────────────────────────────
  nav: {
    map: 'Mapa',
    explore: 'Explorar',
    account: 'Conta',
    settings: 'Configurações',
  },

  // ─── Settings Page ───────────────────────────────────────────────────────────
  settings: {
    title: 'Configurações',
    sectionGeneral: 'GERAL',
    sectionSupport: 'SUPORTE',
    sectionPartnership: 'PARCERIA',
    language: 'Idioma',
    discoveryRadius: 'Raio de Descoberta',
    helpCenter: 'Centro de Ajuda',
    aboutApp: 'Sobre o AudioGuide',
    termsOfService: 'Termos de Serviço',
    becomeOwner: 'Tornar-se Parceiro',
    becomeOwnerSub: 'Junte-se à nossa comunidade de comerciantes',
    logOut: 'Sair',
    chooseLanguage: 'Escolher Idioma',
    cancel: 'Cancelar',
  },

  // ─── Place Detail ─────────────────────────────────────────────────────────────
  placeDetail: {
    specialties: 'Pratos Especiais',
    estimatedPrice: 'Preço Estimado',
    introduction: 'Sobre',
    listenAudio: 'Ouvir Guia de Áudio',
    viewOnMap: 'Ver no Mapa',
    distanceAway: (distance: number) => `${distance}m de distância`,
    locationLabel: 'Distrito 4 • Vinh Khanh',
  },

  // ─── Profile Page ─────────────────────────────────────────────────────────────
  profile: {
    title: 'Conta',
    subtitle: 'Gerencie suas informações pessoais',
    loading: 'Carregando...',
    sectionPersonalInfo: 'Informações Pessoais',
    emailLabel: 'Email (não pode ser alterado)',
    nameLabel: 'Nome Completo',
    namePlaceholder: 'Digite seu nome',
    saveChanges: 'SALVAR ALTERAÇÕES',
    sectionSecurity: 'Segurança',
    currentPasswordLabel: 'Senha Atual',
    currentPasswordPlaceholder: 'Digite a senha atual',
    newPasswordLabel: 'Nova Senha',
    newPasswordPlaceholder: 'Pelo menos 8 caracteres',
    confirmPasswordLabel: 'Confirmar Nova Senha',
    confirmPasswordPlaceholder: 'Digite novamente a nova senha',
    changePassword: 'ALTERAR SENHA',
    nameRequired: 'O nome não pode estar vazio',
    passwordMinLength: 'A nova senha deve ter pelo menos 8 caracteres',
    passwordMismatch: 'As senhas não coincidem',
    nameUpdated: 'Nome atualizado com sucesso',
    passwordUpdated: 'Senha alterada com sucesso',
    updateFailed: 'Falha ao atualizar',
    passwordChangeFailed: 'Falha ao alterar senha, verifique sua senha atual',
    errorOccurred: 'Ocorreu um erro',
  },

  // ─── Place List ───────────────────────────────────────────────────────────────
  placeList: {
    title: 'Explorar',
    subtitle: 'Uma grande variedade de opções gastronômicas',
    placesCount: (count: number) => `${count} lugares`,
    searchPlaceholder: 'Buscar restaurantes, pratos...',
    allCategories: 'Todas as Categorias',
    unknownCategory: 'Categoria desconhecida',
    readyToGuide: 'Guia de áudio pronto',
    defaultSpecialties: 'Experiência culinária local',
    defaultPrice: 'Preço de comida de rua',
    searchingNearby: 'Procurando restaurantes próximos...',
  },

  // ─── QR Scanner Modal ────────────────────────────────────────────────────────
  qrScanner: {
    title: 'Escanear Código QR',
    subtitle: 'Escaneie o código no restaurante para obter ofertas',
    startingCamera: 'Iniciando câmera...',
    retry: 'Tentar novamente',
    chooseFromGallery: 'Escolher da Galeria',
    orPointCamera: 'Ou aponte a câmera para um código QR',
    invalidQr: 'Este código QR não é válido para este aplicativo.',
    cameraError: 'Não foi possível acessar a câmera. Conceda permissão.',
    noQrFound: 'Nenhum código QR encontrado nesta imagem.',
  },

  // ─── POI Audio Drawer ────────────────────────────────────────────────────────
  audioDrawer: {
    nowNarrating: 'Narrando agora',
    noImage: 'Sem imagem',
    descriptionLabel: 'Descrição',
    audioGuideLabel: 'Guia de Áudio',
  },
};

export default PT;