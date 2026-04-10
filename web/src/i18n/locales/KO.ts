import type { Translations } from './VI';

const KO: Translations = {
  // ─── BottomNav ───────────────────────────────────────────────────────────────
  nav: {
    map: '지도',
    explore: '탐색',
    account: '계정',
    settings: '설정',
  },

  // ─── Settings Page ───────────────────────────────────────────────────────────
  settings: {
    title: '설정',
    sectionGeneral: '일반',
    sectionSupport: '지원',
    sectionPartnership: '파트너십',
    language: '언어',
    discoveryRadius: '발견 반경',
    helpCenter: '도움말 센터',
    aboutApp: 'AudioGuide 소개',
    termsOfService: '이용약관',
    becomeOwner: '파트너 되기',
    becomeOwnerSub: '우리 가맹점 커뮤니티에 참여하세요',
    logOut: '로그아웃',
    chooseLanguage: '언어 선택',
    cancel: '취소',
  },

  // ─── Place Detail ─────────────────────────────────────────────────────────────
  placeDetail: {
    specialties: '시그니처 메뉴',
    estimatedPrice: '예상 가격',
    introduction: '소개',
    listenAudio: '오디오 가이드 듣기',
    viewOnMap: '지도에서 보기',
    distanceAway: (distance: number) => `여기서 ${distance}m`,
    locationLabel: 'District 4 • Vinh Khanh',
  },

  // ─── Profile Page ─────────────────────────────────────────────────────────────
  profile: {
    title: '계정',
    subtitle: '개인 정보를 관리하세요',
    loading: '로딩 중...',
    sectionPersonalInfo: '개인 정보',
    emailLabel: '이메일 (변경 불가)',
    nameLabel: '이름',
    namePlaceholder: '이름을 입력하세요',
    saveChanges: '변경 사항 저장',
    sectionSecurity: '보안',
    currentPasswordLabel: '현재 비밀번호',
    currentPasswordPlaceholder: '현재 비밀번호 입력',
    newPasswordLabel: '새 비밀번호',
    newPasswordPlaceholder: '최소 8자 이상',
    confirmPasswordLabel: '새 비밀번호 확인',
    confirmPasswordPlaceholder: '새 비밀번호 다시 입력',
    changePassword: '비밀번호 변경',
    nameRequired: '이름은 비워둘 수 없습니다',
    passwordMinLength: '새 비밀번호는 최소 8자 이상이어야 합니다',
    passwordMismatch: '비밀번호가 일치하지 않습니다',
    nameUpdated: '이름이 성공적으로 업데이트되었습니다',
    passwordUpdated: '비밀번호가 성공적으로 변경되었습니다',
    updateFailed: '업데이트 실패',
    passwordChangeFailed: '비밀번호 변경 실패, 현재 비밀번호를 확인해주세요',
    errorOccurred: '오류가 발생했습니다',
  },

  // ─── Place List ───────────────────────────────────────────────────────────────
  placeList: {
    title: '탐색',
    subtitle: '다양한 음식 옵션',
    placesCount: (count: number) => `${count}곳`,
    searchPlaceholder: '레스토랑, 음식 검색...',
    allCategories: '모든 카테고리',
    unknownCategory: '알 수 없는 카테고리',
    readyToGuide: '오디오 가이드 준비 완료',
    defaultSpecialties: '현지 미식 경험',
    defaultPrice: '스트리트 푸드 가격',
    searchingNearby: '근처 레스토랑 검색 중...',
  },

  // ─── QR Scanner Modal ────────────────────────────────────────────────────────
  qrScanner: {
    title: 'QR 코드 스캔',
    subtitle: '레스토랑에서 코드를 스캔하여 혜택 받기',
    startingCamera: '카메라 시작 중...',
    retry: '다시 시도',
    chooseFromGallery: '갤러리에서 선택',
    orPointCamera: '또는 카메라를 QR 코드에 비추세요',
    invalidQr: '이 QR 코드는 해당 앱에서 유효하지 않습니다.',
    cameraError: '카메라에 접근할 수 없습니다. 권한을 허용해주세요.',
    noQrFound: '이 이미지에서 QR 코드를 찾을 수 없습니다.',
  },

  // ─── POI Audio Drawer ────────────────────────────────────────────────────────
  audioDrawer: {
    nowNarrating: '현재 안내 중',
    noImage: '이미지 없음',
    descriptionLabel: '설명',
    audioGuideLabel: '오디오 가이드',
  },
};

export default KO;