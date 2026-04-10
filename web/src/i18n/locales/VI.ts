const VI = {
  // ─── BottomNav ───────────────────────────────────────────────────────────────
  nav: {
    map: 'Bản đồ',
    explore: 'Khám phá',
    account: 'Tài khoản',
    settings: 'Cài đặt',
  },

  // ─── Settings Page ───────────────────────────────────────────────────────────
  settings: {
    title: 'Cài đặt',
    sectionGeneral: 'CHUNG',
    sectionSupport: 'HỖ TRỢ',
    sectionPartnership: 'ĐỐI TÁC',
    language: 'Ngôn ngữ',
    discoveryRadius: 'Bán kính khám phá',
    helpCenter: 'Trung tâm trợ giúp',
    aboutApp: 'Về AudioGuide',
    termsOfService: 'Điều khoản dịch vụ',
    becomeOwner: 'Trở thành chủ quán',
    becomeOwnerSub: 'Gia nhập cộng đồng bán hàng',
    logOut: 'Đăng xuất',
    chooseLanguage: 'Chọn ngôn ngữ',
    cancel: 'Hủy',
  },

  // ─── Place Detail ─────────────────────────────────────────────────────────────
  placeDetail: {
    specialties: 'Món ăn đặc sắc',
    estimatedPrice: 'Giá ước tính',
    introduction: 'Giới thiệu',
    listenAudio: 'Nghe thuyết minh',
    viewOnMap: 'Xem trên bản đồ',
    distanceAway: (distance: number) => `Cách bạn ${distance}m`,
    locationLabel: 'Quận 4 • Vĩnh Khánh',
  },

  // ─── Profile Page ─────────────────────────────────────────────────────────────
  profile: {
    title: 'Tài Khoản',
    subtitle: 'Quản lý thông tin cá nhân của bạn',
    loading: 'Đang tải...',
    sectionPersonalInfo: 'Thông tin cá nhân',
    emailLabel: 'Email (Không thể đổi)',
    nameLabel: 'Họ và Tên',
    namePlaceholder: 'Nhập tên của bạn',
    saveChanges: 'LƯU THAY ĐỔI',
    sectionSecurity: 'Bảo mật',
    currentPasswordLabel: 'Mật khẩu hiện tại',
    currentPasswordPlaceholder: 'Nhập mật khẩu hiện tại',
    newPasswordLabel: 'Mật khẩu mới',
    newPasswordPlaceholder: 'Ít nhất 8 ký tự',
    confirmPasswordLabel: 'Xác nhận mật khẩu mới',
    confirmPasswordPlaceholder: 'Nhập lại mật khẩu mới',
    changePassword: 'ĐỔI MẬT KHẨU',
    nameRequired: 'Tên không được để trống',
    passwordMinLength: 'Mật khẩu mới tối thiểu 8 ký tự',
    passwordMismatch: 'Mật khẩu xác nhận không khớp',
    nameUpdated: 'Cập nhật tên thành công',
    passwordUpdated: 'Đổi mật khẩu thành công',
    updateFailed: 'Cập nhật thất bại',
    passwordChangeFailed: 'Thay đổi mật khẩu thất bại, kiểm tra lại mật khẩu cũ',
    errorOccurred: 'Đã có lỗi xảy ra',
  },

  // ─── Place List ───────────────────────────────────────────────────────────────
  placeList: {
    title: 'Khám phá',
    subtitle: 'Đa dạng lựa chọn ẩm thực',
    placesCount: (count: number) => `${count} địa điểm`,
    searchPlaceholder: 'Tìm kiếm quán ăn, món ngon...',
    allCategories: 'Tất cả danh mục',
    unknownCategory: 'Danh mục chưa rõ',
    readyToGuide: 'Sẵn sàng thuyết minh',
    defaultSpecialties: 'Trải nghiệm ẩm thực địa phương',
    defaultPrice: 'Giá vỉa hè',
    searchingNearby: 'Đang tìm quán ăn xung quanh...',
  },

  // ─── QR Scanner Modal ────────────────────────────────────────────────────────
  qrScanner: {
    title: 'Quét mã QR',
    subtitle: 'Quét mã tại quán để nhận ưu đãi',
    startingCamera: 'Đang khởi động camera...',
    retry: 'Thử lại',
    chooseFromGallery: 'Chọn từ thư viện',
    orPointCamera: 'Hoặc đưa camera vào mã QR',
    invalidQr: 'Mã QR không hợp lệ cho ứng dụng này.',
    cameraError: 'Không thể truy cập camera. Vui lòng cấp quyền.',
    noQrFound: 'Không tìm thấy mã QR trong hình ảnh này.',
  },

  // ─── POI Audio Drawer ────────────────────────────────────────────────────────
  audioDrawer: {
    nowNarrating: 'Đang thuyết minh',
    noImage: 'Không có ảnh',
    descriptionLabel: 'Mô tả',
    audioGuideLabel: 'Thuyết minh âm thanh',
  },
};

export default VI;
export type Translations = typeof VI;
