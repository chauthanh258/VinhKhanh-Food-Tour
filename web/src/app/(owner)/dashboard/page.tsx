'use client';

export default function OwnerDashboard() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
         <h1 className="text-4xl font-bold tracking-tight">Chào mừng chủ quán!</h1>
         <p className="text-zinc-500 font-medium">Bạn đang quản lý nội dung của quán mình trên VinhKhanh Food Tour.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Lượt xem tuần', value: '1,280', color: 'bg-blue-500' },
          { label: 'Đánh giá mới', value: '+12', color: 'bg-green-500' },
          { label: 'Yêu cầu hỗ trợ', value: '0', color: 'bg-zinc-800' }
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900 overflow-hidden rounded-[2rem] border border-white/5 p-8 relative group hover:border-white/10 transition-colors">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.color className="w-20 h-20 rounded-full" />
             </div>
             <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
             <h3 className="text-4xl font-black mt-2">{stat.value}</h3>
          </div>
        ))}
      </div>
      
      <div className="bg-zinc-900 rounded-[2.5rem] border border-white/5 overflow-hidden">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
           <h4 className="font-bold">Danh sách món ăn hiện tại</h4>
           <button className="text-xs font-bold px-4 py-2 bg-orange-500 rounded-full hover:bg-orange-600 transition-colors">Thêm món mới</button>
        </div>
        <div className="p-12 text-center">
           <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">🍽️</div>
           <p className="text-zinc-500 text-sm italic">Quán chưa cập nhật danh sách món ăn chi tiết.</p>
        </div>
      </div>
    </div>
  );
}
