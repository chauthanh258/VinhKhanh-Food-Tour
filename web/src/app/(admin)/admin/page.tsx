'use client';

export default function AdminDashboard() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
           <h1 className="text-4xl font-black tracking-tighter">HỆ THỐNG QUẢN TRỊ</h1>
           <p className="text-zinc-500 font-medium">Điều hành toàn bộ hệ sinh thái VinhKhanh Food Tour.</p>
        </div>
        <div className="text-[10px] font-bold text-zinc-600 bg-zinc-900 px-4 py-2 rounded-full border border-white/5 uppercase tracking-widest">
           Last Sync: Just Now
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Tổng POIs', value: '45', trend: '+3', color: 'text-purple-500' },
          { label: 'Người dùng', value: '1,200', trend: '+150', color: 'text-blue-500' },
          { label: 'Báo cáo lỗi', value: '2', trend: '-1', color: 'text-red-500' },
          { label: 'Uptime', value: '99.9%', trend: 'Stable', color: 'text-green-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900/40 rounded-3xl border border-white/5 p-8 hover:bg-zinc-900 transition-all group">
             <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest group-hover:text-zinc-400 transition-colors">{stat.label}</p>
             <div className="flex items-baseline gap-3 mt-2">
                <h3 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h3>
                <span className="text-[10px] font-bold text-zinc-500">{stat.trend}</span>
             </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden">
          <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
             <h4 className="font-bold text-zinc-400">Yêu cầu phê duyệt</h4>
             <span className="text-[10px] bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full border border-purple-500/20 font-black">0 PENDING</span>
          </div>
          <div className="p-20 text-center space-y-4">
             <div className="text-4xl grayscale opacity-20">📁</div>
             <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Hệ thống đang ổn định</p>
          </div>
        </div>

        <div className="bg-zinc-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden">
          <div className="px-8 py-6 border-b border-white/5">
             <h4 className="font-bold text-zinc-400">Nhật ký hệ thống</h4>
          </div>
          <div className="p-8 space-y-4">
             {[1, 2, 3].map((_, i) => (
               <div key={i} className="flex items-center gap-4 text-xs">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-zinc-500 font-bold">10:00 AM</span>
                  <p className="text-zinc-400 font-medium">Backup hệ thống hoàn tất thành công.</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
