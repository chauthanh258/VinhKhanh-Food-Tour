import type { Translations } from './VI';

const JA: Translations = {
  // ─── BottomNav ───────────────────────────────────────────────────────────────
  nav: {
    map: '地図',
    explore: '探索',
    account: 'アカウント',
    settings: '設定',
  },

  // ─── Settings Page ───────────────────────────────────────────────────────────
  settings: {
    title: '設定',
    sectionGeneral: '一般',
    sectionSupport: 'サポート',
    sectionPartnership: 'パートナーシップ',
    language: '言語',
    discoveryRadius: '探索半径',
    helpCenter: 'ヘルプセンター',
    aboutApp: 'AudioGuideについて',
    termsOfService: '利用規約',
    becomeOwner: 'パートナーになる',
    becomeOwnerSub: '私たちの加盟店コミュニティに参加',
    logOut: 'ログアウト',
    chooseLanguage: '言語を選択',
    cancel: 'キャンセル',
  },

  // ─── Place Detail ─────────────────────────────────────────────────────────────
  placeDetail: {
    specialties: 'おすすめ料理',
    estimatedPrice: '目安価格',
    introduction: '紹介',
    listenAudio: '音声ガイドを聞く',
    viewOnMap: '地図で見る',
    distanceAway: (distance: number) => `ここから${distance}m`,
    locationLabel: 'District 4 • Vinh Khanh',
  },

  // ─── Profile Page ─────────────────────────────────────────────────────────────
  profile: {
    title: 'アカウント',
    subtitle: '個人情報を管理',
    loading: '読み込み中...',
    sectionPersonalInfo: '個人情報',
    emailLabel: 'メールアドレス（変更不可）',
    nameLabel: '氏名',
    namePlaceholder: '名前を入力',
    saveChanges: '変更を保存',
    sectionSecurity: 'セキュリティ',
    currentPasswordLabel: '現在のパスワード',
    currentPasswordPlaceholder: '現在のパスワードを入力',
    newPasswordLabel: '新しいパスワード',
    newPasswordPlaceholder: '8文字以上',
    confirmPasswordLabel: '新しいパスワードの確認',
    confirmPasswordPlaceholder: 'もう一度入力',
    changePassword: 'パスワードを変更',
    nameRequired: '名前を入力してください',
    passwordMinLength: '新しいパスワードは8文字以上必要です',
    passwordMismatch: 'パスワードが一致しません',
    nameUpdated: '名前を更新しました',
    passwordUpdated: 'パスワードを変更しました',
    updateFailed: '更新に失敗しました',
    passwordChangeFailed: 'パスワード変更に失敗しました。現在のパスワードを確認してください',
    errorOccurred: 'エラーが発生しました',
  },

  // ─── Place List ───────────────────────────────────────────────────────────────
  placeList: {
    title: '探索',
    subtitle: 'さまざまな料理オプション',
    placesCount: (count: number) => `${count}件の場所`,
    searchPlaceholder: 'レストランや料理を検索...',
    allCategories: 'すべてのカテゴリ',
    unknownCategory: '不明なカテゴリ',
    readyToGuide: '音声ガイドの準備完了',
    defaultSpecialties: '地元のグルメ体験',
    defaultPrice: 'ストリートフード価格',
    searchingNearby: '近くのレストランを検索中...',
  },

  // ─── QR Scanner Modal ────────────────────────────────────────────────────────
  qrScanner: {
    title: 'QRコードをスキャン',
    subtitle: 'レストランでコードをスキャンして特典を受け取る',
    startingCamera: 'カメラを起動中...',
    retry: '再試行',
    chooseFromGallery: 'ギャラリーから選択',
    orPointCamera: 'またはカメラをQRコードに向ける',
    invalidQr: 'このQRコードは本アプリでは無効です。',
    cameraError: 'カメラにアクセスできません。権限を許可してください。',
    noQrFound: 'この画像にQRコードが見つかりません。',
  },

  // ─── POI Audio Drawer ────────────────────────────────────────────────────────
  audioDrawer: {
    nowNarrating: '現在解説中',
    noImage: '画像なし',
    descriptionLabel: '説明',
    audioGuideLabel: '音声ガイド',
  },
};

export default JA;