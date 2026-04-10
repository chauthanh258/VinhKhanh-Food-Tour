import type { Translations } from './VI';

const ZH: Translations = {
  // ─── BottomNav ───────────────────────────────────────────────────────────────
  nav: {
    map: '地图',
    explore: '探索',
    account: '账户',
    settings: '设置',
  },

  // ─── Settings Page ───────────────────────────────────────────────────────────
  settings: {
    title: '设置',
    sectionGeneral: '常规',
    sectionSupport: '支持',
    sectionPartnership: '合作伙伴',
    language: '语言',
    discoveryRadius: '发现半径',
    helpCenter: '帮助中心',
    aboutApp: '关于 AudioGuide',
    termsOfService: '服务条款',
    becomeOwner: '成为合作伙伴',
    becomeOwnerSub: '加入我们的商户社区',
    logOut: '退出登录',
    chooseLanguage: '选择语言',
    cancel: '取消',
  },

  // ─── Place Detail ─────────────────────────────────────────────────────────────
  placeDetail: {
    specialties: '招牌菜',
    estimatedPrice: '预计价格',
    introduction: '关于',
    listenAudio: '收听音频导览',
    viewOnMap: '在地图上查看',
    distanceAway: (distance: number) => `${distance}米外`,
    locationLabel: '第四区 • Vinh Khanh',
  },

  // ─── Profile Page ─────────────────────────────────────────────────────────────
  profile: {
    title: '账户',
    subtitle: '管理您的个人信息',
    loading: '加载中...',
    sectionPersonalInfo: '个人信息',
    emailLabel: '邮箱（不可更改）',
    nameLabel: '全名',
    namePlaceholder: '输入您的姓名',
    saveChanges: '保存更改',
    sectionSecurity: '安全',
    currentPasswordLabel: '当前密码',
    currentPasswordPlaceholder: '输入当前密码',
    newPasswordLabel: '新密码',
    newPasswordPlaceholder: '至少8个字符',
    confirmPasswordLabel: '确认新密码',
    confirmPasswordPlaceholder: '重新输入新密码',
    changePassword: '更改密码',
    nameRequired: '姓名不能为空',
    passwordMinLength: '新密码至少需要8个字符',
    passwordMismatch: '两次输入的密码不一致',
    nameUpdated: '姓名更新成功',
    passwordUpdated: '密码更改成功',
    updateFailed: '更新失败',
    passwordChangeFailed: '密码更改失败，请检查当前密码',
    errorOccurred: '发生错误',
  },

  // ─── Place List ───────────────────────────────────────────────────────────────
  placeList: {
    title: '探索',
    subtitle: '各种美食选择',
    placesCount: (count: number) => `${count} 个地点`,
    searchPlaceholder: '搜索餐厅、菜品...',
    allCategories: '所有类别',
    unknownCategory: '未知类别',
    readyToGuide: '音频导览已准备好',
    defaultSpecialties: '当地美食体验',
    defaultPrice: '街头美食价格',
    searchingNearby: '正在搜索附近餐厅...',
  },

  // ─── QR Scanner Modal ────────────────────────────────────────────────────────
  qrScanner: {
    title: '扫描二维码',
    subtitle: '在餐厅扫描二维码以获取优惠',
    startingCamera: '正在启动相机...',
    retry: '重试',
    chooseFromGallery: '从相册选择',
    orPointCamera: '或将相机对准二维码',
    invalidQr: '此二维码在此应用中无效。',
    cameraError: '无法访问相机。请授予权限。',
    noQrFound: '此图片中未找到二维码。',
  },

  // ─── POI Audio Drawer ────────────────────────────────────────────────────────
  audioDrawer: {
    nowNarrating: '正在讲解',
    noImage: '无图片',
    descriptionLabel: '描述',
    audioGuideLabel: '音频导览',
  },
};

export default ZH;