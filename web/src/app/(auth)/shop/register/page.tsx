"use client";

import React, { useState } from "react";
import { ChevronLeft, User, MapPin, Store, Camera, ChevronRight, CheckCircle2, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterShopPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    shopName: "",
    address: "",
    category: "restaurant",
    description: "",
    idFront: null as string | null,
    idBack: null as string | null,
  });

  const nextStep = () => {
    if (step === 3) {
      setStep(4);
      return;
    }
    setStep((s) => s + 1);
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: "idFront" | "idBack") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [side]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] bg-zinc-950 text-white flex flex-col font-sans max-w-lg mx-auto border-x border-zinc-900 relative z-50">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-zinc-900 sticky top-0 bg-zinc-950/90 backdrop-blur-md z-10">
        <button 
          onClick={() => step === 1 ? router.back() : prevStep()}
          className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Đăng ký chủ quán</h1>
      </div>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto pb-32">
        {/* Progress Tracker */}
        {step < 4 && (
          <div className="flex items-center justify-between px-4 mb-2">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                    step >= s ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-zinc-800 text-zinc-500"
                  }`}>
                    {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-bold ${step >= s ? "text-orange-500" : "text-zinc-600"}`}>
                    {s === 1 ? "Cá nhân" : s === 2 ? "Cơ sở" : "Xác minh"}
                  </span>
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-[2px] mx-2 -mt-6 transition-all duration-500 ${step > s ? "bg-orange-500" : "bg-zinc-800"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Step 1: Cá nhân */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex gap-3">
              <div className="mt-0.5"><Info className="w-5 h-5 text-orange-400" /></div>
              <p className="text-sm text-zinc-300">Thông tin này sẽ được dùng để liên hệ và xác minh danh tính người đại diện.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:border-orange-500/50 outline-none transition-colors placeholder:text-zinc-700"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Số điện thoại</label>
                <input 
                  type="tel"
                  placeholder="09xx xxx xxx"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-5 focus:border-orange-500/50 outline-none transition-colors placeholder:text-zinc-700"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email liên hệ</label>
                <input 
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-5 focus:border-orange-500/50 outline-none transition-colors placeholder:text-zinc-700"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Cơ sở */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Tên quán / Cơ sở kinh doanh</label>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="text"
                    placeholder="Bún Bò Huế Chị Bảy"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:border-orange-500/50 outline-none transition-colors placeholder:text-zinc-700"
                    value={formData.shopName}
                    onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Địa chỉ kinh doanh</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                  <textarea 
                    placeholder="Số 123, đường X, phường Y, Quận 4, TP.HCM"
                    rows={3}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:border-orange-500/50 outline-none transition-colors placeholder:text-zinc-700 resize-none"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Loại hình kinh doanh</label>
                <div className="relative">
                  <select 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-5 focus:border-orange-500/50 outline-none transition-colors appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="restaurant">Nhà hàng / Quán ăn</option>
                    <option value="cafe">Cà phê / Trà sữa</option>
                    <option value="streetfood">Thực phẩm đường phố</option>
                    <option value="other">Khác</option>
                  </select>
                  <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 rotate-90" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Mô tả ngắn gọn</label>
                <textarea 
                  placeholder="Chuyên phục vụ các món bún bò truyền thống..."
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-5 focus:border-orange-500/50 outline-none transition-colors placeholder:text-zinc-700 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Xác minh */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold">Xác minh danh tính</h3>
              <p className="text-sm text-zinc-500">Vui lòng tải lên ảnh CCCD hiện tại của bạn</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-2">Mặt trước CCCD</p>
                <label className="block w-full aspect-[1.6/1] bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-[32px] overflow-hidden cursor-pointer hover:border-orange-500/30 transition-all relative group shadow-inner">
                  {formData.idFront ? (
                    <img src={formData.idFront} alt="Mặt trước" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors shadow-lg">
                        <Camera className="w-6 h-6 text-zinc-400" />
                      </div>
                      <span className="text-sm font-semibold text-zinc-500 font-mono tracking-tighter uppercase">Front Side Upload</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "idFront")} />
                </label>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-2">Mặt sau CCCD</p>
                <label className="block w-full aspect-[1.6/1] bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-[32px] overflow-hidden cursor-pointer hover:border-orange-500/30 transition-all relative group shadow-inner">
                  {formData.idBack ? (
                    <img src={formData.idBack} alt="Mặt sau" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors shadow-lg">
                        <Camera className="w-6 h-6 text-zinc-400" />
                      </div>
                      <span className="text-sm font-semibold text-zinc-500 font-mono tracking-tighter uppercase">Back Side Upload</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "idBack")} />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Hoàn tất */}
        {step === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center py-20">
            <div className="w-24 h-24 rounded-[32px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <div className="space-y-3 px-6">
              <h2 className="text-2xl font-bold">Gửi yêu cầu thành công!</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Thông tin của bạn đã được gửi tới hệ thống. Admin sẽ xem xét và phản hồi qua email trong vòng 24-48 giờ làm việc.
              </p>
            </div>

            <button 
              onClick={() => router.push("/settings")}
              className="mt-4 px-10 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl font-bold transition-all active:scale-95 shadow-lg"
            >
              Quay lại Cài đặt
            </button>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      {step < 4 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900 max-w-lg mx-auto z-10">
          <button 
            onClick={nextStep}
            disabled={step === 3 && (!formData.idFront || !formData.idBack)}
            className="w-full h-16 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-lg shadow-xl shadow-orange-500/30"
          >
            {step === 3 ? "Gửi yêu cầu duyệt" : "Tiếp theo"}
            {step < 3 && <ChevronRight className="w-5 h-5 ml-1" />}
          </button>
        </div>
      )}
    </div>
  );
}
