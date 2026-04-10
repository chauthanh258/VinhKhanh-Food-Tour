import type { Translations } from './VI';

const RU: Translations = {
  // ─── BottomNav ───────────────────────────────────────────────────────────────
  nav: {
    map: 'Карта',
    explore: 'Исследовать',
    account: 'Аккаунт',
    settings: 'Настройки',
  },

  // ─── Settings Page ───────────────────────────────────────────────────────────
  settings: {
    title: 'Настройки',
    sectionGeneral: 'ОБЩИЕ',
    sectionSupport: 'ПОДДЕРЖКА',
    sectionPartnership: 'ПАРТНЕРСТВО',
    language: 'Язык',
    discoveryRadius: 'Радиус обнаружения',
    helpCenter: 'Центр помощи',
    aboutApp: 'О AudioGuide',
    termsOfService: 'Условия обслуживания',
    becomeOwner: 'Стать партнером',
    becomeOwnerSub: 'Присоединяйтесь к нашему сообществу merchants',
    logOut: 'Выйти',
    chooseLanguage: 'Выбрать язык',
    cancel: 'Отмена',
  },

  // ─── Place Detail ─────────────────────────────────────────────────────────────
  placeDetail: {
    specialties: 'Фирменные блюда',
    estimatedPrice: 'Примерная цена',
    introduction: 'О месте',
    listenAudio: 'Прослушать аудиогид',
    viewOnMap: 'Посмотреть на карте',
    distanceAway: (distance: number) => `${distance} м`,
    locationLabel: 'Район 4 • Vinh Khanh',
  },

  // ─── Profile Page ─────────────────────────────────────────────────────────────
  profile: {
    title: 'Аккаунт',
    subtitle: 'Управление личной информацией',
    loading: 'Загрузка...',
    sectionPersonalInfo: 'Личная информация',
    emailLabel: 'Email (нельзя изменить)',
    nameLabel: 'Полное имя',
    namePlaceholder: 'Введите ваше имя',
    saveChanges: 'СОХРАНИТЬ ИЗМЕНЕНИЯ',
    sectionSecurity: 'Безопасность',
    currentPasswordLabel: 'Текущий пароль',
    currentPasswordPlaceholder: 'Введите текущий пароль',
    newPasswordLabel: 'Новый пароль',
    newPasswordPlaceholder: 'Не менее 8 символов',
    confirmPasswordLabel: 'Подтвердите новый пароль',
    confirmPasswordPlaceholder: 'Повторите новый пароль',
    changePassword: 'ИЗМЕНИТЬ ПАРОЛЬ',
    nameRequired: 'Имя не может быть пустым',
    passwordMinLength: 'Новый пароль должен содержать не менее 8 символов',
    passwordMismatch: 'Пароли не совпадают',
    nameUpdated: 'Имя успешно обновлено',
    passwordUpdated: 'Пароль успешно изменен',
    updateFailed: 'Ошибка обновления',
    passwordChangeFailed: 'Не удалось изменить пароль, проверьте текущий пароль',
    errorOccurred: 'Произошла ошибка',
  },

  // ─── Place List ───────────────────────────────────────────────────────────────
  placeList: {
    title: 'Исследовать',
    subtitle: 'Широкий выбор блюд',
    placesCount: (count: number) => `${count} мест`,
    searchPlaceholder: 'Поиск ресторанов, блюд...',
    allCategories: 'Все категории',
    unknownCategory: 'Неизвестная категория',
    readyToGuide: 'Аудиогид готов',
    defaultSpecialties: 'Местный кулинарный опыт',
    defaultPrice: 'Цена уличной еды',
    searchingNearby: 'Поиск ближайших ресторанов...',
  },

  // ─── QR Scanner Modal ────────────────────────────────────────────────────────
  qrScanner: {
    title: 'Сканировать QR-код',
    subtitle: 'Отсканируйте код в ресторане, чтобы получить предложения',
    startingCamera: 'Запуск камеры...',
    retry: 'Повторить',
    chooseFromGallery: 'Выбрать из галереи',
    orPointCamera: 'Или направьте камеру на QR-код',
    invalidQr: 'Этот QR-код недействителен для этого приложения.',
    cameraError: 'Не удается получить доступ к камере. Предоставьте разрешение.',
    noQrFound: 'QR-код не найден на этом изображении.',
  },

  // ─── POI Audio Drawer ────────────────────────────────────────────────────────
  audioDrawer: {
    nowNarrating: 'Сейчас озвучивается',
    noImage: 'Нет изображения',
    descriptionLabel: 'Описание',
    audioGuideLabel: 'Аудиогид',
  },
};

export default RU;